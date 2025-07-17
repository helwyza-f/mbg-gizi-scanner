import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const formData = await req.formData();

  const file = formData.get("file") as Blob | null;
  const description = formData.get("description") as string;
 

  if (!file ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload ke Supabase Storage
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
    const { error: uploadError } = await supabase.storage
      .from("meals")
      .upload(fileName, buffer, {
        contentType: "image/png",
      });

    if (uploadError) throw new Error(uploadError.message);

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/meals/${fileName}`;

    // Analisa Gambar pakai Gemini
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const base64Data = buffer.toString("base64");
    const prompt = `Analisis gambar makanan dengan deskripsi "${description}" jika ada deskripsi dan kembalikan hasil dalam format JSON TANPA TEKS TAMBAHAN berikut:
{
  "calories": jumlah_kalori,
  "protein": jumlah_protein_dalam_gram,
  "fat": jumlah_lemak_dalam_gram,
  "carbs": jumlah_karbohidrat_dalam_gram,
  "fiber": jumlah_serat_dalam_gram,
  "water": kandungan_air_dalam_gram,
  "vitamins": {
    "vitaminA": nilai_mg_atau_µg,
    "vitaminC": nilai_mg,
    "vitaminD": nilai_IU_atau_µg
  },
  "minerals": {
    "iron": nilai_mg,
    "calcium": nilai_mg,
    "magnesium": nilai_mg
  },
  "deskripsi": "deskripsi_singkat_maks_12_kata"
}`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "image/png" } },
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanedText);

    const {
      calories,
      protein,
      fat,
      carbs,
      fiber,
      water,
      vitamins,
      minerals,
      deskripsi,
    } = parsed;

    // Simpan ke database
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    const { error: dbError } = await supabase.from("meals").insert([
      {
        user_id: userId,
        image_url: imageUrl,
        description: deskripsi,
        calories,
        protein,
        fat,
        carbs,
        fiber,
        water,
        vitamin_a: vitamins?.vitaminA,
        vitamin_c: vitamins?.vitaminC,
        vitamin_d: vitamins?.vitaminD,
        iron: minerals?.iron,
        calcium: minerals?.calcium,
        magnesium: minerals?.magnesium,
      },
    ]);

    if (dbError) throw new Error(dbError.message);

    return NextResponse.json(
      { success: true, imageUrl, result: parsed },
      { status: 200 }
    );
  } catch (error) {
    console.error("Analyze Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

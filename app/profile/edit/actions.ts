"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import sharp from "sharp"; // optional: untuk compress gambar

type Props = {
  userId: string;
  firstName: string;
  lastName: string;
  file: File | null;
};

export async function updateProfile({ userId, firstName, lastName, file }: Props) {
  const supabase = await createClient();
  let avatar_url = null;

  if (file) {
    const ext = file.name.split(".").pop();
    const filePath = `avatars/${userId}.${ext}`;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      console.error("Upload error", error.message);
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    avatar_url = publicUrl?.publicUrl;
  }

  await supabase.from("profiles").update({
    first_name: firstName,
    last_name: lastName,
    ...(avatar_url && { avatar_url }),
  }).eq("id", userId);

  revalidatePath("/profile");
}

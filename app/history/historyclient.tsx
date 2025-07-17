// app/history/HistoryClient.tsx

"use client";

import Image from "next/image";
import { format } from "date-fns";

type Meal = {
  id: string;
  image_url: string;
  description: string | null;
  calories: number | null;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
  fiber: number | null;
  water: number | null;
  vitamin_a: number | null;
  vitamin_c: number | null;
  vitamin_d: number | null;
  iron: number | null;
  calcium: number | null;
  magnesium: number | null;
  created_at: string;
};

export default function HistoryClient({ meals }: { meals: Meal[] }) {
  if (!meals.length) {
    return <p className="text-center text-gray-500">Belum ada riwayat makanan.</p>;
  }

  return (
    <div className="space-y-6">
      {meals.map((meal) => (
        <div
          key={meal.id}
          className="rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col md:flex-row gap-4"
        >
          <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden">
            <Image
              src={meal.image_url}
              alt={meal.description ?? "Foto makanan"}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-sm text-gray-500">
              {format(new Date(meal.created_at), "dd MMMM yyyy, HH:mm")}
            </div>
            <h2 className="text-lg font-semibold">{meal.description ?? "Tanpa deskripsi"}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
              <p>Kalori: {meal.calories ?? "–"} kcal</p>
              <p>Protein: {meal.protein ?? "–"} g</p>
              <p>Lemak: {meal.fat ?? "–"} g</p>
              <p>Karbohidrat: {meal.carbs ?? "–"} g</p>
              <p>Serat: {meal.fiber ?? "–"} g</p>
              <p>Air: {meal.water ?? "–"} ml</p>
              <p>Vit A: {meal.vitamin_a ?? "–"} µg</p>
              <p>Vit C: {meal.vitamin_c ?? "–"} mg</p>
              <p>Vit D: {meal.vitamin_d ?? "–"} IU</p>
              <p>Besi: {meal.iron ?? "–"} mg</p>
              <p>Kalsium: {meal.calcium ?? "–"} mg</p>
              <p>Magnesium: {meal.magnesium ?? "–"} mg</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import HistoryClient from "./historyclient";

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return <div className="p-4 text-red-500">Kamu belum login.</div>;
  }

  const { data: meals, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching meals:", error.message);
    return <div className="p-4 text-red-500">Gagal memuat riwayat makanan.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Riwayat Makanan Bergizi</h1>
      <HistoryClient meals={meals || []} />
    </div>
  );
}

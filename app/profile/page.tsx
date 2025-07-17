// app/profile/page.tsx

import { createClient } from "@/lib/supabase/server";
import ProfileClient from "./profileClient";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-4 text-red-500">Kamu belum login.</div>;
  }

  const { data: profile, error } = await supabase
  .from("profiles")
  .select("first_name, last_name, avatar_url")
  .eq("id", user.id)
  .single();


  if (error) {
    console.error("Error fetching profile:", error.message);
    return <div className="p-4 text-red-500">Gagal memuat profil.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profil Saya</h1>
      <ProfileClient profile={profile} />
    </div>
  );
}

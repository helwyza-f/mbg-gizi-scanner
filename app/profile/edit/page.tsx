import { createClient } from "@/lib/supabase/server";

import ProfileEditForm from "./profile-edit-form";

export default async function EditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <div className="text-center p-6">Silakan login dulu.</div>;

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_url")
    .eq("id", user.id)
    .single();
    if (!profile) {
      return <div className="text-center p-6">Profil tidak ditemukan.</div>;
    }
  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profil</h1>
      <ProfileEditForm userId={user.id} profile={profile} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { updateProfile } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Profile ={
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
}
type Props = {
  userId: string;
  profile: Profile 
};

export default function ProfileEditForm({ userId, profile }: Props) {
  const [firstName, setFirstName] = useState(profile.first_name ?? "");
  const [lastName, setLastName] = useState(profile.last_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [file, setFile] = useState<File | null>(null);
const router = useRouter()
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const preview = URL.createObjectURL(f);
      setAvatarUrl(preview);
    }
  };

  const handleSubmit = async () => {
    await updateProfile({ userId, firstName, lastName, file });
    toast.success("Profil berhasil diperbarui!");
    router.push('/profile')
  };

  return (
    <Card>
      <CardContent className="space-y-4 py-6">
        <div className="flex flex-col items-center">
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt="Preview"
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
          )}
          <Input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="space-y-2">
          <Label>Nama Depan</Label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Nama Belakang</Label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Simpan
        </Button>
      </CardContent>
    </Card>
  );
}

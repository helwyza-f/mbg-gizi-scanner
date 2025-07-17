"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type ProfileProps = {
  profile: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
};

export default function ProfileClient({ profile }: ProfileProps) {
  const router = useRouter();

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center gap-3">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt="Foto Profil"
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-[100px] h-[100px] rounded-full bg-muted flex items-center justify-center">
            <UserCircle className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold">
            {profile.first_name ?? "-"} {profile.last_name ?? ""}
          </h2>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Nama Depan:</span>{" "}
          {profile.first_name ?? "-"}
        </div>
        <div>
          <span className="font-medium">Nama Belakang:</span>{" "}
          {profile.last_name ?? "-"}
        </div>

        <Button
          onClick={() => router.push("/profile/edit")}
          className="w-full mt-4"
        >
          Edit Profil
        </Button>
      </CardContent>
    </Card>
  );
}

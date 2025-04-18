"use client";

import AccessDeny from "@/components/AccessDeny";
import Cookies from "js-cookie";
import { ROUTES } from "@/lib/routes";
import RawDataDownload from "@/components/rawdata/RawDataDownload";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RawDataPage() {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const cookieId = Cookies.get("id");
    const cookieRole = Cookies.get("role");
    setId(cookieId || null);
    setRole(cookieRole || null);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!id || id === "undefined")) {
      router.push(ROUTES.LOGIN);
    }
  }, [mounted, id, router]);

  if (!mounted) return null;

  if (role !== "Escalator") {
    return <AccessDeny />;
  }

  return (
    <main className="min-h-screen justify-center overflow-x-hidden">
      <div>
        <p className="text-4xl ">RawData 조회</p>
      </div>
      <div className="container mx-auto py-10">
        {id && <RawDataDownload id={id} />}
      </div>
    </main>
  );
}

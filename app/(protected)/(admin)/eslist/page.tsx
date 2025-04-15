import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ROUTES } from "@/lib/routes";
import { supabase } from "@/lib/supabase";
import LogoutDropdown from "@/components/login/LogoutDropdown";
import AccessDeny from "@/components/AccessDeny";
import EsListTable from "@/components/EsListTable";
import Image from "next/image";

export const metadata = {
  title: "Escalator List",
};

export default async function EsListPage() {
  const cookieStore = await cookies();
  const id = cookieStore.get("id")?.value;
  const role = cookieStore.get("role")?.value;

  if (!id || id === undefined) {
    redirect(ROUTES.LOGIN);
  }

  if (role !== "superadminusers") {
    return <AccessDeny />;
  }

  const { data: escalator, error } = await supabase
    .from("escalator")
    .select("*, escalatorusers!inner(id, pw, is_actived)");

  if (error) {
    return <p>ERROR : {error.message}</p>;
  }

  return (
    <main className="flex min-h-screen bg-gray-100">
      <div className="container px-10">
        <div className="flex items-center py-2">
          <div>
            <Image src="/HPNRT.png" alt="LOGO" width={150} height={150} />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <LogoutDropdown id={id} />
          </div>
        </div>
        <div className="">
          <EsListTable escalators={escalator} />
        </div>
      </div>
    </main>
  );
}

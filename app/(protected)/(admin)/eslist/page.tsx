import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ROUTES } from "@/lib/routes";
import { supabase } from "@/lib/supabase";
import LogoutButton from "@/components/login/LogoutButton";
import AccessDeny from "@/components/AccessDeny";
import EsListTable from "@/components/EsListTable";

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
      <div className="container px-4">
        <h1 className="text-xl font-bold mb-4">
          에스컬레이터 - 빌딩 정보 등록
        </h1>
        <div className="">
          <LogoutButton />
        </div>
        <div className="">
          <EsListTable escalators={escalator} />
        </div>
      </div>
    </main>
  );
}

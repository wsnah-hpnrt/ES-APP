import LoginForm from "@/components/login/LoginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Login",
};

export default async function LoginPage() {
  //쿠키 검사 후 로그인 상태면 redirect
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;
  if (role === "superadminusers") {
    redirect(ROUTES.ADMIN_ESLIST);
  } else if (role === "escalatorusers") {
    redirect(ROUTES.ESCALATOR_DASHBOARD);
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/image.png')" }}
    >
      <LoginForm />
    </main>
  );
}

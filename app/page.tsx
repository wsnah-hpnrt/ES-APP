// 로그인 검증 여부를 결정할 root page

import { redirect } from "next/navigation";

export default function RootPage() {
  // 로그인 상태를 체크하는 로직으로 변경
  const isAuthenticated = false;

  // 로그인 상태가 아니라면 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    redirect("/login");
  }

  redirect("/dashboard");
}

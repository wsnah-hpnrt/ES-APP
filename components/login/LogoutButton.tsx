"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default function LogoutButton() {
  const router = useRouter();

  // 쿠키삭제
  const handleLogout = () => {
    Cookies.remove("role");
    Cookies.remove("id");

    setTimeout(() => {
      router.push(ROUTES.LOGIN);
    }, 10); // 쿠키 삭제를 위한 딜레이
  };

  return (
    <div className="relative inline-block">
      <button onClick={handleLogout} className="">
        로그아웃
      </button>
    </div>
  );
}

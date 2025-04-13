"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccessDeny() {
  const router = useRouter();

  useEffect(() => {
    alert("잘못된 접근입니다.");
    router.back(); // 이전 페이지로 되돌아감
  }, [router]);

  return null;
}

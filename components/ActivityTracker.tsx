"use client";

import { useCallback, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const AUTO_LOGOUT_TIME = 5 * 60 * 1000;

export default function ActivityTracker() {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      Cookies.remove("id");
      Cookies.remove("role");

      alert("동작이 없어 로그아웃되었습니다.");
      router.replace("/login");
    }, AUTO_LOGOUT_TIME);
  }, [router]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];

    // 모든 유저 이벤트마다 타이머 초기화
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // 최초 설정

    return () => {
      // 클린업
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  return null;
}

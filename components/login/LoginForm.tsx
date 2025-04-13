"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ROUTES } from "@/lib/routes";
import { supabase } from "@/lib/supabase";
import Cookies from "js-cookie";
import InputWithPlaceholder from "@/components/InputWithPlaceholder";

export default function LoginForm() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  // 관리자인지, 일반유저인지 분기 선택
  const [loginType, setLoginType] = useState("escalator");

  // 로그인 시 타임스탬프
  const now = new Date();
  const loginTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")} ${String(
    now.getHours()
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
    now.getSeconds()
  ).padStart(2, "0")}`;

  // 로그인 핸들러
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const table =
      loginType === "superadmin" ? "superadminusers" : "escalatorusers";

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .eq("pw", pw)
      .single();

    if (error || !data) {
      setError("아이디 또는 비밀번호가 잘못되었습니다.");
      return;
    } else if (data.is_actived === false) {
      setError("비활성화 된 계정입니다. 관리자에게 문의하세요.");
      return;
    }

    Cookies.set("id", data.id, { path: "/" });
    Cookies.set("role", table, { path: "/" });

    // role에 따른 분기점
    if (table === "superadminusers") {
      alert(`반갑습니다. ${data.id}님!\n로그인 일시 : ${loginTime}`);
      router.push(ROUTES.ADMIN_ESLIST);
    } else if (table === "escalatorusers") {
      alert(`반갑습니다. ${data.id}님!\n로그인 일시 : ${loginTime}`);
      router.push(ROUTES.ESCALATOR_DASHBOARD);
    } else {
      setError("에러가 발생했습니다.");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-sm space-y-4 p-6 shadow-lg bg-white rounded-2xl"
    >
      <div className="flex flex-col items-center gap-2">
        <img src="/HPNRT.png" alt="Logo" className="w-60" />
        <p>ES-APP</p>
      </div>

      <div className="mb-4">
        <div className="flex gap-4">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name="loginType"
              value="escalator"
              checked={loginType === "escalator"}
              onChange={() => setLoginType("escalator")}
            />
            Escalator
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name="loginType"
              value="superadmin"
              checked={loginType === "superadmin"}
              onChange={() => setLoginType("superadmin")}
            />
            Admin
          </label>
        </div>
      </div>

      <InputWithPlaceholder
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        label="ID"
        required
      />

      <InputWithPlaceholder
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        label="PW"
        required
      />

      {error && <p className="text-red-500 text-sm text-center"> {error} </p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition cursor-pointer"
      >
        로그인
      </button>
    </form>
  );
}

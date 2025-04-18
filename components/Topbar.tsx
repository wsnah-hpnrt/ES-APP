"use client";
import Cookies from "js-cookie";

import LogoutDropDown from "@/components/login/LogoutDropdown";
import { useEffect, useState } from "react";

export default function Topbar() {
  const [id, setId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const cookieId = Cookies.get("id");
    const cookieRole = Cookies.get("role");
    setId(cookieId || "");
    setRole(cookieRole || "");
  }, []);

  return (
    <div className="flex items-center py-8 px-6 w-full overflow-x-hidden">
      <div className="flex items-center gap-4 ml-auto">
        {id && role && <LogoutDropDown id={id} role={role} />}
      </div>
    </div>
  );
}

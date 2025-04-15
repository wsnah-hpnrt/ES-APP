"use client";

import { useEffect, useRef, useState } from "react";
import { FiUser } from "react-icons/fi";
import LogoutButton from "./LogoutButton";

export default function UserDropdown({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-md"
      >
        <div className="flex flex-col text-sm text-right">
          <span className="font-medium">{id} 님</span>
          <span className="text-xs text-gray-500">superadmin</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-700 to-yellow-300 text-white flex items-center justify-center">
          <FiUser size={25} />
        </div>
      </button>

      {open && (
        <div className="absolute right-5 mt-0.5  py-3 px-5 bg-white rounded-md shadow-md text-center hover:bg-gray-100">
          <LogoutButton />
        </div>
      )}
    </div>
  );
}

"use client";

import { InputHTMLAttributes, ChangeEvent } from "react";
import clsx from "clsx";

interface InputWithPlaceholderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function InputWithPlaceholder({
  label,
  value,
  onChange,
  className,
  ...props
}: InputWithPlaceholderProps) {
  return (
    <div className="relative">
      <input
        {...props}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={clsx(
          "peer w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500",
          className
        )}
      />
      <span
        className={clsx(
          "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none",
          value ? "opacity-0" : "opacity-100",
          "peer-focus:opacity-0"
        )}
      >
        {label}
      </span>
    </div>
  );
}

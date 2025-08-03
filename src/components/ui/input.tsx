import React from "react";

export function Input({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={`border px-2 py-1 rounded ${className}`}
    />
  );
}

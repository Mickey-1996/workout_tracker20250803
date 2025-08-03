import React from "react";

export function Textarea({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      className={`border px-2 py-1 rounded w-full ${className}`}
    />
  );
}

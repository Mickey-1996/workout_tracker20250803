import React from "react";

export function Checkbox({
  checked,
  onCheckedChange,
  className = "",
}: {
  checked: boolean;
  onCheckedChange: () => void;
  className?: string;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onCheckedChange}
      className={`accent-blue-600 ${className}`}
    />
  );
}

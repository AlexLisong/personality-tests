"use client";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text-mid)] mb-1.5">{label}</label>
      )}
      <input
        ref={ref}
        className={`w-full px-4 py-3 rounded-[var(--radius-md)] border text-sm text-[var(--color-text)] bg-[var(--color-bg)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-purple)]/30 focus:border-[var(--color-purple)] transition-colors ${error ? "border-red-400" : "border-[var(--color-border)]"} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;

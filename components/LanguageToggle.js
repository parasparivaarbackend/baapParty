"use client";

import { useLang } from "@/context/LanguageContext";

// EN | हिं switch. Press once -> Hindi, press again -> English.
export default function LanguageToggle({ className = "" }) {
  const { toggle, isHindi } = useLang();
  const label = isHindi ? "Switch to English" : "हिन्दी में देखें";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`flex shrink-0 items-center rounded-full border-2 border-ink/20 bg-white p-0.5 text-xs font-extrabold leading-none text-ink transition hover:border-saffron active:scale-95 ${className}`}
    >
      <span className={`rounded-full px-2.5 py-1.5 transition-colors ${!isHindi ? "bg-saffron text-white" : ""}`}>EN</span>
      <span className={`rounded-full px-2.5 py-1.5 transition-colors ${isHindi ? "bg-saffron text-white" : ""}`}>हिं</span>
    </button>
  );
}

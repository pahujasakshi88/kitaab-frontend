"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { getTheme, setTheme, type Theme } from "@/lib/theme";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export default function ThemePicker() {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  const choose = (t: Theme) => {
    setThemeState(t);
    setTheme(t);
  };

  return (
    <div className="mt-6 rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-6">
      <h2 className="font-semibold">Appearance</h2>
      <p className="mt-1 text-xs text-[color:var(--c-77716a)]">
        Choose how Kitaab looks on this device.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {THEMES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => choose(value)}
            aria-pressed={theme === value}
            className={`flex flex-col items-center gap-2 rounded-xl border py-4 text-sm transition ${
              theme === value
                ? "border-[color:var(--c-8a4a2b)] text-[color:var(--c-8a4a2b)]"
                : "border-[color:var(--c-e5ded3)] text-[color:var(--c-77716a)] hover:border-[color:var(--c-c66a45)]"
            }`}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { applyTheme, getTheme } from "@/lib/theme";

// "System" chuna ho aur phone/laptop ka mode badle to app bhi saath badle
export default function ThemeSync() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (getTheme() === "system") applyTheme("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return null;
}

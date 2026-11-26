export type Theme = "light" | "dark" | "system";
const KEY = "kitaab-theme";

export const getTheme = (): Theme => {
  try {
    const t = localStorage.getItem(KEY);
    return t === "dark" || t === "system" ? t : "light";
  } catch {
    return "light";
  }
};

export const applyTheme = (t: Theme) => {
  const dark =
    t === "dark" ||
    (t === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
};

export const setTheme = (t: Theme) => {
  try {
    localStorage.setItem(KEY, t);
  } catch {}
  applyTheme(t);
};

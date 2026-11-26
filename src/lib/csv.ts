type Cell = string | number | null | undefined;

// Excel mein "=cmd..." jaisi value formula ban sakti hai, isliye aise text ke aage ' laga dete hain
const safe = (v: Cell) => {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s) && typeof v === "string") s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export function downloadCsv(
  filename: string,
  headers: string[],
  rows: Cell[][],
) {
  const lines = [headers, ...rows].map((r) => r.map(safe).join(","));
  // \uFEFF = Excel mein Hindi/Unicode sahi dikhane ke liye
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// kittab folder ke andar se chalao:  node scripts/dark-codemod.mjs
// Hard-coded colors ko CSS variables (--c-xxxxxx) mein badalta hai. Light mode ka look wahi rehta hai.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "src");

// Jo colors dark mode mein badlenge (inki dark values globals.css mein hain)
const TOKENS = new Set([
  "20201d",
  "77716a",
  "e5ded3",
  "f7f3ec",
  "f3eadc",
  "fbf4ee",
  "fbf8f3",
  "f7f1e8",
  "f1e3d3",
  "c66a45",
  "a8552a",
  "8a4a2b",
]);
// Brand colors: background mein jaisa hai waisa (upar safed text hota hai), sirf text/border badlenge
const BRAND = new Set(["c66a45", "a8552a", "8a4a2b"]);
const BG_UTILS = new Set(["bg", "from", "to", "via"]);

const CLASS_RE =
  /(?<![\w-])((?:[a-z-]+:)*)(bg|text|border|divide|ring|from|to|via|fill|stroke|outline|placeholder|decoration)-\[#([0-9a-fA-F]{6})\]/g;
const WHITE_RE = /(?<![\w-])((?:[a-z-]+:)*)bg-white(?![\w/-])/g;
const SVG_RE = /\b(stroke|fill)="#(e5ded3|77716a|20201d)"/g;

let totalChanged = 0;

const transform = (src) =>
  src
    .replace(CLASS_RE, (m, variants, util, hex, offset, str) => {
      const h = hex.toLowerCase();
      if (!TOKENS.has(h)) return m;
      const hasAlpha = str[offset + m.length] === "/";
      if (BG_UTILS.has(util) && BRAND.has(h)) return m;
      // solid dark button background (bg-[#20201d]) dark mode mein bhi dark rahe
      const name =
        BG_UTILS.has(util) && h === "20201d" && !hasAlpha ? "btn-dark" : h;
      return `${variants}${util}-[color:var(--c-${name})]`;
    })
    .replace(WHITE_RE, (m, variants, offset, str) => {
      // switch ka gola safed hi rahe
      if (
        str
          .slice(Math.max(0, offset - 30), offset)
          .includes("h-5 w-5 rounded-full")
      )
        return m;
      return `${variants}bg-[color:var(--c-white)]`;
    })
    .replace(SVG_RE, (_m, attr, hex) => `${attr}="var(--c-${hex})"`);

const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(e.name)) {
      const before = fs.readFileSync(p, "utf8");
      const after = transform(before);
      if (after !== before) {
        fs.writeFileSync(p, after);
        totalChanged++;
        console.log("updated", path.relative(process.cwd(), p));
      }
    }
  }
};

walk(ROOT);
console.log(`\nDone. ${totalChanged} files updated.`);

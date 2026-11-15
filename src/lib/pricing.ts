// SAMPLE prices in PKR for demonstration only.
export type PaperSize = "A4" | "A3";
export type ColorMode = "bw" | "color";
export type Sides = "single" | "double";

export interface PrintPrefs {
  paperSize: PaperSize;
  color: ColorMode;
  sides: Sides;
  copies: number;
  rangeMode: "all" | "custom";
  customRange: string;
}

export const SAMPLE_RATES = {
  bw: 10,
  color: 30,
  a3Multiplier: 2,
  doubleSidedDiscount: 0.9,
};

export const defaultPrefs: PrintPrefs = {
  paperSize: "A4",
  color: "bw",
  sides: "single",
  copies: 1,
  rangeMode: "all",
  customRange: "",
};

/** Parses "1-3, 5" into a sorted unique list of pages within [1,total]. Returns null if invalid. */
export function parseRange(input: string, total: number): number[] | null {
  const s = input.trim();
  if (!s) return null;
  const pages = new Set<number>();
  for (const part of s.split(",")) {
    const p = part.trim();
    const m = p.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) return null;
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    if (a < 1 || b < a || b > total) return null;
    for (let i = a; i <= b; i++) pages.add(i);
  }
  return [...pages].sort((x, y) => x - y);
}

export function selectedPageCount(prefs: PrintPrefs, totalPages: number): number {
  if (prefs.rangeMode === "all") return totalPages;
  return parseRange(prefs.customRange, totalPages)?.length ?? 0;
}

export function estimateCost(prefs: PrintPrefs, pages: number): number {
  const rate = prefs.color === "color" ? SAMPLE_RATES.color : SAMPLE_RATES.bw;
  let cost = pages * prefs.copies * rate;
  if (prefs.paperSize === "A3") cost *= SAMPLE_RATES.a3Multiplier;
  if (prefs.sides === "double" && pages > 1) cost *= SAMPLE_RATES.doubleSidedDiscount;
  return Math.round(cost);
}

export const formatPKR = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

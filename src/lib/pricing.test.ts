import { describe, it, expect } from "vitest";
import { estimateCost, parseRange, defaultPrefs } from "./pricing";

describe("sample pricing", () => {
  it("charges B&W A4 per page per copy", () => {
    expect(estimateCost({ ...defaultPrefs, copies: 2 }, 5)).toBe(100);
  });
  it("colour A3 doubles the colour rate", () => {
    expect(estimateCost({ ...defaultPrefs, color: "color", paperSize: "A3" }, 1)).toBe(60);
  });
  it("parses custom ranges and rejects out-of-bounds", () => {
    expect(parseRange("1-3, 5", 6)).toEqual([1, 2, 3, 5]);
    expect(parseRange("4-9", 6)).toBeNull();
  });
});

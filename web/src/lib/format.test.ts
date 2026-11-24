import { describe, expect, it } from "vitest";
import { formatDistance, formatMinutes } from "./format";

describe("formatDistance", () => {
  it("uses metres, then one decimal, then whole kilometres", () => {
    expect(formatDistance(0)).toBe("0 m");
    expect(formatDistance(999.4)).toBe("999 m");
    expect(formatDistance(1000)).toBe("1.0 km");
    expect(formatDistance(12_345)).toBe("12 km");
  });

  it("rejects negative and non-finite values", () => {
    expect(() => formatDistance(-1)).toThrow(RangeError);
    expect(() => formatDistance(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});

describe("formatMinutes", () => {
  it("formats minutes and hours", () => {
    expect(formatMinutes(45)).toBe("45 min");
    expect(formatMinutes(60)).toBe("1 h");
    expect(formatMinutes(90)).toBe("1 h 30 min");
  });

  it("rejects fractions and negatives", () => {
    expect(() => formatMinutes(1.5)).toThrow(RangeError);
    expect(() => formatMinutes(-5)).toThrow(RangeError);
  });
});

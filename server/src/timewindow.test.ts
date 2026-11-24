import { describe, expect, it } from "vitest";
import { formatWindow, intersect, latestStart, makeWindow, parseWindow, subtract } from "./timewindow.js";

describe("parseWindow", () => {
  it("parses and formats a window", () => {
    expect(parseWindow("08:00-12:00")).toEqual({ start: 480, end: 720 });
    expect(formatWindow(parseWindow(" 13:30 - 17:05 "))).toBe("13:30-17:05");
  });

  it("allows a window ending at midnight", () => {
    expect(parseWindow("22:00-24:00").end).toBe(1440);
  });

  it.each(["8:00-12:00", "08:00", "08:00-07:00", "08:00-08:00", "08:60-09:00", "24:30-25:00"])(
    "rejects %s",
    (text) => {
      expect(() => parseWindow(text)).toThrow();
    },
  );

  it("round-trips every quarter hour", () => {
    for (let s = 0; s < 1440; s += 15) {
      for (const len of [15, 60, 240]) {
        const w = makeWindow(s, Math.min(1440, s + len));
        expect(parseWindow(formatWindow(w))).toEqual(w);
      }
    }
  });
});

describe("intersect", () => {
  it("returns the overlap or null", () => {
    expect(intersect(parseWindow("08:00-12:00"), parseWindow("10:00-14:00"))).toEqual(
      parseWindow("10:00-12:00"),
    );
    expect(intersect(parseWindow("08:00-10:00"), parseWindow("10:00-12:00"))).toBeNull();
  });
});

describe("subtract", () => {
  const shift = parseWindow("08:00-17:00");

  it("splits a shift around a break", () => {
    expect(subtract(shift, parseWindow("12:00-12:30")).map(formatWindow)).toEqual([
      "08:00-12:00",
      "12:30-17:00",
    ]);
  });

  it("trims at either end and removes entirely", () => {
    expect(subtract(shift, parseWindow("07:00-09:00")).map(formatWindow)).toEqual(["09:00-17:00"]);
    expect(subtract(shift, parseWindow("16:00-18:00")).map(formatWindow)).toEqual(["08:00-16:00"]);
    expect(subtract(shift, parseWindow("06:00-18:00"))).toEqual([]);
  });

  it("leaves a window untouched by a cut elsewhere", () => {
    expect(subtract(shift, parseWindow("18:00-19:00"))).toEqual([shift]);
  });
});

describe("latestStart", () => {
  it("leaves room for the visit", () => {
    expect(latestStart(parseWindow("08:00-12:00"), 90)).toBe(630);
    expect(latestStart(parseWindow("08:00-09:00"), 60)).toBe(480);
    expect(latestStart(parseWindow("08:00-09:00"), 61)).toBeNull();
  });

  it("rejects a zero duration", () => {
    expect(() => latestStart(parseWindow("08:00-09:00"), 0)).toThrow(RangeError);
  });
});

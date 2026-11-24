import { describe, expect, it } from "vitest";
import { boundingBox, haversineM, inBox, type LatLng } from "./geo.js";

const LONDON: LatLng = { lat: 51.5074, lng: -0.1278 };
const PARIS: LatLng = { lat: 48.8566, lng: 2.3522 };

describe("haversineM", () => {
  it("measures London to Paris at about 344 km", () => {
    expect(haversineM(LONDON, PARIS) / 1000).toBeCloseTo(343.6, 0);
  });

  it("is zero for the same point and symmetric", () => {
    expect(haversineM(LONDON, LONDON)).toBe(0);
    expect(haversineM(LONDON, PARIS)).toBeCloseTo(haversineM(PARIS, LONDON), 6);
  });

  it("gives half the circumference between antipodes", () => {
    expect(haversineM({ lat: 0, lng: 0 }, { lat: 0, lng: 180 })).toBeCloseTo(Math.PI * 6_371_008.8, 0);
  });

  it("measures one degree of latitude at about 111.2 km", () => {
    expect(haversineM({ lat: 10, lng: 5 }, { lat: 11, lng: 5 }) / 1000).toBeCloseTo(111.19, 1);
  });

  it("rejects coordinates out of range", () => {
    expect(() => haversineM({ lat: 91, lng: 0 }, LONDON)).toThrow(RangeError);
    expect(() => haversineM(LONDON, { lat: 0, lng: Number.NaN })).toThrow(RangeError);
  });
});

describe("boundingBox", () => {
  it("contains every point within the radius", () => {
    const box = boundingBox(LONDON, 10_000);
    for (let bearing = 0; bearing < 360; bearing += 15) {
      // A point 9.9 km away in each direction.
      const d = 9_900 / 6_371_008.8;
      const b = (bearing * Math.PI) / 180;
      const lat1 = (LONDON.lat * Math.PI) / 180;
      const lng1 = (LONDON.lng * Math.PI) / 180;
      const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(b));
      const lng2 =
        lng1 +
        Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
      const point = { lat: (lat2 * 180) / Math.PI, lng: (lng2 * 180) / Math.PI };
      expect(haversineM(LONDON, point)).toBeCloseTo(9_900, 3);
      expect(inBox(box, point)).toBe(true);
    }
  });

  it("excludes a point well outside", () => {
    expect(inBox(boundingBox(LONDON, 10_000), PARIS)).toBe(false);
  });

  it("covers every longitude near a pole", () => {
    const box = boundingBox({ lat: 89.95, lng: 10 }, 20_000);
    expect(box.west).toBe(-180);
    expect(box.east).toBe(180);
    expect(box.north).toBe(90);
  });

  it("handles a box crossing the antimeridian", () => {
    const box = boundingBox({ lat: 0, lng: 179.99 }, 5_000);
    expect(inBox(box, { lat: 0, lng: -179.99 })).toBe(true);
    expect(inBox(box, { lat: 0, lng: 0 })).toBe(false);
  });

  it("rejects a negative radius", () => {
    expect(() => boundingBox(LONDON, -1)).toThrow(RangeError);
  });
});

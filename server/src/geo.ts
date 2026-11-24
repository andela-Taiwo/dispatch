// Distances and areas on the Earth's surface.
//
// Straight-line distance is the fallback when no road travel time is known, and the lower
// bound any travel-time estimate must respect: no road is shorter than the great circle.

export const EARTH_RADIUS_M = 6_371_008.8; // mean radius (IUGG)

export interface LatLng {
  lat: number;
  lng: number;
}

export function checkLatLng(point: LatLng): void {
  if (!Number.isFinite(point.lat) || point.lat < -90 || point.lat > 90) {
    throw new RangeError(`latitude ${point.lat} must be between -90 and 90`);
  }
  if (!Number.isFinite(point.lng) || point.lng < -180 || point.lng > 180) {
    throw new RangeError(`longitude ${point.lng} must be between -180 and 180`);
  }
}

const rad = (deg: number): number => (deg * Math.PI) / 180;

/** Great-circle distance in metres (haversine formula). */
export function haversineM(a: LatLng, b: LatLng): number {
  checkLatLng(a);
  checkLatLng(b);
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export interface BoundingBox {
  south: number;
  west: number;
  north: number;
  east: number;
}

/** A box that contains every point within `radiusM` of `centre` (it may contain more). */
export function boundingBox(centre: LatLng, radiusM: number): BoundingBox {
  checkLatLng(centre);
  if (!(radiusM >= 0)) throw new RangeError("radius must be zero or positive");
  const dLat = (radiusM / EARTH_RADIUS_M) * (180 / Math.PI);
  const south = Math.max(-90, centre.lat - dLat);
  const north = Math.min(90, centre.lat + dLat);
  if (south === -90 || north === 90) {
    return { south, west: -180, north, east: 180 };
  }
  const maxAbsLat = Math.max(Math.abs(south), Math.abs(north));
  const dLng = dLat / Math.cos(rad(maxAbsLat));
  if (dLng >= 180) return { south, west: -180, north, east: 180 };
  return { south, west: centre.lng - dLng, north, east: centre.lng + dLng };
}

export function inBox(box: BoundingBox, point: LatLng): boolean {
  if (point.lat < box.south || point.lat > box.north) return false;
  // A box may cross the antimeridian: west > 180 or east < -180 wrap round.
  const lng = point.lng;
  if (box.west < -180) return lng >= box.west + 360 || lng <= box.east;
  if (box.east > 180) return lng >= box.west || lng <= box.east - 360;
  return lng >= box.west && lng <= box.east;
}

export interface MultiPolygon {
  MultiPolygon: Polygons
}

export interface Polygons {
  polygons: RawPolygon[]
}

export interface Polygon {
  Polygon: RawPolygon
}

export interface Coordinate {
  x: number;
  y: number;
}

export type RawPolygon = { rings: Coordinate[][] }

export function isPolygon(obj: any): obj is Polygon {
  return obj != null && (obj).Polygon !== undefined;
}

export function isMultiPolygon(obj: any): obj is MultiPolygon {
  return obj != null && (obj as MultiPolygon).MultiPolygon !== undefined;
}

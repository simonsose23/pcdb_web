export interface Polygons {
  polygons: {
    rings: { x: number, y: number }[][]
  }[]
}


export function isPolygon(obj: any): obj is Polygons {
  return obj != null && (obj as Polygons).polygons !== undefined;
}

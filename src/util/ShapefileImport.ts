import shp from 'shpjs';

interface ShpFeatureCollection {
  features: ShpFeature[]
}

interface ShpFeature {
  bbox: number[],
  coordinates: ShpCoordinate[],
  type: String
}

type ShpCoordinate = [number, number];

export async function shapefileToArray(buf: ArrayBuffer) {
  const geojson = await shp(buf);

  let featureCollection;

  if (Array.isArray(geojson)) {
    featureCollection = geojson[0]
  }
  else {
    featureCollection = geojson;
  }

  return featureCollection?.features[0]?.geometry.coordinates
}

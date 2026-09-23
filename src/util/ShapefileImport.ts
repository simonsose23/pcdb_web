import shp from 'shpjs';
import proj from 'proj4';

interface ShpFeatureCollection {
  features: ShpFeature[]
}

interface ShpFeature {
  bbox: number[],
  coordinates: ShpCoordinate[],
  type: String
}

type ShpCoordinate = [number, number];

export function epsgFromShapefile() {
  console.log(proj('EPSG:4326', 'EPSG:3857').forward([8.55, 47.6]));
}

export async function shapefileToArray(buf: ArrayBuffer) {
  const geojson = await shp(buf);

  let featureCollection;

  if (Array.isArray(geojson)) {
    featureCollection = geojson[0]
  }
  else {
    featureCollection = geojson;
  }

  const properties = featureCollection?.features[0]?.properties!
  let coordinates: number[][] = featureCollection?.features[0]?.geometry.coordinates[0]

  if (properties['CRS']) {
    const p = proj(properties['CRS'], 'EPSG:4326')

    console.log(coordinates)

    coordinates = coordinates.map(e => p.forward(e))
    console.log(coordinates)
  }

  return coordinates
}

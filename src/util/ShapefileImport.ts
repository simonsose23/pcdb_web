import shp from 'shpjs';
import proj from 'proj4';
import JSZip from 'jszip';

interface ShpFeatureCollection {
  features: ShpFeature[]
}

interface ShpFeature {
  bbox: number[],
  coordinates: ShpCoordinate[],
  type: String
}

type ShpCoordinate = [number, number];

type ShpZip = { shp: ArrayBuffer | undefined, prj: ArrayBuffer | undefined }

export async function unzipBuffer(buf: ArrayBuffer): Promise<ShpZip> {
  const zip = new JSZip();
  const zipContent = await zip.loadAsync(buf);

  // Get all files in the zip
  const fileArray = Object.values(zipContent.files);

  // Extract arrayBuffers for each file
  const obj: ShpZip = { shp: undefined, prj: undefined };

  for (const file of fileArray) {
    if (!file.dir) { // Skip directories
      if (file.name.endsWith(".shp")) {
        obj.shp = await file.async('arraybuffer')
      }
      if (file.name.endsWith(".prj")) {
        obj.prj = await file.async('arraybuffer')
      }
    }
  }

  return obj;
}

export async function shapefileToArray(buf: ArrayBuffer) {

  try {
    const obj = await unzipBuffer(buf);

    const geojson = await shp(obj);


    let featureCollection;

    if (Array.isArray(geojson)) {
      featureCollection = geojson[0]
    }
    else {
      featureCollection = geojson;
    }

    let coordinates: number[][] = featureCollection?.features[0]?.geometry.coordinates[0]

    return coordinates
  } catch (error) {
    // If it's not a zip file, proceed with normal shapefile processing
    console.log('Buffer is not a zip file!');
    console.log(error)
  }
  return [[]]
}

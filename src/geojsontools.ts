import { 
  GeoJsonObject, 
  GeometryObject, 
  LineString, 
  MultiLineString, 
  Feature, 
  FeatureCollection 
} from "geojson";

export function extractLineStrings(geoJson: GeoJsonObject): Array<LineString | MultiLineString> {
  let lineStrings: Array<LineString | MultiLineString> = [];

  function extractFromGeometry(geometry: GeometryObject) {
      if (geometry.type === "LineString" || geometry.type === "MultiLineString") {
          lineStrings.push(geometry as LineString | MultiLineString);
      }
  }

  function extractFromFeature(feature: Feature) {
      if (feature.geometry) {
          extractFromGeometry(feature.geometry);
      }
  }

  function extractFromFeatureCollection(collection: FeatureCollection) {
      for (const feature of collection.features) {
          if (feature.type === "Feature") {
              extractFromFeature(feature);
          } else if (feature.type === "FeatureCollection") {
              extractFromFeatureCollection(feature as unknown as FeatureCollection); // had to add unknown
          }
      }
  }

  if (geoJson.type === "Feature") {
      extractFromFeature(geoJson as Feature);
  } else if (geoJson.type === "FeatureCollection") {
      extractFromFeatureCollection(geoJson as FeatureCollection);
  } else {
      // It's a single geometry
      extractFromGeometry(geoJson as GeometryObject);
  }

  return lineStrings;
}

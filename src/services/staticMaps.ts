import { BBox, Position, GeoJSON, FeatureCollection } from "geojson";
import { config } from "../config";
import { defaults } from "../defaults";
import { MapStyleVariant, ReferenceMapStyle, styleToStyle } from "../mapstyle";
import { misc } from "../misc";
import Color from "color";

/**
 * Base set of options that can be provided to all the types of static maps
 */
export type StaticMapBaseOptions = {
  /**
   * Custom MapTiler Cloud API key to use instead of the one in global `config`
   */
  apiKey?: string;

  /**
   * Style of the map (not full style URL). Example: "winter", "streets-v2".
   * Default: `"streets-v2"`
   */
  style?: string | ReferenceMapStyle | MapStyleVariant;

  /**
   * Double the size of the static map image to support hiDPI/Retina monitors.
   * Default: `false`
   */
  hiDPI?: boolean;

  /**
   * Image format.
   * Default: `"png"`
   */
  format?: "png" | "jpg" | "webp";

  /**
   * Width of the output image. Maximum value: `2048`.
   * Default: `1024`
   */
  width?: number;

  /**
   * Height of the output image. Maximum value: `2048`.
   * Default: `1024`
   */
  height?: number;

  /**
   * Placement of the attribution. Can also be set to `false` to not show attribution.
   * Default: `"bottomright"`
   */
  attribution?: "bottomright" | "bottomleft" | "topleft" | "topright" | false;

  /**
   * A marker or list of markers to show on the map
   * Default: none provided
   */
  markers?: StaticMapMarker | StaticMapMarker[];

  /**
   * URL of the marker image. Applies only if one or multiple markers positions are provided.
   * Default: none provided
   */
  markerIcon?: string;

  /**
   * Position of the marker regarding its coordinates. Applies only:
   * - with a custom icon provided with `markerIcon`
   * - if one or multiple markers positions are provided.
   * Default: `"bottom"`
   */
  markerAnchor?: MarkerAnchor;

  /**
   * Path or list of paths on top of the map. If the path is too long it will be simplified, yet remaining accurate.
   * Default: none provided
   */
  path?: StaticMapPath | StaticMapPath[];

  /**
   * Color of the path line. The color must be CSS compatible.
   * Examples:
   * - long form hex without transparency `"#FF0000"` (red)
   * - short form hex without transparency `"#F00"` (red)
   * - long form hex with transparency `"#FF000008"` (red, half opacity)
   * - short form hex with transparency `"#F008"` (red, half opacity)
   * - CSS color shorthands: `"red"`, `"chartreuse"`, etc.
   * - decimal RGB values without transparency: `"rgb(128, 100, 255)"`
   * - decimal RGB values with transparency: `"rgb(128, 100, 255, 0.5)"`
   * Default: `"blue"`
   */
  pathStrokeColor?: string;

  /**
   * Color of the filling, also works if the polygon is not closed. The color must be CSS compatible.
   * Examples:
   * - long form hex without transparency `"#FF0000"` (red)
   * - short form hex without transparency `"#F00"` (red)
   * - long form hex with transparency `"#FF000008"` (red, half opacity)
   * - short form hex with transparency `"#F008"` (red, half opacity)
   * - CSS color shorthands: `"red"`, `"chartreuse"`, etc.
   * - decimal RGB values without transparency: `"rgb(128, 100, 255)"`
   * - decimal RGB values with transparency: `"rgb(128, 100, 255, 0.5)"`
   * Default: none (transparent filling)
   */
  pathFillColor?: string;

  /**
   * Width of the path line in pixel. It can be floating point precision (ex: `0.5`)
   * Default: `1` if `hiDPI` is `false` and `2` if `hiDPI` is `true`.
   */
  pathWidth?: number;

  geoJson?: GeoJSON;
};

export type MarkerAnchor =
  | "top"
  | "left"
  | "bottom"
  | "right"
  | "center"
  | "topleft"
  | "bottomleft"
  | "topright"
  | "bottomright";

/**
 * Options that can be provided to centered static maps
 */
export type CenteredStaticMapOptions = StaticMapBaseOptions;

/**
 * Options that can be provided to bounded static maps
 */
export type BoundedStaticMapOptions = StaticMapBaseOptions & {
  /**
   * Extra space added around the regio of interest, in percentage.
   * Default: `0.1` (for 10%)
   */
  padding?: number;
};

/**
 * Options that can be provided to automatic static maps
 */
export type AutomaticStaticMapOptions = BoundedStaticMapOptions;

/**
 * Definition of a maker to show on a static map
 * Longitude, latitude, color (optional)
 * Color of the marker with CSS syntax. Applies only if a custom `markerIcon` is not provided.
 */
export type StaticMapMarker =
  | [number, number, string]
  | [number, number]
  | {
      markers: [number, number][];

      /**
       * Position of the marker regarding its coordinates. Applies only:
       * - with a custom icon provided with `markerIcon`
       * - if one or multiple markers positions are provided.
       * Default: `"bottom"`
       */
      anchor?: MarkerAnchor;

      /**
       * Color of the marker. The color must be CSS compatible.
       * Examples:
       * - long form hex without transparency `"#FF0000"` (red)
       * - short form hex without transparency `"#F00"` (red)
       * - long form hex with transparency `"#FF000008"` (red, half opacity)
       * - short form hex with transparency `"#F008"` (red, half opacity)
       * - CSS color shorthands: `"red"`, `"chartreuse"`, etc.
       * - decimal RGB values without transparency: `"rgb(128, 100, 255)"`
       * - decimal RGB values with transparency: `"rgb(128, 100, 255, 0.5)"`
       * Default: `"blue"`
       */
      color?: string;

      /**
       * URL of the marker image.
       * Default: none provided
       */
      icon?: string;
    };

export type StaticMapPath =
  | Position[]
  | {
      path: Position[];

      /**
       * Color of the path line. The color must be CSS compatible.
       * Examples:
       * - long form hex without transparency `"#FF0000"` (red)
       * - short form hex without transparency `"#F00"` (red)
       * - long form hex with transparency `"#FF000008"` (red, half opacity)
       * - short form hex with transparency `"#F008"` (red, half opacity)
       * - CSS color shorthands: `"red"`, `"chartreuse"`, etc.
       * - decimal RGB values without transparency: `"rgb(128, 100, 255)"`
       * - decimal RGB values with transparency: `"rgb(128, 100, 255, 0.5)"`
       * Default: `"blue"`
       */
      strokeColor?: string;

      /**
       * Color of the filling, also works if the polygon is not closed. The color must be CSS compatible.
       * Examples:
       * - long form hex without transparency `"#FF0000"` (red)
       * - short form hex without transparency `"#F00"` (red)
       * - long form hex with transparency `"#FF000008"` (red, half opacity)
       * - short form hex with transparency `"#F008"` (red, half opacity)
       * - CSS color shorthands: `"red"`, `"chartreuse"`, etc.
       * - decimal RGB values without transparency: `"rgb(128, 100, 255)"`
       * - decimal RGB values with transparency: `"rgb(128, 100, 255, 0.5)"`
       * Default: none (transparent filling)
       */
      fillColor?: string;

      /**
       * Width of the path line in pixel. It can be floating point precision (ex: `0.5`)
       * Default: `1` if `hiDPI` is `false` and `2` if `hiDPI` is `true`.
       */
      width?: number;
    };

function simplifyAndStringify(path: Position[], maxNbChar = 3000): string {
  let str = path.map((point) => point.join(",")).join("|");
  let tolerance = 0.000005;
  const toleranceStep = 0.00001;

  while (str.length > maxNbChar) {
    const simplerPath = misc.simplify(path, tolerance);
    // str = simplerPath.map(point => point.join(',')).join('|');
    str = simplerPath.map((point) => `${point[0]},${point[1]}`).join("|");
    tolerance += toleranceStep;
  }

  return str;
}

function getEndpoint(
  area: string,
  options: StaticMapBaseOptions,
  padding: boolean,
): string {
  const style = encodeURIComponent(styleToStyle(options.style));
  const scale = options.hiDPI ? "@2x" : "";
  const format = options.format ?? "png";
  let width = ~~(options.width ?? 1024);
  let height = ~~(options.height ?? 1024);

  if (options.hiDPI) {
    width = ~~(width / 2);
    height = ~~(height / 2);
  }

  const endpoint = new URL(
    `maps/${style}/static/${area}/${width}x${height}${scale}.${format}`,
    defaults.maptilerApiURL,
  );

  if ("attribution" in options && options.attribution) {
    endpoint.searchParams.set("attribution", options.attribution.toString());
  }

  if (padding && "padding" in options && options.padding) {
    endpoint.searchParams.set("padding", options.padding.toString());
  }

  if ("geoJson" in options && options.geoJson) {
    optionsFromGeoJson(options);
  }

  getMarkers(options).forEach((marker) => {
    endpoint.searchParams.append("markers", marker);
  });

  getPaths(options).forEach((path) => {
    endpoint.searchParams.append("path", path);
  });

  endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);

  if (area == "auto" && !("markers" in options) && !("path" in options)) {
    throw new Error(
      "Automatic static maps require markers and/or path to be created.",
    );
  }

  return endpoint.toString();
}

function getMarkers(options: StaticMapBaseOptions): string[] {
  if (!("markers" in options) || !options.markers) {
    return [];
  }

  const isSingleMarker =
    (Array.isArray(options.markers) &&
      typeof options.markers[0] === "number") ||
    (!Array.isArray(options.markers) && "markers" in options.markers);

  const markerList = isSingleMarker
    ? [options.markers as StaticMapMarker]
    : (options.markers as StaticMapMarker[]);

  const markers: string[] = [];

  for (const marker of markerList) {
    const isObject = !Array.isArray(marker);

    // Get icon, anchor, and color with fallback to global options
    const icon = isObject
      ? marker.icon || options.markerIcon
      : options.markerIcon;
    const anchor = isObject
      ? marker.anchor || options.markerAnchor
      : options.markerAnchor;
    let color = isObject
      ? marker.color
      : Array.isArray(marker) && marker.length === 3
      ? marker[2]
      : null;
    const hasIcon = !!icon;

    // Build marker string
    let markerStr = "";
    if (hasIcon) {
      color = undefined;
      markerStr += `icon:${icon}|`;

      if (anchor) {
        markerStr += `anchor:${anchor}|`;
      }

      if (options.hiDPI) {
        markerStr += `scale:2|`;
      }
    }

    // Add coordinates
    if (isObject) {
      markerStr += marker.markers
        .map((m) => (color ? `${m[0]},${m[1]},${color}` : `${m[0]},${m[1]}`))
        .join("|");
    } else if (Array.isArray(marker)) {
      markerStr += marker.slice(0, 2).join(",");
    }

    markers.push(markerStr);
  }

  return markers;
}

function getPaths(options: StaticMapBaseOptions): string[] {
  if (!("path" in options) || !options.path) {
    return [];
  }

  const pathList = Array.isArray(options.path) ? options.path : [options.path];

  return pathList.map((pathItem: Position | StaticMapPath) => {
    const isObject = !Array.isArray(pathItem);

    // Get path properties with fallback to global options
    const fillColor = isObject
      ? pathItem.fillColor ?? options.pathFillColor ?? "none"
      : options.pathFillColor ?? "none";
    const strokeColor = isObject
      ? pathItem.strokeColor ?? options.pathStrokeColor
      : options.pathStrokeColor;
    const width = isObject
      ? pathItem.width ?? options.pathWidth
      : options.pathWidth;
    const pathCoords = isObject ? pathItem.path : (pathItem as Position[]);

    // Build path string
    let pathStr = `fill:${fillColor}|`;

    if (strokeColor) {
      pathStr += `stroke:${strokeColor}|`;
    }

    if (width !== undefined) {
      const adjustedWidth = width / (options.hiDPI ? 2 : 1);
      pathStr += `width:${adjustedWidth.toString()}|`;
    }

    return pathStr + simplifyAndStringify(pathCoords);
  });
}

/**
 * Construct the URL for a static map centered on one point.
 * Note: this function does not fetch the binary content of the image since
 * the purpose of a static map is generally to have its URL as a `src` property of a <img/> element.
 * If a path is provided and is too long, it will be simplified in an accurate way.
 * @param center
 * @param zoom
 * @param options
 * @returns
 */
function centered(
  center: Position,
  zoom: number,
  options: CenteredStaticMapOptions = {},
): string {
  const area = `${center[0]},${center[1]},${zoom}`;
  return getEndpoint(area, options, false);
}

/**
 * Construct the URL for a static map using a bounding box
 * Note: this function does not fetch the binary content of the image since
 * the purpose of a static map is generally to have its URL as a `src` property of a <img/> element.
 * If a path is provided and is too long, it will be simplified in an accurate way.
 * @param boundingBox
 * @param options
 * @returns
 */
function bounded(
  boundingBox: BBox,
  options: BoundedStaticMapOptions = {},
): string {
  const area = `${boundingBox[0]},${boundingBox[1]},${boundingBox[2]},${boundingBox[3]}`;
  return getEndpoint(area, options, true);
}

/**
 * Construct the URL for a static map automatically fitted around the provided path or markers.
 * Note: this function does not fetch the binary content of the image since
 * the purpose of a static map is generally to have its URL as a `src` property of a <img/> element.
 * If a path is provided and is too long, it will be simplified in an accurate way.
 * @param options
 * @returns
 */
function automatic(options: AutomaticStaticMapOptions = {}): string {
  return getEndpoint("auto", options, true);
}

function optionsFromGeoJson(options: StaticMapBaseOptions) {
  if (!options.geoJson) return;

  const collection =
    "type" in options.geoJson && options.geoJson.type == "FeatureCollection"
      ? (options.geoJson as FeatureCollection).features
      : [options.geoJson];

  for (const item of collection) {
    const geometry = "geometry" in item ? item.geometry : item;
    const properties =
      "properties" in item && item.properties ? item.properties : {};

    switch (geometry.type) {
      case "GeometryCollection":
        collection.push(...geometry.geometries);
        break;

      case "Point":
      case "MultiPoint": {
        const points =
          geometry.type === "Point"
            ? [geometry.coordinates]
            : geometry.coordinates;

        for (const coords of points) {
          const marker: StaticMapMarker = {
            markers: [[coords[0], coords[1]]],
          };
          if (properties["marker-color"]) {
            marker.color = properties["marker-color"];
          }

          if (!options.markers) {
            options.markers = marker;
          } else {
            const isSingleMarker =
              (Array.isArray(options.markers) &&
                typeof options.markers[0] === "number") ||
              (!Array.isArray(options.markers) && "markers" in options.markers);

            if (isSingleMarker) {
              options.markers = [options.markers as StaticMapMarker, marker];
            } else {
              (options.markers as StaticMapMarker[]).push(marker);
            }
          }
        }
        break;
      }

      case "LineString":
      case "MultiLineString":
      case "Polygon":
      case "MultiPolygon": {
        const lines =
          geometry.type === "LineString"
            ? [geometry.coordinates]
            : geometry.coordinates;

        for (const line of lines) {
          const path = {
            path: line as Position[],
            strokeColor: properties["stroke"] || "rgba(0,64,255,0.7)",
            fillColor: properties["fill"] || "none",
            width: undefined,
          };

          if (properties["stroke-opacity"]) {
            path.strokeColor = Color(path.strokeColor)
              .alpha(properties["stroke-opacity"])
              .hexa();
          }

          if (properties["fill-opacity"]) {
            path.fillColor = Color(path.fillColor)
              .alpha(properties["fill-opacity"])
              .hexa();
          }

          if (properties["stroke-width"]) {
            path.width = properties["stroke-width"];
          }

          options.path ??= [];
          if (Array.isArray(options.path)) {
            (options.path as StaticMapPath[]).push(path);
          } else {
            options.path = [options.path, path];
          }
        }
        break;
      }
    }
  }
}

/**
 * The **staticMaps** namespace contains an synchronous function build image URL of static map, as specified by the [MapTiler Static Map API](https://docs.maptiler.com/cloud/api/static-maps/).
 * The URL of static maps can then be used within a `<img />` markup element, as the `src` property value.
 */
const staticMaps = {
  centered,
  bounded,
  automatic,
};

export { staticMaps };

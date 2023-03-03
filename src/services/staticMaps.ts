import { BBox, Position } from "geojson";
import { config } from "../config";
import { defaults } from "../defaults";
import { MapStyleVariant, ReferenceMapStyle, styleToStyle } from "../mapstyle";
import simplify from "./simplify";

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
  markers?: StaticMapMarker | Array<StaticMapMarker>;

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
  markerAnchor?:
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
   * Draw a path or polygon on top of the map. If the path is too long it will be simplified, yet remaining accurate.
   * Default: none provided
   */
  path?: Array<Position>;

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
};

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
 */
export type StaticMapMarker = [
  /**
   * Longitude of the marker
   */
  number,
  /**
   * latitude of the marker
   */
  number,
  /**
   * Color of the marker with CSS syntax. Applies only if a custom `markerIcon` is not provided.
   */
  string
];

function staticMapMarkerToString(
  marker: StaticMapMarker,
  includeColor = true
): string {
  let str = `${marker[0]},${marker[1]}`;

  if (marker.length === 3 && includeColor) {
    str += `,${marker[2]}`;
  }

  return str;
}

function simplifyAndStringify(path: Array<Position>, maxNbChar = 3000): string {
  let str = path.map((point) => point.join(",")).join("|");
  let tolerance = 0.000005;
  const toleranceStep = 0.00001;

  while (str.length > maxNbChar) {
    const simplerPath = simplify(path, tolerance);
    // str = simplerPath.map(point => point.join(',')).join('|');
    str = simplerPath.map((point) => `${point[0]},${point[1]}`).join("|");
    tolerance += toleranceStep;
  }

  return str;
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
  options: CenteredStaticMapOptions = {}
): string {
  const style = styleToStyle(options.style);
  const scale = options.hiDPI ? "@2x" : "";
  const format = options.format ?? "png";
  let width = ~~(options.width ?? 1024);
  let height = ~~(options.height ?? 1024);

  if (options.hiDPI) {
    width = ~~(width / 2);
    height = ~~(height / 2);
  }

  const endpoint = new URL(
    `maps/${encodeURIComponent(style)}/static/${center[0]},${
      center[1]
    },${zoom}/${width}x${height}${scale}.${format}`,
    defaults.maptilerApiURL
  );

  if ("attribution" in options) {
    endpoint.searchParams.set("attribution", options.attribution.toString());
  }

  if ("markers" in options) {
    let markerStr = "";

    const hasIcon = "markerIcon" in options;

    if (hasIcon) {
      markerStr += `icon:${options.markerIcon}|`;
    }

    if (hasIcon && "markerAnchor" in options) {
      markerStr += `anchor:${options.markerAnchor}|`;
    }

    if (hasIcon && options.hiDPI) {
      markerStr += `scale:2|`;
    }

    const markerList = Array.isArray(options.markers[0])
      ? options.markers
      : [options.markers];
    markerStr += markerList
      .map((m) => staticMapMarkerToString(m, !hasIcon))
      .join("|");
    endpoint.searchParams.set("markers", markerStr);
  }

  if ("path" in options) {
    let pathStr = "";

    pathStr += `fill:${options.pathFillColor ?? "none"}|`;

    if ("pathStrokeColor" in options) {
      pathStr += `stroke:${options.pathStrokeColor}|`;
    }

    if ("pathWidth" in options) {
      const pathWidth = options.pathWidth / (options.hiDPI ? 2 : 1);
      pathStr += `width:${pathWidth.toString()}|`;
    }

    pathStr += simplifyAndStringify(options.path);
    endpoint.searchParams.set("path", pathStr);
  }

  endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);

  return endpoint.toString();
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
  options: BoundedStaticMapOptions = {}
): string {
  const style = styleToStyle(options.style);
  const scale = options.hiDPI ? "@2x" : "";
  const format = options.format ?? "png";
  let width = ~~(options.width ?? 1024);
  let height = ~~(options.height ?? 1024);

  if (options.hiDPI) {
    width = ~~(width / 2);
    height = ~~(height / 2);
  }

  const endpoint = new URL(
    `maps/${encodeURIComponent(style)}/static/${boundingBox[0]},${
      boundingBox[1]
    },${boundingBox[2]},${boundingBox[3]}/${width}x${height}${scale}.${format}`,
    defaults.maptilerApiURL
  );

  if ("attribution" in options) {
    endpoint.searchParams.set("attribution", options.attribution.toString());
  }

  if ("padding" in options) {
    endpoint.searchParams.set("padding", options.padding.toString());
  }

  if ("markers" in options) {
    let markerStr = "";

    const hasIcon = "markerIcon" in options;

    if (hasIcon) {
      markerStr += `icon:${options.markerIcon}|`;
    }

    if (hasIcon && "markerAnchor" in options) {
      markerStr += `anchor:${options.markerAnchor}|`;
    }

    if (hasIcon && options.hiDPI) {
      markerStr += `scale:2|`;
    }

    const markerList = Array.isArray(options.markers[0])
      ? options.markers
      : [options.markers];
    markerStr += markerList
      .map((m) => staticMapMarkerToString(m, !hasIcon))
      .join("|");
    endpoint.searchParams.set("markers", markerStr);
  }

  if ("path" in options) {
    let pathStr = "";

    pathStr += `fill:${options.pathFillColor ?? "none"}|`;

    if ("pathStrokeColor" in options) {
      pathStr += `stroke:${options.pathStrokeColor}|`;
    }

    if ("pathWidth" in options) {
      const pathWidth = options.pathWidth / (options.hiDPI ? 2 : 1);
      pathStr += `width:${pathWidth.toString()}|`;
    }

    pathStr += simplifyAndStringify(options.path);
    endpoint.searchParams.set("path", pathStr);
  }

  endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);

  return endpoint.toString();
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
  if (!("markers" in options) && !("path" in options)) {
    throw new Error(
      "Automatic static maps require markers and/or path to be created."
    );
  }

  const style = styleToStyle(options.style);
  const scale = options.hiDPI ? "@2x" : "";
  const format = options.format ?? "png";
  let width = ~~(options.width ?? 1024);
  let height = ~~(options.height ?? 1024);

  if (options.hiDPI) {
    width = ~~(width / 2);
    height = ~~(height / 2);
  }

  const endpoint = new URL(
    `maps/${encodeURIComponent(
      style
    )}/static/auto/${width}x${height}${scale}.${format}`,
    defaults.maptilerApiURL
  );

  if ("attribution" in options) {
    endpoint.searchParams.set("attribution", options.attribution.toString());
  }

  if ("padding" in options) {
    endpoint.searchParams.set("padding", options.padding.toString());
  }

  if ("markers" in options) {
    let markerStr = "";

    const hasIcon = "markerIcon" in options;

    if (hasIcon) {
      markerStr += `icon:${options.markerIcon}|`;
    }

    if (hasIcon && "markerAnchor" in options) {
      markerStr += `anchor:${options.markerAnchor}|`;
    }

    if (hasIcon && options.hiDPI) {
      markerStr += `scale:2|`;
    }

    const markerList = Array.isArray(options.markers[0])
      ? options.markers
      : [options.markers];
    markerStr += markerList
      .map((m) => staticMapMarkerToString(m, !hasIcon))
      .join("|");
    endpoint.searchParams.set("markers", markerStr);
  }

  if ("path" in options) {
    let pathStr = "";

    pathStr += `fill:${options.pathFillColor ?? "none"}|`;

    if ("pathStrokeColor" in options) {
      pathStr += `stroke:${options.pathStrokeColor}|`;
    }

    if ("pathWidth" in options) {
      const pathWidth = options.pathWidth / (options.hiDPI ? 2 : 1);
      pathStr += `width:${pathWidth.toString()}|`;
    }

    pathStr += simplifyAndStringify(options.path);
    endpoint.searchParams.set("path", pathStr);
  }

  endpoint.searchParams.set("key", options.apiKey ?? config.apiKey);

  return endpoint.toString();
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

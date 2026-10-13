import type { MultiPoint, MultiPolygon, Position } from "geojson";
import { decode } from "@googlemaps/polyline-codec";
import { callFetch } from "../callFetch";
import { config } from "../config";
import { ServiceError } from "./ServiceError";

/**
 * Number of decimal places used by the Routing API when encoding leg geometry
 * as an Encoded Polyline. The API always uses 6.
 */
const POLYLINE_PRECISION = 6;

/** Routing profile — determines the costing model. */
export type RoutingProfile = "car" | "truck" | "bicycle" | "pedestrian";

/** Unit of length to use */
export type RoutingDistanceUnit = "km" | "mi";

/** Language of navigation instructions */
export type RoutingInstructionsLanguage =
  | "bg"
  | "ca"
  | "cs"
  | "da"
  | "de"
  | "el"
  | "en"
  | "es"
  | "et"
  | "fi"
  | "fr"
  | "hi"
  | "hu"
  | "it"
  | "ja"
  | "nb"
  | "nl"
  | "pl"
  | "pt"
  | "ro"
  | "ru"
  | "sk"
  | "sl"
  | "sv"
  | "tr"
  | "uk";

/**
 * A single routing location as accepted by the GET endpoint, which encodes
 * each location as a `lon,lat` pair and therefore supports no extra fields.
 */
export interface RoutingGetLocation {
  /** Longitude of the point */
  lon: number;

  /** Latitude of the point */
  lat: number;
}

/** A single routing location */
export interface RoutingLocation extends RoutingGetLocation {
  /** Preferred direction of travel starting from this location. */
  heading?: number;

  /**
   * Whether this location is a waypoint (default: true).
   * If false, the router may pass through without splitting legs.
   */
  waypoint?: boolean;
}

/** Avoidance flags. Available for the car and truck profiles only. */
export interface RoutingAvoidances {
  /** Avoid toll roads */
  tolls?: boolean;

  /** Avoid ferries */
  ferry?: boolean;

  /** Avoid highways */
  highway?: boolean;
}

/** Car-specific routing options. */
export interface RoutingCarOptions {
  /** Car routing mode: fastest, shortest or balanced */
  mode?: "fastest" | "shortest" | "balanced";

  /**
   * Maximal speed of the car, in km/h. Whole numbers only.
   * Default: 140. Maximum: 252.
   */
  topSpeed?: number;

  /** Avoidance flags */
  avoidances?: RoutingAvoidances;
}

/** Truck-specific routing options supported by the GET endpoint. */
export interface RoutingGetTruckOptions {
  /**
   * Weight of the truck, in metric tonnes. Used for restrictions.
   * Default: 21.77.
   */
  weight?: number;

  /**
   * Height of the truck, in meters.
   * Default: 4.11.
   */
  height?: number;

  /**
   * Axle load of the truck, in metric tonnes.
   * Default: 9.07. Maximum: 40.
   */
  axleLoad?: number;

  /** Whether the truck carries hazardous materials */
  hazmat?: boolean;

  /**
   * Maximal speed of the truck, in km/h. Whole numbers only.
   * Default: 120. Maximum: 252.
   */
  topSpeed?: number;

  /** Avoidance flags */
  avoidances?: RoutingAvoidances;
}

/** Truck-specific routing options. */
export interface RoutingTruckOptions extends RoutingGetTruckOptions {
  /**
   * Length of the truck, in meters.
   * Default: 21.64.
   */
  length?: number;
}

/** Bicycle-specific routing options. */
export interface RoutingBicycleOptions {
  /** Bicycle type: road, gravel, mountain, city */
  type?: "road" | "gravel" | "mountain" | "city";

  /**
   * Average speed along flat, smooth road, in km/h. Used to calculate ETA.
   * The default depends on the bicycle type.
   */
  cyclingSpeed?: number;
}

/** Pedestrian-specific routing options. */
export interface RoutingPedestrianOptions {
  /**
   * Average walking speed along flat, smooth road, in km/h.
   * Used to calculate ETA. Default: 5.1.
   */
  walkingSpeed?: number;
}

/**
 * The `profile` and the matching `profileOptions`. Pairing a profile with
 * options belonging to another profile is a type error, because the API
 * accepts only the options defined for the selected profile.
 */
export type RoutingProfileSelection<
  CarOptions,
  TruckOptions,
  BicycleOptions,
  PedestrianOptions,
> =
  | { profile: "car"; profileOptions?: CarOptions }
  | { profile: "truck"; profileOptions?: TruckOptions }
  | { profile: "bicycle"; profileOptions?: BicycleOptions }
  | { profile: "pedestrian"; profileOptions?: PedestrianOptions };

/** How much routing detail should be returned. */
export type RoutingDetailLevel = "legs" | "steps" | "instructions";

/** Response formatting options supported by both endpoints. */
export interface RoutingResponseOptions {
  /** Units for distance */
  units?: RoutingDistanceUnit;

  /** Language of navigation instructions */
  language?: RoutingInstructionsLanguage;

  /**
   * Number of alternate routes to generate. Whole numbers only. Maximum: 3.
   * Note that alternates are not generated when the request contains more
   * than two locations.
   */
  alternates?: number;

  /** Additional data returned with the route */
  additionalData?: {
    /** Level of detail: legs, steps or instructions */
    detailLevel?: RoutingDetailLevel;
  };
}

/** Request fields shared by both endpoints. */
export interface RoutingRequestBase {
  /** Pass-through identifier returned in response */
  id?: string;

  /**
   * Time of departure.
   * Format: YYYY-MM-DDTHH:MM
   */
  departureTime?: string;

  /**
   * Desired arrival time.
   * Format: YYYY-MM-DDTHH:MM
   */
  arrivalTime?: string;

  /** Response formatting options */
  response?: RoutingResponseOptions;
}

/** Full routing request body for POST /routing/v1/directions. */
export type RoutingRequest = RoutingRequestBase & {
  /** List of route locations (at least 2) */
  locations: RoutingLocation[];

  /** Locations or polygons to avoid. */
  avoidLocations?: MultiPoint | MultiPolygon;
} & RoutingProfileSelection<
    RoutingCarOptions,
    RoutingTruckOptions,
    RoutingBicycleOptions,
    RoutingPedestrianOptions
  >;

/**
 * Routing request for GET /routing/v1/directions.
 *
 * The GET endpoint takes a strict subset of what the POST body accepts, so
 * this type deliberately omits the fields that cannot be expressed as query
 * parameters: {@link RoutingLocation.heading}, {@link RoutingLocation.waypoint},
 * `avoidLocations` and the truck `length`.
 * Use {@link routing.directionsPost} if you need any of them.
 */
export type RoutingGetRequest = RoutingRequestBase & {
  /** List of route locations (at least 2) */
  locations: RoutingGetLocation[];
} & RoutingProfileSelection<
    RoutingCarOptions,
    RoutingGetTruckOptions,
    RoutingBicycleOptions,
    RoutingPedestrianOptions
  >;

/** Options applying to the routing request itself, rather than to the route. */
export interface RoutingOptions {
  /**
   * Custom MapTiler Cloud API key to use instead of the one in global `config`.
   */
  apiKey?: string;

  /**
   * Callback function to adjust the target URL search params before fetching.
   * @param searchParams [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) object that can be modified in place.
   */
  adjustSearchParams?: (searchParams: URLSearchParams) => void;

  /** Extra options to pass to the underlying [fetch](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit) call. */
  fetchExtras?: RequestInit;
}

/** Routing response */
export interface RoutingResponse {
  /** Pass-through identifier */
  id?: string;

  /** Main route */
  route: RoutingRoute;

  /** Alternate routes */
  alternates?: RoutingRoute[];

  /** Attribution text */
  attribution?: string;

  /** Units used in response */
  units?: RoutingDistanceUnit;

  /** Language used in response */
  language?: RoutingInstructionsLanguage;
}

export interface RoutingRoute {
  /** Summary of this route */
  summary: RoutingSummary;

  /** Route legs between waypoints */
  legs: RoutingRouteLeg[];
}

/** Bounding box of a route or a leg: `[minLon, minLat, maxLon, maxLat]`. */
export type RoutingBBox = [number, number, number, number];

/** Summary of a route or a leg */
export interface RoutingSummary {
  /** Cost calculated by the costing model */
  cost: number;

  /** Total travel time in seconds */
  totalTime: number;

  /** Total travel distance in chosen units */
  totalLength: number;

  /** Bounding box of the route */
  bbox: RoutingBBox;

  /** Whether route contains tolls */
  toll?: boolean;

  /** Whether route contains highways */
  highway?: boolean;

  /** Whether route contains ferries */
  ferry?: boolean;
}

/** Single leg of a route */
export interface RoutingRouteLeg {
  /** Summary of the leg */
  summary: RoutingSummary;

  /**
   * Geometry of the leg as a list of coordinates.
   * Encoded Polyline geometry is decoded by the client before being returned.
   */
  geometry: Position[];

  /** Turn-by-turn steps */
  steps?: RoutingRouteStep[];
}

/** Details of a single turn-by-turn step */
export interface RoutingRouteStep {
  /** Time in seconds */
  time: number;

  /** Distance in chosen units */
  length: number;

  /** Street name */
  streetName?: string;

  /** Maneuver details */
  maneuver?: RoutingRouteManeuver;

  /** Index of step start in geometry array */
  beginIndex?: number;

  /** Index of step end in geometry array */
  endIndex?: number;

  /** Step-level flags */
  details?: {
    toll?: boolean;
    highway?: boolean;
    rough?: boolean;
    ferry?: boolean;
  };
}

/**
 * Type of maneuver.
 *
 * The API may add new maneuver types without a breaking change, so this type
 * also accepts arbitrary strings. Always handle the unknown case.
 */
export type RoutingManeuverType =
  | "none"
  | "continue"
  | "slightLeftTurn"
  | "slightRightTurn"
  | "leftTurn"
  | "rightTurn"
  | "leftSharpTurn"
  | "rightSharpTurn"
  | "leftUTurn"
  | "rightUTurn"
  | "roundaboutEnter"
  | "roundaboutExit"
  | "start"
  | "destination"
  | (string & NonNullable<unknown>);

/** Details of a single turn-by-turn step maneuver */
export interface RoutingRouteManeuver {
  /** Human-readable instruction */
  instruction?: string;

  /** Roundabout exit number */
  exitNumber?: number;

  /** Turn sharpness */
  turnAngle?: number;

  /** Maneuver type */
  type?: RoutingManeuverType;
}

/** Error payload returned by the Routing API alongside a non-OK status. */
interface RoutingErrorPayload {
  /** Short, ASCII code of the error */
  code: string;

  /** Human readable error message */
  message: string;

  /** Location of the incorrect value, when the error points at one */
  field?: string;
}

/**
 * Leg geometry as it arrives on the wire. The API may return an Encoded Polyline
 * or a plain list of coordinates, which is passed through as-is.
 */
type RoutingWireLegGeometry = Position[] | string;

type RoutingWireRouteLeg = Omit<RoutingRouteLeg, "geometry"> & {
  geometry: RoutingWireLegGeometry;
};

type RoutingWireRoute = Omit<RoutingRoute, "legs"> & {
  legs: RoutingWireRouteLeg[];
};

type RoutingWireResponse = Omit<RoutingResponse, "route" | "alternates"> & {
  route: RoutingWireRoute;
  alternates?: RoutingWireRoute[];
};

function addLocations(
  search: URLSearchParams,
  locations: RoutingGetLocation[],
): void {
  for (const loc of locations) {
    search.append("location", `${loc.lon},${loc.lat}`);
  }
}

function addResponseOptions(
  search: URLSearchParams,
  response?: RoutingResponseOptions,
): void {
  if (!response) return;

  if (response.units !== undefined)
    search.set("response.units", response.units);
  if (response.language !== undefined)
    search.set("response.language", response.language);
  if (response.alternates !== undefined)
    search.set("alternates", String(response.alternates));
  if (response.additionalData?.detailLevel !== undefined)
    search.set(
      "response.additionalData.detailLevel",
      response.additionalData.detailLevel,
    );
}

/** `topSpeed` and the avoidance flags are shared by the car and truck profiles. */
function addSpeedAndAvoidances(
  search: URLSearchParams,
  opts: RoutingCarOptions | RoutingGetTruckOptions,
): void {
  if (opts.topSpeed !== undefined)
    search.set("topSpeed", String(opts.topSpeed));

  const { avoidances } = opts;
  if (!avoidances) return;

  if (avoidances.tolls !== undefined)
    search.set("avoidances.tolls", String(avoidances.tolls));
  if (avoidances.ferry !== undefined)
    search.set("avoidances.ferry", String(avoidances.ferry));
  if (avoidances.highway !== undefined)
    search.set("avoidances.highway", String(avoidances.highway));
}

function addProfileOptions(
  search: URLSearchParams,
  req: RoutingGetRequest,
): void {
  switch (req.profile) {
    case "car": {
      const opts = req.profileOptions;
      if (!opts) return;
      if (opts.mode !== undefined) search.set("car.mode", opts.mode);
      addSpeedAndAvoidances(search, opts);
      return;
    }

    case "truck": {
      const opts = req.profileOptions;
      if (!opts) return;
      if (opts.height !== undefined)
        search.set("truck.height", String(opts.height));
      if (opts.weight !== undefined)
        search.set("truck.weight", String(opts.weight));
      if (opts.axleLoad !== undefined)
        search.set("truck.axleLoad", String(opts.axleLoad));
      if (opts.hazmat !== undefined)
        search.set("truck.hazmat", String(opts.hazmat));
      addSpeedAndAvoidances(search, opts);
      return;
    }

    case "bicycle": {
      const opts = req.profileOptions;
      if (!opts) return;
      if (opts.type !== undefined) search.set("bicycle.type", opts.type);
      if (opts.cyclingSpeed !== undefined)
        search.set("bicycle.cyclingSpeed", String(opts.cyclingSpeed));
      return;
    }

    case "pedestrian": {
      const opts = req.profileOptions;
      if (!opts) return;
      if (opts.walkingSpeed !== undefined)
        search.set("pedestrian.walkingSpeed", String(opts.walkingSpeed));
      return;
    }
  }
}

function addRoutingOptions(
  search: URLSearchParams,
  options: RoutingOptions,
): void {
  const { adjustSearchParams, apiKey } = options;

  if (typeof adjustSearchParams === "function") {
    adjustSearchParams(search);
  }

  search.set("key", apiKey ?? config.apiKey);
}

function decodeLegGeometry(geometry: RoutingWireLegGeometry): Position[] {
  if (typeof geometry === "string") {
    return decode(geometry, POLYLINE_PRECISION).map(([lat, lon]) => [lon, lat]);
  }
  return geometry;
}

function decodeRoute(route: RoutingWireRoute): RoutingRoute {
  return {
    ...route,
    legs: route.legs.map((leg) => ({
      ...leg,
      geometry: decodeLegGeometry(leg.geometry),
    })),
  };
}

/**
 * Read the human-readable message out of the error payload.
 * Falls back to an empty message if the body is missing or not the expected
 * shape, so a malformed error body never masks the original failure.
 */
async function getErrorMessage(res: Response): Promise<string> {
  let payload: Partial<RoutingErrorPayload> | null = null;

  try {
    payload = await res.json();
  } catch {
    return "";
  }

  return typeof payload?.message === "string" ? payload.message : "";
}

async function processDirectionsResponse(
  res: Response,
): Promise<RoutingResponse> {
  if (!res.ok) {
    throw new ServiceError(res, await getErrorMessage(res));
  }

  const { route, alternates, ...rest }: RoutingWireResponse = await res.json();

  const response: RoutingResponse = { ...rest, route: decodeRoute(route) };

  if (alternates) {
    response.alternates = alternates.map(decodeRoute);
  }

  return response;
}

/**
 * Get directions using POST request.
 *
 * Accepts the full request body. Use this over {@link directionsGet} when the
 * route needs `avoidLocations`, per-location `heading` or `waypoint`, or the
 * truck `length`.
 */
async function directionsPost(
  body: RoutingRequest,
  options: RoutingOptions = {},
): Promise<RoutingResponse> {
  const { fetchExtras } = options;

  const url = new URL("routing/v1/directions", config.apiURL);
  addRoutingOptions(url.searchParams, options);

  const headers = new Headers(fetchExtras?.headers);
  headers.set("content-type", "application/json");

  const res = await callFetch(url.toString(), {
    ...fetchExtras,
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  return await processDirectionsResponse(res);
}

/**
 * Get directions using GET request.
 *
 * The GET endpoint supports fewer parameters than the POST one - see
 * {@link RoutingGetRequest} for what it leaves out.
 */
async function directionsGet(
  req: RoutingGetRequest,
  options: RoutingOptions = {},
): Promise<RoutingResponse> {
  const { fetchExtras } = options;

  const url = new URL("routing/v1/directions", config.apiURL);
  const search = url.searchParams;

  search.set("profile", req.profile);

  if (req.id !== undefined) search.set("id", req.id);
  if (req.departureTime !== undefined)
    search.set("departureTime", req.departureTime);
  if (req.arrivalTime !== undefined) search.set("arrivalTime", req.arrivalTime);

  addLocations(search, req.locations);
  addResponseOptions(search, req.response);
  addProfileOptions(search, req);
  addRoutingOptions(search, options);

  const res = await callFetch(url.toString(), {
    ...fetchExtras,
    method: "GET",
    body: null,
  });

  return await processDirectionsResponse(res);
}

/**
 * API client module for MapTiler Routing API
 */
export const routing = {
  /**
   * Get directions using POST request
   */
  directionsPost,
  /**
   * Get directions using GET request
   */
  directionsGet,
};

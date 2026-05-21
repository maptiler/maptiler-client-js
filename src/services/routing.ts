import type { BBox, MultiPoint, MultiPolygon, Position } from "geojson";
import { callFetch } from "../callFetch";
import { config } from "../config";
import { defaults } from "../defaults";
import { ServiceError } from "./ServiceError";

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

/** A single routing location */
export interface RoutingLocation {
  /** Longitude of the point */
  lon: number;

  /** Latitude of the point */
  lat: number;

  /** Preferred direction of travel starting from this location. */
  heading?: number;

  /**
   * Whether this location is a waypoint (default: true).
   * If false, the router may pass through without splitting legs.
   */
  waypoint?: boolean;
}

/** Avoidance flags. */
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

  /** Maximal speed of the car */
  topSpeed?: number;

  /** Avoidance flags */
  avoidances?: RoutingAvoidances;
}

/** Truck-specific routing options. */
export interface RoutingTruckOptions {
  /** Weight of the truck */
  weight?: number;

  /** Height of the truck */
  height?: number;

  /** Length of the truck */
  length?: number;

  /** Axle load of the truck */
  axleLoad?: number;

  /** Whether the truck carries hazardous materials */
  hazmat?: boolean;

  /** Maximal speed of the truck */
  topSpeed?: number;

  /** Avoidance flags */
  avoidances?: RoutingAvoidances;
}

/** Bicycle-specific routing options. */
export interface RoutingBicycleOptions {
  /** Bicycle type: road, gravel, mountain, city */
  type?: "road" | "gravel" | "mountain" | "city";

  /** Average speed along flat, smooth road. Used to calculate ETA. */
  cyclingSpeed?: number;
}

/** Pedestrian-specific routing options. */
export interface RoutingPedestrianOptions {
  /** Average walking speed along flat, smooth road. Used to calculate ETA. */
  walkingSpeed?: number;
}

/** All profile-specific options. */
export type RoutingProfileOptions =
  | RoutingCarOptions
  | RoutingTruckOptions
  | RoutingBicycleOptions
  | RoutingPedestrianOptions;

/** Full routing request body for POST /routing/directions. */
export interface RoutingRequest {
  /** Pass-through identifier returned in response */
  id?: string;

  /** List of route locations (min 2) */
  locations: RoutingLocation[];

  /** Routing profile */
  profile: RoutingProfile;

  /** Response formatting options */
  response?: {
    /** Units for distance */
    units?: RoutingDistanceUnit;

    /** Language of navigation instructions */
    language?: RoutingInstructionsLanguage;

    /** Number of alternate routes to generate */
    alternates?: number;

    /**
     * Whether geometry should be encoded as polyline.
     * Default: true
     */
    encodePoints?: boolean;

    /** Additional data returned with the route */
    additionalData?: {
      /**
       * Level of detail: legs, steps or instructions
       */
      detailLevel?: "legs" | "steps" | "instructions";
    };
  };

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

  /** Locations or polygons to avoid. */
  avoidLocations?: MultiPoint | MultiPolygon;

  /** Profile-specific routing options. */
  profileOptions?: RoutingProfileOptions;
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

/** Summary of a route or a leg */
export interface RoutingSummary {
  /** Cost calculated by the costing model */
  cost: number;

  /** Total travel time in seconds */
  totalTime: number;

  /** Total travel distance in chosen units */
  totalLength: number;

  /** Bounding box of the route */
  bbox: BBox;

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
   * Geometry of the leg:
   * - encoded polyline (string)
   * - list of coordinates
   */
  geometry: string | Position[];

  /** Turn-by-turn steps */
  steps: RoutingRouteStep[];
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

/** Details of a single turn-by-turn step maneuver */
export interface RoutingRouteManeuver {
  /** Human-readable instruction */
  instruction?: string;

  /** Roundabout exit number */
  exitNumber?: number;

  /** Turn sharpness */
  turnAngle?: number;

  /** Maneuver type */
  type:
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
    | "destination";
}

function addLocations(
  search: URLSearchParams,
  locations: RoutingLocation[],
): void {
  for (const loc of locations) {
    search.append("location", `${loc.lat},${loc.lon}`);
  }
}

function addResponseOptions(
  search: URLSearchParams,
  response: RoutingRequest["response"],
): void {
  if (!response) return;

  if (response.units) search.set("response.units", response.units);
  if (response.language) search.set("response.language", response.language);
  if (response.alternates !== undefined)
    search.set("alternates", String(response.alternates));
  if (response.additionalData?.detailLevel)
    search.set(
      "response.additionalData.detailLevel",
      response.additionalData.detailLevel,
    );
}

function addProfileOptions(
  search: URLSearchParams,
  profile: RoutingProfile,
  opts?: RoutingProfileOptions,
): void {
  if (!opts) return;

  if (profile === "car") {
    const o = opts as RoutingCarOptions;
    if (o.mode) search.set("car.mode", o.mode);
    if (o.topSpeed) search.set("topSpeed", String(o.topSpeed));
    if (o.avoidances?.tolls !== undefined)
      search.set("avoidances.tolls", String(o.avoidances.tolls));
    if (o.avoidances?.ferry !== undefined)
      search.set("avoidances.ferry", String(o.avoidances.ferry));
    if (o.avoidances?.highway !== undefined)
      search.set("avoidances.highway", String(o.avoidances.highway));
  }

  if (profile === "truck") {
    const o = opts as RoutingTruckOptions;
    if (o.height) search.set("truck.height", String(o.height));
    if (o.weight) search.set("truck.weight", String(o.weight));
    if (o.axleLoad) search.set("truck.axleLoad", String(o.axleLoad));
    if (o.hazmat !== undefined) search.set("truck.hazmat", String(o.hazmat));
    if (o.topSpeed) search.set("topSpeed", String(o.topSpeed));
    if (o.avoidances?.tolls !== undefined)
      search.set("avoidances.tolls", String(o.avoidances.tolls));
  }

  if (profile === "bicycle") {
    const o = opts as RoutingBicycleOptions;
    if (o.type) search.set("bicycle.type", o.type);
    if (o.cyclingSpeed)
      search.set("bicycle.cyclingSpeed", String(o.cyclingSpeed));
  }

  if (profile === "pedestrian") {
    const o = opts as RoutingPedestrianOptions;
    if (o.walkingSpeed)
      search.set("pedestrian.walkingSpeed", String(o.walkingSpeed));
  }
}

/**
 * Get directions using POST request
 * @experimental This API is experimental and can change anytime!
 */
async function directionsPost(body: RoutingRequest): Promise<RoutingResponse> {
  const url = new URL("routing/directions", defaults.maptilerApiURL);
  url.searchParams.set("key", config.apiKey);

  const res = await callFetch(url.toString(), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new ServiceError(res);
  }

  return await res.json();
}

/**
 * Get directions using GET request
 * @experimental This API is experimental and can change anytime!
 */
async function directionsGet(req: RoutingRequest): Promise<RoutingResponse> {
  const url = new URL("routing/directions", defaults.maptilerApiURL);
  const search = url.searchParams;

  search.set("key", config.apiKey);
  search.set("profile", req.profile);

  if (req.id) search.set("id", req.id);
  if (req.departureTime) search.set("departureTime", req.departureTime);
  if (req.arrivalTime) search.set("arrivalTime", req.arrivalTime);

  addLocations(search, req.locations);
  addResponseOptions(search, req.response);
  addProfileOptions(search, req.profile, req.profileOptions);

  const res = await callFetch(url.toString());

  if (!res.ok) {
    throw new ServiceError(res);
  }

  return await res.json();
}

/**
 * API client module for MapTiler Routing API
 * @experimental This API is experimental and can change anytime!
 */
export const routing = {
  /**
   * Get directions using POST request
   * @experimental This API is experimental and can change anytime!
   */
  directionsPost,
  /**
   * Get directions using GET request
   * @experimental This API is experimental and can change anytime!
   */
  directionsGet,
};

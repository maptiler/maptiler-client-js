/**
 * Compile-time tests for the routing request types.
 *
 * These assert the POST/GET split: the GET endpoint accepts a strict subset of
 * the POST body, and each profile accepts only its own options. Nothing here
 * runs, `tsc --noEmit` over the project is what enforces it, and a
 * `@ts-expect-error` that stops being an error fails the build.
 */
import type {
  RoutingGetRequest,
  RoutingRequest,
} from "../../src/services/routing";

const locations = [
  { lon: 10, lat: 20 },
  { lon: 30, lat: 40 },
];

export const fullPostRequest: RoutingRequest = {
  profile: "truck",
  locations: [
    { lon: 10, lat: 20, heading: 90 },
    { lon: 30, lat: 40, waypoint: false },
  ],
  avoidLocations: { type: "MultiPoint", coordinates: [[20.9, 52.2]] },
  response: { alternates: 1 },
  profileOptions: { length: 12, weight: 24, avoidances: { ferry: true } },
};

export const getWithAvoidLocations: RoutingGetRequest = {
  profile: "car",
  locations,
  // @ts-expect-error `avoidLocations` is POST-only
  avoidLocations: { type: "MultiPoint", coordinates: [[20.9, 52.2]] },
};

export const getWithHeading: RoutingGetRequest = {
  profile: "car",
  // @ts-expect-error per-location `heading` is POST-only
  locations: [{ lon: 10, lat: 20, heading: 90 }],
};

export const getWithWaypoint: RoutingGetRequest = {
  profile: "car",
  // @ts-expect-error per-location `waypoint` is POST-only
  locations: [{ lon: 10, lat: 20, waypoint: false }],
};

export const getWithTruckLength: RoutingGetRequest = {
  profile: "truck",
  locations,
  // @ts-expect-error truck `length` is POST-only
  profileOptions: { length: 12 },
};

export const postWithEncodePoints: RoutingRequest = {
  profile: "car",
  locations,
  // @ts-expect-error `response.encodePoints` is not part of API surface, the client always requests encoded geometry and decodes it
  response: { encodePoints: false },
};

export const getWithEncodePoints: RoutingGetRequest = {
  profile: "car",
  locations,
  // @ts-expect-error `response.encodePoints` is POST-only
  response: { encodePoints: false },
};

export const validGetRequest: RoutingGetRequest = {
  profile: "truck",
  locations,
  id: "my-request",
  departureTime: "2026-03-15T12:33",
  arrivalTime: "2026-03-15T18:00",
  response: {
    units: "km",
    language: "cs",
    alternates: 2,
    additionalData: { detailLevel: "instructions" },
  },
  profileOptions: {
    weight: 24,
    height: 4.5,
    axleLoad: 11,
    hazmat: true,
    topSpeed: 80,
    avoidances: { tolls: true, ferry: true, highway: false },
  },
};

export const bicycleWithCarOptions: RoutingRequest = {
  profile: "bicycle",
  locations,
  // @ts-expect-error car options are not valid for the bicycle profile
  profileOptions: { mode: "fastest" },
};

export const pedestrianWithTruckOptions: RoutingRequest = {
  profile: "pedestrian",
  locations,
  // @ts-expect-error truck options are not valid for the pedestrian profile
  profileOptions: { weight: 40 },
};

export const carWithBicycleOptions: RoutingGetRequest = {
  profile: "car",
  locations,
  // @ts-expect-error bicycle options are not valid for the car profile
  profileOptions: { cyclingSpeed: 18 },
};

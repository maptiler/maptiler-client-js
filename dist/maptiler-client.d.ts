import { BBox, Position, Feature, FeatureCollection } from 'geojson';
export { BBox, Position } from 'geojson';

type FetchFunction = (url: string, options: object) => Promise<any>;
/**
 * The configuration object definition
 */
declare class ClientConfig {
    /**
     * MapTiler Cloud API key
     */
    private _apiKey;
    /**
     * The fetch function. To be set if in Node < 18, otherwise
     * will be automatically resolved.
     */
    private _fetch;
    /**
     * Set the MapTiler Cloud API key
     */
    set apiKey(k: string);
    /**
     * Get the MapTiler Cloud API key
     */
    get apiKey(): string;
    /**
     * Set a the custom fetch function to replace the default one
     */
    set fetch(f: FetchFunction);
    /**
     * Get the fetch fucntion
     */
    get fetch(): FetchFunction | null;
}
/**
 * Configuration object
 */
declare const config: ClientConfig;

/**
 * Languages. Note that not all the languages of this list are available but the compatibility list may be expanded in the future.
 */
declare const LanguageGeocoding: {
    AUTO: string;
    ALBANIAN: string;
    ARABIC: string;
    ARMENIAN: string;
    AZERBAIJANI: string;
    BELORUSSIAN: string;
    BOSNIAN: string;
    BRETON: string;
    BULGARIAN: string;
    CATALAN: string;
    CHINESE: string;
    CROATIAN: string;
    CZECH: string;
    DANISH: string;
    DUTCH: string;
    ENGLISH: string;
    ESPERANTO: string;
    ESTONIAN: string;
    FINNISH: string;
    FRENCH: string;
    FRISIAN: string;
    GEORGIAN: string;
    GERMAN: string;
    GREEK: string;
    HEBREW: string;
    HUNGARIAN: string;
    ICELANDIC: string;
    IRISH: string;
    ITALIAN: string;
    JAPANESE: string;
    KANNADA: string;
    KAZAKH: string;
    KOREAN: string;
    ROMAN_LATIN: string;
    LATVIAN: string;
    LITHUANIAN: string;
    LUXEMBOURGISH: string;
    MACEDONIAN: string;
    MALTESE: string;
    NORWEGIAN: string;
    POLISH: string;
    PORTUGUESE: string;
    ROMANIAN: string;
    ROMANSH: string;
    RUSSIAN: string;
    SCOTTISH_GAELIC: string;
    SERBIAN_CYRILLIC: string;
    SLOVAK: string;
    SLOVENE: string;
    SPANISH: string;
    SWEDISH: string;
    THAI: string;
    TURKISH: string;
    UKRAINIAN: string;
    WELSH: string;
};
type Values<T> = T[keyof T];
/**
 * Built-in languages values as strings
 */
type LanguageGeocodingString = Values<typeof LanguageGeocoding>;

type GeocodingOptions = {
    /**
     * Custom mapTiler Cloud API key to use instead of the one in global `config`
     */
    apiKey?: string;
    /**
     * Only search for results in the specified area.
     */
    bbox?: BBox;
    /**
     * Prefer results close to a specific location.
     */
    proximity?: Position;
    /**
     * Prefer results in specific language. It’s possible to specify multiple values.
     */
    language?: LanguageGeocodingString | Array<LanguageGeocodingString>;
};
type Coordinates = Position;
type FeatureHierarchy = {
    /**
     * Unique feature ID
     */
    id: string;
    /**
     * Localized feature name
     */
    text: string;
};
type GeocodingFeature = Feature & {
    /**
     * Bounding box of the original feature as [w, s, e, n] array
     */
    bbox: BBox;
    /**
     * A [lon, lat] array of the original feature centeroid
     */
    center: Coordinates;
    /**
     * Formatted (including the hierarchy) and localized feature full name
     */
    place_name: string;
    /**
     * Localized feature name
     */
    text: string;
    /**
     * Feature hierarchy
     */
    context?: Array<FeatureHierarchy>;
    /**
     * Address number, if applicable
     */
    address?: string;
};
type GeocodingSearchResult = {
    type: "FeatureCollection";
    /**
     * Array of features found
     */
    features: Array<GeocodingFeature>;
    /**
     * Tokenized search query
     */
    query: Array<string>;
    /**
     * Attribution of the result
     */
    attribution: string;
};
/**
 * Performs a forward geocoding query to MapTiler API.
 * Providing a human readable place name (of a city, country, street, etc.), the function returns
 * a list of candidate locations including longitude and latitude.
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/geocoding/#search-by-name-forward
 * @param query
 * @param options
 * @returns
 */
declare function forward(query: string, options?: GeocodingOptions): Promise<GeocodingSearchResult>;
type ReverseGeocodingOptions = {
    /**
     * Custom mapTiler Cloud API key to use instead of the one in global `config`
     */
    apiKey?: string;
    /**
     * Prefer results in specific language. It’s possible to specify multiple values.
     */
    language?: LanguageGeocodingString | Array<LanguageGeocodingString>;
};
/**
 * Perform a reverse geocoding query to MapTiler API.
 * Providing a longitude and latitude, this function returns a set of human readable information abou this place (country, city, street, etc.)
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/geocoding/#search-by-coordinates-reverse
 * @param position
 * @param options
 * @returns
 */
declare function reverse(position: Position, options?: ReverseGeocodingOptions): Promise<GeocodingSearchResult>;
/**
 * The **geocoding** namespace contains asynchronous functions to call the [MapTiler Geocoding API](https://docs.maptiler.com/cloud/api/geocoding/).
 * The **Geocoding API** provides ways to get geographic coordinates from a human-readable search query of a place (forward geocoding)
 * and to get the location details (country, city, street, etc.) from a geographic coordinate (reverse geocoding);
 */
declare const geocoding: {
    forward: typeof forward;
    reverse: typeof reverse;
    language: {
        AUTO: string;
        ALBANIAN: string;
        ARABIC: string;
        ARMENIAN: string;
        AZERBAIJANI: string;
        BELORUSSIAN: string;
        BOSNIAN: string;
        BRETON: string;
        BULGARIAN: string;
        CATALAN: string;
        CHINESE: string;
        CROATIAN: string;
        CZECH: string;
        DANISH: string;
        DUTCH: string;
        ENGLISH: string;
        ESPERANTO: string;
        ESTONIAN: string;
        /**
         * Custom mapTiler Cloud API key to use instead of the one in global `config`
         */
        FINNISH: string;
        FRENCH: string;
        FRISIAN: string;
        GEORGIAN: string;
        GERMAN: string;
        GREEK: string;
        HEBREW: string; /**
         * Only search for results in the specified area.
         */
        HUNGARIAN: string;
        ICELANDIC: string;
        IRISH: string;
        ITALIAN: string;
        JAPANESE: string;
        KANNADA: string;
        KAZAKH: string;
        KOREAN: string;
        ROMAN_LATIN: string;
        LATVIAN: string;
        LITHUANIAN: string;
        LUXEMBOURGISH: string;
        MACEDONIAN: string;
        MALTESE: string;
        NORWEGIAN: string;
        POLISH: string;
        PORTUGUESE: string;
        ROMANIAN: string;
        ROMANSH: string;
        RUSSIAN: string;
        SCOTTISH_GAELIC: string;
        SERBIAN_CYRILLIC: string;
        SLOVAK: string;
        SLOVENE: string;
        SPANISH: string;
        SWEDISH: string;
        THAI: string;
        TURKISH: string;
        UKRAINIAN: string;
        WELSH: string;
    };
};

/**
 * Options that can be provided to get user data.
 */
type GeolocationInfoOptions = {
    /**
     * Custom mapTiler Cloud API key to use instead of the one in global `config`
     */
    apiKey?: string;
};
type GeolocationResult = {
    /**
     * Name of the country
     * Example: Switzerland
     */
    country?: string;
    /**
     * Two-letter code of the country ISO 3166-1 alpha-2 codes
     * Example: CH
     */
    country_code?: string;
    /**
     * Bounds of the country in WGS84 degrees [west, south, east, north].
     * Example: [5.95538,45.818852,10.490936,47.809357]
     */
    country_bounds?: BBox;
    /**
     * Official country languages in ISO 639-1 format. ISO 639-1 codes
     * Example: ["de","fr","it"]
     */
    country_languages?: Array<string>;
    /**
     * Name of the continent
     * Example: Europe
     */
    continent?: string;
    /**
     * Two-letter code of the continent
     * Example: EU
     */
    continent_code?: string;
    /**
     * Indicated whether the country is part of the European Union.
     */
    eu?: boolean;
    /**
     * Name of the city
     * Example: Zurich
     */
    city?: string;
    /**
     * Latitude of the location
     * Example: 47.36667
     */
    latitude?: number;
    /**
     * Longitude of the location
     * Example: 8.55
     */
    longitude?: number;
    /**
     * Postal code
     * Example: 8000
     */
    postal?: string;
    /**
     * If known, the ISO 3166-2 name for the first level region. ISO 3166-2 codes
     * Example: Zurich
     */
    region?: string;
    /**
     * If known, the ISO 3166-2 code for the first level region. ISO 3166-2 codes
     * Example: ZH
     */
    region_code?: string;
    /**
     * Name of the timezone
     * Example: Europe/Zurich
     */
    timezone?: string;
};
/**
 * Looks up geolocation details from IP address using MapTiler API.
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/geolocation/#ip-geolocation
 * @returns
 */
declare function info(options?: GeolocationInfoOptions): Promise<GeolocationResult>;
/**
 * The **geolocation** namespace contains an asynchronous function to call the [MapTiler Geolocation API](https://docs.maptiler.com/cloud/api/geolocation/).
 * The **Geolocation API** provides a way to retrieve the IP address as well as geographic informations of a machine performing the query (most likely: a user)
 */
declare const geolocation: {
    info: typeof info;
};

type CoordinatesSearchOptions = {
    /**
     * Custom mapTiler Cloud API key to use instead of the one in global `config`
     */
    apiKey?: string;
    /**
     * Maximum number of results returned (default: 10)
     */
    limit?: number;
    /**
     *  Show detailed transformations for each CRS (default: false)
     */
    transformations?: boolean;
    /**
     * Show exports in WKT and Proj4 notations (default: false)
     */
    exports?: boolean;
};
type CoordinateId = {
    authority: string;
    code: BigInteger;
};
type CoordinateExport = {
    proj4: string;
    wkt: string;
};
type CoordinateGrid = {
    path: string;
};
type CoordinateTransformation = {
    id: CoordinateId;
    name: string;
    reversible: boolean;
    usable: boolean;
    deprecated: boolean;
    grids: Array<CoordinateGrid>;
    accuracy?: number;
    area?: string;
    bbox?: BBox;
    target_crs?: CoordinateId;
    unit?: string;
};
type CoordinateSearch = {
    id: CoordinateId;
    name: string;
    kind: string;
    deprecated: boolean;
    transformations?: Array<CoordinateTransformation | number>;
    accuracy?: number;
    unit?: string;
    area?: string;
    /**
     * Bounding box of the resource in [min_lon, min_lat, max_lon, max_lat] order.
     */
    bbox?: BBox;
    /**
     * Most suitable transformation for this CRS.
     */
    default_transformation?: any;
    exports: CoordinateExport;
};
type CoordinateSearchResult = {
    /**
     * The coordinate search results
     */
    results: Array<CoordinateSearch>;
    /**
     * The number of results
     */
    total: number;
};
/**
 * Search information about coordinate systems using MapTiler API.
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/coordinates/#search-coordinate-systems
 * @param query Can be any kind of CRS by name or code
 * @param options
 * @returns
 */
declare function search(query: string, options?: CoordinatesSearchOptions): Promise<CoordinateSearchResult>;
type XYZ = {
    x?: number;
    y?: number;
    z?: number;
};
type CoordinateTransformResult = {
    results: Array<XYZ>;
    /**
     * Transformations are selected using given ops parameter.
     * If no parameter is given, auto strategy is used.
     * If given, it may try to use a listed transformation,
     * then fallback to towgs84 patching, and finally boundcrs.
     */
    transformer_selection_strategy: string;
};
/**
 * Options that can be provided when transforming a coordinate from one CRS to another.
 */
type CoordinatesTransformOptions = {
    /**
     * Custom mapTiler Cloud API key to use instead of the one in global `config`
     */
    apiKey?: string;
    /**
     * Source coordinate reference system (default: 4326)
     */
    sourceCrs?: number;
    /**
     * Target coordinate reference system (default: 4326)
     */
    targetCrs?: number;
    /**
     * List of codes of operations
     */
    operations?: number | Array<number>;
};
/**
 * Transforms coordinates from a source reference system to a target reference system using MapTiler API.
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/coordinates/#transform-coordinates
 * @param positions
 * @param options
 * @returns
 */
declare function transform(positions: Position | Array<Position>, options?: CoordinatesTransformOptions): Promise<CoordinateTransformResult>;
/**
 * The **coordinate** namespace contains asynchronous functions to call the [MapTiler Coordinate API](https://docs.maptiler.com/cloud/api/coordinates/).
 * The goal of the **Coordinate API* is query information about spatial coordinate reference system (CRS) as well as to transform coordinates from one CRS to another.
 */
declare const coordinates: {
    search: typeof search;
    transform: typeof transform;
};

/**
 * Options that can be provided to get user data.
 */
type GetDataOptions = {
    /**
     * Custom mapTiler Cloud API key to use instead of the one in global `config`
     */
    apiKey?: string;
};
/**
 * Get user data and returns it as GeoJSON using the MapTiler API.
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/data/#geojson
 * @param dataId
 * @returns
 */
declare function get(dataId: string, options?: GetDataOptions): Promise<FeatureCollection>;
/**
 * The **data** namespace contains an asynchronous function to call the [MapTiler Data API](https://docs.maptiler.com/cloud/api/data/).
 * The **Data API** provides a way to retrieve user data in GeoJSON format.
 */
declare const data: {
    get: typeof get;
};

/**
 * Base set of options that can be provided to all the types of static maps
 */
type StaticMapBaseOptions = {
    /**
     * Custom mapTiler Cloud API key to use instead of the one in global `config`
     */
    apiKey?: string;
    /**
     * Style of the map (not full style URL). Example: "winter", "streets-v2".
     * Default: `"streets-v2"`
     */
    style?: string;
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
    markerAnchor?: "top" | "left" | "bottom" | "right" | "center" | "topleft" | "bottomleft" | "topright" | "bottomright";
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
type CenteredStaticMapOptions = StaticMapBaseOptions;
/**
 * Options that can be provided to bounded static maps
 */
type BoundedStaticMapOptions = StaticMapBaseOptions & {
    /**
     * Extra space added around the regio of interest, in percentage.
     * Default: `0.1` (for 10%)
     */
    padding?: number;
};
/**
 * Options that can be provided to automatic static maps
 */
type AutomaticStaticMapOptions = BoundedStaticMapOptions;
/**
 * Definition of a maker to show on a static map
 */
type StaticMapMarker = [
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
declare function centered(center: Position, zoom: number, options?: CenteredStaticMapOptions): string;
/**
 * Construct the URL for a static map using a bounding box
 * Note: this function does not fetch the binary content of the image since
 * the purpose of a static map is generally to have its URL as a `src` property of a <img/> element.
 * If a path is provided and is too long, it will be simplified in an accurate way.
 * @param boundingBox
 * @param options
 * @returns
 */
declare function bounded(boundingBox: BBox, options?: BoundedStaticMapOptions): string;
/**
 * Construct the URL for a static map automatically fitted around the provided path or markers.
 * Note: this function does not fetch the binary content of the image since
 * the purpose of a static map is generally to have its URL as a `src` property of a <img/> element.
 * If a path is provided and is too long, it will be simplified in an accurate way.
 * @param options
 * @returns
 */
declare function automatic(options?: AutomaticStaticMapOptions): string;
/**
 * The **staticMaps** namespace contains an synchronous function build image URL of static map, as specified by the [MapTiler Static Map API](https://docs.maptiler.com/cloud/api/static-maps/).
 * The URL of static maps can then be used within a `<img />` markup element, as the `src` property value.
 */
declare const staticMaps: {
    centered: typeof centered;
    bounded: typeof bounded;
    automatic: typeof automatic;
};

/**
 * A ServiceError is an Error that includes the HTTP response details
 */
declare class ServiceError extends Error {
    res: Response;
    constructor(res: Response, customMessage?: string);
}

export { AutomaticStaticMapOptions, BoundedStaticMapOptions, CenteredStaticMapOptions, ClientConfig, CoordinateExport, CoordinateGrid, CoordinateId, CoordinateSearch, CoordinateSearchResult, CoordinateTransformResult, CoordinateTransformation, Coordinates, CoordinatesSearchOptions, CoordinatesTransformOptions, FeatureHierarchy, FetchFunction, GeocodingFeature, GeocodingOptions, GeocodingSearchResult, GeolocationInfoOptions, GeolocationResult, GetDataOptions, LanguageGeocoding, LanguageGeocodingString, ReverseGeocodingOptions, ServiceError, StaticMapBaseOptions, StaticMapMarker, XYZ, config, coordinates, data, geocoding, geolocation, staticMaps };

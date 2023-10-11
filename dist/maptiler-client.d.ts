import { BBox, Position, Feature, Geometry, FeatureCollection, LineString } from 'geojson';
export { BBox, Position } from 'geojson';
import { Point } from 'web-merc-projection';

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

type LanguageGeocodingOptions = {
    /**
     * Prefer results in specific language. It’s possible to specify multiple values.
     */
    language?: LanguageGeocodingString | Array<LanguageGeocodingString>;
};
type CommonForwardAndReverseGeocodingOptions = LanguageGeocodingOptions & {
    /**
     * Custom MapTiler Cloud API key to use instead of the one in global `config`
     */
    apiKey?: string;
    /**
     * Maximum number of results to show. Must be between 1 and 10. Default is 5 for forward and 1 for reverse geocoding.
     */
    limit?: number;
    /**
     * Filter of feature types to return. If not specified, all available feature types are returned.
     */
    types?: ("country" | "region" | "subregion" | "county" | "joint_municipality" | "joint_submunicipality" | "municipality" | "municipal_district" | "locality" | "neighbourhood" | "place" | "postal_code" | "address" | "poi")[];
};
type GeocodingOptions = CommonForwardAndReverseGeocodingOptions & {
    /**
     * Only search for results in the specified area.
     */
    bbox?: BBox;
    /**
     * Prefer results close to a specific location.
     */
    proximity?: Position;
    /**
     * Limit search to specific country/countries specified as list of Alpha-2 ISO 3166-1 codes.
     */
    country?: string[];
    /**
     * Set to `false` to disable fuzzy (typo-tolerant) search. Default is `true`.
     */
    fuzzyMatch?: boolean;
    /**
     * Set to `true` to use autocomplete, `false` to disable it.
     * Default (`undefined`) is to combine autocomplete with non-autocomplete results.
     */
    autocomplete?: boolean;
};
type ReverseGeocodingOptions = CommonForwardAndReverseGeocodingOptions;
type ByIdGeocodingOptions = LanguageGeocodingOptions;
type Coordinates = Position;
type FeatureProperties = {
    /**
     * External reference of the feature used for debugging purposes
     */
    ref: string;
    /**
     * ISO 3166-1 alpha-2 country code of the feature
     */
    country_code: string;
    /**
     * (experimental) Kind of the feature
     */
    kind?: "road" | "road_relation" | "admin_area" | "place" | "street" | "virtual_street";
    /**
     * (experimental) Value of place=* tag from OpenStreetMap feature if kind=place
     */
    "osm:place_type"?: string;
    /**
     * (experimental) Feature tags from OpenStreetMap. Only available for `poi` type.
     */
    "osm:tags"?: Record<string, string>;
    /**
     * Array of POI categories. Only available for `poi` type.
     */
    categories?: string[];
};
type FeatureBase = {
    /**
     * Unique feature ID
     */
    id: string;
    /**
     * Localized feature name
     */
    text: string;
    /**
     * Query's primary ISO 639-1 language code
     */
    language?: string;
    /**
     * A string analogous to the `text` field that matches the query in the requested language.
     * This field is only returned when multiple languages are requested using the `language` parameter, and will be present for each requested language.
     */
    [text: `text_${string}`]: string;
    /**
     * A ISO 639-1 query's fallback language code.
     * This field is only returned when multiple languages are requested using the `language` parameter, and will be present for each requested language.
     */
    [language: `language_${string}`]: string;
};
type FeatureHierarchy = FeatureProperties & FeatureBase;
type GeocodingFeature = Feature<Geometry, FeatureProperties> & FeatureBase & {
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
     * A string analogous to the `place_name` field that matches the query in the requested language.
     * This field is only returned when multiple languages are requested using the `language` parameter, and will be present for each requested language.
     */
    [key: `place_name_${string}`]: string;
    /**
     * An array of feature types describing the feature.
     * Currently each feature has only single type but this may change in the future.
     */
    place_type: string[];
    /**
     * Localized type of the place name, matches `place_type` property
     */
    place_type_name: string[];
    /**
     * Feature hierarchy
     */
    context?: Array<FeatureHierarchy>;
    /**
     * Address number, if applicable
     */
    address?: string;
    /**
     * Indicates how well the returned feature matches the user's query on a scale from 0 to 1.
     * 0 means the result does not match the query text at all, while 1 means the result fully matches the query text.
     * You can use the relevance property to remove results that don't fully match the query.
     */
    relevance: number;
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
/**
 * Perform a reverse geocoding query to MapTiler API.
 * Providing a longitude and latitude, this function returns a set of human readable information about this place (country, city, street, etc.)
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/geocoding/#search-by-coordinates-reverse
 * @param position
 * @param options
 * @returns
 */
declare function reverse(position: Position, options?: ReverseGeocodingOptions): Promise<GeocodingSearchResult>;
/**
 * Perform a geocoding query to MapTiler API to obtain fature by its ID.
 * Providing a feature ID, this function returns a feature which includes its full geometry.
 * Note that the feature ID is not stable and it changes when the database is re-indexed.
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/geocoding/#search-by-feature-id
 * @param id
 * @param options
 * @returns
 */
declare function byId(id: string, options?: ByIdGeocodingOptions): Promise<GeocodingSearchResult>;
/**
 * Perform a batch geocoding query to MapTiler API.
 * Provide multiple queries in the array. Each query can be forward, reverse or by feature ID.
 * Learn more on the MapTiler API reference page: https://docs.maptiler.com/cloud/api/geocoding/#batch-geocoding
 * @param queries
 * @param options
 * @returns
 */
declare function batch(queries: string[], options?: GeocodingOptions): Promise<GeocodingSearchResult[]>;
/**
 * The **geocoding** namespace contains asynchronous functions to call the [MapTiler Geocoding API](https://docs.maptiler.com/cloud/api/geocoding/).
 * The **Geocoding API** provides ways to get geographic coordinates from a human-readable search query of a place (forward geocoding)
 * and to get the location details (country, city, street, etc.) from a geographic coordinate (reverse geocoding);
 */
declare const geocoding: {
    forward: typeof forward;
    reverse: typeof reverse;
    byId: typeof byId;
    batch: typeof batch;
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
};

/**
 * Options that can be provided to get user data.
 */
type GeolocationInfoOptions = {
    /**
     * Custom MapTiler Cloud API key to use instead of the one in global `config`
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
     * Custom MapTiler Cloud API key to use instead of the one in global `config`
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
     * Custom MapTiler Cloud API key to use instead of the one in global `config`
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
     * Custom MapTiler Cloud API key to use instead of the one in global `config`
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
 * Expand the map style provided as argument of the Map constructor
 * @param style
 * @returns
 */
declare function expandMapStyle(style: any): string;
/**
 * Type for object containing style details
 */
type MapStylePreset = {
    referenceStyleID: string;
    name: string;
    description: string;
    variants: Array<{
        id: string;
        name: string;
        variantType: string;
        description: string;
        imageURL: string;
    }>;
};
/**
 * An instance of MapStyleVariant contains information about a style to use that belong to a reference style
 */
declare class MapStyleVariant {
    /**
     * Human-friendly name
     */
    private name;
    /**
     * Variant name the variant is addressed to from its reference style: `MapStyle.REFERNCE_STYLE_NAME.VARIANT_TYPE`
     */
    private variantType;
    /**
     * MapTiler Cloud id
     */
    private id;
    /**
     * Reference map style, used to retrieve sibling variants
     */
    private referenceStyle;
    /**
     * Human-friendly description
     */
    private description;
    /**
     * URL to an image describing the style variant
     */
    private imageURL;
    constructor(
    /**
     * Human-friendly name
     */
    name: string, 
    /**
     * Variant name the variant is addressed to from its reference style: `MapStyle.REFERNCE_STYLE_NAME.VARIANT_TYPE`
     */
    variantType: string, 
    /**
     * MapTiler Cloud id
     */
    id: string, 
    /**
     * Reference map style, used to retrieve sibling variants
     */
    referenceStyle: ReferenceMapStyle, 
    /**
     * Human-friendly description
     */
    description: string, 
    /**
     * URL to an image describing the style variant
     */
    imageURL: string);
    /**
     * Get the human-friendly name
     * @returns
     */
    getName(): string;
    getFullName(): string;
    /**
     * Get the variant type (eg. "DEFAULT", "DARK", "PASTEL", etc.)
     * @returns
     */
    getType(): string;
    /**
     * Get the MapTiler Cloud id
     * @returns
     */
    getId(): string;
    /**
     * Get the human-friendly description
     */
    getDescription(): string;
    /**
     * Get the reference style this variant belongs to
     * @returns
     */
    getReferenceStyle(): ReferenceMapStyle;
    /**
     * Check if a variant of a given type exists for _this_ variants
     * (eg. if this is a "DARK", then we can check if there is a "LIGHT" variant of it)
     * @param variantType
     * @returns
     */
    hasVariant(variantType: string): boolean;
    /**
     * Retrieve the variant of a given type. If not found, will return the "DEFAULT" variant.
     * (eg. _this_ "DARK" variant does not have any "PASTEL" variant, then the "DEFAULT" is returned)
     * @param variantType
     * @returns
     */
    getVariant(variantType: string): MapStyleVariant;
    /**
     * Get all the variants for _this_ variants, except _this_ current one
     * @returns
     */
    getVariants(): Array<MapStyleVariant>;
    /**
     * Get the image URL that represent _this_ variant
     * @returns
     */
    getImageURL(): string;
    /**
     * Get the style as usable by MapLibre, a string (URL) or a plain style description (StyleSpecification)
     * @returns
     */
    getExpandedStyleURL(): string;
}
/**
 * An instance of reference style contains a list of StyleVariants ordered by relevance
 */
declare class ReferenceMapStyle {
    /**
     * Human-friendly name of this reference style
     */
    private name;
    /**
     * ID of this reference style
     */
    private id;
    /**
     * Variants that belong to this reference style, key being the reference type
     */
    private variants;
    /**
     * Variants that belong to this reference style, ordered by relevance
     */
    private orderedVariants;
    constructor(
    /**
     * Human-friendly name of this reference style
     */
    name: string, 
    /**
     * ID of this reference style
     */
    id: string);
    /**
     * Get the human-friendly name of this reference style
     * @returns
     */
    getName(): string;
    /**
     * Get the id of _this_ reference style
     * @returns
     */
    getId(): string;
    /**
     * Add a variant to _this_ reference style
     * @param v
     */
    addVariant(v: MapStyleVariant): void;
    /**
     * Check if a given variant type exists for this reference style
     * @param variantType
     * @returns
     */
    hasVariant(variantType: string): boolean;
    /**
     * Get a given variant. If the given type of variant does not exist for this reference style,
     * then the most relevant default variant is returned instead
     * @param variantType
     * @returns
     */
    getVariant(variantType: string): MapStyleVariant;
    /**
     * Get the list of variants for this reference style
     * @returns
     */
    getVariants(): Array<MapStyleVariant>;
    /**
     * Get the defualt variant for this reference style
     * @returns
     */
    getDefaultVariant(): MapStyleVariant;
}
/**
 * All the styles and variants maintained by MapTiler.
 */
type MapStyleType = {
    /**
     * Suitable for navigation, with high level of detail on urban areas, plenty of POIs and 3D buildings
     */
    STREETS: ReferenceMapStyle & {
        /**
         * Suitable for navigation, with high level of detail on urban areas, plenty of POIs and 3D buildings.
         */
        DEFAULT: MapStyleVariant;
        /**
         * Suitable for navigation, with high level of detail on urban areas, plenty of POIs and 3D buildings, in dark mode.
         */
        DARK: MapStyleVariant;
        /**
         * Suitable for navigation, with high level of detail on urban areas, plenty of POIs and 3D buildings, in light mode.
         */
        LIGHT: MapStyleVariant;
        /**
         * Suitable for navigation, with high level of detail on urban areas, plenty of POIs and 3D buildings, in blue night mode.
         */
        NIGHT: MapStyleVariant;
        /**
         * Suitable for navigation, with high level of detail on urban areas, plenty of POIs and 3D buildings, with a pastel color palette.
         */
        PASTEL: MapStyleVariant;
    };
    /**
     * Suitable for outdoor activities. With elevation isolines and hillshading.
     */
    OUTDOOR: ReferenceMapStyle & {
        /**
         * Suitable for outdoor activities. With elevation isolines and hillshading.
         */
        DEFAULT: MapStyleVariant;
        /**
         * Suitable for outdoor activities. With elevation isolines and hillshading, in dark mode.
         */
        DARK: MapStyleVariant;
    };
    /**
     * Suitabe for winter outdoor activities. With ski tracks, elevation isolines and hillshading.
     */
    WINTER: ReferenceMapStyle & {
        /**
         * Suitabe for winter outdoor activities. With ski tracks, elevation isolines and hillshading.
         */
        DEFAULT: MapStyleVariant;
        /**
         * Suitabe for winter outdoor activities. With ski tracks, elevation isolines and hillshading, in dark mode.
         */
        DARK: MapStyleVariant;
    };
    /**
     * High resolution imagery only, without any label.
     */
    SATELLITE: ReferenceMapStyle & {
        /**
         * High resolution imagery only, without any label.
         */
        DEFAULT: MapStyleVariant;
    };
    /**
     * High resolution imagery with labels, political borders and roads.
     */
    HYBRID: ReferenceMapStyle & {
        /**
         * High resolution imagery with labels, political borders and roads.
         */
        DEFAULT: MapStyleVariant;
    };
    /**
     * A minimalist street-oriented style without POI
     */
    BASIC: ReferenceMapStyle & {
        /**
         * A minimalist street-oriented style without POI
         */
        DEFAULT: MapStyleVariant;
        /**
         * A minimalist street-oriented style without POI, in dark mode
         */
        DARK: MapStyleVariant;
        /**
         * A minimalist street-oriented style without POI, in light mode
         */
        LIGHT: MapStyleVariant;
    };
    /**
     * A bright street-oriented style, a nice alternative to `streets`
     */
    BRIGHT: ReferenceMapStyle & {
        /**
         * A bright street-oriented style, a nice alternative to `streets`
         */
        DEFAULT: MapStyleVariant;
        /**
         * A bright street-oriented style, a nice alternative to `streets`, in dark mode
         */
        DARK: MapStyleVariant;
        /**
         * A bright street-oriented style, a nice alternative to `streets`, in light mode
         */
        LIGHT: MapStyleVariant;
        /**
         * A bright street-oriented style, a nice alternative to `streets`, with a soft pastel color palette
         */
        PASTEL: MapStyleVariant;
    };
    /**
     * Classic OpenStreetMap style
     */
    OPENSTREETMAP: ReferenceMapStyle & {
        DEFAULT: MapStyleVariant;
    };
    /**
     * A nice high-contrast, yet less saturated alternative to the `outdoor` style, with hillshading, 3D buildings and fairly high street details
     */
    TOPO: ReferenceMapStyle & {
        /**
         * A nice high-contrast, yet less saturated alternative to the `outdoor` style, with hillshading, 3D buildings and fairly high street details
         */
        DEFAULT: MapStyleVariant;
        /**
         * A nice high-contrast, yet less saturated alternative to the `outdoor` style, with hillshading, 3D buildings and fairly high street details, in dark mode
         */
        DARK: MapStyleVariant;
        /**
         * A nice high-contrast, and high saturation alternative to the `outdoor` style, with hillshading, 3D buildings and fairly high street details
         */
        SHINY: MapStyleVariant;
        /**
         * A nice low-contrast, alternative to the `outdoor` style, with hillshading, 3D buildings and fairly high street details, using a soft pastel color palette
         */
        PASTEL: MapStyleVariant;
        /**
         * A nice very high-contrast, yet less saturated alternative to the `outdoor` style, with hillshading, 3D buildings and fairly high street details
         */
        TOPOGRAPHIQUE: MapStyleVariant;
    };
    /**
     * A nice alternative to `streets` with a soft color palette
     */
    VOYAGER: ReferenceMapStyle & {
        /**
         * A nice alternative to `streets` with a soft color palette
         */
        DEFAULT: MapStyleVariant;
        /**
         * A nice alternative to `streets`, in very dark mode
         */
        DARK: MapStyleVariant;
        /**
         * A nice alternative to `streets`, in light mode
         */
        LIGHT: MapStyleVariant;
        /**
         * A nice alternative to `streets` with a soft sepia color palette and vintage look
         */
        VINTAGE: MapStyleVariant;
    };
    /**
     * A bold very high contrast black and white (no gray!) style for the city
     */
    TONER: ReferenceMapStyle & {
        /**
         * A bold very high contrast black and white (no gray!) style for the city
         */
        DEFAULT: MapStyleVariant;
        /**
         * A bold very high contrast black and white (no gray!) style for the city, without any label
         */
        BACKGROUND: MapStyleVariant;
        /**
         * A bold very high contrast, yet faded, style for the city
         */
        LITE: MapStyleVariant;
        /**
         * A bold very high contrast black and white (no gray!) style for the city, with no building, only roads!
         */
        LINES: MapStyleVariant;
    };
    /**
     * Minimalist style, perfect for data visualization
     */
    DATAVIZ: ReferenceMapStyle & {
        /**
         *  Minimalist style, perfect for data visualization
         */
        DEFAULT: MapStyleVariant;
        /**
         *  Minimalist style, perfect for data visualization in dark mode
         */
        DARK: MapStyleVariant;
        /**
         *  Minimalist style, perfect for data visualization in light mode
         */
        LIGHT: MapStyleVariant;
    };
    /**
     * Explore deep see trenches and mountains, with isolines and depth labels
     */
    OCEAN: ReferenceMapStyle & {
        /**
         * Explore deep see trenches and mountains, with isolines and depth labels
         */
        DEFAULT: MapStyleVariant;
    };
    /**
     * Neutral greyscale style with hillshading suitable for colorful terrain-aware visualization
     */
    BACKDROP: ReferenceMapStyle & {
        /**
         *  Neutral greyscale style with hillshading suitable for colorful terrain-aware visualization
         */
        DEFAULT: MapStyleVariant;
        /**
         *  Dark greyscale style with hillshading suitable for colorful terrain-aware visualization
         */
        DARK: MapStyleVariant;
        /**
         *  Light greyscale style with hillshading suitable for colorful terrain-aware visualization
         */
        LIGHT: MapStyleVariant;
    };
};
declare const mapStylePresetList: Array<MapStylePreset>;
/**
 * Contains all the reference map style created by MapTiler team as well as all the variants.
 * For example, `MapStyle.STREETS` and the variants:
 * - `MapStyle.STREETS.DARK`
 * - `MapStyle.STREETS.LIGHT`
 * - `MapStyle.STREETS.PASTEL`
 *
 */
declare const MapStyle: MapStyleType;

/**
 * Base set of options that can be provided to all the types of static maps
 */
type StaticMapBaseOptions = {
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

interface TileID {
    id: number;
    x: number;
    y: number;
    z: number;
}
interface TileCoverCoordinates {
    /** Store the coordinates as an ll-pair */
    coordinate: Point;
    /** Track the tile relative to the point */
    tile: TileID;
}
interface TileCoverOutput {
    coords: TileCoverCoordinates[];
    tiles: TileID[];
}

type ElevationParser = (r: number, g: number, b: number, a: number) => number;
/** Default elevation parser used by Mapbox and Maplibre. Result is in meters */
declare function defaultElevationParser(r: number, g: number, b: number): number;

interface TileImage {
    channels: 1 | 2 | 3 | 4;
    image: Uint8ClampedArray;
}
type TileRequest = (x: number, y: number, zoom: number) => Promise<TileImage>;
interface Options {
    /** type of metric to use. Meters or feet. Default: meters */
    metric?: "m" | "ft";
    /** Zoom that is queried from the server. Default: 13 */
    zoom?: number;
    /** Tile size of the images returned. Default 512 */
    tileSize?: number;
    /** Tile Request method */
    tileRequest: TileRequest;
    /** Elevation parser. Default: elevation = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1) */
    elevationParser?: ElevationParser;
    /** smooth out the elevation to make the visual aesthetic nicer */
    smooth?: boolean;
}
interface ElevPoint {
    /** Distance along path from the starting point in the metric defind by options */
    distance: number;
    /** Elevation of the point */
    elevation: number;
    /** Coordinates of the point in lat-lon */
    coordinate: [lon: number, lat: number];
    /** Tile that the point is in */
    tile: TileID;
}
interface Output {
    /** Total length of the path in the metric defined by options */
    distance: number;
    /** Minimum elevation of the path */
    minElevation: number;
    /** Maximum elevation of the path */
    maxElevation: number;
    /** Average elevation of the path */
    avgElevation: number;
    /** Elevation at the start of the path */
    startElevation: number;
    /** Elevation at the end of the path */
    endElevation: number;
    /** Array of points along the path */
    points: ElevPoint[];
}
/**
 * Given a GeoJSON LineString or Feature<Linestring>, return the elevation data for the path.
 * This algorithm will automatically break the path into denser segments relative to the zoom level if necessary.
 */
declare function profileLineString(path: Feature<LineString> | LineString, options: Options): Promise<Output>;

/**
 * Finds the area of a Polygon or MultiPolygon in square meters.
 */
declare function area(area: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | GeoJSON.Polygon | GeoJSON.MultiPolygon): number;
/**
 * Finds the area of a MultiPolygon in square meters.
 */
declare function multiPolygonArea(multiPoly: GeoJSON.MultiPolygon | GeoJSON.Position[][][]): number;
/**
 * Finds the area of a Polygon in square meters.
 */
declare function polygonArea(poly: GeoJSON.Polygon | GeoJSON.Position[][]): number;

/** Get the distance of a LineString in meters */
declare function lineDistance(line: GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString | GeoJSON.Position[]): number;
/** Get the distance between two lon-lat pairs in meters */
declare function pointDistance(from: GeoJSON.Position, to: GeoJSON.Position): number;

declare const earthRadius = 6371008.8;
/** Convert meters to feet */
declare function mToFt(m: number): number;
/** Convert degrees to Radians */
declare function degToRad(degrees: number): number;
/** Convert radians to degrees */
declare function radToDeg(radians: number): number;
/** Given a latitude and zoom level, determine the max distance each segment can be in meters */
declare function getZoomLevelResolution(latitude: number, zoom: number, tileSize?: number): number;
/** Convert a tile's zoom-x-y to a number hash */
declare function xyzToTileID(x: number, y: number, zoom: number): number;

export { AutomaticStaticMapOptions, BoundedStaticMapOptions, CenteredStaticMapOptions, ClientConfig, CommonForwardAndReverseGeocodingOptions, CoordinateExport, CoordinateGrid, CoordinateId, CoordinateSearch, CoordinateSearchResult, CoordinateTransformResult, CoordinateTransformation, Coordinates, CoordinatesSearchOptions, CoordinatesTransformOptions, ElevPoint, ElevationParser, FeatureHierarchy, FetchFunction, GeocodingFeature, GeocodingOptions, GeocodingSearchResult, GeolocationInfoOptions, GeolocationResult, GetDataOptions, LanguageGeocoding, LanguageGeocodingOptions, LanguageGeocodingString, MapStyle, MapStylePreset, MapStyleType, MapStyleVariant, Options, Output, ReferenceMapStyle, ReverseGeocodingOptions, ServiceError, StaticMapBaseOptions, StaticMapMarker, TileCoverCoordinates, TileCoverOutput, TileID, TileImage, TileRequest, XYZ, area, config, coordinates, data, defaultElevationParser, degToRad, earthRadius, expandMapStyle, geocoding, geolocation, getZoomLevelResolution, lineDistance, mToFt, mapStylePresetList, multiPolygonArea, pointDistance, polygonArea, profileLineString, radToDeg, staticMaps, xyzToTileID };

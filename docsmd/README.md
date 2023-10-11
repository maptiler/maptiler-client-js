MapTiler Client - v1.6.0

# MapTiler Client - v1.6.0

## Table of contents

### Classes

- [ClientConfig](classes/ClientConfig.md)
- [MapStyleVariant](classes/MapStyleVariant.md)
- [ReferenceMapStyle](classes/ReferenceMapStyle.md)
- [ServiceError](classes/ServiceError.md)

### Interfaces

- [ElevPoint](interfaces/ElevPoint.md)
- [Options](interfaces/Options.md)
- [Output](interfaces/Output.md)
- [TileCoverCoordinates](interfaces/TileCoverCoordinates.md)
- [TileCoverOutput](interfaces/TileCoverOutput.md)
- [TileID](interfaces/TileID.md)
- [TileImage](interfaces/TileImage.md)

### Type Aliases

- [AutomaticStaticMapOptions](README.md#automaticstaticmapoptions)
- [BoundedStaticMapOptions](README.md#boundedstaticmapoptions)
- [CenteredStaticMapOptions](README.md#centeredstaticmapoptions)
- [CommonForwardAndReverseGeocodingOptions](README.md#commonforwardandreversegeocodingoptions)
- [CoordinateExport](README.md#coordinateexport)
- [CoordinateGrid](README.md#coordinategrid)
- [CoordinateId](README.md#coordinateid)
- [CoordinateSearch](README.md#coordinatesearch)
- [CoordinateSearchResult](README.md#coordinatesearchresult)
- [CoordinateTransformResult](README.md#coordinatetransformresult)
- [CoordinateTransformation](README.md#coordinatetransformation)
- [Coordinates](README.md#coordinates)
- [CoordinatesSearchOptions](README.md#coordinatessearchoptions)
- [CoordinatesTransformOptions](README.md#coordinatestransformoptions)
- [ElevationParser](README.md#elevationparser)
- [FeatureHierarchy](README.md#featurehierarchy)
- [FetchFunction](README.md#fetchfunction)
- [GeocodingFeature](README.md#geocodingfeature)
- [GeocodingOptions](README.md#geocodingoptions)
- [GeocodingSearchResult](README.md#geocodingsearchresult)
- [GeolocationInfoOptions](README.md#geolocationinfooptions)
- [GeolocationResult](README.md#geolocationresult)
- [GetDataOptions](README.md#getdataoptions)
- [LanguageGeocodingOptions](README.md#languagegeocodingoptions)
- [LanguageGeocodingString](README.md#languagegeocodingstring)
- [MapStylePreset](README.md#mapstylepreset)
- [MapStyleType](README.md#mapstyletype)
- [ReverseGeocodingOptions](README.md#reversegeocodingoptions)
- [StaticMapBaseOptions](README.md#staticmapbaseoptions)
- [StaticMapMarker](README.md#staticmapmarker)
- [TileRequest](README.md#tilerequest)
- [XYZ](README.md#xyz)

### Variables

- [LanguageGeocoding](README.md#languagegeocoding)
- [MapStyle](README.md#mapstyle)
- [config](README.md#config)
- [coordinates](README.md#coordinates-1)
- [data](README.md#data)
- [earthRadius](README.md#earthradius)
- [geocoding](README.md#geocoding)
- [geolocation](README.md#geolocation)
- [mapStylePresetList](README.md#mapstylepresetlist)
- [staticMaps](README.md#staticmaps)

### Functions

- [area](README.md#area)
- [defaultElevationParser](README.md#defaultelevationparser)
- [degToRad](README.md#degtorad)
- [expandMapStyle](README.md#expandmapstyle)
- [getZoomLevelResolution](README.md#getzoomlevelresolution)
- [lineDistance](README.md#linedistance)
- [mToFt](README.md#mtoft)
- [multiPolygonArea](README.md#multipolygonarea)
- [pointDistance](README.md#pointdistance)
- [polygonArea](README.md#polygonarea)
- [profileLineString](README.md#profilelinestring)
- [radToDeg](README.md#radtodeg)
- [xyzToTileID](README.md#xyztotileid)

## Type Aliases

### AutomaticStaticMapOptions

Ƭ **AutomaticStaticMapOptions**: [`BoundedStaticMapOptions`](README.md#boundedstaticmapoptions)

Options that can be provided to automatic static maps

#### Defined in

[src/services/staticMaps.ts:141](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/staticMaps.ts#L141)

___

### BoundedStaticMapOptions

Ƭ **BoundedStaticMapOptions**: [`StaticMapBaseOptions`](README.md#staticmapbaseoptions) & { `padding?`: `number`  }

Options that can be provided to bounded static maps

#### Defined in

[src/services/staticMaps.ts:130](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/staticMaps.ts#L130)

___

### CenteredStaticMapOptions

Ƭ **CenteredStaticMapOptions**: [`StaticMapBaseOptions`](README.md#staticmapbaseoptions)

Options that can be provided to centered static maps

#### Defined in

[src/services/staticMaps.ts:125](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/staticMaps.ts#L125)

___

### CommonForwardAndReverseGeocodingOptions

Ƭ **CommonForwardAndReverseGeocodingOptions**: [`LanguageGeocodingOptions`](README.md#languagegeocodingoptions) & { `apiKey?`: `string` ; `limit?`: `number` ; `types?`: (``"country"`` \| ``"region"`` \| ``"subregion"`` \| ``"county"`` \| ``"joint_municipality"`` \| ``"joint_submunicipality"`` \| ``"municipality"`` \| ``"municipal_district"`` \| ``"locality"`` \| ``"neighbourhood"`` \| ``"place"`` \| ``"postal_code"`` \| ``"address"`` \| ``"poi"``)[]  }

#### Defined in

[src/services/geocoding.ts:25](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/geocoding.ts#L25)

___

### CoordinateExport

Ƭ **CoordinateExport**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `proj4` | `string` |
| `wkt` | `string` |

#### Defined in

[src/services/coordinates.ts:38](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/coordinates.ts#L38)

___

### CoordinateGrid

Ƭ **CoordinateGrid**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Defined in

[src/services/coordinates.ts:43](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/coordinates.ts#L43)

___

### CoordinateId

Ƭ **CoordinateId**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `authority` | `string` |
| `code` | `BigInteger` |

#### Defined in

[src/services/coordinates.ts:33](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/coordinates.ts#L33)

___

### CoordinateSearch

Ƭ **CoordinateSearch**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `accuracy?` | `number` | - |
| `area?` | `string` | - |
| `bbox?` | `BBox` | Bounding box of the resource in [min_lon, min_lat, max_lon, max_lat] order. |
| `default_transformation?` | `any` | Most suitable transformation for this CRS. |
| `deprecated` | `boolean` | - |
| `exports` | [`CoordinateExport`](README.md#coordinateexport) | - |
| `id` | [`CoordinateId`](README.md#coordinateid) | - |
| `kind` | `string` | - |
| `name` | `string` | - |
| `transformations?` | ([`CoordinateTransformation`](README.md#coordinatetransformation) \| `number`)[] | - |
| `unit?` | `string` | - |

#### Defined in

[src/services/coordinates.ts:61](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/coordinates.ts#L61)

___

### CoordinateSearchResult

Ƭ **CoordinateSearchResult**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `results` | [`CoordinateSearch`](README.md#coordinatesearch)[] | The coordinate search results |
| `total` | `number` | The number of results |

#### Defined in

[src/services/coordinates.ts:91](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/coordinates.ts#L91)

___

### CoordinateTransformResult

Ƭ **CoordinateTransformResult**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `results` | [`XYZ`](README.md#xyz)[] | - |
| `transformer_selection_strategy` | `string` | Transformations are selected using given ops parameter. If no parameter is given, auto strategy is used. If given, it may try to use a listed transformation, then fallback to towgs84 patching, and finally boundcrs. |

#### Defined in

[src/services/coordinates.ts:159](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/coordinates.ts#L159)

___

### CoordinateTransformation

Ƭ **CoordinateTransformation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `accuracy?` | `number` |
| `area?` | `string` |
| `bbox?` | `BBox` |
| `deprecated` | `boolean` |
| `grids` | [`CoordinateGrid`](README.md#coordinategrid)[] |
| `id` | [`CoordinateId`](README.md#coordinateid) |
| `name` | `string` |
| `reversible` | `boolean` |
| `target_crs?` | [`CoordinateId`](README.md#coordinateid) |
| `unit?` | `string` |
| `usable` | `boolean` |

#### Defined in

[src/services/coordinates.ts:47](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/coordinates.ts#L47)

___

### Coordinates

Ƭ **Coordinates**: `Position`

#### Defined in

[src/services/geocoding.ts:90](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/geocoding.ts#L90)

___

### CoordinatesSearchOptions

Ƭ **CoordinatesSearchOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiKey?` | `string` | Custom MapTiler Cloud API key to use instead of the one in global `config` |
| `exports?` | `boolean` | Show exports in WKT and Proj4 notations (default: false) |
| `limit?` | `number` | Maximum number of results returned (default: 10) |
| `transformations?` | `boolean` | Show detailed transformations for each CRS (default: false) |

#### Defined in

[src/services/coordinates.ts:11](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/coordinates.ts#L11)

___

### CoordinatesTransformOptions

Ƭ **CoordinatesTransformOptions**: `Object`

Options that can be provided when transforming a coordinate from one CRS to another.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiKey?` | `string` | Custom MapTiler Cloud API key to use instead of the one in global `config` |
| `operations?` | `number` \| `number`[] | List of codes of operations |
| `sourceCrs?` | `number` | Source coordinate reference system (default: 4326) |
| `targetCrs?` | `number` | Target coordinate reference system (default: 4326) |

#### Defined in

[src/services/coordinates.ts:174](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/coordinates.ts#L174)

___

### ElevationParser

Ƭ **ElevationParser**: (`r`: `number`, `g`: `number`, `b`: `number`, `a`: `number`) => `number`

#### Type declaration

▸ (`r`, `g`, `b`, `a`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |
| `g` | `number` |
| `b` | `number` |
| `a` | `number` |

##### Returns

`number`

#### Defined in

[src/demProfiler/getElevation.ts:5](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/demProfiler/getElevation.ts#L5)

___

### FeatureHierarchy

Ƭ **FeatureHierarchy**: `FeatureProperties` & `FeatureBase`

#### Defined in

[src/services/geocoding.ts:159](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/geocoding.ts#L159)

___

### FetchFunction

Ƭ **FetchFunction**: (`url`: `string`, `options`: `object`) => `Promise`<`any`\>

#### Type declaration

▸ (`url`, `options`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `options` | `object` |

##### Returns

`Promise`<`any`\>

#### Defined in

[src/config.ts:1](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/config.ts#L1)

___

### GeocodingFeature

Ƭ **GeocodingFeature**: `Feature`<`Geometry`, `FeatureProperties`\> & `FeatureBase` & { `[key: `place_name_${string}`]`: `string`; `address?`: `string` ; `bbox`: `BBox` ; `center`: [`Coordinates`](README.md#coordinates) ; `context?`: [`FeatureHierarchy`](README.md#featurehierarchy)[] ; `place_name`: `string` ; `place_type`: `string`[] ; `place_type_name`: `string`[] ; `relevance`: `number`  }

#### Defined in

[src/services/geocoding.ts:161](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/geocoding.ts#L161)

___

### GeocodingOptions

Ƭ **GeocodingOptions**: [`CommonForwardAndReverseGeocodingOptions`](README.md#commonforwardandreversegeocodingoptions) & { `autocomplete?`: `boolean` ; `bbox?`: `BBox` ; `country?`: `string`[] ; `fuzzyMatch?`: `boolean` ; `proximity?`: `Position`  }

#### Defined in

[src/services/geocoding.ts:58](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/geocoding.ts#L58)

___

### GeocodingSearchResult

Ƭ **GeocodingSearchResult**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `attribution` | `string` | Attribution of the result |
| `features` | [`GeocodingFeature`](README.md#geocodingfeature)[] | Array of features found |
| `query` | `string`[] | Tokenized search query |
| `type` | ``"FeatureCollection"`` | - |

#### Defined in

[src/services/geocoding.ts:213](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/geocoding.ts#L213)

___

### GeolocationInfoOptions

Ƭ **GeolocationInfoOptions**: `Object`

Options that can be provided to get user data.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiKey?` | `string` | Custom MapTiler Cloud API key to use instead of the one in global `config` |

#### Defined in

[src/services/geolocation.ts:14](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/geolocation.ts#L14)

___

### GeolocationResult

Ƭ **GeolocationResult**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `city?` | `string` | Name of the city Example: Zurich |
| `continent?` | `string` | Name of the continent Example: Europe |
| `continent_code?` | `string` | Two-letter code of the continent Example: EU |
| `country?` | `string` | Name of the country Example: Switzerland |
| `country_bounds?` | `BBox` | Bounds of the country in WGS84 degrees [west, south, east, north]. Example: [5.95538,45.818852,10.490936,47.809357] |
| `country_code?` | `string` | Two-letter code of the country ISO 3166-1 alpha-2 codes Example: CH |
| `country_languages?` | `string`[] | Official country languages in ISO 639-1 format. ISO 639-1 codes Example: ["de","fr","it"] |
| `eu?` | `boolean` | Indicated whether the country is part of the European Union. |
| `latitude?` | `number` | Latitude of the location Example: 47.36667 |
| `longitude?` | `number` | Longitude of the location Example: 8.55 |
| `postal?` | `string` | Postal code Example: 8000 |
| `region?` | `string` | If known, the ISO 3166-2 name for the first level region. ISO 3166-2 codes Example: Zurich |
| `region_code?` | `string` | If known, the ISO 3166-2 code for the first level region. ISO 3166-2 codes Example: ZH |
| `timezone?` | `string` | Name of the timezone Example: Europe/Zurich |

#### Defined in

[src/services/geolocation.ts:21](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/geolocation.ts#L21)

___

### GetDataOptions

Ƭ **GetDataOptions**: `Object`

Options that can be provided to get user data.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiKey?` | `string` | Custom MapTiler Cloud API key to use instead of the one in global `config` |

#### Defined in

[src/services/data.ts:14](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/data.ts#L14)

___

### LanguageGeocodingOptions

Ƭ **LanguageGeocodingOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `language?` | [`LanguageGeocodingString`](README.md#languagegeocodingstring) \| [`LanguageGeocodingString`](README.md#languagegeocodingstring)[] | Prefer results in specific language. It’s possible to specify multiple values. |

#### Defined in

[src/services/geocoding.ts:18](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/geocoding.ts#L18)

___

### LanguageGeocodingString

Ƭ **LanguageGeocodingString**: `Values`<typeof [`LanguageGeocoding`](README.md#languagegeocoding)\>

Built-in languages values as strings

#### Defined in

[src/language.ts:69](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/language.ts#L69)

___

### MapStylePreset

Ƭ **MapStylePreset**: `Object`

Type for object containing style details

#### Type declaration

| Name | Type |
| :------ | :------ |
| `description` | `string` |
| `name` | `string` |
| `referenceStyleID` | `string` |
| `variants` | { `description`: `string` ; `id`: `string` ; `imageURL`: `string` ; `name`: `string` ; `variantType`: `string`  }[] |

#### Defined in

[src/mapstyle.ts:29](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/mapstyle.ts#L29)

___

### MapStyleType

Ƭ **MapStyleType**: `Object`

All the styles and variants maintained by MapTiler.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `BACKDROP` | [`ReferenceMapStyle`](classes/ReferenceMapStyle.md) & { `DARK`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `DEFAULT`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `LIGHT`: [`MapStyleVariant`](classes/MapStyleVariant.md)  } | Neutral greyscale style with hillshading suitable for colorful terrain-aware visualization |
| `BASIC` | [`ReferenceMapStyle`](classes/ReferenceMapStyle.md) & { `DARK`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `DEFAULT`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `LIGHT`: [`MapStyleVariant`](classes/MapStyleVariant.md)  } | A minimalist street-oriented style without POI |
| `BRIGHT` | [`ReferenceMapStyle`](classes/ReferenceMapStyle.md) & { `DARK`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `DEFAULT`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `LIGHT`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `PASTEL`: [`MapStyleVariant`](classes/MapStyleVariant.md)  } | A bright street-oriented style, a nice alternative to `streets` |
| `DATAVIZ` | [`ReferenceMapStyle`](classes/ReferenceMapStyle.md) & { `DARK`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `DEFAULT`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `LIGHT`: [`MapStyleVariant`](classes/MapStyleVariant.md)  } | Minimalist style, perfect for data visualization |
| `HYBRID` | [`ReferenceMapStyle`](classes/ReferenceMapStyle.md) & { `DEFAULT`: [`MapStyleVariant`](classes/MapStyleVariant.md)  } | High resolution imagery with labels, political borders and roads. |
| `OCEAN` | [`ReferenceMapStyle`](classes/ReferenceMapStyle.md) & { `DEFAULT`: [`MapStyleVariant`](classes/MapStyleVariant.md)  } | Explore deep see trenches and mountains, with isolines and depth labels |
| `OPENSTREETMAP` | [`ReferenceMapStyle`](classes/ReferenceMapStyle.md) & { `DEFAULT`: [`MapStyleVariant`](classes/MapStyleVariant.md)  } | Classic OpenStreetMap style |
| `OUTDOOR` | [`ReferenceMapStyle`](classes/ReferenceMapStyle.md) & { `DARK`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `DEFAULT`: [`MapStyleVariant`](classes/MapStyleVariant.md)  } | Suitable for outdoor activities. With elevation isolines and hillshading. |
| `SATELLITE` | [`ReferenceMapStyle`](classes/ReferenceMapStyle.md) & { `DEFAULT`: [`MapStyleVariant`](classes/MapStyleVariant.md)  } | High resolution imagery only, without any label. |
| `STREETS` | [`ReferenceMapStyle`](classes/ReferenceMapStyle.md) & { `DARK`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `DEFAULT`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `LIGHT`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `NIGHT`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `PASTEL`: [`MapStyleVariant`](classes/MapStyleVariant.md)  } | Suitable for navigation, with high level of detail on urban areas, plenty of POIs and 3D buildings |
| `TONER` | [`ReferenceMapStyle`](classes/ReferenceMapStyle.md) & { `BACKGROUND`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `DEFAULT`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `LINES`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `LITE`: [`MapStyleVariant`](classes/MapStyleVariant.md)  } | A bold very high contrast black and white (no gray!) style for the city |
| `TOPO` | [`ReferenceMapStyle`](classes/ReferenceMapStyle.md) & { `DARK`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `DEFAULT`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `PASTEL`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `SHINY`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `TOPOGRAPHIQUE`: [`MapStyleVariant`](classes/MapStyleVariant.md)  } | A nice high-contrast, yet less saturated alternative to the `outdoor` style, with hillshading, 3D buildings and fairly high street details |
| `VOYAGER` | [`ReferenceMapStyle`](classes/ReferenceMapStyle.md) & { `DARK`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `DEFAULT`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `LIGHT`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `VINTAGE`: [`MapStyleVariant`](classes/MapStyleVariant.md)  } | A nice alternative to `streets` with a soft color palette |
| `WINTER` | [`ReferenceMapStyle`](classes/ReferenceMapStyle.md) & { `DARK`: [`MapStyleVariant`](classes/MapStyleVariant.md) ; `DEFAULT`: [`MapStyleVariant`](classes/MapStyleVariant.md)  } | Suitabe for winter outdoor activities. With ski tracks, elevation isolines and hillshading. |

#### Defined in

[src/mapstyle.ts:258](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/mapstyle.ts#L258)

___

### ReverseGeocodingOptions

Ƭ **ReverseGeocodingOptions**: [`CommonForwardAndReverseGeocodingOptions`](README.md#commonforwardandreversegeocodingoptions)

#### Defined in

[src/services/geocoding.ts:86](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/geocoding.ts#L86)

___

### StaticMapBaseOptions

Ƭ **StaticMapBaseOptions**: `Object`

Base set of options that can be provided to all the types of static maps

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiKey?` | `string` | Custom MapTiler Cloud API key to use instead of the one in global `config` |
| `attribution?` | ``"bottomright"`` \| ``"bottomleft"`` \| ``"topleft"`` \| ``"topright"`` \| ``false`` | Placement of the attribution. Can also be set to `false` to not show attribution. Default: `"bottomright"` |
| `format?` | ``"png"`` \| ``"jpg"`` \| ``"webp"`` | Image format. Default: `"png"` |
| `height?` | `number` | Height of the output image. Maximum value: `2048`. Default: `1024` |
| `hiDPI?` | `boolean` | Double the size of the static map image to support hiDPI/Retina monitors. Default: `false` |
| `markerAnchor?` | ``"top"`` \| ``"left"`` \| ``"bottom"`` \| ``"right"`` \| ``"center"`` \| ``"topleft"`` \| ``"bottomleft"`` \| ``"topright"`` \| ``"bottomright"`` | Position of the marker regarding its coordinates. Applies only: - with a custom icon provided with `markerIcon` - if one or multiple markers positions are provided. Default: `"bottom"` |
| `markerIcon?` | `string` | URL of the marker image. Applies only if one or multiple markers positions are provided. Default: none provided |
| `markers?` | [`StaticMapMarker`](README.md#staticmapmarker) \| [`StaticMapMarker`](README.md#staticmapmarker)[] | A marker or list of markers to show on the map Default: none provided |
| `path?` | `Position`[] | Draw a path or polygon on top of the map. If the path is too long it will be simplified, yet remaining accurate. Default: none provided |
| `pathFillColor?` | `string` | Color of the filling, also works if the polygon is not closed. The color must be CSS compatible. Examples: - long form hex without transparency `"#FF0000"` (red) - short form hex without transparency `"#F00"` (red) - long form hex with transparency `"#FF000008"` (red, half opacity) - short form hex with transparency `"#F008"` (red, half opacity) - CSS color shorthands: `"red"`, `"chartreuse"`, etc. - decimal RGB values without transparency: `"rgb(128, 100, 255)"` - decimal RGB values with transparency: `"rgb(128, 100, 255, 0.5)"` Default: none (transparent filling) |
| `pathStrokeColor?` | `string` | Color of the path line. The color must be CSS compatible. Examples: - long form hex without transparency `"#FF0000"` (red) - short form hex without transparency `"#F00"` (red) - long form hex with transparency `"#FF000008"` (red, half opacity) - short form hex with transparency `"#F008"` (red, half opacity) - CSS color shorthands: `"red"`, `"chartreuse"`, etc. - decimal RGB values without transparency: `"rgb(128, 100, 255)"` - decimal RGB values with transparency: `"rgb(128, 100, 255, 0.5)"` Default: `"blue"` |
| `pathWidth?` | `number` | Width of the path line in pixel. It can be floating point precision (ex: `0.5`) Default: `1` if `hiDPI` is `false` and `2` if `hiDPI` is `true`. |
| `style?` | `string` \| [`ReferenceMapStyle`](classes/ReferenceMapStyle.md) \| [`MapStyleVariant`](classes/MapStyleVariant.md) | Style of the map (not full style URL). Example: "winter", "streets-v2". Default: `"streets-v2"` |
| `width?` | `number` | Width of the output image. Maximum value: `2048`. Default: `1024` |

#### Defined in

[src/services/staticMaps.ts:10](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/staticMaps.ts#L10)

___

### StaticMapMarker

Ƭ **StaticMapMarker**: [`number`, `number`, `string`]

Definition of a maker to show on a static map

#### Defined in

[src/services/staticMaps.ts:146](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/staticMaps.ts#L146)

___

### TileRequest

Ƭ **TileRequest**: (`x`: `number`, `y`: `number`, `zoom`: `number`) => `Promise`<[`TileImage`](interfaces/TileImage.md)\>

#### Type declaration

▸ (`x`, `y`, `zoom`): `Promise`<[`TileImage`](interfaces/TileImage.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |
| `zoom` | `number` |

##### Returns

`Promise`<[`TileImage`](interfaces/TileImage.md)\>

#### Defined in

[src/demProfiler/index.ts:17](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/demProfiler/index.ts#L17)

___

### XYZ

Ƭ **XYZ**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `x?` | `number` |
| `y?` | `number` |
| `z?` | `number` |

#### Defined in

[src/services/coordinates.ts:153](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/coordinates.ts#L153)

## Variables

### LanguageGeocoding

• `Const` **LanguageGeocoding**: `Object`

Languages. Note that not all the languages of this list are available but the compatibility list may be expanded in the future.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ALBANIAN` | `string` |
| `ARABIC` | `string` |
| `ARMENIAN` | `string` |
| `AUTO` | `string` |
| `AZERBAIJANI` | `string` |
| `BELORUSSIAN` | `string` |
| `BOSNIAN` | `string` |
| `BRETON` | `string` |
| `BULGARIAN` | `string` |
| `CATALAN` | `string` |
| `CHINESE` | `string` |
| `CROATIAN` | `string` |
| `CZECH` | `string` |
| `DANISH` | `string` |
| `DUTCH` | `string` |
| `ENGLISH` | `string` |
| `ESPERANTO` | `string` |
| `ESTONIAN` | `string` |
| `FINNISH` | `string` |
| `FRENCH` | `string` |
| `FRISIAN` | `string` |
| `GEORGIAN` | `string` |
| `GERMAN` | `string` |
| `GREEK` | `string` |
| `HEBREW` | `string` |
| `HUNGARIAN` | `string` |
| `ICELANDIC` | `string` |
| `IRISH` | `string` |
| `ITALIAN` | `string` |
| `JAPANESE` | `string` |
| `KANNADA` | `string` |
| `KAZAKH` | `string` |
| `KOREAN` | `string` |
| `LATVIAN` | `string` |
| `LITHUANIAN` | `string` |
| `LUXEMBOURGISH` | `string` |
| `MACEDONIAN` | `string` |
| `MALTESE` | `string` |
| `NORWEGIAN` | `string` |
| `POLISH` | `string` |
| `PORTUGUESE` | `string` |
| `ROMANIAN` | `string` |
| `ROMANSH` | `string` |
| `ROMAN_LATIN` | `string` |
| `RUSSIAN` | `string` |
| `SCOTTISH_GAELIC` | `string` |
| `SERBIAN_CYRILLIC` | `string` |
| `SLOVAK` | `string` |
| `SLOVENE` | `string` |
| `SPANISH` | `string` |
| `SWEDISH` | `string` |
| `THAI` | `string` |
| `TURKISH` | `string` |
| `UKRAINIAN` | `string` |
| `WELSH` | `string` |

#### Defined in

[src/language.ts:4](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/language.ts#L4)

___

### MapStyle

• `Const` **MapStyle**: [`MapStyleType`](README.md#mapstyletype)

Contains all the reference map style created by MapTiler team as well as all the variants.
For example, `MapStyle.STREETS` and the variants:
- `MapStyle.STREETS.DARK`
- `MapStyle.STREETS.LIGHT`
- `MapStyle.STREETS.PASTEL`

#### Defined in

[src/mapstyle.ts:968](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/mapstyle.ts#L968)

___

### config

• `Const` **config**: [`ClientConfig`](classes/ClientConfig.md)

Configuration object

#### Defined in

[src/config.ts:63](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/config.ts#L63)

___

### coordinates

• `Const` **coordinates**: `Object`

The **coordinate** namespace contains asynchronous functions to call the [MapTiler Coordinate API](https://docs.maptiler.com/cloud/api/coordinates/).
The goal of the **Coordinate API* is query information about spatial coordinate reference system (CRS) as well as to transform coordinates from one CRS to another.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `search` | (`query`: `string`, `options`: [`CoordinatesSearchOptions`](README.md#coordinatessearchoptions)) => `Promise`<[`CoordinateSearchResult`](README.md#coordinatesearchresult)\> |
| `transform` | (`positions`: `Position` \| `Position`[], `options`: [`CoordinatesTransformOptions`](README.md#coordinatestransformoptions)) => `Promise`<[`CoordinateTransformResult`](README.md#coordinatetransformresult)\> |

#### Defined in

[src/services/coordinates.ts:253](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/coordinates.ts#L253)

___

### data

• `Const` **data**: `Object`

The **data** namespace contains an asynchronous function to call the [MapTiler Data API](https://docs.maptiler.com/cloud/api/data/).
The **Data API** provides a way to retrieve user data in GeoJSON format.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `get` | (`dataId`: `string`, `options`: [`GetDataOptions`](README.md#getdataoptions)) => `Promise`<`FeatureCollection`\> |

#### Defined in

[src/services/data.ts:59](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/data.ts#L59)

___

### earthRadius

• `Const` **earthRadius**: ``6371008.8``

#### Defined in

[src/geometry/util.ts:1](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/geometry/util.ts#L1)

___

### geocoding

• `Const` **geocoding**: `Object`

The **geocoding** namespace contains asynchronous functions to call the [MapTiler Geocoding API](https://docs.maptiler.com/cloud/api/geocoding/).
The **Geocoding API** provides ways to get geographic coordinates from a human-readable search query of a place (forward geocoding)
and to get the location details (country, city, street, etc.) from a geographic coordinate (reverse geocoding);

#### Type declaration

| Name | Type |
| :------ | :------ |
| `batch` | (`queries`: `string`[], `options`: [`GeocodingOptions`](README.md#geocodingoptions)) => `Promise`<[`GeocodingSearchResult`](README.md#geocodingsearchresult)[]\> |
| `byId` | (`id`: `string`, `options`: [`LanguageGeocodingOptions`](README.md#languagegeocodingoptions)) => `Promise`<[`GeocodingSearchResult`](README.md#geocodingsearchresult)\> |
| `forward` | (`query`: `string`, `options`: [`GeocodingOptions`](README.md#geocodingoptions)) => `Promise`<[`GeocodingSearchResult`](README.md#geocodingsearchresult)\> |
| `language` | { `ALBANIAN`: `string` = "sq"; `ARABIC`: `string` = "ar"; `ARMENIAN`: `string` = "hy"; `AUTO`: `string` = "auto"; `AZERBAIJANI`: `string` = "az"; `BELORUSSIAN`: `string` = "be"; `BOSNIAN`: `string` = "bs"; `BRETON`: `string` = "br"; `BULGARIAN`: `string` = "bg"; `CATALAN`: `string` = "ca"; `CHINESE`: `string` = "zh"; `CROATIAN`: `string` = "hr"; `CZECH`: `string` = "cs"; `DANISH`: `string` = "da"; `DUTCH`: `string` = "nl"; `ENGLISH`: `string` = "en"; `ESPERANTO`: `string` = "eo"; `ESTONIAN`: `string` = "et"; `FINNISH`: `string` = "fi"; `FRENCH`: `string` = "fr"; `FRISIAN`: `string` = "fy"; `GEORGIAN`: `string` = "ka"; `GERMAN`: `string` = "de"; `GREEK`: `string` = "el"; `HEBREW`: `string` = "he"; `HUNGARIAN`: `string` = "hu"; `ICELANDIC`: `string` = "is"; `IRISH`: `string` = "ga"; `ITALIAN`: `string` = "it"; `JAPANESE`: `string` = "ja"; `KANNADA`: `string` = "kn"; `KAZAKH`: `string` = "kk"; `KOREAN`: `string` = "ko"; `LATVIAN`: `string` = "lv"; `LITHUANIAN`: `string` = "lt"; `LUXEMBOURGISH`: `string` = "lb"; `MACEDONIAN`: `string` = "mk"; `MALTESE`: `string` = "mt"; `NORWEGIAN`: `string` = "no"; `POLISH`: `string` = "pl"; `PORTUGUESE`: `string` = "pt"; `ROMANIAN`: `string` = "ro"; `ROMANSH`: `string` = "rm"; `ROMAN_LATIN`: `string` = "la"; `RUSSIAN`: `string` = "ru"; `SCOTTISH_GAELIC`: `string` = "gd"; `SERBIAN_CYRILLIC`: `string` = "sr"; `SLOVAK`: `string` = "sk"; `SLOVENE`: `string` = "sl"; `SPANISH`: `string` = "es"; `SWEDISH`: `string` = "sv"; `THAI`: `string` = "th"; `TURKISH`: `string` = "tr"; `UKRAINIAN`: `string` = "uk"; `WELSH`: `string` = "cy" } |
| `language.ALBANIAN` | `string` |
| `language.ARABIC` | `string` |
| `language.ARMENIAN` | `string` |
| `language.AUTO` | `string` |
| `language.AZERBAIJANI` | `string` |
| `language.BELORUSSIAN` | `string` |
| `language.BOSNIAN` | `string` |
| `language.BRETON` | `string` |
| `language.BULGARIAN` | `string` |
| `language.CATALAN` | `string` |
| `language.CHINESE` | `string` |
| `language.CROATIAN` | `string` |
| `language.CZECH` | `string` |
| `language.DANISH` | `string` |
| `language.DUTCH` | `string` |
| `language.ENGLISH` | `string` |
| `language.ESPERANTO` | `string` |
| `language.ESTONIAN` | `string` |
| `language.FINNISH` | `string` |
| `language.FRENCH` | `string` |
| `language.FRISIAN` | `string` |
| `language.GEORGIAN` | `string` |
| `language.GERMAN` | `string` |
| `language.GREEK` | `string` |
| `language.HEBREW` | `string` |
| `language.HUNGARIAN` | `string` |
| `language.ICELANDIC` | `string` |
| `language.IRISH` | `string` |
| `language.ITALIAN` | `string` |
| `language.JAPANESE` | `string` |
| `language.KANNADA` | `string` |
| `language.KAZAKH` | `string` |
| `language.KOREAN` | `string` |
| `language.LATVIAN` | `string` |
| `language.LITHUANIAN` | `string` |
| `language.LUXEMBOURGISH` | `string` |
| `language.MACEDONIAN` | `string` |
| `language.MALTESE` | `string` |
| `language.NORWEGIAN` | `string` |
| `language.POLISH` | `string` |
| `language.PORTUGUESE` | `string` |
| `language.ROMANIAN` | `string` |
| `language.ROMANSH` | `string` |
| `language.ROMAN_LATIN` | `string` |
| `language.RUSSIAN` | `string` |
| `language.SCOTTISH_GAELIC` | `string` |
| `language.SERBIAN_CYRILLIC` | `string` |
| `language.SLOVAK` | `string` |
| `language.SLOVENE` | `string` |
| `language.SPANISH` | `string` |
| `language.SWEDISH` | `string` |
| `language.THAI` | `string` |
| `language.TURKISH` | `string` |
| `language.UKRAINIAN` | `string` |
| `language.WELSH` | `string` |
| `reverse` | (`position`: `Position`, `options`: [`CommonForwardAndReverseGeocodingOptions`](README.md#commonforwardandreversegeocodingoptions)) => `Promise`<[`GeocodingSearchResult`](README.md#geocodingsearchresult)\> |

#### Defined in

[src/services/geocoding.ts:450](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/geocoding.ts#L450)

___

### geolocation

• `Const` **geolocation**: `Object`

The **geolocation** namespace contains an asynchronous function to call the [MapTiler Geolocation API](https://docs.maptiler.com/cloud/api/geolocation/).
The **Geolocation API** provides a way to retrieve the IP address as well as geographic informations of a machine performing the query (most likely: a user)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `info` | (`options`: [`GeolocationInfoOptions`](README.md#geolocationinfooptions)) => `Promise`<[`GeolocationResult`](README.md#geolocationresult)\> |

#### Defined in

[src/services/geolocation.ts:135](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/geolocation.ts#L135)

___

### mapStylePresetList

• `Const` **mapStylePresetList**: [`MapStylePreset`](README.md#mapstylepreset)[]

#### Defined in

[src/mapstyle.ts:503](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/mapstyle.ts#L503)

___

### staticMaps

• `Const` **staticMaps**: `Object`

The **staticMaps** namespace contains an synchronous function build image URL of static map, as specified by the [MapTiler Static Map API](https://docs.maptiler.com/cloud/api/static-maps/).
The URL of static maps can then be used within a `<img />` markup element, as the `src` property value.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `automatic` | (`options`: [`BoundedStaticMapOptions`](README.md#boundedstaticmapoptions)) => `string` |
| `bounded` | (`boundingBox`: `BBox`, `options`: [`BoundedStaticMapOptions`](README.md#boundedstaticmapoptions)) => `string` |
| `centered` | (`center`: `Position`, `zoom`: `number`, `options`: [`StaticMapBaseOptions`](README.md#staticmapbaseoptions)) => `string` |

#### Defined in

[src/services/staticMaps.ts:457](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/services/staticMaps.ts#L457)

## Functions

### area

▸ **area**(`area`): `number`

Finds the area of a Polygon or MultiPolygon in square meters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `area` | `Polygon` \| `MultiPolygon` \| `Feature`<`Polygon` \| `MultiPolygon`, { `[name: string]`: `any`;  }\> |

#### Returns

`number`

#### Defined in

[src/geometry/area.ts:7](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/geometry/area.ts#L7)

___

### defaultElevationParser

▸ **defaultElevationParser**(`r`, `g`, `b`): `number`

Default elevation parser used by Mapbox and Maplibre. Result is in meters

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |
| `g` | `number` |
| `b` | `number` |

#### Returns

`number`

#### Defined in

[src/demProfiler/getElevation.ts:40](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/demProfiler/getElevation.ts#L40)

___

### degToRad

▸ **degToRad**(`degrees`): `number`

Convert degrees to Radians

#### Parameters

| Name | Type |
| :------ | :------ |
| `degrees` | `number` |

#### Returns

`number`

#### Defined in

[src/geometry/util.ts:9](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/geometry/util.ts#L9)

___

### expandMapStyle

▸ **expandMapStyle**(`style`): `string`

Expand the map style provided as argument of the Map constructor

#### Parameters

| Name | Type |
| :------ | :------ |
| `style` | `any` |

#### Returns

`string`

#### Defined in

[src/mapstyle.ts:6](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/mapstyle.ts#L6)

___

### getZoomLevelResolution

▸ **getZoomLevelResolution**(`latitude`, `zoom`, `tileSize?`): `number`

Given a latitude and zoom level, determine the max distance each segment can be in meters

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `latitude` | `number` | `undefined` |
| `zoom` | `number` | `undefined` |
| `tileSize` | `number` | `512` |

#### Returns

`number`

#### Defined in

[src/geometry/util.ts:19](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/geometry/util.ts#L19)

___

### lineDistance

▸ **lineDistance**(`line`): `number`

Get the distance of a LineString in meters

#### Parameters

| Name | Type |
| :------ | :------ |
| `line` | `LineString` \| `Position`[] \| `Feature`<`LineString`, { `[name: string]`: `any`;  }\> |

#### Returns

`number`

#### Defined in

[src/geometry/distance.ts:4](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/geometry/distance.ts#L4)

___

### mToFt

▸ **mToFt**(`m`): `number`

Convert meters to feet

#### Parameters

| Name | Type |
| :------ | :------ |
| `m` | `number` |

#### Returns

`number`

#### Defined in

[src/geometry/util.ts:4](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/geometry/util.ts#L4)

___

### multiPolygonArea

▸ **multiPolygonArea**(`multiPoly`): `number`

Finds the area of a MultiPolygon in square meters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `multiPoly` | `MultiPolygon` \| `Position`[][][] |

#### Returns

`number`

#### Defined in

[src/geometry/area.ts:24](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/geometry/area.ts#L24)

___

### pointDistance

▸ **pointDistance**(`from`, `to`): `number`

Get the distance between two lon-lat pairs in meters

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | `Position` |
| `to` | `Position` |

#### Returns

`number`

#### Defined in

[src/geometry/distance.ts:31](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/geometry/distance.ts#L31)

___

### polygonArea

▸ **polygonArea**(`poly`): `number`

Finds the area of a Polygon in square meters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `poly` | `Polygon` \| `Position`[][] |

#### Returns

`number`

#### Defined in

[src/geometry/area.ts:38](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/geometry/area.ts#L38)

___

### profileLineString

▸ **profileLineString**(`path`, `options`): `Promise`<[`Output`](interfaces/Output.md)\>

Given a GeoJSON LineString or Feature<Linestring>, return the elevation data for the path.
This algorithm will automatically break the path into denser segments relative to the zoom level if necessary.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `LineString` \| `Feature`<`LineString`, { `[name: string]`: `any`;  }\> |
| `options` | [`Options`](interfaces/Options.md) |

#### Returns

`Promise`<[`Output`](interfaces/Output.md)\>

#### Defined in

[src/demProfiler/index.ts:70](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/demProfiler/index.ts#L70)

___

### radToDeg

▸ **radToDeg**(`radians`): `number`

Convert radians to degrees

#### Parameters

| Name | Type |
| :------ | :------ |
| `radians` | `number` |

#### Returns

`number`

#### Defined in

[src/geometry/util.ts:14](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/geometry/util.ts#L14)

___

### xyzToTileID

▸ **xyzToTileID**(`x`, `y`, `zoom`): `number`

Convert a tile's zoom-x-y to a number hash

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |
| `zoom` | `number` |

#### Returns

`number`

#### Defined in

[src/geometry/util.ts:32](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/geometry/util.ts#L32)

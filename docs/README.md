MapTiler Client JS

# MapTiler Client JS

## Table of contents

### Classes

- [ClientConfig](classes/ClientConfig.md)
- [ServiceError](classes/ServiceError.md)

### Type Aliases

- [AutomaticStaticMapOptions](README.md#automaticstaticmapoptions)
- [Bbox](README.md#bbox)
- [BoundedStaticMapOptions](README.md#boundedstaticmapoptions)
- [CenteredStaticMapOptions](README.md#centeredstaticmapoptions)
- [CoordinatesSearchOptions](README.md#coordinatessearchoptions)
- [CoordinatesTransformOptions](README.md#coordinatestransformoptions)
- [FetchFunction](README.md#fetchfunction)
- [GeocodingOptions](README.md#geocodingoptions)
- [LanguageGeocodingString](README.md#languagegeocodingstring)
- [LngLat](README.md#lnglat)
- [LngLatArray](README.md#lnglatarray)
- [StaticMapBaseOptions](README.md#staticmapbaseoptions)
- [StaticMapMarker](README.md#staticmapmarker)

### Variables

- [LanguageGeocoding](README.md#languagegeocoding)
- [config](README.md#config)
- [coordinates](README.md#coordinates)
- [data](README.md#data)
- [geocoding](README.md#geocoding)
- [geolocation](README.md#geolocation)
- [staticMaps](README.md#staticmaps)

## Type Aliases

### AutomaticStaticMapOptions

Ƭ **AutomaticStaticMapOptions**: [`BoundedStaticMapOptions`](README.md#boundedstaticmapoptions)

Options that can be provided to automatic static maps

#### Defined in

[services/staticMaps.ts:135](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/services/staticMaps.ts#L135)

___

### Bbox

Ƭ **Bbox**: `Object`

Bounding box (lng/lat axis aligned)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `northEast` | [`LngLat`](README.md#lnglat) | North-east corner WGS84 coordinates |
| `southWest` | [`LngLat`](README.md#lnglat) | South-west corner WGS84 coordinates |

#### Defined in

[generalTypes.ts:23](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/generalTypes.ts#L23)

___

### BoundedStaticMapOptions

Ƭ **BoundedStaticMapOptions**: [`StaticMapBaseOptions`](README.md#staticmapbaseoptions) & { `padding?`: `number`  }

Options that can be provided to bounded static maps

#### Defined in

[services/staticMaps.ts:124](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/services/staticMaps.ts#L124)

___

### CenteredStaticMapOptions

Ƭ **CenteredStaticMapOptions**: [`StaticMapBaseOptions`](README.md#staticmapbaseoptions)

Options that can be provided to centered static maps

#### Defined in

[services/staticMaps.ts:119](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/services/staticMaps.ts#L119)

___

### CoordinatesSearchOptions

Ƭ **CoordinatesSearchOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `exports?` | `boolean` | Show exports in WKT and Proj4 notations (default: false) |
| `limit?` | `number` | Maximum number of results returned (default: 10) |
| `transformations?` | `boolean` | Show detailed transformations for each CRS (default: false) |

#### Defined in

[services/coordinates.ts:7](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/services/coordinates.ts#L7)

___

### CoordinatesTransformOptions

Ƭ **CoordinatesTransformOptions**: `Object`

Options that can be provided when transforming a coordinate from one CRS to another.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `operations?` | `number` \| `number`[] | List of codes of operations |
| `sourceCrs?` | `number` | Source coordinate reference system (default: 4326) |
| `targetCrs?` | `number` | Target coordinate reference system (default: 4326) |

#### Defined in

[services/coordinates.ts:74](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/services/coordinates.ts#L74)

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

[config.ts:1](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/config.ts#L1)

___

### GeocodingOptions

Ƭ **GeocodingOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `bbox?` | [`Bbox`](README.md#bbox) | Only search for results in the specified area. |
| `language?` | [`LanguageGeocodingString`](README.md#languagegeocodingstring) \| [`LanguageGeocodingString`](README.md#languagegeocodingstring)[] | Prefer results in specific language. It’s possible to specify multiple values. |
| `proximity?` | [`LngLat`](README.md#lnglat) | Prefer results close to a specific location. |

#### Defined in

[services/geocoding.ts:12](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/services/geocoding.ts#L12)

___

### LanguageGeocodingString

Ƭ **LanguageGeocodingString**: `Values`<typeof [`LanguageGeocoding`](README.md#languagegeocoding)\>

Built-in languages values as strings

#### Defined in

[language.ts:69](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/language.ts#L69)

___

### LngLat

Ƭ **LngLat**: `Object`

WGS84 longitude and latitude as object

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `lat` | `number` | Latitude |
| `lng` | `number` | Longitude |

#### Defined in

[generalTypes.ts:4](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/generalTypes.ts#L4)

___

### LngLatArray

Ƭ **LngLatArray**: [`number`, `number`]

WGS84 longitude and latitude as array of the form [lng, lat]

#### Defined in

[generalTypes.ts:18](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/generalTypes.ts#L18)

___

### StaticMapBaseOptions

Ƭ **StaticMapBaseOptions**: `Object`

Base set of options that can be provided to all the types of static maps

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `attribution?` | ``"bottomright"`` \| ``"bottomleft"`` \| ``"topleft"`` \| ``"topright"`` \| ``false`` | Placement of the attribution. Can also be set to `false` to not show attribution. Default: `"bottomright"` |
| `format?` | ``"png"`` \| ``"jpg"`` \| ``"webp"`` | Image format. Default: `"png"` |
| `height?` | `number` | Height of the output image. Maximum value: `2048`. Default: `1024` |
| `hiDPI?` | `boolean` | Double the size of the static map image to support hiDPI/Retina monitors. Default: `false` |
| `marker?` | [`StaticMapMarker`](README.md#staticmapmarker) \| [`StaticMapMarker`](README.md#staticmapmarker)[] | A marker or list of markers to show on the map Default: none provided |
| `markerAnchor?` | ``"top"`` \| ``"left"`` \| ``"bottom"`` \| ``"right"`` \| ``"center"`` \| ``"topleft"`` \| ``"bottomleft"`` \| ``"topright"`` \| ``"bottomright"`` | Position of the marker regarding its coordinates. Applies only: - with a custom icon provided with `markerIcon` - if one or multiple markers positions are provided. Default: `"bottom"` |
| `markerIcon?` | `string` | URL of the marker image. Applies only if one or multiple markers positions are provided. Default: none provided |
| `path?` | [`LngLatArray`](README.md#lnglatarray)[] | Draw a path or polygon on top of the map. If the path is too long it will be simplified, yet remaining accurate. Default: none provided |
| `pathFillColor?` | `string` | Color of the filling, also works if the polygon is not closed. The color must be CSS compatible. Examples: - long form hex without transparency `"#FF0000"` (red) - short form hex without transparency `"#F00"` (red) - long form hex with transparency `"#FF000008"` (red, half opacity) - short form hex with transparency `"#F008"` (red, half opacity) - CSS color shorthands: `"red"`, `"chartreuse"`, etc. - decimal RGB values without transparency: `"rgb(128, 100, 255)"` - decimal RGB values with transparency: `"rgb(128, 100, 255, 0.5)"` Default: none (transparent filling) |
| `pathStrokeColor?` | `string` | Color of the path line. The color must be CSS compatible. Examples: - long form hex without transparency `"#FF0000"` (red) - short form hex without transparency `"#F00"` (red) - long form hex with transparency `"#FF000008"` (red, half opacity) - short form hex with transparency `"#F008"` (red, half opacity) - CSS color shorthands: `"red"`, `"chartreuse"`, etc. - decimal RGB values without transparency: `"rgb(128, 100, 255)"` - decimal RGB values with transparency: `"rgb(128, 100, 255, 0.5)"` Default: `"blue"` |
| `pathWidth?` | `number` | Width of the path line in pixel. It can be floating point precision (ex: `0.5`) Default: `1` if `hiDPI` is `false` and `2` if `hiDPI` is `true`. |
| `style?` | `string` | Style of the map (not full style URL). Example: "winter", "streets-v2". Default: `"streets-v2"` |
| `width?` | `number` | Width of the output image. Maximum value: `2048`. Default: `1024` |

#### Defined in

[services/staticMaps.ts:9](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/services/staticMaps.ts#L9)

___

### StaticMapMarker

Ƭ **StaticMapMarker**: `Object`

Definition of a maker to show on a static map

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `color?` | `string` | Color of the marker with CSS syntax. Applies only if a custom `markerIcon` is not provided. |
| `lat` | `number` | latitude of the marker |
| `lng` | `number` | Longitude of the marker |

#### Defined in

[services/staticMaps.ts:140](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/services/staticMaps.ts#L140)

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

[language.ts:4](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/language.ts#L4)

___

### config

• `Const` **config**: [`ClientConfig`](classes/ClientConfig.md)

Configuration object

#### Defined in

[config.ts:63](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/config.ts#L63)

___

### coordinates

• `Const` **coordinates**: `Object`

The **coordinate** namespace contains asynchronous functions to call the [MapTiler Coordinate API](https://docs.maptiler.com/cloud/api/coordinates/).
The goal of the **Coordinate API* is query information about spatial coordinate reference system (CRS) as well as to transform coordinates from one CRS to another.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `search` | (`query`: `string`, `options`: [`CoordinatesSearchOptions`](README.md#coordinatessearchoptions)) => `Promise`<`any`\> |
| `transform` | (`coordinates`: [`LngLat`](README.md#lnglat) \| [`LngLat`](README.md#lnglat)[], `options`: [`CoordinatesTransformOptions`](README.md#coordinatestransformoptions)) => `Promise`<`any`\> |

#### Defined in

[services/coordinates.ts:150](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/services/coordinates.ts#L150)

___

### data

• `Const` **data**: `Object`

The **data** namespace contains an asynchronous function to call the [MapTiler Data API](https://docs.maptiler.com/cloud/api/data/).
The **Data API** provides a way to retrieve user data in GeoJSON format.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `get` | (`dataId`: `string`) => `Promise`<`any`\> |

#### Defined in

[services/data.ts:41](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/services/data.ts#L41)

___

### geocoding

• `Const` **geocoding**: `Object`

The **geocoding** namespace contains asynchronous functions to call the [MapTiler Geocoding API](https://docs.maptiler.com/cloud/api/geocoding/).
The **Geocoding API** provides ways to get geographic coordinates from a human-readable search query of a place (forward geocoding)
and to get the location details (country, city, street, etc.) from a geographic coordinate (reverse geocoding);

#### Type declaration

| Name | Type |
| :------ | :------ |
| `forward` | (`query`: `any`, `options`: [`GeocodingOptions`](README.md#geocodingoptions)) => `Promise`<`any`\> |
| `reverse` | (`lngLat`: [`LngLat`](README.md#lnglat), `options`: [`GeocodingOptions`](README.md#geocodingoptions)) => `Promise`<`any`\> |

#### Defined in

[services/geocoding.ts:166](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/services/geocoding.ts#L166)

___

### geolocation

• `Const` **geolocation**: `Object`

The **geolocation** namespace contains an asynchronous function to call the [MapTiler Geolocation API](https://docs.maptiler.com/cloud/api/geolocation/).
The **Geolocation API** provides a way to retrieve the IP address as well as geographic informations of a machine performing the query (most likely: a user)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `info` | () => `Promise`<`any`\> |

#### Defined in

[services/geolocation.ts:37](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/services/geolocation.ts#L37)

___

### staticMaps

• `Const` **staticMaps**: `Object`

The **staticMaps** namespace contains an synchronous function build image URL of static map, as specified by the [MapTiler Static Map API](https://docs.maptiler.com/cloud/api/static-maps/).
The URL of static maps can then be used within a `<img />` markup element, as the `src` property value.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `automatic` | (`options`: [`BoundedStaticMapOptions`](README.md#boundedstaticmapoptions)) => `string` |
| `bounded` | (`boundingBox`: [`Bbox`](README.md#bbox), `options`: [`BoundedStaticMapOptions`](README.md#boundedstaticmapoptions)) => `string` |
| `centered` | (`center`: [`LngLat`](README.md#lnglat), `zoom`: `number`, `options`: [`StaticMapBaseOptions`](README.md#staticmapbaseoptions)) => `string` |

#### Defined in

[services/staticMaps.ts:450](https://github.com/maptiler/maptiler-client-js/blob/2092476/src/services/staticMaps.ts#L450)

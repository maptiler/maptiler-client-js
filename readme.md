<p align="center">
<a href="https://docs.maptiler.com/client-js/">official page →</a><br>
  <img src="images/maptiler-client-logo.svg" width="400px">
</p>

<p align="center" style="color: #AAA">
  The Javascript & TypeScript API client library to enjoy <a href="https://www.maptiler.com/cloud/">MapTiler Cloud</a>'s <br>services such as geocoding, geolocation and more!
</p>

<p align="center">
  <img src="images/JS-logo.svg" width="20px">
  <img src="images/TS-logo.svg" width="20px">
  <img src="https://img.shields.io/npm/v/@maptiler/client"></img>
  <img src="https://img.shields.io/twitter/follow/maptiler?style=social"></img>
</p>

# API Client Library for JavaScript / TypeScript

## What?

The **MapTiler Client JS** exposes a number of handy functions that wrap API call to [MapTiler Cloud API services](https://docs.maptiler.com/cloud/api), such as:
- [Geocoding forward and reverse](#-geocoding)
- [Geolocation from visitor's IP address](#%EF%B8%8F%EF%B8%8F-geolocation)
- [Coordinate systems search and tranform](#-coordinates)
- [User data fetching as GeoJSON](#-data)
- [Static maps of all sorts](#%EF%B8%8F-static-maps)
- [Elevation lookup with batch features](#-elevation)

## Why?

The project is entirely written in TypeScript and all the function arguments are nicely documented and typed.

- Better developer experience of working with APIs in the code editor - with parameter info, quick info, and member lists.
  - Code completion: reducing typos and other common mistakes
  - Content assist and code hinting providing contextual help
- Type safety - for higher quality code and testing
- Backward compatibility: guaranteed on changes to API endpoints
- Runs: in Node.js or in browser
- Open source license

# Install
```shell
npm install --save @maptiler/client
```

# API documentation
In addition to the details and examples provided in this readme, check out the [complete API documentation](https://labs.maptiler.com/maptiler-client-js).

# Quick start
```ts
// Import the whole library
import * as maptilerClient from '@maptiler/client';

// Or import only the bits you need
import {
  config,
  geocoding,
  geolocation,
  coordinates,
  data,
  staticMaps,
  elevation,
  math,
} from '@maptiler/client';
```

The [examples](examples/) folder includes are featuring usages for **NodeJS**, **browser with UMD** and **browser with ES module**.

# Easy access to MapTiler Cloud API
Here is the list of service wrapper functions that are built-in:

## 🔍 Geocoding
> ✅ Please, use geocoding functions only from client-side (browser) and do not 🚫 **store** or **redistribute** MapTiler Cloud API data. In case of doubt, consult the [terms](https://www.maptiler.com/cloud/terms/#explicitly-prohibited-use) ⚖️

### Forward
You want to know the longitude and latitude of a specific place, use the forward geocoding:
```ts
// in an async function, or as a 'thenable':
const result = await maptilerClient.geocoding.forward('paris');
```
You can provide some options such as:
- the proximity, given a lon-lat position, to sort the results
- one of more languages to get the results into
- a bounding geo box, to restrict the search to a given window

Read more about forward geocoding as well as feature ID query and batch forward geocoding on our [official documentation](https://docs.maptiler.com/client-js/geocoding/#forward).

### Reverse
You wan to tknow the name of a place, given a longitude-latitude? Use the reverse geocoding:
```ts
// in an async function, or as a 'thenable':
const result = await maptilerClient.geocoding.reverse([6.249638, 46.402056]);
```
The same option object as the forward geocoding can be provided.

Read more about reverse geocoding on our [official documentation](https://docs.maptiler.com/client-js/geocoding/#reverse).

### Language
For both *forward* and *reverse* geocoding, this library provides a list of supported languages as shorthands that include [ISO language codes](https://en.wikipedia.org/wiki/ISO_639-1). The result will be provided in multiple languages if the `language` options is an array:

```ts
const result = await maptilerClient.geocoding.forward('paris', {language: [maptilerClient.Language.SPANISH, maptilerClient.geocoding.Language.KOREAN]})
```

The special language `AUTO` will detect the platform/browser preferred language.

If the language is not specified as options, MapTiler Cloud will use the `Accept-language` from the HTTP header of the request. The language seleted this way is generaly similar to the `Language.AUTO` mode, but can still differ in some cases ([read more](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)).

## 🕵️‍♂️ Geolocation
The geolocation service provides location informations of a visitor using its IP address.

The geolocation uses the IP address of a visitors to provide informations about their location, such as city, region, country, timezone, etc. The precision is lower than GPS but does not require visitors to explicitely enable the location service from their web browser.

There is only a single function:
```ts
// in an async function, or as a 'thenable':
const result = await maptilerClient.geolocation.info();
```

Read more about geolocation on our [official documentation](https://docs.maptiler.com/client-js/geolocation/).

## 🌐 Coordinates
If you are already familiar with [epsg.io](https://epsg.io/) (created by MapTiler), then you may find convenient to access the details of more than 10 thousands of coordinate reference systems (CRS) programmatically, as well as transforming coordinates from one system to another!

### Search
The `search` lets you perform a query in a free form fashion. Here are some examples:
```ts
// in an async function, or as a 'thenable':
const resultA = await maptilerClient.coordinates.search('mercator');
const resultB = await maptilerClient.coordinates.search('plate carree');
const resultC = await maptilerClient.coordinates.search('france');
const resultD = await maptilerClient.coordinates.search('code:4326', {transformations: true}));
```

The `transformations` options retrieves a lot more details about the CRS that MapTiler API is able to transform to/from than just their IDs.

Read more about searching coordinate systems on our [official documentation](https://docs.maptiler.com/client-js/coordinates/#search).

### Transform
Transforming a couple of coordinates from one system to another can be challenging, for example, most countries have their own official system, yet web mapping tools are more often than not exclusive to [WGS84](https://epsg.io/4326).

If not provided, both the source (`sourceCrs`) and the destination (`targetCrs`) are default to **EPSG:4326** (in other words, [WGS84](https://epsg.io/4326)). Here is how to use this feature:

```ts
// in an async function, or as a 'thenable':

// Providing one coordinate to transform, with a target CRS being EPSG:9793 (RGF93 v2 / Lambert-93, France official CRS)
const resultA = await maptilerClient.coordinates.transform([1, 45], {targetCrs: 9793})

// Using the same logic, we can pass up to 50 coordinates to be transformed
const resultB = await maptilerClient.coordinates.transform([[10, 48], [1, 45]], {targetCrs: 9793})
```

Read more about transforming coordinates on our [official documentation](https://docs.maptiler.com/client-js/coordinates/#transform).

## 💽 Data
MapTiler Cloud give its users the possibility to [upload and create data](https://cloud.maptiler.com/data/), manually with a user interface or by uploading a GPX, GeoJSON, KML or shp file. A unique ID is associated to each dataset so that we can later on access it programmatically to retrieve a GeoJSON equivalent of it:

```ts
// in an async function, or as a 'thenable':
const result = await maptilerClient.data.get('my-dataset-unique-id')
```

Since the result is a GeoJSON, it can easily be added to a `map` with `.addSource()` and `.addLayer()`.

Read more about fetching your own data on our [official documentation](https://docs.maptiler.com/client-js/data/).

## 🗺️ Static maps
> ✅ Please, use static maps URLs only from client side `<img>` elements, and do not 🚫 store or redistribute the static map files. In case of doubt, consult the [terms](https://www.maptiler.com/cloud/terms/#explicitly-prohibited-use) ⚖️

Maptiler Cloud provides many possibilities for creating static maps as PNG, JPEG or WebP images. They all offer the possibilities to:
- Choose from one of the MapTiler style or your own
- Add markers with a custom icon (or default icon with custom color)
- Add path or polygon, with a parametric line width and color and a parametric filling color

Three modes are available: `centered`, `bounded` and `automatic`.

> 📣 *__important:__* <span style="text-decoration: underline">only image **URLs** are returned.</span>   
> Contrary to the other functions of this library, the static map functions **do not** perform any query to MapTiler Cloud API, instead they build the image URL for you to use in `<img>` elements.


### Map Styles
In the following static map functions, the `option` object features a `style` property that can be a string or one of the built-in style shorthand. Here is the full list:

- `MapStyle.STREETS`, reference style for navigation and city exploration
  - `MapStyle.STREETS.DARK` (variant)
  - `MapStyle.STREETS.LIGHT` (variant)
  - `MapStyle.STREETS.PASTEL` (variant)
- `MapStyle.OUTDOOR` reference style for adventure
- `MapStyle.DATAVIZ`, the perfect style for data visualization, with very little noise
  - `MapStyle.DATAVIZ.DARK` (variant)
  - `MapStyle.DATAVIZ.LIGHT` (variant)
- `MapStyle.BACKDROP`, the perfect style for data visualization, with very little noise
  - `MapStyle.BACKDROP.DARK` (variant)
  - `MapStyle.BACKDROP.LIGHT` (variant)
- `MapStyle.WINTER` reference style for winter adventure
- `MapStyle.SATELLITE` reference style satellite and airborne imagery (no variants)
- `MapStyle.HYBRID` reference style satellite and airborne imagery with labels (no variants)
- `MapStyle.BASIC` reference style for minimalist design and general purpose
  - `MapStyle.BASIC.DARK` (variant)
  - `MapStyle.BASIC.LIGHT` (variant)
- `MapStyle.BRIGHT` reference style for high contrast navigation
  - `MapStyle.BRIGHT.DARK` (variant)
  - `MapStyle.BRIGHT.LIGHT` (variant)
  - `MapStyle.BRIGHT.PASTEL` (variant)
- `MapStyle.TOPO` reference style for topographic study
  - `MapStyle.TOPO.SHINY` (variant)
  - `MapStyle.TOPO.PASTEL` (variant)
  - `MapStyle.TOPO.TOPOGRAPHIQUE` (variant)
- `MapStyle.VOYAGER` reference style for stylish yet minimalist maps
  - `MapStyle.VOYAGER.DARK` (variant)
  - `MapStyle.VOYAGER.LIGHT` (variant)
  - `MapStyle.VOYAGER.VINTAGE` (variant)
- `MapStyle.TONER` reference style for very high contrast stylish maps 
  - `MapStyle.TONER.BACKGROUND` (variant)
  - `MapStyle.TONER.LITE` (variant)
  - `MapStyle.TONER.LINES` (variant)
- `MapStyle.OPENSTREETMAP` (reference style, this one does not have any variants)
- `MapStyle.OCEAN` (reference style, this one does not have any variants)

### Centered static maps
This type of map is centered on a longitude-latitude coordinate and the zoom level must also be provided (from `0`: very zoomed out, to `22`: very zoomed in).  
Note that if a path or markers are provided, the framing of the map will not automatically adapt to include those (use the `automatic` mode for that).

```ts
const imageLink = maptilerClient.staticMaps.centered(
  // center position (Boston)
  [-71.06080, 42.362114], 

  // zoom level
  12.5, 
  
  // Options
  {
    // Request a hiDPI/Retina image
    hiDPI: true,

    // Output image size
    width: 1000,
    height: 1000,

    // Map style
    style: maptilerClient.MapStyle.OUTDOOR,
  });
```

Read more about centered static maps on our official [API documentation](https://docs.maptiler.com/cloud/api/static-maps/#center-based-image).


### Bounded static maps
This type of map requires a bounding box made of two points: the south-west bound and the north-east bound. The zoom level cannot be provided and is automatically deduced from the size of the bounding box.

```ts
const imageLink = maptilerClient.staticMaps.bounded(
  // The bounding box on Europe
  [
    -24,  // west bound (min x)
    34.5, // south bound (min y)
    32,   // east bound (max x)
    71,   // north bound (max y)
  ],

  // Options
  {
    hiDPI: true,
    width: 2048,
    height: 2048,
    style: maptilerClient.MapStyle.STREETS.DARK,

    // Extra space that will add around the bounding box, in percentage
    // (0.1 = 10% is actually the dafault)
    padding: 0.1
  });
```

Since the zoom level cannot be provided, the level of details is dictated by the size of the output image. here is an example:

| `2048 x 2048`      | `1024 x 1024` |
| :-----------: | :-----------: |
| ![](images/screenshots/static-bounded-europe-2048.png)      | ![](images/screenshots/static-bounded-europe-1024.png)       |

As you may notice, the geo bounding box could have very different proportions than the output image size. In the following example, we place the very same bounding box around Portugal, which has a this particular strip looking shape. We also add a `path` that repeats exactly the same bounding box to show the difference between the provided bounding box and the final image. We kept the default padding of 10%:


| `2048 x 2048`      | `1024 x 2048` |
| :-----------: | :-----------: |
| ![](images/screenshots/static-bounded-portugal-2048x2048.png)      | ![](images/screenshots/static-bounded-portugal-1024x2048.png)       |


Read more about bounded static maps on our official [API documentation](https://docs.maptiler.com/cloud/api/static-maps/#bounds-based-image).

### Automatic static maps
As we have seen with centered and bounded maps, providing all the parameters is nice but can be cumbersome for the simplest use cases. This is why MapTiler Cloud also provides static maps that fits automatically whatever you need to place inside: path or markers.

In the following example, we are going to load a cycling track recorded by one of our team members in Montreal, Canada. The track, originally a GPX file, was pushed to MapTiler Data and is now made available as a GeoJSON:

```ts
// Fetching the GeoJSON
const bikeTrack = await maptilerClient.data.get('the-id-of-a-bike-track-in-montreal');

// Extracting the track points with the shape [[lng, lat], [lng, lat], ...]
const trackPoints = bikeTrack.features[0].geometry.coordinates[0]
  .map(p => p.slice(0, 2));

const imageLink = maptilerClient.staticMaps.automatic({
  // hiDPI/Retina precision
  hiDPI: true,

  // A fairly large output image
  width: 2048,
  height: 1024 ,

  // A grey style on which the track will pop!
  style: maptilerClient.MapStyle.STREETS.LIGHT,

  // Draw a path with the trackpoints
  path: trackPoints,

  // Adding a marker for the starting point, with a custom color (array of shape [lng, lat, color])
  marker: [trackPoints[0][0], trackPoints[0][1], '#0a0'],

  // Showing the track in red
  pathStrokeColor: 'red',
});
```

And voila!

![static map with bike path](images/screenshots/static-with-path.png)

> 📣 *__Note:__* The GeoJSON for this track contains 9380 couples of coordinates, which is a lot! In order to send the track to MapTiler Cloud static maps API, the client simplifies the long paths while keeping a high degree of precision using a very fast [Ramer-Douglas-Peucker algorithm](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm).

Read more about bounded static maps on our official [API documentation](https://docs.maptiler.com/cloud/api/static-maps/#auto-fitted-image).

## 🏔️ Elevation
With the elevation API, it's possible to get the elevation in metter from any location. It's possible lookup and compute elevation for a single location, to provide a batch of points, from a GeoJSON LineString or from a GeoJSON MultiLineString!

> ℹ️ Under the hood, the elevation API is fueled by MapTiler Cloud's **RGB Terrain** raster tileset, which is a composite of many high-resolution DEMs from all over the world, currated and processed by our geodata team! The same dataset is also fueling our SDK's elevation (3D terrain) and the hillshading we use in many of our styles.

> 📣 Note for **TypeScript** users: internaly, the elevation feature relies on some *GeoJSON* types definitions that can be found in this NPM package: `@types/geojson`. Namely `LineString`, `MultiLineString` and `Position`. It may improve your developer experience to also use these types. 

Let's see how to use it:

### At a single location
```ts
// Not mandatory, but it's to explain where the type comes from:
import { Position } from "geojson";

const montBlancPeak: Position = [6.864884, 45.832743];
const elevatedPosition = await maptilerClient.elevation.at(montBlancPeak);
```
The returned value is also a *GeoJSON* `Position` array, but with three elements: `[lng, lat, elevation]`.

Read more about elevation lookup for a single location in our [official documentation](https://docs.maptiler.com/client-js/elevation/#at).

### Batch mode
```ts
// Not mandatory, but it's to explain where the type comes from:
import { Position } from "geojson";

const peaks: Position[] = [
  [6.864884, 45.832743],   // Mont Blanc, Alps
  [86.9250, 27.9881],      // Mount Everest, Himalayas
  [-70.0109, -32.6532],    // Aconcagua, Andes
  [-151.0064, 63.0695],    // Denali, Alaska
  [37.3556, -3.0674],      // Mount Kilimanjaro
  [42.4453, 43.3499],      // Mount Elbrus, Caucasus
  [137.1595, -4.0784],     // Puncak Jaya, Sudirman Range
  [-140.4055, 60.5672],    // Mount Logan, Saint Elias Mountains
  [138.73111, 35.358055],  // Mount Fuji
];

const elevatedPeaks = await maptilerClient.elevation.batch(peaks);
```

Read more about elevation lookup for a batch of locations in our [official documentation](https://docs.maptiler.com/client-js/elevation/#batch).

### From a GeoJSON LineString
In the *GeoJSON* LineString case, it clones the entire structure and the positions arrays of the clone will contain three element: `[lng, lat, elevation]`. The original LineString is not mutated nor pointed at.

```ts
// Not mandatory, but it's to explain where the type comes from:
import { LineString } from "geojson";


const someLineString: LineString = {
  type: "LineString",
  coordinates: [[6.864884, 45.832743], [86.9250, 27.9881], [-70.0109, -32.6532]]
};

const someElevatedLineString = await maptilerClient.elevation.fromLineString(someLineString);
// someElevatedLineString is also of type LineString
```

Read more about elevation lookup for a `LineString` in our [official documentation](https://docs.maptiler.com/client-js/elevation/#linestring).

### From a GeoJSON MultiLineString
In the *GeoJSON* MultiLineString case, it clones the entire structure and the positions arrays of the clone will contain three element: `[lng, lat, elevation]`. The original MultiLineString is not mutated nor pointed at.

```ts
// Not mandatory, but it's to explain where the type comes from:
import { MultiLineString } from "geojson";


const someMultiLineString: MultiLineString = {
  type: "LineString",
  coordinates: [
    [[6.864884, 45.832743], [86.9250, 27.9881], [-70.0109, -32.6532]],
    [[-151.0064, 63.0695], [37.3556, -3.0674], [42.4453, 43.3499]],
    [[137.1595, -4.0784], [-140.4055, 60.5672], [138.73111, 35.358055]],
  ]
};

const someElevatedMultiLineString = await maptilerClient.elevation.fromMultiLineString(someMultiLineString);
// someElevatedMultiLineString is also of type MultiLineString
```

Read more about elevation lookup for a `MultiLineString` in our [official documentation](https://docs.maptiler.com/client-js/elevation/#multilinestring).

### Caching
In order to increase performance while reducing unnecessary elevation data fetching, the elevation tiles are cached. This is particularly important for the LineString and MultiLineString lookups because GeoJSON data are likely to come from a recorded or planned route, where position points are very close to one another.

## 🧮 Math
Some operations can be fairly repetitive: WGS84 to Mercator, WGS84 to *zxy* tile index, distance between two points with Haversine formula, etc. As a result, we have decided to expose a `math` package providing the most recurent feature, so that, just like us at MapTiler, you no longer need to copy-paste the same function from your previous project!

The `math` package differs from the others in the sense that it does not call the MapTiler Cloud API, instead it operates fully on the machine it's running on.

Here are some examples:

```ts
// Not mandatory, but it's to explain where the type comes from:
import { Position } from "geojson";

// Some constants
const earthRadius = maptilerClient.math.EARTH_RADIUS;
const earthCircumference = maptilerClient.math.EARTH_CIRCUMFERENCE;

const montBlancPeakWgs84: Position = [6.864884, 45.832743];

// From WGS84 to Mercator
const montBlancPeakMerc = maptilerClient.math.wgs84ToMercator(montBlancPeakWgs84); // also of type Position

// From Mercator to WGS84
const montBlancPeakWgs84Again = maptilerClient.math.mercatorToWgs84(montBlancPeakMerc);

// A great-circle distance in meter:
const from: Position = /* ... */;
const to: Position = /* ... */;
const distance = maptilerClient.math.haversineDistanceWgs84(from, to);

// Full distance of a route made of many positions
const route: Position[] = /* ... */;
const totalDistance = maptilerClient.math.haversineCumulatedDistanceWgs84(route);

// Lon lat to tile index, given a zoom level. An [x, y] array is returned
const tileXY = maptilerClient.math.wgs84ToTileIndex(montBlancPeakWgs84, 14);
// Possible to have floating point tile indices with a third argument to `false`

// and many more!
```

Please find out more about the math package in our [official documentation](https://docs.maptiler.com/client-js/math):

# From NodeJS
NodeJS includes a stable `fetch()` function only from its version *18*, and this client does not contain a polyfill. If the `fetch()` function exists (browser or Node >= 18) then it is going to be resolved automatically, Yet, a custom `fetch()` function can be provided to the `config` object for Node < 18.

In [this NodeJS example](examples/test-node.js), you can see that the package [Node Fetch](https://www.npmjs.com/package/node-fetch) has been `npm install`ed and is passed to the config object of the *MapTiler Client*.

```js
import {
  config,
  // ...
} from '@maptiler/client';

// For this example to work, you must bring your own node-compatible fetch,
// unles you are using a version of Nodejs that already contains fetch (>=18)
import fetch from 'node-fetch';

config.fetch = fetch;

// ...
```

# Terms and usage limitations
The data fetched from MapTiler Cloud API, with or without this library, cannot be stored or redistributed in any ways. If you have any doubt about your specific usecase, please consult our [legal terms](https://www.maptiler.com/cloud/terms/#explicitly-prohibited-use) or contact us.

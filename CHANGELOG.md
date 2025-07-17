# MapTiler Client Changelog

## 2.5.0
### New Features
- `at` and `batch` functions compute elevation on the server using MapTiler Elevation API by default
- Elevation supports Node.js: computed on server when `bufferToPixelData` is not provided
- Added `computeOn` option to force client/server elevation processing
- Added `canParsePixelData` function to check if elevation can be computed on the client

### Bug Fixes
- `bufferToPixelData` can be undefined

### Others
None

## 2.4.0
### New Features
- Added `elevation` option to Geolocation API

### Bug Fixes
None

### Others
None

## 2.3.2
### New Features
None

### Bug Fixes
None

### Others
Added deprecation warning and field for styles that will be deprecated in the future.

## 2.3.1
### New Features
None

### Bug Fixes
- Fixed default export for new styles

## 2.3.0
### New Features
- Additional new map styles as part of the MapStyle Object

### Bug Fixes
None

### Others
None

## 2.2.1
### Bug Fixes
- Fixed incorrect `geocoding: false` for some more languages

## 2.2.0
### New Features
- Exposing ISO languages and non-ISO language separately
### Others
- fixing typos
- languages are now ordered alphabetically

## 2.1.0
### New Features
- Added `continental_marine` and `major_landform` to geocoding type
### Bug Fixes
- Fixed Czech language geocoding flag
### Others
- Languages are now listed in the Client library
- Improved geocoding types and limit documentation

## 2.0.0
### New Features
- Added `matching_text` and `matching_place_name` properties to geocoding feature response
- Added `road` to geocoding `types`
### Others
- Languages are now listed in the Client library

## 1.8.1
### Bug Fixes
- The QuickLRU dependency is not CJS compatible to it is now fully bundled into the CJS bundle
### Others
- Moved somes wrongly positioned deps into devDep

## 1.8.0
### New Features
- Rework of the elevation API to be improve developper experience (new module `elevation`)
- Expoing some geo math with the new `math` module
- synchronized geocoding types with current geocoding API
- added `excludeTypes` option to geocoding API

## 1.7.0
### New Features
- DEM elevation API (https://github.com/maptiler/maptiler-client-js/pull/24)
### Bug Fixes
- `geocoding.byId` can now be used with the apiKey (https://github.com/maptiler/maptiler-client-js/pull/27)
- the Typescript types are now properly exported (https://github.com/maptiler/maptiler-client-js/pull/25)
### Others
- the Typescript `moduleResolution` is now `"Bundler"` (used to be `"Node"`) (https://github.com/maptiler/maptiler-client-js/pull/28)
- updated some dev-dependencies (https://github.com/maptiler/maptiler-client-js/pull/28)

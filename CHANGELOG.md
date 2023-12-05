# MapTiler Client Changelog

## DEVEL
### New Features
### Bug Fixes
### Others

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

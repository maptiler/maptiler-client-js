[MapTiler Client - v1.6.0](../README.md) / Options

# Interface: Options

## Table of contents

### Properties

- [elevationParser](Options.md#elevationparser)
- [metric](Options.md#metric)
- [smooth](Options.md#smooth)
- [tileRequest](Options.md#tilerequest)
- [tileSize](Options.md#tilesize)
- [zoom](Options.md#zoom)

## Properties

### elevationParser

• `Optional` **elevationParser**: [`ElevationParser`](../README.md#elevationparser)

Elevation parser. Default: elevation = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)

#### Defined in

[src/demProfiler/index.ts:33](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/demProfiler/index.ts#L33)

___

### metric

• `Optional` **metric**: ``"m"`` \| ``"ft"``

type of metric to use. Meters or feet. Default: meters

#### Defined in

[src/demProfiler/index.ts:25](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/demProfiler/index.ts#L25)

___

### smooth

• `Optional` **smooth**: `boolean`

smooth out the elevation to make the visual aesthetic nicer

#### Defined in

[src/demProfiler/index.ts:35](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/demProfiler/index.ts#L35)

___

### tileRequest

• **tileRequest**: [`TileRequest`](../README.md#tilerequest)

Tile Request method

#### Defined in

[src/demProfiler/index.ts:31](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/demProfiler/index.ts#L31)

___

### tileSize

• `Optional` **tileSize**: `number`

Tile size of the images returned. Default 512

#### Defined in

[src/demProfiler/index.ts:29](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/demProfiler/index.ts#L29)

___

### zoom

• `Optional` **zoom**: `number`

Zoom that is queried from the server. Default: 13

#### Defined in

[src/demProfiler/index.ts:27](https://github.com/CraigglesO/maptiler-client-js/blob/89a85f8/src/demProfiler/index.ts#L27)

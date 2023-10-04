[MapTiler Client - v1.6.0](../README.md) / Options

# Interface: Options

## Table of contents

### Properties

- [elevationParser](Options.md#elevationparser)
- [metric](Options.md#metric)
- [tileRequest](Options.md#tilerequest)
- [tileSize](Options.md#tilesize)
- [zoom](Options.md#zoom)

## Properties

### elevationParser

• `Optional` **elevationParser**: [`ElevationParser`](../README.md#elevationparser)

Elevation parser. Default: elevation = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)

#### Defined in

src/demProfiler/index.ts:33

___

### metric

• `Optional` **metric**: ``"m"`` \| ``"ft"``

type of metric to use. Meters or feet. Default: meters

#### Defined in

src/demProfiler/index.ts:25

___

### tileRequest

• **tileRequest**: [`TileRequest`](../README.md#tilerequest)

Tile Request method

#### Defined in

src/demProfiler/index.ts:31

___

### tileSize

• `Optional` **tileSize**: `number`

Tile size of the images returned. Default 512

#### Defined in

src/demProfiler/index.ts:29

___

### zoom

• `Optional` **zoom**: `number`

Zoom that is queried from the server. Default: 13

#### Defined in

src/demProfiler/index.ts:27

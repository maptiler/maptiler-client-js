[MapTiler Client - v1.6.0](../README.md) / ClientConfig

# Class: ClientConfig

The configuration object definition

## Table of contents

### Constructors

- [constructor](ClientConfig.md#constructor)

### Accessors

- [apiKey](ClientConfig.md#apikey)
- [fetch](ClientConfig.md#fetch)

## Constructors

### constructor

• **new ClientConfig**()

## Accessors

### apiKey

• `get` **apiKey**(): `string`

Get the MapTiler Cloud API key

#### Returns

`string`

#### Defined in

[src/config.ts:41](https://github.com/CraigglesO/maptiler-client-js/blob/e564d16/src/config.ts#L41)

• `set` **apiKey**(`k`): `void`

Set the MapTiler Cloud API key

#### Parameters

| Name | Type |
| :------ | :------ |
| `k` | `string` |

#### Returns

`void`

#### Defined in

[src/config.ts:34](https://github.com/CraigglesO/maptiler-client-js/blob/e564d16/src/config.ts#L34)

___

### fetch

• `get` **fetch**(): [`FetchFunction`](../README.md#fetchfunction)

Get the fetch fucntion

#### Returns

[`FetchFunction`](../README.md#fetchfunction)

#### Defined in

[src/config.ts:55](https://github.com/CraigglesO/maptiler-client-js/blob/e564d16/src/config.ts#L55)

• `set` **fetch**(`f`): `void`

Set a the custom fetch function to replace the default one

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`FetchFunction`](../README.md#fetchfunction) |

#### Returns

`void`

#### Defined in

[src/config.ts:48](https://github.com/CraigglesO/maptiler-client-js/blob/e564d16/src/config.ts#L48)

[MapTiler Client - v1.4.0](../README.md) / ReferenceMapStyle

# Class: ReferenceMapStyle

An instance of reference style contains a list of StyleVariants ordered by relevance

## Table of contents

### Constructors

- [constructor](ReferenceMapStyle.md#constructor)

### Methods

- [addVariant](ReferenceMapStyle.md#addvariant)
- [getDefaultVariant](ReferenceMapStyle.md#getdefaultvariant)
- [getId](ReferenceMapStyle.md#getid)
- [getName](ReferenceMapStyle.md#getname)
- [getVariant](ReferenceMapStyle.md#getvariant)
- [getVariants](ReferenceMapStyle.md#getvariants)
- [hasVariant](ReferenceMapStyle.md#hasvariant)

## Constructors

### constructor

• **new ReferenceMapStyle**(`name`, `id`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Human-friendly name of this reference style |
| `id` | `string` | ID of this reference style |

#### Defined in

[mapstyle.ts:180](https://github.com/maptiler/maptiler-client-js/blob/9ad7364/src/mapstyle.ts#L180)

## Methods

### addVariant

▸ **addVariant**(`v`): `void`

Add a variant to _this_ reference style

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`MapStyleVariant`](MapStyleVariant.md) |

#### Returns

`void`

#### Defined in

[mapstyle.ts:212](https://github.com/maptiler/maptiler-client-js/blob/9ad7364/src/mapstyle.ts#L212)

___

### getDefaultVariant

▸ **getDefaultVariant**(): [`MapStyleVariant`](MapStyleVariant.md)

Get the defualt variant for this reference style

#### Returns

[`MapStyleVariant`](MapStyleVariant.md)

#### Defined in

[mapstyle.ts:250](https://github.com/maptiler/maptiler-client-js/blob/9ad7364/src/mapstyle.ts#L250)

___

### getId

▸ **getId**(): `string`

Get the id of _this_ reference style

#### Returns

`string`

#### Defined in

[mapstyle.ts:204](https://github.com/maptiler/maptiler-client-js/blob/9ad7364/src/mapstyle.ts#L204)

___

### getName

▸ **getName**(): `string`

Get the human-friendly name of this reference style

#### Returns

`string`

#### Defined in

[mapstyle.ts:196](https://github.com/maptiler/maptiler-client-js/blob/9ad7364/src/mapstyle.ts#L196)

___

### getVariant

▸ **getVariant**(`variantType`): [`MapStyleVariant`](MapStyleVariant.md)

Get a given variant. If the given type of variant does not exist for this reference style,
then the most relevant default variant is returned instead

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantType` | `string` |

#### Returns

[`MapStyleVariant`](MapStyleVariant.md)

#### Defined in

[mapstyle.ts:232](https://github.com/maptiler/maptiler-client-js/blob/9ad7364/src/mapstyle.ts#L232)

___

### getVariants

▸ **getVariants**(): [`MapStyleVariant`](MapStyleVariant.md)[]

Get the list of variants for this reference style

#### Returns

[`MapStyleVariant`](MapStyleVariant.md)[]

#### Defined in

[mapstyle.ts:242](https://github.com/maptiler/maptiler-client-js/blob/9ad7364/src/mapstyle.ts#L242)

___

### hasVariant

▸ **hasVariant**(`variantType`): `boolean`

Check if a given variant type exists for this reference style

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantType` | `string` |

#### Returns

`boolean`

#### Defined in

[mapstyle.ts:222](https://github.com/maptiler/maptiler-client-js/blob/9ad7364/src/mapstyle.ts#L222)

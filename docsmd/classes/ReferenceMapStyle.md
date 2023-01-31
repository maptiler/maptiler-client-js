[MapTiler Client - v1.1.1](../README.md) / ReferenceMapStyle

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

[mapstyle.ts:147](https://github.com/maptiler/maptiler-client-js/blob/b9cff52/src/mapstyle.ts#L147)

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

[mapstyle.ts:179](https://github.com/maptiler/maptiler-client-js/blob/b9cff52/src/mapstyle.ts#L179)

___

### getDefaultVariant

▸ **getDefaultVariant**(): [`MapStyleVariant`](MapStyleVariant.md)

Get the defualt variant for this reference style

#### Returns

[`MapStyleVariant`](MapStyleVariant.md)

#### Defined in

[mapstyle.ts:217](https://github.com/maptiler/maptiler-client-js/blob/b9cff52/src/mapstyle.ts#L217)

___

### getId

▸ **getId**(): `string`

Get the id of _this_ reference style

#### Returns

`string`

#### Defined in

[mapstyle.ts:171](https://github.com/maptiler/maptiler-client-js/blob/b9cff52/src/mapstyle.ts#L171)

___

### getName

▸ **getName**(): `string`

Get the human-friendly name of this reference style

#### Returns

`string`

#### Defined in

[mapstyle.ts:163](https://github.com/maptiler/maptiler-client-js/blob/b9cff52/src/mapstyle.ts#L163)

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

[mapstyle.ts:199](https://github.com/maptiler/maptiler-client-js/blob/b9cff52/src/mapstyle.ts#L199)

___

### getVariants

▸ **getVariants**(): [`MapStyleVariant`](MapStyleVariant.md)[]

Get the list of variants for this reference style

#### Returns

[`MapStyleVariant`](MapStyleVariant.md)[]

#### Defined in

[mapstyle.ts:209](https://github.com/maptiler/maptiler-client-js/blob/b9cff52/src/mapstyle.ts#L209)

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

[mapstyle.ts:189](https://github.com/maptiler/maptiler-client-js/blob/b9cff52/src/mapstyle.ts#L189)

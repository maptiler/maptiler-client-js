[MapTiler Client - v1.1.0](../README.md) / MapStyleVariant

# Class: MapStyleVariant

An instance of MapStyleVariant contains information about a style to use that belong to a reference style

## Table of contents

### Constructors

- [constructor](MapStyleVariant.md#constructor)

### Methods

- [getDescription](MapStyleVariant.md#getdescription)
- [getFullName](MapStyleVariant.md#getfullname)
- [getId](MapStyleVariant.md#getid)
- [getImageURL](MapStyleVariant.md#getimageurl)
- [getName](MapStyleVariant.md#getname)
- [getReferenceStyle](MapStyleVariant.md#getreferencestyle)
- [getType](MapStyleVariant.md#gettype)
- [getVariant](MapStyleVariant.md#getvariant)
- [getVariants](MapStyleVariant.md#getvariants)
- [hasVariant](MapStyleVariant.md#hasvariant)

## Constructors

### constructor

• **new MapStyleVariant**(`name`, `variantType`, `id`, `referenceStyle`, `description`, `imageURL`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Human-friendly name |
| `variantType` | `string` | Variant name the variant is addressed to from its reference style: `MapStyle.REFERNCE_STYLE_NAME.VARIANT_TYPE` |
| `id` | `string` | MapTiler Cloud id |
| `referenceStyle` | [`ReferenceMapStyle`](ReferenceMapStyle.md) | Reference map style, used to retrieve sibling variants |
| `description` | `string` | Human-friendly description |
| `imageURL` | `string` | URL to an image describing the style variant |

#### Defined in

[mapstyle.ts:21](https://github.com/maptiler/maptiler-client-js/blob/68f576e/src/mapstyle.ts#L21)

## Methods

### getDescription

▸ **getDescription**(): `string`

Get the human-friendly description

#### Returns

`string`

#### Defined in

[mapstyle.ts:84](https://github.com/maptiler/maptiler-client-js/blob/68f576e/src/mapstyle.ts#L84)

___

### getFullName

▸ **getFullName**(): `string`

#### Returns

`string`

#### Defined in

[mapstyle.ts:61](https://github.com/maptiler/maptiler-client-js/blob/68f576e/src/mapstyle.ts#L61)

___

### getId

▸ **getId**(): `string`

Get the MapTiler Cloud id

#### Returns

`string`

#### Defined in

[mapstyle.ts:77](https://github.com/maptiler/maptiler-client-js/blob/68f576e/src/mapstyle.ts#L77)

___

### getImageURL

▸ **getImageURL**(): `string`

Get the image URL that represent _this_ variant

#### Returns

`string`

#### Defined in

[mapstyle.ts:128](https://github.com/maptiler/maptiler-client-js/blob/68f576e/src/mapstyle.ts#L128)

___

### getName

▸ **getName**(): `string`

Get the human-friendly name

#### Returns

`string`

#### Defined in

[mapstyle.ts:57](https://github.com/maptiler/maptiler-client-js/blob/68f576e/src/mapstyle.ts#L57)

___

### getReferenceStyle

▸ **getReferenceStyle**(): [`ReferenceMapStyle`](ReferenceMapStyle.md)

Get the reference style this variant belongs to

#### Returns

[`ReferenceMapStyle`](ReferenceMapStyle.md)

#### Defined in

[mapstyle.ts:92](https://github.com/maptiler/maptiler-client-js/blob/68f576e/src/mapstyle.ts#L92)

___

### getType

▸ **getType**(): `string`

Get the variant type (eg. "DEFAULT", "DARK", "PASTEL", etc.)

#### Returns

`string`

#### Defined in

[mapstyle.ts:69](https://github.com/maptiler/maptiler-client-js/blob/68f576e/src/mapstyle.ts#L69)

___

### getVariant

▸ **getVariant**(`variantType`): [`MapStyleVariant`](MapStyleVariant.md)

Retrieve the variant of a given type. If not found, will return the "DEFAULT" variant.
(eg. _this_ "DARK" variant does not have any "PASTEL" variant, then the "DEFAULT" is returned)

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantType` | `string` |

#### Returns

[`MapStyleVariant`](MapStyleVariant.md)

#### Defined in

[mapstyle.ts:112](https://github.com/maptiler/maptiler-client-js/blob/68f576e/src/mapstyle.ts#L112)

___

### getVariants

▸ **getVariants**(): [`MapStyleVariant`](MapStyleVariant.md)[]

Get all the variants for _this_ variants, except _this_ current one

#### Returns

[`MapStyleVariant`](MapStyleVariant.md)[]

#### Defined in

[mapstyle.ts:120](https://github.com/maptiler/maptiler-client-js/blob/68f576e/src/mapstyle.ts#L120)

___

### hasVariant

▸ **hasVariant**(`variantType`): `boolean`

Check if a variant of a given type exists for _this_ variants
(eg. if this is a "DARK", then we can check if there is a "LIGHT" variant of it)

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantType` | `string` |

#### Returns

`boolean`

#### Defined in

[mapstyle.ts:102](https://github.com/maptiler/maptiler-client-js/blob/68f576e/src/mapstyle.ts#L102)

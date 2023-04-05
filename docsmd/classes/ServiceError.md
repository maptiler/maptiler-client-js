[MapTiler Client - v1.3.0](../README.md) / ServiceError

# Class: ServiceError

A ServiceError is an Error that includes the HTTP response details

## Hierarchy

- `Error`

  ↳ **`ServiceError`**

## Table of contents

### Constructors

- [constructor](ServiceError.md#constructor)

### Properties

- [res](ServiceError.md#res)

## Constructors

### constructor

• **new ServiceError**(`res`, `customMessage?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `res` | `Response` | `undefined` |
| `customMessage` | `string` | `""` |

#### Overrides

Error.constructor

#### Defined in

[services/ServiceError.ts:5](https://github.com/maptiler/maptiler-client-js/blob/5fa2a6c/src/services/ServiceError.ts#L5)

## Properties

### res

• **res**: `Response`

#### Defined in

[services/ServiceError.ts:5](https://github.com/maptiler/maptiler-client-js/blob/5fa2a6c/src/services/ServiceError.ts#L5)

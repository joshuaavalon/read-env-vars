# read-env-vars

[![Version](https://badge.fury.io/js/read-env-vars.svg)](https://www.npmjs.com/package/read-env-vars)
[![npm](https://img.shields.io/npm/dt/read-env-vars.svg)](https://www.npmjs.com/package/read-env-vars)
[![License](https://img.shields.io/github/license/joshuaavalon/read-env-vars)](./LICENSE)

## Getting Started

```sh
npm i read-env-vars
```

## Usage

```typescript
import readEnvVars from "read-env-vars";
/**
 *  PREFIX__KEY1=1
 *  PREFIX__KEY2=a
 *  PREFIX__KEY3__KEY=b
 *  PREFIX__KEY4_0=c
 */
/**
 * {
 *    "key1": 1,
 *    "key2": "a",
 *    "key3": { "key": "b" },
 *    "key4": ["c"]
 * }
 */
const vars = readEnvVars("PREFIX");
```

Every variables **MUST** start with the prefix and separator (default to `__`).
Also, the key will be converted to camel-case (Can be changed).

### Scalar

```ini
# Mapped as `{ "key1": 1 }`
PREFIX__KEY1=1
# Mapped as `{ "key2": "a" }`
PREFIX__KEY2=a
# Mapped as `{ "key3": true }`
PREFIX__KEY3=true
```

### Object

By using the separator, the key will be considered nested as an object.

```ini
# Mapped as `{ "key1": { "key2": "a" } }`
PREFIX__KEY1__KEY2=a
```

### Array

By ending a key with `_<number>`, it will be considered as an array.

```ini
# Mapped as `{ "key1": ["a"] }`
PREFIX__KEY1_0=a
```

## Options

#### `source`

- Type: `Record<string, string | undefined>`
- Default: `process.env`

Source of the environment variables

#### `separator`

- Type: `string`
- Default: `__`

Separator of object key

#### `camelCase`

- Type: `camelcase.Options`
- Default: `undefined`

[Options][camelcase-api] passed to [camelcase].

[camelcase]: https://github.com/sindresorhus/camelcase
[camelcase-api]: https://github.com/sindresorhus/camelcase#api

#### `onEmpty`

Value set when handle empty value

- Type: `"null" | "undefined" | "empty" | "ignored"`
- Default: `ignored`

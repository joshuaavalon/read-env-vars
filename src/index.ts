import { set } from "lodash";
import camelCase from "camelcase";

import type { Options as CamelCaseOptions } from "camelcase";

function sanitize(value: string): unknown {
  const number = Number(value);
  if (!isNaN(number)) {
    return number;
  }
  const lowerCaseStr = value.toLowerCase();
  if (lowerCaseStr === "true" || lowerCaseStr === "false") {
    return lowerCaseStr === "true";
  }
  return value;
}

export interface ReadEnvOpts {
  /**
   * Source of the environment variables
   *
   * Default to `process.env`
   */
  source?: Record<string, string | undefined>;
  /**
   * Separator of object key
   *
   * Default to `__`
   */
  separator?: string;
  /**
   * Options passed to camelcase
   *
   * Default to `undefined`
   */
  camelCase?: CamelCaseOptions;
  /**
   * Value set when handle empty value
   *
   * Default to `ignored`
   */
  onEmpty?: "null" | "undefined" | "empty" | "ignored";
}

function readEnvVars<
  T extends Record<string, unknown> = Record<string, unknown>
>(prefix: string, opts: ReadEnvOpts = {}): T {
  const {
    source = process.env,
    separator = "__",
    camelCase: camelCaseOpts,
    onEmpty = "ignored"
  } = opts;
  const keys = Object.keys(source).filter(key =>
    key.startsWith(prefix + separator)
  );
  return keys.reduce((res, key) => {
    let value: string | null | undefined = source[key]?.trim();
    if (!value) {
      switch (onEmpty) {
        case "null":
          value = null;
          break;
        case "undefined":
          value = undefined;
          break;
        case "empty":
          value = "";
          break;
        default:
          return res;
      }
    }
    const keys = key
      .replace(prefix + separator, "")
      .split(separator)
      .map(key =>
        camelCase(key.replace(/_(?<index>\d+)$/u, "[$<index>]"), camelCaseOpts)
      );
    if (keys.length <= 0) {
      return res;
    }
    return set(res, keys.join("."), value ? sanitize(value) : value);
  }, {} as T);
}

export default readEnvVars;

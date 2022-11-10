import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { assert } from "chai";
import readEnvVars from "../index.js";
import dotenv from "dotenv";

const testDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "test"
);

describe("readEnvVars", () => {
  it("should read", async () => {
    dotenv.config({ path: join(testDir, "test1.env"), override: true });
    const result = readEnvVars("TEST1");
    assert.deepEqual(result, {
      key1: "value1",
      key2: [{ key: "value2" }],
      key3: 1,
      key4: true,
      key5: { key: "value3" },
      key6: [{ key: "value4" }],
      key7: [2]
    });
  });

  it("should use separator", async () => {
    dotenv.config({ path: join(testDir, "test2.env"), override: true });
    const result = readEnvVars("TEST2", { separator: "___" });
    assert.deepEqual(result, {
      key1: "value1",
      key2: [{ key: "value2" }],
      key3: 1,
      key4: true,
      key5: { key: "value3" },
      key6: [{ key: "value4" }],
      key7: [2]
    });
  });

  it("should handle empty value", async () => {
    dotenv.config({ path: join(testDir, "test3.env"), override: true });

    const ignoreResult = readEnvVars("TEST3", { onEmpty: "ignored" });
    assert.doesNotHaveAnyKeys(ignoreResult, ["key"]);
    const nullResult = readEnvVars("TEST3", { onEmpty: "null" });
    assert.isNull(nullResult.key);

    const undefinedResult = readEnvVars("TEST3", { onEmpty: "undefined" });
    assert.isUndefined(undefinedResult.key);

    const emptyResult = readEnvVars("TEST3", { onEmpty: "empty" });
    assert.strictEqual(emptyResult.key, "");
  });
});

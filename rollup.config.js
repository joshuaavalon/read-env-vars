import { readFileSync } from "node:fs";
import typescript from "@rollup/plugin-typescript";

const pkgPath = new URL("./package.json", import.meta.url);
const pkg = JSON.parse(readFileSync(pkgPath));

/**
 * @type {import('rollup').RollupOptions}
 */
const config = [
  {
    input: "src/index.ts",
    external: Object.keys(pkg.dependencies),
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true
      },
      {
        file: pkg.module,
        format: "es",
        sourcemap: true
      }
    ],
    plugins: [typescript({ exclude: ["**/__tests__", "**/*.spec.ts"] })]
  }
];
export default config;

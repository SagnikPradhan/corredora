import typescript from "@wessberg/rollup-plugin-ts";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import clear from "rollup-plugin-clear";
import sizes from "rollup-plugin-sizes";
import { builtinModules } from "module";

import packageJson from "./package.json";

const DEV = process.env.ROLLUP_WATCH;

/** @type import("rollup").RollupOptions */
const config = {
  input: ["./source/main.ts", "./source/internal.ts"],

  plugins: [
    nodeResolve({ extensions: [".mjs", ".js", ".json", ".node", ".ts"] }),
    commonjs(),
    typescript(),
  ],

  external: [
    ...builtinModules,
    ...Object.keys(packageJson.dependencies),
    ...Object.keys(packageJson.optionalDependencies),
  ],

  output: [
    {
      dir: "./dist",
      sourcemap: true,
      format: "cjs",
    },
  ],

  preserveEntrySignatures: "allow-extension",
};

if (!DEV)
  config.plugins.push(clear({ targets: ["./dist"] }), terser(), sizes());

export default config;

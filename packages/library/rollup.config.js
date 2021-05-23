import typescript from "@wessberg/rollup-plugin-ts";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import clean from "rollup-plugin-clean";

import packageJson from "./package.json";

const DEV = process.env.ROLLUP_WATCH;

/** @type import("rollup").RollupOptions */
const config = {
  input: "./source/index.ts",

  plugins: [clean(), nodeResolve(), commonjs(), typescript()],

  external: Object.keys(packageJson.dependencies),

  output: [
    {
      dir: "./dist",
      format: "cjs",
      sourcemap: true,
    },
  ],
};

if (!DEV) config.plugins.push(terser());

export default config;

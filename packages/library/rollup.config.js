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
    nodeResolve(),
    commonjs(),
    typescript(),
    clear({ targets: ["./dist"] }),
  ],

  external: [...builtinModules, ...Object.keys(packageJson.dependencies)],

  preserveEntrySignatures: "allow-extension",

  output: [
    {
      dir: "./dist",
      sourcemap: true,
      format: "cjs",
    },
  ],
};

if (!DEV) config.plugins.push(terser(), sizes());

export default config;

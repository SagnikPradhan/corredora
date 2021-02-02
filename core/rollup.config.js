import ts from "@wessberg/rollup-plugin-ts";
import alias from "@rollup/plugin-alias";
import tsconfig from "./tsconfig.json";

function resolveEntries() {
  return Object.entries(
    tsconfig.compilerOptions.paths
  ).map(([find, [replacement]]) => ({ find, replacement }));
}

/** @type import("rollup").RollupOptions */
const config = {
  input: "./server/index.ts",

  plugins: [
    ts({ tsconfig: "./tsconfig.json" }),
    alias({
      resolve: [".ts", ".tsx"],
      entries: resolveEntries(),
    }),
  ],

  output: {
    format: "cjs",
    dir: "./dist",
  },
};

export default config;

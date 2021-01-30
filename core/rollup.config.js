import rollup from "rollup";
import ts from "@wessberg/rollup-plugin-ts";

/** @type rollup.RollupOptions  */
const config = {
  input: "./server/index.ts",

  plugins: [ts({ tsconfig: "./tsconfig.json" })],

  output: {
    format: "cjs",
    dir: "./dist",
  },
};

export default config;

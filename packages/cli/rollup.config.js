const esbuild = require("rollup-plugin-esbuild");
const nodeResolve = require("@rollup/plugin-node-resolve").nodeResolve;
const commonJs = require("@rollup/plugin-commonjs");

const typescript = require("@wessberg/rollup-plugin-ts");

const postcss = require("rollup-plugin-postcss");
const autoprefixer = require("autoprefixer");
const tailwindcss = require("tailwindcss");
const tailwindConfig = require("./tailwind.config");

const replace = require("@rollup/plugin-replace");

const del = require("rollup-plugin-delete");
const livereload = require("rollup-plugin-livereload");

const dev = process.env.ROLLUP_WATCH;
if (!dev) process.env.NODE_ENV = "production";

/** @type import("rollup").RollupOptions[] */
const config = [
  {
    input: "web/source/main.tsx",

    plugins: [
      typescript({
        tsconfig: "web/tsconfig.json",
        transpiler: "typescript",
      }),

      nodeResolve({
        browser: true,
        extensions: [".ts", ".tsx", ".css", ".mjs", ".js", ".json", ".node"],
      }),

      commonJs(),

      esbuild({
        target: "es2020",
        minify: !dev,
        tsconfig: "./web/tsconfig.json",
        sourceMap: !dev,
      }),

      postcss({
        extract: dev ? false : "main.css",
        inject: dev,
        minimize: !dev,
        plugins: [autoprefixer(), tailwindcss(tailwindConfig)],
      }),

      replace({
        "process.env.NODE_ENV": dev ? "'development'" : "'production'",
        preventAssignment: true,
      }),
    ],

    output: {
      format: "esm",
      dir: "dist/web/bundle",
      sourcemap: !dev,
    },
  },

  {
    input: "server/source/main.ts",

    plugins: [
      typescript({
        tsconfig: "server/tsconfig.json",
        transpiler: "typescript",
      }),

      nodeResolve({
        jail: __dirname,
        extensions: [".ts", ".css", ".mjs", ".js", ".json", ".node"],
      }),
    ],

    output: {
      format: "cjs",
      dir: "dist/server",
      sourcemap: true,
    },
  },
];

if (!dev) {
  config[0].plugins.push(del({ targets: ["dist/web/bunlde/*"] }));
  config[1].plugins.push(del({ targets: ["dist/server/*"] }));
} else config[0].plugins.push(livereload());

export default config;

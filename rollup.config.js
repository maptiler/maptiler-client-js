import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import globals from "rollup-plugin-node-globals";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const name = "maptiler-client"

const bundles = [
  // ES module, not minified + sourcemap
  {
    plugins: [
      json(),
      esbuild(),
    ],
    output: [
      {
        file: `dist/${name}.mjs`,
        format: "es",
        sourcemap: true
      }
    ],
    input: "src/index.ts",
    watch: {
      include: "src/**"
    },
    external: ["quick-lru"]
  },

  // CJS module, not minified + sourcemap
  {
    plugins: [
      nodeResolve(),
      commonjs({ include: "node_modules/**" }),
      globals(),
      json(),
      esbuild()
    ],
    output: [
      {
        file: `dist/${name}.cjs`,
        format: "cjs",
        sourcemap: true
      }
    ],
    input: "src/index.ts",
    watch: {
      include: "src/**"
    },
    external: [] // Decided to include QuickLRU to the CJS bundle because it is otherwise not CJS compatible
  },

  // UMD module, not minified
  {
    plugins: [
      nodeResolve(), // for the standalone UMD, we want to resolve so that the bundle contains all the dep.
      commonjs({ include: "node_modules/**" }),
      globals(),
      json(),
      esbuild()
    ],
    output: [
      {
        name: "maptilerClient",
        file: `dist/${name}.umd.js`, 
        format: "umd",
        sourcemap: true
      }
    ],
    input: "src/index.ts",
    watch: {
      include: "src/**"
    },
    external: []
  },

  // types
  {
    "plugins": [
      dts()
    ],
    output: {
      file: `dist/${name}.d.ts`,
      format: "es"
    },
    input: "src/index.ts"
  }
]

if (process.env.NODE_ENV === "production") {
  bundles.push(
  // ES module, minified
  {
    plugins: [
      json(),
      esbuild({
        sourceMap: false,
        minify: true,
      })
    ],
    output: [
      {
        file: `dist/${name}.min.mjs`,
        format: "es",
      }
    ],
    input: "src/index.ts",
    external: ["quick-lru"],
  },
  {
    plugins: [
      nodeResolve(), // for the standalone UMD, we want to resolve so that the bundle contains all the dep.
      commonjs({ include: "node_modules/**" }),
      globals(),
      json(),
      esbuild({
        sourceMap: false,
        minify: true,
      })
    ],
    output: [
      {
        name: "maptilerClient",
        file: `dist/${name}.umd.min.js`, 
        format: "umd",
        sourcemap: false
      }
    ],
    input: "src/index.ts",
    watch: {
      include: "src/**"
    },
    external: []
  })

}

export default bundles


 
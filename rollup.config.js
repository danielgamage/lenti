import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"
import { nodeResolve } from "@rollup/plugin-node-resolve"
const config = {
  plugins: [typescript(), nodeResolve(), terser()],
  input: "./src/index.ts",
  output: {
    dir: "./dist",
    format: "es",
    compact: false,
  },
}

export default config

import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    splitting: false,
    sourcemap: false,
    target: "node18",
  },
  {
    entry: ["src/scripts/postinstall.ts"],
    format: ["cjs"],
    dts: false,
    clean: false,
    splitting: false,
    sourcemap: false,
    target: "node18",
  },
]);

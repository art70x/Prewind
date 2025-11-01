import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  sourcemap: false,
  clean: true,
  dts: false,
  minify: 'terser',
  treeshake: true,
  platform: 'node',
})

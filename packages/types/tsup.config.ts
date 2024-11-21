import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  treeshake: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
});

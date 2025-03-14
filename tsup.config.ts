import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['scripts/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  shims: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  outDir: 'dist',
  treeshake: true,
  sourcemap: true,
  minify: true,
  noExternal: ['zod'],
});

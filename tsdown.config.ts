import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  format: ['cjs'],
  minify: true,
  outDir: 'dist',
  shims: true,
  target: 'es2020',
  platform: 'browser',
  external: [
    'node:*',
    'react',
    'react-dom',
  ],
  exports: true,
})

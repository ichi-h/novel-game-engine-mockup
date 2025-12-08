import type { BuildConfig } from 'bun';
import dts from 'bun-plugin-dts';

const shouldMinify = process.argv.includes('--minify');

const defaultBuildConfig: BuildConfig = {
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
};

await Promise.all([
  Bun.build({
    ...defaultBuildConfig,
    plugins: [dts()],
    format: 'esm',
    naming: '[dir]/[name].js',
    minify: shouldMinify,
    sourcemap: true,
    external: ["react", "react-dom", "@ichi-h/tsuzuri-core"],
  }),
  Bun.build({
    ...defaultBuildConfig,
    format: 'cjs',
    naming: '[dir]/[name].cjs',
    minify: shouldMinify,
    sourcemap: true,
    external: ["react", "react-dom", "@ichi-h/tsuzuri-core"],
  }),
]);

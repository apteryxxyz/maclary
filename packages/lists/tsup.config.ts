import { esbuildPluginVersionInjector } from 'esbuild-plugin-version-injector';
import { defineConfig } from 'tsup';

export default defineConfig({
    clean: true,
    dts: true,
    entry: ['lib/index.ts'],
    format: ['cjs'],
    minify: true,
    skipNodeModulesBundle: true,
    sourcemap: true,
    target: 'es2020',
    keepNames: true,
    esbuildPlugins: [esbuildPluginVersionInjector()],
});

import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  declaration: 'node16',
  clean: true,
  externals: [
    /@leafer-in\/*/,
    /@leafer-ui\/*/,
    'leafer-ui',
    /@dy-kit\/*/,
  ],
  failOnWarn: false,
  rollup: {
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
        },
      },
    },
    inlineDependencies: [
      '@antfu/utils',
    ],
  },
})

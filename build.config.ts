import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/main.ts',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
})
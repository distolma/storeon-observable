import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

function createTsConfig () {
  return typescript({
    clean: true,
    tsconfig: 'configs/tsconfig.esm.json'
  })
}

function createUmdConfig ({ file }) {
  return {
    file,
    format: 'umd',
    name: 'StoreonObservable',
    globals: {
      'rxjs': 'rxjs',
      'rxjs/operators': 'rxjs.operators'
    },
    plugins: [
      terser({ include: [/^.+\.min\.js$/] })
    ]
  }
}

export default {
  input: 'src/index.ts',
  output: [
    createUmdConfig({ file: 'dist/storeon-observable.js' }),
    createUmdConfig({ file: 'dist/storeon-observable.min.js' })
  ],
  plugins: [createTsConfig()]
}

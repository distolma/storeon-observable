import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

function createTsConfig () {
  return typescript({
    clean: true,
    tsconfig: 'configs/tsconfig.esm.json'
  })
}

function createUmdConfig ({ file, compress }) {
  return {
    file,
    format: 'umd',
    name: 'StoreonObservable',
    globals: {
      'rxjs': 'rxjs',
      'rxjs/operators': 'rxjs.operators'
    },
    plugins: compress && [terser()]
  }
}

export default {
  input: 'src/index.ts',
  output: [
    createUmdConfig({ file: 'dist/storeon-observable.js' }),
    createUmdConfig({ file: 'dist/storeon-observable.min.js', compress: true })
  ],
  plugins: [createTsConfig()]
}

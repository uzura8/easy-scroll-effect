import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import nodeBuiltins from 'rollup-plugin-node-builtins'

export default {
  input: 'src/js/index.js',
  output: {
    file: 'dist/js/EasyScrollEffect.js',
    format: 'umd',
    name: 'EasyScrollEffect',
  },
  plugins: [
    babel({exclude: 'node_modules/**'}),
    resolve(),
    nodeBuiltins(),
    commonjs()
  ]
};

import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'index.js',
  format: 'umd',
  globals: {
    'd3-selection': 'd3',
    '@scola/d3-slider': 'd3'
  },
  plugins: [
    resolve({
      jsnext: true,
      skip: ['d3-selection', '@scola/d3-slider']
    }),
    commonjs({
      exclude: ['**/node_modules/lodash-es/**']
    }),
    buble()
  ]
};

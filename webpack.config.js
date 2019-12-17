'use strict'
//const webpack = require('webpack')
const path = require('path')
const root = path.join(__dirname, './')
//const TerserPlugin = require('terser-webpack-plugin')

module.exports = [
  {
    devtool: 'source-map',
    entry: {
      EasyScrollEffect: path.join(root, 'src/js/index.js')
    },
    output: {
      path: path.join(root, 'dist/js'),
      filename: '[name].js',
      library: 'EasyScrollEffect',
      libraryTarget: 'umd'
    },
    optimization: {
      //minimize: false,
      //minimizer: [
      //  new TerserPlugin()
      //],
    },
    //externals: {
    //  'lodash': {
    //    commonjs: 'lodash',
    //    commonjs2: 'lodash',
    //    amd: 'lodash',
    //    root: '_'
    //  }
    //},
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env'
                ]
              }
            },
          ]
        },
      ]
    },
    resolve: {
      modules: [
        path.join(root, '/src'),
        'node_modules'
      ],
      extensions: ['*', '.js', '.json'],
      alias: {
        '@': path.join(root, 'src/js'),
      }
    },
    plugins: [
      //new CleanWebpackPlugin(),
    ],
  }
]

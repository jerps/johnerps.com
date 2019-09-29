/*

Webpack configuration file

(c) 2019 John Erps

This software is licensed under the MIT license (see LICENSE)

*/

const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = env => {

  env = env ? env : {};

  let conf = {
    mode: env.prod ? 'production' : 'development',
    context: path.resolve(__dirname),
    entry: {
      index: path.resolve(__dirname, 'src/index.js')
    },
    output: {
      filename: '[name].min.js',
      path: path.resolve(__dirname, 'dist')
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src')
      }
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.BannerPlugin(fs.readFileSync(path.resolve(__dirname, 'LICENSE'), 'utf8'))
    ]
  };

  if (env.prod) {conf=merge(conf, {
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  });} else {conf=merge(conf, {
    devtool: 'cheap-module-eval-source-map'
  });}
  return conf;
};

const path = require('path');
const merge = require('webpack-merge');

module.exports = env => {

  env = env ? env : {};

  conf = {
    mode: env.prod ? 'production' : 'development',
    context: path.resolve(__dirname),
    entry: {
      index: path.resolve(__dirname, 'js/index.js')
    },
    output: {
      filename: 'js/[name].bundle.js',
      path: path.resolve(__dirname)
    },
    resolve: {
      alias: {
        '@js': path.resolve(__dirname, 'js'),
        '@nm': path.resolve(__dirname, 'node_modules'),
        '@em': path.resolve(__dirname, 'extra_modules')
      }
    }
  };

  if (env.prod) {merge(conf, {
    module: {
      rules : [
        {
          test: /\.js$/,
          exclude: [/node_modules/, /extra_modules/],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  });} else {merge(conf, {
    devtool: 'cheap-module-eval-source-map'
  });}
  return conf;
};

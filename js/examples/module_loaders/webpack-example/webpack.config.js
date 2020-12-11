var webpack = require('webpack');
const path = require('path');

var PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main_OGG.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map'
};
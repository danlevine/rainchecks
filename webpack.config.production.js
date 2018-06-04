var path = require('path');
var webpack = require('webpack');

var CompressionPlugin = require("compression-webpack-plugin");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '/static/bundle.js',
    publicPath: '/static/'
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['react-hot', 'babel'], include: path.join(__dirname, 'src') },
      { test: /\.sass$/, loader: ExtractTextPlugin.extract('css?sourceMap!sass?sourceMap') },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        exclude: /node_modules/,
        loader: 'file-loader?limit=1024&name=static/fonts/[name].[ext]'
      },
      { test: /\.svg$/, loader: 'svg-url-loader' }
    ]
  },
  plugins: [
    new ExtractTextPlugin('/static/stylesheet.css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      }
    }),
    new CompressionPlugin(),
  ]
};

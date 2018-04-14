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
      { test: /\.svg$/, loader: 'url?limit=65000&mimetype=image/svg+xml&name=static/fonts/[name].[ext]', include: path.join(__dirname, 'src/assets/fonts') },
      { test: /\.woff$/, loader: 'url?limit=65000&mimetype=application/font-woff&name=static/fonts/[name].[ext]' },
      { test: /\.woff2$/, loader: 'url?limit=65000&mimetype=application/font-woff2&name=static/fonts/[name].[ext]' },
      { test: /\.[ot]tf$/, loader: 'url?limit=65000&mimetype=application/octet-stream&name=static/fonts/[name].[ext]' },
      { test: /\.eot$/, loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject&name=static/fonts/[name].[ext]' },
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

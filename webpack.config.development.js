var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['react-hot', 'babel'], include: path.join(__dirname, 'src') },
      { test: /\.sass$/, loader: ExtractTextPlugin.extract('css?sourceMap!sass?sourceMap') },
      { test: /\.svg$/, loader: 'url?limit=2000&mimetype=image/svg+xml&name=fonts/[name].[ext]', include: path.join(__dirname, 'src/assets/fonts') },
      { test: /\.woff$/, loader: 'url?limit=2000&mimetype=application/font-woff&name=fonts/[name].[ext]' },
      { test: /\.woff2$/, loader: 'url?limit=2000&mimetype=application/font-woff2&name=fonts/[name].[ext]' },
      { test: /\.[ot]tf$/, loader: 'url?limit=2000&mimetype=application/octet-stream&name=fonts/[name].[ext]' },
      { test: /\.eot$/, loader: 'url?limit=2000&mimetype=application/vnd.ms-fontobject&name=fonts/[name].[ext]' },
      { test: /\.svg$/, loader: 'svg-url-loader' }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('stylesheet.css'),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      defaultSizes: 'gzip',
      reportFilename: 'webpackBundleAnalyzer-report.html',
      openAnalyzer: false,
    }), // webpack-bundle-analyzer
  ]
};

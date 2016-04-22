const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, '/app/scripts'),
  entry: {
    main: './main.js',
    scatter: './scatter.js',
    copy: './copy.js',
    scrollgraphs: './scrollgraphs.js'
  },
  output: {
    path: path.join(__dirname, '/dist/scripts'),
    publicPath: '/scripts',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      d3: 'd3',
      chosen: 'chosen'
    })
  ],
  debug: true,
  devtool: 'cheap-module-eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
  module.exports.debug = false;
  module.exports.devtool = 'source-map';
  module.exports.plugins = module.exports.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]);
}

const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    port: 3000,
    compress: false, 
    historyApiFallback: true,
    hot: true,
    static: { 
      directory: path.join(__dirname, "../public"),
    },
    client: {
      overlay: false,
    },
  },
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new ReactRefreshWebpackPlugin(),
  ]
})
const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin  = require('compression-webpack-plugin')
const globAll = require('glob-all')

module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'), // 复制public下文件
          to: path.resolve(__dirname, '../dist'), // 复制到dist目录中
          filter: source => {
            return !source.includes('index.html') // 忽略index.html
          }
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css'
    }),
    new CompressionPlugin({
      test: /\.(js|css)$/,
      filename: '[path][base].gz', 
      algorithm: 'gzip', 
      threshold: 10240,
      minRatio: 0.8 
    })
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"]
          }
        }
      }),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 20000, 
      minRemainingSize: 0, 
      minChunks: 1, 
      maxAsyncRequests: 30, 
      maxInitialRequests: 30, 
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/, // 匹配node_modules目录下的文件
          priority: -10, // 优先级
          reuseExistingChunk: true, // 复用已经存在的chunk
          filename: 'static/js/vendors/[name].[contenthash:8].js', // 提取后的文件名
        },
        default: {
          minChunks: 2, // 最少被引用次数
          priority: -20, // 优先级
          reuseExistingChunk: true, // 复用已经存在的chunk
          filename: 'static/js/common/[name].[contenthash:8].js', // 提取后的文件名
        },
      },
    },
  },
})
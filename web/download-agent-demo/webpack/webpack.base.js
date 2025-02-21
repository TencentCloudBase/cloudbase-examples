// webpack.base.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  // 入口文件
  entry: path.resolve(__dirname, '../src/index.tsx'),
  // 打包文件出口
  output: {
    filename: 'static/js/[name].[chunkhash:8].js', // 每个输出js的名称
    path: path.resolve(__dirname, '../dist'), // 打包的出口文件夹路径
    clean: true, // webpack4需要配置clean-webpack-plugin删除dist文件，webpack5内置了。
    publicPath: '/', // 打包后文件的公共前缀路径
  },
  stats: {
    all: false,
    warnings: true,
    errors: true,
    errorDetails: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/, //匹配所有的 less 文件
        enforce: 'pre',
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.less$/, //匹配所有的 less 文件
        enforce: 'pre',
        include: [path.resolve(__dirname, '../src'),path.resolve(__dirname, '../node_modules/block')],
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(scss|sass)$/, //匹配所有的 less 文件
        use: [
          isDev ? 'style-loader' :MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'), // 确保使用 Dart Sass
            },
          },
        ],
      },
      {
        test: /\.(jsx)$/,
        include: [path.resolve(__dirname, '../src'),path.resolve(__dirname, '../node_modules/block')],
        use: [ 'babel-loader']
      },
      {
        test: /\.(ts|tsx)$/,
        include: [path.resolve(__dirname, '../src')],
        enforce: 'pre',
        use: ['thread-loader', 'babel-loader']
      },
      {
        test:/\.(png|jpg|jpeg|gif|svg)$/,
        type: "asset",
        parser: {
          //转base64的条件
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10kb
          }
        },
        generator:{ 
          filename:'static/images/[name].[contenthash:6][ext]'
        },
      },
      {
        test:/\.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{ 
          filename:'static/fonts/[name].[contenthash:6][ext]', // 文件输出目录和命名
        },
      },
      {
        test:/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{ 
          filename:'static/media/[name].[contenthash:6][ext]', // 文件输出目录和命名
        },
      }
    ]
  },
  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'),
      // 其他需要的 polyfill
    },
    extensions: ['.js', '.tsx', '.ts','.jsx'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom')
    },
    modules: ['node_modules'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      inject: true
    }),
    new NodePolyfillPlugin({
			additionalAliases: ['process'],
		}),
    new webpack.DefinePlugin({
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV)
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
}
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  entry: path.resolve(__dirname, '../src/index.tsx'),
  output: {
    filename: 'static/js/[name].[chunkhash:8].js', 
    path: path.resolve(__dirname, '../dist'), 
    publicPath: isDev?'/':'./', 
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
        test: /\.css$/, 
        oneOf: [
          {
            /** ATTENTION:  /node_modules\/@cloudbase/ 暂不能使用 MiniCssExtractPlugin.loader*/
            include: /node_modules\/@cloudbase/,
            use: [
              'style-loader',
              'css-loader',
              'postcss-loader',
            ],
          },
          {
            use: [
              isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
              'css-loader',
              'postcss-loader',
            ],
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(scss|sass)$/,
        oneOf: [
          {
            /** ATTENTION:  /node_modules\/@cloudbase/ 暂不能使用 MiniCssExtractPlugin.loader*/
            include: /node_modules\/@cloudbase/,
            use: [
              'style-loader',
              'css-loader',
              'postcss-loader',
              {
                loader: 'sass-loader',
                options: {
                  implementation: require('sass'),
                },
              },
            ],
          },
          {
            use: [
              isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
              'css-loader',
              'postcss-loader',
              {
                loader: 'sass-loader',
                options: {
                  implementation: require('sass'),
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.(jsx)$/,
        /** ATTENTION: ../node_modules/block 装载的本地代码包需要添加进解析*/
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
        test: /\.(png|jpg|jpeg|gif|svg|woff2?|eot|ttf|otf|mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, 
          },
        },
        generator: {
          filename: (pathData) => {
            const ext = pathData.filename.split('.').pop();
            let folder = 'media';
            if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)) {
              folder = 'images';
            } else if (['woff2', 'woff', 'eot', 'ttf', 'otf'].includes(ext)) {
              folder = 'fonts';
            }
            return `static/${folder}/[name].[contenthash:6][ext]`;
          },
        },
      }
    ]
  },
  resolve: {
    // fallback: {
    //   buffer: require.resolve('buffer/'),
    // },
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

      /** ATTENTION: 以下配置全部为必须配置！请勿删除*/
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
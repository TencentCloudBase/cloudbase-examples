const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

// css/css module 正则表达式
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
// sass/sass module 正则表达式
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
// less/less module 正则表达式
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
// stylus/stylus module 正则表达式
const styleRegex = /\.styl$/;
const styleModuleRegex = /\.module\.styl$/;

module.exports = () => {
  return {
    mode: 'production',
    entry: {
      index: './src/index.jsx',
    },
    target: 'web',
    output: {
      // 打包文件根目录
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist/'),
      libraryTarget: 'umd',
    },
    plugins: [
      new NodePolyfillPlugin({
        additionalAliases: ['process', 'punycode'],
      }),
    ],
    resolve: {
      extensions: ['.jsx', '.ts', '.js', '.json', '.wasm'],
    },
    module: {
      rules: [
        {
          test: /\.(jsx|js|ts)?$/,
          use: ['babel-loader'],
          include: path.resolve(__dirname, 'src'),
        },
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: cssModuleRegex,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: sassRegex,
          exclude: sassModuleRegex,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: sassModuleRegex,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
            'postcss-loader',
            'sass-loader',
          ],
        },
        {
          test: styleRegex,
          exclude: styleModuleRegex,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'stylus-loader'],
        },
        {
          test: styleModuleRegex,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
            'postcss-loader',
            'stylus-loader',
          ],
        },
        {
          test: lessRegex,
          exclude: lessModuleRegex,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
          sideEffects: true,
        },
        {
          test: lessModuleRegex,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
            'postcss-loader',
            'less-loader',
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/inline',
        },
      ],
    },
    externals: {
      react: { root: 'React', commonjs: 'react', commonjs2: 'react' },
      'react-dom': {
        root: 'ReactDOM',
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
      },

      mobx: {
        root: 'mobx',
        commonjs: 'mobx',
        commonjs2: 'mobx',
      },
    },
  };
};

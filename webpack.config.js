const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'scripts/background.js': path.resolve(__dirname, 'src/background.ts'),
    'scripts/loader.js': path.resolve(__dirname, 'src/loader.ts'),
    'scripts/main.js': path.resolve(__dirname, 'src/main.tsx'),
    'styles/styles.js': path.resolve(__dirname, 'src/styles/styles.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // 'style-loader',
          {
            loader: 'css-loader',
            options: { modules: false }
          },
          'sass-loader',
        ]
      },
      {
        test: /\.svg$/,
        exclude: [
          /node_modules/,
        ],
        use: [
          'svg-react-loader'
        ]
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'scss', 'svg'],
    modules: [
      'node_modules/',
      'src/app/'
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles/styles.css",
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' },
        { from: 'src/manifest.json', to: 'manifest.json' }
      ]
    }),
  ],
}
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
    },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    assetModuleFilename: '[name][ext]'
  },
  ignoreWarnings: [
    {
      module: /module2\.js\?[34]/, // A RegExp
    },
    {
      module: /[13]/,
      message: /homepage/,
    },
    /warning from compiler/,
    (warning) => true,
  ],
    performance: {
        maxEntrypointSize: 1024000,
        maxAssetSize: 1024000, 
    },
  module: {
    rules: [
        {
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|)$/,
            type: 'asset/resource'
        },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader, 
          'css-loader',
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        exclude: /.\/node_modules/,
      }),
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                "svgo",
                {
                  plugins: extendDefaultPlugins([
                    {
                      name: "removeViewBox",
                      active: false,
                    },
                    {
                      name: "addAttributesToSVGElement",
                      params: {
                        attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                      },
                    },
                  ]),
                },
              ],
            ],
          },
        },
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: './src/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin(),
],
};


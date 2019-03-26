/**
 * Webpack 4 configuration file
 * see https://webpack.js.org/configuration/
 * see https://webpack.js.org/configuration/dev-server/
 */

"use strict";

const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('vendor.css');

// const __dirname = (path => path.replace(/^([a-z]\:)/, c => c.toUpperCase()))(process.__dirname());

module.exports = (env) => [{
  name: "Vendor",
  mode: "none", //disable default behavior
  target: "web",

  context: path.resolve(__dirname, "src"),

  entry: {
    vendor: [
      "@babel/polyfill",
      "@fortawesome/fontawesome-svg-core",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/react-fontawesome",
      "jquery",
      "react",
      "react-dom",
      "react-router-dom",
      "@material-ui/core"
    ]
  },

  devtool: env === "release" ? false : "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    library: "[name]", // related to webpack.DllPlugin::name
    libraryTarget: "umd2",
    filename: "[name].js",
    chunkFilename: "[name].js"
  },

  module: {
    rules: [{
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader"
        }, {
          loader: "ts-loader"
        }]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader"
        }]
      },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: 'url-loader?limit=100000&name=assets/[name].[ext]'
        }, {
          test: /\.s?css$/i,
          loader: extractCSS.extract(['css-loader?minimize', 'sass-loader'])
        }, {
          test: /\.json$/,
          loader: 'json-loader'
        },
    ]
  },

  optimization: {

    noEmitOnErrors: true,
    namedModules: true,

  },

  plugins: [
    extractCSS,
    new webpack.DllPlugin({
      context: path.resolve(__dirname, "src"),
      name: "[name]",
      path: path.resolve(__dirname, "dist", "[name]-manifest.json")
    }),
    ...(env === "release") ? [
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: "'production'",
          VERSION: JSON.stringify(require("./package.json").version)
        }
      }),
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          mangle: true,
          compress: {
            drop_console: true,
            drop_debugger: true,
            warnings: true
          },
          warnings: true
        }
      })
    ] : [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: "'development'",
          VERSION: JSON.stringify(require("./package.json").version)
        }
      }),
      new webpack.WatchIgnorePlugin([
        /s?css\.d\.ts$/,
        /less\.d\.ts$/
      ])
    ]
  ]
}];
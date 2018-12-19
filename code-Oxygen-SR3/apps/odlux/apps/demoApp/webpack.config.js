/**
 * Webpack 4 configuration file
 * see https://webpack.js.org/configuration/
 * see https://webpack.js.org/configuration/dev-server/
 */

"use strict";

const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require("path");
const process = require("process");
const autoprefixer = require("autoprefixer");

// const __dirname = (path => path.replace(/^([a-z]\:)/, c => c.toUpperCase()))(process.__dirname());

module.exports = (env) => [{
  name: "App",

  mode: "none", //disable default behavior

  target: "web",

  context: path.resolve(__dirname, "src"),

  entry: {
    demoApp: ["./plugin.tsx"]
  },

  devtool: env === "release" ? false : "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: "[name]",
    libraryTarget: "umd2",
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
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [{
        loader: "babel-loader"
      }]
    }]
  },

  optimization: {
    noEmitOnErrors: true,
    namedModules: env !== "release"
  },

  plugins: [
    //  new CopyWebpackPlugin([{
    //    from: '../../../framework/dist/**.*',
    //    to: path.resolve(__dirname, "dist")
    //  }]),
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, "../../framework/src"),
      manifest: require("../../framework/dist/vendor-manifest.json"),
      sourceType: "umd2"
    }),
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, "../../framework/src"),
      manifest: require("../../framework/dist/app-manifest.json"),
      sourceType: "umd2"
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
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: "'development'",
          VERSION: JSON.stringify(require("./package.json").version)
        }
      }),
      new CopyWebpackPlugin([{
        from: 'index.html',
        to: path.resolve(__dirname, "dist")
      }]),
    ]
  ],

  devServer: {
    public: "http://localhost:3100",
    contentBase: path.resolve(__dirname, "../../framework/dist/"),

    compress: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    host: "0.0.0.0",
    port: 3100,
    disableHostCheck: true,
    historyApiFallback: true,
    inline: true,
    hot: false,
    quiet: false,
    stats: {
      colors: true
    },
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        secure: false
      }
    }
  }
}];
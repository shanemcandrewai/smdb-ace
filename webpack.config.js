"use strict";
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devtool: "source-map",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "docs/scripts/dist"),
  },
  node: {
    global: false,
    __filename: "mock",
    __dirname: "mock",
  },
  resolveLoader: {
    modules: ["node_modules", __dirname + "node_modules"],
  },
  devServer: {
    contentBase: __dirname,
    compress: true,
    port: 9000,
  },
};

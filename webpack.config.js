"use strict";
const path = require('path');

module.exports = {
    mode: "development",
    entry: "./src/demo.js",
	output: {
        path: path.resolve(__dirname, "docs/dist"),
        filename: "bundle.js",
  },
};
"use strict";

module.exports = {
    mode: "development",
    entry: "./src/demo.js",
	devtool: "source-map",
    output: {
        path: __dirname + "/docs/dist",
        filename: "bundle.js"
    },
    node: {
        global: false,
        __filename: "mock",
        __dirname: "mock",
    },
    resolveLoader: {
        modules: [
            "node_modules", 
            __dirname + "node_modules",
        ],
    },
    devServer: {
        contentBase: __dirname,
        compress: true,
        port: 9000
    }
};
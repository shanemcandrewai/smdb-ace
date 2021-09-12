const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin({
      title: "smdb-ace HtmlWebpackPlugin",
    }),
  ],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "docs"),
    clean: true,
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname, "docs"),
      },
    ],
  },
};

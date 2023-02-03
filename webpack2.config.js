
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
  mode: "production",
  entry: "../src/index.tsx",
  // entry: {
  //   background: path.resolve(__dirname, "..", "src", "background.ts"),
  //   popup: path.resolve(__dirname, "..", "src", "index.tsx")
  // },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "content.js",
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: ".", context: "public" }]
    }),
  ],
};
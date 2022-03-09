// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const WorkboxWebpackPlugin = require("workbox-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

const isProduction = process.env.NODE_ENV == "production"

const config = {
  entry: {
    index: "./src/index.ts",
    worker: "./src/worker.ts",
    popup: "./src/popup.tsx",
    content_script: "./src/content_script.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "cheap-source-map",
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: "public/index.html",
    // }),

    new CopyWebpackPlugin({
      patterns: [{ from: "public", to: "." }],
    }),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        loader: "chrome-url-loader",
        options: {
          publicDir: "dist",
          baseDir: "src",
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
}

module.exports = () => {
  if (isProduction) {
    config.mode = "production"

    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW())
  } else {
    config.mode = "development"
  }
  return config
}

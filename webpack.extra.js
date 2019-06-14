// const WorkerPlugin = require("worker-plugin");
const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        APP_ENV: JSON.stringify("browser")
      }
    }),
  //   new WorkerPlugin({
  //     plugins: ["AngularCompilerPlugin"]
  //   })
  ],
  node: {
    // See: https://github.com/webpack/node-libs-browser
    Buffer: true,
    stream: true,
    // console: false,
    // global: true,
    // process: "mock",
    // __filename: false,
    // __dirname: false,
    // setImmediate: false
  }
};

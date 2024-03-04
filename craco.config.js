const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const withReport = process.env.npm_config_withReport;

module.exports = {
  webpack: function (config, env) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      path: false,
      "process/browser": require.resolve("process/browser"),
    });
    config.resolve.fallback = { ...fallback, fs: false };
    config.resolve.extensions = [".js", ".jsx", ".json", ".ts", ".tsx"];
    config.plugins = (config.plugins || []).concat(
      new NodePolyfillPlugin({
        excludeAliases: ["console"],
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
      new webpack.HotModuleReplacementPlugin(),
      new CompressionPlugin({
        algorithm: "gzip",
        threshold: 10240,
        minRatio: 0.8,
      }),
      withReport
        ? [
            new BundleAnalyzerPlugin({
              analyzerMode: "static",
              reportFilename: "report.html",
            }),
          ]
        : []
    );

    config.devServer = {
      inline: false,
      hot: true,
      open: true,
      host: "localhost",
    };

    return config;
  },
};

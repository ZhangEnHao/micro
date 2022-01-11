const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const resolve = dir => {
  return path.join(__dirname, dir);
};
module.exports = {
  publicPath: "/",
  // 输出文件目录
  outputDir: "micro-home-app",
  assetsDir: "static",
  lintOnSave: false,
  // 打包时不生成.map文件
  productionSourceMap: false,
  devServer: {
    open: true,
    host: "127.0.0.1",
    port: 4096,
    https: false,
    hot: true,
    proxy: {
      "/BASEUI": {
        target: "http://localhost:8080/authservice/",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/BASEUI": ""
        }
      }
    },
    disableHostCheck: true,
    // 配置跨域请求头，解决开发环境的跨域问题
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src")) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set("_v", resolve("src/views"))
      .set("_c", resolve("src/components"))
      .end();
    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .options({
        limit: 4096, // 小于4kb将会被打包成 base64
        fallback: {
          loader: "file-loader",
          options: {
            name: "img/[name].[hash:8].[ext]"
          }
        }
      });
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        jQuery: "jquery",
        $: "jquery"
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, "src/assets"),
          to: "static",
          ignore: [".*"]
        }
      ])
    ],
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: "micro-home-app",
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: "umd",
      // 按需加载相关，设置为 webpackJsonp_vue-projec 即可
      jsonpFunction: `webpackJsonp_micro-home-app`
    }
  }
};

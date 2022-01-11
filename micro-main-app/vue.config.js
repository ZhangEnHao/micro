const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const resolve = dir => {
  return path.join(__dirname, dir);
};
module.exports = {
  publicPath: "/",
  // 输出文件目录
  outputDir: "micro-main-app",
  assetsDir: "static",
  lintOnSave: false,
  // 打包时不生成.map文件
  productionSourceMap: false,
  devServer: {
    open: true,
    port: 2048,
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
        /* cookiePathRewrite: {
				  "/seops": "/BASEUI",
				}, */
      },
      "/WF": {
        target: "http://localhost:8080/authservice",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/WF": ""
        }
      }
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
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, "src/assets"),
          to: "static",
          ignore: [".*"]
        }
      ])
    ]
  }
};

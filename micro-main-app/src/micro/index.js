/* eslint-disable no-unused-vars */
import {
  registerMicroApps,
  addGlobalUncaughtErrorHandler,
  start
} from "qiankun";
import Vue from "vue";

export default function(apps) {
  registerMicroApps(apps, {
    beforeLoad: app => {
      // 加载微应用前，加载全局加载提示
      Vue.prototype.$Spin.show({
        render: h => {
          return (
            <div class="loading" id="loading">
              <div class="pic" id="loading_bg">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
            </div>
          );
        }
      });
      return Promise.resolve();
    },
    afterMount: () => {
      Vue.prototype.$Spin.hide();
      return Promise.resolve();
    }
  });

  addGlobalUncaughtErrorHandler(event => {
    const { msg } = event;
    Vue.prototype.$Spin.hide();
    // 加载失败时提示
    if (msg && msg.includes("died in status LOADING_SOURCE_CODE")) {
      this.$Message.error("微应用加载失败，请检查应用是否可运行");
    }
  });
  console.log("启动微前端");
  start();
}

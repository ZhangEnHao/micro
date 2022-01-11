import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import iView from "iview";
// import "iview/dist/styles/iview.css";
import "@/assets/css/iview/iview.css";
import "@/assets/css/style.css";
import "@/assets/css/theme.css";
import "@/assets/css/icon/iconfont.css";
import "@/assets/css/loading.css";
Vue.use(iView);
import "./request/index.js";
Vue.config.productionTip = false;
//全局：通知错误提醒组件
import ErrorNotice from "_c/error/errorNotice.vue";
import StatusErrorNotice from "_c/error/statusErrorNotice.vue";
Vue.component("ErrorNotice", ErrorNotice);
Vue.component("StatusErrorNotice", StatusErrorNotice);
import memory from "@/assets/js/memoryStrorage";
window.memoryStorage = memory();
Vue.prototype.$Notice.config({
  top: 55,
  duration: 10
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#micro-app");

Date.prototype.Format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};
/** 获取页面标题 */
Vue.prototype.getPageTitle = function(name) {
  let result = "";
  let menuList = JSON.parse(sessionStorage.getItem("MENULIST"));
  let flag = true;
  for (let menu of menuList) {
    let twos = [];
    if (!menu.menuUrl && flag) {
      if (menu.children.length > 0) {
        twos = menu.children;
        let threes = [];
        for (let two of twos) {
          if (two.menuUrl && flag) {
            if (two.menuUrl === name) {
              result = two.menuName;
              flag = false;
              break;
            }
          } else {
            threes = two.children;
            for (let three of threes) {
              if (three.menuUrl === name) {
                result = three.menuName;
                flag = false;
                break;
              }
            }
          }
        }
      }
    }
  }
  return result;
};

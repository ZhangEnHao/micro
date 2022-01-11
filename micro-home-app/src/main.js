import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import store from "./store";
import iView from "iview";

// import 'iview/dist/styles/iview.css';
import "@/assets/css/iview/iview.css";
import "@/assets/css/style.css";
import "@/assets/css/theme.css";
import "@/assets/css/icon/iconfont.css";
Vue.use(iView);
import "./request/index.js";
Vue.config.productionTip = false;
//全局：通知错误提醒组件
import ErrorNotice from "_c/error/errorNotice.vue";
import StatusErrorNotice from "_c/error/statusErrorNotice.vue";
import memory from "@/assets/js/memoryStrorage";
import { routes, beforeEach, afterEach } from "@/router";
import "./public-path.js";
import actions from "@/shared/actions";

Vue.component("ErrorNotice", ErrorNotice);
Vue.component("StatusErrorNotice", StatusErrorNotice);
window.memoryStorage = memory();
Vue.prototype.$Notice.config({
  top: 55,
  duration: 10
});

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

let router = null;
let instance = null;
function render(props = {}) {
  if (props) {
    // 注入 actions 实例
    actions.setActions(props);
  }

  // 在 render 中创建 VueRouter，可以保证在卸载微应用时，移除 location 事件监听，防止事件污染
  router = new VueRouter({
    routes
  });
  router.beforeEach(beforeEach);
  router.afterEach(afterEach);

  const { container } = props;
  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector("#app") : "#app");
}

//全局变量来判断环境，不存在主应用时可直接单独运行
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

/**
 * bootstrap 函数只会在初始化时执行一次
 * 第二次进入子应用，会直接挂载子应用，并不会触发启动函数 bootstrap
 * 通常可以做一些全局变量初始化工作
 * 应用级别的缓存在卸载阶段不会被销毁
 */
export async function bootstrap() {
  console.log("bootstrap");
}

// 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
export async function mount(props) {
  console.log("mount", props);
  window.memoryStorage.setItem("routerBase", props.routerBase);
  render(props);
}

// 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = ""; // 防止子项目内存泄露
  instance = null;
  router = null;
}

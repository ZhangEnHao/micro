import Vue from "vue";
import Router from "vue-router";
import startQiankun from "@/micro";
import apps from "@/micro/apps";
import { setCookie } from "@/utils/editCookies.js";
import searchObj from "@/utils/searchObj.js";
import ridUrlParam from "@/utils/ridUrlParam.js";
import Admin from "@/views/Admin";
import Flow from "@/views/Flow";
import showFlow from "@/views/Flow/showFlow";
import GridPage from "@/views/GridPage";

Vue.use(Router);
let router = new Router({
  routes: [
    // {
    //   path: "/*",
    //   name: "index",
    //   component: Admin
    // },
    {
      path: "/index*",
      name: "index",
      component: Admin
    },
    {
      path: "/flow",
      name: "flow",
      component: Flow
    },
    {
      path: "/showFlow",
      name: "showFlow",
      component: showFlow
    },
    {
      path: "/gridPage",
      name: "gridPage",
      component: GridPage
    }
  ]
});

let isNotEmptyObj = obj => {
  for (let i in obj) {
    return true;
  }
  return false;
};
router.beforeEach((to, from, next) => {
  startQiankun(apps);

  let searchQuery = searchObj(window.location.search);
  let searchKeys = [];
  for (let key in searchQuery) {
    if (key && searchQuery[key]) {
      setCookie(key, searchQuery[key]);
      searchKeys.push(key);
    }
  }
  let url = ridUrlParam(window.location.href, searchKeys);
  window.history.pushState({}, 0, url);

  //设置组件codes
  let autoRouterCodes = window.memoryStorage.getItem("autoRouterCodes");
  let name = to.name;
  if (autoRouterCodes && isNotEmptyObj(autoRouterCodes)) {
    let map = new Map(autoRouterCodes);
    let codes = map.get(name);
    codes = codes ? codes : [];
    window.memoryStorage.setItem("codes", codes);
  } else {
    window.memoryStorage.setItem("codes", []);
  }

  next();
});

export default router;

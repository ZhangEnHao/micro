import Vue from "vue";
import Router from "vue-router";
import index from "@/views/Admin";
import { setCookie } from "@/utils/editCookies.js";
import searchObj from "@/utils/searchObj.js";
import ridUrlParam from "@/utils/ridUrlParam.js";
Vue.use(Router);

let prefix = "";
if (window.__POWERED_BY_QIANKUN__) {
  prefix = "*/home";
}

export const routes = [
  {
    path: prefix + "/admin",
    component: index
  }
];

let isNotEmptyObj = obj => {
  for (let i in obj) {
    return true;
  }
  return false;
};
export const beforeEach = (to, from, next) => {
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
};

export const afterEach = () => {
  let href = window.location.href;
  let index = href.lastIndexOf("?");
  if (index > -1) {
    let search = href.substring(index, href.length);
    let searchQuery = searchObj(search);
    let searchKeys = [];
    for (let key in searchQuery) {
      if (key && searchQuery[key]) {
        setCookie(key, searchQuery[key]);
        searchKeys.push(key);
      }
    }
    let url = ridUrlParam(window.location.href, searchKeys);
    window.history.pushState({}, 0, url);
  }
};

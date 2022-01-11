/* eslint-disable no-unused-vars */
import Vue from "vue";
import VueResource from "vue-resource";
import { uriRoot } from "@/assets/js/config.js";

Vue.use(VueResource);
Vue.http.options.root = uriRoot;
Vue.http.options.xhr = { withCredentials: true };
Vue.http.interceptors.push((request, next) => {
  //全局加载提示
  Vue.prototype.$Spin.show({
    render: h => {
      return (
        <div>
          <i
            class="ivu-icon ivu-icon-ios-loading demo-spin-icon-load"
            style="font-size:26px"
          />
        </div>
      );
    }
  });
  next(response => {
    //用户请求,页面隐藏旋转图标
    Vue.prototype.$Spin.hide();
    //统一处理响应
    let status = parseInt(response.status / 100);
    //成功
    if (status == 2 || status == 3) {
      //未知
      if (response.data.code == undefined || response.data.code == null) {
        return response;
      } else {
        //成功，直接返回
        if (response.data.code == 0) {
          return response;
        } else {
          Vue.prototype.$Notice.error({
            render: h => {
              return <Error-notice request={request} response={response} />;
            }
          });
          response.ok = false;
          return response;
        }
      }
    } else if (response.status === 401) {
      window.location.href = response.body;
    } else {
      Vue.prototype.$Notice.error({
        title: "",
        render: h => {
          return <Status-Error-Notice request={request} response={response} />;
        }
      });
    }
  });
});

window.$http = Vue.http;

## qiankun

```qiankun``` 蚂蚁金服基于 ```single-spa``` 的微前端解决方案，生产可用。

### 特性

- 基于 ```single-spa``` 封装，提供了更加开箱即用的 ``API``。

- 技术栈无关，任意技术栈的应用均可 使用/接入，不论是 ```React/Vue/Angular/JQuery``` 还是其他等框架。

- ```HTML Entry``` 接入方式，让你接入微应用像使用 ```iframe``` 一样简单。

- 样式隔离，确保微应用之间样式互相不干扰。

- ```JS/CSS``` 沙箱，确保微应用之间 全局变量/事件/样式 不冲突。

- 资源预加载，在浏览器空闲时间预加载未打开的微应用资源，加速微应用打开速度。

## 构建主应用基座

微前端的核心价值是**技术栈无关**，可以用任意一个框架去替换其中的某一个微应用或者是扩展一个微应用。

以 ```vue``` 项目为例说明，基座 ```main``` 采用是的 ```Vue-Cli3``` 搭建，负责导航的渲染和登录态的下发，为子应用提供一个挂载的容器 ```div``` 。其他的技术栈原理是一样的。

```qiankun``` 库只需要在基座引入。

```javaScript
$ yarn add qiankun # 或者 npm i qiankun -S
```

### 1. 在主应用中注册微应用

```javaScript
// micro/apps.js
import app from "./shared";  //分享给子应用的数据

/*
 * name: 微应用名称 - 具有唯一性，为了减轻配置的复杂度，尽量保持与微应用的项目名、activeRule 保持一致
 * entry: 微应用入口 - 通过该地址加载微应用
 * container: 微应用挂载节点 - 微应用挂载到主应用上的 DOM 选择器或者 DOM 节点
 * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用(相当于 VueRouter 里的 path，也支持动态路由的写法)
 * props: 共享给微应用的数据
 */

const apps = [
  {
    name: "vue-project",
    entry: "//localhost:10300",
    container: "#app-qiankun",
    activeRule: "/vue",
    props: { app }
  }
];

export default apps;
```

### 2. 注册微应用并对外暴露方法

```javaScript
// src/micro/index.js
import {
    registerMicroApps,
    addGlobalUncaughtErrorHandler,
    start,
} from "qiankun";

export default function (apps: []) {
    registerMicroApps(apps, {
        beforeLoad: () => {
            return Promise.resolve();
        },
        afterMount: () => {
            return Promise.resolve();
        },
    });

    addGlobalUncaughtErrorHandler((event) => {
        const { message } = event;
        // 加载失败时提示
        if (message && message.includes("died in status LOADING_SOURCE_CODE")) {
            console.error('微应用加载失败，请检查应用是否可运行');
        }
    });

    // 设置主应用启动后默认进入的微应用
    setDefaultMountApp(apps[0].activeRule);

    start({
      sandbox :{strictStyleIsolation: true}, //开启沙盒模式
    });
}
```

### 3. 主应用为子应用准备展示节点元素

```html
<div id="subView"/>
```

### 4. 启动微应用

由于微应用可能是登录后，根据用户菜单权限而生成该用户的微应用。所以，暴露方法以及入参方便登录完成调用注册微应用。

```javaScript
import startQiankun from "@/micro";
import apps from "@/micro/apps";

// 根据实际业务需求在【全局路由守卫处】或 【main.js】...启动
startQiankun(apps);
```

当微应用信息注册完之后，一旦浏览器的 ```url``` 发生变化，便会自动触发 ```qiankun``` 的匹配逻辑，所有 ```activeRule``` 规则匹配上的微应用就会被插入到指定的 ```container``` 中，同时依次调用微应用暴露出的生命周期钩子。

## 配置子应用

微应用不需要额外安装任何其他依赖即可接入  ```qiankun``` 主应用。主要将生命钩子导出即可（``` qiankun ```内部通过 ```import-entry-html``` 加载微应用，要求微应用需要导出生命周期钩子函数）。

如果项目使用了脚手架搭建微应用的话，可以通过 ```webpack``` 配置在入口文件处导出这三个生命周期钩子函数。如果没有使用脚手架的话，也可以直接在微应用的 ```window``` 上挂载这三个生命周期钩子函数。

### 1. 在 ```src``` 目录新增文件 ```public-path.js```

```javaScript
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

### 2. 修改 ```index.html``` 中项目初始化的容器，不要都使用 ```#app``` ，避免与其他的项目冲突，建议换成项目 ```name``` 的驼峰写法。

### 3. 改造 ```main.js```，引入上面的 ```public-path.js```，改写```render```，添加生命周期函数等

```javaScript
import './public-path';
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import store from './store';

Vue.use(VueRouter)
Vue.config.productionTip = false

let router = null;
let instance = null;
function render(parent = {}) {
  // 在 render 中创建 VueRouter，可以保证在卸载微应用时，移除 location 事件监听，防止事件污染
  router = new VueRouter({
    // histroy模式的路由需要设置base，sub路由根据项目名称来定
    base: window.__POWERED_BY_QIANKUN__ ? '/sub' : '/',
    mode: 'history',
    // hash模式不需要上面两行
    routes: []
  });
  instance = new Vue({
    router,
    store,
    render: h => h(App),
    data(){
      return {
        parentRouter: parent.router,
        parentVuex: parent.store,
      }
    },
  }).$mount('#appVueHistory');
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
  console.log('bootstrap');
}

// 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
export async function mount(props) {
  console.log('mount', props);
  render(props.data);
}

// 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = ""; // 防止子项目内存泄露
  instance = null;
  router = null;
}
```

注意：

  - ```webpack``` 的 ```publicPath``` 值只能在入口文件修改，之所以单独写到一个文件并在入口文件最开始引入，是因为这样做可以让下面所有的代码都能使用这个。

  - 路由文件需要 ```export``` 路由数据，而不是实例化的路由对象，路由的钩子函数也需要移到入口文件。

  - 在 ``mount`` 生命周期，可以拿到父项目传递过来的数据，```router``` 用于跳转到主项目/其他子项目的路由，```store``` 是父项目的实例化的 ```Vuex```。

### 4. 修改打包配置 ```vue.config.js```

```javaScript
// name 默认从 package.json 获取，可以自定义，只要和父项目注册时的 name 保持一致即可。
const { name } = require('./package');

module.exports = {
  publicPath: "./", // hash 模式打包用
  // publicPath: "/", // history 模式打包用
  devServer: {
    // 关闭主机检查，使微应用可以被 fetch
    disableHostCheck: true,
    // 配置跨域请求头，解决开发环境的跨域问题
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  // 自定义webpack配置
  configureWebpack: {
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: `${name}-[name]`,
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: 'umd',
      // 按需加载相关，设置为 webpackJsonp_${name} 即可
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
};
```

打包成umd，等同于在入口文件把生命周期函数组成的对象挂载到window上。


### 5. 在 ```vue.config.js``` 修改完成后，重新启动 ```Vue``` 微应用，然后打开主应用基座。点击菜单切换到微应用，此时 ```Vue``` 微应用被正确加载。

## 注意事项

### 1. 主项目路由用 ```hash``` 模式且子项目没有 ```history``` 模式路由

也就是说主项目和所有子项目都是 ```hash``` 模式，这种情况下也有两种做法：

- 用 ```path``` 来区分子项目

优点：无需修改子项目内部代码

缺点：项目之间的跳转，都得靠原生的 ```history``` 对象

- 用 ```hash``` 来区分子项目

这样做主项目和子项目会共同接管路由，举个栗子：

  * /#/vue/home: 会加载 vue 子项目的 home 页面，但是其实，单独访问这个子项目的 home 页面的完整路由就是/#/vue/home

  * /#/about: 会加载主项目的about页面

做法就是自定义 ```activeRule``` 

```javaScript
const getActiveRule = hash => location => location.hash.startsWith(hash);
registerMicroApps([
   { 
      name: 'app-vue-hash', 
      entry: 'http://localhost:1111', 
      container: '#appContainer', 
      activeRule: getActiveRule('#/app-vue-hash'), 
   },
])
```

然后需要在子项目的所有路由前加上这个前缀，或者将子项目的根路由设置为这个前缀。

如果子项目是新项目还好，如果是旧项目,则影响还是比较大，子项目里面的路由跳转(``` <router-link>、router.push()、router.repace() ```)如果使用的是 path ,则需要修改，得加上这个前缀，如果使用的是 ```name``` 跳转，则无需改动：``` router.push({ name: 'user'} ```)。

优点: 所有项目之间的跳转都可以直接使用自己的 ```router``` 对象或者 ```<router-link>```，不需要借助父项目的路由对象或者原生的 ```history``` 对象。

缺点: 对子项目是入侵式修改，如果是全新项目，则无影响。

### 2. 子应用挂载在基座子路由

- 子应用路由加基座路由 ```path```

- 挂载子应用都基座子路由注册时，path后面加一个 ```*```，否则可能匹配不到子应用其他路由页面。

- 挂载子应用都基座子路由不应该包含基座业务的 ```children``` ，否则基座自身 ```children``` 页面和子应用页面会有一方展示不出来。

- 在页面的 mounted 周期里面注册子项目并启动。

### 3. 请求代理

> 如果主应用、子应用以及后端 API 都是同一个域名，则天然地不用解决这个问题

「所有的请求都是以主应用的域发起的」

首先要清楚，```qiankun``` 子应用在浏览器端发 api 请求时，实际上是请求了主应用的 ```Node``` 端，url 为 ```/appA_apis/xxx``` ```/appB_apis/xxx``` 这样的格式，而主应用的 ```Node``` 端是没有处理这些路由的逻辑的，故需要添加转发逻辑，把这些请求都转发到子应用的 ``Node`` 端去。

在实际的开发环境中，子应用本身具有自己的代理服务接口的转发配置，基座应用也有自己的代理接口的转发配置，各自独立开发毫无问题，当子应用挂载到主应用的dom容器中后，子应用本身的代理服务器地址就成了主应用的代理服务器地址了，解决这个问题的一个思路是在请求的时候区分环境，在在微前端开发环境下直接加上```host```，简单地说，就是开发环境子项目的请求都必须是完整路径，不能是相对路径。

### 4. [微应用打包之后 css 中的字体文件和图片加载 404](https://qiankun.umijs.org/zh/faq/#%E4%B8%BA%E4%BB%80%E4%B9%88%E5%BE%AE%E5%BA%94%E7%94%A8%E5%8A%A0%E8%BD%BD%E7%9A%84%E8%B5%84%E6%BA%90%E4%BC%9A-404%EF%BC%9F)

### 5. 子应用谨慎使用 ```position：fixed```

子应用在嵌入基座项目中，```fixed``` 定位未必准确，应尽量避免使用，确有相对于浏览器窗口定位需求，可以用 ```position: sticky```，但是会有兼容性问题（```IE```不支持）。如果定位使用的是 ```bottom``` 和 ```right```，则问题不大。

还有个办法，位置可以写成动态绑定 ```style``` 的形式:

```html
<div :style="{ top: isQiankun ? '10px' : '0'}">
```

### 6. 基座应用和微应用之间 ```CSS``` 样式隔离

[关于启用strictStyleIsolation严格样式隔离的问题](https://github.com/umijs/qiankun/issues/661)

[关于样式隔离](https://github.com/umijs/qiankun/issues/7)

### 7. ⚠️ 子应用开发注意事项

- 基座应用中用于渲染子应用到标签可以简单到认为是子应用不加任何样式到```body```标签，开发子应用的时候 不要给此元素加任何样式

- 子应用布局定位不要使用 ``` fixed ```

- 子应用重定向、清空本地存储

### 8. [父子项目间的组件共享](https://juejin.cn/post/6856569463950639117#heading-26)


## 应用通信

在微前端架构中，应该按业务划分出对应的子应用，而不是通过功能模块划分子应用。这么做的原因有两个：

  1. 在微前端架构中，子应用并不是一个模块，而是一个独立的应用，将子应用按业务划分可以拥有更好的可维护性和解耦性。

  2. 子应用应该具备独立运行的能力，应用间频繁的通信会增加应用的复杂度和耦合度。

综上所述，应该从业务的角度出发划分各个子应用，尽可能减少应用间的通信，从而简化整个应用，使得微前端架构可以更加灵活可控。

### 1. ```Actions 通信```

由 ```qiankun``` 官方提供的通信方式 - ```Actions 通信```，适合业务划分清晰，比较简单的微前端应用，一般来说使用 ``` Actions ```  通信方案就可以满足大部分的应用场景需求。

```qiankun ```内部提供了 ```initGlobalState``` 方法用于注册 ```MicroAppStateActions``` 实例用于通信，该实例有三个方法，分别是：

```setGlobalState```：设置 ```globalState``` - 设置新的值时，内部将执行 浅检查，如果检查到 ```globalState``` 发生改变则触发通知，通知到所有的 ```观察者``` 函数。

```onGlobalStateChange```：注册 ```观察者``` 函数 - 响应 ```globalState``` 变化，在 ```globalState``` 发生改变时触发该 ```观察者``` 函数。

```offGlobalStateChange```：取消 ```观察者``` 函数 - 该实例不再响应 ```globalState``` 变化。

[Actions](./Actions.jpg)

- 基座应用的工作

首先，在基座应用中注册一个 ```MicroAppStateActions``` 实例并导出。

```javaScript
// /src/shared/actions.js
import { initGlobalState } from "qiankun";

const initialState = {};
const actions = initGlobalState(initialState);

export default actions;
```

在注册 ```MicroAppStateActions``` 实例后，在需要通信的组件中使用该实例，并注册 ```观察者``` 函数，我们这里以登录功能为例，实现如下：

```javaScript
// /src/pages/login/index.vue
import actions from "@/shared/actions";
import { ApiLoginQuickly } from "@/apis";

@Component
export default class Login extends Vue {
  $router!: VueRouter;

  mounted() {
    // 注册一个观察者函数
    actions.onGlobalStateChange((state, prevState) => {
      // state: 变更后的状态; prevState: 变更前的状态
      console.log("主应用观察者：token 改变前的值为 ", prevState.token);
      console.log("主应用观察者：登录状态发生改变，改变后的 token 的值为 ", state.token);
    });
  }
  
  async login() {
    // ApiLoginQuickly 是一个远程登录函数，用于获取 token
    const result = await ApiLoginQuickly();
    const { token } = result.data.loginQuickly;

    // 登录成功后，设置 token
    actions.setGlobalState({ token });

    this.$router.push("/");
  }
}
```

在 ```Vue``` 组件 的 ```mounted``` 生命周期钩子函数中注册了一个 ```观察者``` 函数，然后定义了一个 ```login``` 方法，最后将 ``login`` 方法绑定登录按钮中。

此时点击 2 次按钮，将触发在主应用设置的 ```观察者``` 函数。

```javaScript
// 第一次点击
主应用观察者：token 改变前的值为 undefined
主应用观察者：登录状态发生改变，改变后的 token 的值为 e5a0cf35d2c3e2d821f8776c99061da6be8e3fe4a4a4d21d57c877d7b07cfced
// 第二次点击
主应用观察者：token 改变前的值为 e5a0cf35d2c3e2d821f8776c99061da6be8e3fe4a4a4d21d57c877d7b07cfced
主应用观察者：登录状态发生改变，改变后的 token 的值为 fed86d3d2250f0c335cf57ef1a90966f9e5340852e458068c3ec70b0c4f22b89
```

从上面可以看出，```globalState ```更新成功。

- 子应用的工作

现在已经完成了主应用的登录功能，将 ```token``` 信息记录在了 ```globalState``` 中。接下来进入子应用，使用 ```token``` 获取用户信息。

首先改造 ```Vue``` 子应用，设置一个 ```Actions``` 实例。

```javaScript
// /src/shared/actions.js
function emptyAction() {
  // 警告：提示当前使用的是空 Action
  console.warn("Current execute action is empty!");
}

class Actions {
  // 默认值为空 Action
  actions = {
    onGlobalStateChange: emptyAction,
    setGlobalState: emptyAction
  };
  
  // 设置 actions
  setActions(actions) {
    this.actions = actions;
  }

  // 映射
  onGlobalStateChange(...args) {
    return this.actions.onGlobalStateChange(...args);
  }

  // 映射
  setGlobalState(...args) {
    return this.actions.setGlobalState(...args);
  }
}

const actions = new Actions();
export default actions;

```

创建 ```actions``` 实例后，需要为其注入真实 ```Actions```。在子应用入口文件 ```main.js``` 的 ```render``` 函数中注入，代码实现如下：

```javaScript
// /src/main.js

//...

/**
 * 渲染函数
 * 主应用生命周期钩子中运行/子应用单独启动时运行
 */
function render(props) {
  if (props) {
    // 注入 actions 实例
    actions.setActions(props);
  }

  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? "/vue" : "/",
    mode: "history",
    routes,
  });

  // 挂载应用
  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount("#sub-app");
}

```

在子应用获取 ```globalState``` 中的 ```token```，代码实现如下：

```javaScript
// /src/pages/communication/index.vue
// 引入 actions 实例
import actions from "@/shared/actions";
import { ApiGetUserInfo } from "@/apis";

export default {
  name: "Communication",

  data() {
    return {
      userInfo: {}
    };
  },

  mounted() {
    // 注册观察者函数
    // onGlobalStateChange 第二个参数为 true，表示立即执行一次观察者函数
    actions.onGlobalStateChange(state => {
      const { token } = state;
      // 未登录 - 返回主页
      if (!token) {
        this.$message.error("未检测到登录信息！");
        return this.$router.push("/");
      }

      // 获取用户信息
      this.getUserInfo(token);
    }, true);
  },

  methods: {
    async getUserInfo(token) {
      // ApiGetUserInfo 是用于获取用户信息的函数
      const result = await ApiGetUserInfo(token);
      this.userInfo = result.data.getUserInfo;
    }
  }
};

```

```qiankun``` 基础通信 就完成了。

### 2. ```Shared 通信```

```Actions``` 通信方案也存在一些优缺点，优点如下：

  - 使用简单；
  - 官方支持性高；
  - 适合通信较少的业务场景；

缺点如下：

  - 子应用独立运行时，需要额外配置无 ```Actions``` 时的逻辑；
  - 子应用需要先了解状态池的细节，再进行通信；
  - 由于状态池无法跟踪，通信场景较多时，容易出现状态混乱、维护困难等问题；

如果实际业务应用通信场景较多，希望子应用具备完全独立运行能力，希望主应用能够更好的管理子应用，那么可以考虑 ```Shared``` 通信方案。

```Shared``` 通信方案的原理就是，主应用基于状态管理工具【 ```redux``` , ```mobx``` , ```vuex``` ...】维护一个状态池，通过 ```shared``` 实例暴露一些方法给子应用使用。同时，子应用需要单独维护一份 ```shared``` 实例，在独立运行时使用自身的 ```shared``` 实例，在嵌入主应用时使用主应用的 ```shared``` 实例，这样就可以保证在使用和表现上的一致性。


```Shared``` 通信方案要求父子应用都各自维护一份属于自己的状态池和 ```shared``` 实例，这样会增加项目的复杂度。好处是子应用可以完全独立于父应用运行（不依赖状态池），子应用也能以最小的改动被嵌入到其他第三方应用中。

```Shared``` 通信方案也可以帮助主应用更好的管控子应用。子应用只可以通过 ```shared``` 实例来操作状态池，可以避免子应用对状态池随意操作引发的一系列问题。主应用的 ```Shared``` 相对于子应用来说是一个黑箱，子应用只需要了解 ```Shared``` 所暴露的 ```API``` 而无需关心实现细节。


## 应用部署

[基于 qiankun 的微前端最佳实践（图文并茂） - 应用部署篇](https://github.com/a1029563229/blogs/blob/master/BestPractices/qiankun/Deploy.md)

 


---
---

## 参考文章

- [基于 qiankun 的微前端最佳实践（万字长文） - 从 0 到 1 篇](https://juejin.im/post/6844904158085021704)
- [体验微前端（qiankun）](https://juejin.im/post/6844904182814605325)
- [记一次 微前端 qiankun 项目 实践 !!! 防踩坑指南](https://juejin.im/post/6844904142880800775)
- [微前端架构设计和实践:vue+qiankun](https://juejin.im/post/6844904158185668616)

---

- [qiankun 微前端方案实践及总结](https://juejin.im/post/6844904185910018062)
- [qiankun 微前端实践总结（二）](https://juejin.im/post/6856569463950639117)

- [基于vue的qiankun实践总结](https://juejin.cn/post/6894543700387430408)

---

- [「⚡微前端实战：qiankun+Vue 掘金重构计划 | 🏆 技术专题第四期征文 ...... 」](https://juejin.cn/post/6874213637687345159)

---

- [基于 qiankun 的微前端最佳实践（图文并茂） - 应用间通信篇](https://juejin.cn/post/6844904151231496200)

- [基于 qiankun 的微前端最佳实践（图文并茂） - 应用部署篇 | 🏆 技术专题第四期征文](https://juejin.cn/post/6875814605500153863)

- [微前端 qiankun 从搭建到部署的实践](https://xie.infoq.cn/article/b42eb5baa89d57860cc58acf9)

---

- [万字长文+图文并茂+全面解析微前端框架 qiankun 源码 - qiankun 篇](https://juejin.im/post/6844904115999342600)

- [微前端框架 之 qiankun 从入门到源码分析](https://juejin.cn/post/6885211340999229454)

- [可能是你见过最完善的微前端解决方案](https://juejin.cn/post/6844903917029965831)

- [解密微前端：从qiankun看子应用加载](https://juejin.im/post/6891888458919641096)

---

- [微前端连载 1/7：如何落地微前端一体化运营工作台](https://juejin.im/post/6844904194818703374)
- [微前端连载 2/7: 如何分三步实施微前端](https://juejin.im/post/6844904201441525774)
- [微前端连载 3/7：淘宝大型应用架构中的微前端方案](https://juejin.im/post/6844904202389438478)
- [微前端连载 4/7：在字节跳动设计与实践微前端沙盒](https://juejin.im/post/6844904205367377928)
- [微前端连载 5/7：微前端主子应用路由调度](https://juejin.im/post/6847902217945481224)
- [微前端连载 6/7：微前端框架 - qiankun 大法好](https://juejin.im/post/6846687602439897101)

---
// import shared from "./shared";

// const getActiveRule = hash => location => location.hash.startsWith(hash);
const getActiveRule = hash => location => new RegExp(hash).test(location.hash);

const microApps = [
  {
    name: "micro-home-app",
    entry: "//127.0.0.1:4096/",
    activeRule: "home"
  }
];

/*
 * name: 微应用名称 - 具有唯一性
 * entry: 微应用入口 - 通过该地址加载微应用
 * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
 * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
 * props: 共享给微应用的数据
 */
const apps = microApps.map(item => {
  return {
    ...item,
    activeRule: getActiveRule(item.activeRule),
    container: "#micro-main-frame", // 子应用挂载的div
    props: {}
  };
});

export default apps;

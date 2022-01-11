window.memoryStorage.getItem("TOKEN")
window.memoryStorage.setItem("TOKEN",token)
window.memoryStorage.clear();
注:数据不需要JSON进行字符串化或者解析
清单:
TOKEN 身份凭证，
MENULIST 授权菜单，
autotRouterNames 授权路由名字----根据授权菜单获得。
autoRouterCodes  授权路由code---根据授权菜单获得。
LOGO,USERINFO  项目logo，用户信息。
lastEffectiveSessionUpdateTime 本地session过期配置
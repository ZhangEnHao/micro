# commonui
## Project setup
npm install
## Compiles and hot-reloads for development
npm run serve  
npm start   
npm run dev   
## Compiles and minifies for production
npm run build 

## 目录
* dist 打包目录    
* node_modules 包目录  
* public html模板  
* vue.config.js 项目配置  
* src 源码  
* assets 静态资源目录  
css，img，js，config 业务配置，memoryStorage.js storage 工具类，sha1 加密类，utils 工具方法  
* components 项目组件，例子   
* menu 静态菜单 ，不再使用  
* request 请求配置，请求全局配置，  
* router 路由配置，路由权限配置   
* store vue 官方组件，尽量不使用  
* views 页面组件  
* App.vue 入口组件  
* main.js 入口js  

## 相关细则

### 保存的storage清单

* TOKEN 身份凭证。    
* MENULIST 授权菜单。    
* autotRouterNames 授权路由名字----根据授权菜单获得。  
* autoRouterCodes  授权路由code---根据授权菜单获得。  
* codes 每个组件的codes。    
* lastEffectiveSessionUpdateTime 本地session过期配置。  
相关使用方法位于 memoryStorageAPI.js文件   
### 请求配置
配置文件位于src/request/index.js  

* 全局超时时间  
* 请求基础uri  
* 全局请求显示，  
* 全局异常处理  
* session 过期认证  
* token认证  
### 路由配置
配置文件位于src/router/index.js   
* 路由配置  
* token认证    
* 路由认证  
### 定时seesion过期认证
layout页面，开启和清除session过期认证定时器
### code权限配置
1.login页面 生成code列表  
2.需要code授权的页面从code列表获取自己code，然后进行授权操作。  
	
	
## 项目初始化
### 开发环境
#### 安装node,npm.
版本:8.9.1
#### 项目修改vue.config.js 代理配置
<!-- devServer: {
		open: true,
		//host: 'localhost',
		port: 80,
		https: false,
		hot: true,
		proxy: {
			'/BASEUI': {
				target: 'http://ip:port/{项目地址}/',
				changeOrigin: true,
				secure: false,
				pathRewrite: {
					'^/BASEUI': ''
				},
				/* cookiePathRewrite: {
				  "/seops": "/BASEUI",
				}, */
			},
		}, -->

target: 'http://ip:port/{项目地址}/' 指定为项目具体访问地址
#### 安装依赖
npm install
#### 启动项目 
npm start

### 生产环境
#### 部署nginx 
版本:1.10.3
#### 修改nginx配置文件
location /BASEUI {					
				proxy_pass http://ip:port/{projectName}/;	  
               /* proxy_cookie_path  /{projectName}  /BASEUI; */  
				proxy_set_header   Host             $host;   
				proxy_set_header   X-Real-IP        $remote_addr;   
				proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;   
			} 
#### 打包源码
npm run build 
#### 部署到nginx服务器
将打包后的dist目录里面的文件覆盖nginx服务器html目录里面的内容。
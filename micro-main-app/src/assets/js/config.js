let currentVersion = 1.0;
let sessionTimeOut = 30 * 60 * 1000;
let sessionIntervalTime = 1000*60;
let apiTimeOut = process.env.NODE_ENV =="development"?0:5000;
let uriRoot = "BASEUI";
let noTokenURIFilterList = ["baseinfo/logo","login","logout"];
let noSpinURIFilterList = [];
export {currentVersion,sessionTimeOut,sessionIntervalTime,apiTimeOut,uriRoot,noTokenURIFilterList,noSpinURIFilterList}
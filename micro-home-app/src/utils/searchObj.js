export default search => {
  //去掉？
  let str = search.slice(1);
  //根据“&”分割字符串
  let arr = str.split("&");
  //定义空的obj，保存对象
  let obj = {};
  //循环遍历分割后的数组
  for (let p of arr) {
    //根据“=”分割
    let arr2 = p.split("=");
    //解构
    let [name, value] = arr2;
    //如果obj中的name为undefined就把值填进去，否则就连接
    if (obj[name] == undefined) {
      obj[name] = value;
    } else {
      obj[name] = [].concat(value, obj[name]);
    }
  }
  return obj;
};

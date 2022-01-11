//写cookies
export const setCookie = (name, value) => {
  let Days = 30;
  let exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${escape(
    value
  )} ;expires=${exp.toGMTString()}; path=/BASEUI`;
};

// 读取cookies
export const getCookie = name => {
  let arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
};
// 删除cookies
export const delCookie = name => {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};
// 清除当前站点cookie
export const clearCookie = () => {
  // eslint-disable-next-line no-useless-escape
  let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
    for (let i = keys.length; i--; ) {
      document.cookie = keys[i] + "=0;expires=" + new Date(0).toUTCString(); //清除当前域名下的,例如：m.kevis.com
      document.cookie =
        keys[i] +
        "=0;domain=" +
        document.domain +
        ";expires=" +
        new Date(0).toUTCString(); //清除当前域名下的
    }
  }
};

/** 生成唯一标识 */
export function guid() {
  return "xxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 获取字符串最后一个大写字母之后的部分
export function filterByLastUpperCase(string) {
  const stringArray = string.split("");
  for (let i = string.length - 1; i >= 0; i--) {
    if (stringArray[i] > "A" && stringArray[i] < "Z") {
      return string.substr(i);
    }
  }
}

// uuid
export function uuid() {
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  let uuid = s.join("");
  return uuid;
}

const MemoryStorage = class {
  constructor() {}
  setItem(k, v) {
    sessionStorage.setItem(k, JSON.stringify(v));
    MemoryStorage.dataSendHandler(k, v);
  }
  getItem(k) {
    return JSON.parse(sessionStorage.getItem(k));
  }
  removeItem(k) {
    sessionStorage.removeItem(k);
    MemoryStorage.dataSendHandler(k);
  }
  clear() {
    sessionStorage.clear();
    MemoryStorage.dataSendHandler(JSON.parse(JSON.stringify(sessionStorage)));
  }
  static dataSendHandler(data) {
    localStorage.setItem("setMemoryStorage", JSON.stringify(data));
    localStorage.removeItem("setMemoryStorage");
  }
  static dataGetHandler() {
    localStorage.setItem("getMemoryStorage", new Date().getTime());
    localStorage.removeItem("getMemoryStorage");
  }
};
const initMemoryStorage = function() {
  var memoryStorage = new MemoryStorage();
  window.addEventListener("storage", function(e) {
    if (e.newValue === null) return false;
    if (e.key == "getMemoryStorage") {
      MemoryStorage.dataSendHandler(JSON.parse(JSON.stringify(sessionStorage)));
    } else if (e.key == "setMemoryStorage") {
      let data = JSON.parse(e.newValue);
      if (isEmptyObj(data)) {
        sessionStorage.clear();
      } else {
        for (let k in data) {
          sessionStorage.setItem(k, data[k]);
        }
      }
    }
  });

  if (isEmptyObj(sessionStorage.length == 0)) {
    MemoryStorage.dataGetHandler();
  }
  return memoryStorage;
};
function isEmptyObj(obj) {
  for (let i in obj) {
    return false;
  }
  return true;
}
export default initMemoryStorage;

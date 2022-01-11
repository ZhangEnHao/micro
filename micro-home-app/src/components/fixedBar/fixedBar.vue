<template>
  <div class="fixed-bar">
    <Header style="padding: 0;" class="layout-header-bar">
      <div class="layout-logo-left">
        <!-- <img :src="headlogo" width="112" height="35" /> -->
      </div>
      <slot></slot>
      <!-- <ul>
        <li class="header-menu-item" style="width: 100px;" v-on:click="logout">
          <Icon type="md-power" size="14" /> <span>退出</span>
        </li>
        <li
          class="header-menu-item"
          style="width: 120px;"
          v-on:click="editPWModalHandler"
        >
          <Icon type="md-lock" size="14" /> <span>修改密码</span>
        </li>
        <li class="header-menu-item" style="text-align:center;" size="17">
          <Icon type="md-contact" size="14" /> <span>{{ username }}</span>
        </li>
      </ul> -->
    </Header>
    <!-- <editPasswordComponent
      :dataInfo="passwordInfo"
      @closeComponent="closeComponent"
    ></editPasswordComponent> -->
  </div>
</template>

<script>
import { sessionTimeOut, sessionIntervalTime } from "@/assets/js/config.js";
// import editPasswordComponent from "./editPasswordComponent.vue";

export default {
  name: "fixedBar",
  data() {
    return {
      headlogo: "",
      passwordInfo: {
        model: false,
        component: "passwordInfo"
      },
      sessionInterVal: ""
    };
  },
  // components: { editPasswordComponent },
  created() {
    this.getLogo();
    // this.username = window.memoryStorage.getItem("USERINFO").userName;
    //设置定时器
    // this.sessionIntervalHandler();
  },
  watch: {
    storeLogo(val) {
      if (val) {
        this.headlogo = val;
      }
    }
  },
  methods: {
    editPWModalHandler() {
      this.passwordInfo.model = true;
    },
    closeComponent(component) {
      this[component].model = false;
    },
    sessionIntervalHandler() {
      setTimeout(() => {
        this.sessionInterVal = setInterval(() => {
          let lastTime = window.memoryStorage.getItem(
            "lastEffectiveSessionUpdateTime"
          );
          let current = new Date().getTime();
          if (!lastTime) {
            clearInterval(this.sessionInterVal);
            this.$router.push("/login");
          } else if (current - lastTime > sessionTimeOut) {
            clearInterval(this.sessionInterVal);
            this.$router.push("/login");
            this.$Notice.warning({
              desc: "",
              render: () => {
                return <span>会话超时，请重新登录</span>;
              }
            });
          }
        }, sessionIntervalTime);
      }, 1000);
    },
    logout() {
      // this.$http.post("logout").then(function() {
      //   //window.memoryStorage.clear();
      //   this.$router.push({ name: "login" });
      // });
    },
    getLogo() {
      // this.$http.get("baseinfo/logo").then(function(res) {
      //   this.headlogo = res.data.data;
      // });
    }
  }
};
</script>

<style scoped>
.fixed-bar {
  z-index: 100;
  width: 100%;
  position: fixed;
}

.layout-header-bar {
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.18);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: linear-gradient(to right, #3c4454 1%, #3c4454 100%);
}

.layout-logo-left {
  height: 50px;
  float: left;
  text-align: center;
  width: 200px;
  background: #3c4454;
}

.layout-logo-left img {
  background-size: 100% 100%;
  margin-top: 7px;
  margin-right: 20px;
}
.header-menu-item {
  list-style: none;
  font-size: 14px;
  outline: 0;
  float: right;
  padding: 0 20px;
  position: relative;
  height: 50px;
  cursor: pointer;
  z-index: 3;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  color: rgba(255, 255, 255, 0.7);
}

.header-menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  height: 50px;
  color: #fff;
}
</style>

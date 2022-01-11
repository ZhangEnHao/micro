<template>
  <div class="float-e-margins">
    <div class="titleAll ibox-title">
      <h5 class="titleAll">XX管理</h5>
    </div>
    <div class="ibox-content example">
      <div class="hidden-xs" style="margin-top: 10px">
        <Button type="primary" @click="submit">
          提交
        </Button>
        <Button @click="showDrawer" type="primary" style="margin-left: 8px">
          抽屉
        </Button>
      </div>
      <div class="textarea-box">
        <Input v-model="text" type="textarea" clearable />
      </div>
      <section id="micro-main-frame" />
      <top-drawer :display.sync="show" :closable="false">
        <div style="height: 300px">1. Hello, world! 2. Do you like it?</div>
      </top-drawer>
    </div>
  </div>
</template>

<script>
import actions from "@/micro/shared";
import TopDrawer from "@/components/TopDrawer";
export default {
  name: "Admin",
  data() {
    return {
      text: "",
      show: false
    };
  },
  created() {
    // 注册一个观察者函数
    actions.onGlobalStateChange((state, prevState) => {
      // state: 变更后的状态; prevState: 变更前的状态
      console.log("主应用观察者：prevState 改变前的值为 ", prevState);
      console.log("主应用观察者：改变后的 state 的值为 ", state);
      let { source, type, data } = state.microProps;
      if (source === "micro" && type === "save") {
        this.text = JSON.stringify(data);
      }
    });
  },
  components: { TopDrawer },
  computed: {},
  methods: {
    submit() {
      actions.setGlobalState({
        microProps: {
          source: "micro",
          type: "submit",
          data: {}
        }
      });
    },
    showDrawer() {
      this.show = true;
    }
  },
  unmounted() {
    actions.offGlobalStateChange();
  }
};
</script>

<style scoped lang="less">
.textarea-box {
  margin: 10px auto;
}
</style>

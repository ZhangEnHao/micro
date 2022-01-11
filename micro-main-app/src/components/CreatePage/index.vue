<template>
  <div class="create-page">
    <Layout>
      <Header>
        <Button @click="getLayout">Click</Button>
      </Header>
      <Layout class="layout">
        <Sider hide-trigger>Sider</Sider>
        <Content>
          <grid-layout
            :layout.sync="layout"
            :col-num="colNum"
            :row-height="30"
            :is-draggable="true"
            :is-resizable="true"
            :is-mirrored="false"
            :vertical-compact="true"
            :margin="[10, 10]"
            :use-css-transforms="true"
          >
            <grid-item
              v-for="item in layout"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :key="item.i"
            >
              {{ item.i }}
            </grid-item>
          </grid-layout>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
// import { GRID_ITEM_ID } from "./common/constants";
// import { guid } from "./utils";
export default {
  name: "CreatePage",
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  data() {
    return {
      colNum: 12,
      layout: [
        { x: 0, y: 0, w: 2, h: 4, i: "0" },
        { x: 2, y: 0, w: 2, h: 4, i: "1" },
        { x: 4, y: 0, w: 2, h: 4, i: "2" },
        { x: 6, y: 0, w: 2, h: 4, i: "3" },
        { x: 8, y: 0, w: 2, h: 4, i: "4" },
        { x: 10, y: 0, w: 2, h: 4, i: "5" },
        { x: 0, y: 5, w: 2, h: 4, i: "6" },
        { x: 2, y: 5, w: 2, h: 4, i: "7" },
        { x: 4, y: 5, w: 2, h: 4, i: "8" },
        { x: 6, y: 5, w: 2, h: 4, i: "9" },
        { x: 8, y: 5, w: 2, h: 4, i: "10" },
        { x: 10, y: 5, w: 2, h: 4, i: "11" },
        { x: 0, y: 10, w: 2, h: 4, i: "12" },
        { x: 2, y: 10, w: 2, h: 4, i: "13" },
        { x: 4, y: 10, w: 2, h: 4, i: "14" },
        { x: 6, y: 10, w: 2, h: 4, i: "15" },
        { x: 8, y: 10, w: 2, h: 4, i: "16" },
        { x: 10, y: 10, w: 2, h: 4, i: "17" },
        { x: 0, y: 15, w: 2, h: 4, i: "18" },
        { x: 2, y: 15, w: 2, h: 4, i: "19" },
        { x: 4, y: 15, w: 2, h: 4, i: "20" },
        { x: 6, y: 15, w: 2, h: 4, i: "21" },
        { x: 8, y: 15, w: 2, h: 4, i: "22" },
        { x: 10, y: 15, w: 2, h: 4, i: "23" }
      ]
    };
  },
  computed: {},
  methods: {
    getLayout() {
      console.log(this.layout);
    }
  }
};
</script>

<style scoped lang="less">
.create-page {
  // 布局
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ivu-layout {
    height: 100%;
    .ivu-layout-header {
      height: 50px;
      padding: 0;
      box-sizing: border-box;
      line-height: 1;
      background: #ffffff;
    }
    .layout {
      height: calc(100% - 50px);
      .ivu-layout-sider {
        background: #ffffff;
        overflow-y: auto;
      }
      .ivu-layout-content {
        width: 100%;
        height: auto;
        background: #ffffff;
        .vue-grid-layout {
          .vue-grid-item {
            background: #eeeeee;
          }
        }
      }
    }
  }
}
</style>

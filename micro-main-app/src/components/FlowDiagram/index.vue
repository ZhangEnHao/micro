<template>
  <div class="flow-diagram-wrap">
    <Layout>
      <Header>
        <control-bar :lf="lf" :eleData="eleData" @setEleData="setEleData" />
      </Header>
      <Layout>
        <Sider hide-trigger>
          <node-panel :lf="lf" />
        </Sider>
        <Content ref="content">
          <flow-diagram-content
            v-bind="$attrs"
            @setLF="setLF"
            @openDrawer="openDrawer"
            @blankClick="blankClick"
          />
        </Content>
      </Layout>
      <Drawer :title="title" v-model="drawerShow" :width="50">
        <detail-panel
          v-if="drawerShow"
          :lf="lf"
          :eleData="eleData"
          :drawerCancle="drawerCancle"
          :drawerSubmit="drawerSubmit"
        >
          <component :is="app" v-if="drawerShow" :eleData="eleData" />
        </detail-panel>
      </Drawer>
    </Layout>
  </div>
</template>

<script>
import ControlBar from "./components/ControlBar";
import NodePanel from "./components/NodePanel";
import FlowDiagramContent from "./components/FlowDiagramContent";
import DetailPanel from "./components/DetailPanel";
import nodeList from "./config/nodeList";
import { filterByLastUpperCase } from "./utils";

let nodes = [];
for (let key in nodeList) {
  nodes = [...nodes, ...nodeList[key]];
}

export default {
  name: "FlowDiagram",
  data() {
    return {
      containerId: "",
      lf: {},
      drawerShow: false,
      app: {},
      eleData: {}
    };
  },
  components: {
    ControlBar,
    NodePanel,
    FlowDiagramContent,
    DetailPanel
  },
  computed: {
    title: function() {
      let value = "";
      if (this.eleData.eleType === "node") {
        nodes.forEach(node => {
          if (node.type === this.eleData.data.type) {
            value = node.text;
          }
        });
        return value;
      } else if (this.eleData.eleType === "edge") {
        return "连接线";
      } else {
        return "未定义描述";
      }
    }
  },
  methods: {
    setLF(lf) {
      this.lf = lf;
    },
    setEleData(eleData) {
      this.eleData = eleData;
    },
    openDrawer(flag, eleType, data) {
      this.eleData = { eleType, data };
      let detailType = "";
      switch (filterByLastUpperCase(data.type)) {
        case "Gateway":
          detailType = "Gateway";
          break;
        default:
          detailType = data.type;
          break;
      }
      this.app = () =>
        import(`./components/DetailPanel/${eleType}/${detailType}`)
          .then(/*console.log*/)
          .catch(error => {
            const {
              properties: { isReset, title }
            } = data;
            this.eleData = {
              eleType: "error",
              data: {
                title: isReset ? title : error.message,
                desc: `未能正确引入当前节点详情描述信息，请检查当前节点类型或者编写当前节点的类型和详情描述信息`
              }
            };
            this.app = () => import(`./components/DetailPanel/error`);
          });
      this.drawerShow = flag;
    },
    blankClick() {
      this.eleData = {};
    },
    drawerCancle() {
      this.drawerShow = false;
    },
    drawerSubmit(formData) {
      let { eleType, data } = this.eleData;
      data.properties = formData;
      switch (eleType) {
        case "node":
          this.lf.setNodeData(data);
          break;
        case "edge":
          this.lf.setEdgeData(data);
          break;
        default:
          break;
      }
      this.drawerCancle();
      this.$Message.success("Success!");
    }
  }
};
</script>

<style lang="less">
.flow-diagram-wrap {
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
    .ivu-layout-sider {
      background: #ffffff;
      overflow-y: auto;
    }
    .ivu-layout-content {
      width: 100%;
      height: 100%;
    }
  }
}

// 抽屉
.flow-drawer-page {
  height: 100%;
  .flow-drawer-form {
    height: calc(100% - 57px);
    max-height: calc(100% - 57px);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .flow-drawer-footer {
    width: 100%;
    position: absolute;
    bottom: 25px;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
    & > button:first-child {
      margin-right: 8px;
    }
  }
}
</style>

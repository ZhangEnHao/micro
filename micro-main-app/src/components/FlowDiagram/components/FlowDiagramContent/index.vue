<template>
  <div>
    <div
      :id="containerId"
      ref="flowDiagramContentRef"
      class="flow-diagram-content"
    />
    <Card :style="style" v-if="currentNode.id">
      <p slot="title">{{ currentNode.text.value }}</p>
      <p><Button type="text">选项 1</Button></p>
      <p><Button type="text">选项 2</Button></p>
      <p><Button type="text">选项 3</Button></p>
    </Card>
  </div>
</template>

<script>
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import { Snapshot /*, BpmnElement, BpmnAdapter*/ } from "@logicflow/extension";
import { CONTAINER_ID } from "../../common/constants";
import { guid, uuid } from "../../utils";
import {
  StartNoneEvent,
  timerStart,
  messageStart,
  signalStart,
  UserTask,
  scriptTask,
  ExclusiveGateway,
  ParallelGateway,
  InclusiveGateway,
  timerCatch,
  EndNoneEvent
} from "../../registerNode";
import { SequenceFlow } from "../../registerEdge";

export default {
  name: "FlowDiagramContent",
  data() {
    return {
      currentNode: {}
    };
  },
  created() {
    this.containerId = `${CONTAINER_ID}_${guid()}`;
  },
  computed: {
    style: function() {
      return {
        position: "fixed",
        "z-index": 99,
        width: "200px",
        left: `${this.currentNode.x + 10}px`,
        top: `${this.currentNode.y + 20}px`
      };
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initLF();
    });
  },
  methods: {
    initLF() {
      // 画布配置
      LogicFlow.use(Snapshot);
      // 使用bpmn插件，引入bpmn元素，这些元素可以在turbo中转换后使用
      // LogicFlow.use(BpmnElement);
      const { offsetWidth = 0, offsetHeight = 0 } =
        this.$refs.flowDiagramContentRef || {};

      const lf = new LogicFlow({
        // 容器配置
        container: this.$refs.flowDiagramContentRef,
        // 画布配置
        width: offsetWidth,
        height: offsetHeight,
        grid: true,
        background: {
          color: "#ffffff"
        },
        // 工具配置
        keyboard: {
          enabled: true
        },
        textEdit: false,
        edgeType: "SequenceFlow",
        isSilentMode: this.$attrs.isSilentMode
      });

      this.$emit("setLF", lf);
      // 设置主题
      lf.setTheme({
        circle: {
          r: 21,
          strokeWidth: 1
        },
        rect: {
          width: 80,
          height: 44,
          radius: 4,
          strokeWidth: 1
        },
        polygon: {
          strokeWidth: 1
        },
        anchor: {
          stroke: "#369bcf"
        },
        polyline: {
          stroke: "#aab7c3",
          strokeWidth: 1,
          hoverStroke: "#369bcf",
          selectedStroke: "#aab7c3",
          outlineColor: ""
        }
      });

      this.$_registerNode(lf);
    },
    // 自定义节点
    $_registerNode(lf) {
      SequenceFlow(lf);
      StartNoneEvent(lf);
      timerStart(lf);
      messageStart(lf);
      signalStart(lf);
      UserTask(lf);
      scriptTask(lf);
      ExclusiveGateway(lf);
      ParallelGateway(lf);
      InclusiveGateway(lf);
      timerCatch(lf);
      EndNoneEvent(lf);
      this.$_render(lf, this.$attrs.dataSource);
    },
    $_render(lf, demoData = { nodes: [], edges: [] }) {
      demoData.nodes.forEach((node, index) => {
        const Model = lf.graphModel.getModel(node.type);
        if (!Model) {
          const { id = uuid(), x = 10, y = 10 } = demoData.nodes[index];
          demoData.nodes.splice(index, 1, {
            id,
            x,
            y,
            type: "rect",
            text: { x, y, value: "未知节点" },
            properties: { isReset: true, title: "未定义当前节点" }
          });
        }
      });
      lf.render(demoData);

      if (this.$attrs.isSilentMode) {
        // 只读模式
        this.$_LFShowEvent(lf);
      } else {
        // 编辑模式
        this.$_LfEditEvent(lf);
      }
    },
    $_LfEditEvent(lf) {
      lf.on("node:click", ({ data }) => {
        this.$emit("openDrawer", false, "node", data);
      });
      lf.on("edge:click", ({ data }) => {
        this.$emit("openDrawer", false, "edge", data);
      });
      lf.on("node:dbclick", ({ data }) => {
        this.$emit("openDrawer", true, "node", data);
      });
      lf.on("edge:dbclick", ({ data }) => {
        this.$emit("openDrawer", true, "edge", data);
      });
      lf.on("blank:click", () => {
        // 取消所有被选中元素的选中状态
        lf.clearSelectElements();
        this.$emit("blankClick");
      });
    },
    $_LFShowEvent(lf) {
      lf.on("node:contextmenu", ({ data }) => {
        this.currentNode = data;
      });
      lf.on("blank:click", () => {
        this.currentNode = {};
        // 取消所有被选中元素的选中状态
        lf.clearSelectElements();
        this.$emit("blankClick");
      });
    }
  }
};
</script>

<style scoped lang="less">
.flow-diagram-content {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>

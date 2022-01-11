<template>
  <div class="control-bar">
    <Tooltip content="撤销" placement="bottom">
      <span @click="$_undo" class="tool-icon" data-command="undo">
        <Icon type="ios-undo-outline" />
      </span>
    </Tooltip>
    <Tooltip @click="$_redo" content="重复" placement="bottom">
      <span class="tool-icon" data-command="redo">
        <Icon type="ios-redo-outline" />
      </span>
    </Tooltip>
    <div class="separator" />
    <Tooltip content="复制" placement="bottom">
      <span
        @click="$_copy"
        :class="[
          'tool-icon',
          eleData.data && eleData.data.id ? '' : 'isDisable'
        ]"
        data-command="copy"
      >
        <Icon type="ios-copy-outline" />
      </span>
    </Tooltip>
    <Tooltip content="删除" placement="bottom">
      <span
        @click="$_delete"
        :class="[
          'tool-icon',
          eleData.data && eleData.data.id ? '' : 'isDisable'
        ]"
        data-command="delete"
      >
        <Icon type="ios-trash-outline" />
      </span>
    </Tooltip>
    <div class="separator" />
    <Tooltip content="缩小" placement="bottom">
      <span @click="$_zoomOut" class="tool-icon" data-command="zoomOut">
        <Icon type="ios-contract" />
      </span>
    </Tooltip>
    <Tooltip content="放大" placement="bottom">
      <span @click="$_zoomIn" class="tool-icon" data-command="zoomIn">
        <Icon type="ios-expand" />
      </span>
    </Tooltip>
    <Tooltip content="还原" placement="bottom">
      <span @click="$_reset" class="tool-icon" data-command="reset">
        <Icon type="ios-locate-outline" />
      </span>
    </Tooltip>
    <Tooltip content="适应屏幕" placement="bottom">
      <span @click="$_zoomReset" class="tool-icon" data-command="zoomReset">
        <Icon type="ios-desktop-outline" />
      </span>
    </Tooltip>
    <div class="separator" />
    <Tooltip content="下载图片" placement="bottom">
      <span @click="$_downloadImg" class="tool-icon" data-command="downloadImg">
        <Icon type="ios-cloud-download-outline" />
      </span>
    </Tooltip>
    <Tooltip content="保存" placement="bottom">
      <Button type="primary" @click="$_save">保存</Button>
    </Tooltip>
  </div>
</template>

<script>
export default {
  name: "ControlBar",
  props: {
    lf: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    },
    eleData: {
      type: Object
    }
  },
  data() {
    return {};
  },
  components: {},
  methods: {
    $_undo() {
      this.$props.lf.undo();
    },
    $_redo() {
      this.$props.lf.redo();
    },
    $_zoomOut() {
      this.$props.lf.zoom(false);
    },
    $_zoomIn() {
      this.$props.lf.zoom(true);
    },
    $_reset() {
      this.$props.lf.resetZoom();
      this.$props.lf.resetTranslate();
    },
    $_copy() {
      if (!this.eleData.data || !this.eleData.data.id) return;
      let copyNode = this.$props.lf.cloneNode(this.eleData.data.id);
      this.$emit("setEleData", {
        eleType: this.eleData.eleType,
        data: copyNode
      });
    },
    $_zoomReset() {
      this.$props.lf.resetZoom();
    },
    $_delete() {
      if (this.eleData.eleType === "node") {
        this.$props.lf.deleteNode(this.eleData.data.id);
      } else if (this.eleData.eleType === "edge") {
        const { sourceNodeId, targetNodeId } = this.eleData.data;
        this.$props.lf.removeEdge({ sourceNodeId, targetNodeId });
      }
      this.$props.lf.clearSelectElements();
      this.$emit("setEleData", {});
    },
    $_downloadImg() {
      this.$props.lf.getSnapshot();
    },
    $_save() {
      // 通过 getGraphData 来获取转换后的数据
      window.localStorage.setItem(
        "data",
        JSON.stringify(this.$props.lf.getGraphData())
      );
    }
  }
};
</script>

<style scoped lang="less">
.control-bar {
  width: 100%;
  height: 50px;
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #e9e9e9;
  box-shadow: 0 8px 12px 0 rgba(0, 52, 107, 0.04);
  display: flex;
  flex-direction: row;
  .ivu-tooltip {
    margin: 0 10px;
    .tool-icon {
      display: block;
      width: 30px;
      height: 30px;
      border: 1px solid transparent;
      box-sizing: border-box;
      text-align: center;
      line-height: 1.5;
      font-size: 18px;
      &:hover {
        border: 1px solid #eeeeee;
      }
    }
  }
  .separator {
    width: 1px;
    height: 30px;
    background: #eeeeee;
  }
}

.isDisable {
  cursor: not-allowed;
  color: #eeeeee;
}
</style>

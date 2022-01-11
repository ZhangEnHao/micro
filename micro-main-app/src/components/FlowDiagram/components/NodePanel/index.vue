<template>
  <div class="node-panel">
    <Collapse class="node-panel-collapse">
      <Panel name="start">
        开始事件
        <div slot="content">
          <div
            class="node-item"
            v-for="item in nodeList.start"
            :key="item.text"
            @mousedown="$_dragNode(item)"
          >
            <img :src="item.src" :style="{ width: '42px', height: '42px' }" />
            <div class="node-label">{{ item.text }}</div>
          </div>
        </div>
      </Panel>
      <Panel name="activity">
        活动
        <div slot="content">
          <div
            class="node-item"
            v-for="item in nodeList.activity"
            :key="item.text"
            @mousedown="$_dragNode(item)"
          >
            <img :src="item.src" :style="{ width: '80px', height: '44px' }" />
            <div class="node-label">{{ item.text }}</div>
          </div>
        </div>
      </Panel>
      <Panel name="gateway">
        网关
        <div slot="content">
          <div
            class="node-item"
            v-for="item in nodeList.gateway"
            :key="item.text"
            @mousedown="$_dragNode(item)"
          >
            <img :src="item.src" :style="{ width: '48px', height: '48px' }" />
            <div class="node-label">{{ item.text }}</div>
          </div>
        </div>
      </Panel>
      <Panel name="capture">
        捕获事件
        <div slot="content">
          <div
            class="node-item"
            v-for="item in nodeList.capture"
            :key="item.text"
            @mousedown="$_dragNode(item)"
          >
            <img :src="item.src" :style="{ width: '58px', height: '38px' }" />
            <div class="node-label">{{ item.text }}</div>
          </div>
        </div>
      </Panel>
      <Panel name="end">
        结束事件
        <div slot="content">
          <div
            class="node-item"
            v-for="item in nodeList.end"
            :key="item.text"
            @mousedown="$_dragNode(item)"
          >
            <img :src="item.src" :style="{ width: '42px', height: '42px' }" />
            <div class="node-label">{{ item.text }}</div>
          </div>
        </div>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
import nodeList from "../../config/nodeList";
export default {
  name: "NodePanel",
  props: {
    lf: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
  data() {
    return {
      nodeList
    };
  },
  components: {},
  methods: {
    $_dragNode(item) {
      this.$props.lf.dnd.startDrag({
        type: item.type
      });
    }
  }
};
</script>

<style lang="less">
.node-panel {
  .ivu-collapse.node-panel-collapse {
    .ivu-collapse-item {
      border: none;
      .ivu-collapse-content {
        text-align: center;
        background: #f0f2f5;
        .node-item {
          img {
            padding: 4px;
            border-radius: 2px;
            border: 1px solid transparent;
            &:hover {
              border: 1px solid #ccc;
              cursor: move;
            }
          }
          .node-label {
            font-size: 14px;
          }
        }
      }
    }
  }
  .ivu-collapse.node-panel-collapse
    > .ivu-collapse-item
    > .ivu-collapse-header {
    padding: 10px 15px;
    color: rgba(0, 0, 0, 0.85);
    border-bottom: 1px solid #e9e9e9;
    text-align: left;
    transition: all 0.3s;
  }
}
</style>

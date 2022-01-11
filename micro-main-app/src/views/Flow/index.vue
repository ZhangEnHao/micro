<template>
  <div class="page">
    <FlowDiagram :dataSource="dataSource" />
  </div>
</template>

<script>
import FlowDiagram from "@/components/FlowDiagram";

export default {
  name: "Flow",
  data() {
    return {
      dataSource: { nodes: [], edges: [] }
    };
  },
  components: { FlowDiagram },
  created() {
    if (window.localStorage.getItem("data")) {
      this.dataSource = JSON.parse(window.localStorage.getItem("data"));
    }
  }
};
</script>

<style scoped lang="less">
.page {
  width: 100%;
  height: 100%;
}
</style>

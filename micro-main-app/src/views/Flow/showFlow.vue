<template>
  <div class="page">
    <FlowDiagramContent :dataSource="dataSource" :isSilentMode="true" />
  </div>
</template>

<script>
import FlowDiagramContent from "@/components/FlowDiagram/components/FlowDiagramContent";

export default {
  name: "ShowFlow",
  data() {
    return {
      dataSource: {}
    };
  },
  components: { FlowDiagramContent },
  created() {
    console.log(JSON.parse(window.localStorage.getItem("data")));
    this.dataSource = JSON.parse(window.localStorage.getItem("data")) || {};
  }
};
</script>

<style scoped lang="less">
.page {
  width: 100%;
  height: 100%;
}
</style>

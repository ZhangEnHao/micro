<template>
  <div class="page">
    <CreatePage />
  </div>
</template>

<script>
import CreatePage from "../../components/CreatePage";
export default {
  name: "GridPage",
  data() {
    return {};
  },
  components: { CreatePage }
};
</script>

<style scoped lang="less">
.page {
  width: 100%;
  height: calc(100vh - 50px);
  position: absolute;
}
</style>

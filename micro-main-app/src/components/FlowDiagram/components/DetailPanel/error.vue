<template>
  <div class="error">
    <Alert show-icon>
      <Icon type="ios-bulb-outline" slot="icon"></Icon>
      <h3 class="error-title">{{ this.$attrs.eleData.data.title }}</h3>
      <p>{{ this.$attrs.eleData.data.desc }}</p>
    </Alert>
    <img :src="src" class="not-find" />
  </div>
</template>

<script>
export default {
  name: "Error",
  data() {
    return {
      src: require("../../assets/img/404.svg")
    };
  },
  components: {}
};
</script>

<style scoped lang="less">
.error-title {
  margin: 0 0 20px 0;
}
.not-find {
  display: block;
  margin: 100px auto;
}
</style>

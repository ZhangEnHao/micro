<template>
  <div class="fixed-bar">
    <Header style="padding: 0;" class="layout-header-bar">
      <div class="layout-logo-left"></div>
      <slot></slot>
    </Header>
  </div>
</template>

<script>
export default {
  name: "fixedBar"
};
</script>

<style scoped>
.fixed-bar {
  z-index: 999;
  width: 100%;
  position: fixed;
}

.layout-header-bar {
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.18);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: linear-gradient(to right, #3c4454 1%, #3c4454 100%);
}

.layout-logo-left {
  height: 50px;
  float: left;
  text-align: center;
  width: 200px;
  background: #3c4454;
}

.layout-logo-left img {
  background-size: 100% 100%;
  margin-top: 7px;
  margin-right: 20px;
}
.header-menu-item {
  list-style: none;
  font-size: 14px;
  outline: 0;
  float: right;
  padding: 0 20px;
  position: relative;
  height: 50px;
  cursor: pointer;
  z-index: 3;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  color: rgba(255, 255, 255, 0.7);
}

.header-menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  height: 50px;
  color: #fff;
}
</style>

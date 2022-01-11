<template>
  <div class="flow-drawer-page">
    <div class="flow-drawer-form">
      <slot />
    </div>
    <div class="flow-drawer-footer">
      <Button
        type="primary"
        @click="handleSubmit"
        v-if="this.$attrs.eleData.eleType !== 'error'"
        >确定</Button
      >
      <Button type="error" @click="cancleHandler">取消</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailPanel",
  data() {
    return {
      formData: {}
    };
  },
  methods: {
    cancleHandler() {
      this.$attrs.drawerCancle();
    },
    handleSubmit() {
      let { $refs, formData } = this.$slots.default[0].componentInstance;
      this.formData = formData;
      $refs["formData"].validate(valid => {
        if (valid) {
          this.$attrs.drawerSubmit(formData);
          this.$attrs.lf.updateText(this.$attrs.eleData.data.id, formData.name);
        }
      });
    }
  }
};
</script>

<style scoped lang="less"></style>

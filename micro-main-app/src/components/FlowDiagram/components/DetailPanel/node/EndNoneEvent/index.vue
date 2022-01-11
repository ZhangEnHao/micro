<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <Form
    :model="formData"
    ref="formData"
    :rules="ruleValidate"
    label-position="top"
  >
    <Row :gutter="32">
      <Col span="12">
        <FormItem prop="overrideid" label="编号">
          <Input v-model="formData.overrideid" placeholder="编号" />
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem prop="name" label="名称">
          <Input v-model="formData.name" placeholder="名称" />
        </FormItem>
      </Col>
    </Row>
    <FormItem prop="documentation" label="说明">
      <Input
        type="textarea"
        v-model="formData.documentation"
        :rows="4"
        placeholder="说明"
      />
    </FormItem>
  </Form>
</template>

<script>
export default {
  name: "EndNoneEvent",
  data() {
    return {
      formData: {
        overrideid: "",
        name: "",
        documentation: "",
        executionlisteners: ""
      },
      ruleValidate: {}
    };
  },
  mounted() {
    const { data } = this.$attrs.eleData;
    if (data.properties) {
      this.formData = Object.assign({}, this.formData, data.properties);
    }
  }
};
</script>

<style scoped lang="less"></style>

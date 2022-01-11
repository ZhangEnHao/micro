<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <Form :model="formData" ref="formData">
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
    <FormItem prop="staticValue" label="流转条件">
      <Input
        type="textarea"
        v-model="formData.conditionsequenceflow.expression.staticValue"
        :rows="4"
        placeholder="流转条件"
      />
    </FormItem>
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
  name: "SequenceFlow",
  data() {
    return {
      formData: {
        overrideid: "",
        name: "",
        documentation: "",
        conditionsequenceflow: {
          expression: { type: "static", staticValue: "" }
        }
      }
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

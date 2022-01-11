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
    <FormItem prop="documentation" label="分配类型">
      <RadioGroup v-model="formData.type">
        <Radio label="idm">系统</Radio>
        <Radio label="static">固定值</Radio>
      </RadioGroup>
    </FormItem>
    <IdmForm :dataSource="formData" v-if="formData.type === 'idm'" />
    <StaticForm :dataSource="formData" v-if="formData.type === 'static'" />
    <FormItem prop="documentation">
      <Checkbox v-model="formData.initiatorCanCompleteTask"
        >允许流程发起人完成任务</Checkbox
      >
    </FormItem>
    <FormItem prop="formreference" label="引用表单">
      <Input v-model="formData.formreference" placeholder="引用表单" />
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
import IdmForm from "./IdmForm";
import StaticForm from "./StaticForm";
export default {
  name: "UserTask",
  data() {
    return {
      formData: {
        overrideid: "",
        name: "",
        documentation: "",
        type: "",
        initiatorCanCompleteTask: false
      },
      ruleValidate: {
        formreference: [
          {
            required: true,
            message: "请输入引用表单URL"
          },
          {
            message: "输入正确引用表单URL",
            pattern: /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i
          }
        ]
      }
    };
  },
  components: { IdmForm, StaticForm },
  mounted() {
    const { data } = this.$attrs.eleData;
    if (data.properties) {
      this.formData = Object.assign({}, this.formData, data.properties);
    }
  }
};
</script>

<style scoped lang="less"></style>

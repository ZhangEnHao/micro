<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <div>
    <FormItem prop="documentation" label="分配任务">
      <Select v-model="formData.assignment">
        <!-- <Option
              v-for="item in cityList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            > -->
      </Select>
    </FormItem>
    <template v-if="formData.assignment">
      <FormItem prop="assignee" label="Assignee">
        <span></span>
      </FormItem>
      <Row :gutter="32">
        <Col span="12">
          <FormItem prop="search" label="Search">
            <Input placeholder="Search" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem prop="email" label="Email">
            <Input placeholder="Email" />
          </FormItem>
        </Col>
      </Row>
    </template>
  </div>
</template>

<script>
export default {
  name: "IdmForm",
  data() {
    return {
      formData: {
        assignment: ""
      }
    };
  },
  components: {},
  mounted() {
    if (this.$attrs.dataSource) {
      this.formData = Object.assign({}, this.formData, this.$attrs.dataSource);
    }
  }
};
</script>

<style scoped lang="less"></style>

<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <div>
    <FormItem prop="documentation" label="分配任务">
      <Input placeholder="分配任务" />
    </FormItem>
    <Row :gutter="32">
      <Col span="12">
        <FormItem
          v-for="(item, index) in formData.users"
          :key="item.id"
          :label="!index ? '候选用户' : null"
        >
          <Row>
            <Col span="18">
              <Input type="text" />
            </Col>
            <Col span="3" offset="1">
              <Button @click="handleRemove('users', index)">删除</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Row>
            <Col span="12" offset="10">
              <Button
                type="dashed"
                long
                @click="handleAdd('users')"
                icon="md-add"
                >新增</Button
              >
            </Col>
          </Row>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem
          v-for="(item, index) in formData.groups"
          :key="item.id"
          :label="!index ? '候选组' : null"
        >
          <Row>
            <Col span="18">
              <Input type="text" />
            </Col>
            <Col span="3" offset="1">
              <Button @click="handleRemove('groups', index)">删除</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Row>
            <Col span="12" offset="10">
              <Button
                type="dashed"
                long
                @click="handleAdd('groups')"
                icon="md-add"
                >新增</Button
              >
            </Col>
          </Row>
        </FormItem>
      </Col>
    </Row>
  </div>
</template>

<script>
import { guid } from "../../../../utils";
export default {
  name: "StaticForm",
  data() {
    return {
      formData: {
        users: [
          {
            value: "",
            id: `users_${guid()}`
          }
        ],
        groups: [
          {
            value: "",
            id: `groups_${guid()}`
          }
        ]
      }
    };
  },
  mounted() {
    if (this.$attrs.dataSource) {
      this.formData = Object.assign({}, this.formData, this.$attrs.dataSource);
    }
  },
  methods: {
    handleAdd(key) {
      this.formData[key].push({
        value: "",
        id: `${key}_${guid()}`
      });
    },
    handleRemove(key, index) {
      this.formData[key].splice(index, 1);
    }
  }
};
</script>

<style scoped lang="less"></style>

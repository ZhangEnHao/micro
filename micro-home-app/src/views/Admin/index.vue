<template>
  <div class="page">
    <h2>micro-home-app Admin</h2>
    <Form
      ref="createForm"
      :model="form"
      :rules="formRules"
      inline
      :label-width="100"
    >
      <FormItem prop="modelName" label="模板名称" style="width: 30%">
        <Input
          type="text"
          clearable
          v-model.trim="form.modelName"
          placeholder="模板名称"
        />
      </FormItem>
      <FormItem prop="estTime" label="预计执行时间" style="width: 30%">
        <Input
          type="text"
          clearable
          v-model.trim="form.estTime"
          placeholder="单位：秒"
        />
      </FormItem>
      <FormItem prop="screenTitle" label="标题" style="width: 30%">
        <Input
          type="text"
          clearable
          v-model.trim="form.screenTitle"
          placeholder="标题"
        />
      </FormItem>
      <FormItem prop="screenEqpt" label="硬件设备" style="width: 30%">
        <Input
          type="text"
          clearable
          v-model.trim="form.screenEqpt"
          placeholder="硬件设备"
        />
      </FormItem>
      <FormItem prop="screenDatabase" label="数据库" style="width: 30%">
        <Input
          type="text"
          clearable
          v-model.trim="form.screenDatabase"
          placeholder="数据库"
        />
      </FormItem>
      <FormItem prop="screenBussys" label="业务系统" style="width: 30%">
        <Input
          type="text"
          clearable
          v-model.trim="form.screenBussys"
          placeholder="业务系统"
        />
      </FormItem>
      <FormItem prop="screenServer" label="服务器" style="width: 30%">
        <Input
          type="text"
          clearable
          v-model.trim="form.screenServer"
          placeholder="服务器"
        />
      </FormItem>
      <FormItem prop="screenEnviron" label="大屏环境" style="width: 30%">
        <Input
          type="text"
          clearable
          v-model.trim="form.screenEnviron"
          placeholder="大屏环境"
        />
      </FormItem>
    </Form>
  </div>
</template>

<script>
import actions from "@/shared/actions";
export default {
  name: "Admin",
  data() {
    return {
      form: {
        modelName: "",
        estTime: "",
        screenTitle: "",
        screenEqpt: "硬件设备,计算设备:61;存储设备:3;网络设备:30;专用设备:5",
        screenDatabase: "数据库,Oracle:7;Informix:1",
        screenBussys:
          "业务系统,核心系统:4;综合前置:4;二代支付:5;内联GXP:4;外联GXP:4;银联GXP:1;柜面:4;支付密码核验:2;加密平台:4;卡前置:1;理财:1",
        screenServer: "服务器,应用:80;数据库:30;其它:30",
        screenEnviron:
          "业务系统(套):11;服务器(个):60;数据库(套):8;硬件设备(台):20"
      },
      formRules: {
        modelName: [{ required: true, message: "模板名称不能为空" }],
        estTime: [{ required: true, message: "预计执行时间不能为空" }],
        screenTitle: [{ required: true, message: "标题不能为空" }],
        screenEqpt: [{ required: true, message: "硬件设备不能为空" }],
        screenDatabase: [{ required: true, message: "数据库不能为空" }],
        screenBussys: [{ required: true, message: "业务系统不能为空" }],
        screenServer: [{ required: true, message: "服务器不能为空" }],
        screenEnviron: [{ required: true, message: "大屏环境不能为空" }]
      }
    };
  },
  components: {},
  mounted() {
    // 注册观察者函数
    // onGlobalStateChange 第二个参数为 true，表示立即执行一次观察者函数
    actions.onGlobalStateChange(state => {
      const {
        microProps: { source, type }
      } = state;
      if (source === "micro" && type === "submit") {
        this.createModalHandler();
      }
      // }, true);
    });
  },
  methods: {
    createModalHandler() {
      this.$refs["createForm"].validate(valid => {
        if (valid) {
          actions.setGlobalState({
            microProps: {
              source: "micro",
              type: "save",
              data: { ...this.form }
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="less"></style>

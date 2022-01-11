<template>
	<Modal :title="title" v-model="info.modal" :mask-closable="false" @on-visible-change="initInfo" width=400>
		<Form  ref="createForm" :model="createModel"  :rules="createRules" :label-width="96">
		        <FormItem prop="name" label="节点名称">
		            <Input type="text" v-model.trim="createModel.name"  :maxlength="30" style="width:200px"></Input>
		        </FormItem>
		        <FormItem prop="subModelId" label="关联模板">
		            <Select v-model="createModel.subModelId" style="width:200px">
		            	<template v-for="item in modelList">
		            		<Option :value="item.modelId">{{item.modelName}}</Option>
		            	</template>
		            </Select>
		        </FormItem>
		        <FormItem prop="exeWay" label="执行方式">
		        	<Select v-model="createModel.exeWay" style="width:200px">
		        		<Option value="0">同步执行</Option>
		        		<Option value="1">异步执行</Option>
		        	</Select>
		        </FormItem>
		    </Form>
		    <div slot="footer">
		    	<Button  class="ivu-btn ivu-btn-primary ivu-btn-large"
					v-on:click="saveHandler">保存</Button>
				<Button  class="ivu-btn ivu-btn-error ivu-btn-large"
					v-on:click="cancelHandler"  style="margin-left: 8px">取消</Button>
			</div>
	</Modal>
</template>

<script>
	import {Button,Icon,Input,Checkbox,Select,iOption} from "iview";
	export default{
		props:["info","gooFlow"],
		data() {
			return {
				title:"子流程",
				createModel:{
					name:"",
					subModelId:"",
					exeWay:"",
				},
				createRules:{
					name:[
						{required:true,message:"节点名称不能为空"},
						{message: "输入中文、字母、数字、中划线、下划线",pattern: /^[-_a-zA-Z0-9\u4e00-\u9fa5]+$/},
						{min:2,max:30,message:"长度在2-30之间"}],
					subModelId:[{required:true,message:"关联模板不能为空"}],
					exeWay:[{required:true,message:"执行方式不能为空"}],
				},
				modelList:[],
			}
		},
		mounted() {},
		created() {
		},
		updated(){
		},
		computed:{},
		methods: {
			saveHandler(){
				let flag = true;
				this.$refs.createForm.validate(valid=>{
						flag = valid;
				})
				if(!flag){
					return;
				}
				this.$Modal.confirm({
					title:' ',
	                content: '<p>请确认是否保存</p>',
	                onOk: () => {
	                	this.$emit("saveComponent",this.info,this.createModel.name,JSON.stringify(this.createModel));
                	}
	            });
			},
			cancelHandler(){
				this.$emit("closeComponent","subProcess");
			},
			initModelList(){
				this.$http.get("designer/subModelList",{root:"WF"}).then(res=>{
					this.modelList = res.data.data;
				})
			},
			initInfo(flag){
				if(flag){
					this.initModelList();
					this.$refs["createForm"].resetFields();
					let data = this.gooFlow.$nodeData[this.info.nodeId].data;
					if("{}" != data){
						this.createModel = JSON.parse(data);
					}
				}
			}
		},
	}
</script>

<style>
</style>
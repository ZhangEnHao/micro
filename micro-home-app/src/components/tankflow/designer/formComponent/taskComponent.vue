<template>
	<Modal :title="title" v-model="info.modal" :mask-closable="false" @on-visible-change="initInfo" width=400>
		<Form  ref="createForm" :model="createModel"  :rules="createRules" :label-width="96">
		        <FormItem prop="name" label="节点名称">
		            <Input type="text" v-model.trim="createModel.name" :maxlength="30" placeholder="名称" style="width:200px"></Input>
		        </FormItem>
		        <FormItem prop="specialRole" label="pageCode">
		        	<Select v-model="createModel.specialRole" placeholder="根据角色的code码，展示人工处理表单" style="width:200px" clearable @on-change="roleChange">
		        		<Option value="1">根据角色的code码，展示人工处理表单</Option>
		        	</Select>
		        </FormItem>
		        <FormItem prop="userGroup" label="工作组" v-if="!createModel.specialRole == 1">
		        	<Select v-model="createModel.userGroup" placeholder="工作组" style="width:200px" clearable @on-change="userGroupChange">
		        		<template  v-for="item in userGroups">
		        			<Option :value="item.id">{{item.name}}</Option>
		        		</template>
		        	</Select>
		        </FormItem>
		        <FormItem prop="operId" label="处理人" v-if="!createModel.specialRole == 1">
		        	<Select v-model="createModel.operId" placeholder="处理人" style="width:200px" clearable>
		        		<template  v-for="item in users">
		        			<Option :value="item.userId">{{item.userName}}</Option>
		        		</template>
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
				title:"人工任务",
				createModel:{
					name:"",
					specialRole:"",
					userGroup:"",
					operId:"",
				},
				createRules:{
					name:[
						{required:true,message:"节点名称不能为空"},
						{message: "输入中文、字母、数字、中划线、下划线",pattern: /^[-_a-zA-Z0-9\u4e00-\u9fa5]+$/},
						{min:2,max:30,message:"长度在2-30之间"}],
					userGroup:[{required:false,message:"工作组不能为空"}],
				},
				userGroups:[],
				users:[],
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
				if(!this.createModel.specialRole && !this.createModel.userGroup){
					this.$Notice.warning({
					            desc: "特殊角色或者工作组需要选择一个"
				      		});
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
				this.$emit("closeComponent","task");
			},
			initUserGroups(){
				this.$http.get("CMPUI/workflow/groups").then(res=>{
					this.userGroups = res.data.data;
				})
			},
			roleChange(id){
				this.users = [];
				this.createModel.userGroup = "";
				this.createModel.operId = "";
			},
			userGroupChange(id){
				this.createModel.operId = "";
				this.users = [];
				if(id){
					this.$http.get("CMPUI/workflow/users",{params:{groupId:id}}).then(res=>{
						this.users = res.data.data;
					})
				}
			},
			initInfo(flag){
				if(flag){
					this.$refs["createForm"].resetFields();
					this.initUserGroups();
					this.users = [];
					this.createModel.userGroup = "";
					this.createModel.operId = "";
					
					this.createModel = JSON.parse(this.gooFlow.$nodeData[this.info.nodeId].data);
				}
			}
		},
	}
</script>

<style>
</style>
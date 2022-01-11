<template>
	<Modal title="聚合路由定义" v-model="info.modal" :mask-closable="false" @on-visible-change="initInfo" width=400>
		<Form  ref="createForm" :model="createModel"  :rules="createRules" :label-width="96">
		        <FormItem prop="name" label="节点名称">
		            <Input type="text" v-model.trim="createModel.name" :maxlength="30" placeholder="名称" style="width:200px"></Input>
		        </FormItem>
		    </Form>
		    <div slot="footer">
		    	<Button  class="ivu-btn ivu-btn-primary ivu-btn-large"
					v-on:click="saveHandler">保存</Button>
				<Button  class="ivu-btn ivu-btn-error ivu-btn-large"
					v-on:click="cancelHandler" style="margin-left: 8px">取消</Button>
			</div>
	</Modal>
</template>

<script>
	import {Button,Icon,Input,Checkbox,Select,iOption} from "iview";
	export default{
		props:["info"],
		data() {
			return {
				createModel:{
					name:"",
				},
				createRules:{
					name:[{required:true,message:"节点名称不能为空"},
					{message: "输入中文、字母、数字、中划线、下划线",pattern: /^[-_a-zA-Z0-9\u4e00-\u9fa5]+$/},
					{min:2,max:30,message:"长度在2-30之间"}],
				},
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
	                	this.$emit("saveComponent",this.info,this.createModel.name,JSON.stringify({"routeArray":[]}));
                	}
	            });
			},
			cancelHandler(){
				this.$emit("closeComponent","join");
			},
			initInfo(flag){
				if(flag){
					this.createModel.name =  this.gooFlow.$nodeData[this.info.nodeId].name;
				}
			}
		},
	}
</script>

<style>
</style>
<template>
	<Modal :title="title" v-model="info.modal" :mask-closable="false" @on-visible-change="initInfo" width=600>
		<Form  ref="createForm" :model="createModel"  :rules="createRules" :label-width="96">
	        <FormItem prop="name" label="节点名称">
	            <Input type="text" v-model.trim="createModel.name" :maxlength="30" placeholder="名称" style="width:200px"></Input>
	        </FormItem>
		</Form>
		<Table class="routerStyle checkboxselect"  border :columns="tableColumns" :data="tableList"  ref="tableRef" height=250 style="overflow: auto;"></Table>
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
				title:"选择路由定义",
				createModel:{
					name:"",
				},
				createRules:{
					name:[{required:true,message:"节点名称不能为空"},
					{message: "输入中文、字母、数字、中划线、下划线",pattern: /^[-_a-zA-Z0-9\u4e00-\u9fa5]+$/},
					{min:2,max:30,message:"长度在2-30之间"}],
				},
				tableList:[],
				tableColumns:[
					{
						renderHeader:(h,params)=>{
							return (<div><span style="color:red">*</span>表达式</div>)
						},key:'nodeExpression',align:'left',
						render:(h,params)=>{
							return (<Input value={params.row.nodeExpression} onOn-change={e=>{params.row.nodeExpression = e.target.value;
								this.tableList[params.index] = params.row;}}></Input>)
						}
					},
					{
						renderHeader:(h,params)=>{
							return (<div><span style="color:red">*</span>路由名称</div>)
						},key:'nodeRoute',align:'left',
						render:(h,params)=>{
							return (<Input value={params.row.nodeRoute} onOn-change={e=>{params.row.nodeRoute = e.target.value;
								this.tableList[params.index] = params.row;}}></Input>)
						}
					},
					{
						title:"节点名称",key:'nodeName',align:'left',width:150,
						render:(h,params)=>{
							return <span>{this.tableList[params.index].nodeName}</span>
						}
					}
				]
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
				for(let item of this.tableList){
					if(!item.nodeExpression || !item.nodeRoute){
						this.$Notice.warning({
					            desc: "表达式和路由名称不能为空"
				      		});
				      	return;
					}
				}
				this.$Modal.confirm({
					title:' ',
	                content: '<p>请确认是否保存</p>',
	                onOk: () => {
	                	this.$emit("saveComponent",this.info,this.createModel.name,JSON.stringify({"type":"expression","nextNodes":this.tableList}));
                	}
	            });
			},
			cancelHandler(){
				this.$emit("closeComponent","decision");
			},
			initInfo(flag){
				if(flag){
					this.tableList = [];
					this.createModel.name =  this.gooFlow.$nodeData[this.info.nodeId].name;
					let array = this.getNextNodes(this.info.nodeId);
					this.tableList = array.map(item=>{
						return {
							nodeId:item.nodeId,
							nodeExpression:"",
							nodeRoute:"",
							nodeName:item.nodeName,
						}
					})
					let data = this.gooFlow.$nodeData[this.info.nodeId].data;
					if("{}" != data){
						let dataArray = JSON.parse(data).nextNodes;
						for(let item of this.tableList){
							for(let item1 of dataArray){
								if(item.nodeId == item1.nodeId){
									item.nodeExpression = item1.nodeExpression;
									item.nodeRoute = item1.nodeRoute;
									break;
								}
							}
						}
					}
				}
			},
			getNextNodes(fromId){
				let array = new Array();
				let linesObj = this.gooFlow.$lineData;
				for(let id in linesObj){
					let lineObj = linesObj[id];
					if(fromId == lineObj.from){
						let name = this.gooFlow.$nodeData[lineObj.to].name;
						let nextNode ={
								"nodeId" : lineObj.to,
								"nodeName" : name
						}
						array.push(nextNode);
					}
				}
				return array;
			},
		},
	}
</script>

<style>
</style>
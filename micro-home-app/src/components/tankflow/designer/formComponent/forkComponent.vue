<template>
	<!-- 新建 -->
		<Modal :title="title" v-model="info.modal" :mask-closable="false" @on-visible-change="initInfo" width="700">
			<Form  style="float: left;margin-top: -10px;height: 30px;" ref="createForm" :model="createModel"  :rules="createRules" :label-width="96">
		        <FormItem prop="name" label="节点名称">
		            <Input type="text" v-model.trim="createModel.name" :maxlength="30" placeholder="名称" style="width:200px"></Input>
		        </FormItem>
			</Form>
			<Button @click="addItem" style="float: right;margin-top: -10px;">添加参数</Button>
			<Table class="routerStyle checkboxselect"  border :columns="tableColumns" :data="tableList"  ref="tableRef" height="250" style="overflow: auto;margin-top: 30px;"></Table>
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
				createModel:{
					name:"",
				},
				createRules:{
					name:[
						{required:true,message:"节点名称不能为空"},
						{message: "输入中文、字母、数字、中划线、下划线",pattern: /^[-_a-zA-Z0-9\u4e00-\u9fa5]+$/},
						{min:2,max:30,message:"长度在2-30之间"}],
				},
				title:"分支",
				tableColumns:[
				{
					renderHeader:(h,params)=>{
						return (<div><span style="color:red">*</span>表达式</div>)
						},key:'nodeExpression',align:'left',
					render:(h,params)=>{
						return ( <Input value={params.row.nodeExpression}  onOn-change={e=>{ params.row.nodeExpression = e.target.value;
               this.tableList[params.index] = params.row}} ></Input>)
					}
				},
				{
					renderHeader:(h,params)=>{
						return (<div><span style="color:red">*</span>节点名称</div>)
						},key:'nodeRouteId',align:'left',
					render:(h,params)=>{
						return  (<Select value={params.row.nodeRouteId} multiple onOn-change={e=>{params.row.nodeRouteId = e;
               					this.tableList[params.index] = params.row}}>
									{params.row.nodes.map(item=>{
										return <i-option value={item.nodeId}>{item.nodeName}</i-option>
									})}
							    </Select>
							   )
					}
				},
				{
					title:"操作",align:"left",width:70,
					render:(h,params)=>{
						return (<Button onClick={e=>{this.tableList.splice(params.index,1)}}>删除</Button>)
					}
				}
				],
				tableList:[],
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
					if(!item.nodeExpression ||  item.nodeRouteId.length == 0){
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
						let data ={};
						if(this.tableList && this.tableList.length>0){
							data = {"routeArray":this.tableList}
							this.tableList.forEach(item=>{
								let temp = [];
								item.nodes.forEach(item1=>{
									item.nodeRouteId.forEach(item2=>{
										if(item2 == item1.nodeId) {
											temp.push(item1.nodeName);
										}
									})
								})
								item.nodeRoute = temp.join(",");
							})
						}
	                	this.$emit("saveComponent",this.info,this.createModel.name,JSON.stringify(data));
                	}
	            });
			},
			cancelHandler(){
				this.$emit("closeComponent","fork");
			},
			addItem(){
				this.tableList.push({nodeExpression:"",nodeRouteId:[],nodes:this.nodes,nodeRoute:""});
			},
			initInfo(flag){
				if(flag){
					this.tableList = [];
					this.createModel.name =  this.gooFlow.$nodeData[this.info.nodeId].name;
					this.nodes = this.getNextNodes(this.info.nodeId);
					let data = this.gooFlow.$nodeData[this.info.nodeId].data;		
					if(data && data != "{}" ){
						let dataArray = JSON.parse(data).routeArray;
						this.tableList = dataArray.map(item=>{
							let obj = {
								nodeExpression:item.nodeExpression,
								nodeRouteId:[],
								nodes:this.nodes,
							}
							if(this.nodes.length == 0){
								obj.nodeRouteId = [];
							}else if(item.nodeRouteId.length > 1){
								//select 自动去除多余的id
								obj.nodeRouteId = item.nodeRouteId;
							}else if(item.nodeRouteId.length = 1){
								//select不会自动去除只有一个id
								for(let item1 of this.nodes){
									if(item1.nodeId == item.nodeRouteId[0]){
										obj.nodeRouteId = item.nodeRouteId;
										break;
									}
								}
							}
							return obj;
						})
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
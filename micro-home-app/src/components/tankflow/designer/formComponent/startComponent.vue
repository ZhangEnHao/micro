<template>
	<!-- 新建 -->
		<Modal :title="title" v-model="info.modal" :mask-closable="false" @on-visible-change="initInfo" width="700">
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
				title:"定义全局参数",
				tableColumns:[
				{
					renderHeader:(h,params)=>{
						return (<div><span style="color:red">*</span>参数key</div>)
						},key:'paramKey',align:'left',
					render:(h,params)=>{
						return ( <Input value={params.row.paramKey}  onOn-change={e=>{ params.row.paramKey = e.target.value;
               this.tableList[params.index] = params.row}} ></Input>)
					}
				},
				{
					renderHeader:(h,params)=>{
						return (<div><span style="color:red">*</span>参数名称</div>)
						},key:'paramName',align:'left',
					render:(h,params)=>{
						return  (<Input value={params.row.paramName}  onOn-change={e=>{ params.row.paramName = e.target.value;
               					this.tableList[params.index] = params.row}} ></Input>)
					}
				},
				{
					renderHeader:(h,params)=>{
						return (<div>参数值</div>)
						},key:'paramValue',align:'left',
					render:(h,params)=>{
						return (<Input value={params.row.paramValue}  onOn-change={e=>{ params.row.paramValue = e.target.value;
               					this.tableList[params.index] = params.row}} ></Input>)
					}
				},
				{
					title:"是否手填",key:'paramWrite',align:'center',width:70,
					render:(h,params)=>{
						return <Checkbox value={params.row.paramWrite} true-value="Y" false-value="N" onOn-change={e=>{params.row.paramWrite = e;
               					this.tableList[params.index] = params.row}}></Checkbox>
					}
				},
				{
					title:"参数类型",key:'paramType',align:'left',
					render:(h,params)=>{
						return <Select value={params.row.paramType} onOn-change={e=>{params.row.paramType = e;
               					this.tableList[params.index] = params.row}}>
						<i-option value="BUSINESS">业务变量</i-option>
						<i-option value="SERVER">服务器变量</i-option>
						<i-option value="FILE">文件变量</i-option>
						<i-option value="GLOBAL">全局变量</i-option>
						</Select>
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
            	let tempKeyArr01 = [];
				let tempKeyArr02 = [];
				for(let item of this.tableList){
					//非空判断
					if(!item.paramKey || !item.paramName){
						this.$Notice.warning({
					            desc: "参数信息不能为空"
				      		});
				      	return;
					}
					//关键字判断
					if(item.paramKey == "SERVER" || item.paramKey == "FILE"){
						this.$Notice.warning({
					            desc: "参数key不能为[SERVER]或[FILE]保留关键字"
				      		});
				      	return;
					}
					tempKeyArr01[item.paramKey] = item.paramKey;
				}
				for(let key in tempKeyArr01){
					tempKeyArr02.push(key);
				}
				//重复key判断
				if(tempKeyArr02.length < this.tableList.length){
					this.$Notice.warning({
			            title: '',
			            desc: "参数key不能重复"
		      		});
			      	return;
				}
    			this.$Modal.confirm({
					title:' ',
	                content: '<p>请确认是否保存</p>',
	                onOk: () => {
	                	this.$emit("saveComponent",this.info,"开始",JSON.stringify(this.tableList));
                	}
	            });
			},
			cancelHandler(){
				this.$emit("closeComponent","start");
			},
			addItem(){
				this.tableList.push({paramKey:"",paramName:"",paramValue:"",paramWrite:"N",paramType:"BUSINESS"});
			},
			initInfo(flag){
				if(flag){
					this.tableList = [];
					let data =  this.gooFlow.$nodeData[this.info.nodeId].data;
					if("{}" != data){
						this.tableList = JSON.parse(data);
					}
				}
			},
		},
	}
</script>

<style>
</style>
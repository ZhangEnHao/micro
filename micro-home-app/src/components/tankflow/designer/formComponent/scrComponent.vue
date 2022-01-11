<template>
	<Drawer :title="title" v-model="info.modal" :mask-closable="false" @on-visible-change="initInfo" width="65%" class="drawer-box">
		<Card :bordered="false" shadow>
			<Form  ref="createForm" :model="createModel"  :rules="createRules" :label-width="96">
				<Row>
					<Col span="24"> 
						<FormItem prop="name" label="节点名称" >
			            <Input type="text" v-model.trim="createModel.name" :maxlength="30" style="width:200px"></Input>
			        </FormItem> 
					</Col>
				</Row>
			        <Row>
					<Col span="12">
						 <FormItem prop="outTime" label="超时时间(s)" >
			            <InputNumber   v-model.trim="createModel.outTime" :min="0" :precision="0" placeholder="0：无超时" style="width:200px"></InputNumber >
			        </FormItem>
					</Col>
					<Col span="12">
						<FormItem prop="outtimeAlarm" label="是否告警" >
			            <Checkbox v-model="createModel.outtimeAlarm" true-value="Y" false-value="N"></Checkbox>
			        </FormItem>
					</Col>
				</Row>  
			       <Row>
					<Col span="12">
						 <FormItem prop="serPolicyId" label="服务策略" >
			            <Select v-model="createModel.serPolicyId"  style="width:200px" filterable clearable @on-change="serPolicyChange">
			            	<template v-for="item in serviceStrategyList">
			            		<Option :value="item.moduleId">{{item.moduleName}}</Option>
			            	</template>
			        	</Select>
			        </FormItem>
					</Col>
					<Col span="12">
						 <FormItem prop="isAutoNode" label="自动执行" style="width:40%">
			            <Checkbox v-model="createModel.isAutoNode" true-value="Y" false-value="N"></Checkbox>
			        </FormItem>
					</Col>
				</Row> 
			        <div v-if="createModel.serPolicyId">
				    	<!--<p slot="title">
				            <Icon type="ios-film-outline"></Icon>
				                        服务策略参数
				        </p>-->
				         <Divider />
				        <template v-for="item in serviceStrategyParamList">
			        		<FormItem  :label="item.paramName" style="width:100%">
			        			<template v-if="item.paramTypeCode == 'SELECT'">
						            <Select v-model="item.value"  style="width:200px" clearable>
						            	<template v-for="item2 in item.paramOptions">
						            		<Option :value="item2.id">{{item2.name}}</Option>
						            	</template>
						        	</Select>
				        		</template>
						        <template v-else-if="item.paramTypeCode == 'INPUT'">
							            <Input v-model.trim="item.value" style="width:200px"/>
						        </template>
						        <template v-else-if="item.paramTypeCode == 'CUSTOM'">
						        	<Select v-model="item.value"  style="width:200px" clearable>
						            	<template v-for="item2 in item.paramOptions">
						            		<Option :value="item2.paramKey">{{item2.value}}</Option>
						            	</template>
						        	</Select>
						        </template>
						        <template v-else-if="item.paramTypeCode == 'CUSTOM_1'">
						        	
						        </template>
				        	</FormItem>
			        	</template>
			        	 <Divider />
				    </div>
			         <Row>
					<Col span="12"> 
						 <FormItem prop="exceptionCode" label="异常处理">
			            <Select v-model="createModel.exceptionCode"  style="width:200px" clearable>
			            	<template v-for="item in exceptionList">
			            		<Option :value="item.id">{{item.name}}</Option>
			            	</template>
			        	</Select>
			        </FormItem>
					</Col>
					<Col span="12">
					 <FormItem prop="exceptionAlarm" label="是否告警">
			            <Checkbox v-model="createModel.exceptionAlarm" true-value="Y" false-value="N"></Checkbox>
			        </FormItem>
					</Col>
				</Row>
			        <FormItem prop="exceptionRepeat"  v-if="createModel.exceptionCode == 'REPEAT'" label="重复次数">
			            <InputNumber placeholder="重复次数"  v-model.trim="createModel.exceptionRepeat" :min="1" :precision="0" style="width:200px"></InputNumber >
			        </FormItem>
					   <Row>
		                <Col span="7">
		                    <FormItem prop="scriptId" label="脚本">
					            <Input v-model.trim="createModel.scriptId" style="width:155px" />
					        </FormItem>
		                </Col>
		                <Col span="5">
		                   <FormItem :label-width="20">
					            <Tooltip content="选择脚本">
									<Button @click="showSCRModal">
											<Icon type="ios-more-outline" />	
									</Button>
								</Tooltip>
					        </FormItem>
		                </Col>
		            </Row>
			    </Form>
		    </Card>
		    <div class="drawer-btn">
		    	<Button  type="primary"
					v-on:click="saveHandler">保存</Button>
				<Button  type="error"
					v-on:click="cancelHandler"  style="margin-left: 8px">取消</Button>
			</div>
	</Drawer>
</template>

<script>
	import {Button,Icon,Input,Checkbox,Select,iOption} from "iview";
	export default{
		props:["info","gooFlow"],
		data() {
			return {
				title:"脚本",
				createModel : {
					name:"",
					outTime:0,
					outtimeAlarm:"Y",
					serPolicyId:"",
					serPolicyCode:"",
					isAutoNode:"Y",
					exceptionCode:"",
					exceptionRepeat:null,
					exceptionAlarm:"Y",
					scriptId:"",
					scriptCode:""
				},
				serviceStrategyList:[],
				serviceStrategyParamList:[],
				exceptionList:[
					{id:"IGNORE",name:"忽略异常"},
					{id:"WAIT",name:"挂起待处理"},
					{id:"FORCE",name:"强制结束"},
					{id:"REPEAT",name:"重复执行"}
				],
				createRules:{
					name:[
						{required:true,message:"节点名称不能为空"},
						{message: "输入中文、字母、数字、中划线、下划线",pattern: /^[-_a-zA-Z0-9\u4e00-\u9fa5]+$/},
						{min:2,max:30,message:"长度在2-30之间"}],
					outTime:[{required:true,message:"超时时间不能为空"}],
					serPolicyId:[{required:true,message:"服务策略不能为空"}],
					exceptionCode:[{required:true,message:"异常处理不能为空"}],
					scriptId:[{required:true,message:"脚本不能为空"}],
				},
			}
		},
		mounted() {},
		created() {
		},
		updated(){
		},
		watch:{},
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
				/*for(let item of this.serviceStrategyParamList){
					if(!item.value){
						this.$Notice.warning({
					            title: '',
					            desc: "服务策略参数不能为空"
				      		});
				      	return;
					}
				}*/
				if(this.createModel.exceptionCode == 'REPEAT' && !this.createModel.exceptionRepeat){
					this.$Notice.warning({
					            desc: "异常重复次数不能为空"
				      		});
				      	return;
				}
				this.$Modal.confirm({
					title:' ',
	                content: '<p>请确认是否保存</p>',
	                onOk: () => {
	                	this.createModel.serPolicyCode = this.createModel.serPolicyId;
	                	let serPolicy = this.serviceStrategyParamList.map(item=>{
	                		return {
	                			id:item.paramKey,
	                			value:item.value
	                		}
	                	})
	                	this.createModel.serPolicy = serPolicy;
	                	this.$emit("saveComponent",this.info,this.createModel.name,JSON.stringify(this.createModel));
                	}
	            });
			
			},
			cancelHandler(){
				this.$emit("closeComponent","scr");
			},
			initServiceStrategy(){
				this.$http.get("strategy/list",{params:{busType:"SCRIPT"},root:"WF"}).then(res=>{
					this.serviceStrategyList = res.data.data;
				})
			},
			serPolicyChange(id){
				if(id){
					this.$http.get("strategy/strategyInfo",{params:{moduleId :id},root:"WF"}).then(res=>{
						this.serviceStrategyParamList = this.handlerServiceStrategyParamList(res.data.data.list);
					})
				}else{
					this.serviceStrategyParamList = [];
				}
			},
			handlerServiceStrategyParamList(newValue){
				if(newValue!=null && newValue.length>0){
					newValue = newValue.filter(item=>{
						return item.paramIoCode == "IN";
					})
					newValue.forEach(item=>{
						if(item.paramTypeCode == "SELECT"){
							let objStr = item.paramValue.split(";");
							item.paramOptions = objStr.map(item1=>{
								return {id:item1.split(",")[0],name:item1.split(",")[1]};
							})
						}else if(item.paramTypeCode == "CUSTOM"){
							let nodeData = this.gooFlow.$nodeData;
							let nodeOjb = null;
							for(let key in nodeData){
								let node = nodeData[key];
								if(node.name == "开始"){
									if(node.data && node.data != "{}"){
										nodeOjb = JSON.parse(node.data);
									}else{
										nodeOjb = null;
									}
									break;
								}
							}
							if(nodeOjb){
								if(item.paramValue == "fileVarType"){
									item.paramOptions = nodeOjb.filter(obj=>{
										if(obj.paramType == "FILE"){
											return true;
										}else{
											return false;
										}
									}).map(obj1=>{
										return {paramKey:obj1.paramKey,value:obj1.paramName};
									})
								}else if(item.paramValue == "serverVarType"){
									item.paramOptions = nodeOjb.filter(obj=>{
										if(obj.paramType == "SERVER"){
											return true;
										}else{
											return false;
										}
									}).map(obj1=>{
										return {paramKey:obj1.paramKey,value:obj1.paramName};
									})
								}
							}
						}
					})
				}else{
					newValue = [];
				}
				return newValue;
			},
			showSCRModal(){
				
			},
			initInfo(flag){
				if(flag){
					this.initServiceStrategy();
					this.$refs["createForm"].resetFields();
					this.createModel.serPolicyCode = "";
					let data = this.gooFlow.$nodeData[this.info.nodeId].data;
					if("{}" != data){
						this.createModel = JSON.parse(data);
						this.$http.get("strategy/paramsList",{params:{moduleId :this.createModel.serPolicyId},root:"WF"}).then(res=>{
							this.serviceStrategyParamList = this.handlerServiceStrategyParamList(res.data.data);
							for(let item of this.serviceStrategyParamList){
								for(let item1 of this.createModel.serPolicy){
									if(item.paramKey == item1.id){
										item.value = item1.value;
										break;
									}
								}
							}
						})
					}
				}
			}
		},
	}
</script>

<style scoped="scoped">
.drawer-box >>> .ivu-card-body{height:calc(100vh - 140px); overflow: auto;}
.drawer-box >>> .ivu-form-item-content{line-height: 22px;}
</style>
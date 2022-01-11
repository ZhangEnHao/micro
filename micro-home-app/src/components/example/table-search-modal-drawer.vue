<template>
	<div class="float-e-margins">
		<div class="titleAll ibox-title">
				<h5 class="titleAll">用户管理</h5>
		</div>
		<div class="ibox-content example">
			<div class="hidden-xs" style="margin-top:10px;">
				<Button type="primary" @click="refresh" style="margin-left:3px;" v-show="codes.indexOf('user:list') != -1">
					<Icon type="md-refresh" size="14"/>
				</Button>
				<Button  type="primary" @click="createModalOpen" style="margin-left:3px; float: right;" v-show="codes.indexOf('user:add') != -1">
					<Icon type="md-add" size="14"/>创建
				</Button>
				<Input v-model.trim="blureKey" @on-enter="search" @on-clear="search" clearable placeholder="用户名,登录名,邮箱,电话" style="width:150px;margin-left:3px;" v-show="codes.indexOf('user:list') != -1"></Input>
				<Button type="primary" @click="search" style="margin-left:3px;" v-show="codes.indexOf('user:list') != -1">
					<Icon type="md-search" size="14"/>
				</Button>
			</div>
			<Table class="routerStyle checkboxselect"  border :columns="tableColumns" :data="tableList"  ref="tableRef"></Table>
			<div style="margin: 10px; overflow: auto">
				<div>
					<Page :total="total" :page-size="pageSize"
						:current.sync="pageNum" @on-change="changePage"
						show-total show-sizer :page-size-opts="pageSizeOpts" placement="top"
						@on-page-size-change ="changePageSize" class-name="pageToolStyle">
					</Page>
				</div>
			</div>
		</div>
		<!-- 创建用户 ,修改用户-->
		<Modal :title="operFlagTitle" v-model="createModal" :mask-closable="false" :width="600">
			<Form  ref="createForm" :model="createModel"  :rules="createRules" inline :label-width="96">
		        <FormItem prop="userName" label="用户名" style="width:45%">
		            <Input type="text" v-model.trim="createModel.userName" placeholder="名称" :maxlength="20"></Input>
		        </FormItem>
				<FormItem prop="loginName" label="登录名" style="width:45%">
				    <Input type="text" v-model.trim="createModel.loginName" placeholder="登录名" :maxlength="20" :disabled="operFlag == 'update'"></Input>
				</FormItem>
				<FormItem prop="onePwd" label="密码" style="width:45%" v-if="operFlag == 'add'">
				    <Input type="password" v-model.trim="createModel.onePwd" placeholder="密码" :maxlength="20"></Input>
				</FormItem>
				<FormItem prop="twoPwd" label="确认密码" style="width:45%" v-if="operFlag == 'add'">
				    <Input type="password" v-model.trim="createModel.twoPwd" placeholder="确认密码" :maxlength="20"></Input>
				</FormItem>
				<FormItem prop="email" label="邮箱" style="width:45%">
				    <Input type="email" v-model.trim="createModel.email" placeholder="邮箱" :maxlength="20"></Input>
				</FormItem>
				<FormItem prop="phone" label="电话" style="width:45%">
				    <Input type="text" v-model.trim="createModel.phone" placeholder="电话" :maxlength="11"></Input>
				</FormItem>
		    </Form>
		    <div slot="footer">
		    	<Button  class="ivu-btn ivu-btn-primary ivu-btn-large"
					v-on:click="createModalHandler" style="margin-left: 8px">确定</Button>
				<Button  class="ivu-btn ivu-btn-error ivu-btn-large"
					v-on:click="cancleHandler('createModal')">取消</Button>
			</div>
		</Modal>
		<!--修改密码-->
		<Modal title="修改密码" v-model="editPwdModal" :mask-closable="false" :width="400">
			<Form  ref="editPwdForm" :model="createModel"  :rules="createRules" :label-width="96">
				<FormItem prop="onePwd" label="密码">
				    <Input type="password" v-model.trim="createModel.onePwd" placeholder="密码" :maxlength="20"></Input>
				</FormItem>
				<FormItem prop="twoPwd" label="确认密码">
				    <Input type="password" v-model.trim="createModel.twoPwd" placeholder="确认密码" :maxlength="20"></Input>
				</FormItem>
		    </Form>
		    <div slot="footer">
		    	<Button  class="ivu-btn ivu-btn-primary ivu-btn-large"
					v-on:click="editPwdHandler" style="margin-left: 8px">确定</Button>
				<Button  class="ivu-btn ivu-btn-error ivu-btn-large"
					v-on:click="cancleHandler('editPwdModal')">取消</Button>
			</div>
		</Modal>
		<authRoleCompenent :dataInfo="roleInfo" @closeComponent="closeComponent"></authRoleCompenent>
	</div>
</template>

<script>
	import {Button,Poptip,Icon} from 'iview';
	import authRoleCompenent from "./drawer.vue";
	import { hex_sha1 } from '@/assets/js/sha1.js';
	export default{
		components:{
			authRoleCompenent
		},
		data () {
			const isNameValid = (rule, value, callback) => {
			    if (value === '') {
			        callback(new Error('请输入登录名'));
			    }else{
					if(this.operFlag =="update" && this.tableList[this.currentIndex].loginName == this.createModel.loginName){
						callback()
					}else{
						let uri = "sysUser/loginName"
						let params={loginName:this.createModel.loginName}
						this.$http.get(uri,{params:params}).then(function(res){
							let data = res.data.data;
							//名字重复，不可用
							if(data && data.length>0){
								callback(new Error('登录名已被使用'));
							//名字可用
							}else{
								callback();
							}
						}).catch(()=>{
							callback();
						});
					}
			    }
			};
			const isSameCheck = (rule, value, callback) => {
				if(value != this.createModel.onePwd){
					callback(new Error('前后密码不一致'));
				}else{
					callback();
				}
			}
			return {
				blureKey:"",
				codes:null,
				tableList:[],
				tableColumns:[
				{
					title:"用户名",key:'userName',align:'left',
				},
				{
					title:"登录名",key:'loginName',align:'left',
				},
				{
					title:"邮箱",key:'email',align:'left',
				},
				{
					title:"电话",key:'phone',align:'left',
				},
				{
					title:"创建时间",key:"createTime",align:'left',
					render:(h,params)=>{
						return (<span>{new Date(params.row.createTime).Format("yyyy-MM-dd hh:mm:ss")}</span>)
					}
				},
				{
					title:"操作",align:'left',width:160,
					render: (h, params) => {
						return(
							<div class="btn-box">
								<Button type="text" disabled={this.codes.indexOf('user:modify') == -1}  title="修改" onClick={()=>this.editUserModalHandler(params.index)} style="margin-left:5px;margin-right:5px;"><Icon type="ios-create-outline" size="20" /></Button>
								<Button type="text" disabled={this.codes.indexOf('user:delete') == -1} title="删除" onClick={()=>this.deleteUserHandler(params.index)}  style="margin-left:5px;margin-right:5px;"><Icon type="ios-trash-outline" size="20" /></Button>
								<Button type="text" disabled={this.codes.indexOf('userRole:list') == -1} title="角色授权" onClick={()=>this.roleAuthModalHandler(params.index)}    style="margin-left:5px;margin-right:5px;" ><Icon type="ios-pricetag-outline" size="20" ></Icon></Button>
								<span style="margin-left:5px;margin-right:5px;">
									<Poptip trigger="click" content="content" placement="bottom-end" >
										<Icon type="ios-more-outline" size="20" color="#2d8cf0"></Icon>
										<div slot="content" class="tooltipHover">
											<ul>
												<li v-show={this.codes.indexOf('user:resetPwd') != -1} onClick={()=>this.editPwdModalHandler(params.index)} style="minwidth:40px">修改密码</li>
											</ul>
										</div>
								    </Poptip>
							    </span>
							</div>
						);
					}
				},
				],
				pageSize:10,
				pageSizeOpts:[10,20,50],
				total:0,
				pageNum: 1,
				
				operFlag:"", 
				currentIndex:null,
				createModal:false, 
				editPwdModal:false,
				createModel:{userId:"",userName:"",loginName:"",onePwd:"",twoPwd:"",email:"",phone:""}, 
				createRules:{
					userName:[
						{required:true,message:"用户名不能为空"},
						{
						    message: "输入中文数字、字母、下划线、中划线",
						    pattern:  /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/,
						},
						{min:2,max:20,message:"长度在2-20之间"},
					],
					loginName:[
						{required:true,message:"登录名不能为空"},
						{
						    message: "输入数字、字母、下划线,中划线",
						    pattern: /^[a-zA-Z0-9_-]+$/,
						},
						{min:2,max:20,message:"长度在2-20之间"},
						{validator: isNameValid, trigger: 'blur'},
						
					],
					onePwd:[
						{required:true,message:"密码不能为空"},
						{
						    message: "输入数字、字母、特殊字符",
						    pattern: /^[`~!@#$%^&*,./?\\|a-zA-Z0-9_-]+$/,
						},
						{min:6,max:20,message:"长度在6-20之间"},
					],
					twoPwd:[
						{required:true,message:"密码不能为空"},
						{
						    message: "输入数字、字母、特殊字符",
						    pattern: /^[`~!@#$%^&*,./?\\|a-zA-Z0-9_-]+$/,
						},
						{min:6,max:20,message:"长度在6-20之间"},
						{validator: isSameCheck, trigger: 'blur'},
					],
					email:[
						{
							type:"email",
						    message: "邮箱格式不对",
						},
						{min :4,max:20,message:"长度在4-20之间"},
					],
					phone:[
						{
						    message: "电话格式不对",
						    pattern: /^1[345678]\d{9}$/,
						},
					]
				},
				roleInfo:{
					model:false,
					userId:"",
					component:"",
					codes:[],
				}
			}
	},
	created () {
		this.codes = window.memoryStorage.getItem("codes");
		if(this.codes.indexOf('user:list') != -1){
			this.search();
		}
	},
	computed:{
		operFlagTitle(){
			return this.operFlag == "update"?"修改":"新建"
		}
	},
	methods:{
		getTableList(){
			let data = {pageSize: this.pageSize, pageNum: this.pageNum};
			if(this.blureKey){
					data.blureKey = this.blureKey
			}
			this.$http.get('sysUser',{params:data})
			.then(function(res){
					this.total = res.data.data.total;
					this.tableList = res.data.data.list;
				});
		},
		refresh(){
			this.getTableList();
		},
		search(){
			this.pageSize = 10;
			this.pageNum = 1;
			this.getTableList();
		},
		changePage(page){
			this.pageNum = page;
			this.getTableList();
		},
		changePageSize (pageSize){
			this.pageSize = pageSize;
			this.pageNum = 1;
        	this.getTableList();
        },
		createModalOpen(){
			this.operFlag = "add";
			this.createModel.userId = "";
			this.$refs['createForm'].resetFields();
			this.createModal = true;
		},
		createModalHandler(){        	
			this.$refs['createForm'].validate((valid) => {
		        if (valid) {                	
		    		this.$Modal.confirm({
		    		    title:' ',
		                content: '<p>请确认是否提交',
		                onOk: () => {
		                	this.sumitHandler();
		                	}
		            });
		        } 
		    })
		},
		sumitHandler(){
			if(this.operFlag == "add"){
				this.addSubmit();
			}else if(this.operFlag == "update"){
				this.editSubmit();
			}
			
		},
		addSubmit(){
			this.createModel.loginPassword = hex_sha1(this.createModel.onePwd);
			this.$http.post('sysUser',this.createModel)
			.then(function(res){				
				if(res.data.code == 0){
					this.$Notice.success({
					    desc: "创建成功"
					});
					this.search();
					this.createModal = false;
				}
			});
		},
		editSubmit(){
			this.$http.put('sysUser',this.createModel)
			.then(function(res){				
				if(res.data.code == 0){
					this.$Notice.success({
					    desc: "修改成功"
					});
					this.refresh();
					this.createModal = false;
				}
			});
		},
		cancleHandler(modal){
			this.refresh();
			this[modal] = false;
		},
		editUserModalHandler(index){
			this.currentIndex = index;
			this.operFlag = "update";
			this.$refs['createForm'].resetFields();
			this.createModel.userId = this.tableList[index].userId;
			this.createModel.userName = this.tableList[index].userName;
			this.createModel.loginName = this.tableList[index].loginName;
			this.createModel.email = this.tableList[index].email;
			this.createModel.phone = this.tableList[index].phone;
			this.createModal = true;
		},
		editPwdModalHandler(index){
			this.createModel.userId = this.tableList[index].userId;
			this.$refs['editPwdForm'].resetFields();
			this.editPwdModal = true;
		},
		editPwdHandler(){
			this.$refs['editPwdForm'].validate((valid) => {
				if (valid) {                	
					this.$Modal.confirm({
						title:' ',
						content: '<p>请确认是否提交',
						onOk: () => {
							this.editPwdSubmit();
							}
					});
				} 
			})
		},
		editPwdSubmit(){
			this.$http.post('sysUser/resetPwd/'+this.createModel.userId,{password:hex_sha1(this.createModel.onePwd)},{emulateJSON: true})
			.then(function(res){				
				if(res.data.code == 0){
					this.$Notice.success({
						desc: "修改成功"
					});
					this.editPwdModal = false;
					this.refresh();
				}
			});
		},
		deleteUserHandler(index){
			this.$Modal.confirm({
			    title:' ',
			    content: '<p>请确认是否删除',
			    onOk: () => {
			    	this.deleteSubmit(index);
			    	}
			});
		},
		deleteSubmit(index){
			this.$http.delete('sysUser/'+this.tableList[index].userId)
			.then(function(res){				
				if(res.data.code == 0){
					this.$Notice.success({
						desc: "删除成功"
					});
					this.search();
				}
			});
		},
		roleAuthModalHandler(index){
			this.roleInfo.model = true;
			this.roleInfo.component = "roleInfo";
			this.roleInfo.userId = this.tableList[index].userId;
			this.roleInfo.codes = this.codes;
		},
		closeComponent(component){
			this[component].model = false;
			this.refresh();
		}
	}
}
</script>

<style scoped="scoped">
	.ivu-card-head{
		padding: 0;
		height: 40px;
	}
	.ivu-table-wrapper{
		margin-bottom: 0px;
	}
</style>


<template>
	<Modal ref="modifyPasswordModel" v-model="dataInfo.model" title="修改密码" width="500" v-bind:mask-closable="false" @on-visible-change="initData">
	    <Form ref="formValidate" :model="formPassword" :label-width="120" inline :rules="ruleValidate">
			<Form-item prop="oldPassword" label='旧密码' style="width: 90%;">
				<Input style="width:200px;" v-model="formPassword.oldPassword" placeholder="旧密码" :maxlength="20"></Input>
			</Form-item>
			<br style="margin-top: 35px;"/>
			<Form-item prop="newPassword1" label='新密码' style="width: 90%;">
				<Input style="width:200px;" v-model="formPassword.newPassword1" placeholder="新密码" :type="passwordType1"  :icon="passwordType1Icon"
					  @on-click="pwdDisplay('passwordType1')" :maxlength="20"></Input>
			</Form-item>
			 <br style="margin-top: 35px;"/>
			<Form-item prop="newPassword2" label='确认密码' style="width: 90%;">
				<Input style="width:200px;" v-model="formPassword.newPassword2" placeholder="确认新密码" :type="passwordType2"  :icon="passwordType2Icon"
					   @on-click="pwdDisplay('passwordType2')" :maxlength="20"></Input>
			</Form-item>
	    </Form>
	    <div slot="footer">
	        <Button class="ivu-btn ivu-btn-primary ivu-btn-large"
	                v-on:click="saveModifyPassword" style="margin-left: 8px">保存
	        </Button>
	        <Button class="ivu-btn ivu-btn-error ivu-btn-large"
	                v-on:click="closeModifyPassword">取消
	        </Button>
	    </div>
	</Modal>
</template>

<script>
import { hex_sha1 } from '@/assets/js/sha1.js';
export default{
	props:["dataInfo"],
	data () {
		const isNewOldSameCheck = (rule, value, callback) => {
			if(value == this.formPassword.oldPassword){
				callback(new Error('新旧密码不能一致'));
			}else{
				callback();
			}
		}
		const isTwoSameCheck = (rule, value, callback) => {
			if(value != this.formPassword.newPassword1){
				callback(new Error('前后密码不一致'));
			}else{
				callback();
			}
		}
		return {
			oldPassword:"",
			formPassword:{
				oldPassword:"",
				newPassword1:"",
				newPassword2:"",
			},
			ruleValidate: {
			    oldPassword: [
					{required:true,message:"密码不能为空"},
					{
					    message: "只能包含数字、字母、特殊字符,且长度6-20字符",
					    pattern: /^[`~!@#$%^&*,./?\\|a-zA-Z0-9_-]+$/,
					},
					{min:6,max:20,message:"长度在6-20之间"},
				],
			    newPassword1: [
			       {required:true,message:"密码不能为空"},
			       {
			           message: "只能包含数字、字母、特殊字符,且长度6-20字符",
			           pattern: /^[`~!@#$%^&*,./?\\|a-zA-Z0-9_-]+$/,
			       },
			       {min:6,max:20,message:"长度在6-20之间"},
			       {
			       	validator: isNewOldSameCheck, trigger: 'blur',
			       },
			    ],
			    newPassword2: [
			        {required:true,message:"密码不能为空"},
			        {
			            message: "只能包含数字、字母、特殊字符,且长度6-20字符",
			            pattern: /^[`~!@#$%^&*,./?\\|a-zA-Z0-9_-]+$/,
			        },
			        {min:6,max:20,message:"长度在6-20之间"},
			        {validator: isTwoSameCheck, trigger: 'blur'},
			        ],
			
			},
			passwordType1:"password",
			passwordType2:"password",
		}
	},
	created (){},
	computed:{
		passwordType1Icon(){
			return this.passwordType1=="password"?"md-eye-off":"md-eye";
		},
		passwordType2Icon(){
			return this.passwordType2=="password"?"md-eye-off":"md-eye";
		}
	},
	methods:{
		initData(flag){
			if(flag){
				this.$refs['formValidate'].resetFields();
			}
		},
		pwdDisplay(flag){
			this[flag] = this[flag] == "password"?"text":"password";
		},
		saveModifyPassword(){
			this.$refs['formValidate'].validate((valid) => {
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
			this.$http.post('sysUser/modifyPwd',{oldPassword:this.$encryption(this.formPassword.oldPassword),newPassword:this.$encryption(this.formPassword.newPassword1)},{emulateJSON: true})
			.then(function(res){				
				if(res.data.code == 0){
					this.$Notice.success({
						desc: "修改成功，请重新登录"
					});
					this.closeModifyPassword();
					this.$router.push("/login");
				}
			});
		},
		closeModifyPassword(){
			this.$emit("closeComponent",this.dataInfo.component);
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


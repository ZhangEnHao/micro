<template>
	<div>
		<Drawer title="角色授权"  v-model="dataInfo.model"  width="600"  @on-visible-change="initInfo" :mask-closable="true" closable class="drawer-box">
            <Card class="drawer-card">
            <Table class="routerStyle checkboxselect" @on-selection-change="selectChange" border :columns="tableColumns" :data="tableList"  ref="tableRef"></Table>
             <div class="drawer-page">
            	<Page :total="total" :page-size="pageSize"
            		:current.sync="pageNum" @on-change="changePage"
            		show-total show-sizer :page-size-opts="pageSizeOpts" placement="top"
            		@on-page-size-change ="changePageSize" class-name="pageToolStyle">
            	</Page>
            </div>
            </Card>
			<div class="drawer-btn">
				<Button type="primary" v-show="dataInfo.codes.indexOf('userRole:grant') != -1"
					v-on:click="authRoleHandler(true)" style="margin-left: 8px">授予角色</Button>
				<Button  type="primary" v-show="dataInfo.codes.indexOf('userRole:cancel') != -1"
					v-on:click="authRoleHandler(false)" style="margin-left: 8px">取消授予</Button>
				<Button  type="error" style="margin-left: 8px"
					v-on:click="cancleHandler">关闭</Button>
			</div>
        </Drawer>    
	</div>
</template>

<script>
export default{
	props:["dataInfo"],
	data () {
		return {
			tableList:[],
			tableColumns:[
				{type:"selection",width:20},
				{
					title:"名称",key:'roleName',align:'left',
				},
				{
					title:"编码",key:'roleCode',align:'left',
				},
				{
					title:"备注",key:'roleRemark',align:'left',
				},
				{
					title:"是否授权",align:'left',
					render: (h, params)=>{
						if(params.row.isAuthorized == "Y"){
							return <span style="color:green">已授予</span>
						}else{
							return <span style="color:red">未授予</span>
						}
					}
				},
			],
			pageSize:10,
			pageSizeOpts:[10,20,50],
			total:0,
			pageNum: 1,
			selectItems:[],
		}
	},
	created (){},
	computed:{},
	methods:{
		getTableList(){
			let data = {pageSize: this.pageSize, pageNum: this.pageNum};
			this.total = 0;
			this.tableList = [];
			this.$http.get('sysUserRole/'+this.dataInfo.userId,{params:data})
			.then(function(res){
					this.total = res.data.data.total;
					this.tableList = res.data.data.list;
				}); 
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
		selectChange(selection){
			this.selectItems = selection;
		},
		authRoleHandler(flag){
			if(this.selectItems && this.selectItems.length > 0){
				for(let item of this.selectItems){
					if(flag && item.isAuthorized =="Y"){
						this.$Notice.warning({
							desc: "请选择未授予的角色"
						});
						return;
					}else if(!flag && item.isAuthorized =="N"){
						this.$Notice.warning({
							desc: "请选择已授予的角色"
						});
						return;
					}
				}
			}else{
				this.$Notice.warning({
					desc: "请先选择数据"
				});
				return;
			}
			this.$Modal.confirm({
			    title:' ',
			    content: '<p>请确认是否提交',
			    onOk: () => {
					let roleIds = this.selectItems.map(item=>{
						return item.roleId;
					})
					let data = {sysRoleIds:roleIds}
					if(flag){
						this.authRoleSubmit(data);
					}else{
						this.deleteRoleSubmit(data);
					}
			    	
			    }
			});
		},
		authRoleSubmit(data){
			this.$http.post('sysUserRole/grant/'+this.dataInfo.userId,data,{emulateJSON: true}).then(function(res){
				this.$Notice.success({
					desc: "授权成功"
				});	
				this.cancleHandler();
			});
		},
		deleteRoleSubmit(data){
			this.$http.post('sysUserRole/cancel/'+this.dataInfo.userId,data,{emulateJSON: true}).then(function(res){
				this.$Notice.success({
					desc: "取消权限成功"
				});	
				this.cancleHandler();
			});
		},
		cancleHandler(){
			this.$emit("closeComponent",this.dataInfo.component);
		},
		initInfo(flag){
			this.selectItems = [];
			if(flag){
				this.search();
			}
		}
	}
}
</script>

<style scoped="scoped">
	.ivu-table-wrapper{
		margin-bottom: 0px;
	}
</style>


<template>
	<div class="float-e-margins">
	<Row>
		<Col span="10">
		<Row class="notice-tag">
			<Col span="4"><span><Icon type="md-checkmark-circle" color="#2eb494" size="16"/> 正常结束</span></Col>
			<Col span="4"><span><Icon type="md-close-circle" size="16" color="#ff6b6b"/> 异常结束</span></Col>
			<Col span="4"><span class="icon-box d-danger"><i class="ivu-icon ivu-icon-ios-pause"></i></span> 异常暂停</Col>
			<Col span="4"><span class="icon-box d-success"><i class="ivu-icon ivu-icon-ios-pause"></i></span> 正常暂停</Col>
			<Col span="4"><span><Icon type="ios-timer" size="16" color="#FF9F43"/> 运行超时</span></Col>
			<Col span="4"><span><Icon type="md-refresh-circle" size="16" color="#2eb494"/> 运行中</span></Col>
		</Row>
		</Col>
		<Col span="14">
		<div class="top-button">
			<ButtonGroup>
				<!--返回列表-->
				<!--<Button @click="backRoute" type="primary"><Icon type="md-return-left" /> 返回</Button>-->
				<Button @click="refreshWFInfo" type="primary" v-show="instanceInfo && instanceInfo.instanceStateId != 3 && instanceInfo.instanceStateId != 4"><Icon type="md-repeat" /> 刷新</Button>
				<Button @click="resumeWF" type="primary" v-show="instanceInfo && instanceInfo.instanceStateId == 2"><Icon type="md-sync" /> 运行</Button>
				<Button @click="startWF" type="primary" v-show="instanceInfo && instanceInfo.instanceStateId == 0"><Icon type="md-play" /> 执行</Button>
				<Button @click="pauseWF" type="primary" v-show="instanceInfo && instanceInfo.instanceStateId == 1"><Icon type="md-pause" /> 暂停</Button>
				<Button @click="endWF" type="primary" v-show="instanceInfo && instanceInfo.instanceStateId != 0 && instanceInfo.instanceStateId != 3 && instanceInfo.instanceStateId != 4"><Icon type="md-square" /> 结束</Button>
			</ButtonGroup>
		</div>
		</Col>
	</Row>
		<div>
			<!--流程画布-->
			<div id="instanceGraphContainer" class="graph-container">
				<div id="flashContent">
					<p>
						请确保FlashPlayer版本高于11.1.0
					</p>
				</div>
			</div>
		</div>
		<Drawer title="日志详情" v-model="DrawerModal" width="65%" class="drawer-box"> 
			<pre  style="font-size: 112%;white-space: pre-wrap;word-wrap: break-word;margin-bottom: 50px;">{{logInfo}}</pre>
		</Drawer>
		<div v-show="contextmenuModal" id="menuContainer" style="background-color: white; display: none; width: 120px; position: absolute; z-index:99; border: 0px solid #a6caca; border-bottom:">
			 <ButtonGroup vertical>
			<Button style="width: 120px;" @click="autoNodeOperate('reExecuteSignal')" v-if="reExecuteSignalModal">单步执行并流转</Button>
			<Button style="width: 120px;" @click="autoNodeOperate('reExecute')" v-if="reExecuteModal">单步执行</Button>
			<Button style="width: 120px;" @click="autoNodeOperate('unExecuteSignal')" v-if="unExecuteSignalModal">忽略执行并流转</Button>
			<Button style="width: 120px;" @click="autoNodeOperate('froceTimeoutNode')" v-if="froceTimeoutNodeModal">强制超时</Button>
			<Button style="width: 120px;" @click="autoNodeOperate('seeLog')" v-if="seeLogModal">查看日志</Button>
			<Button style="width: 120px;" @click="autoNodeOperate('subProcess')" v-if="showsubModal">查看子流程</Button>
		</ButtonGroup>
		</div>
	</div>
</template>

<script>
	import GooFlow from '../static/js/gooFlow.js';
	import  '../static/icon/iconfont.js';
	export default {
		components: {

		},
		props: ["instanceId","modelId"],
		data() {
			return {
				instanceInfo:null,
				gooFlow: null,
				interval: null,
				intervalActiveFlag:false,
				intervalTime: 10000,
				logInfo:"",
				DrawerModal:false,
				currentnodeid:null,
				contextmenuModal:false,
				reExecuteSignalModal:false,
				reExecuteModal:false,
				unExecuteSignalModal:false,
				froceTimeoutNodeModal:false,
				seeLogModal:false,
				showsubModal:false,
			}
		},
		mounted() {
			this.$nextTick(function () {
				this.initCanvas();
				this.initContextMenu();
			});
			window.onresize = function(){
				var height = $(window.screen.availHeight);
				$("#instanceGraphContainer").css({width:$(window).width()-50+"px",height:height+"px"});
				$(".GooFlow_work").css({height:height-185+"px"});
			}
		},
		created() {
			this.getInstanceNodeJsonInfo();
			this.initInterval();
		},
		beforeDestroy() {
			clearInterval(this.interval);
			$("#instanceGraphContainer").off("mouseup");
		},
		methods: {
			backRoute() {
				this.$router.go(-1);
			},
			initContextMenu(){
				let _this = this;
				/* window.oncontextmenu = function(event) {
				} */
				$("body").delegate("#instanceGraphContainer","mouseup",function(evnet){
					console.log(123);
					let id = $(event.target).parent().parent().parent().parent().attr("id");
					if(event.button != "2" || !id){
						_this.contextmenuModal = false;
					}
				})
				$(".GooFlow_work").append($("#menuContainer"));
				$("#instanceGraphContainer").delegate(".GooFlow_item","contextmenu",{_this:this},this.delegateMenuEvent);
				
			 },
			delegateMenuEvent(event){
				event.preventDefault();
				let _this = event.data._this;
				let tagObj = $(event.target).parent().parent().parent().parent();
				_this.currentnodeid = tagObj.attr("id");
				if(event.button == 2 && _this.currentnodeid){
					let nodeObj = _this.gooFlow.$nodeData[_this.currentnodeid];
					_this.$http.get('instance/nodeEditRight',{params:{instanceId:_this.instanceId,wfNodeId:nodeObj.nodeId},root:"WF"}).then(function(res) {
						let checkNodeEditCode = res.data.data;
						if(checkNodeEditCode == "none"){
							_this.contextmenuModal = false;
						}else{
							let tagWidth = tagObj.css("width");
							let tagHeight = tagObj.css("height");
							let tagTop = tagObj.css("top");
							let tagLeft = tagObj.css("left");
							let left = parseInt(tagLeft.substring(0,tagLeft.indexOf("px")))+parseInt(tagWidth.substring(0,tagWidth.indexOf("px")));
							let top = parseInt(tagTop.substring(0,tagTop.indexOf("px")))+parseInt(tagHeight.substring(0,tagHeight.indexOf("px")));
							/* let clientWidth = $("#instanceGraphContainer").innerWidth();
							let menuWidth = $("#menuContainer").innerWidth();
							let clientLeft = $(tagObj).offset().left;
							let totalWidth = clientLeft+parseInt(tagWidth.substring(0,tagWidth.indexOf("px")))+menuWidth+20;
							console.log(clientWidth+":"+totalWidth);
							if(totalWidth>clientWidth){
								left = left + clientWidth- totalWidth;
							}
							
							let clientHeight = $("#instanceGraphContainer").innerHeight();
							let menuHeight = $("#menuContainer").innerHeight();
							let clientTop = $(tagObj).offset().top;
							let totalHeight = clientTop+parseInt(tagHeight.substring(0,tagHeight.indexOf("px")))+menuHeight+10;
							if(totalHeight>clientHeight){
								top = top + clientHeight -  totalHeight;
							} */
							_this.reExecuteSignalModal = false;
							_this.reExecuteModal = false;
							_this.unExecuteSignalModal = false;
							_this.froceTimeoutNodeModal = false;
							_this.seeLogModal = false;
							_this.showsubModal = false;
							_this.contextmenuModal = true;
							$("#menuContainer").css({top: top,left: left})
							if(checkNodeEditCode == "finish"){
								if(nodeObj.type == "sub-process"){
									this.showsubModal = true;
								}else if (nodeObj.type == "api" || nodeObj.type == "scr" || nodeObj.type == "cmd"){
									this.seeLogModal = true;
								}
							}else if(checkNodeEditCode == "running"){
								if(nodeObj.type == "sub-process"){
									this.showsubModal = true;
								}
								else if (nodeObj.type == "api" || nodeObj.type == "scr" || nodeObj.type == "cmd"){
									this.seeLogModal = true;
									this.froceTimeoutNodeModal = true;
								}
							}else if(checkNodeEditCode == "all"){
								if (nodeObj.type == "api" || nodeObj.type == "scr" || nodeObj.type == "cmd") {
									this.reExecuteSignalModal = true;
									this.reExecuteModal = true;
									this.unExecuteSignalModal = true;
									this.seeLogModal = true;
								}else if(nodeObj.type == "task"  && this.instanceInfo.instanceStateId != "2") {
									
								}else if (nodeObj.type == "sub-process"){
									this.showsubModal = true;
								}
							}else if(checkNodeEditCode == "log"){
								if (nodeObj.type == "api" || nodeObj.type == "scr" || nodeObj.type == "cmd") {
									this.seeLogModal = true;
								}else if (nodeObj.type == "sub-process"){
									this.showsubModal = true;
								}
							}else{
								_this.contextmenuModal = false;
							}
						}
					});
				}else{
					_this.contextmenuModal = false;
				}

				
			},
			initCanvas() {
				$("#instanceGraphContainer").empty();
				this.gooFlow =new GooFlow($("#instanceGraphContainer"), {}, "instance", this);
			},
			initInterval(){
				this.$http.get('instance/pageRefreshTime',{root:"WF"}).then(function(res) {
					this.intervalTime = res.data.data;
					this.refreshWFInfo();
				});
			},
			refreshWFInfo(){
				this.getInstanceNodeJsonInfo();
				this.getInstanceInfo();
			},
			getInstanceNodeJsonInfo() {
				this.$http.get('instance/workflowJsonData', {
					params: {
						instanceId: this.instanceId,
						modelId: this.modelId
					},
					emulateJSON: true,root:"WF"
				}).then(function(res) {
					let jsonData = res.data.data;
					if (jsonData) {
						jsonData = JSON.parse(jsonData);
						this.gooFlow.clearDataAndLoadData(jsonData);
					}
				});
			},
			getInstanceInfo() {
				this.$http.get('instance/instanceInfo', {
					params: {
						instanceId: this.instanceId
					},
					emulateJSON: true,root:"WF"
				}).then(function(res) {
					this.instanceInfo = res.data.data;
					if(this.instanceInfo.instanceStateId != 1){
						if(this.intervalActiveFlag){
							clearInterval(this.interval);
							this.intervalActiveFlag = false;
						}
					}else if(this.instanceInfo.instanceStateId == 1){
						if(!this.intervalActiveFlag){
							this.interval = setInterval(this.refreshWFInfo, this.intervalTime);
							this.intervalActiveFlag = true;
						}
					}
				 });
			},
			resumeWF() {
				this.$http.post('instance/resumeInstance', {
					instanceId: this.instanceId
				}, {
					emulateJSON: true,root:"WF"
				}).then(function(res) {
					this.refreshWFInfo();
					this.$Notice.success({
						desc: '激活成功'
					});
				});
			},
			startWF(){
				this.$http.post('instance/startInstance', {
					instanceId: this.instanceId,
					wfInstanceId :this.instanceInfo.wfInstanceId
				}, {
					emulateJSON: true,root:"WF"
				}).then(function(res) {
					this.refreshWFInfo();
					this.$Notice.success({
						desc: '启动成功'
					});
				});
				
			},
			pauseWF() {
				this.$http.post('instance/pauseInstance', {
					instanceId: this.instanceId
				}, {
					emulateJSON: true,root:"WF"
				}).then(function(res) {
					this.refreshWFInfo();
					this.$Notice.success({
						desc: '暂停成功'
					});
				});
			},
			endWF() {
				this.$http.post('instance/endInstance', {
					instanceId: this.instanceId
				}, {
					emulateJSON: true,
					root:"WF"
				}).then(function(res) {
					this.refreshWFInfo();
					this.$Notice.success({
						desc: '结束成功'
					});
				});
			},
			autoNodeOperate(oper){
				let nodeObj = this.gooFlow.$nodeData[this.currentnodeid];
				let instanceId = this.instanceId;
				if (oper == 'reExecuteSignal') {
					this.submitNodeHandler(instanceId,nodeObj.nodeId, "ES", nodeObj.type.toUpperCase());
				} else if (oper == 'reExecute') {
					this.submitNodeHandler(instanceId,nodeObj.nodeId, "EX", nodeObj.type.toUpperCase());
				} else if (oper == 'unExecuteSignal') {
					this.submitNodeHandler(instanceId,nodeObj.nodeId, "SI", nodeObj.type.toUpperCase());
				} else if (oper == 'seeLog') {
					this.getLogDetail(instanceId,nodeObj.nodeId);
				} else if (oper == 'froceTimeoutNode') {
					this.froceNodeTimeout(instanceId,nodeObj.nodeId);
				} else if (oper == 'subProcess') {
					this.showSubProcess(instanceId,nodeObj.nodeId);
				}
			},
			submitNodeHandler(instanceId,wfNodeId,typeCode,nodeType){
				this.$http.post('instance/singleExec', {
					instanceId: instanceId,
					wfNodeId:wfNodeId,
					typeCode:typeCode,
					nodeType:nodeType,
				},{root:"WF"}).then(function(res) {
					this.refreshWFInfo();
					if(res.data.data){
						this.$Notice.success({
							desc: res.data.data
						});
					}
				});
			},
			getLogDetail(instanceId,wfNodeId){
				this.$http.get('instance/showNodeExeLog', {params:{instanceId: instanceId,
					wfNodeId:wfNodeId},emulateJSON: true,root:"WF"}).then(function(res) {
						this.logInfo = res.data.data;
						this.DrawerModal = true;
				});
			},
			froceNodeTimeout(instanceId,wfNodeId){
				this.$http.post('instance/forceTimeoutNode', {
					instanceId: instanceId,
					wfNodeId:wfNodeId,
				}, {
					emulateJSON: true,
					root:"WF"
				}).then(function(res) {
					this.refreshWFInfo();
					if(res.data.data){
						this.$Notice.success({
							desc: res.data.data
						});
					}
				});
			},
			showSubProcess(instanceId,wfNodeId){
				this.$http.get('instance/viewSubProcess', 
				{
					params:{instanceId: instanceId,wfNodeId:wfNodeId},
					emulateJSON: true,root:"WF"
				}).then(function(res) {
					console.log(JSON.stringify(res.data.data));
					//跳转子流程
				});
			},
		},
	}
</script>

<style scoped="scoped">
	@import url("../static/css/tankflow.css");
	.icon-box{border-radius: 50px; padding:0 2px;font-size: 12px;}
	.icon-box i{font-size: 9px;color:#fff;}
.notice-tag{line-height: 52px; height:50px;}
	
</style>

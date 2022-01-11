<template>
	<div>
		<div>
			<div class="top-button">
				<ButtonGroup>
				<Button @click="backRoute" type="primary"><Icon type="md-return-left" /> 返回</Button>
				<Button @click="saveWF" type="primary"><Icon type="md-cloud-download" /> 保存</Button>
				<Button @click="publishWF" type="primary"><Icon type="md-paper-plane" /> 发布</Button>
				<Upload   :before-upload="handleUpload" action="" style="display: inline-block;" >
					<Button type="primary" :before-upload="handleUpload"><Icon type="md-log-in" /> 导入</Button>
				</Upload>
				<Button @click="exportWF" type="primary"><Icon type="md-log-out" /> 导出</Button>
				<Button @click="rescindWF" type="primary"><Icon type="md-undo" /> 撤销</Button>
				<Button @click="recoverWF" type="primary"><Icon type="md-refresh" /> 恢复</Button>
				</ButtonGroup>
			</div>
		</div>
		<div>
			<div id="designerGraphContainer" class="graph-container">
			</div>
		</div>
		<startComponent :info="startComponentInfo" :gooFlow="gooFlow" @closeComponent="closeComponent" @saveComponent="saveComponent"></startComponent>
		<decisionComponent :info="decisionComponentInfo" :gooFlow="gooFlow" @closeComponent="closeComponent" @saveComponent="saveComponent"></decisionComponent>
		<joinComponent :info="joinComponentInfo" :gooFlow="gooFlow" @closeComponent="closeComponent" @saveComponent="saveComponent"></joinComponent>
		<taskComponent :info="taskComponentInfo" :gooFlow="gooFlow" @closeComponent="closeComponent" @saveComponent="saveComponent"></taskComponent>
		<forkComponent :info="forkComponentInfo" :gooFlow="gooFlow" @closeComponent="closeComponent" @saveComponent="saveComponent"></forkComponent>
		<cmdComponent :info="cmdComponentInfo" :gooFlow="gooFlow" @closeComponent="closeComponent" @saveComponent="saveComponent"></cmdComponent>
		<scrComponent :info="scrComponentInfo" :gooFlow="gooFlow" @closeComponent="closeComponent" @saveComponent="saveComponent"></scrComponent>
		<apiComponent :info="apiComponentInfo" :gooFlow="gooFlow" @closeComponent="closeComponent" @saveComponent="saveComponent"></apiComponent>
		<subProcessComponent :info="subProcessComponentInfo" :gooFlow="gooFlow" @closeComponent="closeComponent" @saveComponent="saveComponent"></subProcessComponent>
	</div>
</template>

<script>
	import GooFlow from '../static/js/gooFlow.js';
	import  '../static/icon/iconfont.js'; 
	import startComponent from './formComponent/startComponent.vue';
	import decisionComponent from './formComponent/decisionComponent.vue';
	import joinComponent from './formComponent/joinComponent.vue';
	import taskComponent from './formComponent/taskComponent.vue';
	import forkComponent from './formComponent/forkComponent.vue';
	import cmdComponent from './formComponent/cmdComponent.vue';
	import scrComponent from './formComponent/scrComponent.vue';
	import apiComponent from './formComponent/apiComponent.vue';
	import subProcessComponent from './formComponent/subProcessComponent.vue';
	
	var oldHeight = 0;
	var oldWidth = 0;
	var minHeight = 0;
	export default {
		props:["designerInfo"],
		components: {
			startComponent,
			decisionComponent,
			joinComponent,
			taskComponent,
			forkComponent,
			cmdComponent,
			scrComponent,
			apiComponent,
			subProcessComponent,
		},
		mounted() {
			window.onresize = function(){
				//新窗口宽高
				var newWidth = window.innerWidth;
				var newHeight = window.innerHeight;
				//画布宽高
				var graphWidth = $("#designerGraphContainer").width() - (oldWidth - newWidth);
				var graphHeight = $("#designerGraphContainer").height() - minHeight - (oldHeight - newHeight);
				//计算最小值与窗口实际值得差
				minHeight = (graphHeight < 438) ? (438 - graphHeight) : 0;
				$("#designerGraphContainer").width(graphWidth);
				$("#designerGraphContainer").height(graphHeight);
				$(".GooFlow_work").width(graphWidth - 48) ;
				$(".GooFlow_work").height(graphHeight);
				if($(".GooFlow_work_inner").width() < (graphWidth - 50)) {
				$(".GooFlow_work_inner").width(graphWidth - 48);
				}
				if($(".GooFlow_work_inner").height() < graphHeight) {
					$(".GooFlow_work_inner").height(graphHeight) ;
				}
				oldHeight = newHeight;
				oldWidth = newWidth;
			}

		},
		watch:{
			designerInfo(newVal,oldVal){
				if(newVal){
					this.setJsonData(newVal.jsonData);
				}else{
					this.setJsonData(null);
				}
			}, 
		},
		data() {
			return {
				gooFlow: {},
				startComponentInfo: {
					modal: false,
					nodeId: null,
				},
				decisionComponentInfo: {
					modal: false,
					nodeId: null,
				},
				forkComponentInfo: {
					modal: false,
					nodeId: null,
				},
				joinComponentInfo: {
					modal: false,
					nodeId: null,
				},
				taskComponentInfo: {
					modal: false,
					nodeId: null,
				},
				cmdComponentInfo: {
					modal: false,
					nodeId: null,
				},
				scrComponentInfo: {
					modal: false,
					nodeId: null,
				},
				apiComponentInfo: {
					modal: false,
					nodeId: null,
				},
				subProcessComponentInfo: {
					modal: false,
					nodeId: null,
				}
			}
		},
		 methods: {
			saveWF() {
				this.$Modal.confirm({
					title:' ',
					content: '<p>请确认是否保存该流程模板视图</p>',
					onOk: () => {
						this.$http.post("designer/diagram/templateInfo", {
							templateId: this.designerInfo.templateId,
							jsonData: this.getJsonData()
						},{root:"WF"}).then(res => {
							this.$Notice.success({
								desc: "保存成功"
							});
						})
					}
				});
			},
			backRoute(){
				this.$router.go(-1);
			},
			getJsonData(){
				return JSON.stringify(this.gooFlow.exportData());
			},
			setJsonData(data){
				let jsonData = null;
				if (data) {
					jsonData = JSON.parse(data);
				}
				this.initCanvas();
				this.gooFlow.loadData(jsonData);
				oldWidth = window.innerWidth;
				oldHeight = window.innerHeight;
			},
			 initCanvas() {
				$("#designerGraphContainer").empty();
				var property = {
					//			width : 900,
					//			height : 900,
					toolBtns: ["start", "end", "decision", "fork", "join", "task", "cmd", "scr", "api", "sub-process"],
					haveHead: false,
					headLabel: true,
					initLabelText: "initLabelText",
					headBtns: ["new", "open", "save", "undo", "redo", "reload"], // 如果haveHead=true，则定义HEAD区的按钮
					haveTool: true,
					haveGroup: false,
					useOperStack: true
				};
				var remark = {
					"cursor": "选择指针",
					"direct": "结点连线",
					"start": "入口结点",
					"end": "结束结点",
					"decision": "选择",
					"task": "任务结点",
					"cmd": "命令",
					"task": "人工任务",
					"scr": "脚本",
					"api": "API",
					"fork": "分支",
					"join": "聚合",
					"sub-process": "子流程"
				};
				this.gooFlow = new GooFlow($("#designerGraphContainer"), property, "designer", this);
				this.gooFlow.setNodeRemarks(remark);
				this.gooFlow.resetScale(1.0);
			},
			publishWF() {
				this.$Modal.confirm({
					title:' ',
					content: '<p>请确认是否发布该流程模板视图</p>',
					onOk: () => {
						
							this.$http.post("designer/diagram/templateInfo", {
								templateId: this.designerInfo.templateId,
								jsonData: this.getJsonData()
							},{root:"WF"}).then(res => {
								this.$http.post("designer/publish/templateInfo", {
									templateId: this.designerInfo.templateId
								}, {
									emulateJSON: true,root:"WF"
								}).then(res => {
									this.$Notice.success({
										desc: "发布成功"
									});
								})
							})
					}
				});
			},
			exportWF(){
				this.$http.post("designer/export/diagram", {
					templateName: this.designerInfo.templateName,
					jsonData:this.getJsonData()
				}, {
					emulateJSON: true,
					responseType: 'arraybuffer',
					root:"WF"
				}).then(res => {
					let blob = new Blob([res.data]);
					let aTag = document.createElement('a');
					aTag.style.display = 'none';
					aTag.download = this.designerInfo.templateName+".txt";
					aTag.href = URL.createObjectURL(blob);
					document.body.appendChild(aTag);
					aTag.click();
				})
			},
			handleUpload(file){
				let formdata = new FormData()
				formdata.append('file', file);
				let config = {
					emulateJSON: true,
					headers: {
					  'Content-Type': 'multipart/form-data'
					},
					root:"WF"
				}
				//
				//WF/designer/import/diagram
				this.$http.post("designer/import/diagram",formdata, config).then(res => {
					this.$Notice.success({
						desc: "导入成功"
					});
					this.setJsonData(JSON.stringify(res.data.data));			
				})
				return false;
			},
			rescindWF(){
				this.gooFlow.undo();
			},
			recoverWF(){
				this.gooFlow.redo();
			},
			printWF(){
				this.gooFlow.print();
			},
			exportDiagram(){
				this.gooFlow.exportDiagram(this.designerInfo.templateName);
			},
			closeComponent(modal) {
				this[modal + "ComponentInfo"].modal = false;
			},
			saveComponent(info, name, data) {
				this.gooFlow.setName(info.nodeId, name, "node");
				let nodeObj = this.gooFlow.$nodeData[info.nodeId];
				nodeObj.data = data;
				info.modal = false;
				this.$Notice.success({
					desc: "保存成功"
				});
			},
		 }
	 }
</script>

<style scoped="scoped">
	@import url("../static/css/tankflow.css");
	.top-button .ivu-btn-group>.ivu-upload>.ivu-upload>.ivu-btn{
		border-radius: 0;
	}
	.top-button .ivu-btn-group>.ivu-upload{
		margin-left: 0;
	}
	.top-button .ivu-btn-group>.ivu-upload{
		position: relative;
		float: left;
	}
</style>

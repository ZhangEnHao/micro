<template>
	<div>
		<!-- openstackInterfaceError -->
		<Collapse>
			<Panel name="1"> {{getTitle}}
				<p slot="content">
					<Row class="divCl"> <b>方法：</b>{{request.method}} </Row>
					<Row class="divCl"> <b>URL：</b>{{request.url}} </Row>
					<Row class="divCl"> <b>参数：</b>{{request.params}} </Row>
					<Row class="divCl"> <b>状态：</b>{{response.status}} </Row>
					<Row class="divCl"> <b>详情：</b>{{response.statusText}} </Row>
				</p>
			</Panel>
		</Collapse>
	</div>
</template>
<script>
	export default {
		props: {
			request: {
				type: Object,
				default: {}
			},
			response: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {}
		},
		computed: {
			getTitle() {
				let title = this.response.statusText;
				let status = parseInt(this.response.status / 100);
				if(status == 4) {
					title = "请求路径或者参数有误";
					if(this.response.status == 401) {
						title = "当前请求需要用户验证";
					}else if(this.response.status == 404) {
						title = "请求路径不存在";
					}
				}else if(status == 5) {
					title = "服务器异常";
					if(this.response.status == 501) {
						title = "服务器无法识别请求的方法";
					}else if(this.response.status == 503) {
						title = "请求超时";
					}
				}
				return title;
			}
		},
		methods: {},
		created() {}
	}
</script>
<style scoped>
	.divCl {
		line-height: 25px;
		word-wrap: break-word;
	}
</style>
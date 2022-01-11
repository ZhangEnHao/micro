<template>
	<div>
		<!-- openstackInterfaceError -->
		<Collapse v-if="response.data.code == 1000">
			<Panel name="1">
				{{response.data.data.message}}
				<p slot="content">
					<Row class="divCl"> <b>方法：</b>{{response.data.data.requestMethod}} </Row>
					<Row class="divCl"> <b>URL：</b>{{response.data.data.url}} </Row>
					<Row class="divCl"> <b>详情：</b>{{response.data.data.message}} </Row>
				</p>
			</Panel>
		</Collapse>
		<!-- tenant error-->
		<Collapse v-else>
			<Panel name="1">
			{{!response.data.message? "系统异常" : response.data.message}}
				<p slot="content">
					<Row class="divCl"> <b>方法：</b>{{request.method}} </Row>
					<Row class="divCl"> <b>URL：</b>{{response.url}} </Row>
					<Row class="divCl"> <b>参数：</b>{{request.params}} </Row>
					<Row class="divCl"> <b>body：</b>{{request.body}} </Row>
					<Row class="divCl"> <b>详情：</b>{{!response.data.message?"系统异常":response.data.message}} </Row>
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
			return {
				code: 0
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
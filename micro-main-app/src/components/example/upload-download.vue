<template>
	<div class="float-e-margins">
		<div class="titleAll ibox-title">
			<Breadcrumb>
				<BreadcrumbItem>title</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div class="ibox-content">
			<div>
				<Upload  :before-upload="handleUpload" action="" :format="format" :accept="accept" :max-size="1024" style="display: inline-block;" >
					<Button type="primary" :before-upload="handleUpload"><Icon type="md-log-in" />选择图片</Button>
				</Upload>
				<img  id="show" :src="imgSrc" style="width:100px;height:100px;"></img>
				<Button type="primary" @click="upload">保存</Button>
			</div>
			<div>
				<Button type="primary" @click="download1">下载</Button>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	data () {
		return {
			file:null,
			imgSrc:"",
			format:['jpg','jpeg','png'],
			accept:"image/gif, image/jpeg,image/png",
		}
	},
	created (){},
	computed:{},
	methods:{
		handleUpload(file){
			/* let reader = new FileReader();
			reader.onload = function (evt) {
				this.imgSrc = evt.target.result;
			}
			reader.readAsDataURL(file); */
			this.file = file;
			let path = window.URL.createObjectURL(file);
			this.imgSrc = path;
			return false;
		},
		upload(){
			let formdata = new FormData()
			formdata.append('file', file);
			let config = {
				emulateJSON: true,
				headers: {
				  'Content-Type': 'multipart/form-data'
				} 
			}
			this.$http.post("uri",formdata, config).then(res => {
				this.$Notice.success({
					title: '上传',
					desc: "上传成功"
				});
			})
		},
		download1(){
				//直接a标签 参数有限制，参数没有限制情况下，可以直接使用。
				 let url = 'CMPUI/topology/download/?'+params;
				let link = document.createElement('a');
				link.style.display = 'none';
				link.href = url;
				link.download = "filename.txt";
				document.body.appendChild(link);
				link.click(); 
		},
		download2(){
				// 参数比较灵活
			this.$http.post("WF/designer/export/diagram", {
				params
			}, {
				emulateJSON: true,
				responseType: 'arraybuffer',
			}).then(res => {
				let blob = new Blob([res.data]);
				let aTag = document.createElement('a');
				aTag.style.display = 'none';
				aTag.download = "filename.txt";
				aTag.href = URL.createObjectURL(blob);
				document.body.appendChild(aTag);
				aTag.click();
			})
		}
	}
}
</script>

<style scoped="scoped">
</style>



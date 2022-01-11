requirejs.config({
    map: {
		'*': {
			'css': 'https://cdn.bootcss.com/require-css/0.1.10/css.min.js' // https://github.com/guybedford/require-css, RequireJs's plugin
		}
	},
    paths: {
        jquery: 'https://cdn.bootcss.com/jquery/1.12.4/jquery.min',
        GooFlow: './GooFlow.min',
        'GooFlow.group': './GooFlow.group',    //可选，支持分组泳道显示的扩展包 (从1.3.8rp版本开始)
    },
    //// ……
    shim: {
        GooFlow: {
            deps:['css!./GooFlow.min.css','jquery']
        }
    },
});

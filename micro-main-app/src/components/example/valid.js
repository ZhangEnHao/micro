[
	{required:true,message:"不能为空"},
	{validator: isNameValid, trigger: 'blur'},
	{min:2,max:20,message:"长度在2-20之间"},
	{len:10,message:"长度10"},
	{message: "正则",pattern: /^$/},
	{type: "email",message:"email"},
]
https://github.com/yiminghe/async-validator
render:(h,params)=>{
	return <Select value={params.row.type} onOn-change={e=>{params.row.type = e;
             this.tableList[params.index] = params.row}}>
		<i-option value="input">input</i-option>
		</Select>
},
						
render:(h,params)=>{
	return ( <Input value={params.row.defaultValue}  onOn-change={e=>{ params.row.defaultValue = e.target.value;
            this.tableList[params.index] = params.row}} ></Input> )
},
render:(h,params)=>{
	return <Checkbox value={params.row.isRequired} true-value="true" false-value="false" onOn-change={e=>{params.row.isRequired = e;
            this.tableList[params.index] = params.row}}></Checkbox>
}
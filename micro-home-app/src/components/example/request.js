/*
*vue-resource api
*/
//requestParams
this.$http.get('uri',{params:data}).then(function(res){
			
	}); 
//requestParams	
this.$http.post('uri',data,{params:data,emulateJSON: true}).then(function(res){
			
	}); 
	
//requestBody +requestParams	
this.$http.post('uri',data,{params:data}).then(function(res){
			
	});
//requestParams	
this.$http.put('uri',data,{params:data,emulateJSON: true}).then(function(res){
			
	}); 
	//requestBody +requestParams	
this.$http.put('uri',data,{params:data}).then(function(res){
			
	}); 
//requestParams		
this.$http.delete('uri',{params:data}).then(function(res){
			
	}); 

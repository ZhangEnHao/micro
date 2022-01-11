const MemoryStorage =  class {
    constructor(){
        //this.data = {};
    }
    setItem(k, v){
        //this.data[k] = v;
        //MemoryStorage.dataSendHandler( this.data );
		sessionStorage.setItem(k,JSON.stringify(v));
		MemoryStorage.dataSendHandler(k, v);
		
    }
    getItem(k){
        //return this.data[k];
		return JSON.parse(sessionStorage.getItem(k));
    }
    removeItem(k){
        //delete this.data[k];
        //MemoryStorage.dataSendHandler( this.data );
		sessionStorage.removeItem(k);
		MemoryStorage.dataSendHandler( k );
    }
    clear(){
        //this.data = {};
       // MemoryStorage.dataSendHandler( this.data );
	   sessionStorage.clear();
	   MemoryStorage.dataSendHandler( JSON.parse(JSON.stringify(sessionStorage)));
    }
    static dataSendHandler( data ){
        localStorage.setItem('setMemoryStorage', JSON.stringify(data));
        localStorage.removeItem('setMemoryStorage');
    }
    static dataGetHandler(){
        localStorage.setItem('getMemoryStorage', new Date().getTime());
        localStorage.removeItem('getMemoryStorage');
    }
}
const initMemoryStorage = function(){
    var memoryStorage = new MemoryStorage();
    window.addEventListener('storage',function(e){
        if( e.newValue===null ) return false;
        if(e.key == 'getMemoryStorage'){
            console.log('有其他页面取memory')
            //MemoryStorage.dataSendHandler( memoryStorage.data );
			MemoryStorage.dataSendHandler( JSON.parse(JSON.stringify(sessionStorage)) );
			
        }
        else if(e.key == 'setMemoryStorage'){
            let data = JSON.parse(e.newValue);
            if( isEmptyObj(data) ){
                console.log('memory被清空了')
                //memoryStorage.data = {};
				sessionStorage.clear();
            }else{
                console.log('memory被修改了')
                for(let k in data){
					//memoryStorage.data[k] = data[k];
					sessionStorage.setItem(k,data[k]);
                }
            }
        }
    })
	
   if( isEmptyObj(sessionStorage.length == 0) ){
        MemoryStorage.dataGetHandler();
    }
	return memoryStorage;
}
function isEmptyObj(obj){
    for(let i in obj){
        return false;
    }
    return true;
}
export default initMemoryStorage;
module.exports = {
	listeningTo:[]
,	listen:function(obj,evt,fn){
		var method = obj.addEventListener || obj.on;
		if(!method){throw new Error('object is not an event emitter');}
		fn = fn.bind(this);
		var type = typeof evt == 'string' ? evt : evt.type;
		listeningTo.push([obj,type,fn]);
		method.call(obj,evt,fn);
	}
,	stopListening:function(obj,evt,fn){
		var method = obj.removeEventListener || obj.off;
		if(!method){throw new Error('object is not an event emitter');}
		var type = (evt && typeof evt == 'string') ? evt : evt ? evt.type : null;
		for(var i = 0;i<this.listeningTo.length;i++){
			if(this.listeningTo[i][0] == obj){
				if(type){
					if(this.listeningTo[i][1] == type){
						if(fn){
							if(this.listeningTo[i][2] == fn){
								this.listeningTo.splice(i,1);
							}
							continue;
						}
						this.listeningTo.splice(i,1);
						continue;
					}
					continue;
				}
				this.listeningTo.splice(i,1);
				continue;
			}
		}
	}
}
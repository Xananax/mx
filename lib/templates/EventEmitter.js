var Factory = require('../Factory');
var define = Factory.define;

function evtToRegExp(type){
	return new RegExp('^'+type.replace('.','\.').replace('*','.+?')+'$','i');
}

module.exports = {
	events:{}
,	on:function(evt,fn){
		var type = typeof evt == 'string' ? evt : evt.type;
		if(!this.events[type]){this.events[type] = [];}
		this.events[type].push(fn);
		return this;
	}
,	off:function(evt,fn){
		var type = evtToRegExp(typeof evt == 'string' ? evt : evt.type)
		,	index
		;
		for(var t in this.events){
			if(type.test(t)){
				if(fn){
					index = this.events[t].indexOf(fn);
					if(index>=0){
						this.events[t].splice(index,1);
					}
					if(this.events[t].length==0){delete this.events[t];}
				}else{
					delete this.events[t];
				}
			}
		}
		return this;
	}
,	trigger:function(evt,params){
		var type = evtToRegExp(typeof evt == 'string' ? evt : evt.type),i,l;
		for(var t in this.events){
			if(type.test(t)){
				l = this.events[t].length
				for(i=0;i<l;i++){
					this.events[t][i].call(this,evt,params);
				}
			}
		}
		return this;
	}
}
var Factory = require('../Factory');
var define = Factory.define;

module.exports = {
	___set:function(prop,value){
		this.___properties[prop] = value;
	}
,	___get:function(prop){
		return this.___properties[prop];
	}
,	toJson:function(){
		var ret = {};
		for(var n in this){
			ret[n] = this[n];
		}
		return ret;
	}
}
module.exports = function FactoryModel(Factory,Constructor,proto,name){
	Constructor.extend = function(){
		var args = new Array(arguments.length), l = args.length-1;
		while(l>=0){args[l] = arguments[l--];}
		if(typeof args[0] == 'string'){
			args.splice(1,0,proto);
		}else{
			args.unshift(proto);
		}
		return Factory.apply(null,args);
	}
	Constructor.mixin = function(){
		var args = new Array(arguments.length), l = args.length-1,curr,i=0;
		while(l>=0){args[l] = arguments[l--];}
		args.unshift(proto);
		Factory.mixin.apply(null,args);
		return Factory.mixin;
	}
	Constructor.define = function(prop,value,visible){
		return Factory.define(proto,prop,value,visible);
	}
	if(name && name.length){
		Constructor.is = function(obj){
			return Factory.isA(obj,name[0]);
		}
	}
}
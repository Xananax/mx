var clone = require('clone');
var templates = {};
var ConstructorMethods = require('./Constructor');
var noOp = false;

function define(obj,prop,val,visible){
	Object.defineProperty(obj,prop,{
		enumerable:!!visible
	,	writable:true
	,	configurable:true
	,	value:val
	});
	return define.bind(this,obj);
}

function template(name,props){
	if(props){
		if(typeof props == 'function'){
			var proto = props.prototype;
			proto.constructor = props;
			props = proto;
		}
		templates[name] = props;
		return template;
	}
	return templates[name] ? templates[name].constructor : null;
}

function isFunction(fn) { return typeof fn == "function"; }

function wrap(previousFunction,func){
	return function Wrapped(){
		var args = new Array(arguments.length), l = args.length-1;
		while(l>=0){args[l] = arguments[l--];}
		var old___super = this.___super;
		this.___super = previousFunction
		var ret = func.apply(this,args);
		this.___super = old___super;
		return ret;
	}
}

function extendFunction(source,property){
	return function(){
		var l = arguments.length, args = new Array(l);
		while(l>=0){args[l] = arguments[l--];}
		return source[property].apply(this,args);
	}
}

function mixin(){
	var l = arguments.length, args = new Array(l),i=0,target,source;
	while(i<l){args[i] = arguments[i++];}
	target = args[0];
	i =  1;
	while(i<l){
		source = args[i++];
		if(typeof source == 'string'){
			source = template(source);
			if(!source){continue;}
			source = source.prototype;
		}
		for(var property in source){
			if(property == 'prototype'){continue;}
			var curr = source[property];
			if(typeof curr == 'function'){
				curr = extendFunction(source,property);
				if(target[property]){
					curr = wrap(target[property],curr);
				}
				target[property] = curr;
			}else{
				if(property == 'STATIC'){
					if(!target.STATIC){target.STATIC = {};}
					mixin(target.STATIC,source.STATIC);
				}
				else{
					target[property] = source[property];
				}
			}
		}
	}
	return target;
}

function getAndDelete(obj,property,def){
	if(obj.hasOwnProperty(property)){
		def = obj[property];
	}
	return def;
}

function construct(constructor, args) {
    function F() {
        return constructor.apply(this, args);
    }
    F.prototype = constructor.prototype;
    return new F();
}

function isA(obj,name){
	if(obj.constructor && obj.constructor.___templates){
		return obj.constructor.___templates.indexOf(name)>=0;
	}
}

function Factory(){
	var l = arguments.length-1, args = new Array(l),n;
	var properties={},STATIC,proto,constructor,name=[],curr;
	while(l>=0){args[l] = arguments[l--];}
	l = args.length;
	if(!l){return false;}
	if(typeof args[0] == 'string'){
		if(l==1){
			return template(args[0]);
		}
		name.push(args.shift());
	}
	l = args.length;
	while(l--){
		curr = args[l];
		if(typeof curr == 'string'){
			curr = template(curr);
			if(!curr){args.splice(l,1);}
			else{
				name.push(args[l]);
				args[l] = curr.prototype;
			}
		}
		else if(typeof curr == 'function'){
			proto = curr.prototype;
			proto.constructor = curr;
			args[l] = proto;
		}
	}
	proto = mixin.apply(null,args);

	STATIC = getAndDelete(proto,'STATIC',null);
	constructor = getAndDelete(proto,'constructor',null);

	for(n in proto){
		if(typeof proto[n]!='function'){
			properties[n] = proto[n];
		}
	}

	var hasProperties = false;
	for(n in properties){hasProperties = true;break;}
	if(!hasProperties){properties = false;}
	var Constructor = function Constructor(){
		define(this,'___super',noOp,false);
		var l = arguments.length, args = new Array(l);
		while(l>=0){args[l] = arguments[l--];}
		if(!(this instanceof Constructor)){return construct(Constructor,args);}
		if(arguments[0] == isFunction){return;}
		if(properties){
			for(var n in properties){
				this[n] = clone(properties[n]);
			}
		}
		if(constructor){constructor.apply(this,args);}
	}
	ConstructorMethods(Factory,Constructor,proto,name);
	if(STATIC){
		mixin(Constructor,STATIC);
	}
	if(name.length){
		Constructor.___templates = name;
		template(name[0],proto);
	}
	Constructor.prototype = proto;
	Constructor.prototype.constructor = Constructor;
	return Constructor;
}

Factory.isA = isA;
Factory.template = template;
Factory.define = define;
Factory.mixin = mixin;
Factory.clone = clone;
module.exports = Factory;

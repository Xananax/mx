# TOC
   - [Basic](#basic)
     - [MX({})](#basic-mx)
     - [MX({constructor:[function]})](#basic-mxconstructorfunction)
     - [MX({prop:value})](#basic-mxpropvalue)
     - [MX({STATIC:{}})](#basic-mxstatic)
     - [MX(string,{})](#basic-mxstring)
   - [Extensibility](#extensibility)
     - [Mixing Objects](#extensibility-mixing-objects)
     - [Mixing existing prototypes](#extensibility-mixing-existing-prototypes)
     - [Mixing named prototypes](#extensibility-mixing-named-prototypes)
   - [Constructors methods](#constructors-methods)
     - [Constructor.extend()](#constructors-methods-constructorextend)
     - [Constructor.mixin()](#constructors-methods-constructormixin)
     - [Constructor.define()](#constructors-methods-constructordefine)
   - [___super()](#___super)
     - [inside functions](#___super-inside-functions)
   - [Late binding](#late-binding)
     - [Changing a method of a prototype](#late-binding-changing-a-method-of-a-prototype)
   - [Medley](#medley)
<a name=""></a>
 
<a name="basic"></a>
# Basic
<a name="basic-mx"></a>
## MX({})
creates a new constructor.

```js
var A = MX({});
var a = new A();
a.should.be.instanceof(A);
```

<a name="basic-mxconstructorfunction"></a>
## MX({constructor:[function]})
runs the constructor when called with 'new'.

```js
var A = MX({
	constructor:function(arg){
		this.property=arg;
	}
});
var a = new A('arg');
a.should.have.property('property');
a.property.should.equal('arg');
```

runs the constructor when called without 'new'.

```js
var A = MX({
	constructor:function(arg){
		this.property=arg;
	}
});
var a = A('arg');
a.should.have.property('property');
a.property.should.equal('arg');
```

<a name="basic-mxpropvalue"></a>
## MX({prop:value})
clones the value on the mixed object.

```js
var A = MX({property:'value'});
var a = new A();
a.should.have.property('property');
a.property.should.equal('value');
a.property = 'changed';
a.property.should.equal('changed');
A.prototype.property.should.equal('value');
```

<a name="basic-mxstatic"></a>
## MX({STATIC:{}})
creates a new constructor.

```js
var A = MX({
	STATIC:{
		property:'something'
	,	method: function(){return 'return from method'}
	}
});
A.should.have.property('property');
A.should.have.property('method');
A.method().should.equal('return from method');
```

<a name="basic-mxstring"></a>
## MX(string,{})
creates a named prototype that can be called later by passing its name.

```js
var A = MX('A',{});
var a = new (MX('A'))();
a.should.be.instanceof(A);
```

<a name="extensibility"></a>
# Extensibility
<a name="extensibility-mixing-objects"></a>
## Mixing Objects
creates a final object that is the result of all passed objects.

```js
var A = {a:'a'};
var B = {b:'b'};
var C = {c:'c'};
var ABC = MX({},A,B,C);
var abc = new ABC();
abc.should.have.property('a');
abc.should.have.property('b');
abc.should.have.property('c');
abc.a.should.equal('a');
abc.b.should.equal('b');
abc.c.should.equal('c');
```

<a name="extensibility-mixing-existing-prototypes"></a>
## Mixing existing prototypes
creates a final object that is the result of all passed objects.

```js
var A = function(){};
A.prototype.a = function(){return 'a';}
var B = {b:'b'};
var AB = MX({},A,B);
var ab = new AB();
ab.should.have.property('a');
ab.should.have.property('b');
ab.a().should.equal('a');
ab.b.should.equal('b');
```

<a name="extensibility-mixing-named-prototypes"></a>
## Mixing named prototypes
creates a final object that is the result of all passed objects.

```js
MX('A',{a:'a'});
var B = {b:'b'};
var AB = MX({},'A',B);
var ab = new AB();
ab.should.have.property('a');
ab.should.have.property('b');
ab.a.should.equal('a');
ab.b.should.equal('b');
```

<a name="constructors-methods"></a>
# Constructors methods
<a name="constructors-methods-constructorextend"></a>
## Constructor.extend()
returns a new prototype that implements the previous.

```js
var A = MX({something:'value'});
var B = A.extend({somethingElse:'otherValue'});
var b = new B();
b.should.have.property('something');
```

<a name="constructors-methods-constructormixin"></a>
## Constructor.mixin()
adds methods to the prototype.

```js
var A = MX({name:'a'});
MX('B',{
	b:function(){return 'b';}
})
A.mixin({a:function(){return 'a'}});
A.mixin('B');
var a = new A();
a.should.have.property('a');
a.a().should.equal('a');
a.should.have.property('b');
a.b().should.equal('b');
```

<a name="constructors-methods-constructordefine"></a>
## Constructor.define()
adds one method to the prototype.

```js
var A = MX({});
var a = new A();
A.define('a',function(){return 'a';});
a.should.have.property('a');
a.a().should.equal('a');
```

<a name="___super"></a>
# ___super()
<a name="___super-inside-functions"></a>
## inside functions
is available in any function that requires it.

```js
var A = {
	a:function(){return 'a';}
};
var B = {
	a:function(){
		return this.___super()+'b';
	}
};
var AB = MX({},A,B);
var ab = new AB();
ab.should.have.property('a');
ab.a().should.equal('ab');
```

is unavailable if it wasn't defined previously.

```js
var A = {
	a:function(){return 'a';}
};
var B = {
	b:function(){
		return this.___super()+'b';
	}
};
var AB = MX({},A,B);
var ab = new AB();
ab.should.have.property('a');
expect(ab.a).to.throw.error;
```

is available on the constructor too.

```js
var A = {
	constructor:function(arg){
		this.arg=arg;
	}
};
var B = {
	constructor:function(arg1,arg2){
		this.___super(arg2);
	}
};
var AB = MX({},A,B);
var ab = new AB('a','b');
ab.should.have.property('arg');
ab.arg.should.equal('b');
```

is not enumerable.

```js
var A = MX({
	constructor:function(arg){
		this.arg=arg;
	}
});
var a = new A();
a.should.have.property('___super');
for(var n in a){
	if(n === '___super'){throw new Error();}
}
```

<a name="late-binding"></a>
# Late binding
<a name="late-binding-changing-a-method-of-a-prototype"></a>
## Changing a method of a prototype
changes the function in every instance.

```js
var A = function(){};
A.prototype.a = function(){return 'a';}
var A2 = MX({},A);
var a = new A();
var a2 = new A2();
a2.should.have.property('a');
a2.a().should.equal('a');
A.prototype.a = function(){return 'b';}
a2.a().should.equal('b');
A2.prototype.a = function(){return 'c';}
a2.a().should.equal('c');
a.a().should.equal('b');
```

<a name="medley"></a>
# Medley
should work.

```js
var Classical = function(){
	this.wasRun = true;
}
Classical.prototype.method1 = function(){
	return 'classical1';
}
Classical.prototype.method2 = function(){
	return 'classical2';
}
MX('A',{
	STATIC:{
		someMethod:function(){return 'STATIC-A';}
	}
,	constructor:function(arg){
		if(this.___super){this.___super();}
		this.arg = arg;
	}
,	a:function(){
		return 'a';
	}
});
MX('B','A',Classical,{
	STATIC:{
		someMethod:function(){return this.___super()+'STATIC-B';}
	}
,	constructor:function(arg){
		this.___super(arg);
		this.brg = 'brg';
	}
,	b:function(){
		return 'b';
	}
,	method1:function(){
		return this.___super()+'b';
	}
});
MX('B').extend('C',{
	c:function(){
		return 'c';
	}
});
var c = new (MX('C'))();
c.should.have.property('method1');
c.should.have.property('method2');
c.should.have.property('a');
c.should.have.property('b');
c.should.have.property('c');
c.should.not.have.property('wasRun');
c.method1().should.equal('classical1b')
MX('C').should.have.property('someMethod');
MX('C').someMethod().should.equal('STATIC-ASTATIC-B');
```


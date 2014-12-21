var chai = require('chai');
var expect = chai.expect;
var MX = require('../lib/Factory');
chai.should();

describe("Basic",function(){
	describe("MX({})",function(){
		it("creates a new constructor",function(){
			var A = MX({});
			var a = new A();
			a.should.be.instanceof(A);
		});
	});
	describe("MX({constructor:[function]})",function(){
		it("runs the constructor when called with 'new'",function(){
			var A = MX({
				constructor:function(arg){
					this.property=arg;
				}
			});
			var a = new A('arg');
			a.should.have.property('property');
			a.property.should.equal('arg');
		});
		it("runs the constructor when called without 'new'",function(){
			var A = MX({
				constructor:function(arg){
					this.property=arg;
				}
			});
			var a = A('arg');
			a.should.have.property('property');
			a.property.should.equal('arg');
		});
	});
	describe("MX({prop:value})",function(){
		it("clones the value on the mixed object",function(){
			var A = MX({property:'value'});
			var a = new A();
			a.should.have.property('property');
			a.property.should.equal('value');
			a.property = 'changed';
			a.property.should.equal('changed');
			A.prototype.property.should.equal('value');
		});
	});
	describe("MX({STATIC:{}})",function(){
		it("creates a new constructor",function(){
			var A = MX({
				STATIC:{
					property:'something'
				,	method: function(){return 'return from method'}
				}
			});
			A.should.have.property('property');
			A.should.have.property('method');
			A.method().should.equal('return from method');
		});
	});
	describe("MX(string,{})",function(){
		it("creates a named prototype that can be called later by passing its name",function(){
			var A = MX('A',{});
			var a = new (MX('A'))();
			a.should.be.instanceof(A);
		});
	});
});

describe("Extensibility",function(){
	describe("Mixing Objects",function(){
		it("creates a final object that is the result of all passed objects",function(){
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
		});
	});
	describe("Mixing existing prototypes",function(){
		it("creates a final object that is the result of all passed objects",function(){
			var A = function(){};
			A.prototype.a = function(){return 'a';}
			var B = {b:'b'};
			var AB = MX({},A,B);
			var ab = new AB();
			ab.should.have.property('a');
			ab.should.have.property('b');
			ab.a().should.equal('a');
			ab.b.should.equal('b');
		});
	});
	describe("Mixing named prototypes",function(){
		it("creates a final object that is the result of all passed objects",function(){
			MX('A',{a:'a'});
			var B = {b:'b'};
			var AB = MX({},'A',B);
			var ab = new AB();
			ab.should.have.property('a');
			ab.should.have.property('b');
			ab.a.should.equal('a');
			ab.b.should.equal('b');
		});
	});
});

describe("Constructors methods",function(){
	describe("Constructor.extend()",function(){
		it("returns a new prototype that implements the previous",function(){
			var A = MX({something:'value'});
			var B = A.extend({somethingElse:'otherValue'});
			var b = new B();
			b.should.have.property('something');
		});
	});
	describe("Constructor.mixin()",function(){
		it("adds methods to the prototype",function(){
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
		});
	});
	describe("Constructor.define()",function(){
		it("adds one method to the prototype",function(){
			var A = MX({});
			var a = new A();
			A.define('a',function(){return 'a';});
			a.should.have.property('a');
			a.a().should.equal('a');
		});
	});
});

describe("___super()",function(){
	describe("inside functions",function(){
		it("is available in any function that requires it",function(){
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
		});
		it("is unavailable if it wasn't defined previously",function(){
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
		});
		it("is available on the constructor too",function(){
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
		});
		it("is not enumerable",function(){
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
		})
	});
});

describe("Late binding",function(){
	describe("Changing a method of a prototype",function(){
		it("changes the function in every instance",function(){
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
		});
	});
});


describe("Medley",function(){
	it("should work",function(){
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
	});
})
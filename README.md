#MX

A simple, non-nonsense utility to create mixins.

#Example usage:
```js
    var MX = require('mx');

    MX('Animal',{
        constructor:function(name){
            this.name = name;
        }
    ,   eat:function(what){
            console.log(this.name+' is eating '+what);
        }
    });
    MX('Dog','Animal',{
        constructor:function(name){
            this.___super(name);
        }
    ,   bark:function(){
            console.log('waf waf');
        }
    ,   eat:function(what){
            this.___super(what);
            console.log('and liking it very much, thank you');
        }
    });

    var Dog = MX('Dog');
    var fido = new Dog('fido').
    fido.bark() //waf waf
    fido.eat('a tenderloin'); //fido is eating a tenderloin\n and liking it very much, thank you

```


## Methods

### MX([name,]properties)
creates and returns a constructor. If `name` is provided, the constructor's prototype will be saved for reuse. To reuse it, simply call `MX(name)`.

### MX([name,]\[parentPrototypes...,\]properties)
`parentPrototypes` can be either another object, a classical constructor, or a string that correspond to a previously saved prototype. All functions and properties of every `parentPrototype` are copied in the final prototype. If a function already exists, it will be available as `___super()`.

For more methods and details, check the tests, or the [specs.md](https://github.com/xananax/mx/blob/master/specs.md) file.

## Templates

MX comes with a few bundled templates, check them out in /lib/templates

## FAQ

#### Is it performant?
Well. Since all methods are transferred to the final object's prototype, there are much less prototypes lookups than usual (specially if you are going to use a long chain). However, prototypes *creation* is sorta expensive. Arguably, you call much more methods on instances than you spend time creating objects, so I think the trade-off is worth it, but I haven't benchmarked or anything.
But anyway, MX is optimized for developer happiness, not for speed. If it's raw speed you need, check [my.class.js](https://github.com/jiem/my-class).

## License
MIT
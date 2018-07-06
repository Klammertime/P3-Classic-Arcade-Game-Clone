


### Creating Superclass & Subclasses Using Prototype Chain

I created a superclass, Entity, and the subclasses inherit from this superclass
using a prototype chain (Enemy, Player and Gem). A great short explanation for how to set up a prototype chain is found in this video on Pluralsight: [Creating Your Own Protypal Inheritance Chains](https://app.pluralsight.com/player?course=javascript-objects-prototypes&author=jim-cooper&name=javascript-objects-prototypes-m3&clip=7&mode=live).

This prototype chain makes it so that the instance of Enemy, in this case the very creative 'enemy' ;) first looks to see that instance has a specific property and if not, it looks to its prototype, Entity. That's why its a chain, it goes up the chain.

The instructor, Jim Cooper, says that to create a protype chain there are basically 3 lines you have to pay attention to, I'll write out the simple example he gave and put comments above each line:

```
'use strict';

function Animal(voice) {
    this.voice = voice || 'grunt';
}

Animal.prototype.speak = function() {
    display(this.voice);
}

function Cat(name, color) {
    // 1) Animal.call calls the Animal function passing in the Cat being 
    // constructed so any Animal-related initialization can occur. In other 
    // words, the following code is telling the Animal constructor that the 
    // 'this' inside of the Animal constructor that pertains to the first 
    // parameter, voice, should be the same 'this' as the cat instance. If
    // the Animal constructor had another parameter after voice, you could pass
    // in another argument to .call after 'Meow' and it would serve as that 
    // value. This is a way to have Cat inherit some of the properties from 
    // the superclass Animal, but not all. 'call' gives us the power to 
    // specify which properties Cat will inherit. 

    Animal.call(this, 'Meow');
    this.name = name;
    this.color = color;
}

// 2) Set Cat.protype to inherit from Animal.prototype
Cat.prototype = Object.create(Animal.prototype);

// 3) Make sure the Cat constructor remains the Cat so when you 
// use the 'new' keyword it instantiates a new Cat object
Cat.prototype.constructor = Cat;
var fluffy = new Cat('Fluffy', 'White');
```

* [MDN info on Function.prototype.call()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

* This video explains .call() well: [Udacity - OOJS: Pseudoclassical Subclasses > Using .call()](https://www.udacity.com/course/viewer#!/c-ud015/l-2794468541/m-2777058542)

### Class-like Syntax
You can build the same class-like chain using class-like syntax, however, its
just syntactic sugar built atop everything else we've learned about, shown above, with some small differences. And it is a little cleaner.
* You can view [Creating Prototypes with Classes](https://app.pluralsight.com/player?course=javascript-objects-prototypes&author=jim-cooper&name=javascript-objects-prototypes-m3&clip=8&mode=live) to see how.

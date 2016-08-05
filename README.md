# JavaScript Functions & Scope


## Table of Contents

* [First Class Functions](#first-class-functions)
* [Scoping](#scoping)
* [Invocation Context(=this)](#invocation-contextthis)


## First Class Functions

### Assign a Function to a Variable

```javascript
//returns the circumference of a circle
var circumference = function (circle) {
  return 2 * Math.PI * circle.radius;
};
//define circle object
var circle = {x: 100, y: 100, radius: 50};

//invoke the function
console.log(circumference(circle)); //314.159
```


### Passing a Function as an Argument to Another Function

```javascript
/*
 This is a JSON replacer function, which filters out property
 'radius' from object serialization process
 */

var filter = function (key, value) {
//don't serialize property 'radius'
  if (key === "radius") {
    return undefined;
  } else {
    return value;
  }
};

//define circle object
var circle = {x: 100, y: 200, radius: 50};

//get string version of circle object
var info = JSON.stringify(circle, filter);

//print the string equivalent of object
console.log(info);  // '{'x': 100, 'y': 200}'
```

### Returning a Function as a Value From Another Function

```javascript
//define outer function that returns inner function
function outer(x) {
//this secret is a closure - Wait for chapter2
  var secret = 5;
  return function () {
    console.log(secret + x);
  }
}

//get the inner function
var inner = outer(10);

//invoke inner function
inner(); //15
```


## Scoping

### Variable Declaration Hoisting Rule

```javascript
//this function tries to check the presence of variable 'a' before and after its declaration
function scopeTest() {
  console.log(a); // undefined - this means variable a is hoisted at this point.No ReferenceError
  var a = 1;
  console.log(a); //1
}

scopeTest();
```


### Function Declaration Statement Hoisting Rule

```javascript

//this function illustrates the hoisting of function statement
function outer() {
  //function inner is in scope here
  //it could be invoked at this place
  inner();

  console.log(typeof inner === 'function');
  //true

  function inner() {
    console.log('I can be invoked anywhere inside outer function');
  }

  //function inner is in scope here
  //it could be invoked at this place
  inner();
  console.log(typeof inner === 'function');
  //true
}

outer();
```


### Function Definition Expression Hoisting Rule

```javascript
//this function illustrates the hoisting of function definition expression
function outer() {
  //function inner is not in scope here
  //it can not be invoked at this place
  inner(); //typeError

  console.log(typeof inner === 'function');
  //false

  var inner = function () {
    console.log('I\'m not hoisted at the top');
  };

  //function inner is in scope here
  // it could be invoked at this place
  inner();
  console.log(typeof inner === 'function');
  //true
}

outer();
```

## Invocation Context(=this)

### Function Invocation

```javascript
//this function returns the word boundaries of a string
//\w to \W or \W to \w transition is a word boundary
function wordBoundaries(subject) {
  //regex for word boundary position
  var pattern = /\b/g;

  //invoke match method defined on the string
  return subject.match(pattern).length;
}

var book = 'JavaScript Closure in Depth';
console.log(wordBoundaries(book)); //8
```


## Method Invocation

```javascript
//define cylinder object
var cylinder = {
  radius: 10,
  height: 20
};

/*
define function on cylinder object
volume is the property of cylinder object
this inside function is the cylinder object
this.radius means radius property of the cylinder object
this = invocation context = cylinder object
*/
cylinder.volume = function () {
  return Math.PI * Math.pow(this.radius, 2) * this.height;
};

//invoke the method on the cylinder object
console.log(cylinder.volume());
```


## Constructor Invocation

```javascript
//This is a constructor function
//Accepts 2 arguments and set the newly created object's properties
//this or invocation context is the newly created cylinder object
function Cylinder(radius, height) {
  this.radius = radius; //object property
  this.height = height; //object property
  //object method
  this.volume = function () {
    return Math.PI * Math.pow(this.radius, 2) * this.height;
  };
}

//create object using constructor function
//this inside constructor = cylinder1
var cylinder1 = new Cylinder(10, 20);
console.log(cylinder1.volume());

//create another object
//this inside constructor = cylinder2
var cylinder2 = new Cylinder(20, 10);
console.log(cylinder2.volume());
```

### Using Prototype Object

```javascript
//This is a constructor function
//Accepts 2 arguments and set the newly created object's properties
//this or invocation context is the newly created cylinder object
function Cylinder(radius, height) {
  this.radius = radius; //object property
  this.height = height; //object property
}

//now volume method is defined on the prototype object
//prototype object is the property defined on Cylinder constructor
Cylinder.prototype.volume = function () {
  return Math.PI * Math.pow(this.radius, 2) * this.height;
};

//create object using constructor function
//this inside constructor = cylinder1
var cylinder1 = new Cylinder(10, 20);
console.log(cylinder1.volume());

//create another object
//this inside constructor = cylinder2
var cylinder2 = new Cylinder(20, 10);
console.log(cylinder2.volume());
```


## Indirect Invocation

### Call Method

```javascript
//This is a function that returns the circumference of a circle
//this keyword is not associated with any object
var circumference = function () {
  return 2 * Math.PI * this.radius;
};
//define circle objects
var circle1 = {x: 100, y: 200, radius: 50};
var circle2 = {x: 200, y: 300, radius: 25};

//invoke the function
//this = circle1
console.log(circumference.call(circle1)); //314.159
//this = circle2
console.log(circumference.call(circle2)); //157.079
```

### Apply Method

```javascript
//this function makes all arguments non enumerable
var makeNonEnumerable = function () {
  //iterate over all arguments and change the enumerable attribute false
  for (var i=0; i < arguments.length; i++){
    Object.defineProperty(this,arguments[i],{enumerable:false});
  }
};

var testObject1 = {x:1,y:2,z:3};

//make x and y property non enumerable
//We pass individual argument instead of array
makeNonEnumerable.call(testObject1,"x","y");
//check the enumerable attribute by console.log
Object.getOwnPropertyDescriptor(testObject1, 'x').enumerable; //false
Object.getOwnPropertyDescriptor(testObject1, 'y').enumerable; //false
Object.getOwnPropertyDescriptor(testObject1, 'z').enumerable; //true

var testObject2 = {p:1,q:2,r:3};
//We pass array instead of individual argument
makeNonEnumerable.apply(testObject2,['p', 'q']);
Object.getOwnPropertyDescriptor(testObject2, 'p').enumerable; //false
Object.getOwnPropertyDescriptor(testObject2, 'q').enumerable; //false
Object.getOwnPropertyDescriptor(testObject2, 'r').enumerable; //true

var property;
for(property in testObject1){
  console.log(property);
}
```

### Testing Enumerability


### Call Method - Search Binary Numbers

```javascript
/*
this function finds all binary numbers inside a string
regex pattern checks digit (0 or 1) one or more times between word boundaries
\b -> word boundary
+ -> repeat 1 or more time - you can make it lazy by +?
[01]+ -> repeat 0 or 1 one or more time
g -> global match
match method -> return an array with all matches
*/

function binaryNumbers() {
  var pattern = /\b[01]+\b/g;
  //this keyword is not associated with any object
  this.result = this.subject.match(pattern);
}

//create 2 objects
var object1 = {subject: '100 1234 1010 string'},
  object2 = {subject: '1234 1112 1010 string'};

//associate this with object1
//this.result will set result property on object1
binaryNumbers.call(object1);

//associate this with object2
//this.result will set result property on object2
binaryNumbers.call(object2);

//query result property on object1
console.log(object1.result); //[ '100', '1010' ]

//query result property on object2
console.log(object2.result); // [ '1010' ]
```
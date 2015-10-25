# Minim Typed

This library is for annotating functions using Refract. The idea is the provide types for both the inputs and outputs for a given function and check those types when the function is executed.

## Install

This library is a plugin for Minim and requires Minim to be installed.

```sh
npm install minim-typed
```

## Loading Plugin

This plugin is loaded like any Minim plugin would be loaded.

```js
var minim = require('minim');
var minimTyped = require('minim-typed');

// Load the plugin
var namespace = minim.namespace().use(minimTyped);
```

## Usage

All functions for typed Minim are added to the namespace instance.

### Checking a Value

The default function is the identity function. This means if you want to check the type of a value, you need to annotate both the input and output of that value as being the same type. Once this is done, you can check the type of simple values.

```js
var stringChecker = namespace.typed.build({
  // string -> string
  annotations: [
    {element: 'string'},
    {element: 'string'},
  ],
});

stringChecker('foobar'); // Returns 'foobar'
stringChecker(1000); // Throws TypeError
```

### Annotating Functions

Typed Minim is only used for annotating functions, and though the identity function is default, you may provide any function you like.

```js
var sum = namespace.typed.build({
  // array[number] -> number
  annotations: [
    {element: 'array', content: [{element: 'number'}]},
    {element: 'number'},
  ],

  fn: function(numbers) {
    return numbers.reduce(function sumFn(total, number) {
      return total + number;
    });
  },
});

sum([1, 2, 3]); // Returns 6
sum(['a', 'b', 'c']); // Throws TypeError
```

## Advanced Example

This solves question one of Project Euler with typed functions.

> Find the sum of all the multiples of 3 or 5 below 1000.

```js
var _ = require('lodash');
var minim = require('minim');
var minimTyped = require('./lib/typed');

var namespace = minim.namespace().use(minimTyped);

var divBy = namespace.typed.build({
  // number number -> boolean
  annotations: [
    {element: 'number'},
    {element: 'number'},
    {element: 'boolean'}
  ],

  fn: function(x, y) { return (x % y) === 0; }
});

var divBy3or5 = namespace.typed.build({
  // number -> boolean
  annotations: [
    {element: 'number'},
    {element: 'boolean'}
  ],

  fn: function(x) {
    var result = divBy(x, 3) || divBy(x, 5);
    return result;
  }
});

var sum = namespace.typed.build({
  // array[number] -> number
  annotations: [
    {element: 'array', content: [{element: 'number'}]},
    {element: 'number'},
  ],

  fn: function(numbers) {
    return numbers.reduce(function(total, number) {
      return total + number;
    });
  }
});

var take = namespace.typed.build({
  // number -> array
  annotations: [
    {element: 'number'},
    {element: 'array'},
  ],

  // Just wrapping Lodash's range function
  fn: _.range
});

var answer = sum(take(1000).filter(function(number) {
  return divBy3or5(number)
}));

console.log(answer);
```

## License

This [code is licensed](./LICENSE) under the MIT license.

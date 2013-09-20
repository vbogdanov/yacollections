/* global describe: false */
/* global it: false */
/* global expect: false */
/* global beforeEach: false */
/* global jasmine: false */
/* jshint maxstatements: 30 */
var HashMap = require('../lib/collections.js').Map;
var hashes = require('hashes');
var hashtbl2 = require('hashtbl2');
var Ht = require('ht');
var es6 = require('es6-collections');

describe('Map performance test', function (argument) {
  'use strict';
  var hashMap;
  
  function SimpleObject(x) {
    this.x = x + '';
  }
  
  SimpleObject.prototype.toString = function () {
    return this.x;
  };

  beforeEach(function() {
    this.addMatchers({
      toExecIn: function(expected, times) {
        times = times || 10000;
        var code = this.actual;
        var t = process.hrtime();
        for (var i = 0; i < times; i ++) {
          code(i);
        }
        var actual = process.hrtime(t);
        console.log(this.spec.description, 'expected execution in', expected, '. Actual execution time:', actual);
        return actual[0] < expected[0] || actual[0] === expected[0] && actual[1] <= expected[1];
      }
    });

    hashMap = new HashMap({equalsFn: function (obj1, obj2) {
      return obj1.x === obj2.x;
    }});
  });

  it('works with the new matcher', function () {
    expect(function () {
      
    }).toExecIn([0, 100000000]);
  });

  it('executes sets and gets with a simple object key', function () {
    expect(function (i) {
      hashMap.set(new SimpleObject(i), i);
    }).toExecIn([0, 100000000]);
    expect(function (i) {
      hashMap.get(new SimpleObject(i));
    }).toExecIn([0, 100000000]);
  });

  it('executes sets and gets with a simple object key', function () {
    expect(function (i) {
      hashMap.set(i, i);
    }).toExecIn([0, 100000000]);
    expect(function (i) {
      hashMap.get(i);
    }).toExecIn([0, 100000000]);
  });
  
  it('hashes checks: set, get for object; set,get for int', function () {
    var hashMap = new hashes.HashTable({equal: function (obj1, obj2) {
      return obj1.x === obj2.x;
    }});

    expect(function (i) {
      hashMap.add(new SimpleObject(i), i);
    }).toExecIn([0, 100000000]);

    expect(function (i) {
      hashMap.get(new SimpleObject(i));
    }).toExecIn([0, 100000000]);
  });

  it('hashes checks: executes sets and gets with a simple object key', function () {
    var hashMap = new hashes.HashTable({equal: function (obj1, obj2) {
      return obj1.x === obj2.x;
    }});

    expect(function (i) {
      hashMap.add(i, i);
    }).toExecIn([0, 100000000]);
    expect(function (i) {
      hashMap.get(i);
    }).toExecIn([0, 100000000]);
  });

  it('hashtbl2 checks: set,get for int', function () {
    var hashMap = new hashtbl2.HashTbl({
      hash:function (obj) {
        return obj+ '';
      },
      equal: function (obj1, obj2) {
        return obj1 === obj2;
      }
    });

    expect(function (i) {
      hashMap.put(i, i);
    }).toExecIn([0, 100000000]);

    expect(function (i) {
      hashMap.get(i);
    }).toExecIn([0, 100000000]);
  });

  it('Ht checks: set,get for int', function () {
    var hashMap = new Ht();

    expect(function (i) {
      hashMap.put(i, i);
    }).toExecIn([0, 100000000]);

    expect(function (i) {
      hashMap.get(i);
    }).toExecIn([0, 100000000]);
  });

  function Person(first, last){
    this.firstName = first;
    this.lastName = last;
  }
  Person.prototype.hashCode = function(){
    return this.firstName + this.lastName;
  }

  it('Ht checks: set,get for object', function () {
    var hashMap = new Ht();
    var objs = new Array(10000);
    for (var i = 0; i < 10000; i ++) {
      objs[i] = new Person (i, '');
    }

    expect(function (i) {
      objs[i];
    }).toExecIn([0, 100000000]);

    expect(function (i) {
      hashMap.put(objs[i], i);
    }).toExecIn([0, 100000000]);

    expect(function (i) {
      hashMap.get(objs[i]);
    }).toExecIn([0, 100000000]);
  });

  it('es6 checks: set,get for object', function () {
    var hashMap = new es6.Map();
    var objs = new Array(10000);
    for (var i = 0; i < 10000; i ++) {
      objs[i] = new Person (i, '');
    }

    expect(function (i) {
      hashMap.set(objs[i], i);
    }).toExecIn([1, 100000000]);

    expect(function (i) {
      hashMap.get(objs[i]);
    }).toExecIn([1, 100000000]);
  });

  var withDifferentCount = function (count) {
    return function () {
      expect(function (i) {
        hashMap.set(i, i);
      }).toExecIn([3, 100000000], count);
      expect(function (i) {
        hashMap.get(i);
      }).toExecIn([3, 100000000], count);

      hashMap = new hashes.HashTable({equal: function (obj1, obj2) {
        return obj1.x === obj2.x;
      }});

      expect(function (i) {
        hashMap.add(i, i);
      }).toExecIn([3, 100000000], count);
      expect(function (i) {
        hashMap.get(i);
      }).toExecIn([3, 100000000], count);
    };
  }
   
  it('small number of items comparison: collections.Map with hashes.HashTable', withDifferentCount(100));
  it('large number of items comparison: collections.Map with hashes.HashTable', withDifferentCount(1000000));
});
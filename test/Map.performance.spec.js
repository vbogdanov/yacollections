/* global describe: false */
/* global xdescribe: false */
/* global it: false */
/* global expect: false */
/* global beforeEach: false */
/* global jasmine: false */
/* jshint maxstatements: 30 */
var HashMap = require('../src/collections.js').Map;
var hashes = require('hashes');
var hashtbl2 = require('hashtbl2');
var Ht = require('ht');
var es6 = require('es6-collections');

xdescribe('Map/HashTable performance', function (argument) {
  'use strict';
    
  function SimpleObject(x) {
    this.x = x + '';
  }
  
  SimpleObject.prototype.toString = function () {
    return this.x;
  };
  SimpleObject.prototype.hashCode = function () {
    return this.x;
  };

  SimpleObject.prototype.equals = function (obj) {
    return this.x === obj.x;
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
    
  });

  it('works with the new matcher', function () {
    expect(function () {
      
    }).toExecIn([0, 100000000]);
  });

  testAll(100);
  testAll(10000);
  testAll(100000);

  function testAll(times) {
    it('sets and gets of primitives for collections ' + times + ' times', function () {
      var hashMap = new HashMap();

      expect(function (i) {
        hashMap.set(i, i);
      }).toExecIn([1, 100000000], times);
      expect(function (i) {
        hashMap.get(i);
      }).toExecIn([1, 100000000], times);
    });

    it('sets and gets of objects for collections ' + times + ' times', function () {
      var hashMap = new HashMap();
      
      expect(function (i) {
        hashMap.set(new SimpleObject(i), i);
      }).toExecIn([1, 100000000], times);
      expect(function (i) {
        hashMap.get(new SimpleObject(i));
      }).toExecIn([1, 100000000], times);
    });

    it('sets and gets of primitives for hashes ' + times + ' times', function () {
      var hashMap = new hashes.HashTable();

      expect(function (i) {
        hashMap.add(i, i);
      }).toExecIn([1, 100000000], times);
      expect(function (i) {
        hashMap.get(i);
      }).toExecIn([1, 100000000], times);
    });

    it('sets and gets of objects for hashes ' + times + ' times', function () {
      var hashMap = new hashes.HashTable({equal: function (obj1, obj2) {
        return obj1.x === obj2.x;
      }});
      
      expect(function (i) {
        hashMap.add(new SimpleObject(i), i);
      }).toExecIn([1, 100000000], times);
      expect(function (i) {
        hashMap.get(new SimpleObject(i));
      }).toExecIn([1, 100000000], times);
    });

    it('sets and gets of primitives for hashtbl2 ' + times + ' times', function () {
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
      }).toExecIn([1, 100000000], times);
      expect(function (i) {
        hashMap.get(i);
      }).toExecIn([1, 100000000], times);
    });

    it('sets and gets of objects for hashtbl2 ' + times + ' times', function () {
      var hashMap = new hashtbl2.HashTbl({
        hash:function (obj) {
          return obj.x;
        },
        equal: function (obj1, obj2) {
          return obj1.x === obj2.x;
        }
      });
      
      expect(function (i) {
        hashMap.put(new SimpleObject(i), i);
      }).toExecIn([1, 100000000], times);
      expect(function (i) {
        hashMap.get(new SimpleObject(i));
      }).toExecIn([1, 100000000], times);
    });

    it('sets and gets of primitives for ht ' + times + ' times', function () {
      var hashMap = new Ht();

      expect(function (i) {
        hashMap.put(i, i);
      }).toExecIn([1, 100000000], times);
      expect(function (i) {
        hashMap.get(i);
      }).toExecIn([1, 100000000], times);
    });

    it('sets and gets of objects for ht ' + times + ' times', function () {
      var hashMap = new Ht();
      
      expect(function (i) {
        hashMap.put(new SimpleObject(i), i);
      }).toExecIn([1, 100000000], times);
      expect(function (i) {
        hashMap.get(new SimpleObject(i));
      }).toExecIn([1, 100000000], times);
    });

    it('sets and gets of primitives for es6 ' + times + ' times', function () {
      var hashMap = new es6.Map();

      expect(function (i) {
        hashMap.set(i, i);
      }).toExecIn([1, 100000000], times);
      expect(function (i) {
        hashMap.get(i);
      }).toExecIn([1, 100000000], times);
    });

    it('sets and gets of objects for es6 ' + times + ' times', function () {
      var hashMap = new es6.Map();
      
      expect(function (i) {
        hashMap.set(new SimpleObject(i), i);
      }).toExecIn([1, 100000000], times);
      expect(function (i) {
        hashMap.get(new SimpleObject(i));
      }).toExecIn([1, 100000000], times);
    });

    it('sets and gets of primitives for simphony Map ' + times + ' times', function () {
      var hashMap = new Map();

      expect(function (i) {
        hashMap.set(i, i);
      }).toExecIn([1, 100000000], times);
      expect(function (i) {
        hashMap.get(i);
      }).toExecIn([1, 100000000], times);
    });

    it('sets and gets of objects for simphony Map ' + times + ' times', function () {
      var hashMap = new Map();
      
      expect(function (i) {
        hashMap.set(new SimpleObject(i), i);
      }).toExecIn([1, 100000000], times);
      expect(function (i) {
        hashMap.get(new SimpleObject(i));
      }).toExecIn([1, 100000000], times);
    });

  }
  
});
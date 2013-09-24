(function () {
  'use strict';
  
  var HMap = require('../lib/collections').Map;
  var SafeMap = require('safemap');

  var COUNT = 10000;
  function run10000times(descr, cb) {
    var t1 = process.hrtime();
    for(var i = 0; i < COUNT; i++) {
      cb(i);
    }
    var result = process.hrtime(t1);
    console.log(descr, result);
    return result;
  }

  
  function nothing(object) {}

  function Person(name) {
    this.name = name;
  }
  Person.prototype.hashCode = function () {
    return this.name;
  };
  
  Person.prototype.equals = function(obj) {
    return obj === this || obj && obj.name === this.name;
  };
 
  // var map = new HMap();
  var map = new HMap();

  run10000times('construct objects', function (i) {
    nothing(new Person('pier' + i));
  });

  var s1 = run10000times('sets', function (i) {
    map.set(new Person('pier' + i), i);
  });


  var g1 = run10000times('gets', function (i) {
    map.get(new Person('pier' + i));
  });

  var sf = new SafeMap();

  var s2 = run10000times('safemap sets', function (i) {
    sf.set('pier' + i, i);
  });

  var g2 = run10000times('safemap gets', function (i) {
    sf.get('pier' + i);
  });

  console.log('delta set', s1[1] - s2[1]);
  console.log('delta get', g1[1] - g2[1]);
  
})();
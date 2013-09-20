var Map = require('../lib/collections.js').Map;

describe('Map performance test', function (argument) {
        
  it('speed test', function () {
    var hashMap = new Map({equalsFn: function (obj1, obj2) {
      return obj1.x === obj2.x;
    }});
    for (var i = 0; i < 10000; i ++) {
      hashMap.set({
        x: i + '',
        toString: function () {
          return this.x;
        }
      }, i);  
    }
    
    var result = hashMap.get({
      x: '5000',
      toString: function () {
        return '5000'
      }
    });

    expect(result).toBe(5000);

    for (var j = 0; j < 10000; j++){
      var result = hashMap.get({
        x: j + '',
        toString: function () {
          return this.x;
        }
      }); 
      console.log(j, result);
      expect(result).toEqual(j);
    }
  });
});
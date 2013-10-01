/* global describe: false */
/* global it: false */
/* global expect: false */
/* global beforeEach: false */
/* global jasmine: false */
/* jshint maxstatements: 30 */
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['src/collections'], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require('../src/collections'));
  } else {
    // Browser globals (root is window)
    root.spec = root.spec || {};
    root.spec.Map = factory(root.collections);
  }
})(this, function(collections) {
'use strict';

var Map = collections.Map;
describe('Map', function () {
  it('is created using "new Map()"', function () {
    expect(function () {
      expect(new Map()).toEqual(jasmine.any(Map));
    }).not.toThrow();
  });

  describe(' while empty', function () {
    var FOO = Object.freeze({ key: 'something' });
    var BAZ = Object.freeze({ value: 5 });
    var BAR = 5; //not there key
    var GAS = Object.freeze({ toString: function () { return 'GAS'; } });
    var map;

    beforeEach(function () {
      map = new Map();
    });

    it('has all the methods: has, get, set, remove, clear, size and forEach', function () {
      expect(map.has).toBeTruthy();
      expect(map.get).toBeTruthy();
      expect(map.set).toBeTruthy();
      expect(map.remove).toBeTruthy();
      expect(map.clear).toBeTruthy();
      expect(map.size).toBeTruthy();
      expect(map.forEach).toBeTruthy();
    });

    it('works for "0" hash codes', function () {
      map.set('0', 0);
      expect(map.get('0')).toBe(0);
    });

    it('works for "" hash codes', function () {
      map.set('', 0);
      expect(map.get('')).toBe(0);
    });

    checkMapBehavior([], FOO);

    describe('a pair is added', function () {
      beforeEach(function () {
        map.set(FOO, BAZ);
      });
      checkMapBehavior([[FOO, BAZ]], BAR);

      describe('and cleared', function () {
        beforeEach(function () {
          map.clear();
        });
        checkMapBehavior([], FOO);
      });

      describe('and removed FOO key', function () {
        beforeEach(function () {
          map.remove(FOO);
        });
        checkMapBehavior([], FOO);
      });

      describe('and added another pair - BAR=>GAS', function () {
        beforeEach(function () {
          map.set(BAR, GAS);
        });
        checkMapBehavior([[FOO, BAZ], [BAR, GAS]], BAZ);
        describe('and cleared', function () {
          beforeEach(function () {
            map.clear();
          });
          checkMapBehavior([], FOO);
        });

        describe('and removed FOO key', function () {
          beforeEach(function () {
            map.remove(FOO);
          });
          checkMapBehavior([[BAR, GAS]], FOO);
        });
      });

    });

    function checkMapBehavior(expectedContents, notPresentKey) {
      it('has no not present key', function () {
        expect(map.has(notPresentKey)).toBe(false);
      });

      it('gets undefined for not present key', function () {
        expect(map.get(notPresentKey)).toBeUndefined();
      });

      it('can set a key->value pair, that does not exist', function () {
        expect(function () {
          map.set(notPresentKey, 'value');
        }).not.toThrow();
      });

      it('removes not existent keys without any effect', function () {
        var removed;
        expect(function () {
          removed = map.remove(notPresentKey);
        }).not.toThrow();
        expect(removed).not.toBeDefined();
      });

      it('clears clean maps', function () {
        expect(function () {
          map.clear();
        }).not.toThrow();
      });

      for (var contentIndex = 0; contentIndex < expectedContents.length; contentIndex ++) {
        var presentKey = expectedContents[contentIndex][0];
        var value = expectedContents[contentIndex][1];
        
        it('has present key', function () {
          expect(map.has(presentKey)).toBe(true);
        });

        it('gets value for present key', function () {
          expect(map.get(presentKey)).toEqual(value);
        });

        it('can set a new value for a key that exists', function () {
          expect(function () {
            map.set(presentKey, 'value');
          }).not.toThrow();
        });

        it('removes existing entries returning the value of the entry', function () {
          var removed = map.remove(presentKey);
          expect(removed).toBe(value);
        });

        it('clears dirty maps as well', function () {
          expect(function () {
            map.clear();
          }).not.toThrow();
        });
      }
      
      it('measures the size of contents (count of entries)', function () {
        expect(map.size()).toBe(expectedContents.length);
      });
      
      it('iterates forEach entry', function () {
        var callback = jasmine.createSpy('forEach callback');
        expect(function () {
          map.forEach(callback);
        }).not.toThrow();
        if (expectedContents.length === 0) {
          expect(callback).not.toHaveBeenCalled();  
        } else {
          expect(callback).toHaveBeenCalled();
          expect(callback.calls.length).toEqual(expectedContents.length);
          for (var i = 0; i < expectedContents.length; i ++) {
            expect(callback).toHaveBeenCalledWith(expectedContents[i][0], expectedContents[i][1]);
          }
        }
      });
    }
    
  });
});

});
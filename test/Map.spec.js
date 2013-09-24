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

    function checkEmptyMapBehavior() {
      it('returns false on has', function () {
          expect(map.has(FOO)).toBe(false);
        });

        it('returns undefined on get', function () {
          expect(map.get(FOO)).toBeUndefined();
        });

        it('can set a key->value pair', function () {
          expect(function () {
            map.set(FOO, 'value');
          }).not.toThrow();
        });

        it('can call remove without any effect', function () {
          var removed;
          expect(function () {
            removed = map.remove(FOO);
          }).not.toThrow();
          expect(removed).not.toBeDefined();
        });

        it('can clear', function () {
          expect(function () {
            map.clear();
          }).not.toThrow();
        });

        it('has a size of 0', function () {
          expect(map.size()).toBe(0);
        });

        it('can call forEach, but the callback will not be invoked', function () {
          var callback = jasmine.createSpy('forEach callback');
          expect(function () {
            map.forEach(callback);
          }).not.toThrow();
          expect(callback).not.toHaveBeenCalled();
        });
    }
    checkEmptyMapBehavior();

    describe(' a pair is added ', function () {
      var BAZ = Object.freeze({ value: 5 });
      var BAR = 5; //not there key
      beforeEach(function () {
        map.set(FOO, BAZ);
      });

      it('returns true on has for FOO, false on others', function () {
        expect(map.has(FOO)).toBe(true);
        expect(map.has(BAR)).toBe(false);
      });

      it('returns the BAZ on get(FOO), undefined otherwise', function () {
        expect(map.get(FOO)).toBe(BAZ);
        expect(map.get(BAR)).toBeUndefined();
      });

      it('can set a key->value pair', function () {
        expect(function () {
          map.set(BAR, 'value');
        }).not.toThrow();
      });

      it('can remove FOO=>BAZ from the map', function () {
        var removed;
        expect(function () {
          removed = map.remove(FOO);
        }).not.toThrow();
        expect(removed).toBe(BAZ);
        expect(map.get(FOO)).toBeUndefined();
      });

      it('can clear the map', function () {
        expect(function () {
          map.clear();
        }).not.toThrow();
        expect(map.size()).toBe(0); //nothing left in the map
      });

      it('has a size of 1', function () {
        expect(map.size()).toBe(1);
      });

      it('can call forEach, and the callback is invoked once with FOO, BAZ', function () {
        var callback = jasmine.createSpy('forEach callback');
        expect(function () {
          map.forEach(callback);
        }).not.toThrow();
        expect(callback.calls.length).toEqual(1);
        expect(callback).toHaveBeenCalledWith(FOO, BAZ);
      });

      describe(' and cleared afterwards ', function () {
        beforeEach(function () {
          map.clear();
        });
        checkEmptyMapBehavior();
      });

      describe(' and removed FOO ', function () {
        beforeEach(function () {
          map.remove(FOO);
        });
        checkEmptyMapBehavior();
      });

      describe('and added another pair - BAR=>GAS', function () {
        var GAS = Object.freeze({ toString: function () { return 'GAS'; } });
        beforeEach(function () {
          map.set(BAR, GAS);
        });

        it('returns true on has for FOO, BAR, false on others', function () {
          expect(map.has(FOO)).toBe(true);
          expect(map.has(BAR)).toBe(true);
          expect(map.has(BAZ)).toBe(false);
        });

        it('returns the BAZ on get(FOO), undefined otherwise', function () {
          expect(map.get(FOO)).toBe(BAZ);
          expect(map.get(BAR)).toBe(GAS);
          expect(map.get(BAZ)).toBeUndefined();
        });

        it('can set a key->value pair', function () {
          expect(function () {
            map.set(GAS, 'value');
          }).not.toThrow();

          expect(function () {
            map.set(BAR, BAZ);
          }).not.toThrow();
        });

        it('can remove FOO=>BAZ from the map', function () {
          var removed;
          expect(function () {
            removed = map.remove(FOO);
          }).not.toThrow();
          expect(removed).toBe(BAZ);
          expect(map.get(BAR)).toBe(GAS);
          expect(map.get(FOO)).toBeUndefined();
        });

        it('can clear the map', function () {
          expect(function () {
            map.clear();
          }).not.toThrow();
          expect(map.size()).toBe(0); //nothing left in the map
        });

        it('has a size of 1', function () {
          expect(map.size()).toBe(2);
        });

        it('can call forEach, and the callback is invoked once with FOO, BAZ', function () {
          var callback = jasmine.createSpy('forEach callback');
          expect(function () {
            map.forEach(callback);
          }).not.toThrow();
          expect(callback.calls.length).toEqual(2);
          expect(callback).toHaveBeenCalledWith(FOO, BAZ);
          expect(callback).toHaveBeenCalledWith(BAR, GAS);
        });

      });
    });
  });
});

});
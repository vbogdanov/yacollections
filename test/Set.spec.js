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
    root.spec.Set = factory(root.collections);
  }
})(this, function(collections) {
  'use strict';
  var Set = collections.Set;
  //items for the test
  function Item(name) {
    this.name = name;
  }
  Item.prototype.hashCode = function () {
    return this.name;
  };
  Item.prototype.toString = function () {
    return this.name;
  };
  var FOO = new Item('FOO');
  var BAR = new Item('BAR');

  //and the actual test
  describe('Set', function () {
    it('is a function', function () {
      expect(Set).toEqual(jasmine.any(Function));
    });

    it('creates a Set using new', function () {
      expect(new Set()).toEqual(jasmine.any(Set));
    });

    describe('instance', function () {
      var _set;
      beforeEach(function () {
        _set = new Set();
      });

      it('has a "has" method', function () {
        expect(_set.has).toEqual(jasmine.any(Function));
      });

      it('has a "add" method', function () {
        expect(_set.add).toEqual(jasmine.any(Function));
      });
      it('has a "remove" method', function () {
        expect(_set.remove).toEqual(jasmine.any(Function));
      });
      it('has a "clear" method', function () {
        expect(_set.clear).toEqual(jasmine.any(Function));
      });
      it('has a "size" method', function () {
        expect(_set.size).toEqual(jasmine.any(Function));
      });

      itIsEmptySet();

      function itIsEmptySet() {
        it('has no FOO or BAR', function () {
          expect(_set.has(FOO)).toBe(false);
          expect(_set.has(BAR)).toBe(false);
        });

        it('can add FOO and BAR', function () {
          expect(function () {
            _set.add(FOO);
            _set.add(BAR);
          }).not.toThrow();
        });

        it('can attempt removal without exception', function () {
          expect(function () {
            _set.remove(FOO);
          }).not.toThrow();
        });

        it('expect clear not to throw', function () {
          expect(function () {
            _set.clear();
          }).not.toThrow();
        });

        it('expect size to be 0', function () {
          expect(_set.size()).toBe(0);
        });
      }
    });
  });

  



});
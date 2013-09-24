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
    root.spec.List = factory(root.collections);
  }
})(this, function(collections) {
  'use strict';

  describe('List', function () {
    var List = collections.List;

    it('is a function', function () {
      expect(List).toEqual(jasmine.any(Function));
    });
    
    it('creates an object using new', function () {
      expect(new List()).toEqual(jasmine.any(List));
    });


    describe('instance', function () {
      var list;
      beforeEach(function () {
        list = new List();
      });

      it('has a remove method', function () {
        expect(list.remove).toEqual(jasmine.any(Function));
      });

      describe('with FOO added', function () {
        var FOO = {};
        beforeEach(function () {
          list.push(FOO);
        });

        it('has a length of 1', function () {
          expect(list.length).toBe(1);
        });

        it('has a [0] element FOO', function () {
          expect(list[0]).toBe(FOO);
        });

        it('remove FOO without exception', function () {
          expect(function () {
            list.remove(FOO);
          }).not.toThrow();
        });

        describe('and FOO removed', function () {
          beforeEach(function () {
            list.remove(FOO);
          });

          expect('has a length of 0', function () {
            expect(list.length).toBe(0);
          });
        });
      });
    });

  });

});
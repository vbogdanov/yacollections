(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['safemap'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('safemap'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.safemap);
    }
})(this, 
//actual module
function (SafeMap) {
    'use strict';

    //use this function to check for equality if no other equalFn is passed
    function DefaultEquals (obj1, obj2) {
        return obj1 === obj2 || 
            obj1 && obj1.equals && obj1.equals(obj2);
    }

    //use this function to calculate hash code if no other is present
    function DefaultHashCode (object) {
        return (object.hashCode && object.hashCode()) || 
            (object.toString && object.toString()) ||
            ('' + object);
    } 

    //Map constructor
    function Map (options) {

        function Entry (key, value) {
            this.key = key;
            this.value = value;
        }
        var EMPTY_LIST = new List();

        options = options || {};
        var hashFn = options.hashFn || DefaultHashCode;
        var equalsFn = options.equalsFn || DefaultEquals;

        var data = new SafeMap();

        function search(key, isCheckOnly) {
            var hash = hashFn(key);
            var list = data.get(hash, false);
            if (list === false) {
                if (isCheckOnly) {
                    return false;
                } else {
                    list = [];
                    data.set(hash, list);
                }
            }
                
            for (var i = list.length - 1; i >= 0; i --) {
                var entry = list[i];
                if(equalsFn(entry.key, key)) {
                    return { 'entry': entry, 'list': list, 'index': i };
                }
            }
            return {
                'list': list,
                'index': -1
            };
        }

        function matcher(key) {
            return function (entry) {
                return equalsFn(key, entry.key);
            };
        }

        this.has = function has (key) {
            var hash = hashFn(key);
            return data.has(hash) && data.get(hash).containsMatch(matcher(key));
        };

        this.get = function get (key, defaultVal) {
            var hash = hashFn(key);
            defaultVal = defaultVal || null;
            var entry = data.get(hash, EMPTY_LIST).getMatch(matcher(key));
            return entry? entry.value: defaultVal;
        };

        this.set = function set(key, value) {
            var hash = hashFn(key);
            var list = data.get(hash);
            if (typeof list === 'undefined') {
                list = new List();
                data.set(hash, list);
            } else {
                list.removeMatch(matcher(key));    
            }
            list.push(new Entry(key, value));
        };

        this.remove = function remove(key) {
            var hash = hashFn(key);
            var list = data.get(hash, new List());
            var removed = list.removeMatch(matcher(key));
            if (list.length === 0) {
                data.remove(hash);
            }
            return removed && removed.value;
        };

        this.clear = function clear() {
            data.clear();
        };

        this.size = function size() {
            var count = 0;
            data.forEach(function (key, value) {
                count += value.length;
            });
            return count;
        };

        this.forEach = function forEach(callback) {
            data.forEach(function (key, value) {
                for (var i = 0; i < value.length; i++) {
                    var entry = value[i];
                    callback(entry.key, entry.value);
                }
            });
        };
    }

    function Set(options) {
        var map = new Map(options);

        this.has = map.has.bind(map);
        this.add = function (key) {
            map.set(key, true);
        };

        this.remove = map.remove.bind(map);
        this.clear = map.clear.bind(map);
        this.size = map.size.bind(map);
    }

    var List = (function () {
        //List constructor
        function List() {
        }
        List.prototype = Object.create(Array.prototype);

        List.prototype.contains = function (object, equalsFn) {
            equalsFn = equalsFn || DefaultEquals;
            return this.containsMatch(function (value) {
                return equalsFn(object, value);
            });
        };

        List.prototype.match = function (matchFn, foundFn, notFoundValue) {
            for (var i = 0; i < this.length; i ++)
                if(matchFn(this[i], i, this))
                    return foundFn(this[i], i, this);
            return notFoundValue;
        };

        function containsFound() {
            return true;
        }
        List.prototype.containsMatch = function (matchFn) {
            return this.match(matchFn, containsFound, false);
        };


        function getFound(v) {
            return v;
        }
        List.prototype.getMatch = function (matchFn) {
            return this.match(matchFn, getFound);
        };

        function indexOfFound(v, i) {
            return i;
        }
        List.prototype.indexOfMatch = function (matchFn) {
            return this.match(matchFn, indexOfFound, -1);
        };

        List.prototype.removeMatch = function (matchFn) {
            var i = this.indexOfMatch(matchFn);
            return this.removeAtIndex(i);
        };

        List.prototype.removeAtIndex = function (index) {
            return (this.splice(index, 1))[0];
        };

        return List;
    })();

    return {
        Map: Map,
        List: List,
        Set: Set
    };
});
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
        root.collections = factory(root.SafeMap);
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
                    return { 'entry': entry, 'list': list, 'index': i, 'hash': hash };
                }
            }
            return {
                'list': list,
                'index': -1,
                'hash': hash
            };
        }

        this.has = function has (key) {
            var res = search(key, true);
            return res && res.index !== -1;
        };

        this.get = function get (key, defaultVal) {
            var res = search(key, true);
            if (!res || res.index === -1)
                return defaultVal;
            return res.entry.value;
        };

        this.set = function set(key, value) {
            var res = search(key, false);
            res.list.push(new Entry(key, value));
            //remove existing entries with equal key
            if (res.index !== -1)
                res.list.splice(res.index, 1);
        };

        this.remove = function remove(key) {
            var removed;
            var res = search(key, true);
            if (res) {
                if (res.index !== -1) {
                    removed = res.list.splice(res.index, 1)[0];
                }
                if (res.list.length === 0) {
                    data.remove(res.hash);
                }
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

        List.prototype.remove = function (item) {
            var index = this.indexOf(item);
            if (index !== -1)
                return this.splice(index, 1)[0];
            //else return undefined
        };

        return List;
    })();

    return {
        Map: Map,
        List: List,
        Set: Set
    };
});
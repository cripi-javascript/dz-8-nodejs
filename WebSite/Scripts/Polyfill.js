(function () {
    "use strict";
    /**
     * Полифил Object.create
     * @source https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
     */
    if (typeof Object.create !== 'function') {
        Object.create = function (o, props) {
            var prop;
            function F() {}
            F.prototype = o;
            if (typeof props === "object") {
                for (prop in props) {
                    if (props.hasOwnProperty((prop))) {
                        F[prop] = props[prop];
                    }
                }
            }
            return new F();
        };
    }
    /**
     * Полифил Array.forEach
     * @source https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
     */
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function forEach( callback, thisArg) {
            var T, k, O, len;
            if (this === null) {
                throw new TypeError("this is null or not defined");
            }
            O = Object(this);
            len = O.length >>> 0;
            if ({}.toString.call(callback) !== "[object Function]") {
                throw new TypeError(callback + " is not a function");
            }
            if (thisArg) {
                T = thisArg;
            }
            k = 0;
            while (k < len) {
                var kValue;
                if (Object.prototype.hasOwnProperty.call(O, k)) {
                    kValue = O[k];
                    callback.call(T, kValue, k, O);
                }
                k += 1;
            }
        };
    }
    /**
     * Полифил Array.some
     * @source https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/some
     */
    if (!Array.prototype.some) {
        Array.prototype.some = function (fun) {
            if (this === null) {
                throw new TypeError();
            }
            var t = Object(this),
                len = t.length >>> 0,
                thisp,
                i;
            if (typeof fun !== "function") {
                throw new TypeError();
            }
            thisp = arguments[1];
            for (i = 0; i < len; i += 1) {
                if (i in t && fun.call(thisp, t[i], i, t)) {
                    return true;
                }
            }
            return false;
        };
    }
    /**
     * Полифил Array.some
     * @source https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/filter
     */
    if (!Array.prototype.filter) {
        Array.prototype.filter = function (fun) {
            if (this === null) {
                throw new TypeError();
            }
            var t = Object(this),
                len = t.length >>> 0,
                res,
                thisp,
                i,
                val;
            if (typeof fun !== "function") {
                throw new TypeError();
            }
            res = [];
            thisp = arguments[1];
            for (i = 0; i < len; i += 1) {
                if (i in t) {
                    val = t[i]; // in case fun mutates this
                    if (fun.call(thisp, val, i, t)) {
                        res.push(val);
                    }
                }
            }
            return res;
        };
    }
}());
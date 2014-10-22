(function(definition) {
    if (typeof define == "function") {
        define(definition);
    } else if (typeof YUI == "function") {
        YUI.add("es5", definition);
    } else {
        definition();
    }
})(function() {
    function Empty() {}
    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) {
            var target = this;
            if (typeof target != "function") {
                throw new TypeError("Function.prototype.bind called on incompatible " + target);
            }
            var args = _Array_slice_.call(arguments, 1);
            var bound = function() {
                if (this instanceof bound) {
                    var result = target.apply(this, args.concat(_Array_slice_.call(arguments)));
                    if (Object(result) === result) {
                        return result;
                    }
                    return this;
                } else {
                    return target.apply(that, args.concat(_Array_slice_.call(arguments)));
                }
            };
            if (target.prototype) {
                Empty.prototype = target.prototype;
                bound.prototype = new Empty();
                Empty.prototype = null;
            }
            return bound;
        };
    }
    var call = Function.prototype.call;
    var prototypeOfArray = Array.prototype;
    var prototypeOfObject = Object.prototype;
    var _Array_slice_ = prototypeOfArray.slice;
    var _toString = call.bind(prototypeOfObject.toString);
    var owns = call.bind(prototypeOfObject.hasOwnProperty);
    var defineGetter;
    var defineSetter;
    var lookupGetter;
    var lookupSetter;
    var supportsAccessors;
    if (supportsAccessors = owns(prototypeOfObject, "__defineGetter__")) {
        defineGetter = call.bind(prototypeOfObject.__defineGetter__);
        defineSetter = call.bind(prototypeOfObject.__defineSetter__);
        lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
        lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
    }
    if ([ 1, 2 ].splice(0).length != 2) {
        var array_splice = Array.prototype.splice;
        if (function() {
            function makeArray(l) {
                var a = [];
                while (l--) {
                    a.unshift(l);
                }
                return a;
            }
            var array = [], lengthBefore;
            array.splice.bind(array, 0, 0).apply(null, makeArray(20));
            array.splice.bind(array, 0, 0).apply(null, makeArray(26));
            lengthBefore = array.length;
            array.splice(5, 0, "XXX");
            if (lengthBefore + 1 == array.length) {
                return true;
            }
        }()) {
            Array.prototype.splice = function(start, deleteCount) {
                if (!arguments.length) {
                    return [];
                } else {
                    return array_splice.apply(this, [ start === void 0 ? 0 : start, deleteCount === void 0 ? this.length - start : deleteCount ].concat(_Array_slice_.call(arguments, 2)));
                }
            };
        } else {
            Array.prototype.splice = function(start, deleteCount) {
                var result, args = _Array_slice_.call(arguments, 2), addElementsCount = args.length;
                if (!arguments.length) {
                    return [];
                }
                if (start === void 0) {
                    start = 0;
                }
                if (deleteCount === void 0) {
                    deleteCount = this.length - start;
                }
                if (addElementsCount > 0) {
                    if (deleteCount <= 0) {
                        if (start == this.length) {
                            this.push.apply(this, args);
                            return [];
                        }
                        if (start == 0) {
                            this.unshift.apply(this, args);
                            return [];
                        }
                    }
                    result = _Array_slice_.call(this, start, start + deleteCount);
                    args.push.apply(args, _Array_slice_.call(this, start + deleteCount, this.length));
                    args.unshift.apply(args, _Array_slice_.call(this, 0, start));
                    args.unshift(0, this.length);
                    array_splice.apply(this, args);
                    return result;
                }
                return array_splice.call(this, start, deleteCount);
            };
        }
    }
    if ([].unshift(0) != 1) {
        var array_unshift = Array.prototype.unshift;
        Array.prototype.unshift = function() {
            array_unshift.apply(this, arguments);
            return this.length;
        };
    }
    if (!Array.isArray) {
        Array.isArray = function isArray(obj) {
            return _toString(obj) == "[object Array]";
        };
    }
    var boxedString = Object("a"), splitString = boxedString[0] != "a" || !(0 in boxedString);
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function forEach(fun) {
            var object = toObject(this), self = splitString && _toString(this) == "[object String]" ? this.split("") : object, thisp = arguments[1], i = -1, length = self.length >>> 0;
            if (_toString(fun) != "[object Function]") {
                throw new TypeError();
            }
            while (++i < length) {
                if (i in self) {
                    fun.call(thisp, self[i], i, object);
                }
            }
        };
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function map(fun) {
            var object = toObject(this), self = splitString && _toString(this) == "[object String]" ? this.split("") : object, length = self.length >>> 0, result = Array(length), thisp = arguments[1];
            if (_toString(fun) != "[object Function]") {
                throw new TypeError(fun + " is not a function");
            }
            for (var i = 0; i < length; i++) {
                if (i in self) result[i] = fun.call(thisp, self[i], i, object);
            }
            return result;
        };
    }
    if (!Array.prototype.filter) {
        Array.prototype.filter = function filter(fun) {
            var object = toObject(this), self = splitString && _toString(this) == "[object String]" ? this.split("") : object, length = self.length >>> 0, result = [], value, thisp = arguments[1];
            if (_toString(fun) != "[object Function]") {
                throw new TypeError(fun + " is not a function");
            }
            for (var i = 0; i < length; i++) {
                if (i in self) {
                    value = self[i];
                    if (fun.call(thisp, value, i, object)) {
                        result.push(value);
                    }
                }
            }
            return result;
        };
    }
    if (!Array.prototype.every) {
        Array.prototype.every = function every(fun) {
            var object = toObject(this), self = splitString && _toString(this) == "[object String]" ? this.split("") : object, length = self.length >>> 0, thisp = arguments[1];
            if (_toString(fun) != "[object Function]") {
                throw new TypeError(fun + " is not a function");
            }
            for (var i = 0; i < length; i++) {
                if (i in self && !fun.call(thisp, self[i], i, object)) {
                    return false;
                }
            }
            return true;
        };
    }
    if (!Array.prototype.some) {
        Array.prototype.some = function some(fun) {
            var object = toObject(this), self = splitString && _toString(this) == "[object String]" ? this.split("") : object, length = self.length >>> 0, thisp = arguments[1];
            if (_toString(fun) != "[object Function]") {
                throw new TypeError(fun + " is not a function");
            }
            for (var i = 0; i < length; i++) {
                if (i in self && fun.call(thisp, self[i], i, object)) {
                    return true;
                }
            }
            return false;
        };
    }
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function reduce(fun) {
            var object = toObject(this), self = splitString && _toString(this) == "[object String]" ? this.split("") : object, length = self.length >>> 0;
            if (_toString(fun) != "[object Function]") {
                throw new TypeError(fun + " is not a function");
            }
            if (!length && arguments.length == 1) {
                throw new TypeError("reduce of empty array with no initial value");
            }
            var i = 0;
            var result;
            if (arguments.length >= 2) {
                result = arguments[1];
            } else {
                do {
                    if (i in self) {
                        result = self[i++];
                        break;
                    }
                    if (++i >= length) {
                        throw new TypeError("reduce of empty array with no initial value");
                    }
                } while (true);
            }
            for (;i < length; i++) {
                if (i in self) {
                    result = fun.call(void 0, result, self[i], i, object);
                }
            }
            return result;
        };
    }
    if (!Array.prototype.reduceRight) {
        Array.prototype.reduceRight = function reduceRight(fun) {
            var object = toObject(this), self = splitString && _toString(this) == "[object String]" ? this.split("") : object, length = self.length >>> 0;
            if (_toString(fun) != "[object Function]") {
                throw new TypeError(fun + " is not a function");
            }
            if (!length && arguments.length == 1) {
                throw new TypeError("reduceRight of empty array with no initial value");
            }
            var result, i = length - 1;
            if (arguments.length >= 2) {
                result = arguments[1];
            } else {
                do {
                    if (i in self) {
                        result = self[i--];
                        break;
                    }
                    if (--i < 0) {
                        throw new TypeError("reduceRight of empty array with no initial value");
                    }
                } while (true);
            }
            do {
                if (i in this) {
                    result = fun.call(void 0, result, self[i], i, object);
                }
            } while (i--);
            return result;
        };
    }
    if (!Array.prototype.indexOf || [ 0, 1 ].indexOf(1, 2) != -1) {
        Array.prototype.indexOf = function indexOf(sought) {
            var self = splitString && _toString(this) == "[object String]" ? this.split("") : toObject(this), length = self.length >>> 0;
            if (!length) {
                return -1;
            }
            var i = 0;
            if (arguments.length > 1) {
                i = toInteger(arguments[1]);
            }
            i = i >= 0 ? i : Math.max(0, length + i);
            for (;i < length; i++) {
                if (i in self && self[i] === sought) {
                    return i;
                }
            }
            return -1;
        };
    }
    if (!Array.prototype.lastIndexOf || [ 0, 1 ].lastIndexOf(0, -3) != -1) {
        Array.prototype.lastIndexOf = function lastIndexOf(sought) {
            var self = splitString && _toString(this) == "[object String]" ? this.split("") : toObject(this), length = self.length >>> 0;
            if (!length) {
                return -1;
            }
            var i = length - 1;
            if (arguments.length > 1) {
                i = Math.min(i, toInteger(arguments[1]));
            }
            i = i >= 0 ? i : length - Math.abs(i);
            for (;i >= 0; i--) {
                if (i in self && sought === self[i]) {
                    return i;
                }
            }
            return -1;
        };
    }
    if (!Object.keys) {
        var hasDontEnumBug = true, dontEnums = [ "toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor" ], dontEnumsLength = dontEnums.length;
        for (var key in {
            toString: null
        }) {
            hasDontEnumBug = false;
        }
        Object.keys = function keys(object) {
            if (typeof object != "object" && typeof object != "function" || object === null) {
                throw new TypeError("Object.keys called on a non-object");
            }
            var keys = [];
            for (var name in object) {
                if (owns(object, name)) {
                    keys.push(name);
                }
            }
            if (hasDontEnumBug) {
                for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                    var dontEnum = dontEnums[i];
                    if (owns(object, dontEnum)) {
                        keys.push(dontEnum);
                    }
                }
            }
            return keys;
        };
    }
    var negativeDate = -621987552e5, negativeYearString = "-000001";
    if (!Date.prototype.toISOString || new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1) {
        Date.prototype.toISOString = function toISOString() {
            var result, length, value, year, month;
            if (!isFinite(this)) {
                throw new RangeError("Date.prototype.toISOString called on non-finite value.");
            }
            year = this.getUTCFullYear();
            month = this.getUTCMonth();
            year += Math.floor(month / 12);
            month = (month % 12 + 12) % 12;
            result = [ month + 1, this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds() ];
            year = (year < 0 ? "-" : year > 9999 ? "+" : "") + ("00000" + Math.abs(year)).slice(0 <= year && year <= 9999 ? -4 : -6);
            length = result.length;
            while (length--) {
                value = result[length];
                if (value < 10) {
                    result[length] = "0" + value;
                }
            }
            return year + "-" + result.slice(0, 2).join("-") + "T" + result.slice(2).join(":") + "." + ("000" + this.getUTCMilliseconds()).slice(-3) + "Z";
        };
    }
    var dateToJSONIsSupported = false;
    try {
        dateToJSONIsSupported = Date.prototype.toJSON && new Date(NaN).toJSON() === null && new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1 && Date.prototype.toJSON.call({
            toISOString: function() {
                return true;
            }
        });
    } catch (e) {}
    if (!dateToJSONIsSupported) {
        Date.prototype.toJSON = function toJSON(key) {
            var o = Object(this), tv = toPrimitive(o), toISO;
            if (typeof tv === "number" && !isFinite(tv)) {
                return null;
            }
            toISO = o.toISOString;
            if (typeof toISO != "function") {
                throw new TypeError("toISOString property is not callable");
            }
            return toISO.call(o);
        };
    }
    if (!Date.parse || "Date.parse is buggy") {
        Date = function(NativeDate) {
            function Date(Y, M, D, h, m, s, ms) {
                var length = arguments.length;
                if (this instanceof NativeDate) {
                    var date = length == 1 && String(Y) === Y ? new NativeDate(Date.parse(Y)) : length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) : length >= 6 ? new NativeDate(Y, M, D, h, m, s) : length >= 5 ? new NativeDate(Y, M, D, h, m) : length >= 4 ? new NativeDate(Y, M, D, h) : length >= 3 ? new NativeDate(Y, M, D) : length >= 2 ? new NativeDate(Y, M) : length >= 1 ? new NativeDate(Y) : new NativeDate();
                    date.constructor = Date;
                    return date;
                }
                return NativeDate.apply(this, arguments);
            }
            var isoDateExpression = new RegExp("^" + "(\\d{4}|[+-]\\d{6})" + "(?:-(\\d{2})" + "(?:-(\\d{2})" + "(?:" + "T(\\d{2})" + ":(\\d{2})" + "(?:" + ":(\\d{2})" + "(?:(\\.\\d{1,}))?" + ")?" + "(" + "Z|" + "(?:" + "([-+])" + "(\\d{2})" + ":(\\d{2})" + ")" + ")?)?)?)?" + "$");
            var months = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365 ];
            function dayFromMonth(year, month) {
                var t = month > 1 ? 1 : 0;
                return months[month] + Math.floor((year - 1969 + t) / 4) - Math.floor((year - 1901 + t) / 100) + Math.floor((year - 1601 + t) / 400) + 365 * (year - 1970);
            }
            for (var key in NativeDate) {
                Date[key] = NativeDate[key];
            }
            Date.now = NativeDate.now;
            Date.UTC = NativeDate.UTC;
            Date.prototype = NativeDate.prototype;
            Date.prototype.constructor = Date;
            Date.parse = function parse(string) {
                var match = isoDateExpression.exec(string);
                if (match) {
                    var year = Number(match[1]), month = Number(match[2] || 1) - 1, day = Number(match[3] || 1) - 1, hour = Number(match[4] || 0), minute = Number(match[5] || 0), second = Number(match[6] || 0), millisecond = Math.floor(Number(match[7] || 0) * 1e3), offset = !match[4] || match[8] ? 0 : Number(new NativeDate(1970, 0)), signOffset = match[9] === "-" ? 1 : -1, hourOffset = Number(match[10] || 0), minuteOffset = Number(match[11] || 0), result;
                    if (hour < (minute > 0 || second > 0 || millisecond > 0 ? 24 : 25) && minute < 60 && second < 60 && millisecond < 1e3 && month > -1 && month < 12 && hourOffset < 24 && minuteOffset < 60 && day > -1 && day < dayFromMonth(year, month + 1) - dayFromMonth(year, month)) {
                        result = ((dayFromMonth(year, month) + day) * 24 + hour + hourOffset * signOffset) * 60;
                        result = ((result + minute + minuteOffset * signOffset) * 60 + second) * 1e3 + millisecond + offset;
                        if (-864e13 <= result && result <= 864e13) {
                            return result;
                        }
                    }
                    return NaN;
                }
                return NativeDate.parse.apply(this, arguments);
            };
            return Date;
        }(Date);
    }
    if (!Date.now) {
        Date.now = function now() {
            return new Date().getTime();
        };
    }
    if (!Number.prototype.toFixed || 8e-5.toFixed(3) !== "0.000" || .9.toFixed(0) === "0" || 1.255.toFixed(2) !== "1.25" || 0xde0b6b3a7640080.toFixed(0) !== "1000000000000000128") {
        (function() {
            var base, size, data, i;
            base = 1e7;
            size = 6;
            data = [ 0, 0, 0, 0, 0, 0 ];
            function multiply(n, c) {
                var i = -1;
                while (++i < size) {
                    c += n * data[i];
                    data[i] = c % base;
                    c = Math.floor(c / base);
                }
            }
            function divide(n) {
                var i = size, c = 0;
                while (--i >= 0) {
                    c += data[i];
                    data[i] = Math.floor(c / n);
                    c = c % n * base;
                }
            }
            function toString() {
                var i = size;
                var s = "";
                while (--i >= 0) {
                    if (s !== "" || i === 0 || data[i] !== 0) {
                        var t = String(data[i]);
                        if (s === "") {
                            s = t;
                        } else {
                            s += "0000000".slice(0, 7 - t.length) + t;
                        }
                    }
                }
                return s;
            }
            function pow(x, n, acc) {
                return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
            }
            function log(x) {
                var n = 0;
                while (x >= 4096) {
                    n += 12;
                    x /= 4096;
                }
                while (x >= 2) {
                    n += 1;
                    x /= 2;
                }
                return n;
            }
            Number.prototype.toFixed = function(fractionDigits) {
                var f, x, s, m, e, z, j, k;
                f = Number(fractionDigits);
                f = f !== f ? 0 : Math.floor(f);
                if (f < 0 || f > 20) {
                    throw new RangeError("Number.toFixed called with invalid number of decimals");
                }
                x = Number(this);
                if (x !== x) {
                    return "NaN";
                }
                if (x <= -1e21 || x >= 1e21) {
                    return String(x);
                }
                s = "";
                if (x < 0) {
                    s = "-";
                    x = -x;
                }
                m = "0";
                if (x > 1e-21) {
                    e = log(x * pow(2, 69, 1)) - 69;
                    z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
                    z *= 4503599627370496;
                    e = 52 - e;
                    if (e > 0) {
                        multiply(0, z);
                        j = f;
                        while (j >= 7) {
                            multiply(1e7, 0);
                            j -= 7;
                        }
                        multiply(pow(10, j, 1), 0);
                        j = e - 1;
                        while (j >= 23) {
                            divide(1 << 23);
                            j -= 23;
                        }
                        divide(1 << j);
                        multiply(1, 1);
                        divide(2);
                        m = toString();
                    } else {
                        multiply(0, z);
                        multiply(1 << -e, 0);
                        m = toString() + "0.00000000000000000000".slice(2, 2 + f);
                    }
                }
                if (f > 0) {
                    k = m.length;
                    if (k <= f) {
                        m = s + "0.0000000000000000000".slice(0, f - k + 2) + m;
                    } else {
                        m = s + m.slice(0, k - f) + "." + m.slice(k - f);
                    }
                } else {
                    m = s + m;
                }
                return m;
            };
        })();
    }
    if ("0".split(void 0, 0).length) {
        var string_split = String.prototype.split;
        String.prototype.split = function(separator, limit) {
            if (separator === void 0 && limit === 0) return [];
            return string_split.apply(this, arguments);
        };
    }
    if ("".substr && "0b".substr(-1) !== "b") {
        var string_substr = String.prototype.substr;
        String.prototype.substr = function(start, length) {
            return string_substr.call(this, start < 0 ? (start = this.length + start) < 0 ? 0 : start : start, length);
        };
    }
    var ws = "	\n\f\r   ᠎    " + "         　\u2028" + "\u2029﻿";
    if (!String.prototype.trim || ws.trim()) {
        ws = "[" + ws + "]";
        var trimBeginRegexp = new RegExp("^" + ws + ws + "*"), trimEndRegexp = new RegExp(ws + ws + "*$");
        String.prototype.trim = function trim() {
            if (this === undefined || this === null) {
                throw new TypeError("can't convert " + this + " to object");
            }
            return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
        };
    }
    function toInteger(n) {
        n = +n;
        if (n !== n) {
            n = 0;
        } else if (n !== 0 && n !== 1 / 0 && n !== -(1 / 0)) {
            n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
        return n;
    }
    function isPrimitive(input) {
        var type = typeof input;
        return input === null || type === "undefined" || type === "boolean" || type === "number" || type === "string";
    }
    function toPrimitive(input) {
        var val, valueOf, toString;
        if (isPrimitive(input)) {
            return input;
        }
        valueOf = input.valueOf;
        if (typeof valueOf === "function") {
            val = valueOf.call(input);
            if (isPrimitive(val)) {
                return val;
            }
        }
        toString = input.toString;
        if (typeof toString === "function") {
            val = toString.call(input);
            if (isPrimitive(val)) {
                return val;
            }
        }
        throw new TypeError();
    }
    var toObject = function(o) {
        if (o == null) {
            throw new TypeError("can't convert " + o + " to object");
        }
        return Object(o);
    };
});

(function() {
    var e = void 0, i = !0, k = null, l = {}.toString, m, n, p = "function" === typeof define && define.c, q = !p && "object" == typeof exports && exports;
    q || p ? "object" == typeof JSON && JSON ? p ? q = JSON : (q.stringify = JSON.stringify, 
    q.parse = JSON.parse) : p && (q = this.JSON = {}) : q = this.JSON || (this.JSON = {});
    var r, t, u, x, z, B, C, D, E, F, G, H, I, J = new Date(-0xc782b5b800cec), K, O, P;
    try {
        J = -109252 == J.getUTCFullYear() && 0 === J.getUTCMonth() && 1 == J.getUTCDate() && 10 == J.getUTCHours() && 37 == J.getUTCMinutes() && 6 == J.getUTCSeconds() && 708 == J.getUTCMilliseconds();
    } catch (Q) {}
    function R(b) {
        var c, a, d, j = b == "json";
        if (j || b == "json-stringify" || b == "json-parse") {
            if (b == "json-stringify" || j) {
                if (c = typeof q.stringify == "function" && J) {
                    (d = function() {
                        return 1;
                    }).toJSON = d;
                    try {
                        c = q.stringify(0) === "0" && q.stringify(new Number()) === "0" && q.stringify(new String()) == '""' && q.stringify(l) === e && q.stringify(e) === e && q.stringify() === e && q.stringify(d) === "1" && q.stringify([ d ]) == "[1]" && q.stringify([ e ]) == "[null]" && q.stringify(k) == "null" && q.stringify([ e, l, k ]) == "[null,null,null]" && q.stringify({
                            A: [ d, i, false, k, "\x00\b\n\f\r	" ]
                        }) == '{"A":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}' && q.stringify(k, d) === "1" && q.stringify([ 1, 2 ], k, 1) == "[\n 1,\n 2\n]" && q.stringify(new Date(-864e13)) == '"-271821-04-20T00:00:00.000Z"' && q.stringify(new Date(864e13)) == '"+275760-09-13T00:00:00.000Z"' && q.stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' && q.stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
                    } catch (f) {
                        c = false;
                    }
                }
                if (!j) return c;
            }
            if (b == "json-parse" || j) {
                if (typeof q.parse == "function") try {
                    if (q.parse("0") === 0 && !q.parse(false)) {
                        d = q.parse('{"A":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}');
                        if (a = d.a.length == 5 && d.a[0] == 1) {
                            try {
                                a = !q.parse('"	"');
                            } catch (o) {}
                            if (a) try {
                                a = q.parse("01") != 1;
                            } catch (g) {}
                        }
                    }
                } catch (h) {
                    a = false;
                }
                if (!j) return a;
            }
            return c && a;
        }
    }
    if (!R("json")) {
        J || (K = Math.floor, O = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ], 
        P = function(b, c) {
            return O[c] + 365 * (b - 1970) + K((b - 1969 + (c = +(c > 1))) / 4) - K((b - 1901 + c) / 100) + K((b - 1601 + c) / 400);
        });
        if (!(m = {}.hasOwnProperty)) m = function(b) {
            var c = {}, a;
            if ((c.__proto__ = k, c.__proto__ = {
                toString: 1
            }, c).toString != l) m = function(a) {
                var b = this.__proto__, a = a in (this.__proto__ = k, this);
                this.__proto__ = b;
                return a;
            }; else {
                a = c.constructor;
                m = function(b) {
                    var c = (this.constructor || a).prototype;
                    return b in this && !(b in c && this[b] === c[b]);
                };
            }
            c = k;
            return m.call(this, b);
        };
        n = function(b, c) {
            var a = 0, d, j, f;
            (d = function() {
                this.valueOf = 0;
            }).prototype.valueOf = 0;
            j = new d();
            for (f in j) m.call(j, f) && a++;
            d = j = k;
            if (a) a = a == 2 ? function(a, b) {
                var c = {}, d = l.call(a) == "[object Function]", f;
                for (f in a) !(d && f == "prototype") && !m.call(c, f) && (c[f] = 1) && m.call(a, f) && b(f);
            } : function(a, b) {
                var c = l.call(a) == "[object Function]", d, f;
                for (d in a) !(c && d == "prototype") && m.call(a, d) && !(f = d === "constructor") && b(d);
                (f || m.call(a, d = "constructor")) && b(d);
            }; else {
                j = [ "valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor" ];
                a = function(a, b) {
                    var c = l.call(a) == "[object Function]", d;
                    for (d in a) !(c && d == "prototype") && m.call(a, d) && b(d);
                    for (c = j.length; d = j[--c]; m.call(a, d) && b(d)) ;
                };
            }
            a(b, c);
        };
        R("json-stringify") || (r = {
            "\\": "\\\\",
            '"': '\\"',
            "\b": "\\b",
            "\f": "\\f",
            "\n": "\\n",
            "\r": "\\r",
            "	": "\\t"
        }, t = function(b, c) {
            return ("000000" + (c || 0)).slice(-b);
        }, u = function(b) {
            for (var c = '"', a = 0, d; d = b.charAt(a); a++) c = c + ('\\"\b\f\n\r	'.indexOf(d) > -1 ? r[d] : r[d] = d < " " ? "\\u00" + t(2, d.charCodeAt(0).toString(16)) : d);
            return c + '"';
        }, x = function(b, c, a, d, j, f, o) {
            var g = c[b], h, s, v, w, L, M, N, y, A;
            if (typeof g == "object" && g) {
                h = l.call(g);
                if (h == "[object Date]" && !m.call(g, "toJSON")) if (g > -1 / 0 && g < 1 / 0) {
                    if (P) {
                        v = K(g / 864e5);
                        for (h = K(v / 365.2425) + 1970 - 1; P(h + 1, 0) <= v; h++) ;
                        for (s = K((v - P(h, 0)) / 30.42); P(h, s + 1) <= v; s++) ;
                        v = 1 + v - P(h, s);
                        w = (g % 864e5 + 864e5) % 864e5;
                        L = K(w / 36e5) % 24;
                        M = K(w / 6e4) % 60;
                        N = K(w / 1e3) % 60;
                        w = w % 1e3;
                    } else {
                        h = g.getUTCFullYear();
                        s = g.getUTCMonth();
                        v = g.getUTCDate();
                        L = g.getUTCHours();
                        M = g.getUTCMinutes();
                        N = g.getUTCSeconds();
                        w = g.getUTCMilliseconds();
                    }
                    g = (h <= 0 || h >= 1e4 ? (h < 0 ? "-" : "+") + t(6, h < 0 ? -h : h) : t(4, h)) + "-" + t(2, s + 1) + "-" + t(2, v) + "T" + t(2, L) + ":" + t(2, M) + ":" + t(2, N) + "." + t(3, w) + "Z";
                } else g = k; else if (typeof g.toJSON == "function" && (h != "[object Number]" && h != "[object String]" && h != "[object Array]" || m.call(g, "toJSON"))) g = g.toJSON(b);
            }
            a && (g = a.call(c, b, g));
            if (g === k) return "null";
            h = l.call(g);
            if (h == "[object Boolean]") return "" + g;
            if (h == "[object Number]") return g > -1 / 0 && g < 1 / 0 ? "" + g : "null";
            if (h == "[object String]") return u(g);
            if (typeof g == "object") {
                for (b = o.length; b--; ) if (o[b] === g) throw TypeError();
                o.push(g);
                y = [];
                c = f;
                f = f + j;
                if (h == "[object Array]") {
                    s = 0;
                    for (b = g.length; s < b; A || (A = i), s++) {
                        h = x(s, g, a, d, j, f, o);
                        y.push(h === e ? "null" : h);
                    }
                    b = A ? j ? "[\n" + f + y.join(",\n" + f) + "\n" + c + "]" : "[" + y.join(",") + "]" : "[]";
                } else {
                    n(d || g, function(b) {
                        var c = x(b, g, a, d, j, f, o);
                        c !== e && y.push(u(b) + ":" + (j ? " " : "") + c);
                        A || (A = i);
                    });
                    b = A ? j ? "{\n" + f + y.join(",\n" + f) + "\n" + c + "}" : "{" + y.join(",") + "}" : "{}";
                }
                o.pop();
                return b;
            }
        }, q.stringify = function(b, c, a) {
            var d, j, f, o, g, h;
            if (typeof c == "function" || typeof c == "object" && c) if (l.call(c) == "[object Function]") j = c; else if (l.call(c) == "[object Array]") {
                f = {};
                o = 0;
                for (g = c.length; o < g; h = c[o++], (l.call(h) == "[object String]" || l.call(h) == "[object Number]") && (f[h] = 1)) ;
            }
            if (a) if (l.call(a) == "[object Number]") {
                if ((a = a - a % 1) > 0) {
                    d = "";
                    for (a > 10 && (a = 10); d.length < a; d = d + " ") ;
                }
            } else l.call(a) == "[object String]" && (d = a.length <= 10 ? a : a.slice(0, 10));
            return x("", (h = {}, h[""] = b, h), j, f, d, "", []);
        });
        R("json-parse") || (z = String.fromCharCode, B = {
            "\\": "\\",
            '"': '"',
            "/": "/",
            b: "\b",
            t: "	",
            n: "\n",
            f: "\f",
            r: "\r"
        }, C = function() {
            H = I = k;
            throw SyntaxError();
        }, D = function() {
            for (var b = I, c = b.length, a, d, j, f, o; H < c; ) {
                a = b.charAt(H);
                if ("	\r\n ".indexOf(a) > -1) H++; else {
                    if ("{}[]:,".indexOf(a) > -1) {
                        H++;
                        return a;
                    }
                    if (a == '"') {
                        d = "@";
                        for (H++; H < c; ) {
                            a = b.charAt(H);
                            if (a < " ") C(); else if (a == "\\") {
                                a = b.charAt(++H);
                                if ('\\"/btnfr'.indexOf(a) > -1) {
                                    d = d + B[a];
                                    H++;
                                } else if (a == "u") {
                                    j = ++H;
                                    for (f = H + 4; H < f; H++) {
                                        a = b.charAt(H);
                                        a >= "0" && a <= "9" || a >= "a" && a <= "f" || a >= "A" && a <= "F" || C();
                                    }
                                    d = d + z("0x" + b.slice(j, H));
                                } else C();
                            } else {
                                if (a == '"') break;
                                d = d + a;
                                H++;
                            }
                        }
                        if (b.charAt(H) == '"') {
                            H++;
                            return d;
                        }
                    } else {
                        j = H;
                        if (a == "-") {
                            o = i;
                            a = b.charAt(++H);
                        }
                        if (a >= "0" && a <= "9") {
                            for (a == "0" && (a = b.charAt(H + 1), a >= "0" && a <= "9") && C(); H < c && (a = b.charAt(H), 
                            a >= "0" && a <= "9"); H++) ;
                            if (b.charAt(H) == ".") {
                                for (f = ++H; f < c && (a = b.charAt(f), a >= "0" && a <= "9"); f++) ;
                                f == H && C();
                                H = f;
                            }
                            a = b.charAt(H);
                            if (a == "e" || a == "E") {
                                a = b.charAt(++H);
                                (a == "+" || a == "-") && H++;
                                for (f = H; f < c && (a = b.charAt(f), a >= "0" && a <= "9"); f++) ;
                                f == H && C();
                                H = f;
                            }
                            return +b.slice(j, H);
                        }
                        o && C();
                        if (b.slice(H, H + 4) == "true") {
                            H = H + 4;
                            return i;
                        }
                        if (b.slice(H, H + 5) == "false") {
                            H = H + 5;
                            return false;
                        }
                        if (b.slice(H, H + 4) == "null") {
                            H = H + 4;
                            return k;
                        }
                    }
                    C();
                }
            }
            return "$";
        }, E = function(b) {
            var c, a;
            b == "$" && C();
            if (typeof b == "string") {
                if (b.charAt(0) == "@") return b.slice(1);
                if (b == "[") {
                    for (c = []; ;a || (a = i)) {
                        b = D();
                        if (b == "]") break;
                        if (a) if (b == ",") {
                            b = D();
                            b == "]" && C();
                        } else C();
                        b == "," && C();
                        c.push(E(b));
                    }
                    return c;
                }
                if (b == "{") {
                    for (c = {}; ;a || (a = i)) {
                        b = D();
                        if (b == "}") break;
                        if (a) if (b == ",") {
                            b = D();
                            b == "}" && C();
                        } else C();
                        (b == "," || typeof b != "string" || b.charAt(0) != "@" || D() != ":") && C();
                        c[b.slice(1)] = E(D());
                    }
                    return c;
                }
                C();
            }
            return b;
        }, G = function(b, c, a) {
            a = F(b, c, a);
            a === e ? delete b[c] : b[c] = a;
        }, F = function(b, c, a) {
            var d = b[c], j;
            if (typeof d == "object" && d) if (l.call(d) == "[object Array]") for (j = d.length; j--; ) G(d, j, a); else n(d, function(b) {
                G(d, b, a);
            });
            return a.call(b, c, d);
        }, q.parse = function(b, c) {
            var a, d;
            H = 0;
            I = b;
            a = E(D());
            D() != "$" && C();
            H = I = k;
            return c && l.call(c) == "[object Function]" ? F((d = {}, d[""] = a, d), "", c) : a;
        });
    }
    p && define(function() {
        return q;
    });
})();
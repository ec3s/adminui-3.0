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
            if (i < 0) {
                return result;
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
    var n = null;
    (function(G) {
        function m(a) {
            if (m[a] !== s) return m[a];
            var c;
            if ("bug-string-char-index" == a) c = "a" != "a"[0]; else if ("json" == a) c = m("json-stringify") && m("json-parse"); else {
                var e;
                if ("json-stringify" == a) {
                    c = o.stringify;
                    var b = "function" == typeof c && l;
                    if (b) {
                        (e = function() {
                            return 1;
                        }).toJSON = e;
                        try {
                            b = "0" === c(0) && "0" === c(new Number()) && '""' == c(new String()) && c(p) === s && c(s) === s && c() === s && "1" === c(e) && "[1]" == c([ e ]) && "[null]" == c([ s ]) && "null" == c(n) && "[null,null,null]" == c([ s, p, n ]) && '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}' == c({
                                a: [ e, !0, !1, n, "\x00\b\n\f\r	" ]
                            }) && "1" === c(n, e) && "[\n 1,\n 2\n]" == c([ 1, 2 ], n, 1) && '"-271821-04-20T00:00:00.000Z"' == c(new Date(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == c(new Date(864e13)) && '"-000001-01-01T00:00:00.000Z"' == c(new Date(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == c(new Date(-1));
                        } catch (f) {
                            b = !1;
                        }
                    }
                    c = b;
                }
                if ("json-parse" == a) {
                    c = o.parse;
                    if ("function" == typeof c) try {
                        if (0 === c("0") && !c(!1)) {
                            e = c('{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}');
                            var j = 5 == e.a.length && 1 === e.a[0];
                            if (j) {
                                try {
                                    j = !c('"	"');
                                } catch (d) {}
                                if (j) try {
                                    j = 1 !== c("01");
                                } catch (h) {}
                                if (j) try {
                                    j = 1 !== c("1.");
                                } catch (k) {}
                            }
                        }
                    } catch (N) {
                        j = !1;
                    }
                    c = j;
                }
            }
            return m[a] = !!c;
        }
        var p = {}.toString, q, x, s, H = typeof define === "function" && define.amd, y = "object" == typeof JSON && JSON, o = "object" == typeof exports && exports && !exports.nodeType && exports;
        o && y ? (o.stringify = y.stringify, o.parse = y.parse) : o = G.JSON = y || {};
        var l = new Date(-0xc782b5b800cec);
        try {
            l = -109252 == l.getUTCFullYear() && 0 === l.getUTCMonth() && 1 === l.getUTCDate() && 10 == l.getUTCHours() && 37 == l.getUTCMinutes() && 6 == l.getUTCSeconds() && 708 == l.getUTCMilliseconds();
        } catch (O) {}
        if (!m("json")) {
            var t = m("bug-string-char-index");
            if (!l) var u = Math.floor, I = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ], z = function(a, c) {
                return I[c] + 365 * (a - 1970) + u((a - 1969 + (c = +(c > 1))) / 4) - u((a - 1901 + c) / 100) + u((a - 1601 + c) / 400);
            };
            if (!(q = {}.hasOwnProperty)) q = function(a) {
                var c = {}, e;
                if ((c.__proto__ = n, c.__proto__ = {
                    toString: 1
                }, c).toString != p) q = function(a) {
                    var c = this.__proto__, a = a in (this.__proto__ = n, this);
                    this.__proto__ = c;
                    return a;
                }; else {
                    e = c.constructor;
                    q = function(a) {
                        var c = (this.constructor || e).prototype;
                        return a in this && !(a in c && this[a] === c[a]);
                    };
                }
                c = n;
                return q.call(this, a);
            };
            var J = {
                "boolean": 1,
                number: 1,
                string: 1,
                undefined: 1
            };
            x = function(a, c) {
                var e = 0, b, f, j;
                (b = function() {
                    this.valueOf = 0;
                }).prototype.valueOf = 0;
                f = new b();
                for (j in f) q.call(f, j) && e++;
                b = f = n;
                if (e) x = e == 2 ? function(a, c) {
                    var e = {}, b = p.call(a) == "[object Function]", f;
                    for (f in a) !(b && f == "prototype") && !q.call(e, f) && (e[f] = 1) && q.call(a, f) && c(f);
                } : function(a, c) {
                    var e = p.call(a) == "[object Function]", b, f;
                    for (b in a) !(e && b == "prototype") && q.call(a, b) && !(f = b === "constructor") && c(b);
                    (f || q.call(a, b = "constructor")) && c(b);
                }; else {
                    f = [ "valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor" ];
                    x = function(a, c) {
                        var e = p.call(a) == "[object Function]", b, g;
                        if (g = !e) if (g = typeof a.constructor != "function") {
                            g = typeof a.hasOwnProperty;
                            g = g == "object" ? !!a.hasOwnProperty : !J[g];
                        }
                        g = g ? a.hasOwnProperty : q;
                        for (b in a) !(e && b == "prototype") && g.call(a, b) && c(b);
                        for (e = f.length; b = f[--e]; g.call(a, b) && c(b)) ;
                    };
                }
                return x(a, c);
            };
            if (!m("json-stringify")) {
                var K = {
                    92: "\\\\",
                    34: '\\"',
                    8: "\\b",
                    12: "\\f",
                    10: "\\n",
                    13: "\\r",
                    9: "\\t"
                }, v = function(a, c) {
                    return ("000000" + (c || 0)).slice(-a);
                }, D = function(a) {
                    var c = '"', b = 0, g = a.length, f = g > 10 && t, j;
                    for (f && (j = a.split("")); b < g; b++) {
                        var d = a.charCodeAt(b);
                        switch (d) {
                          case 8:
                          case 9:
                          case 10:
                          case 12:
                          case 13:
                          case 34:
                          case 92:
                            c = c + K[d];
                            break;

                          default:
                            if (d < 32) {
                                c = c + ("\\u00" + v(2, d.toString(16)));
                                break;
                            }
                            c = c + (f ? j[b] : t ? a.charAt(b) : a[b]);
                        }
                    }
                    return c + '"';
                }, B = function(a, c, b, g, f, j, d) {
                    var h, k, i, l, m, o, r, t, w;
                    try {
                        h = c[a];
                    } catch (y) {}
                    if (typeof h == "object" && h) {
                        k = p.call(h);
                        if (k == "[object Date]" && !q.call(h, "toJSON")) if (h > -1 / 0 && h < 1 / 0) {
                            if (z) {
                                l = u(h / 864e5);
                                for (k = u(l / 365.2425) + 1970 - 1; z(k + 1, 0) <= l; k++) ;
                                for (i = u((l - z(k, 0)) / 30.42); z(k, i + 1) <= l; i++) ;
                                l = 1 + l - z(k, i);
                                m = (h % 864e5 + 864e5) % 864e5;
                                o = u(m / 36e5) % 24;
                                r = u(m / 6e4) % 60;
                                t = u(m / 1e3) % 60;
                                m = m % 1e3;
                            } else {
                                k = h.getUTCFullYear();
                                i = h.getUTCMonth();
                                l = h.getUTCDate();
                                o = h.getUTCHours();
                                r = h.getUTCMinutes();
                                t = h.getUTCSeconds();
                                m = h.getUTCMilliseconds();
                            }
                            h = (k <= 0 || k >= 1e4 ? (k < 0 ? "-" : "+") + v(6, k < 0 ? -k : k) : v(4, k)) + "-" + v(2, i + 1) + "-" + v(2, l) + "T" + v(2, o) + ":" + v(2, r) + ":" + v(2, t) + "." + v(3, m) + "Z";
                        } else h = n; else if (typeof h.toJSON == "function" && (k != "[object Number]" && k != "[object String]" && k != "[object Array]" || q.call(h, "toJSON"))) h = h.toJSON(a);
                    }
                    b && (h = b.call(c, a, h));
                    if (h === n) return "null";
                    k = p.call(h);
                    if (k == "[object Boolean]") return "" + h;
                    if (k == "[object Number]") return h > -1 / 0 && h < 1 / 0 ? "" + h : "null";
                    if (k == "[object String]") return D("" + h);
                    if (typeof h == "object") {
                        for (a = d.length; a--; ) if (d[a] === h) throw TypeError();
                        d.push(h);
                        w = [];
                        c = j;
                        j = j + f;
                        if (k == "[object Array]") {
                            i = 0;
                            for (a = h.length; i < a; i++) {
                                k = B(i, h, b, g, f, j, d);
                                w.push(k === s ? "null" : k);
                            }
                            a = w.length ? f ? "[\n" + j + w.join(",\n" + j) + "\n" + c + "]" : "[" + w.join(",") + "]" : "[]";
                        } else {
                            x(g || h, function(a) {
                                var c = B(a, h, b, g, f, j, d);
                                c !== s && w.push(D(a) + ":" + (f ? " " : "") + c);
                            });
                            a = w.length ? f ? "{\n" + j + w.join(",\n" + j) + "\n" + c + "}" : "{" + w.join(",") + "}" : "{}";
                        }
                        d.pop();
                        return a;
                    }
                };
                o.stringify = function(a, c, b) {
                    var g, f, j, d;
                    if (typeof c == "function" || typeof c == "object" && c) if ((d = p.call(c)) == "[object Function]") f = c; else if (d == "[object Array]") {
                        j = {};
                        for (var h = 0, k = c.length, i; h < k; i = c[h++], (d = p.call(i), d == "[object String]" || d == "[object Number]") && (j[i] = 1)) ;
                    }
                    if (b) if ((d = p.call(b)) == "[object Number]") {
                        if ((b = b - b % 1) > 0) {
                            g = "";
                            for (b > 10 && (b = 10); g.length < b; g = g + " ") ;
                        }
                    } else d == "[object String]" && (g = b.length <= 10 ? b : b.slice(0, 10));
                    return B("", (i = {}, i[""] = a, i), f, j, g, "", []);
                };
            }
            if (!m("json-parse")) {
                var L = String.fromCharCode, M = {
                    92: "\\",
                    34: '"',
                    47: "/",
                    98: "\b",
                    116: "	",
                    110: "\n",
                    102: "\f",
                    114: "\r"
                }, b, A, i = function() {
                    b = A = n;
                    throw SyntaxError();
                }, r = function() {
                    for (var a = A, c = a.length, e, g, f, j, d; b < c; ) {
                        d = a.charCodeAt(b);
                        switch (d) {
                          case 9:
                          case 10:
                          case 13:
                          case 32:
                            b++;
                            break;

                          case 123:
                          case 125:
                          case 91:
                          case 93:
                          case 58:
                          case 44:
                            e = t ? a.charAt(b) : a[b];
                            b++;
                            return e;

                          case 34:
                            e = "@";
                            for (b++; b < c; ) {
                                d = a.charCodeAt(b);
                                if (d < 32) i(); else if (d == 92) {
                                    d = a.charCodeAt(++b);
                                    switch (d) {
                                      case 92:
                                      case 34:
                                      case 47:
                                      case 98:
                                      case 116:
                                      case 110:
                                      case 102:
                                      case 114:
                                        e = e + M[d];
                                        b++;
                                        break;

                                      case 117:
                                        g = ++b;
                                        for (f = b + 4; b < f; b++) {
                                            d = a.charCodeAt(b);
                                            d >= 48 && d <= 57 || d >= 97 && d <= 102 || d >= 65 && d <= 70 || i();
                                        }
                                        e = e + L("0x" + a.slice(g, b));
                                        break;

                                      default:
                                        i();
                                    }
                                } else {
                                    if (d == 34) break;
                                    d = a.charCodeAt(b);
                                    for (g = b; d >= 32 && d != 92 && d != 34; ) d = a.charCodeAt(++b);
                                    e = e + a.slice(g, b);
                                }
                            }
                            if (a.charCodeAt(b) == 34) {
                                b++;
                                return e;
                            }
                            i();

                          default:
                            g = b;
                            if (d == 45) {
                                j = true;
                                d = a.charCodeAt(++b);
                            }
                            if (d >= 48 && d <= 57) {
                                for (d == 48 && (d = a.charCodeAt(b + 1), d >= 48 && d <= 57) && i(); b < c && (d = a.charCodeAt(b), 
                                d >= 48 && d <= 57); b++) ;
                                if (a.charCodeAt(b) == 46) {
                                    for (f = ++b; f < c && (d = a.charCodeAt(f), d >= 48 && d <= 57); f++) ;
                                    f == b && i();
                                    b = f;
                                }
                                d = a.charCodeAt(b);
                                if (d == 101 || d == 69) {
                                    d = a.charCodeAt(++b);
                                    (d == 43 || d == 45) && b++;
                                    for (f = b; f < c && (d = a.charCodeAt(f), d >= 48 && d <= 57); f++) ;
                                    f == b && i();
                                    b = f;
                                }
                                return +a.slice(g, b);
                            }
                            j && i();
                            if (a.slice(b, b + 4) == "true") {
                                b = b + 4;
                                return true;
                            }
                            if (a.slice(b, b + 5) == "false") {
                                b = b + 5;
                                return false;
                            }
                            if (a.slice(b, b + 4) == "null") {
                                b = b + 4;
                                return n;
                            }
                            i();
                        }
                    }
                    return "$";
                }, C = function(a) {
                    var c, b;
                    a == "$" && i();
                    if (typeof a == "string") {
                        if ((t ? a.charAt(0) : a[0]) == "@") return a.slice(1);
                        if (a == "[") {
                            for (c = []; ;b || (b = true)) {
                                a = r();
                                if (a == "]") break;
                                if (b) if (a == ",") {
                                    a = r();
                                    a == "]" && i();
                                } else i();
                                a == "," && i();
                                c.push(C(a));
                            }
                            return c;
                        }
                        if (a == "{") {
                            for (c = {}; ;b || (b = true)) {
                                a = r();
                                if (a == "}") break;
                                if (b) if (a == ",") {
                                    a = r();
                                    a == "}" && i();
                                } else i();
                                (a == "," || typeof a != "string" || (t ? a.charAt(0) : a[0]) != "@" || r() != ":") && i();
                                c[a.slice(1)] = C(r());
                            }
                            return c;
                        }
                        i();
                    }
                    return a;
                }, F = function(a, b, e) {
                    e = E(a, b, e);
                    e === s ? delete a[b] : a[b] = e;
                }, E = function(a, b, e) {
                    var g = a[b], f;
                    if (typeof g == "object" && g) if (p.call(g) == "[object Array]") for (f = g.length; f--; ) F(g, f, e); else x(g, function(a) {
                        F(g, a, e);
                    });
                    return e.call(a, b, g);
                };
                o.parse = function(a, c) {
                    var e, g;
                    b = 0;
                    A = "" + a;
                    e = C(r());
                    r() != "$" && i();
                    b = A = n;
                    return c && p.call(c) == "[object Function]" ? E((g = {}, g[""] = e, g), "", c) : e;
                };
            }
        }
        H && define(function() {
            return o;
        });
    })(this);
})();
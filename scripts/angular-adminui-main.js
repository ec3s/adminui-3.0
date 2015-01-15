(function(window, angular, undefined) {
    "use strict";
    var directive = {};
    var service = {
        value: {}
    };
    var DEPENDENCIES = {
        "angular.js": "http://code.angularjs.org/" + angular.version.full + "/angular.min.js",
        "angular-resource.js": "http://code.angularjs.org/" + angular.version.full + "/angular-resource.min.js",
        "angular-sanitize.js": "http://code.angularjs.org/" + angular.version.full + "/angular-sanitize.min.js",
        "angular-cookies.js": "http://code.angularjs.org/" + angular.version.full + "/angular-cookies.min.js"
    };
    function escape(text) {
        return text.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/"/g, "&quot;");
    }
    function setHtmlIe8SafeWay(element, html) {
        var newElement = angular.element("<pre>" + html + "</pre>");
        element.html("");
        element.append(newElement.contents());
        return element;
    }
    directive.jsFiddle = function(getEmbeddedTemplate, escape, script) {
        return {
            terminal: true,
            link: function(scope, element, attr) {
                var name = "", stylesheet = '<link rel="stylesheet" href="http://twitter.github.com/bootstrap/assets/css/bootstrap.css">\n', fields = {
                    html: "",
                    css: "",
                    js: ""
                };
                angular.forEach(attr.jsFiddle.split(" "), function(file, index) {
                    var fileType = file.split(".")[1];
                    if (fileType == "html") {
                        if (index == 0) {
                            fields[fileType] += "<div ng-app" + (attr.module ? '="' + attr.module + '"' : "") + ">\n" + getEmbeddedTemplate(file, 2);
                        } else {
                            fields[fileType] += "\n\n\n  <!-- CACHE FILE: " + file + " -->\n" + '  <script type="text/ng-template" id="' + file + '">\n' + getEmbeddedTemplate(file, 4) + "  </script>\n";
                        }
                    } else {
                        fields[fileType] += getEmbeddedTemplate(file) + "\n";
                    }
                });
                fields.html += "</div>\n";
                setHtmlIe8SafeWay(element, '<form class="jsfiddle" method="post" action="http://jsfiddle.net/api/post/library/pure/" target="_blank">' + hiddenField("title", "AngularJS Example: " + name) + hiddenField("css", "</style> <!-- Ugly Hack due to jsFiddle issue: http://goo.gl/BUfGZ --> \n" + stylesheet + script.angular + (attr.resource ? script.resource : "") + "<style>\n" + fields.css) + hiddenField("html", fields.html) + hiddenField("js", fields.js) + '<button class="btn btn-primary"><i class="icon-white icon-pencil"></i> Edit Me</button>' + "</form>");
                function hiddenField(name, value) {
                    return '<input type="hidden" name="' + name + '" value="' + escape(value) + '">';
                }
            }
        };
    };
    directive.code = function() {
        return {
            restrict: "E",
            terminal: true
        };
    };
    directive.prettyprint = [ "reindentCode", function(reindentCode) {
        return {
            restrict: "C",
            terminal: true,
            compile: function(element) {
                element.html(window.prettyPrintOne(reindentCode(element.html()), undefined, true));
            }
        };
    } ];
    directive.ngSetText = [ "getEmbeddedTemplate", function(getEmbeddedTemplate) {
        return {
            restrict: "CA",
            priority: 10,
            compile: function(element, attr) {
                setHtmlIe8SafeWay(element, escape(getEmbeddedTemplate(attr.ngSetText)));
            }
        };
    } ];
    directive.ngHtmlWrap = [ "reindentCode", "templateMerge", function(reindentCode, templateMerge) {
        return {
            compile: function(element, attr) {
                var properties = {
                    head: "",
                    module: "",
                    body: element.text()
                }, html = "<!doctype html>\n<html ng-app{{module}}>\n  <head>\n{{head:4}}  </head>\n  <body>\n{{body:4}}  </body>\n</html>";
                angular.forEach((attr.ngHtmlWrap || "").split(" "), function(dep) {
                    if (!dep) return;
                    dep = DEPENDENCIES[dep] || dep;
                    var ext = dep.split(/\./).pop();
                    if (ext == "css") {
                        properties.head += '<link rel="stylesheet" href="' + dep + '" type="text/css">\n';
                    } else if (ext == "js") {
                        properties.head += '<script src="' + dep + '"></script>\n';
                    } else {
                        properties.module = '="' + dep + '"';
                    }
                });
                setHtmlIe8SafeWay(element, escape(templateMerge(html, properties)));
            }
        };
    } ];
    directive.ngSetHtml = [ "getEmbeddedTemplate", function(getEmbeddedTemplate) {
        return {
            restrict: "CA",
            priority: 10,
            compile: function(element, attr) {
                setHtmlIe8SafeWay(element, getEmbeddedTemplate(attr.ngSetHtml));
            }
        };
    } ];
    directive.ngEvalJavascript = [ "getEmbeddedTemplate", function(getEmbeddedTemplate) {
        return {
            compile: function(element, attr) {
                var script = getEmbeddedTemplate(attr.ngEvalJavascript);
                try {
                    if (window.execScript) {
                        window.execScript(script || '""');
                    } else {
                        window.eval(script);
                    }
                } catch (e) {
                    if (window.console) {
                        window.console.log(script, "\n", e);
                    } else {
                        window.alert(e);
                    }
                }
            }
        };
    } ];
    directive.ngEmbedApp = [ "$templateCache", "$browser", "$rootScope", "$location", function($templateCache, $browser, docsRootScope, $location) {
        return {
            terminal: true,
            link: function(scope, element, attrs) {
                var modules = [];
                modules.push([ "$provide", function($provide) {
                    $provide.value("$templateCache", $templateCache);
                    $provide.value("$anchorScroll", angular.noop);
                    $provide.value("$browser", $browser);
                    $provide.provider("$location", function() {
                        this.$get = [ "$rootScope", function($rootScope) {
                            docsRootScope.$on("$locationChangeSuccess", function(event, oldUrl, newUrl) {
                                $rootScope.$broadcast("$locationChangeSuccess", oldUrl, newUrl);
                            });
                            return $location;
                        } ];
                        this.html5Mode = angular.noop;
                    });
                    $provide.decorator("$timeout", [ "$rootScope", "$delegate", function($rootScope, $delegate) {
                        return angular.extend(function(fn, delay) {
                            if (delay && delay > 50) {
                                return setTimeout(function() {
                                    $rootScope.$apply(fn);
                                }, delay);
                            } else {
                                return $delegate.apply(this, arguments);
                            }
                        }, $delegate);
                    } ]);
                    $provide.decorator("$rootScope", [ "$delegate", function(embedRootScope) {
                        docsRootScope.$watch(function embedRootScopeDigestWatch() {
                            embedRootScope.$digest();
                        });
                        return embedRootScope;
                    } ]);
                } ]);
                if (attrs.ngEmbedApp) modules.push(attrs.ngEmbedApp);
                element.bind("click", function(event) {
                    if (event.target.attributes.getNamedItem("ng-click")) {
                        event.preventDefault();
                    }
                });
                angular.bootstrap(element, modules);
            }
        };
    } ];
    service.reindentCode = function() {
        return function(text, spaces) {
            if (!text) return text;
            var lines = text.split(/\r?\n/);
            var prefix = "      ".substr(0, spaces || 0);
            var i;
            while (lines.length && lines[0].match(/^\s*$/)) lines.shift();
            while (lines.length && lines[lines.length - 1].match(/^\s*$/)) lines.pop();
            var minIndent = 999;
            for (i = 0; i < lines.length; i++) {
                var line = lines[0];
                var reindentCode = line.match(/^\s*/)[0];
                if (reindentCode !== line && reindentCode.length < minIndent) {
                    minIndent = reindentCode.length;
                }
            }
            for (i = 0; i < lines.length; i++) {
                lines[i] = prefix + lines[i].substring(minIndent);
            }
            lines.push("");
            return lines.join("\n");
        };
    };
    service.templateMerge = [ "reindentCode", function(indentCode) {
        return function(template, properties) {
            return template.replace(/\{\{(\w+)(?:\:(\d+))?\}\}/g, function(_, key, indent) {
                var value = properties[key];
                if (indent) {
                    value = indentCode(value, indent);
                }
                return value == undefined ? "" : value;
            });
        };
    } ];
    service.getEmbeddedTemplate = [ "reindentCode", function(reindentCode) {
        return function(id) {
            var element = document.getElementById(id);
            if (!element) {
                return null;
            }
            return reindentCode(angular.element(element).html(), 0);
        };
    } ];
    angular.module("bootstrapPrettify", []).directive(directive).factory(service);
    window["PR_SHOULD_USE_CONTINUATION"] = true;
    var prettyPrintOne;
    var prettyPrint;
    (function() {
        var win = window;
        var FLOW_CONTROL_KEYWORDS = [ "break,continue,do,else,for,if,return,while" ];
        var C_KEYWORDS = [ FLOW_CONTROL_KEYWORDS, "auto,case,char,const,default," + "double,enum,extern,float,goto,int,long,register,short,signed,sizeof," + "static,struct,switch,typedef,union,unsigned,void,volatile" ];
        var COMMON_KEYWORDS = [ C_KEYWORDS, "catch,class,delete,false,import," + "new,operator,private,protected,public,this,throw,true,try,typeof" ];
        var CPP_KEYWORDS = [ COMMON_KEYWORDS, "alignof,align_union,asm,axiom,bool," + "concept,concept_map,const_cast,constexpr,decltype," + "dynamic_cast,explicit,export,friend,inline,late_check," + "mutable,namespace,nullptr,reinterpret_cast,static_assert,static_cast," + "template,typeid,typename,using,virtual,where" ];
        var JAVA_KEYWORDS = [ COMMON_KEYWORDS, "abstract,boolean,byte,extends,final,finally,implements,import," + "instanceof,null,native,package,strictfp,super,synchronized,throws," + "transient" ];
        var CSHARP_KEYWORDS = [ JAVA_KEYWORDS, "as,base,by,checked,decimal,delegate,descending,dynamic,event," + "fixed,foreach,from,group,implicit,in,interface,internal,into,is,let," + "lock,object,out,override,orderby,params,partial,readonly,ref,sbyte," + "sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort," + "var,virtual,where" ];
        var COFFEE_KEYWORDS = "all,and,by,catch,class,else,extends,false,finally," + "for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then," + "throw,true,try,unless,until,when,while,yes";
        var JSCRIPT_KEYWORDS = [ COMMON_KEYWORDS, "debugger,eval,export,function,get,null,set,undefined,var,with," + "Infinity,NaN" ];
        var PERL_KEYWORDS = "caller,delete,die,do,dump,elsif,eval,exit,foreach,for," + "goto,if,import,last,local,my,next,no,our,print,package,redo,require," + "sub,undef,unless,until,use,wantarray,while,BEGIN,END";
        var PYTHON_KEYWORDS = [ FLOW_CONTROL_KEYWORDS, "and,as,assert,class,def,del," + "elif,except,exec,finally,from,global,import,in,is,lambda," + "nonlocal,not,or,pass,print,raise,try,with,yield," + "False,True,None" ];
        var RUBY_KEYWORDS = [ FLOW_CONTROL_KEYWORDS, "alias,and,begin,case,class," + "def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo," + "rescue,retry,self,super,then,true,undef,unless,until,when,yield," + "BEGIN,END" ];
        var SH_KEYWORDS = [ FLOW_CONTROL_KEYWORDS, "case,done,elif,esac,eval,fi," + "function,in,local,set,then,until" ];
        var ALL_KEYWORDS = [ CPP_KEYWORDS, CSHARP_KEYWORDS, JSCRIPT_KEYWORDS, PERL_KEYWORDS + PYTHON_KEYWORDS, RUBY_KEYWORDS, SH_KEYWORDS ];
        var C_TYPES = /^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)\b/;
        var PR_STRING = "str";
        var PR_KEYWORD = "kwd";
        var PR_COMMENT = "com";
        var PR_TYPE = "typ";
        var PR_LITERAL = "lit";
        var PR_PUNCTUATION = "pun";
        var PR_PLAIN = "pln";
        var PR_TAG = "tag";
        var PR_DECLARATION = "dec";
        var PR_SOURCE = "src";
        var PR_ATTRIB_NAME = "atn";
        var PR_ATTRIB_VALUE = "atv";
        var PR_NOCODE = "nocode";
        var REGEXP_PRECEDER_PATTERN = "(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*";
        function combinePrefixPatterns(regexs) {
            var capturedGroupIndex = 0;
            var needToFoldCase = false;
            var ignoreCase = false;
            for (var i = 0, n = regexs.length; i < n; ++i) {
                var regex = regexs[i];
                if (regex.ignoreCase) {
                    ignoreCase = true;
                } else if (/[a-z]/i.test(regex.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi, ""))) {
                    needToFoldCase = true;
                    ignoreCase = false;
                    break;
                }
            }
            var escapeCharToCodeUnit = {
                b: 8,
                t: 9,
                n: 10,
                v: 11,
                f: 12,
                r: 13
            };
            function decodeEscape(charsetPart) {
                var cc0 = charsetPart.charCodeAt(0);
                if (cc0 !== 92) {
                    return cc0;
                }
                var c1 = charsetPart.charAt(1);
                cc0 = escapeCharToCodeUnit[c1];
                if (cc0) {
                    return cc0;
                } else if ("0" <= c1 && c1 <= "7") {
                    return parseInt(charsetPart.substring(1), 8);
                } else if (c1 === "u" || c1 === "x") {
                    return parseInt(charsetPart.substring(2), 16);
                } else {
                    return charsetPart.charCodeAt(1);
                }
            }
            function encodeEscape(charCode) {
                if (charCode < 32) {
                    return (charCode < 16 ? "\\x0" : "\\x") + charCode.toString(16);
                }
                var ch = String.fromCharCode(charCode);
                return ch === "\\" || ch === "-" || ch === "]" || ch === "^" ? "\\" + ch : ch;
            }
            function caseFoldCharset(charSet) {
                var charsetParts = charSet.substring(1, charSet.length - 1).match(new RegExp("\\\\u[0-9A-Fa-f]{4}" + "|\\\\x[0-9A-Fa-f]{2}" + "|\\\\[0-3][0-7]{0,2}" + "|\\\\[0-7]{1,2}" + "|\\\\[\\s\\S]" + "|-" + "|[^-\\\\]", "g"));
                var ranges = [];
                var inverse = charsetParts[0] === "^";
                var out = [ "[" ];
                if (inverse) {
                    out.push("^");
                }
                for (var i = inverse ? 1 : 0, n = charsetParts.length; i < n; ++i) {
                    var p = charsetParts[i];
                    if (/\\[bdsw]/i.test(p)) {
                        out.push(p);
                    } else {
                        var start = decodeEscape(p);
                        var end;
                        if (i + 2 < n && "-" === charsetParts[i + 1]) {
                            end = decodeEscape(charsetParts[i + 2]);
                            i += 2;
                        } else {
                            end = start;
                        }
                        ranges.push([ start, end ]);
                        if (!(end < 65 || start > 122)) {
                            if (!(end < 65 || start > 90)) {
                                ranges.push([ Math.max(65, start) | 32, Math.min(end, 90) | 32 ]);
                            }
                            if (!(end < 97 || start > 122)) {
                                ranges.push([ Math.max(97, start) & ~32, Math.min(end, 122) & ~32 ]);
                            }
                        }
                    }
                }
                ranges.sort(function(a, b) {
                    return a[0] - b[0] || b[1] - a[1];
                });
                var consolidatedRanges = [];
                var lastRange = [];
                for (var i = 0; i < ranges.length; ++i) {
                    var range = ranges[i];
                    if (range[0] <= lastRange[1] + 1) {
                        lastRange[1] = Math.max(lastRange[1], range[1]);
                    } else {
                        consolidatedRanges.push(lastRange = range);
                    }
                }
                for (var i = 0; i < consolidatedRanges.length; ++i) {
                    var range = consolidatedRanges[i];
                    out.push(encodeEscape(range[0]));
                    if (range[1] > range[0]) {
                        if (range[1] + 1 > range[0]) {
                            out.push("-");
                        }
                        out.push(encodeEscape(range[1]));
                    }
                }
                out.push("]");
                return out.join("");
            }
            function allowAnywhereFoldCaseAndRenumberGroups(regex) {
                var parts = regex.source.match(new RegExp("(?:" + "\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]" + "|\\\\u[A-Fa-f0-9]{4}" + "|\\\\x[A-Fa-f0-9]{2}" + "|\\\\[0-9]+" + "|\\\\[^ux0-9]" + "|\\(\\?[:!=]" + "|[\\(\\)\\^]" + "|[^\\x5B\\x5C\\(\\)\\^]+" + ")", "g"));
                var n = parts.length;
                var capturedGroups = [];
                for (var i = 0, groupIndex = 0; i < n; ++i) {
                    var p = parts[i];
                    if (p === "(") {
                        ++groupIndex;
                    } else if ("\\" === p.charAt(0)) {
                        var decimalValue = +p.substring(1);
                        if (decimalValue) {
                            if (decimalValue <= groupIndex) {
                                capturedGroups[decimalValue] = -1;
                            } else {
                                parts[i] = encodeEscape(decimalValue);
                            }
                        }
                    }
                }
                for (var i = 1; i < capturedGroups.length; ++i) {
                    if (-1 === capturedGroups[i]) {
                        capturedGroups[i] = ++capturedGroupIndex;
                    }
                }
                for (var i = 0, groupIndex = 0; i < n; ++i) {
                    var p = parts[i];
                    if (p === "(") {
                        ++groupIndex;
                        if (!capturedGroups[groupIndex]) {
                            parts[i] = "(?:";
                        }
                    } else if ("\\" === p.charAt(0)) {
                        var decimalValue = +p.substring(1);
                        if (decimalValue && decimalValue <= groupIndex) {
                            parts[i] = "\\" + capturedGroups[decimalValue];
                        }
                    }
                }
                for (var i = 0; i < n; ++i) {
                    if ("^" === parts[i] && "^" !== parts[i + 1]) {
                        parts[i] = "";
                    }
                }
                if (regex.ignoreCase && needToFoldCase) {
                    for (var i = 0; i < n; ++i) {
                        var p = parts[i];
                        var ch0 = p.charAt(0);
                        if (p.length >= 2 && ch0 === "[") {
                            parts[i] = caseFoldCharset(p);
                        } else if (ch0 !== "\\") {
                            parts[i] = p.replace(/[a-zA-Z]/g, function(ch) {
                                var cc = ch.charCodeAt(0);
                                return "[" + String.fromCharCode(cc & ~32, cc | 32) + "]";
                            });
                        }
                    }
                }
                return parts.join("");
            }
            var rewritten = [];
            for (var i = 0, n = regexs.length; i < n; ++i) {
                var regex = regexs[i];
                if (regex.global || regex.multiline) {
                    throw new Error("" + regex);
                }
                rewritten.push("(?:" + allowAnywhereFoldCaseAndRenumberGroups(regex) + ")");
            }
            return new RegExp(rewritten.join("|"), ignoreCase ? "gi" : "g");
        }
        function extractSourceSpans(node, isPreformatted) {
            var nocode = /(?:^|\s)nocode(?:\s|$)/;
            var chunks = [];
            var length = 0;
            var spans = [];
            var k = 0;
            function walk(node) {
                switch (node.nodeType) {
                  case 1:
                    if (nocode.test(node.className)) {
                        return;
                    }
                    for (var child = node.firstChild; child; child = child.nextSibling) {
                        walk(child);
                    }
                    var nodeName = node.nodeName.toLowerCase();
                    if ("br" === nodeName || "li" === nodeName) {
                        chunks[k] = "\n";
                        spans[k << 1] = length++;
                        spans[k++ << 1 | 1] = node;
                    }
                    break;

                  case 3:
                  case 4:
                    var text = node.nodeValue;
                    if (text.length) {
                        if (!isPreformatted) {
                            text = text.replace(/[ \t\r\n]+/g, " ");
                        } else {
                            text = text.replace(/\r\n?/g, "\n");
                        }
                        chunks[k] = text;
                        spans[k << 1] = length;
                        length += text.length;
                        spans[k++ << 1 | 1] = node;
                    }
                    break;
                }
            }
            walk(node);
            return {
                sourceCode: chunks.join("").replace(/\n$/, ""),
                spans: spans
            };
        }
        function appendDecorations(basePos, sourceCode, langHandler, out) {
            if (!sourceCode) {
                return;
            }
            var job = {
                sourceCode: sourceCode,
                basePos: basePos
            };
            langHandler(job);
            out.push.apply(out, job.decorations);
        }
        var notWs = /\S/;
        function childContentWrapper(element) {
            var wrapper = undefined;
            for (var c = element.firstChild; c; c = c.nextSibling) {
                var type = c.nodeType;
                wrapper = type === 1 ? wrapper ? element : c : type === 3 ? notWs.test(c.nodeValue) ? element : wrapper : wrapper;
            }
            return wrapper === element ? undefined : wrapper;
        }
        function createSimpleLexer(shortcutStylePatterns, fallthroughStylePatterns) {
            var shortcuts = {};
            var tokenizer;
            (function() {
                var allPatterns = shortcutStylePatterns.concat(fallthroughStylePatterns);
                var allRegexs = [];
                var regexKeys = {};
                for (var i = 0, n = allPatterns.length; i < n; ++i) {
                    var patternParts = allPatterns[i];
                    var shortcutChars = patternParts[3];
                    if (shortcutChars) {
                        for (var c = shortcutChars.length; --c >= 0; ) {
                            shortcuts[shortcutChars.charAt(c)] = patternParts;
                        }
                    }
                    var regex = patternParts[1];
                    var k = "" + regex;
                    if (!regexKeys.hasOwnProperty(k)) {
                        allRegexs.push(regex);
                        regexKeys[k] = null;
                    }
                }
                allRegexs.push(/[\0-\uffff]/);
                tokenizer = combinePrefixPatterns(allRegexs);
            })();
            var nPatterns = fallthroughStylePatterns.length;
            var decorate = function(job) {
                var sourceCode = job.sourceCode, basePos = job.basePos;
                var decorations = [ basePos, PR_PLAIN ];
                var pos = 0;
                var tokens = sourceCode.match(tokenizer) || [];
                var styleCache = {};
                for (var ti = 0, nTokens = tokens.length; ti < nTokens; ++ti) {
                    var token = tokens[ti];
                    var style = styleCache[token];
                    var match = void 0;
                    var isEmbedded;
                    if (typeof style === "string") {
                        isEmbedded = false;
                    } else {
                        var patternParts = shortcuts[token.charAt(0)];
                        if (patternParts) {
                            match = token.match(patternParts[1]);
                            style = patternParts[0];
                        } else {
                            for (var i = 0; i < nPatterns; ++i) {
                                patternParts = fallthroughStylePatterns[i];
                                match = token.match(patternParts[1]);
                                if (match) {
                                    style = patternParts[0];
                                    break;
                                }
                            }
                            if (!match) {
                                style = PR_PLAIN;
                            }
                        }
                        isEmbedded = style.length >= 5 && "lang-" === style.substring(0, 5);
                        if (isEmbedded && !(match && typeof match[1] === "string")) {
                            isEmbedded = false;
                            style = PR_SOURCE;
                        }
                        if (!isEmbedded) {
                            styleCache[token] = style;
                        }
                    }
                    var tokenStart = pos;
                    pos += token.length;
                    if (!isEmbedded) {
                        decorations.push(basePos + tokenStart, style);
                    } else {
                        var embeddedSource = match[1];
                        var embeddedSourceStart = token.indexOf(embeddedSource);
                        var embeddedSourceEnd = embeddedSourceStart + embeddedSource.length;
                        if (match[2]) {
                            embeddedSourceEnd = token.length - match[2].length;
                            embeddedSourceStart = embeddedSourceEnd - embeddedSource.length;
                        }
                        var lang = style.substring(5);
                        appendDecorations(basePos + tokenStart, token.substring(0, embeddedSourceStart), decorate, decorations);
                        appendDecorations(basePos + tokenStart + embeddedSourceStart, embeddedSource, langHandlerForExtension(lang, embeddedSource), decorations);
                        appendDecorations(basePos + tokenStart + embeddedSourceEnd, token.substring(embeddedSourceEnd), decorate, decorations);
                    }
                }
                job.decorations = decorations;
            };
            return decorate;
        }
        function sourceDecorator(options) {
            var shortcutStylePatterns = [], fallthroughStylePatterns = [];
            if (options["tripleQuotedStrings"]) {
                shortcutStylePatterns.push([ PR_STRING, /^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/, null, "'\"" ]);
            } else if (options["multiLineStrings"]) {
                shortcutStylePatterns.push([ PR_STRING, /^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/, null, "'\"`" ]);
            } else {
                shortcutStylePatterns.push([ PR_STRING, /^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/, null, "\"'" ]);
            }
            if (options["verbatimStrings"]) {
                fallthroughStylePatterns.push([ PR_STRING, /^@\"(?:[^\"]|\"\")*(?:\"|$)/, null ]);
            }
            var hc = options["hashComments"];
            if (hc) {
                if (options["cStyleComments"]) {
                    if (hc > 1) {
                        shortcutStylePatterns.push([ PR_COMMENT, /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, null, "#" ]);
                    } else {
                        shortcutStylePatterns.push([ PR_COMMENT, /^#(?:(?:define|elif|else|endif|error|ifdef|include|ifndef|line|pragma|undef|warning)\b|[^\r\n]*)/, null, "#" ]);
                    }
                    fallthroughStylePatterns.push([ PR_STRING, /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/, null ]);
                } else {
                    shortcutStylePatterns.push([ PR_COMMENT, /^#[^\r\n]*/, null, "#" ]);
                }
            }
            if (options["cStyleComments"]) {
                fallthroughStylePatterns.push([ PR_COMMENT, /^\/\/[^\r\n]*/, null ]);
                fallthroughStylePatterns.push([ PR_COMMENT, /^\/\*[\s\S]*?(?:\*\/|$)/, null ]);
            }
            if (options["regexLiterals"]) {
                var REGEX_LITERAL = "/(?=[^/*])" + "(?:[^/\\x5B\\x5C]" + "|\\x5C[\\s\\S]" + "|\\x5B(?:[^\\x5C\\x5D]|\\x5C[\\s\\S])*(?:\\x5D|$))+" + "/";
                fallthroughStylePatterns.push([ "lang-regex", new RegExp("^" + REGEXP_PRECEDER_PATTERN + "(" + REGEX_LITERAL + ")") ]);
            }
            var types = options["types"];
            if (types) {
                fallthroughStylePatterns.push([ PR_TYPE, types ]);
            }
            var keywords = ("" + options["keywords"]).replace(/^ | $/g, "");
            if (keywords.length) {
                fallthroughStylePatterns.push([ PR_KEYWORD, new RegExp("^(?:" + keywords.replace(/[\s,]+/g, "|") + ")\\b"), null ]);
            }
            shortcutStylePatterns.push([ PR_PLAIN, /^\s+/, null, " \r\n	 " ]);
            fallthroughStylePatterns.push([ PR_LITERAL, /^@[a-z_$][a-z_$@0-9]*/i, null ], [ PR_TYPE, /^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/, null ], [ PR_PLAIN, /^[a-z_$][a-z_$@0-9]*/i, null ], [ PR_LITERAL, new RegExp("^(?:" + "0x[a-f0-9]+" + "|(?:\\d(?:_\\d+)*\\d*(?:\\.\\d*)?|\\.\\d\\+)" + "(?:e[+\\-]?\\d+)?" + ")" + "[a-z]*", "i"), null, "0123456789" ], [ PR_PLAIN, /^\\[\s\S]?/, null ], [ PR_PUNCTUATION, /^.[^\s\w\.$@\'\"\`\/\#\\]*/, null ]);
            return createSimpleLexer(shortcutStylePatterns, fallthroughStylePatterns);
        }
        var decorateSource = sourceDecorator({
            keywords: ALL_KEYWORDS,
            hashComments: true,
            cStyleComments: true,
            multiLineStrings: true,
            regexLiterals: true
        });
        function numberLines(node, opt_startLineNum, isPreformatted) {
            var nocode = /(?:^|\s)nocode(?:\s|$)/;
            var lineBreak = /\r\n?|\n/;
            var document = node.ownerDocument;
            var li = document.createElement("li");
            while (node.firstChild) {
                li.appendChild(node.firstChild);
            }
            var listItems = [ li ];
            function walk(node) {
                switch (node.nodeType) {
                  case 1:
                    if (nocode.test(node.className)) {
                        break;
                    }
                    if ("br" === node.nodeName) {
                        breakAfter(node);
                        if (node.parentNode) {
                            node.parentNode.removeChild(node);
                        }
                    } else {
                        for (var child = node.firstChild; child; child = child.nextSibling) {
                            walk(child);
                        }
                    }
                    break;

                  case 3:
                  case 4:
                    if (isPreformatted) {
                        var text = node.nodeValue;
                        var match = text.match(lineBreak);
                        if (match) {
                            var firstLine = text.substring(0, match.index);
                            node.nodeValue = firstLine;
                            var tail = text.substring(match.index + match[0].length);
                            if (tail) {
                                var parent = node.parentNode;
                                parent.insertBefore(document.createTextNode(tail), node.nextSibling);
                            }
                            breakAfter(node);
                            if (!firstLine) {
                                node.parentNode.removeChild(node);
                            }
                        }
                    }
                    break;
                }
            }
            function breakAfter(lineEndNode) {
                while (!lineEndNode.nextSibling) {
                    lineEndNode = lineEndNode.parentNode;
                    if (!lineEndNode) {
                        return;
                    }
                }
                function breakLeftOf(limit, copy) {
                    var rightSide = copy ? limit.cloneNode(false) : limit;
                    var parent = limit.parentNode;
                    if (parent) {
                        var parentClone = breakLeftOf(parent, 1);
                        var next = limit.nextSibling;
                        parentClone.appendChild(rightSide);
                        for (var sibling = next; sibling; sibling = next) {
                            next = sibling.nextSibling;
                            parentClone.appendChild(sibling);
                        }
                    }
                    return rightSide;
                }
                var copiedListItem = breakLeftOf(lineEndNode.nextSibling, 0);
                for (var parent; (parent = copiedListItem.parentNode) && parent.nodeType === 1; ) {
                    copiedListItem = parent;
                }
                listItems.push(copiedListItem);
            }
            for (var i = 0; i < listItems.length; ++i) {
                walk(listItems[i]);
            }
            if (opt_startLineNum === (opt_startLineNum | 0)) {
                listItems[0].setAttribute("value", opt_startLineNum);
            }
            var ol = document.createElement("ol");
            ol.className = "linenums";
            var offset = Math.max(0, opt_startLineNum - 1 | 0) || 0;
            for (var i = 0, n = listItems.length; i < n; ++i) {
                li = listItems[i];
                li.className = "L" + (i + offset) % 10;
                if (!li.firstChild) {
                    li.appendChild(document.createTextNode(" "));
                }
                ol.appendChild(li);
            }
            node.appendChild(ol);
        }
        function recombineTagsAndDecorations(job) {
            var isIE8OrEarlier = /\bMSIE\s(\d+)/.exec(navigator.userAgent);
            isIE8OrEarlier = isIE8OrEarlier && +isIE8OrEarlier[1] <= 8;
            var newlineRe = /\n/g;
            var source = job.sourceCode;
            var sourceLength = source.length;
            var sourceIndex = 0;
            var spans = job.spans;
            var nSpans = spans.length;
            var spanIndex = 0;
            var decorations = job.decorations;
            var nDecorations = decorations.length;
            var decorationIndex = 0;
            decorations[nDecorations] = sourceLength;
            var decPos, i;
            for (i = decPos = 0; i < nDecorations; ) {
                if (decorations[i] !== decorations[i + 2]) {
                    decorations[decPos++] = decorations[i++];
                    decorations[decPos++] = decorations[i++];
                } else {
                    i += 2;
                }
            }
            nDecorations = decPos;
            for (i = decPos = 0; i < nDecorations; ) {
                var startPos = decorations[i];
                var startDec = decorations[i + 1];
                var end = i + 2;
                while (end + 2 <= nDecorations && decorations[end + 1] === startDec) {
                    end += 2;
                }
                decorations[decPos++] = startPos;
                decorations[decPos++] = startDec;
                i = end;
            }
            nDecorations = decorations.length = decPos;
            var sourceNode = job.sourceNode;
            var oldDisplay;
            if (sourceNode) {
                oldDisplay = sourceNode.style.display;
                sourceNode.style.display = "none";
            }
            try {
                var decoration = null;
                while (spanIndex < nSpans) {
                    var spanStart = spans[spanIndex];
                    var spanEnd = spans[spanIndex + 2] || sourceLength;
                    var decEnd = decorations[decorationIndex + 2] || sourceLength;
                    var end = Math.min(spanEnd, decEnd);
                    var textNode = spans[spanIndex + 1];
                    var styledText;
                    if (textNode.nodeType !== 1 && (styledText = source.substring(sourceIndex, end))) {
                        if (isIE8OrEarlier) {
                            styledText = styledText.replace(newlineRe, "\r");
                        }
                        textNode.nodeValue = styledText;
                        var document = textNode.ownerDocument;
                        var span = document.createElement("span");
                        span.className = decorations[decorationIndex + 1];
                        var parentNode = textNode.parentNode;
                        parentNode.replaceChild(span, textNode);
                        span.appendChild(textNode);
                        if (sourceIndex < spanEnd) {
                            spans[spanIndex + 1] = textNode = document.createTextNode(source.substring(end, spanEnd));
                            parentNode.insertBefore(textNode, span.nextSibling);
                        }
                    }
                    sourceIndex = end;
                    if (sourceIndex >= spanEnd) {
                        spanIndex += 2;
                    }
                    if (sourceIndex >= decEnd) {
                        decorationIndex += 2;
                    }
                }
            } finally {
                if (sourceNode) {
                    sourceNode.style.display = oldDisplay;
                }
            }
        }
        var langHandlerRegistry = {};
        function registerLangHandler(handler, fileExtensions) {
            for (var i = fileExtensions.length; --i >= 0; ) {
                var ext = fileExtensions[i];
                if (!langHandlerRegistry.hasOwnProperty(ext)) {
                    langHandlerRegistry[ext] = handler;
                } else if (win["console"]) {
                    console["warn"]("cannot override language handler %s", ext);
                }
            }
        }
        function langHandlerForExtension(extension, source) {
            if (!(extension && langHandlerRegistry.hasOwnProperty(extension))) {
                extension = /^\s*</.test(source) ? "default-markup" : "default-code";
            }
            return langHandlerRegistry[extension];
        }
        registerLangHandler(decorateSource, [ "default-code" ]);
        registerLangHandler(createSimpleLexer([], [ [ PR_PLAIN, /^[^<?]+/ ], [ PR_DECLARATION, /^<!\w[^>]*(?:>|$)/ ], [ PR_COMMENT, /^<\!--[\s\S]*?(?:-\->|$)/ ], [ "lang-", /^<\?([\s\S]+?)(?:\?>|$)/ ], [ "lang-", /^<%([\s\S]+?)(?:%>|$)/ ], [ PR_PUNCTUATION, /^(?:<[%?]|[%?]>)/ ], [ "lang-", /^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i ], [ "lang-js", /^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i ], [ "lang-css", /^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i ], [ "lang-in.tag", /^(<\/?[a-z][^<>]*>)/i ] ]), [ "default-markup", "htm", "html", "mxml", "xhtml", "xml", "xsl" ]);
        registerLangHandler(createSimpleLexer([ [ PR_PLAIN, /^[\s]+/, null, " 	\r\n" ], [ PR_ATTRIB_VALUE, /^(?:\"[^\"]*\"?|\'[^\']*\'?)/, null, "\"'" ] ], [ [ PR_TAG, /^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i ], [ PR_ATTRIB_NAME, /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i ], [ "lang-uq.val", /^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/ ], [ PR_PUNCTUATION, /^[=<>\/]+/ ], [ "lang-js", /^on\w+\s*=\s*\"([^\"]+)\"/i ], [ "lang-js", /^on\w+\s*=\s*\'([^\']+)\'/i ], [ "lang-js", /^on\w+\s*=\s*([^\"\'>\s]+)/i ], [ "lang-css", /^style\s*=\s*\"([^\"]+)\"/i ], [ "lang-css", /^style\s*=\s*\'([^\']+)\'/i ], [ "lang-css", /^style\s*=\s*([^\"\'>\s]+)/i ] ]), [ "in.tag" ]);
        registerLangHandler(createSimpleLexer([], [ [ PR_ATTRIB_VALUE, /^[\s\S]+/ ] ]), [ "uq.val" ]);
        registerLangHandler(sourceDecorator({
            keywords: CPP_KEYWORDS,
            hashComments: true,
            cStyleComments: true,
            types: C_TYPES
        }), [ "c", "cc", "cpp", "cxx", "cyc", "m" ]);
        registerLangHandler(sourceDecorator({
            keywords: "null,true,false"
        }), [ "json" ]);
        registerLangHandler(sourceDecorator({
            keywords: CSHARP_KEYWORDS,
            hashComments: true,
            cStyleComments: true,
            verbatimStrings: true,
            types: C_TYPES
        }), [ "cs" ]);
        registerLangHandler(sourceDecorator({
            keywords: JAVA_KEYWORDS,
            cStyleComments: true
        }), [ "java" ]);
        registerLangHandler(sourceDecorator({
            keywords: SH_KEYWORDS,
            hashComments: true,
            multiLineStrings: true
        }), [ "bsh", "csh", "sh" ]);
        registerLangHandler(sourceDecorator({
            keywords: PYTHON_KEYWORDS,
            hashComments: true,
            multiLineStrings: true,
            tripleQuotedStrings: true
        }), [ "cv", "py" ]);
        registerLangHandler(sourceDecorator({
            keywords: PERL_KEYWORDS,
            hashComments: true,
            multiLineStrings: true,
            regexLiterals: true
        }), [ "perl", "pl", "pm" ]);
        registerLangHandler(sourceDecorator({
            keywords: RUBY_KEYWORDS,
            hashComments: true,
            multiLineStrings: true,
            regexLiterals: true
        }), [ "rb" ]);
        registerLangHandler(sourceDecorator({
            keywords: JSCRIPT_KEYWORDS,
            cStyleComments: true,
            regexLiterals: true
        }), [ "js" ]);
        registerLangHandler(sourceDecorator({
            keywords: COFFEE_KEYWORDS,
            hashComments: 3,
            cStyleComments: true,
            multilineStrings: true,
            tripleQuotedStrings: true,
            regexLiterals: true
        }), [ "coffee" ]);
        registerLangHandler(createSimpleLexer([], [ [ PR_STRING, /^[\s\S]+/ ] ]), [ "regex" ]);
        function applyDecorator(job) {
            var opt_langExtension = job.langExtension;
            try {
                var sourceAndSpans = extractSourceSpans(job.sourceNode, job.pre);
                var source = sourceAndSpans.sourceCode;
                job.sourceCode = source;
                job.spans = sourceAndSpans.spans;
                job.basePos = 0;
                langHandlerForExtension(opt_langExtension, source)(job);
                recombineTagsAndDecorations(job);
            } catch (e) {
                if (win["console"]) {
                    console["log"](e && e["stack"] ? e["stack"] : e);
                }
            }
        }
        function prettyPrintOne(sourceCodeHtml, opt_langExtension, opt_numberLines) {
            var container = document.createElement("div");
            container.innerHTML = "<pre>" + sourceCodeHtml + "</pre>";
            container = container.firstChild;
            if (opt_numberLines) {
                numberLines(container, opt_numberLines, true);
            }
            var job = {
                langExtension: opt_langExtension,
                numberLines: opt_numberLines,
                sourceNode: container,
                pre: 1
            };
            applyDecorator(job);
            return container.innerHTML;
        }
        function prettyPrint(opt_whenDone) {
            function byTagName(tn) {
                return document.getElementsByTagName(tn);
            }
            var codeSegments = [ byTagName("pre"), byTagName("code"), byTagName("xmp") ];
            var elements = [];
            for (var i = 0; i < codeSegments.length; ++i) {
                for (var j = 0, n = codeSegments[i].length; j < n; ++j) {
                    elements.push(codeSegments[i][j]);
                }
            }
            codeSegments = null;
            var clock = Date;
            if (!clock["now"]) {
                clock = {
                    now: function() {
                        return +new Date();
                    }
                };
            }
            var k = 0;
            var prettyPrintingJob;
            var langExtensionRe = /\blang(?:uage)?-([\w.]+)(?!\S)/;
            var prettyPrintRe = /\bprettyprint\b/;
            var prettyPrintedRe = /\bprettyprinted\b/;
            var preformattedTagNameRe = /pre|xmp/i;
            var codeRe = /^code$/i;
            var preCodeXmpRe = /^(?:pre|code|xmp)$/i;
            function doWork() {
                var endTime = win["PR_SHOULD_USE_CONTINUATION"] ? clock["now"]() + 250 : Infinity;
                for (;k < elements.length && clock["now"]() < endTime; k++) {
                    var cs = elements[k];
                    var className = cs.className;
                    if (prettyPrintRe.test(className) && !prettyPrintedRe.test(className)) {
                        var nested = false;
                        for (var p = cs.parentNode; p; p = p.parentNode) {
                            var tn = p.tagName;
                            if (preCodeXmpRe.test(tn) && p.className && prettyPrintRe.test(p.className)) {
                                nested = true;
                                break;
                            }
                        }
                        if (!nested) {
                            cs.className += " prettyprinted";
                            var langExtension = className.match(langExtensionRe);
                            var wrapper;
                            if (!langExtension && (wrapper = childContentWrapper(cs)) && codeRe.test(wrapper.tagName)) {
                                langExtension = wrapper.className.match(langExtensionRe);
                            }
                            if (langExtension) {
                                langExtension = langExtension[1];
                            }
                            var preformatted;
                            if (preformattedTagNameRe.test(cs.tagName)) {
                                preformatted = 1;
                            } else {
                                var currentStyle = cs["currentStyle"];
                                var whitespace = currentStyle ? currentStyle["whiteSpace"] : document.defaultView && document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(cs, null).getPropertyValue("white-space") : 0;
                                preformatted = whitespace && "pre" === whitespace.substring(0, 3);
                            }
                            var lineNums = cs.className.match(/\blinenums\b(?::(\d+))?/);
                            lineNums = lineNums ? lineNums[1] && lineNums[1].length ? +lineNums[1] : true : false;
                            if (lineNums) {
                                numberLines(cs, lineNums, preformatted);
                            }
                            prettyPrintingJob = {
                                langExtension: langExtension,
                                sourceNode: cs,
                                numberLines: lineNums,
                                pre: preformatted
                            };
                            applyDecorator(prettyPrintingJob);
                        }
                    }
                }
                if (k < elements.length) {
                    setTimeout(doWork, 250);
                } else if (opt_whenDone) {
                    opt_whenDone();
                }
            }
            doWork();
        }
        var PR = win["PR"] = {
            createSimpleLexer: createSimpleLexer,
            registerLangHandler: registerLangHandler,
            sourceDecorator: sourceDecorator,
            PR_ATTRIB_NAME: PR_ATTRIB_NAME,
            PR_ATTRIB_VALUE: PR_ATTRIB_VALUE,
            PR_COMMENT: PR_COMMENT,
            PR_DECLARATION: PR_DECLARATION,
            PR_KEYWORD: PR_KEYWORD,
            PR_LITERAL: PR_LITERAL,
            PR_NOCODE: PR_NOCODE,
            PR_PLAIN: PR_PLAIN,
            PR_PUNCTUATION: PR_PUNCTUATION,
            PR_SOURCE: PR_SOURCE,
            PR_STRING: PR_STRING,
            PR_TAG: PR_TAG,
            PR_TYPE: PR_TYPE,
            prettyPrintOne: win["prettyPrintOne"] = prettyPrintOne,
            prettyPrint: win["prettyPrint"] = prettyPrint
        };
        if (typeof define === "function" && define["amd"]) {
            define("google-code-prettify", [], function() {
                return PR;
            });
        }
    })();
})(window, window.angular);

angular.element(document).find("head").append('<style type="text/css">.com{color:#93a1a1;}.lit{color:#195f91;}.pun,.opn,.clo{color:#93a1a1;}.fun{color:#dc322f;}.str,.atv{color:#D14;}.kwd,.linenums .tag{color:#1e347b;}.typ,.atn,.dec,.var{color:teal;}.pln{color:#48484c;}.prettyprint{padding:8px;background-color:#f7f7f9;border:1px solid #e1e1e8;}.prettyprint.linenums{-webkit-box-shadow:inset 40px 0 0 #fbfbfc,inset 41px 0 0 #ececf0;-moz-box-shadow:inset 40px 0 0 #fbfbfc,inset 41px 0 0 #ececf0;box-shadow:inset 40px 0 0 #fbfbfc,inset 41px 0 0 #ececf0;}ol.linenums{margin:0 0 0 33px;}ol.linenums li{padding-left:12px;color:#bebec5;line-height:18px;text-shadow:0 1px 0 #fff;}</style>');

"use strict";

var adminuiApp = angular.module("adminuiApp", [ "ngRoute", "ntd.services", "ntd.directives", "ui.bootstrap", "bootstrapPrettify" ]);

adminuiApp.run([ "$rootScope", function($rootScope) {
    $rootScope.userInfo = {
        username: "N/A"
    };
    $rootScope.pluginInfo = {
        template: '<div><input placeholder="插件演示" style="margin: 2px 0" class="form-control input-sm" type="text"/></div>'
    };
} ]);

angular.module("ntd.directives").constant("SYS", {
    host: "http://sys.systems.dev.me"
});

angular.module("ntd.directives").config([ "adminuiFrameProvider", function(adminuiFrameProvider) {
    adminuiFrameProvider.setConfig({
        defaultShowSubmenu: true,
        showMessageBox: true,
        navigation: {
            code: "adminui",
            name: "AdminUI",
            url: null,
            children: [ {
                name: "用户面板",
                url: "#/",
                children: [ {
                    name: "用户面板",
                    url: "#/",
                    children: null
                }, {
                    name: "子菜单",
                    url: null,
                    children: [ {
                        name: "分类一",
                        url: "#/sub/test",
                        children: null
                    }, {
                        name: "分类二",
                        url: "#/sub/test2",
                        children: null
                    }, {
                        name: "分类三",
                        url: "#/sub/test3",
                        children: null
                    } ]
                } ]
            }, {
                name: "组件样式",
                url: "#/base-css",
                children: [ {
                    name: "基本样式",
                    url: "#/base-css",
                    children: null
                }, {
                    name: "表格样式",
                    url: "#/table",
                    children: null
                }, {
                    name: "表单样式",
                    url: "#/form",
                    children: null
                } ]
            }, {
                name: "UI组件",
                url: "#/widget",
                children: [ {
                    name: "Admin UI组件",
                    params: {
                        id: "@id",
                        aid: "@aaa"
                    },
                    url: "#/widget",
                    match: "/widget*",
                    children: null
                }, {
                    name: "Bootstrap组件",
                    url: "#/bootstrap-ui-widget",
                    children: null
                }, {
                    name: "timeLine组件",
                    url: "#/time-line",
                    children: null
                }, {
                    name: "ECharts组件",
                    url: "#/eCharts",
                    children: null
                } ]
            }, {
                name: "其他页面",
                url: "#/login",
                children: [ {
                    name: "登录页面",
                    url: "#/login",
                    children: null
                }, {
                    name: "404页面",
                    url: "#/404",
                    children: null
                } ]
            }, {
                name: "升级指南",
                url: "#/update-guide",
                children: null
            } ]
        }
    });
} ]);

adminuiApp.config([ "$routeProvider", function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "views/main.html",
        controller: "MainCtrl"
    }).when("/base-css", {
        templateUrl: "views/base_css.html",
        controller: "MainCtrl"
    }).when("/form", {
        templateUrl: "views/form.html",
        controller: "MainCtrl"
    }).when("/widget", {
        templateUrl: "views/widget.html",
        controller: "MainCtrl"
    }).when("/bootstrap-ui-widget", {
        templateUrl: "views/bootstrap_ui_widget.html",
        controller: "MainCtrl"
    }).when("/table", {
        templateUrl: "views/table.html",
        controller: "MainCtrl"
    }).when("/login", {
        templateUrl: "views/login.html",
        controller: "MainCtrl"
    }).when("/sub/test", {
        templateUrl: "views/sub_page.html",
        controller: "MainCtrl"
    }).when("/sub/test2", {
        templateUrl: "views/sub_page.html",
        controller: "MainCtrl"
    }).when("/sub/test3", {
        templateUrl: "views/sub_page.html",
        controller: "MainCtrl"
    }).when("/404", {
        templateUrl: "views/404.html",
        controller: "MainCtrl"
    }).when("/test", {
        templateUrl: "views/test.html",
        controller: "MainCtrl"
    }).when("/update-guide", {
        templateUrl: "views/update_guide.html",
        controller: "MainCtrl"
    }).when("/time-line", {
        templateUrl: "views/time-line.html",
        controller: "MainCtrl"
    }).when("/eCharts", {
        templateUrl: "views/eCharts.html",
        controller: "MainCtrl"
    }).otherwise({
        redirectTo: "/"
    });
} ]);

"use strict";

adminuiApp.controller("MainCtrl", [ "$scope", "$window", "$location", "$filter", function($scope, $window, $location, $filter) {
    $scope.$location = $location;
    $scope.name = "Nobody";
    $scope.sayHello = function(name) {
        $scope.name = name;
        console.log("say hello" + name);
    };
    $scope.crmDropdown = [ {
        text: "CRM Another action",
        href: "#anotherAction"
    }, {
        text: "CRM Something else here",
        click: "$alert('working ngClick!')"
    }, {
        text: "CRM Separated link"
    } ];
    $scope.pecDropdown = [ {
        text: "CRM Another action",
        href: "#anotherAction"
    }, {
        text: "CRM Something else here",
        click: "$alert('working ngClick!')"
    }, {
        text: "CRM Separated link"
    } ];
    $scope.wmsDropdown = [ {
        text: "CRM Another action",
        href: "#anotherAction"
    }, {
        text: "CRM Something else here",
        click: "$alert('working ngClick!')"
    }, {
        text: "CRM Separated link"
    } ];
    $scope.easyPieChart = [ {
        caption: "New Visits",
        percent: 58,
        usage: "58%"
    }, {
        caption: "Bounce Rate",
        percent: 43,
        usage: "43%"
    }, {
        caption: "Server Load",
        percent: 91,
        usage: "91%"
    }, {
        caption: "Used RAM",
        percent: 82,
        usage: "75M"
    }, {
        caption: "Processor Load",
        percent: 35,
        usage: "35%"
    }, {
        caption: "Bandwidth",
        percent: 77,
        usage: "1.5TB"
    } ];
    $scope.alert = {};
    var initData = {
        user: {
            name: "",
            avator: "images/avatar.jpg"
        },
        time: "",
        sortBy: "",
        content: {
            list: [ 1, 2, 3, 4, 5 ]
        },
        template: "<div><ul><li data-ng-repeat='item in list'>{{item}}" + "<a href='http://www.baidu.com'>点击我</a></li></ul></div>"
    };
    $scope.data = [];
    $scope.data2 = [];
    var tempTimeLineData = [];
    for (var i = 0; i < 5; i++) {
        var currentInitData = angular.copy(initData);
        currentInitData.user.name = "john" + i;
        if (i % 2) {
            currentInitData.user.avator = null;
        }
        var t = new Date();
        currentInitData.time = new Date(t.setDate(t.getDate() - i));
        currentInitData.sortBy = currentInitData.time;
        currentInitData.title = "title" + i;
        var currentInitDataCopy = angular.copy(currentInitData);
        tempTimeLineData.push(angular.copy(currentInitData));
        tempTimeLineData.push(angular.copy(currentInitDataCopy));
    }
    $scope.data = angular.copy(tempTimeLineData);
    $scope.data2 = angular.copy($scope.data);
} ]);

var DatePickerCtrl = function($scope) {};

adminuiApp.controller("DatePickerCtrl", [ "$scope", DatePickerCtrl ]);

var DateRangePickerCtrl = function($scope) {
    $scope.myDateRange = {
        startDate: moment("2014-04-20"),
        endDate: moment("2014-05-25")
    };
    $scope.clear = function() {
        $scope.myDateRange1 = null;
    };
    $scope.ranges = {
        Today: [ moment(), moment() ],
        Yesterday: [ moment().subtract("days", 1), moment().subtract("days", 1) ],
        "Last 7 days": [ moment().subtract("days", 7), moment() ],
        "Last 30 days": [ moment().subtract("days", 30), moment() ],
        "This month": [ moment().startOf("month"), moment().endOf("month") ]
    };
    $scope.locale = {
        applyLabel: "应用",
        cancelLabel: "取消",
        fromLabel: "从",
        toLabel: "到",
        weekLabel: "周",
        customRangeLabel: "预定义区间"
    };
};

adminuiApp.controller("DateRangePickerCtrl", [ "$scope", DateRangePickerCtrl ]);

var ListCtrl = function($scope) {
    $scope.change = function() {
        console.log("changed");
    };
    $scope.disable = function() {
        $scope.disabled = !$scope.disabled;
    };
    $scope.list = [ {
        text: "item one",
        id: 1
    }, {
        text: "item two",
        id: 2
    }, {
        text: "item three",
        id: 3
    }, {
        text: "item four",
        id: 4
    }, {
        text: "item five",
        id: 5
    }, {
        text: "item six",
        id: 6
    } ];
    var obj = {
        im1: {
            name: "item one"
        },
        im2: {
            name: "item two"
        },
        im3: {
            name: "item three"
        },
        im4: {
            name: "item four"
        },
        im5: {
            name: "item five"
        }
    };
    var obj1 = {
        it1: {
            name: "other item one"
        },
        it2: {
            name: "other item two"
        },
        it3: {
            name: "other item three"
        },
        it4: {
            name: "other item four"
        },
        it5: {
            name: "other item five"
        }
    };
    $scope.selected = $scope.list[2];
    $scope.obj = obj;
    var status = "obj";
    $scope.changeSelected = function() {
        $scope.selected = $scope.list[1];
    };
    $scope.changeSource = function() {
        if (status == "obj") {
            $scope.obj = obj1;
            status = "obj1";
        } else {
            $scope.obj = obj;
            status = "obj";
        }
    };
};

adminuiApp.controller("ListCtrl", [ "$scope", ListCtrl ]);

var checkboxGroupCtrl = function($scope) {
    $scope.checkboxGroupData = {
        name: "产品管理",
        checkboxGroup: [ {
            name: "查看产品",
            value: "read",
            checked: true
        }, {
            name: "编辑产品",
            value: "edit"
        }, {
            name: "添加产品",
            value: "add",
            checked: true
        }, {
            name: "删除产品",
            value: "delete"
        } ]
    };
    $scope.emptyCheckboxGroupData = {
        name: "空分组",
        checkboxGroup: []
    };
};

adminuiApp.controller("checkboxGroupCtrl", [ "$scope", checkboxGroupCtrl ]);

var paginationCtrl = function($scope, $route, $location) {
    $scope.totalCount = angular.isDefined($route.current.params["total"]) ? $route.current.params["total"] : 10;
    var page = $route.current.params["page"];
    $scope.pageInfo = {
        page: page ? page : 1,
        total: $scope.totalCount
    };
    $scope.changeTotalPage = angular.bind(this, this.changeTotalPage, $scope, $location);
};

paginationCtrl.prototype.changeTotalPage = function($scope, $location) {
    var search = $location.search();
    search.total = $scope.totalCount;
    $scope.pageInfo.total = $scope.totalCount;
    $location.search(search).replace();
};

adminuiApp.controller("paginationCtrl", [ "$scope", "$route", "$location", paginationCtrl ]);

var chosenCtrl = function($scope, $http, $q) {
    $scope.isShow = false;
    $scope.options = this.getOptions();
    $scope.optionPromise = angular.bind(this, this.getOptionPromise, $http, $q);
    $scope.tags = [ {
        name: "tag0",
        id: 1,
        editable: true,
        deletable: false
    }, "tag1", "tag2", {
        name: "tag3",
        id: 1,
        editable: true,
        deletable: false
    } ];
    $scope.linkages = [ {
        id: 1,
        name: "bb",
        children: [ {
            id: 2,
            name: "aa",
            children: [ {
                id: 3,
                name: "vv"
            } ]
        } ]
    } ];
    $scope.show = function() {
        $scope.isShow = !$scope.isShow;
    };
};

chosenCtrl.prototype.getOptionPromise = function($http, $q, search) {
    var deferred = $q.defer();
    var data = {
        movies: [ {
            title: "1",
            name: "CN",
            id: "a"
        }, {
            title: "11",
            name: "CNaa",
            id: "b"
        }, {
            title: "111",
            name: "CNaas",
            id: "c"
        }, {
            title: "2",
            name: "JP",
            id: "d"
        }, {
            title: "3",
            name: "EN",
            id: "e"
        }, {
            title: "4",
            name: "AU",
            id: "f"
        }, {
            title: "5",
            name: "DE",
            id: "g"
        } ]
    };
    var currentArray = [];
    angular.forEach(data.movies, function(value) {
        if (value.title.match(search) && search !== "") {
            currentArray.push(value);
        }
    });
    deferred.resolve(currentArray);
    return deferred.promise;
};

chosenCtrl.prototype.getOptions = function() {
    return [ {
        id: 1,
        name: "CN"
    }, {
        id: 2,
        name: "JP"
    }, {
        id: 3,
        name: "EN"
    }, {
        id: 4,
        name: "AU"
    }, {
        id: 5,
        name: "DE"
    } ];
};

adminuiApp.controller("chosenCtrl", [ "$scope", "$http", "$q", chosenCtrl ]);

adminuiApp.controller("TabsDemoCtrl", [ "$scope", function($scope) {
    $scope.tabs = [ {
        title: "Dynamic Title 1",
        content: "Dynamic content 1"
    }, {
        title: "Dynamic Title 2",
        content: "Dynamic content 2"
    } ];
    $scope.alertMe = function() {
        setTimeout(function() {
            console.log($scope.tabs);
            angular.forEach($scope.tabs, function(tab, key) {
                if (tab.active === true) {
                    console.log(key);
                }
            });
        });
    };
    $scope.navType = "pills";
} ]).controller("TypeaheadCtrl", [ "$scope", function($scope) {
    $scope.selected = undefined;
    $scope.states = [ "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming" ];
} ]).controller("PaginationDemoCtrl", [ "$scope", function($scope) {
    $scope.totalItems = 64;
    $scope.currentPage = 4;
    $scope.maxSize = 5;
    $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;
} ]).controller("CollapseDemoCtrl", [ "$scope", function($scope) {
    $scope.isCollapsed = false;
} ]).controller("AccordionDemoCtrl", [ "$scope", function($scope) {
    $scope.oneAtATime = true;
    $scope.groups = [ {
        title: "Dynamic Group Header - 1",
        content: "Dynamic Group Body - 1"
    }, {
        title: "Dynamic Group Header - 2",
        content: "Dynamic Group Body - 2"
    } ];
    $scope.items = [ "Item 1", "Item 2", "Item 3" ];
    $scope.addItem = function() {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push("Item " + newItemNo);
    };
} ]).controller("AlertDemoCtrl", [ "$scope", function($scope) {
    $scope.alerts = [ {
        type: "warning",
        msg: "警告"
    }, {
        type: "danger",
        msg: "失败，错误, 危险"
    }, {
        type: "success",
        msg: "成功信息"
    }, {
        type: "info",
        msg: "需要注意的信息"
    } ];
    $scope.addAlert = function() {
        $scope.alerts.push({
            msg: "Another alert!"
        });
    };
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
} ]).controller("ButtonsCtrl", [ "$scope", function($scope) {
    $scope.singleModel = 1;
    $scope.radioModel = "Middle";
    $scope.checkModel = {
        left: false,
        middle: true,
        right: false
    };
} ]).controller("DropdownCtrl", [ "$scope", function($scope) {
    $scope.items = [ "The first choice!", "And another choice for you.", "but wait! A third!" ];
} ]).controller("TooltipDemoCtrl", [ "$scope", function($scope) {
    $scope.dynamicTooltip = "Hello, World!";
    $scope.dynamicTooltipText = "dynamic";
    $scope.htmlTooltip = "I've been made <b>bold</b>!";
} ]).controller("PopoverDemoCtrl", [ "$scope", function($scope) {
    $scope.dynamicPopover = "Hello, World!";
    $scope.dynamicPopoverText = "dynamic";
    $scope.dynamicPopoverTitle = "Title";
} ]).controller("DateCtrl", [ "$scope", function($scope) {
    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: "1900:-0"
    };
    $scope.myDate = "Thursday, 11 October, 2012";
} ]).controller("confirmButtonCtrl", [ "$scope", function($scope) {
    $scope.talk = function(msg) {
        alert(msg);
    };
} ]).controller("PieCtrl", [ "$scope", function($scope) {
    var data = {
        total: 299,
        analysis: [ {
            name: "20-30岁",
            value: 96
        }, {
            name: "31-40岁",
            value: 26
        }, {
            name: "41-50岁",
            value: 46
        }, {
            name: "51-60岁",
            value: 17
        } ]
    };
    $scope.ageData = data;
} ]).controller("noticeCtrl", [ "$rootScope", "$scope", "flash", function($rootScope, $scope, flash) {
    $scope.sendMsg = function(msg) {
        flash.notify(msg);
    };
} ]).controller("loadingButtonCtrl", [ "$scope", "$q", "$timeout", function($scope, $q, $timeout) {
    $scope.isProcessing = false;
    $scope.do = function() {
        $scope.isProcessing = true;
        $timeout(function() {
            $scope.$apply(function() {
                $scope.isProcessing = false;
            });
        }, 2e3);
    };
    $scope.save = function() {
        var defered = $q.defer();
        $timeout(function() {
            defered.resolve();
        }, 2e3);
        return defered.promise;
    };
} ]).controller("cascadeListCtrl", [ "$scope", "$q", "$timeout", function($scope, $q, $timeout) {
    $scope.dpt = 83;
    var dptList = [ {
        dptCode: "1",
        dptMasterId: 0,
        dptName: "行政部",
        dptPath: "/1/",
        id: 1,
        parentCode: "0"
    }, {
        dptCode: "10",
        dptMasterId: 0,
        dptName: "企业联盟发展部",
        dptPath: "/10/",
        id: 10,
        parentCode: "0"
    }, {
        dptCode: "85",
        dptMasterId: 0,
        dptName: "支持部",
        dptPath: "/10/85/",
        id: 85,
        parentCode: "10"
    }, {
        dptCode: "86",
        dptMasterId: 0,
        dptName: "B2B2C电商平台",
        dptPath: "/10/86/",
        id: 86,
        parentCode: "10"
    }, {
        dptCode: "87",
        dptMasterId: 0,
        dptName: "服饰母婴",
        dptPath: "/10/87/",
        id: 87,
        parentCode: "10"
    }, {
        dptCode: "88",
        dptMasterId: 0,
        dptName: "3C数码",
        dptPath: "/10/88/",
        id: 88,
        parentCode: "10"
    }, {
        dptCode: "89",
        dptMasterId: 0,
        dptName: "销售部",
        dptPath: "/10/89/",
        id: 89,
        parentCode: "10"
    }, {
        dptCode: "2",
        dptMasterId: 0,
        dptName: "技术部",
        dptPath: "/2/",
        id: 2,
        parentCode: "0"
    }, {
        dptCode: "11",
        dptMasterId: 0,
        dptName: "WMS研发部",
        dptPath: "/2/11/",
        id: 11,
        parentCode: "2"
    }, {
        dptCode: "14",
        dptMasterId: 0,
        dptName: "UED",
        dptPath: "/2/14/",
        id: 14,
        parentCode: "2"
    }, {
        dptCode: "38",
        dptMasterId: 0,
        dptName: "PEC研发部",
        dptPath: "/2/38/",
        id: 38,
        parentCode: "2"
    }, {
        dptCode: "45",
        dptMasterId: 0,
        dptName: "运维部",
        dptPath: "/2/45/",
        id: 45,
        parentCode: "2"
    }, {
        dptCode: "69",
        dptMasterId: 0,
        dptName: "b2b2c研发部",
        dptPath: "/2/69/",
        id: 69,
        parentCode: "2"
    }, {
        dptCode: "97",
        dptMasterId: 0,
        dptName: "NTD",
        dptPath: "/2/97/",
        id: 97,
        parentCode: "2"
    }, {
        dptCode: "48",
        dptMasterId: 0,
        dptName: "战略发展部",
        dptPath: "/48/",
        id: 48,
        parentCode: "0"
    }, {
        dptCode: "65",
        dptMasterId: 0,
        dptName: "市场",
        dptPath: "/48/65/",
        id: 65,
        parentCode: "48"
    }, {
        dptCode: "66",
        dptMasterId: 0,
        dptName: "运营",
        dptPath: "/48/66/",
        id: 66,
        parentCode: "48"
    }, {
        dptCode: "96",
        dptMasterId: 0,
        dptName: "客服",
        dptPath: "/48/96/",
        id: 96,
        parentCode: "48"
    }, {
        dptCode: "5",
        dptMasterId: 0,
        dptName: "品牌发展事业部",
        dptPath: "/5/",
        id: 5,
        parentCode: "0"
    }, {
        dptCode: "82",
        dptMasterId: 0,
        dptName: "官网组",
        dptPath: "/5/82/",
        id: 82,
        parentCode: "5"
    }, {
        dptCode: "95",
        dptMasterId: 0,
        dptName: "电话客服部",
        dptPath: "/5/82/95/",
        id: 95,
        parentCode: "82"
    }, {
        dptCode: "99",
        dptMasterId: 0,
        dptName: "网络服务部",
        dptPath: "/5/82/99/",
        id: 95,
        parentCode: "95"
    }, {
        dptCode: "93",
        dptMasterId: 0,
        dptName: "天猫组",
        dptPath: "/5/93/",
        id: 93,
        parentCode: "5"
    }, {
        dptCode: "83",
        dptMasterId: 0,
        dptName: "在线客服部",
        dptPath: "/5/93/83/",
        id: 83,
        parentCode: "93"
    }, {
        dptCode: "94",
        dptMasterId: 0,
        dptName: "售后部",
        dptPath: "/5/94/",
        id: 94,
        parentCode: "5"
    }, {
        dptCode: "61",
        dptMasterId: 0,
        dptName: "摄影工作室",
        dptPath: "/61/",
        id: 61,
        parentCode: "0"
    }, {
        dptCode: "62",
        dptMasterId: 0,
        dptName: "杭州分公司",
        dptPath: "/62/",
        id: 62,
        parentCode: "0"
    }, {
        dptCode: "67",
        dptMasterId: 0,
        dptName: "青岛分公司",
        dptPath: "/67/",
        id: 67,
        parentCode: "0"
    }, {
        dptCode: "70",
        dptMasterId: 0,
        dptName: "技术部",
        dptPath: "/67/70/",
        id: 70,
        parentCode: "67"
    }, {
        dptCode: "71",
        dptMasterId: 0,
        dptName: "财务部",
        dptPath: "/67/71/",
        id: 71,
        parentCode: "67"
    }, {
        dptCode: "72",
        dptMasterId: 0,
        dptName: "运营部",
        dptPath: "/67/72/",
        id: 72,
        parentCode: "67"
    }, {
        dptCode: "75",
        dptMasterId: 0,
        dptName: "行政部",
        dptPath: "/67/75/",
        id: 75,
        parentCode: "67"
    }, {
        dptCode: "91",
        dptMasterId: 0,
        dptName: "销售部",
        dptPath: "/67/91/",
        id: 91,
        parentCode: "67"
    }, {
        dptCode: "92",
        dptMasterId: 0,
        dptName: "客服部",
        dptPath: "/67/92/",
        id: 92,
        parentCode: "67"
    }, {
        dptCode: "8",
        dptMasterId: 0,
        dptName: "财务部",
        dptPath: "/8/",
        id: 8,
        parentCode: "0"
    }, {
        dptCode: "90",
        dptMasterId: 0,
        dptName: "仓储",
        dptPath: "/8/90/",
        id: 90,
        parentCode: "8"
    }, {
        dptCode: "9",
        dptMasterId: 0,
        dptName: "人力资源部",
        dptPath: "/9/",
        id: 9,
        parentCode: "0"
    } ];
    var unifyDptList = function(dptList) {
        var unifyDptList = [];
        angular.forEach(dptList, function(dpt) {
            unifyDptList.push({
                value: dpt.dptCode,
                text: dpt.dptName,
                path: dpt.dptPath
            });
        });
        return unifyDptList;
    };
    $scope.unifyDptList = unifyDptList(dptList);
    $scope.add = function() {
        $scope.unifyDptList.push({
            value: "101",
            text: "VIP服务组",
            path: "/5/93/83/101"
        });
    };
} ]).controller("chosenCtrl", [ "$scope", "$http", "$q", chosenCtrl ]).controller("switcherCtrl", [ "$scope", function($scope) {
    $scope.switch = true;
    $scope.uswitch = false;
    $scope.isDisabled = true;
    $scope.click = function(evt) {
        if (evt.type == "SWITCHER_CLICK") {
            evt.switched(function(value, oldValue) {
                console.log("switcher switch done");
                $scope.switch = oldValue;
            });
            console.log(evt);
        }
    };
    $scope.change = function(evt) {
        $scope.uswitch = evt.oldValue;
        console.log(evt);
    };
    $scope.disabled = function() {
        $scope.isDisabled = !$scope.isDisabled;
    };
} ]).controller("flashMessageCtrl", [ "$scope", "$timeout", "flash", function($scope, $timeout, flash) {
    $scope.sendMsg = function(msg, level) {
        if (arguments[2] != undefined) {
            flash.notify({
                state: level,
                info: msg
            }, arguments[2]);
        } else {
            flash.notify({
                state: level,
                info: msg
            });
        }
    };
} ]);

var ModalDemoCtrl = function($scope, $modal, $log) {
    var t = '<div class="modal-header">' + "<h3>" + "I'm a modal!" + "</h3>" + "</div>" + '<div class="modal-body">' + "<ul>" + '<li ng-repeat="item in items">' + '<a ng-click="selected.item = item">' + "{{ item }}" + "</a>" + "</li>" + "</ul>" + "Selected:" + "<b>" + "{{ selected.item }}" + "</b>" + "</div>" + '<div class="modal-footer">' + '<button class="btn btn-primary" ng-click="ok()">' + "OK" + "</button>" + '<button class="btn btn-warning" ng-click="cancel()">' + "Cancel" + "</button>" + "</div>";
    $scope.items = [ "item1", "item2", "item3" ];
    $scope.open2 = function() {
        var modalInstance = $modal.open({
            templateUrl: "myModalContent.html",
            controller: "ModalInstanceCtrl",
            loader: false,
            resolve: {
                items: function() {
                    return $scope.items;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info("Modal dismissed at: " + new Date());
        });
    };
    $scope.open = function() {
        var modalInstance = $modal.open({
            templateUrl: "myModalContent.html",
            controller: "ModalInstanceCtrl",
            resolve: {
                items: [ "$q", function($q) {
                    var deferred = $q.defer();
                    setTimeout(function() {
                        deferred.resolve($scope.items);
                    }, 3e3);
                    return deferred.promise;
                } ]
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info("Modal dismissed at: " + new Date());
        });
    };
};

adminuiApp.controller("ModalDemoCtrl", [ "$scope", "$modal", "$log", ModalDemoCtrl ]);

var ModalInstanceCtrl = function($scope, $modalInstance, items) {
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };
    $scope.ok = function() {
        $modalInstance.close($scope.selected.item);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss("cancel");
    };
};

adminuiApp.controller("ModalInstanceCtrl", [ "$scope", "$modalInstance", "items", ModalInstanceCtrl ]);

var DatepickerDemoCtrl = function($scope, $timeout) {
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();
    $scope.showWeeks = true;
    $scope.toggleWeeks = function() {
        $scope.showWeeks = !$scope.showWeeks;
    };
    $scope.clear = function() {
        $scope.dt = null;
    };
    $scope.disabled = function(date, mode) {
        return mode === "day" && (date.getDay() === 0 || date.getDay() === 6);
    };
    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    $scope.open = function() {
        $timeout(function() {
            $scope.opened = true;
        });
    };
    $scope.dateOptions = {
        "year-format": "'yy'",
        "starting-day": 1
    };
    $scope.formats = [ "dd-MMMM-yyyy", "yyyy/MM/dd", "shortDate" ];
    $scope.format = $scope.formats[0];
};

adminuiApp.controller("DatepickerDemoCtrl", [ "$scope", "$timeout", DatepickerDemoCtrl ]);

var TimepickerDemoCtrl = function($scope) {
    $scope.mytime = new Date();
    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.options = {
        hstep: [ 1, 2, 3 ],
        mstep: [ 1, 5, 10, 15, 25, 30 ]
    };
    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = !$scope.ismeridian;
    };
    $scope.update = function() {
        var d = new Date();
        d.setHours(14);
        d.setMinutes(0);
        $scope.mytime = d;
    };
    $scope.changed = function() {
        console.log("Time changed to: " + $scope.mytime);
    };
    $scope.clear = function() {
        $scope.mytime = null;
    };
};

var pageload = {
    name: "page.load",
    dataPoints: [ {
        x: 2001,
        y: 12
    }, {
        x: 2002,
        y: 23
    }, {
        x: 2003,
        y: 45
    }, {
        x: 2004,
        y: 62
    }, {
        x: 2005,
        y: 32
    }, {
        x: 2006,
        y: 40
    }, {
        x: 2007,
        y: 23
    }, {
        x: 2008,
        y: 90
    }, {
        x: 2009,
        y: 12
    }, {
        x: 2010,
        y: 31
    } ]
};

var firstPaint = {
    name: "page.firstPaint",
    dataPoints: [ {
        x: 2001,
        y: 22
    }, {
        x: 2002,
        y: 13
    }, {
        x: 2003,
        y: 35
    }, {
        x: 2004,
        y: 52
    }, {
        x: 2005,
        y: 32
    }, {
        x: 2006,
        y: 40
    }, {
        x: 2007,
        y: 63
    }, {
        x: 2008,
        y: 80
    }, {
        x: 2009,
        y: 20
    }, {
        x: 2010,
        y: 25
    } ]
};

var app = adminuiApp;

app.controller("LineChartController", function($scope) {
    $scope.config = {
        title: "Line Chart",
        subtitle: "Line Chart Subtitle",
        width: 800,
        height: 400,
        autoResize: true
    };
    $scope.data = [ pageload ];
    $scope.multiple = [ pageload, firstPaint ];
});

app.controller("BarChartController", function($scope) {
    $scope.config = {
        title: "Bar Chart",
        subtitle: "Bar Chart Subtitle",
        stack: true,
        width: 800,
        height: 400,
        autoResize: true
    };
    $scope.data = [ pageload ];
    $scope.multiple = [ pageload, firstPaint ];
});

app.controller("AreaChartController", function($scope) {
    $scope.config = {
        title: "Area Chart",
        subtitle: "Area Chart Subtitle",
        width: 800,
        height: 400,
        autoResize: true
    };
    $scope.data = [ pageload ];
    $scope.multiple = [ pageload, firstPaint ];
});

app.controller("PieChartController", function($scope) {
    $scope.config = {
        title: "Pie Chart",
        subtitle: "Pie Chart Subtitle",
        width: 800,
        height: 400,
        showEdge: true,
        autoResize: true
    };
    $scope.data = [ firstPaint ];
});

app.controller("GaugeChartController", function($scope) {
    $scope.config = {
        width: 800,
        height: 400,
        autoResize: true
    };
    $scope.data = [ pageload ];
});

app.controller("AjaxChartController", function($scope, $interval) {
    $scope.config = {
        width: 800,
        height: 400
    };
    $scope.data = [ pageload ];
    $interval(function() {}, 6e4);
});

app.controller("bubbleChartController", function($scope) {
    function random() {
        var r = Math.round(Math.random() * 100);
        return r * (r % 2 == 0 ? 1 : -1);
    }
    function randomDataArray() {
        var d = [];
        var len = 100;
        while (len--) {
            d.push([ random(), random(), Math.abs(random()) ]);
        }
        return d;
    }
    $scope.config = {
        width: 800,
        height: 400,
        autoResize: true,
        title: {
            text: "标准气泡图",
            subtext: "toolBox的dataZoom支持"
        },
        series: [ {
            name: "scatter1",
            data: randomDataArray()
        }, {
            name: "scatter2",
            data: randomDataArray()
        } ]
    };
    $scope.data = $scope.config.series;
});

app.controller("scatterChartController", function($scope) {
    $scope.config = {
        width: 800,
        height: 400,
        title: {
            text: "类目坐标散点图",
            subtext: "dataZoom支持"
        },
        autoResize: true,
        series: [ {
            name: "series1",
            data: function() {
                var d = [];
                var len = 0;
                var value;
                while (len++ < 500) {
                    d.push([ len, (Math.random() * 30).toFixed(2) - 0, (Math.random() * 100).toFixed(2) - 0 ]);
                }
                return d;
            }()
        }, {
            name: "series2",
            data: function() {
                var d = [];
                var len = 0;
                var value;
                while (len++ < 500) {
                    d.push([ len, (Math.random() * 30).toFixed(2) - 0, (Math.random() * 100).toFixed(2) - 0 ]);
                }
                return d;
            }()
        } ]
    };
    $scope.data = $scope.config.series;
});

app.controller("radarChartController", function($scope) {
    $scope.config = {
        width: 800,
        height: 400,
        autoResize: true,
        title: {
            text: "预算 vs 开销（Budget vs spending）",
            subtext: "纯属虚构"
        }
    };
    $scope.data = [ {
        name: "预算 vs 开销（Budget vs spending）",
        data: [ {
            value: [ 4300, 1e4, 28e3, 35e3, 5e4, 19e3 ],
            name: "预算分配（Allocated Budget）"
        }, {
            value: [ 5e3, 14e3, 28e3, 31e3, 42e3, 21e3 ],
            name: "实际开销（Actual Spending）"
        } ],
        indicator: [ {
            text: "销售（sales）",
            max: 6e3
        }, {
            text: "管理（Administration）",
            max: 16e3
        }, {
            text: "信息技术（Information Techology）",
            max: 3e4
        }, {
            text: "客服（Customer Support）",
            max: 38e3
        }, {
            text: "研发（Development）",
            max: 52e3
        }, {
            text: "市场（Marketing）",
            max: 25e3
        } ]
    } ];
});

app.controller("FormValidateDemoCtrl", function($scope) {
    $scope.banks = [ {
        id: "1",
        code: "SC",
        name: "渣打银行",
        accounts: {
            501510217665: "501510217665 "
        }
    }, {
        id: "2",
        code: "BOBJ",
        name: "北京银行",
        accounts: {
            0x3b1c0af7bc5ece0000: "01090378600120109140770"
        }
    }, {
        id: "3",
        code: "BOC",
        name: "中国银行",
        accounts: {
            345458083021: "345458083021"
        }
    }, {
        id: "4",
        code: "CITI",
        name: "花旗银行（中国）",
        accounts: {
            1775007202: "1775007202 "
        }
    } ];
    $scope.changeAccounts = function(bank) {
        angular.forEach($scope.banks, function(value) {
            $scope.account = null;
            if (value.code === bank) {
                $scope.accounts = value.accounts;
            }
        });
    };
});
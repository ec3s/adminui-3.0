!function(){function a(a){return{notify:function(b,c){c?a.$emit("event:flashMessageEvent",b):a.$emit("event:notification",b)}}}angular.module("ntd.services",[]).factory("flash",["$rootScope",a])}(),function(){"use strict";function a(a){return{notify:function(b){a.$emit("event:flashMessageEvent",b)}}}angular.module("ntd.services").factory("flashMessage",["$rootScope",a])}(),angular.module("ntd.config",[]).value("$ntdConfig",{}),angular.module("ntd.directives",["ntd.config"]),function(a){"use strict";var b=function(b,f,g,m){return{restrict:"A",templateUrl:"templates/adminui-frame.html",transclude:!0,scope:{userInfo:"=",messages:"="},link:function(p,q){p.isSubMenuShow=b.defaultShowSubmenu,p.hasSideMenu=!1,p.isMessageBoxShow=b.showMessageBox,p.navigation=b.navigation,p.messages=p.messages?p.messages:[],p.userInfo=a.extend({username:null,avatar:"images/avatar.jpg",logout:function(){console.log("logout")},changePwd:function(){console.log("change password")}},p.userInfo),e(p.navigation),f.$on("$routeChangeStart",function(){h(p,g.path())}),p.select=a.bind(p,i,m,q),p.toggleSubMenu=a.bind(p,l),p.selectNav=a.bind(p,n),p.selectMenu=a.bind(p,o),p.isSelected=a.bind(p,j),p.setSideMenu=a.bind(p,k,q),p.logout=a.bind(p,c),p.changePwd=a.bind(p,d),h(p,g.path())}}},c=function(a){a.preventDefault(),this.userInfo.logout()},d=function(a){a.preventDefault(),this.userInfo.changePwd()},e=function(b){var c=void 0===arguments[1]?null:arguments[1],d=void 0===arguments[2]?0:arguments[2];a.forEach(b,function(a){a.parentNav=c,a.level=d+1,null!=a.children&&e(a.children,a,a.level)})},f=function(b){var c=arguments[1]?arguments[1]:[];return a.forEach(b,function(a){null==a.children?c.push(a):f(a.children,c)}),g(c)},g=function(b){return a.forEach(b,function(b){a.isUndefined(b.match)&&null!=b.url&&(b.match=b.url.replace("#",""))}),b},h=function(a,b){m(a.navigation);for(var c=f(a.navigation),d=0;d<c.length;d++){var e=new RegExp("^"+c[d].match+"$",["i"]);if(e.test(b)){a.select(c[d]);break}}},i=function(a,b,c){c.selected=!0,2==c.level?this.setSideMenu(c.children,c.name):4==c.level&&a(function(){var a=b.find(".side-nav-menu").find(".active>.has-sub-menu").parent("li").find("ul");a.show()}),null!=c.parentNav&&this.select(c.parentNav)},j=function(a){return a.selected?!0:!1},k=function(a,b,c){null==b||0==b.length?this.hasSideMenu=!1:(this.hasSideMenu=!0,this.sideMenuName=c,this.menu=b)},l=function(){this.isSubMenuShow=!this.isSubMenuShow},m=function(a){for(var b=0;b<a.length;b++)a[b].selected=!1,null!=a[b].children&&m(a[b].children)},n=function(a){m(this.navigation),null!=a.url?h(this,a.url.replace("#","")):this.select(a),this.setSideMenu(a.children,a.name)},o=function(b,c){null!=b.children?a.element(c.target).parent("li").find("ul").toggle():(m(this.menu),null!=b.url?h(this,b.url.replace("#","")):this.select(b))},p=function(){this.config={defaultShowSubmenu:!1,showMessageBox:!1},this.$get=function(){return this.config},this.setConfig=function(b){this.config=a.extend(this.config,b)}};a.module("ntd.directives").provider("adminuiFrame",[p]),a.module("ntd.directives").directive("adminuiFrame",["adminuiFrame","$rootScope","$location","$timeout",b])}(angular),function(a){"use strict";var b=function(a){return{restrict:"A",link:function(b,c){b.$on("$routeChangeStart",function(){b.$watch(function(){return a.path()},function(a,b){a!==b&&c.fadeTo(200,.7)})}),b.$on("$routeChangeSuccess",function(){c.finish(),c.fadeOut("normal")})}}};a.module("ntd.directives").directive("adminuiLoadBackdrop",["$location",b])}(angular),function(){"use strict";function a(a,b){$(":submit",a).clone().appendTo(g),g.addClass("skeleton"),h.hide(),a.bind("click",c),"opened"===b.advanceFilter&&$('a[data-class="J_toggleShowFilterBtn"]').trigger("click")}function b(a,b){g.toggleClass("skeleton").fadeIn(),h.animate({height:["toggle","swing"],opacity:["toggle","swing"]},200,"linear"),g.find(":submit").toggle(),$(".glyphicon",b).hasClass("glyphicon-chevron-down")?$(".glyphicon.glyphicon-chevron-down",b).removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up"):$(".glyphicon.glyphicon-chevron-up",b).removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down")}function c(a,c){var d=a.target;($(d).attr("data-class")||$(d).parent().attr("data-class"))===f&&b(c)}function d(){return{restrict:"A",template:i,transclude:!0,link:function(b,c,d){e=$(c).find("fieldset"),f="J_toggleShowFilterBtn",g=e.eq(0),h=e.not(e.eq(0)),a(c,d)}}}var e,f,g,h,i='<div class="advance-search-filter"><div ng-transclude></div><div class="more"><a data-class="J_toggleShowFilterBtn"><i class="glyphicon glyphicon-chevron-down"></i></a></div></div>';angular.module("ntd.directives").directive("advanceFilter",[d])}(),function(){"use strict";function a(a,b){return{restrict:"A",scope:"@",link:function(c,d,e){var f,g,h,i,j,k,l;return f=Math.floor(1e10*Math.random()),e.buttonId=f,h=e.message||"",k=e.yes||"确定",i=e.no||"取消",j=e.title||"确认删除?",l=e.position||"top",g='<div id="button-'+f+'">'+'<p ng-show="test" class="confirmbutton-msg">'+h+"</p>"+'<button type="button" class="confirmbutton-yes'+' btn btn-primary">'+k+"</button>\n"+'<button type="button" class="confirmbutton-no btn btn-default">'+i+"</button>"+"</div>",d.popover({content:g,html:!0,placement:l,trigger:"manual",title:j}),d.bind("click",function(g){var h,i;return h=!0,g.stopPropagation(),d.hasClass("disabled")?!1:(d.addClass("disabled"),$('[id^="button-"]').closest(".popover").hide().prev().removeClass("disabled"),d.popover("show"),i=$("#button-"+f),i.closest(".popover").click(function(a){h&&a.stopPropagation()}),i.find(".confirmbutton-yes").click(function(){h=!1;var a=b(e.confirmButton);a(c),"$apply"!=c.$root.$$phase&&"$digest"!=c.$root.$$phase&&c.$apply()}),i.find(".confirmbutton-no").click(function(){h=!1,a.off("click.confirmbutton."+f),d.popover("hide"),d.removeClass("disabled")}),a.on("click.confirmbutton."+f,":not(.popover, .popover *)",function(){a.off("click.confirmbutton."+f),d.popover("hide"),d.removeClass("disabled")}),void 0)})}}}angular.module("ntd.directives").directive("confirmButton",["$document","$parse",a])}(),function(){"use strict";function a(){return{restrict:"A",scope:{item:"=easyPieChart"},replace:!0,template:'<div class="easy-pie-chart-widget"><div class="easy-pie-chart"><div class="percentage" data-percent="{{item.percent}}">{{item.usage}}</div><div>{{item.caption}}</div></div></div>',link:function(a,b,c){var d=["#08c","#e7912a","#bacf0b","#4ec9ce","#ec7337","#f377ab"],e=c.easyPieChartLineWidth||12,f=c.easyPieChartSize||100,g=d[a.$parent.$index%6]||"#08c",h={animate:2e3,scaleColor:!1,lineWidth:e,lineCap:"square",size:f,barColor:g,trackColor:"#e5e5e5"},i=function(){$(".percentage ",b).easyPieChart(h)};c.$observe("easyPieChart",i),a.$watch("item",function(a,c){a!=c&&$(".percentage ",b).data("easyPieChart").update(a.percent)},!0)}}}angular.module("ntd.directives").directive("easyPieChart",["$timeout",a])}(),function(){"use strict";function a(){return{restrict:"A",link:function(a,b){$(b).addClass("footable").footable()}}}angular.module("ntd.directives").directive("fooTable",[a])}(),angular.module("ntd.directives").directive("nanoScrollbar",["$timeout",function(a){return{restrict:"A",link:function(b,c,d){function e(){var a={height:function(){return $(window).width()<767?200:$(window).height()-80},showScrollBar:function(){return $(window).width()<767?!0:!1}};$(".nano",c).css({height:a.height()}).nanoScroller({preventPageScrolling:!0,iOSNativeScrolling:!0,alwaysVisible:a.showScrollBar()})}var f='<div class="span2 affix"><div class="nano"><div class="content"></div></div></div>';$(c).children().wrap(f),d.$observe("nanoScrollbar",e),$(c).on("click",function(){a(e,200)}),$(window).bind("load resize",e)}}}]),function(){"use strict";function a(){return{restrict:"A",transclude:!0,scope:{tips:"@labelState"},template:'<span ng-transclude></span><i tooltip-popup-delay="300" tooltip="{{tips}}" class="glyphicon glyphicon-question-sign"></i>'}}angular.module("ntd.directives").directive("labelState",[a])}(),function(){"use strict";function a(a){return{restrict:"A",link:function(b,c){b.$watch(function(){return a.path()},function(a){$("li[data-match-route]",c).each(function(b,c){var d=angular.element(c),e=d.attr("data-match-route"),f=new RegExp("^"+e+"$",["i"]);f.test(a)?(d.addClass("active"),d.find("ul").length&&d.addClass("opened").find("ul").show()):d.removeClass("active")})})}}}angular.module("ntd.directives").directive("navBar",["$location",a])}(),function(){"use strict";function a(){$("#J_subMenu").parent().toggle(),$("#J_mainContent").toggleClass("col-md-12")}function b(){return{restrict:"A",link:function(b,c){c.bind("click",function(){$(this).bind("selectstart",function(){return!1}),$(this).parent().toggleClass("active"),a()})}}}angular.module("ntd.directives").directive("toggleSubmenu",[b])}(),function(){"use strict";function a(){return{restrict:"A",link:function(a,b){b.on("click",function(a){var b=a.target;if("a"===b.nodeName.toLowerCase()&&$(b).next("ul").length)$(b).next("ul").slideToggle("fast"),$(b).parent().toggleClass("opened"),$(b).bind("selectstart",function(){return!1});else{var c=$(b).attr("href");$("#bs3").attr("href","http://ec3s.github.io/adminui-3.0/"+c)}})}}}angular.module("ntd.directives").directive("subTreemenu",[a])}(),function(){"use strict";function a(){return{restrict:"A",link:function(a,b,c){var d="#"+c.id,e=a[c.data].analysis,f=c.pieWidth||800,g=c.pieHeight||300,h=Math.min(f,g)/2,i=d3.scale.ordinal().range(["#fdc79b","#ee6962","#5d96b1","#b8d97e","#24CBE5","#64E572","#FF9655","#FFF263"]),j=d3.svg.arc().outerRadius(h-10).innerRadius(0),k=d3.layout.pie().sort(null).value(function(a){return a.value}),l=d3.select(d).append("svg").attr("width",f).attr("height",g).append("g").attr("transform","translate("+f/2+","+g/2+")"),m=l.selectAll(".arc").data(k(e)).enter().append("g").attr("class","arc");m.append("path").attr("d",j).style("fill",function(a){return i(a.data.name)}),m.append("text").attr("transform",function(a){return"translate("+j.centroid(a)+")"}).attr("dy",".35em").style("text-anchor","middle").text(function(a){return a.data.name});var n=l.selectAll(".legend").data(i.domain().slice().reverse()).enter().append("g").attr("class","legend").attr("transform",function(a,b){return"translate(0,"+20*b+")"});n.append("rect").attr("x",f-430).attr("width",18).attr("height",18).style("fill",i),n.append("text").attr("x",f-440).attr("y",9).attr("dy",".35em").style("text-anchor","end").text(function(a){return a})}}}angular.module("ntd.directives").directive("ntdPie",[a])}(),function(){"use strict";function a(){return{restrict:"A",link:function(a,b,c){a.$watch(function(){return a.$eval(c.loadingButton)},function(a){a?(c.hasOwnProperty("ngDisabled")||b.addClass("disabled").attr("disabled","disabled"),b.data("resetText",b.html()),b.html(b.data("loading-text"))):(c.hasOwnProperty("ngDisabled")||b.removeClass("disabled").removeAttr("disabled"),b.html(b.data("resetText")))})}}}angular.module("ntd.directives").directive("loadingButton",[a])}(),function(){"use strict";function a(){return $(window).width()<767?200:$(window).height()-80}function b(){$(".slimScroll",d).parent(".slimScrollDiv").css({height:a()+"px"}),$(".slimScroll",d).css({height:a()+"px"}).slimscroll({distance:"2px"})}function c(a){return{restrict:"A",link:function(c,d,e){if("yes"==e.slimScrollMenu){var f='<div class="col-md-2 affix"><div class="slimScroll"></div></div>';$(d).children().wrap(f),e.$observe("slimScroll",b),$(d).on("click",function(){a(b,200)}),$(window).bind("load resize",b)}else $(d).slimscroll({width:e.slimScrollWidth||"auto",height:e.slimScrollHeight||"250px",size:e.slimScrollSize||"7px",color:e.slimScrollColor||"#000",position:e.slimScrollPosition||"right",distance:e.slimScrollDistance||"1px",start:"top",opacity:.4,alwaysVisible:!1,disableFadeOut:!1,railVisible:!1,railColor:e.slimScrollRailColor||"#333",railOpacity:.2,railDraggable:!0,railClass:"slimScrollRail",barClass:"slimScrollBar",wrapperClass:"slimScrollDiv",allowPageScroll:!1,wheelStep:20,touchScrollStep:200})}}}var d;angular.module("ntd.directives").directive("slimScroll",["$timeout",c])}(),function(){"use strict";function a(a){var d=c(a),e=c(i.ngModel),f=d?d.level+1:0,g=$("<ul></ul>").css("margin-left",30*f+"%").attr("cl-id",a);return angular.forEach(h,function(c){if(c.parent==a){var d=$('<li cl-value="'+c.value+'">'+c.text+"</li>").click(b);c.children().length>0&&d.addClass("has-child"),c.value==i.ngModel&&g.addClass("selective"),e&&e.path.indexOf(""+c.value)>-1&&d.addClass("selective"),g.append(d)}}),g}function b(b){var c=$(b.target).addClass("selective"),e=c.parent().addClass("selective"),f=c.attr("cl-value");if(e.nextAll("ul").remove(),c.prevAll(".selective").removeClass("selective"),c.nextAll(".selective").removeClass("selective"),e.prevAll(".selective").removeClass("selective"),c.hasClass("has-child")){var h=a(f);g.append(h);var i=g.offset().left+2*g.width()/3;b.clientX>i&&g.scrollLeft(e.prev().offset().left)}d(f)}function c(a){var b=h.filter(function(b){return b.value==a});return b[0]}function d(a){i.ngModel=a,i.$apply()}function e(){if(g.html(""),void 0!=h&&0!=h.length){var b=i.ngModel,d=c(b);b=d?d.children().length>0?d.value:d.parent:0;do{g.prepend(a(b));var d=c(b);b=d?d.parent:0}while(d);var e=g.find("ul.selective");if(e.length>0){var f=g.parent().offset().left+2*g.parent().width()/3;e.offset().left>f&&g.scrollLeft(e.prev().offset().left)}}}function f(){return{restrict:"ACE",replace:!1,scope:{ngModel:"=",data:"="},link:function(a,b,c){i=a,g=$('<div class="cascade-list-inner"></div>').css("width",c.width||"100%").css("height",c.height||"220px"),b.append(g).addClass("cascade-list");var d={name:c.name,parent:c.parent||"parent",value:c.value||"id",text:c.text||"name",path:c.path||"path"};a.$watch("data",function(a){h=new j(a,d),e(h)}),a.$watch("ngModel",function(a,b){a!=b&&e()})}}}var g,h,i,j=function(a,b){var c=[];return angular.forEach(a,function(d){var e=d[b.path].split("/").slice(1,-1);c.push({value:d[b.value],text:d[b.text],parent:d[b.parent],path:e,level:e.length-1,children:function(){var c=this.value,d=a.filter(function(a){return a[b.parent]==c});return d}})}),c};angular.module("ntd.directives").directive("cascadeList",["$parse",f])}(),function(a,b){"use strict";var c=function(a,c){return{restrict:"AC",link:function(d,e,f){var g,h=f.ngOptions||null,i=f.ngModel||null,j=f.onSearchPromise||null,k=f.optionsNode||null,l=f.multiple||null,m="",n=f.disableSearchThreshold||0,o=f.allowSingleDeselect||!1;o="true"==o?!0:!1;var p={disable_search_threshold:n},q=e.chosen(p),r=q.data("chosen");r.container.css("max-width",q.css("width"));var s={},t=d.$new(!1);if(j&&(r.winnow_results=function(){this.no_results_clear();for(var a=this.get_search_text(),b=this.results_data,c=0,d=0;d<b.length;d++){var e=b[d];e.empty||(c++,e.search_match=!0,e.search_text=e.group?e.label:e.html)}return 0>=c?(this.update_results_content(""),this.result_clear_highlight(),this.no_results(a)):(this.update_results_content(this.results_option_build()),this.winnow_results_set_highlight())},r.show_search_field_default=function(){return this.is_multiple&&this.choices_count()<1&&!this.active_field?(this.search_field.val(this.default_text),this.search_field.addClass("default")):this.search_field.removeClass("default")}),r.allow_single_deselect=o,h){var u=h.split(" ").pop(),v=a(u),w=v.assign;d.$watch(u,function(a){q.trigger("liszt:data_loaded",{options:a,optionsModelName:u})},!0)}i&&d.$watch(i,function(a,c){l&&b.forEach(a,function(a){s[a]||b.forEach(v(d),function(b,c){b.id==a&&(s[a]=v(d)[c])})}),a!==c&&e.trigger("liszt:updated")},!0),q.bind("liszt:hiding_dropdown",function(){!r.active_field&&b.isArray(g)?(w(d,g),t.$search="",t.$apply(),c(function(){q.trigger("liszt:updated"),r.search_field.val(t.$search)})):r.active_field&&(g=v(d))}),q.bind("liszt:showing_dropdown",function(){if(j){if(!t.$search)return c(function(){r.search_results.find(".no-results").text("请输入关键字...")}),void 0;l||r.search_field.val(t.$search),q.trigger("liszt:load_data",{onSearch:j,optionsModelName:u,needRecord:!0})}}),q.bind("liszt:load_data",function(a,c){var d=t.$eval(c.onSearch);r.search_field.addClass("loading"),r.search_results.find(".no-results").text("加载中..."),d.then(function(a){var d=[];d=k?a[k]:a,b.isArray(d)||(d=[]),c.needRecord&&!g&&(g=d),q.trigger("liszt:data_loaded",{options:d,optionsModelName:c.optionsModelName})})}),q.bind("liszt:data_loaded",function(a,e){j&&(r.search_field.removeClass("loading"),b.isArray(e.options)&&e.options.length>0?(g||(g=e.options),w(d,e.options)):w(d,[]),l&&b.forEach(s,function(a){var c=!1;if(b.forEach(v(d),function(b){return b.id==a.id?(c=!0,void 0):void 0}),!c){var e=v(d);e.push(a),b.isArray(e)&&w(d,e)}})),c(function(){q.trigger("liszt:updated"),t.$search||r.search_results.find(".no-results").text("请输入关键字...")})}),j&&u&&r.search_field.bind("keyup",function(){r&&r.results_showing&&(t.$search=r.get_search_text(),c(function(){m!=t.$search&&(m=t.$search,q.trigger("liszt:load_data",{onSearch:j,optionsModelName:u}))},500))}),q.change(function(){e.trigger("liszt:updated")})}}},d=function(){return{restrict:"AC",template:'<span><span data-ng-repeat="linkage in linkages"> <select class="col-sm-3" data-ntd-chosen data-placeholder="请选择" data-disable-search-threshold="10" data-ng-change="change($index)" data-ng-model="values[$index]" data-allow-single-deselect="true" data-ng-options="option as option.name for option in linkage"> <option value=""></option></select></span></span>',scope:{source:"=",ngModel:"="},link:function(a){var c;a.$watch("source",function(){b.isArray(a.ngModel)||(a.ngModel=[]),d(),e()});var d=function(){c=[],a.values=[],a.linkages=[],b.forEach(a.source,function(a){c.push(a)}),a.linkages.push(c)},e=function(){a.ngModel.length>0?b.forEach(a.ngModel,function(c,d){b.forEach(a.linkages[d],function(b){b.id==c&&(a.values[d]=b,a.change(d))})}):(a.values[0]="",a.change(0))};a.change=function(c){var d=[],e=a.linkages.length-1,f=a.values[c],g=[];f?(f.children&&b.forEach(f.children,function(a){d.push(a)}),c>=e&&d.length>0?a.linkages.push(d):e>c&&(a.linkages.splice(c+1,e-c),a.values.splice(c+1,e-c),d.length>0&&(a.linkages[c+1]=d))):(a.linkages.splice(c+1,e-c),a.values.splice(c+1,e-c)),$(a.values).each(function(a,b){1==!!b&&1==!!b.id&&g.push(b.id)}),a.ngModel=g}}}};a.directive("ntdChosen",["$parse","$timeout",c]),a.directive("ntdLinkage",["$parse",d])}(angular.module("ntd.directives"),angular),function(){"use strict";function a(){return{restrict:"AC",replace:!0,scope:{tags:"=ngModel",placeholder:"@",id:"@"},template:'<div class="tag-input-container"><ul data-ng-class="{true: \'focus\'}[isFocus]"><li class="tag" data-ng-repeat="tag in tags"><span>{{tag.name}}</span><i data-ng-show="tagsAttribute[$index].editable" class="glyphicon glyphicon-pencil" data-ng-click="editTag($index, $event)"></i> <i data-ng-show="tagsAttribute[$index].deletable" data-ng-click="removeTag($index)" class="glyphicon glyphicon-remove"></i></li><li class="input-li"><input id="{{id}}" class="form-control input-sm" data-ng-model="tagInput" placeholder="{{placeholder}}" type="text" autocomplete="false" /></li></ul></div>',link:function(a,b,c){var d,e=c.placeholder,f=c.caseSensitive||!1,g=a.$eval(c.allwaysPlaceholder)||!1,h=a.$eval(c.unique)||!0,i=[],j=a.tagsAttribute=[],k=function(a){return'<div id="pop_'+a+'" >'+'<p><input id="pop_inp_'+a+'"'+' type="text" class="form-control input-sm"/></p>'+' <button type="button"'+' class="btn btn-primary btn-sm">'+' 确定</button>\n<button type="button"'+' class="btn btn-default btn-sm">'+" 取消</button>"+"</div>"},l=function(a){return function(){angular.element(b.find("li")[a]).popover("destroy"),b.find("input").focus()}},m=function(c){return function(){var d=b.find("#pop_inp_"+c).val(),e=s(a.tags,{name:d});h&&-1!==e?angular.element(b.find("li")[e]).fadeTo("fast",.2).fadeTo("fast",1):(a.tags[c].name=d,a.$apply()),angular.element(b.find("li")[c]).popover("destroy"),b.find("input").focus()}},n=function(){b.find("li").each(function(a,b){angular.element(b).popover("destroy")})},o=function(a){return angular.isUndefined(a.deletable)||a.deletable},p=function(a){return!angular.isUndefined(a.editable)&&a.editable},q=function(a,b){angular.isObject(j[b])||(j[b]={deletable:o(a)?!0:!1,editable:p(a)?!0:!1}),delete a.deletable,delete a.editable},r=function(a){angular.forEach(a,function(b,c){angular.isString(b)&&(a[c]={name:b}),q(a[c],c)})};r(a.tags);var s=function(a,b){if(!f)var c=b.name.toLowerCase(),d=a.map(function(a){return a.name.toLowerCase()});return d.indexOf(c)};angular.isArray(a.tags)||(a.tags=[]),h&&(angular.forEach(a.tags,function(a){-1===s(i,a)&&i.push(a)}),a.tags=i),a.removeTag=function(b){n(),a.tags.splice(b,1),j.splice(b,1)},a.editTag=function(c,d){d.stopPropagation(),n(),angular.element(b.find("li")[c]).popover({content:k(c),html:!0,placement:"top",trigger:"manual",title:"修改"}),angular.element(b.find("li")[c]).popover("show"),b.find("#pop_inp_"+c).focus().bind("keypress",function(a){13==a.keyCode&&(a.preventDefault(),m(c)(a))}).val(a.tags[c].name),b.find("#pop_"+c).find(".btn-primary").bind("click",m(c)),b.find("#pop_"+c).find(".btn-default").bind("click",l(c)),b.find(".popover").bind("click",function(a){a.stopPropagation()})};var t=function(b){a.tags.push(b),j.push({deletable:!0,editable:!1})};b.find("input").bind("focus",function(){a.isFocus=!0,a.$apply()}),b.find("input").bind("blur",function(){a.isFocus=!1;var c=$(this).val();if(c){var d={name:c},e=s(a.tags,d);h&&-1!==e?angular.element(b.find("li")[e]).fadeTo("fast",.2).fadeTo("fast",1):t(d)}a.tagInput="","$apply"!=a.$root.$$phase&&"$digest"!=a.$root.$$phase&&a.$apply()}),b.bind("click",function(){n(),b.find("input").focus()}),b.find("input").bind("keyup",function(c){if(d!=a.tagInput)d=a.tagInput;else if(8==c.keyCode&&a.tags.length>0&&d==a.tagInput){var e=j[a.tags.length-1];e.deletable===!0?(a.removeTag(a.tags.length-1),a.$apply()):angular.element(b.find("li")[a.tags.length-1]).stop().fadeTo("fast",.2).fadeTo("fast",1)}}),a.$watch("tags",function(a){r(a),g||(angular.isArray(a)&&a.length>0?b.find("input").attr("placeholder",""):b.find("input").attr("placeholder",e))},!0),a.$watch("tagInput",function(c,d){if(c!=d){var e=c.substr(-1,1);if(";"==e||"；"==e){if(d){var f={name:d},g=s(a.tags,f);h&&-1!==g?angular.element(b.find("li")[g]).fadeTo("fast",.2).fadeTo("fast",1):t(f)}a.tagInput=""}}})}}}angular.module("ntd.directives").directive("tagInput",[a])}(),function(){"use strict";function a(){return{template:'<span class="text-danger" ng-show="showError" ng-transclude></span>',restrict:"EAC",transclude:!0,scope:{"for":"="},link:function(a){a.$watch("{v: for.$invalid, d: for.$dirty}| json",function(b){b=JSON.parse(b),a.showError=b.v&&b.d})}}}angular.module("ntd.directives").directive("fieldError",[a])}(),function(){"use strict";function a(a){var b='<div class="alert '+c[a.state]+'">'+"<strong>"+a.info+"</strong>"+'<button type="button" class="close">×</button>'+"</div>";return b}function b(b,c,d){return{restrict:"EAC",replace:!1,transclude:!1,link:function(e,f){b.$on("event:notification",function(b,e){f.html(a(e)),f.show().find("button").on("click",function(){f.fadeOut()}),e.redirect_url&&d(function(){c.path(e.redirect_url)},1500)}),e.$watch(function(){return c.url()},function(){f.fadeOut()})}}}var c={info:"alert-info",error:"alert-danger",success:"alert-success",warning:"alert-warning"};angular.module("ntd.directives").directive("notice",["$rootScope","$location","$timeout",b])}(),function(){"use strict";function a(a,b){a="error"==a?"danger":a;var c='<div class="alert alert-'+a+'">'+b+'<button type="button" class="close">×</button>'+"</div>";return c}function b(b){return{scope:!0,restrict:"EAC",link:function(c,d){var e="";b.$on("event:flashMessageEvent",function(b,c){angular.isArray(c)?angular.forEach(c,function(b){e+=a(b.state,b.info)}):e+=a(c.state,c.info)}),b.$on("$routeChangeSuccess",function(){d.empty(),e&&(d.append(e),$(".close",d).bind("click",function(){$(this).parent(".alert").fadeOut(function(){$(this).remove()})}),e="")})}}}angular.module("ntd.directives").directive("flashAlert",["$rootScope","$timeout",b])}(),function(){"use strict";function a(a){return{restrict:"AC",replace:!0,scope:{ngTrueTitle:"@",ngFalseTitle:"@",ngTrueValue:"@",ngFalseValue:"@",ngDisabled:"=",id:"@",name:"@",ngModel:"=",ngChange:"&",click:"&"},template:'<label class="checkbox toggle"><input id="{{id}}" name="{{name}}" type="checkbox" ng-model="checked"><p><span>{{ngTrueTitle}}</span><span>{{ngFalseTitle}}</span></p><a class="btn slide-button"></a></label>',link:function(b,c,d){var e=d.ngTrueValue?d.ngTrueValue:!0,f=d.ngFalseValue?d.ngFalseValue:!1,g=b.$new(!0);c.bind("click",function(a){"input"===a.target.nodeName.toLowerCase()&&(g.$event={originalEvent:a,data:b.ngModel,target:c,type:"click"},b.click(g))}),b.$watch("checked",function(a,c){a!==c&&(b.ngModel=a?e:f)},!0),b.$watch("ngDisabled",function(a){a?(c.find("input").attr("disabled",!0),c.addClass("disabled")):(c.find("input").attr("disabled",!1),c.removeClass("disabled"))}),b.$watch("ngModel",function(a,d){b.checked=a===e?!0:!1,a!==d&&(g.$event={data:{value:a,oldValue:d},target:c,type:"change"},b.ngChange(g))},!0),a(function(){var a=c.find("span").outerWidth();c.width(2*a).find("span:last").css("left",a)})}}}angular.module("ntd.directives").directive("toggleSwitcher",["$timeout",a])}(),function(a){var b=function(){return{restrict:"A",templateUrl:"templates/checkbox-group.html",scope:{dataSource:"=ngModel"},link:function(b,f){b.status="none",b.init=a.bind(b,e,f),b.watchCheckboxGroup=a.bind(b,c),b.toggleCheckedAll=a.bind(b,d),b.init(f),b.watchCheckboxGroup()}}},c=function(){this.$watch("dataSource.checkboxGroup",function(b){var c=[];a.forEach(b,function(a){1==Boolean(a.checked)&&c.push(a)}),this.status=c.length>0&&c.length<this.dataSource.checkboxGroup.length?"part":c.length==this.dataSource.checkboxGroup.length&&c.length>0?"all":"none"}.bind(this),!0)},d=function(){this.status="none"==this.status?"all":"none",a.forEach(this.dataSource.checkboxGroup,function(a){a.checked="all"==this.status?!0:!1},this)},e=function(a){var b=a.find(".dropdown-toggle>input"),c=a.find(".dropdown-menu");b.bind("click",function(a){a.stopPropagation()}),c.bind("click",function(a){a.stopPropagation()})};a.module("ntd.directives").directive("checkboxGroup",[b])}(angular),function(a){"use strict";var b={config:{directionLinks:!0,previousText:"«",nextText:"»",total:1,size:5,page:1,pageKey:"page",rotate:!1},updateConfig:function(b){b=a.extend(this.config,b)},noPrevious:function(){return 1===this.config.page},noNext:function(){return this.config.page===this.config.total},isActive:function(a){return parseInt(this.config.page)===parseInt(a)},makePage:function(a,b,c,d){return{number:a,text:b,active:c,disabled:d}},getPages:function(){var a=[];if(!(this.config.total<=1)){var c=1,d=this.config.total,e=this.config.size&&this.config.size<this.config.total;e&&(c=Math.max(this.config.page-Math.floor(this.config.size/2),1),d=c+this.config.size-1,d>this.config.total&&(d=this.config.total,c=d-this.config.size+1));for(var f=c;d>=f;f++)if(1!=f&&f!=this.config.total){var g=this.makePage(f,f,this.isActive(f),!1);a.push(g)}if(e&&!this.config.rotate){if(c>1){var h=this.makePage(c-1,"...",!1,!1);a.unshift(h)}if(d<this.config.total){var i=this.makePage(d+1,"...",!1,!1);a.push(i)}}var j=this.makePage(1,1,this.isActive(1),!1);a.unshift(j);var k=this.makePage(this.config.total,this.config.total,this.isActive(this.config.total),!1);if(a.push(k),b.config.directionLinks){var l=this.makePage(this.config.page-1,this.config.previousText,!1,this.noPrevious());a.unshift(l);var m=this.makePage(this.config.page+1,this.config.nextText,!1,this.noNext());a.push(m)}return a}},selectPage:function(a,b){if(!this.isActive(b)&&b>0&&b<=this.config.total){this.config.page=b;var c=a.search();c[this.config.pageKey]=b,a.search(c).replace()}},render:function(a){a.pages=this.getPages()}},c=function(c){return{restrict:"A",template:'<ul class="pagination">\n<li ng-repeat="page in pages" ng-class="{active: page.active, disabled: page.disabled}"><a ng-click="selectPage(page.number)">{{page.text}}</a></li>\n</ul>\n',replace:!0,scope:{pageInfo:"=ngModel"},link:function(d){b.updateConfig(d.pageInfo),d.$watch("pageInfo",function(a){b.updateConfig(a),b.render(d)},!0),d.selectPage=a.bind(b,b.selectPage,c)}}};a.module("ntd.directives").directive("adminuiPagination",["$location",c])}(angular),function(a){"use strict";var b=function(a){return{restrict:"A",templateUrl:"templates/finder.html",scope:{source:"=",ngModel:"="},link:function(b,d){var e=new c(b,a,d);b.$watch("ngModel",function(a,c){0==e.isClick&&a!=c?e.selectItemByValue(b,a):e.isClick=!1}),b.$watch("source",function(f,g){f!=g&&(e=new c(b,a,d))},!0)}}},c=function(a,b,c){this.dataSource=this.initData(a.source),this.elem=c,this.$timeout=b,this.isClick=!1,this.expandList=[],this.selectedItems=[],this.initialize(a)};c.prototype.initialize=function(b){b.finderList=this.getExpandList(null),this.selectItemByValue(b,b.ngModel),b.showChildren=a.bind(this,this.showChildren,b),b.hasChildren=a.bind(this,this.hasChildren),b.isItemSelected=a.bind(this,this.isItemSelected),b.isLevelSelected=a.bind(this,this.isLevelSelected)},c.prototype.selectItemByValue=function(b,c){var d=this.getItemByValue(b.source,c);if(null!=d){var e=this.getAllSelected(d);a.forEach(e,function(a){this.showChildren(b,a)},this)}else this.expandList.length>1&&this.expandList.splice(1,this.expandList.length-1),this.selectedItems=[]},c.prototype.getItemByValue=function(b,c){var d=null;return a.forEach(b,function(a){a.value==c&&(d=a)}),d},c.prototype.getExpandList=function(a){return this.selectedItems=this.getAllSelected(a),this.selectedItems.length<=0&&this.expandList.push(this.dataSource[0]["/"]),this.expandList},c.prototype.isItemSelected=function(a,b){return this.selectedItems[b]==a?!0:!1},c.prototype.isLevelSelected=function(a){return this.selectedItems.length-1==a?!0:!1},c.prototype.showChildren=function(b,c,d){var e=this.getLevel(c),f=e+1,g=this.getChildren(c);a.isUndefined(this.selectedItems[e])||this.selectedItems.splice(e,this.selectedItems.length-e),this.selectedItems[e]=c,b.ngModel=this.selectedItems.slice(-1).pop().value,a.isUndefined(d)?this.scrollToView(this.selectedItems.length-1):this.isClick=!0,this.expandList.length>=f&&this.expandList.splice(f,this.expandList.length-f),null!=g&&(this.expandList[f]=this.getChildren(c))},c.prototype.scrollToView=function(b){this.$timeout(function(){var c=a.element(this.elem.find("ul")[b]),d=c.find("li.selected"),e=c.find("li").index(d);c.scrollTop(e*d.innerHeight()-c.innerHeight()/2)}.bind(this))},c.prototype.getChildren=function(b){var c=this.getLevel(b)+1,d=null;return a.isUndefined(this.dataSource[c])||this.dataSource[c].hasOwnProperty(this.getPath(b))&&(d=this.dataSource[c][this.getPath(b)]),d},c.prototype.hasChildren=function(a){return null==this.getChildren(a)?!1:!0},c.prototype.initData=function(b){var c=[];return a.forEach(b,function(b){var d=this.getLevel(b),e=this.getParentPath(b);a.isUndefined(c[d])&&(c[d]={}),a.isUndefined(c[d][e])&&(c[d][e]=[]),c[d][e].push(b)},this),c},c.prototype.getLevel=function(a){var b=this.getPath(a,!1);return b.split("/").length-1},c.prototype.getPath=function(b,c){var c=a.isUndefined(c)?!0:c,d=b.path;return"/"==d[d.length-1]&&(d=d.substr(0,d.length-1)),0==c&&(d=d.substr(1,d.length-1)),d},c.prototype.getParent=function(b){var c=this.getParentPath(b),d=null,e=this.getLevel(b);return e>0&&a.forEach(this.dataSource[e-1],function(b,e){0==c.indexOf(e)&&a.forEach(b,function(a){this.getPath(a)==c&&(d=a)},this)},this),d},c.prototype.getAllSelected=function(b){var c=a.isUndefined(arguments[1])?[]:arguments[1];return null==b?c:(c.unshift(b),this.getAllSelected(this.getParent(b),c))},c.prototype.getParentPath=function(b,c){var c=a.isUndefined(c)?!0:c,d="";if(1==c&&(d="/"),null===b)return d;var e=this.getPath(b,!1).split("/");return d+e.slice(0,e.length-1).join("/")},a.module("ntd.directives").directive("adminuiFinder",["$timeout",b])
}(angular),angular.module("ntd.directives").run(["$templateCache",function(a){"use strict";a.put("templates/adminui-frame.html",'<nav class="navbar navbar-inverse navbar-fixed-top" role=navigation><div class=container-fluid><div class=navbar-header><button class=navbar-toggle type=button data-toggle=collapse data-target=.bs-navbar-collapse><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a class=navbar-brand href="../"></a></div><div class="collapse navbar-collapse bs-navbar-collapse"><ul class="nav navbar-nav main-nav"><li data-ng-repeat="nav in navigation" data-ng-class="{true: \'active\', false: \'\'}[nav.children != null]"><a data-ng-href={{nav.url}}>{{nav.name}}</a><ul class=sub-navbar data-ng-if="nav.children != null"><li data-ng-repeat="subnav in nav.children" data-ng-class="{true: \'active\', false: \'\'}[isSelected(subnav)]"><a data-ng-click=selectNav(subnav) data-ng-href={{subnav.url}}>{{subnav.name}}</a></li></ul></li></ul><ul class="nav navbar-nav navbar-right"><li class=dropdown><a data-ng-show=isMessageBoxShow class=dropdown-toggle href=# data-toggle=dropdown><span class=badge data-ng-show="messages.length > 0">{{messages.length}}</span> <i class="glyphicon glyphicon-inbox"></i></a><ul data-ng-show=isMessageBoxShow class=dropdown-menu><li data-ng-repeat="message in messages"><a href=#>{{message.title}}</a></li><li class=divider></li><li><a href=#><i class="glyphicon glyphicon-chevron-right pull-right"></i> 查看全部</a></li></ul></li><li data-ng-class="{true: \'active\', false: \'\'}[isSubMenuShow]"><a href=javascript:; data-ng-click=toggleSubMenu($event)><i class="glyphicon glyphicon-list"></i></a></li><li data-ng-show="userInfo.username != null" class=dropdown><a class=dropdown-toggle href=# data-toggle=dropdown>您好，{{userInfo.username}}<b class=caret></b></a><ul class=dropdown-menu><li class=user-information><img data-ng-src={{userInfo.avatar}} alt=user_avatar><div class="user-content muted">{{userInfo.username}}</div></li><li class=divider></li><li><a data-ng-click=changePwd($event) href=#><i class="glyphicon glyphicon-lock"></i> 修改密码</a></li><li><a data-ng-click=logout($event) href=#><i class="glyphicon glyphicon-off"></i> 退出</a></li></ul></li></ul></div></div><nav class=sub-navbar-back></nav></nav><div class=container-fluid><div class="row fix-row"><div class="col-md-2 container-fluid" data-ng-show=hasSideMenu><div data-ng-show=isSubMenuShow class=row><div class="col-md-2 affix side-nav"><h4>{{sideMenuName}}</h4><ul class=side-nav-menu><li data-ng-repeat="sidemenu in menu" data-ng-class="{true: \'active\', false: \'\'}[isSelected(sidemenu)]"><a data-ng-href={{sidemenu.url}} data-ng-class="{true: \'has-sub-menu\', false: \'\'}[sidemenu.children != null]" data-ng-click="selectMenu(sidemenu, $event)"><i class="pull-right glyphicon glyphicon-chevron-down" data-ng-show="sidemenu.children != null"></i>{{sidemenu.name}}</a><ul data-ng-if="sidemenu.children != null"><li data-ng-repeat="subsidemenu in sidemenu.children" data-ng-class="{true: \'active\', false: \'\'}[isSelected(subsidemenu)]"><a data-ng-click="selectMenu(subsidemenu, $event)" data-ng-href={{subsidemenu.url}}>{{subsidemenu.name}}</a></li></ul></li></ul></div></div></div><div data-ng-class="{true: \'col-md-offset-2\', false: \'\'}[isSubMenuShow && hasSideMenu]" class="message-container flash-alert"></div><div data-ng-class="{true: \'col-md-offset-2\', false: \'\'}[isSubMenuShow && hasSideMenu]" class="message-container notice"></div><div data-ng-class="{true: \'col-md-10\', false: \'col-md-12\'}[isSubMenuShow && hasSideMenu]" data-ng-transclude=""></div><div data-adminui-load-backdrop="" class="load-backdrop pdm-app" style=display:none><div class=splash><img class=loading src=images/ajax-loader.gif alt=加载中></div></div></div></div>'),a.put("templates/checkbox-group.html","<div class=\"dropdown dropdown-checkbox-group\"><label class=dropdown-toggle data-toggle=dropdown><input type=checkbox data-ng-click=toggleCheckedAll() data-ng-class=\"{'part': 'part-checked'}[status]\" data-ng-checked=\"{'all': true, 'part': true, 'none': false}[status]\">{{dataSource.name}} <b class=caret></b></label><ul class=dropdown-menu><li data-ng-repeat=\"checkbox in dataSource.checkboxGroup\"><label><input type=checkbox data-ng-model=checkbox.checked>{{checkbox.name}}</label></li><li data-ng-show=\"dataSource.checkboxGroup.length <= 0\"><label>无可选项目</label></li></ul></div>"),a.put("templates/finder.html",'<div class=adminui-finder-container><div class=adminui-finder-inner>{{selectedItems}}<ul data-ng-repeat="list in finderList" style="margin-left: {{30 * $index}}%" data-ng-class="{true: \'selected\'}[isLevelSelected($index)]"><li data-ng-click="showChildren(item, $event)" data-ng-class="[{true: \'selected\'}[isItemSelected(item, $parent.$index)], {true: \'has-child\'}[hasChildren(item)]]" data-ng-repeat="item in list">{{item.text}}</li></ul></div></div>')}]);
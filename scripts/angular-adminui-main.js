'use strict';
var adminuiApp = angular.module('adminuiApp', [
    'ngRoute',
    'ntd.services',
    'ntd.directives',
    'ui.bootstrap',
    'bootstrapPrettify'
  ]);
adminuiApp.run([
  '$rootScope',
  function ($rootScope) {
    $rootScope.userInfo = {};
  }
]);
/* config adminui frame */
angular.module('ntd.directives').config([
  'adminuiFrameProvider',
  function (adminuiFrameProvider) {
    adminuiFrameProvider.setConfig({
      defaultShowSubmenu: true,
      showMessageBox: true,
      navigation: [
        {
          'name': 'AdminUI',
          'url': null,
          'children': [
            {
              'name': '\u7528\u6237\u9762\u677f',
              'url': '#/',
              'children': [
                {
                  'name': '\u7528\u6237\u9762\u677f',
                  'url': '#/',
                  'children': null
                },
                {
                  'name': '\u5b50\u83dc\u5355',
                  'url': null,
                  'children': [
                    {
                      'name': '\u5206\u7c7b\u4e00',
                      'url': '#/sub/test',
                      'children': null
                    },
                    {
                      'name': '\u5206\u7c7b\u4e8c',
                      'url': '#/sub/test2',
                      'children': null
                    },
                    {
                      'name': '\u5206\u7c7b\u4e09',
                      'url': '#/sub/test3',
                      'children': null
                    }
                  ]
                }
              ]
            },
            {
              'name': '\u7ec4\u4ef6\u6837\u5f0f',
              'url': '#/base-css',
              'children': [
                {
                  'name': '\u57fa\u672c\u6837\u5f0f',
                  'url': '#/base-css',
                  'children': null
                },
                {
                  'name': '\u8868\u683c\u6837\u5f0f',
                  'url': '#/table',
                  'children': null
                },
                {
                  'name': '\u8868\u5355\u6837\u5f0f',
                  'url': '#/form',
                  'children': null
                }
              ]
            },
            {
              'name': 'UI\u7ec4\u4ef6',
              'url': '#/widget',
              'children': [
                {
                  'name': 'Admin UI\u7ec4\u4ef6',
                  'url': '#/widget',
                  'children': null
                },
                {
                  'name': 'Bootstrap\u7ec4\u4ef6',
                  'url': '#/bootstrap-ui-widget',
                  'children': null
                }
              ]
            },
            {
              'name': '\u5176\u4ed6\u9875\u9762',
              'url': '#/login',
              'children': [
                {
                  'name': '\u767b\u5f55\u9875\u9762',
                  'url': '#/login',
                  'children': null
                },
                {
                  'name': '404\u9875\u9762',
                  'url': '#/404',
                  'children': null
                }
              ]
            },
            {
              'name': '\u5347\u7ea7\u6307\u5357',
              'url': '#/update-guide',
              'children': null
            }
          ]
        },
        {
          'name': '\u8ba2\u5355&\u4ea7\u54c1\u7ba1\u7406\u7cfb\u7edf',
          'url': 'http://product.staging.ec3s.com',
          'children': null
        },
        {
          'name': '\u4ed3\u50a8\u7ba1\u7406\u7cfb\u7edf',
          'url': 'http://wms.staging.ec3s.com',
          'children': null
        },
        {
          'name': ' \u8d22\u52a1\u7ba1\u7406\u7cfb\u7edf',
          'url': 'http://fms.staging.ec3s.com',
          'children': null
        }
      ]
    });
  }
]);
adminuiApp.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    }).when('/base-css', {
      templateUrl: 'views/base_css.html',
      controller: 'MainCtrl'
    }).when('/form', {
      templateUrl: 'views/form.html',
      controller: 'MainCtrl'
    }).when('/widget', {
      templateUrl: 'views/widget.html',
      controller: 'MainCtrl'
    }).when('/bootstrap-ui-widget', {
      templateUrl: 'views/bootstrap_ui_widget.html',
      controller: 'MainCtrl'
    }).when('/table', {
      templateUrl: 'views/table.html',
      controller: 'MainCtrl'
    }).when('/login', {
      templateUrl: 'views/login.html',
      controller: 'MainCtrl'
    }).when('/sub/test', {
      templateUrl: 'views/sub_page.html',
      controller: 'MainCtrl'
    }).when('/sub/test2', {
      templateUrl: 'views/sub_page.html',
      controller: 'MainCtrl'
    }).when('/sub/test3', {
      templateUrl: 'views/sub_page.html',
      controller: 'MainCtrl'
    }).when('/404', {
      templateUrl: 'views/404.html',
      controller: 'MainCtrl'
    }).when('/test', {
      templateUrl: 'views/test.html',
      controller: 'MainCtrl'
    }).when('/update-guide', {
      templateUrl: 'views/update_guide.html',
      controller: 'MainCtrl'
    }).otherwise({ redirectTo: '/' });  //$locationProvider.html5Mode(true);
  }
]);
'use strict';
adminuiApp.controller('MainCtrl', [
  '$scope',
  '$window',
  '$location',
  function ($scope, $window, $location) {
    $scope.$location = $location;
    $scope.name = 'Nobody';
    $scope.sayHello = function (name) {
      $scope.name = name;
      console.log('say hello' + name);
    };
    $scope.crmDropdown = [
      {
        text: 'CRM Another action',
        href: '#anotherAction'
      },
      {
        text: 'CRM Something else here',
        click: '$alert(\'working ngClick!\')'
      },
      { text: 'CRM Separated link' }
    ];
    $scope.pecDropdown = [
      {
        text: 'CRM Another action',
        href: '#anotherAction'
      },
      {
        text: 'CRM Something else here',
        click: '$alert(\'working ngClick!\')'
      },
      { text: 'CRM Separated link' }
    ];
    $scope.wmsDropdown = [
      {
        text: 'CRM Another action',
        href: '#anotherAction'
      },
      {
        text: 'CRM Something else here',
        click: '$alert(\'working ngClick!\')'
      },
      { text: 'CRM Separated link' }
    ];
    $scope.easyPieChart = [
      {
        caption: 'New Visits',
        percent: 58,
        usage: '58%'
      },
      {
        caption: 'Bounce Rate',
        percent: 43,
        usage: '43%'
      },
      {
        caption: 'Server Load',
        percent: 91,
        usage: '91%'
      },
      {
        caption: 'Used RAM',
        percent: 82,
        usage: '75M'
      },
      {
        caption: 'Processor Load',
        percent: 35,
        usage: '35%'
      },
      {
        caption: 'Bandwidth',
        percent: 77,
        usage: '1.5TB'
      }
    ];
    $scope.alert = {};
  }
]);
/* for checkbox group */
var checkboxGroupCtrl = function ($scope) {
  $scope.checkboxGroupData = {
    'name': '\u4ea7\u54c1\u7ba1\u7406',
    'checkboxGroup': [
      {
        'name': '\u67e5\u770b\u4ea7\u54c1',
        'value': 'read',
        'checked': true
      },
      {
        'name': '\u7f16\u8f91\u4ea7\u54c1',
        'value': 'edit'
      },
      {
        'name': '\u6dfb\u52a0\u4ea7\u54c1',
        'value': 'add',
        'checked': true
      },
      {
        'name': '\u5220\u9664\u4ea7\u54c1',
        'value': 'delete'
      }
    ]
  };
  $scope.emptyCheckboxGroupData = {
    'name': '\u7a7a\u5206\u7ec4',
    'checkboxGroup': []
  };
};
adminuiApp.controller('checkboxGroupCtrl', [
  '$scope',
  checkboxGroupCtrl
]);
/* for pagination */
var paginationCtrl = function ($scope, $route) {
  var page = $route.current.params['page'];
  $scope.pageInfo = {
    'page': page ? page : 1,
    'total': 10
  };
};
adminuiApp.controller('paginationCtrl', [
  '$scope',
  '$route',
  paginationCtrl
]);
/* for chosen */
var chosenCtrl = function ($scope, $http, $q) {
  $scope.options = this.getOptions();
  $scope.optionPromise = angular.bind(this, this.getOptionPromise, $http, $q);
  $scope.tags = [
    {
      'name': 'tag0',
      'id': 1,
      'editable': true,
      'deletable': false
    },
    'tag1',
    'tag2',
    {
      'name': 'tag3',
      'id': 1,
      'editable': true,
      'deletable': false
    }
  ];
  $scope.linkages = [{
      id: 1,
      name: 'bb',
      children: [{
          id: 2,
          name: 'aa',
          children: [{
              id: 3,
              name: 'vv'
            }]
        }]
    }];
};
chosenCtrl.prototype.getOptionPromise = function ($http, $q, search) {
  var deferred = $q.defer();
  $http.jsonp('http://api.rottentomatoes.com/api/public/v1.0/movies.json?q=' + search + '&apikey=ju6z9mjyajq2djue3gbvv26t&page_limit=10&page=1' + '&callback=JSON_CALLBACK').success(function (data) {
    deferred.resolve(data.movies);
  }).error(function (error) {
    deferred.reject(error);
  });
  return deferred.promise;
};
chosenCtrl.prototype.getOptions = function () {
  return [
    {
      id: 1,
      name: 'CN'
    },
    {
      id: 2,
      name: 'JP'
    },
    {
      id: 3,
      name: 'EN'
    },
    {
      id: 4,
      name: 'AU'
    },
    {
      id: 5,
      name: 'DE'
    }
  ];
};
adminuiApp.controller('TabsDemoCtrl', [
  '$scope',
  function ($scope) {
    $scope.tabs = [
      {
        title: 'Dynamic Title 1',
        content: 'Dynamic content 1'
      },
      {
        title: 'Dynamic Title 2',
        content: 'Dynamic content 2'
      }
    ];
    $scope.alertMe = function () {
      setTimeout(function () {
        console.log($scope.tabs);
        angular.forEach($scope.tabs, function (tab, key) {
          if (tab.active === true) {
            console.log(key);
          }
          ;
        });
      });
    };
    $scope.navType = 'pills';
  }
]).controller('TypeaheadCtrl', [
  '$scope',
  function ($scope) {
    $scope.selected = undefined;
    $scope.states = [
      'Alabama',
      'Alaska',
      'Arizona',
      'Arkansas',
      'California',
      'Colorado',
      'Connecticut',
      'Delaware',
      'Florida',
      'Georgia',
      'Hawaii',
      'Idaho',
      'Illinois',
      'Indiana',
      'Iowa',
      'Kansas',
      'Kentucky',
      'Louisiana',
      'Maine',
      'Maryland',
      'Massachusetts',
      'Michigan',
      'Minnesota',
      'Mississippi',
      'Missouri',
      'Montana',
      'Nebraska',
      'Nevada',
      'New Hampshire',
      'New Jersey',
      'New Mexico',
      'New York',
      'North Dakota',
      'North Carolina',
      'Ohio',
      'Oklahoma',
      'Oregon',
      'Pennsylvania',
      'Rhode Island',
      'South Carolina',
      'South Dakota',
      'Tennessee',
      'Texas',
      'Utah',
      'Vermont',
      'Virginia',
      'Washington',
      'West Virginia',
      'Wisconsin',
      'Wyoming'
    ];
  }
]).controller('PaginationDemoCtrl', [
  '$scope',
  function ($scope) {
    $scope.totalItems = 64;
    $scope.currentPage = 4;
    $scope.maxSize = 5;
    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;
  }
]).controller('CollapseDemoCtrl', [
  '$scope',
  function ($scope) {
    $scope.isCollapsed = false;
  }
]).controller('AccordionDemoCtrl', [
  '$scope',
  function ($scope) {
    $scope.oneAtATime = true;
    $scope.groups = [
      {
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
      },
      {
        title: 'Dynamic Group Header - 2',
        content: 'Dynamic Group Body - 2'
      }
    ];
    $scope.items = [
      'Item 1',
      'Item 2',
      'Item 3'
    ];
    $scope.addItem = function () {
      var newItemNo = $scope.items.length + 1;
      $scope.items.push('Item ' + newItemNo);
    };
  }
]).controller('AlertDemoCtrl', [
  '$scope',
  function ($scope) {
    $scope.alerts = [
      {
        type: 'warning',
        msg: '\u8b66\u544a'
      },
      {
        type: 'danger',
        msg: '\u5931\u8d25\uff0c\u9519\u8bef, \u5371\u9669'
      },
      {
        type: 'success',
        msg: '\u6210\u529f\u4fe1\u606f'
      },
      {
        type: 'info',
        msg: '\u9700\u8981\u6ce8\u610f\u7684\u4fe1\u606f'
      }
    ];
    $scope.addAlert = function () {
      $scope.alerts.push({ msg: 'Another alert!' });
    };
    $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
    };
  }
]).controller('ButtonsCtrl', [
  '$scope',
  function ($scope) {
    $scope.singleModel = 1;
    $scope.radioModel = 'Middle';
    $scope.checkModel = {
      left: false,
      middle: true,
      right: false
    };
  }
]).controller('DropdownCtrl', [
  '$scope',
  function ($scope) {
    $scope.items = [
      'The first choice!',
      'And another choice for you.',
      'but wait! A third!'
    ];
  }
]).controller('TooltipDemoCtrl', [
  '$scope',
  function ($scope) {
    $scope.dynamicTooltip = 'Hello, World!';
    $scope.dynamicTooltipText = 'dynamic';
    $scope.htmlTooltip = 'I\'ve been made <b>bold</b>!';
  }
]).controller('PopoverDemoCtrl', [
  '$scope',
  function ($scope) {
    $scope.dynamicPopover = 'Hello, World!';
    $scope.dynamicPopoverText = 'dynamic';
    $scope.dynamicPopoverTitle = 'Title';
  }
]).controller('DateCtrl', [
  '$scope',
  function ($scope) {
    $scope.dateOptions = {
      changeYear: true,
      changeMonth: true,
      yearRange: '1900:-0'
    };
    $scope.myDate = 'Thursday, 11 October, 2012';
  }
]).controller('confirmButtonCtrl', [
  '$scope',
  function ($scope) {
    $scope.talk = function (msg) {
      alert(msg);
    };
  }
]).controller('PieCtrl', [
  '$scope',
  function ($scope) {
    var data = {
        'total': 299,
        'analysis': [
          {
            'name': '20-30\u5c81',
            'value': 96
          },
          {
            'name': '31-40\u5c81',
            'value': 26
          },
          {
            'name': '41-50\u5c81',
            'value': 46
          },
          {
            'name': '51-60\u5c81',
            'value': 17
          }
        ]
      };
    $scope.ageData = data;
  }
]).controller('noticeCtrl', [
  '$rootScope',
  '$scope',
  'flash',
  function ($rootScope, $scope, flash) {
    $scope.sendMsg = function (msg) {
      flash.notify(msg);
    };
  }
]).controller('loadingButtonCtrl', [
  '$scope',
  '$q',
  '$timeout',
  function ($scope, $q, $timeout) {
    $scope.isProcessing = false;
    $scope.do = function () {
      $scope.isProcessing = true;
      $timeout(function () {
        $scope.$apply(function () {
          $scope.isProcessing = false;
        });
      }, 2000);
    };
    $scope.save = function () {
      var defered = $q.defer();
      $timeout(function () {
        defered.resolve();
      }, 2000);
      return defered.promise;
    };
  }
]).controller('cascadeListCtrl', [
  '$scope',
  '$q',
  '$timeout',
  function ($scope, $q, $timeout) {
    $scope.dpt = { 'parentCode': '14' };
    $scope.dptList = [
      {
        'dptCode': '1',
        'dptMasterId': 0,
        'dptName': '\u884c\u653f\u90e8',
        'dptPath': '/1/',
        'id': 1,
        'parentCode': '0'
      },
      {
        'dptCode': '10',
        'dptMasterId': 0,
        'dptName': '\u4f01\u4e1a\u8054\u76df\u53d1\u5c55\u90e8',
        'dptPath': '/10/',
        'id': 10,
        'parentCode': '0'
      },
      {
        'dptCode': '85',
        'dptMasterId': 0,
        'dptName': '\u652f\u6301\u90e8',
        'dptPath': '/10/85/',
        'id': 85,
        'parentCode': '10'
      },
      {
        'dptCode': '86',
        'dptMasterId': 0,
        'dptName': 'B2B2C\u7535\u5546\u5e73\u53f0',
        'dptPath': '/10/86/',
        'id': 86,
        'parentCode': '10'
      },
      {
        'dptCode': '87',
        'dptMasterId': 0,
        'dptName': '\u670d\u9970\u6bcd\u5a74',
        'dptPath': '/10/87/',
        'id': 87,
        'parentCode': '10'
      },
      {
        'dptCode': '88',
        'dptMasterId': 0,
        'dptName': '3C\u6570\u7801',
        'dptPath': '/10/88/',
        'id': 88,
        'parentCode': '10'
      },
      {
        'dptCode': '89',
        'dptMasterId': 0,
        'dptName': '\u9500\u552e\u90e8',
        'dptPath': '/10/89/',
        'id': 89,
        'parentCode': '10'
      },
      {
        'dptCode': '2',
        'dptMasterId': 0,
        'dptName': '\u6280\u672f\u90e8',
        'dptPath': '/2/',
        'id': 2,
        'parentCode': '0'
      },
      {
        'dptCode': '11',
        'dptMasterId': 0,
        'dptName': 'WMS\u7814\u53d1\u90e8',
        'dptPath': '/2/11/',
        'id': 11,
        'parentCode': '2'
      },
      {
        'dptCode': '14',
        'dptMasterId': 0,
        'dptName': 'UED',
        'dptPath': '/2/14/',
        'id': 14,
        'parentCode': '2'
      },
      {
        'dptCode': '38',
        'dptMasterId': 0,
        'dptName': 'PEC\u7814\u53d1\u90e8',
        'dptPath': '/2/38/',
        'id': 38,
        'parentCode': '2'
      },
      {
        'dptCode': '45',
        'dptMasterId': 0,
        'dptName': '\u8fd0\u7ef4\u90e8',
        'dptPath': '/2/45/',
        'id': 45,
        'parentCode': '2'
      },
      {
        'dptCode': '69',
        'dptMasterId': 0,
        'dptName': 'b2b2c\u7814\u53d1\u90e8',
        'dptPath': '/2/69/',
        'id': 69,
        'parentCode': '2'
      },
      {
        'dptCode': '97',
        'dptMasterId': 0,
        'dptName': 'NTD',
        'dptPath': '/2/97/',
        'id': 97,
        'parentCode': '2'
      },
      {
        'dptCode': '48',
        'dptMasterId': 0,
        'dptName': '\u6218\u7565\u53d1\u5c55\u90e8',
        'dptPath': '/48/',
        'id': 48,
        'parentCode': '0'
      },
      {
        'dptCode': '65',
        'dptMasterId': 0,
        'dptName': '\u5e02\u573a',
        'dptPath': '/48/65/',
        'id': 65,
        'parentCode': '48'
      },
      {
        'dptCode': '66',
        'dptMasterId': 0,
        'dptName': '\u8fd0\u8425',
        'dptPath': '/48/66/',
        'id': 66,
        'parentCode': '48'
      },
      {
        'dptCode': '96',
        'dptMasterId': 0,
        'dptName': '\u5ba2\u670d',
        'dptPath': '/48/96/',
        'id': 96,
        'parentCode': '48'
      },
      {
        'dptCode': '5',
        'dptMasterId': 0,
        'dptName': '\u54c1\u724c\u53d1\u5c55\u4e8b\u4e1a\u90e8',
        'dptPath': '/5/',
        'id': 5,
        'parentCode': '0'
      },
      {
        'dptCode': '82',
        'dptMasterId': 0,
        'dptName': '\u5b98\u7f51\u7ec4',
        'dptPath': '/5/82/',
        'id': 82,
        'parentCode': '5'
      },
      {
        'dptCode': '95',
        'dptMasterId': 0,
        'dptName': '\u7535\u8bdd\u5ba2\u670d\u90e8',
        'dptPath': '/5/82/95/',
        'id': 95,
        'parentCode': '82'
      },
      {
        'dptCode': '99',
        'dptMasterId': 0,
        'dptName': '\u7535\u8bdd\u5ba2\u670d\u90e8',
        'dptPath': '/5/82/95/',
        'id': 95,
        'parentCode': '95'
      },
      {
        'dptCode': '93',
        'dptMasterId': 0,
        'dptName': '\u5929\u732b\u7ec4',
        'dptPath': '/5/93/',
        'id': 93,
        'parentCode': '5'
      },
      {
        'dptCode': '83',
        'dptMasterId': 0,
        'dptName': '\u5728\u7ebf\u5ba2\u670d\u90e8',
        'dptPath': '/5/93/83//',
        'id': 83,
        'parentCode': '93'
      },
      {
        'dptCode': '94',
        'dptMasterId': 0,
        'dptName': '\u552e\u540e\u90e8',
        'dptPath': '/5/94/',
        'id': 94,
        'parentCode': '5'
      },
      {
        'dptCode': '61',
        'dptMasterId': 0,
        'dptName': '\u6444\u5f71\u5de5\u4f5c\u5ba4',
        'dptPath': '/61/',
        'id': 61,
        'parentCode': '0'
      },
      {
        'dptCode': '62',
        'dptMasterId': 0,
        'dptName': '\u676d\u5dde\u5206\u516c\u53f8',
        'dptPath': '/62/',
        'id': 62,
        'parentCode': '0'
      },
      {
        'dptCode': '67',
        'dptMasterId': 0,
        'dptName': '\u9752\u5c9b\u5206\u516c\u53f8',
        'dptPath': '/67/',
        'id': 67,
        'parentCode': '0'
      },
      {
        'dptCode': '70',
        'dptMasterId': 0,
        'dptName': '\u6280\u672f\u90e8',
        'dptPath': '/67/70/',
        'id': 70,
        'parentCode': '67'
      },
      {
        'dptCode': '71',
        'dptMasterId': 0,
        'dptName': '\u8d22\u52a1\u90e8',
        'dptPath': '/67/71/',
        'id': 71,
        'parentCode': '67'
      },
      {
        'dptCode': '72',
        'dptMasterId': 0,
        'dptName': '\u8fd0\u8425\u90e8',
        'dptPath': '/67/72/',
        'id': 72,
        'parentCode': '67'
      },
      {
        'dptCode': '75',
        'dptMasterId': 0,
        'dptName': '\u884c\u653f\u90e8',
        'dptPath': '/67/75/',
        'id': 75,
        'parentCode': '67'
      },
      {
        'dptCode': '91',
        'dptMasterId': 0,
        'dptName': '\u9500\u552e\u90e8',
        'dptPath': '/67/91/',
        'id': 91,
        'parentCode': '67'
      },
      {
        'dptCode': '92',
        'dptMasterId': 0,
        'dptName': '\u5ba2\u670d\u90e8',
        'dptPath': '/67/92/',
        'id': 92,
        'parentCode': '67'
      },
      {
        'dptCode': '8',
        'dptMasterId': 0,
        'dptName': '\u8d22\u52a1\u90e8',
        'dptPath': '/8/',
        'id': 8,
        'parentCode': '0'
      },
      {
        'dptCode': '90',
        'dptMasterId': 0,
        'dptName': '\u4ed3\u50a8',
        'dptPath': '/8/90/',
        'id': 90,
        'parentCode': '8'
      },
      {
        'dptCode': '90',
        'dptMasterId': 0,
        'dptName': '\u4ed3\u50a8',
        'dptPath': '/8/90/',
        'id': 90,
        'parentCode': '8'
      },
      {
        'dptCode': '9',
        'dptMasterId': 0,
        'dptName': '\u4eba\u529b\u8d44\u6e90\u90e8',
        'dptPath': '/9/',
        'id': 9,
        'parentCode': '0'
      }
    ];
  }
]).controller('chosenCtrl', [
  '$scope',
  '$http',
  '$q',
  chosenCtrl
]).controller('switcherCtrl', [
  '$scope',
  function ($scope) {
    $scope.opened = 'open';
    $scope.click = function (event) {
      console.log(event);
    };
    $scope.change = function (event) {
      console.log(event);
    };
    $scope.do = function () {
      $scope.opened = $scope.opened == 'open' ? 'close' : 'open';
    };
  }
]).controller('flashMessageCtrl', [
  '$scope',
  '$timeout',
  'flash',
  function ($scope, $timeout, flash) {
    $scope.sendMsg = function (msg, level) {
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
  }
]);
var ModalDemoCtrl = function ($scope, $modal, $log) {
  var t = '<div class="modal-header">' + '<h3>' + 'I\'m a modal!' + '</h3>' + '</div>' + '<div class="modal-body">' + '<ul>' + '<li ng-repeat="item in items">' + '<a ng-click="selected.item = item">' + '{{ item }}' + '</a>' + '</li>' + '</ul>' + 'Selected:' + '<b>' + '{{ selected.item }}' + '</b>' + '</div>' + '<div class="modal-footer">' + '<button class="btn btn-primary" ng-click="ok()">' + 'OK' + '</button>' + '<button class="btn btn-warning" ng-click="cancel()">' + 'Cancel' + '</button>' + '</div>';
  $scope.items = [
    'item1',
    'item2',
    'item3'
  ];
  $scope.open = function () {
    var modalInstance = $modal.open({
        template: t,
        controller: ModalInstanceCtrl,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};
var ModalInstanceCtrl = function ($scope, $modalInstance, items) {
  $scope.items = items;
  $scope.selected = { item: $scope.items[0] };
  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
/**
 * Created by Qing on 2018/1/28.
 */
var url = 'http://47.75.5.78:8081';
var app = angular.module('kcash',['ionic']);
/**
 * 配置状态
 */
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('start',{
            url:'/myStart',
            templateUrl:'tpl/start.html',
            controller:'startCtrl'
        })
        .state('main',{
            url:'/myMain',
            templateUrl:'tpl/main.html',
            controller:'mainCtrl'
        })
        .state('purseTool',{
            url:'/myPurseTool',
            templateUrl:'purseTool/purseTool.html',
            controller:'purseToolCtrl'
        })
        .state('setSystem',{
            url:'/mySetSystem',
            templateUrl:'setSystem/setSystem.html',
            controller:'setSystemCtrl'
        })
        .state('signOut',{
            url:'/mySignOut',
            templateUrl:'tpl/signOut.html',
            controller:'signOutCtrl'
        })
        .state('register',{
            url:'/myRegister',
            templateUrl:'tpl/register.html',
            controller:'registerCtrl'
        })
        .state('login',{
            url:'/myLogin',
            templateUrl:'tpl/login.html',
            controller:'loginCtrl'
        })
        .state('addAsset',{
            url:'/myAddAsset',
            templateUrl:'tpl/addAsset.html',
            controller:'addAssetCtrl'
        })
        .state('transaction',{
            url:'/myTransaction/:id',
            templateUrl:'transaction/transaction.html',
            controller:'transactionCtrl'
        })
        .state('resetPassword',{
            url:'myResetPassword',
            templateUrl:'tpl/resetPassword.html',
            controller:'resetPasswordCtrl'
        });
        //.state('menu',{
        //    url:'',
        //    templateUrl:'',
        //    controller:'menuCtrl'
        //})

    $urlRouterProvider.otherwise('myMain');
})
/**
 * 刷新网页
 */
.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})
/**
 * 声明控制器
 */
.controller('parentCtrl',
    ['$scope','$state', '$window',function ($scope,$state,$window) {
        //跳转方法
        $scope.jump = function (arg) {
            $state.go(arg);
        };
        //返回功能
        $scope.backWard = function () {
            $window.history.back();
            console.log("返回");
        };
        //判断当前用户是否登录
        //$rootScope.isLogin = false;

    }])
    //起始页
    .controller('startCtrl',['$scope','$timeout','$interval','$state',
        function ($scope,$timeout,$interval,$state) {
            //定时
            $scope.secondNumber = 3;
            $timeout(function () {
                $state.go('main');
            },3000);
            $interval(function () {
                if($scope.secondNumber>0)
                    $scope.secondNumber--;
            },1000);
    }])
    .controller('mainCtrl',['$scope','$timeout' ,'$http', function ($scope,$timeout,$http) {
        $http({
            method:'post',
            url:url+'/virtualCoin/getCoinType',
            data:{},
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                return transformRequest(obj);
            }
        })
        $scope.doRefresh = function() {
            $http.get('item.json')   //注意改为自己本站的地址，不然会有跨域问题
                .success(function(newWallet) {
                    console.log("刷新了");
                    $scope.walletList = newWallet;
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
    }])
    .controller('signOutCtrl',['$scope','$ionicModal', function ($scope,$ionicModal) {
        //模态框
        $ionicModal.fromTemplateUrl('templates/mymodal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
    }])
    .controller('purseToolCtrl',['$scope', function ($scope) {

    }])
    //注册
app.controller('registerCtrl',
    ['$scope','$http', function ($scope,$http) {
        //验证码
        $scope.verification = function () {
            $http({
                method: 'post',
                url: url+'/user/authCode',
                data: {phone:$scope.phone},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
                .success(function (data) {
                    console.log(data);
                    console.log('验证码'+data.data);
                    $scope.verifica = data;

                })
        }
        //注册

        $scope.register = function () {
            $http({
                method:'post',
                url:'http://47.75.5.78:8081/user/register',
                data:{floginName:$scope.phone,floginPassword:$scope.floginPassword,authCode:$scope.authCode},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
                .success(function (result) {
                    console.log(result);
                })
        }
    }])
    .controller('loginCtrl',['$scope','$http', function ($scope,$http) {
        //实现登录
        $scope.login = function () {
            $http({
                method:'post',
                url:'http://47.75.5.78:8081/user/login',
                data:{floginName:$scope.floginName,floginPassword:$scope.floginPassword},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
                .success(function (result) {
                    if(result.status == 200){
                        setCookie('user_token',result.data,7);
                        console.log('succ')
                    }else{
                        checkRequestStatus(result);
                    }
                })
        }

    }])
    .controller('setSystemCtrl',['$scope', function ($scope) {

    }])
    .controller('addAssetCtrl',['$scope', function ($scope) {
        
    }])
    .controller('transactionCtrl',['$scope','$http','$routeParams', function ($scope,$http,$routeParams) {
        //console.log($stateParams.id);
        $http.get('item.json'+$routeParams.id)
            .success(function (data) {
                $scope.wallet = data[0];
                console.log(data)
                $scope.walletList = data;
            })

    }])
    controller('changePassword',['$scope','$http', function ($scope, $http) {

    }]);

//Cookie存储token
function getCookie(c_name){
    if (document.cookie.length>0){
        var c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1){
            c_start=c_start + c_name.length+1;
            var c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) {
                c_end=document.cookie.length;
            }
            console.log(document.cookie.substring(c_start,c_end));
            return document.cookie.substring(c_start,c_end);
        }
    }
    return "";
}
function setCookie(c_name,value,expiredays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +value+((expiredays==null) ? "" : "; expires="+exdate.toGMTString())
}
function checkRequestStatus(result){
    if(result.status == 403){
        alert(result.msg);
    }else if(result.status == 401){
        //token无效，需要跳转到登录
    }
}
//拼接
function transformRequest(obj){
    var str = [];
    for (var p in obj) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
    return str.join("&");
}
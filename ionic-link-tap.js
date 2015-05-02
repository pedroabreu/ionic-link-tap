(function(){
    'use strict';

	angular
        .module('ionic-link-tap.tapAction',[])
        .directive('ionicLinkTapAction',ionicLinkTapAction);

    ionicLinkTapAction.$inject = ['$timeout','$compile','$window','$ionicPlatform','$cordovaEmailComposer','$cordovaDialogs'];

	function ionicLinkTapAction($timeout,$compile,$window,$ionicPlatform,$cordovaEmailComposer,$cordovaDialogs){
        
        var isCordovaEnabled = (function(){
            if(typeof $window.cordova === 'object'){
                return true;
            }
            else{
                return false;
            }
        })();
           
		return {
			restrict: 'A',
			scope:{
				ionicLinkTapAction: '=ionicLinkTapAction'
			},
			link: link
		};

		function link(scope, element, attrs) {
            if(scope.ionicLinkTapAction === null){
                return false;
            }
            
            if(scope.ionicLinkTapAction.indexOf('http') !== -1){
                element.bind('click', function() {
                    $timeout(function() {
                        checkAppType(function(){openBrowser(scope.ionicLinkTapAction,'_blank');},function(){openBrowser(scope.ionicLinkTapAction,'_system');});
                    });
                });
            }
            else{
                checkAppType(function(){nativeAction(scope,element,attrs);},function(){webAction(scope,attrs);});
            }
        }
        
        function webAction(scope,attrs){
            attrs.$set('href', scope.ionicLinkTapAction);
            $compile(attrs)(scope);
        }
        
        function nativeAction(scope,element,attrs){
            var email;
            //Email: mailto:info@something.com?subject=&body=
            if(scope.ionicLinkTapAction.indexOf('mailto') !== -1){
                email = parseEmail(scope.ionicLinkTapAction);
                                
                element.bind('click', function() {
                    $timeout(function() {
                        emailComposer(email);
                    });
                });
            }
            else{
                webAction(scope,attrs);
            }
        }
        
        function openBrowser(url,target) {
            window.open(url, target, 'location=no,toolbar=yes');
            return false;
        }
        
        function emailComposer(email){
            $ionicPlatform.ready(function() {
                $cordovaEmailComposer.isAvailable().then(function() {
                    $cordovaEmailComposer.open(email).then(null, function () {
                        // user cancelled email
                    });
                }, function() {
                    showAlertDialog('No email client installed.','Cannot send email','OK');
                });
            });
        }
        
        function showAlertDialog(message, title, button, callback) {
            $ionicPlatform.ready(function() {
                $cordovaDialogs.alert(message, title, button)
                    .then(function() {
                        if (isFunction(callback) === true) {
                            callback();
                        }
                });
            });
        }
        
        function parseEmail(mailto){
            //REGEX: /mailto:(.*?)\?(.*)/ get email and split parameters 
            var expression = /mailto:(.*?)\?subject=(.*)\&body=(.*)/,
                emailDetails = expression.exec(mailto);
            
            return {
                to: emailDetails[1],
                subject: emailDetails[2],
                body: emailDetails[3],
                isHtml: true
            };
        }

        function checkAppType(nativeCallback,webCallback){
            if(isCordovaEnabled === true){
                if (isFunction(nativeCallback) === true) {
                    return nativeCallback();
                }
            }
            else{
                if (isFunction(webCallback) === true) {
                    return webCallback();
                }
            }
        }
        
        function isFunction(callback){
            return typeof callback === 'function' ? true : false;
        }
    }
})();
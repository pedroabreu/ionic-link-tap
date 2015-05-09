# ionic-link-tap
Ionic directive for handling native (ngCordova) and web link taps

Evaluates platform (Native or Web) and defines the link tap action according to its type. Tested on native Android, native iOS and web app(both iOS and Android).

Tested with the following values:

  - 'mailto:info@something.com?subject=&body=' open on tap the native Email client, using the native plugin or from a href call from the browser. If the user doesn't have a email client on the phone it will pop up a error message (Native only)
  - 'tel:123123213' uses href of the anchor tab.
  - 'http://www.git.com' opens inAppbrowser on native or a call to the stock browser on web app

## Installation
Via bower

    bower install ionic-link-tap


install the following cordova plugins

    cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git (inAppBrowser)
    cordova plugin add org.apache.cordova.dialogs (dialogs)
    cordova plugin add https://github.com/katzer/cordova-plugin-email-composer.git (emailComposer)

Inject the directive as a module dependency

    (function(){
      'use strict';
        angular
          .module('app', [
              'ionic',
              'ngCordova',
              'ionic-link-tap.tapAction'
          ])
          .config(config)
          .run(run);

## Usage

As an attribute in an achor tab

    <a ionic-link-tap-action="link">link</a>

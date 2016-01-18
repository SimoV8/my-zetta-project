(function() {
    'use strict';

    // Declare app level module which depends on views, and components
    var app = angular.module('MyApp', ['ngMaterial', 'zingchart-angularjs',  'mp.colorPicker']);

    app.constant('url', {
        BASE_PI_URL : 'http://10.42.0.47:1337',
        SERVER_PI :   '/servers/raspberry-server',
        BASE_LOGGER_URL : 'http://127.0.0.1:1337',
        SERVER_LOGGER : '/servers/logger-server'
     })

    app.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('light-blue');
            //.dark();
    });

    // Declare container factory
    app.factory('container', function(){
        var container = {};

        container.values = {};

        container.set = function(key, value) {
            container.values[key] = value;
        };

        container.get = function(key) {
            return container.values[key];
        };

        return container;
    });


})();
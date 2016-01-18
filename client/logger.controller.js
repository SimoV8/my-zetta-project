(function(){
    'use strict';

    angular
        .module('MyApp')
        .controller('LoggerController', LoggerController);

    LoggerController.$injector = ['$scope', '$http','$mdDialog', 'url', 'container'];

    function LoggerController($scope, $http, $mdDialog, url, container) {

        $scope.logs = [];
        $scope.length = 10;
        $scope.newMessage = "";

        var logger = null;

        setInterval(function(){
            $http.get(url.BASE_LOGGER_URL + url.SERVER_LOGGER).success(function(data) {
                logger = data['entities'][0];
                container.set('logger', logger);
                $scope.logs = logger.properties.logs;
                $scope.length = logger.properties.length;
            });
        }, 1000);


        $scope.addLog = function() {
            var log = $scope.newMessage.trim();
            if(log.length > 0 && logger != null) {
                var loggerUrl = logger.links[0]['href'];
                $http.post(loggerUrl,  $.param({ action: "write", textToWrite: log}),
                    {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
            }

            $scope.newMessage = '';
        };

        $scope.setLength = function() {
            $mdDialog.show({
                controller: 'SetLengthController',
                templateUrl: 'set_length_template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            });
        };

    }


})();

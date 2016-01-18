(function() {
    'use strict';

    angular
        .module('MyApp')
        .controller('SetLengthController', SetLengthController);

    function SetLengthController($scope, $mdDialog, $http, url, container) {

        var Logger = container.get('logger');
        if (Logger == null) {
            $mdDialog.cancel();
            return;
        }

        $scope.cancel = function() {
            $mdDialog.hide();
        };

        $scope.save = function() {

            $http.post(Logger['links'][0]['href'],
                $.param({ action: "set-length", length: $scope.newLength}), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
            $mdDialog.hide();
        }
    }


})();
(function() {
    'use strict';

    angular
        .module('MyApp')
        .controller('SelectColorController', SelectColorController);

    function SelectColorController($scope, $mdDialog, $http, url, container) {

        var LED = container.get('led');
        if (LED == null) {
            $mdDialog.cancel();
            return;
        }

        $scope.cancel = function() {
            $mdDialog.hide();
        };

        $scope.save = function() {

            $http.post(LED['links'][0]['href'],
                $.param({ action: "set-color", color: $scope.color}), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
            $mdDialog.hide();
        }
    }


})();

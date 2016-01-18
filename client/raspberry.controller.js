(function() {
    'use strict';

    angular
        .module('MyApp')
        .controller('RaspberryController', RaspberryController);

    RaspberryController.$inject = ['$scope', '$http', '$mdDialog', 'url', 'container'];

    function RaspberryController($scope, $http, $mdDialog, url, container) {

        //Chart data structure
        $scope.myJson = {
            type: 'line',
            series: [
                {values: []}
            ],
            scaleX: {
                maxItems: 5,
                transform: {
                    type: 'date'
                },
                values: []
            }
        };
        //Init variables
        $scope.temperature = 0.0;
        $scope.color = '#FFFFFF';
        $scope.ledState = 'off';
        $scope.threshold = 26.0;

        //Set periodic requests to get the state
        setInterval(function () {
            $http.get(url.BASE_PI_URL + url.SERVER_PI).success(function (data) {
                var LED = data['entities'][0];
                var temperatureSensor = data['entities'][1];

                container.set('led', LED);
                container.set('temperatureSensor', temperatureSensor);

                //Update temperature value
                $scope.temperature = temperatureSensor['properties']['temperature'];

                // Update the chart
                var values = $scope.myJson.series[0].values.concat($scope.temperature);
                var xValues = $scope.myJson.scaleX.values.concat(new Date().getTime());
                if (values.length > 20) {
                    values.shift();
                    xValues.shift();
                }
                $scope.myJson.scaleX.values = xValues;
                $scope.myJson.series[0].values = values;

                // Update led state
                $scope.color = LED['properties']['color'];
                $scope.ledState = LED['properties']['state'];
            });
        }, 1000);


        $scope.setColor = function () {
            $mdDialog.show({
                controller: 'SelectColorController',
                templateUrl: 'color_picker_template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            });
        };

        // Set and get threshold
        $scope.$watch("threshold", function (newValue, oldValue) {
            if(oldValue != newValue)
                $http.post(url.BASE_PI_URL + '/threshold', {threshold: newValue});
        });

        getThreshold();
        setInterval(getThreshold, 3000);

        function getThreshold() {
            $http.get(url.BASE_PI_URL + '/threshold').success(function (data) {
                $scope.threshold = data.threshold;
            });
        }

    }


})();

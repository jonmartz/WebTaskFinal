// register controller
angular.module("myApp")
    .controller("registerController", function ($scope, serviceCountries) {
        self = this;

        $scope.submit = function(){
            $scope.answer = "Submitted! country: " + $scope.country
        };

        $scope.countries = serviceCountries.getCountries();
    });
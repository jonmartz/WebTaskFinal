// about controller
angular.module("myApp")
    .controller("aboutController", function ($scope, $http, $window) {
        $scope.myFunc = function() {
            $http({
                method: 'GET',
                url: "http://localhost:3000/private/select/countries/name",
                headers: {
                    'x-auth-token': $window.sessionStorage.getItem("token")
                }
            }).then(function successCallback(res) {
                    $scope.text = "valid token. country names: \n" + res.data;
                }
                , function errorCallback(res) {
                    $scope.text = "invalid token";
                })
        }
    });
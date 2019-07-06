// about controller
angular.module("myApp")
.controller("aboutController", function ($scope, $http, $window) {
    $scope.myFunc = function() {
        $scope.text = $window.sessionStorage.getItem("token");
        // $http.get('http://localhost:3000/select/countries/name').then(function(response) {
        //         // $scope.text = "success";
        //         $scope.text = response.data;
        //     }
        // )
    }
});
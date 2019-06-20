// about controller
angular.module("myApp")
.controller("aboutController", function ($scope, $http) {
    // button click count
    $scope.btnCount = 0;
    $scope.myFunc = function() {
        $scope.btnCount++;
        $scope.text = "requesting countries...";
        $http.get('http://localhost:3000/select/countries/name').then(function(response) {
                // $scope.text = "success";
                $scope.text = response.data;
            }
        )
    }
});
// register controller
angular.module("myApp")
    .controller("registerController", function ($scope, service) {
        self = this;

        $scope.submit = function(){
            if ($scope.userCategories.length < 2){
                $scope.answer = "please select at least 2 categories";
            }
            else{
                $scope.answer = "";
                data =
                $http.post('/someUrl', data).then(successCallback, errorCallback);
            }
        };

        $scope.countries = service.getCountries();
        $scope.categories = service.getCategories();
    });
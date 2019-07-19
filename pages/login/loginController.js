angular.module("myApp")
    .controller("loginController", function ($scope, $http, $window, service, $rootScope) {
        self = this;

        if (service.username !== ""){
            service.username = "";
            document.getElementById('upperMessageBox').innerHTML = '<- Please login or register';
            document.getElementById('loginMenuEntry').innerHTML = "Log-in";
            $rootScope.favorsToShow = false;
        }

        $scope.submit = function(){

            $scope.answer = "";

            let body = {
                "username": $scope.username,
                "password": $scope.password
            };
            $http.post('http://localhost:3000/login', body).then(
                function successCallback(res) {
                    document.getElementById("submitButton").disabled = true;
                    document.getElementById("submitButton").style.visibility = "hidden";
                    document.getElementById("submitText").style.color = "green";

                    $window.sessionStorage.setItem("token",res.data);
                    $window.location.href = "#!";
                    document.getElementById('upperMessageBox').innerHTML = "Hello "+$scope.username;
                    document.getElementById('loginMenuEntry').innerHTML = "Log-out";
                    service.username = $scope.username
                    $rootScope.favorsToShow = true;
                    $rootScope.favorsCount = 0;   
                }
                , function errorCallback(res) {
                    $scope.answer = "Incorrect username or password"
                }
            );
        };
    });
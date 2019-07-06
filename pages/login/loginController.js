angular.module("myApp")
    .controller("loginController", function ($scope, $http, $window, service) {
        self = this;

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
                    document.getElementById('upperMessageBox').innerHTML = '';
                }
                , function errorCallback(res) {
                    $scope.answer = "Incorrect username or password"
                }
            );
        };
    });
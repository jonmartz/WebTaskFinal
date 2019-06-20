// register controller
angular.module("myApp")
    .controller("registerController", function ($scope, $http, service) {
        self = this;

        $scope.countries = service.getCountries();
        $scope.categories = service.getCategories();

        $scope.submit = function(){

            if ($scope.userCategories.length < 2){
                $scope.answer = "please select at least 2 categories";
            }
            else{
                let failed = false;
                $scope.answer = "";

                // registering user
                let columnString = "username+first_name+last_name+city+country+Email+password";
                let values = [$scope.username, $scope.fname, $scope.lname, $scope.city, $scope.country, $scope.mail, $scope.password];
                let body = service.createBody("users",columnString, values);
                $http.post('http://localhost:3000/register', body).then(
                    function successCallback(res) {
                    }
                    , function errorCallback(res) {
                        $scope.answer = "Username already exists!"
                        failed = true;
                    }
                );
                if (failed) return;
                document.getElementById("submitButton").disabled = true;
                document.getElementById("submitButton").style.visibility = "hidden";
                document.getElementById("submitText").style.color = "green";
                $scope.answer = "Registering...";

                // question 1
                columnString = "username+question+answer";
                values = [$scope.username, $scope.question1, $scope.answer1];
                body = service.createBody("question_and_answer",columnString, values);
                $http.post('http://localhost:3000/insert', body).then(
                    function successCallback(res) {
                    }
                    , function errorCallback(res) {
                        // $scope.answer = "error registering question 1: " + res.data;
                    }
                );

                // question 2
                columnString = "username+question+answer";
                values = [$scope.username, $scope.question2, $scope.answer2];
                body = service.createBody("question_and_answer",columnString, values);
                $http.post('http://localhost:3000/insert', body).then(
                    function successCallback(res) {
                    }
                    , function errorCallback(res) {
                        // $scope.answer = "error registering question 2: " + res.data;
                    }
                );
                let categoriesToAdd = $scope.userCategories;
                for (let i = 0; i < categoriesToAdd.length; i++){
                    let category = categoriesToAdd[i];
                    columnString = "Id+name";
                    values = [$scope.username, category];
                    body = service.createBody("category",columnString, values);
                    $http.post('http://localhost:3000/insert', body).then(
                        function successCallback(res) {
                        }
                        , function errorCallback(res) {
                            // $scope.answer = "error registering category" + (i+1) + ": " + res.data;
                        }
                    );
                }
            }
        };
    });
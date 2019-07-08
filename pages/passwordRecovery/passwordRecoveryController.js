angular.module("myApp")
    .controller("passwordRecoveryController", function ($scope, $http, $window, service) {
        self = this;

        self.questions = [];
        self.answers = [];
        self.index = 0;
        self.password = "";

        $scope.submit = function(){

            $scope.answer = "";
            if (self.questions.length === 0) {
                $http.get("http://localhost:3000/select/question_and_answer/question/username='" + $scope.username + "'").then(
                    function successCallback(res) {
                        if (res.data.length > 0) {

                            document.getElementById("questionSection").style.display = "block";
                            self.questions = res.data;

                            $http.get("http://localhost:3000/select/question_and_answer/answer/username='" + $scope.username + "'").then(function(res) {
                                    self.answers = res.data;
                                }
                            );
                            $http.get("http://localhost:3000/select/users/password/username='" + $scope.username + "'").then(function(res) {
                                    self.password = res.data[0].password;
                                }
                            );
                            $scope.question = self.questions[0].question;

                        } else {
                            $scope.answer = "Incorrect username"
                        }
                    }
                    , function errorCallback(res) {
                        $scope.answer = "Database error"
                    }
                );
            }
            else{ // if username already found, simply display next question
                $scope.answer2 = "";
                self.index++;
                if (self.index === self.questions.length) self.index = 0;
                $scope.question = self.questions[self.index].question;
            }
        };

        $scope.submitAnswer = function() {
            if (self.answers[self.index].answer === $scope.answerToQuestion){
                $scope.answer2 = "";
                document.getElementById("questionSection").style.display = "none";
                document.getElementById("usernameForm").style.display = "none";
                document.getElementById("passwordSection").style.display = "block";
                $scope.correctPassword = self.password;
            }
            else{
                $scope.answer2 = "Incorrect answer";
            }
        }
    });
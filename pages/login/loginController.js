angular.module("myApp")
    .controller("loginController", function ($scope, $http, $window, service, $rootScope) {
        self = this;

        if (service.username !== ""){
            service.username = "";
            document.getElementById('upperMessageBox').innerHTML = '<- Please login or register';
            document.getElementById('loginMenuEntry').innerHTML = "Log-in";
            $rootScope.favorsToShow = false;
            service.favoritesList = {};
            service.orderingMapping = {};
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

                    // Changes things after log in
                    $window.sessionStorage.setItem("token",res.data);
                    $window.location.href = "#!";
                    document.getElementById('upperMessageBox').innerHTML = "Hello "+$scope.username;
                    document.getElementById('loginMenuEntry').innerHTML = "Log-out";
                    service.username = $scope.username
                    $rootScope.favorsToShow = true;
                    $http.get('http://localhost:3000/select/pointOfInterest/name,categoryName,image,rank/name IN (SELECT point_of_interest FROM favorites WHERE username=' +'\'' + service.username + '\''+')')
                        .then(function successCallback(res){

                            // todo: @ODED:
                            //  Update the data structure you used to display the favorites pois here instead of
                            //  updating it in the pois screen, so that the favorites screen works right after logging in.
                            $http.get("http://localhost:3000/select/pointOfInterest/name,categoryName,image,rank").then(function(response) {
                                    service.poisData=response.data;

                                    var allPois=response.data;
                                    var favList={};//service.favoritesList;
                                    $rootScope.favorsCount=0;
                                    var myResult=res.data;

                                    for(var i in allPois){
                                        let myName=allPois[i].name;
                                        if(favList[myName]===undefined)
                                            favList[myName]='images/emptyStar.png';
                                    }


                                    for(var i in myResult){
                                        favList[myResult[i].name] = 'images/fullStar.png';
                                        $rootScope.favorsCount++;
                                    }
                                    
                                    service.favoritesList=favList;
                                    
                                }
                            );
                            

                            //----------------------------------------------------------

                            //-----------------------------------------------------------

                            $http.get('http://localhost:3000/select/favorites/point_of_interest,sortingOrder/username=' +'\'' + service.username + '\'')
                            .then(function successCallback(result){
                                var ret=result.data;
                                var mapping={};
                                for(var i in ret)
                                {
                                    mapping[ret[i].point_of_interest]=ret[i].sortingOrder;
                                }
                                service.orderingMapping=mapping;
                            });
                        });
                }
                , function errorCallback(res) {
                    $scope.answer = "Incorrect username or password"
                }
            );
        };
    });
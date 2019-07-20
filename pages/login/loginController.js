angular.module("myApp")
    .controller("loginController", function ($scope, $http, $window, service, $rootScope) {
        self = this;

        if (service.username !== ""){
            service.username = "";
            document.getElementById('upperMessageBox').innerHTML = '<- Please login or register';
            document.getElementById('loginMenuEntry').innerHTML = "Log-in";
            $rootScope.favorsToShow = false;
            service.favoritesList = {};
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
                            // todo: @SHAJAR:
                            //  Here, update the service.favoritesList you made using res.data which contains
                            //  a list with all the names of the favorite pois saved in DB (use res.data[i].name to get
                            //  the name of poi number i from the list).
                            //  Also, update  $rootScope.favorsCount = [number of favorites] and not 0 like I did there
                            var favList={};//service.favoritesList;
                            $rootScope.favorsCount=0;
                            var myResult=res.data;
                            for(var i in myResult){
                                favList[myResult[i].name] = 'images/fullStar.png';
                                $rootScope.favorsCount++;
                            }
                            service.favoritesList=favList;
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
angular.module("myApp")
    .controller("favoritesPageController", function ($scope, $window, $rootScope, $http, service) {
        $scope.favorPois = [];
        $scope.updateFav = function(){
           //  $http.get('http://localhost:3000/select/pointOfInterest/name,categoryName,image,rank/name IN (SELECT point_of_interest FROM favorites WHERE username=' +'\'' + service.username + '\''+')')
           // .then(function successCallback(res){
           //     $scope.favorPois = res.data;
           //  });
            // todo: @ODED:
            //  here instead of getting the favorites from the DB and setting them to $scope.favorPois, get the
            //  favorites from service.favoritesList. I think you can check which if a poi with name i is currently
            //  marked at favorite if service.favoritesList[i] === 'images/fullStar.png'. Maybe ask Shahar to save all the
            //  poi details into service.favoritesList instead of only the poi name, so no GET request is needed, or just
            //  get all the pois from database and display only those in service.favoritesList.
            //  *Getting the favorites from DB will now only happen in the login controller.
            $scope.favorPois = service.fPois;
            var allpoisData = service.poisData;
            var sessionfavorites = service.favoritesList;
            for(var k in sessionfavorites){
                if(sessionfavorites[k] === 'images/fullStar.png' ){
                    if($scope.favorPois.filter(poi => poi.name == k).length == 0){
                        $scope.favorPois.push(allpoisData.filter(poi => poi.name == k)[0]);
                    }
                }
                else{
                    var idx = -1;
                    for( var s in $scope.favorPois){
                        if($scope.favorPois[s].name == k){
                            idx = s;
                        }
                    }
                    if(idx != -1)
                        $scope.favorPois.splice(idx,1);
                }
            }
            service.fPois = $scope.favorPois;
        };
        $scope.removeFromFavorites = function(poiName){
            // todo: @ODED:
            //  Call this function only when the user decides to save to the DB the POI list that is currently
            //  being displayed.
            

        };

        $scope.sortByRank = function(){
            let tmpFavor = $scope.favorPois
            tmpFavor.sort(function(a, b) {return parseFloat(b.rank) - parseFloat(a.rank);});
            $scope.favorPois = tmpFavor;
        }

        $scope.sortByCategory = function(){
            let tmpFavorC = $scope.favorPois
            tmpFavorC.sort(function(a, b) {return parseFloat(b.categoryName) - parseFloat(a.categoryName);});
            $scope.favorPois = tmpFavorC;
        };

        $scope.updateFav();

        $scope.changeStar=function(poiName){
            if(service.favoritesList[poiName] === 'images/emptyStar.png'){
                service.favoritesList[poiName]='images/fullStar.png';
                $rootScope.favorsCount++;
            }
            else{
                if(service.favoritesList[poiName] === 'images/fullStar.png'){
                    service.favoritesList[poiName]='images/emptyStar.png';
                    $rootScope.favorsCount--;
                }
            }
        };

        $scope.goToPointPage=function(name){
        var currFavs=service.favoritesList;
        var flag=false;
        if(currFavs[name]==='images/fullStar.png')
            flag=true;
        $window.location.href = "#!pointPage#"+name+"_"+flag;         
        }

        $scope.setFavortieListDB = function(){
            $http.delete('http://localhost:3000/delete/favorites/username=' + '\'' + service.username + '\'')
            .then(function successCallback(res){
             });
            var fcolumnString = "username+point_of_interest+date";
            for(var j in service.favoritesList){
                if(service.favoritesList[j] == 'images/fullStar.png'){
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1; 

                    var yyyy = today.getFullYear();
                    if (dd < 10) {
                    dd = '0' + dd;
                    } 
                    if (mm < 10) {
                    mm = '0' + mm;
                    } 
                    var today = mm + '-' + dd + '-' + yyyy;
                    var fvalues = [service.username, j, today];
                    var fbody = service.createBody("favorites",fcolumnString, fvalues);
                    $http.post('http://localhost:3000/insert', fbody).then(
                        function successCallback(res) {
                        }
                        , function errorCallback(res) {
                            // $scope.answer = "error registering question 2: " + res.data;
                        }
                    );
                }
            }
        }
    });
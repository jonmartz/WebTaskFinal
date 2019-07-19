angular.module("myApp")
    .controller("favoritesPageController", function ($scope, $rootScope, $http, service) {
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
        };
        $scope.removeFromFavorites = function(poiName){
            // todo: @ODED:
            //  Call this function only when the user decides to save to the DB the POI list that is currently
            //  being displayed.
            $http.delete('http://localhost:3000/delete/favorites/username=' + '\'' + service.username + '\'' + 'AND point_of_interest=' + '\'' + poiName + '\'')
           .then(function successCallback(res){
                alert(poiName + ' was deleted from favorites.')
                $scope.updateFav();
            });
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
    });
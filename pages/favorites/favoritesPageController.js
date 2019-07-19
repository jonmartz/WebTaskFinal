angular.module("myApp")
    .controller("favoritesPageController", function ($scope, $rootScope, $http, service) {
        $scope.favorPois = [];
        $scope.updateFav = function(){
            $http.get('http://localhost:3000/select/pointOfInterest/name,categoryName,image,rank/name IN (SELECT point_of_interest FROM favorites WHERE username=' +'\'' + service.username + '\''+')')
           .then(function successCallback(res){
               $scope.favorPois = res.data;
            });
        };
        $scope.removeFromFavorites = function(poiName){
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
        }

        $scope.updateFav();
        $scope.sortByRank();
        
    });
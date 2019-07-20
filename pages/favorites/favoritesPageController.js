angular.module("myApp")
    .controller("favoritesPageController", function ($scope, $window, $rootScope, $http, service) {
        $scope.favorPois = [];
        $scope.manualOrdering = false;
        $scope.personalOrder= service.orderingMapping;

        // var i = 0;
        // for (var poiName in Object.keys(service.orderingMapping)){
        //     service.orderingMapping[poiName] = i
        // }

        $scope.updateFav = function(){
            $scope.favorPois = service.fPois;
            var allpoisData = service.poisData;
            var sessionfavorites = service.favoritesList;
            for(var k in sessionfavorites){
                if(sessionfavorites[k] === 'images/fullStar.png' ){
                    if($scope.favorPois.filter(poi => poi.name == k).length == 0) {
                        $scope.favorPois.push(allpoisData.filter(poi => poi.name == k)[0]);
                        if (service.orderingMapping[k] == null) {
                            service.orderingMapping[k] = Object.keys(service.orderingMapping).length+1;
                            // window.alert(k+': '+service.orderingMapping[k]);
                        }
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

        $scope.sortByRank = function(){
            $scope.manualOrdering = false;
            let tmpFavor = $scope.favorPois
            tmpFavor.sort(function(a, b) {return parseFloat(b.rank) - parseFloat(a.rank);});
            $scope.favorPois = tmpFavor;
        };

        $scope.sortByCategory = function(){
            $scope.manualOrdering = false;
            let tmpFavorC = $scope.favorPois
            tmpFavorC.sort(function(a, b){
                if(a.categoryName < b.categoryName) { return -1; }
                if(a.categoryName > b.categoryName) { return 1; }
                return 0;});
            $scope.favorPois = tmpFavorC;
        };

        $scope.sortByPersonal = function(){
            $scope.manualOrdering = true;
            let tmpFavor = $scope.favorPois
            tmpFavor.sort(function(a, b) {
                return parseFloat(service.orderingMapping[a.name]) - parseFloat(service.orderingMapping[b.name]);
            });
            $scope.favorPois = tmpFavor;
        };

        $scope.moveUp = function (poiName){
            var currentPos = service.orderingMapping[poiName];
            if (currentPos === 1) return;
            for (var otherPoiName in service.orderingMapping){
                if (service.orderingMapping[otherPoiName] === currentPos-1)
                    service.orderingMapping[otherPoiName]++;
            }
            service.orderingMapping[poiName]--;
            $scope.sortByPersonal();
        };

        $scope.moveDown = function (poiName){
            var currentPos = service.orderingMapping[poiName];
            if (currentPos === Object.keys(service.orderingMapping).length) return;
            for (var otherPoiName in service.orderingMapping){
                if (service.orderingMapping[otherPoiName] === currentPos+1)
                    service.orderingMapping[otherPoiName]--;
            }
            service.orderingMapping[poiName]++;
            $scope.sortByPersonal();
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
                    var fcolumnString = "username+point_of_interest+date+sortingOrder";
                    for(var j in service.favoritesList){
                        if(service.favoritesList[j] == 'images/fullStar.png'){
                            var today = new Date();
                            var dd = today.getDate();
                            var mm = today.getMonth() + 1;
                            var hh = today.getHours();
                            var mint = today.getMinutes();
                            var ss = today.getSeconds();
                            var ms = today.getMilliseconds();

                            var yyyy = today.getFullYear();
                            if (dd < 10) {
                                dd = '0' + dd;
                            }
                            if (mm < 10) {
                                mm = '0' + mm;
                            }
                            var today = mm + '-' + dd + '-' + yyyy + ' ' + hh + ':' + mint + ':' + ss + '.' + ms;
                            var fvalues = [service.username, j, today, service.orderingMapping[j]];
                            var fbody = service.createBody("favorites",fcolumnString, fvalues);
                            $http.post('http://localhost:3000/insert', fbody).then(
                                function successCallback(res) {
                                }
                                , function errorCallback(res) {
                                    // $scope.answer = "error registering question 2: " + res.data;
                                }
                            );
                            for(var x=0; x<1000000; x++){var y = y+1;};
                        }
                    }
                    alert('saved!');
                });
        }
    });
angular.module("myApp")
    .controller("homeController", function ($scope, $http, $window, service) {
        $scope.greeting="";
        $scope.allPois={};
        $scope.randomPois={};
        $scope.topPois={};
        $scope.isLogged="";
        $scope.desiredRank=10;
        $scope.loggedUser="";
        $scope.messageForLogged="";

        $scope.getFormattedDate=function(d)
        {
            var d3=d.replace(/Z/g,"");
            return d3;
        }

        $scope.handleGuest=function()
        {
            $scope.greeting="Hello Guest";
            let currAllPois=$scope.allPois;
            let currRandPois=$scope.randomPois;
            $http.get("http://localhost:3000/select/pointOfInterest/name,categoryName,image,rank").then(function(response) {
                    currAllPois=response.data;
                    var filteredByRank = currAllPois.filter(poi => poi.rank >=$scope.desiredRank );
                    let myLength=filteredByRank.length;
                    if(myLength <= 3)
                    {
                        currRandPois=filteredByRank;
                        $scope.allPois=filteredByRank;
                        $scope.randomPois=currRandPois;
                    }
                    else
                    {
                        
                        var randArr = []
                        while(randArr.length < 4)
                        {
                            var r = Math.floor(Math.random()*myLength) ;
                            if(randArr.indexOf(r) === -1) randArr.push(r);
                        }
                        for(idx in randArr)
                        {
                            if(idx<3)
                                currRandPois[idx]=filteredByRank[randArr[idx]];
                        }
                    }
                }
            )
        }

        $scope.handleMember=function(){
            //let myUser=$scope.loggedUser;
            let myUser='aaa';
            let allFavorites={};
            let topRatedPois={};
            let topPoisToShow={};
            //get the 2 (poi,date) with the most recent date
            $http.get("http://localhost:3000/select/favorites/point_of_interest,date/username="+'\''+myUser+'\'').then(function(response) {
                    allFavorites=response.data;
                    if(allFavorites[0] !== undefined){
                        var max1=new Date($scope.getFormattedDate(allFavorites[0].date));
                        var max2=new Date($scope.getFormattedDate(allFavorites[0].date));
                        var max1Idx=0, max2Idx=0;
                        for(var i in allFavorites)
                        {
                            var a=new Date($scope.getFormattedDate(allFavorites[i].date));
                            if(a.getTime() > max1)
                            {
                                max1=a.getTime();
                                max1Idx=i;
                            }
                        }
                        topRatedPois[0]=allFavorites[max1Idx].point_of_interest;
                        if(allFavorites[1] !== undefined){
                            for(var i in allFavorites){
                                var a=new Date($scope.getFormattedDate(allFavorites[i].date));
                                if(a.getTime() !== max1){
                                    if(a.getTime() > max2)
                                    {
                                        max2=a.getTime();
                                        max2Idx=i;
                                    }
                                }
                            }
                            topRatedPois[1]=allFavorites[max2Idx].point_of_interest;
                        }
                        else{
                            $scope.messageForLogged="you saved one point of interest"
                        }
                    }
                    else{
                        $scope.messageForLogged="you did not save a point of interest"
                    }

                    if(topRatedPois[0]!==undefined)
                    {
                        $http.get("http://localhost:3000/select/pointOfInterest/name,image,categoryName,rank/name="+'\''+topRatedPois[0]+'\'').then(function(response)
                        {
                            topPoisToShow[0]=response.data;
                            $scope.topPois[0]=topPoisToShow[0][0];
                            if(topRatedPois[1]!==undefined)
                            {
                                $http.get("http://localhost:3000/select/pointOfInterest/name,image,categoryName,rank/name="+'\''+topRatedPois[1]+'\'').then(function(response)
                                {
                                    topPoisToShow[1]=response.data;
                                    $scope.topPois[1]=topPoisToShow[1][0];
                                })
                            }
                        })
                    }
                    
                }
            )
            
        }

        $scope.changeRank=function(){
            let curr=chosenRank.value;
            if(curr.length===0)
                alert('please insert a valid number');
            else{
                $scope.desiredRank=curr;
                $scope.handleGuest();
            }
        }

        $scope.goToPointPage=function(name)
        {
            $window.location.href = "#!pointPage#"+name;        
        }

        if(service.username === "")
        {
            $scope.isLogged=false;
            $scope.handleGuest()
        }
        else
        {
            $scope.isLogged=true;
            $scope.loggedUser=service.username;
            $scope.handleMember();
        }
    });
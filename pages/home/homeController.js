angular.module("myApp")
    .controller("homeController", function ($scope, $http, $window) {
        $scope.greeting="";
        $scope.allPois={};
        $scope.randomPois={};

        $scope.isGuest=function()
        {
            $scope.greeting="Hello Guest";
            let currAllPois=$scope.allPois;
            let currRandPois=$scope.randomPois;
            $http.get("http://localhost:3000/select/pointOfInterest/name,categoryName,image,rank").then(function(response) {
                //myPois=currAllPois.data;
                currAllPois=response.data;
                let myLength=currAllPois.length;
                if(myLength <= 3)
                {
                    currRandPois=currAllPois;
                    $scope.allPois=currAllPois;
                    $scope.randomPois=currRandPois;
                }
                else
                {
                    var randArr = []
                    while(randArr.length < 3)
                    {
                        var r = Math.floor(Math.random()*myLength) + 1;
                        if(randArr.indexOf(r) === -1) randArr.push(r);
                    }
                    for(idx in randArr)
                    {
                        currRandPois[idx]=currAllPois[randArr[idx]];
                    }
                }
            }
        )
        }
    });
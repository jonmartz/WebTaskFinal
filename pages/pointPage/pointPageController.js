angular.module("myApp")
.controller("pointPageController", function ($scope, $http, $window) {
    $scope.name=window.location.hash.substring(13);
    $scope.poiInfo={};
    $scope.reviewInfo={};
    $scope.relevantInfo={};
    $scope.message="";
    $http.get("http://localhost:3000/select/pointOfInterest/city,image,numOfViewers,description,rank/name="+'\''+$scope.name+'\'').then(function(response) {
            $scope.poiInfo=response.data;
        }
    )
    $http.get("http://localhost:3000/select/reviews/time,context/pointOfInterest="+'\''+$scope.name+'\'').then(function(response) {
            $scope.reviewInfo=response.data;
            if($scope.reviewInfo[0]!==undefined)
            {
                var currDates=$scope.relevantInfo;
                var max1=new Date($scope.getFormattedDate($scope.reviewInfo[0].time));
                var max2=new Date($scope.getFormattedDate($scope.reviewInfo[0].time));
                var max1Idx=0, max2Idx=0;
                for(let i=0;i<$scope.reviewInfo.length;i++)
                {
                    var a=new Date($scope.getFormattedDate($scope.reviewInfo[i].time));
                    if(a.getTime() > max1)
                    {
                        max1=a.getTime();
                        max1Idx=i;
                    }
                }
                currDates[0]=$scope.reviewInfo[max1Idx];
                let c0=currDates[0].time;
                currDates[0].time=(c0.replace(/T/," ")).substring(0, c0.length-1);
                if($scope.reviewInfo[1]!==undefined){
                    for(let i=0;i<$scope.reviewInfo.length;i++)
                    {
                        var a = new Date($scope.getFormattedDate($scope.reviewInfo[i].time));
                        if(a.getTime() !== max1)
                        {
                            if(a.getTime() > max2)
                            {
                                max2=a.getTime();
                                max2Idx=i;
                            }
                        }
                    }
                    currDates[1]=$scope.reviewInfo[max2Idx];
                    let c1=currDates[1].time;
                    currDates[1].time=(c1.replace(/T/," ")).substring(0, c1.length-1);
                }
                else{
                    $scope.message='There is one review for this point of interest';
                }
                $scope.relevantInfo=currDates;
            }
            else{
                $scope.message='There are no reviews for this point of interest';
            }
        }
    )

    $scope.getFormattedDate=function(d)
    {
        var d3=d.replace(/Z/g,"");
        return d3;
    }
});
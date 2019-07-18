angular.module("myApp")
.controller("pointPageController", function ($scope, $http, $window, service, modalService) {
    $scope.name=window.location.hash.substring(13);
    $scope.poiInfo={};
    $scope.reviewInfo={};
    $scope.relevantInfo={};
    $scope.message="";
    $http.get("http://localhost:3000/select/pointOfInterest/city,image,numOfViewers,description,rank/name="+'\''+$scope.name+'\'').then(function(response) {
            $scope.poiInfo=response.data;
        }
    );
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

            if (service.username !== ""){
                document.getElementById('notLoggedIn').style.visibility = "hidden";
            }
            else{
                document.getElementById('reviewButton').disabled = true;
                document.getElementById('saveButton').disabled = true;
            }
    });

        $scope.getFormattedDate=function(d)
        {
            var d3=d.replace(/Z/g,"");
            return d3;
        };

        $scope.writeReview=function() {
            modalService.openModal().then(function(data){
                window.alert(data.score + ", " + data.text); //todo: send review to database here
            });
        };

        $scope.saveToFavorites=function() { // todo: save POI to favorites here

        };

        var vm=this;
        vm.show=modalService.modalOn;							// Flag to show or hide the modal
        vm.returnValue=modalService.returnValue;	// Reference to the service function to resolve the promise

        $scope.$on('MODAL_OPEN',function(){
            vm.show=modalService.modalOn;
        });

        $scope.$on('MODAL_CLOSE',function(){
            vm.show=modalService.modalOn;
        });

    });

/**
 * Modal window's controller
 */
app.controller('modalController',['modalService','$scope',function(modalService, $scope){
    var vm=this;
    vm.show=modalService.modalOn;							// Flag to show or hide the modal

    /**
     * run when hitting the send button in the modal window
     */
    vm.returnValue = function (){
        var data = {
            score: $scope.ratings[0].current,
            text: $scope.reviewText
        };
        modalService.returnValue(data);
    };

    $scope.$on('MODAL_OPEN',function(){
        vm.show=modalService.modalOn;
    });

    $scope.$on('MODAL_CLOSE',function(){
        vm.show=modalService.modalOn;
    });

    // For the 5 star rating:
    $scope.rating = 0;
    $scope.ratings = [{current: 3, max: 5}];

    $scope.getSelectedRating = function (rating) {
        console.log(rating);
    };

    $scope.setMinrate= function(){
        $scope.ratings = [{current: 1, max: 5}];
    };

    $scope.setMaxrate= function(){
        $scope.ratings = [{current: 5, max: 5}];
    };

    $scope.sendRate = function(){
        alert("Thanks for your rates!\n\nFirst Rate: " + $scope.ratings[0].current+"/"+$scope.ratings[0].max)
    }
}]);

/**
 * Directive for the star rating
 */
app.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
});
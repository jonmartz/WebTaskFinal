angular.module("myApp")
.controller("pointPageController", function ($scope, $http, $window, service, modalService, $rootScope) {
    $scope.name="";
    $scope.poiInfo={};
    $scope.reviewInfo={};
    $scope.relevantInfo={};
    $scope.message="";
    $scope.isFav=false;
    $scope.starPic="";
    $scope.isLogged=false;


    $scope.changeStar=function(poiName){
        var currFav=service.favoritesList;
        if(currFav[poiName] === 'images/emptyStar.png'){
            currFav[poiName]='images/fullStar.png';
            $scope.starPic='images/fullStar.png';
            $rootScope.favorsCount++;
        }
        else{
            if(currFav[poiName] === 'images/fullStar.png'){
                currFav[poiName]='images/emptyStar.png';
                $scope.starPic='images/emptyStar.png';
                $rootScope.favorsCount--;
            }
        }
        service.favoritesList = currFav;
    }

    $scope.parseUrl=function(url){
        if(url.includes("_"))
        {
            var idx=url.indexOf('_');
            $scope.name=url.substring(0,idx);
            $scope.name=decodeURIComponent($scope.name);
            $scope.isFav=url.substring(idx+1);
            if($scope.isFav==='true'){
                $scope.starPic='images/fullStar.png';
            }
            else{
                if($scope.isFav==='false')
                    $scope.starPic='images/emptyStar.png';
            } 
        }
        else
        {
            $scope.name=decodeURIComponent(url);
        }
    }
    $scope.parseUrl(window.location.hash.substring(13));

    if(service.username === "")
    {
        $scope.isLogged=false;
    }
    else
    {
        $scope.isLogged=true;
    }

    $http.get("http://localhost:3000/select/pointOfInterest/city,image,numOfViewers,description,rank/name="+'\''+$scope.name+'\'').then(function(response) {
            $scope.poiInfo=response.data;
        }
    );
    $http.get("http://localhost:3000/select/reviews/time,context,score/pointOfInterest="+'\''+$scope.name+'\'').then(function(response) {
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
                if (data === "cancel") return;
                columnString = "username+pointOfInterest+context+score";
                values = [service.username, $scope.name, data.text, data.score];
                body = service.createBody("reviews",columnString, values);
                $http.post('http://localhost:3000/insert', body).then(
                    function successCallback(res) {
                        window.alert("Review submitted");
                        updatePoiRank($scope.name);
                    }
                    , function errorCallback(res) {
                        // window.alert("failure")
                    }
                );
            });
        };

        function updatePoiRank(poiName){
            $http.get("http://localhost:3000/select/reviews/score/pointOfInterest='"+poiName+"'").then(
                function successCallback(res) {
                    var scores = res.data;

                    // calculate new rank
                    var sum = 0;
                    for (var i = 0; i < scores.length; i++){
                        sum += scores[i].score/5;
                    }
                    var rank = Math.round((sum/scores.length)*100);
                    // window.alert(scores+", new rank = "+rank);

                    // update rank
                    $http.put("http://localhost:3000/update/pointOfinterest/rank="+rank+"/name="+poiName).then(
                        function successCallback(res) {
                            // window.alert('success');
                        }
                        , function errorCallback(res) {
                            // window.alert("failed updating rank")
                        }
                    );
                }
                , function errorCallback(res) {
                    // window.alert("failed getting scores");
                }
            );
        }

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
    vm.returnValue = function (cancel){
        if (cancel) modalService.returnValue("cancel");
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
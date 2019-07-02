// poi controller
angular.module("myApp")
.controller("poiController", function ($scope, $http) {
    self = this;
    self.cities = {
        1: {name:"Paris", state: "France", image: "https://media-cdn.tripadvisor.com/media/photo-s/0d/f5/7c/f2/eiffel-tower-priority.jpg"},
        2: {name:"Jerusalem", state: "Israel", image: "https://cdni.rt.com/files/2017.12/article/5a3fe04efc7e93cd698b4567.jpg"},
        3: {name:"London", state: "England", image: "http://www.ukguide.co.il/Photos/England/London/British-Royal-Tour.jpg"}
    }
    $scope.pois={};
    $scope.allCategories={};
    $scope.relevantCategories={};
    $scope.allPoisNames={};
    $http.get('http://localhost:3000/select/pointOfInterest/name,city,categoryName/name != '/' ').then(function(response) {
                $scope.pois = response.data;
            }
    )
    $http.get('http://localhost:3000/select/category/name/').then(function(response) {
                $scope.allCategories = response.data;
            }
    )
    $http.get('http://localhost:3000/select/pointOfinterest/name/').then(function(response) {
                $scope.allCategories = response.data;
            }
    )
    $scope.getRelevantCategories=function()
    {
        alert ($scope.allCategories);

        for (let index = 4; index < $scope.allCategories.length; index++) {
            delete $scope.allCategories[index];
        }
        alert ($scope.allCategories);
    }
    $scope.noMatches = "";
    $scope.showFirst=true;
    self.currCities={};
    $scope.showAll=function()
    {
        $scope.getRelevantCategories();
        $scope.noMatches = "";
        $scope.showFirst=true;
    }
    $scope.findCity=function()
    {
        $scope.noMatches = "";
        for (let [id,city] of Object.entries(self.cities))
        {
            self.currCities[id]=city;
        } 
        //let myCities=self.cities;
        $scope.showFirst=false;
        for (let [id1,city1] of Object.entries(self.currCities))
        {
            if(city1.name !== myText.value)
            {
                delete self.currCities[id1];
            }
        }   
        if((Object.keys(self.currCities).length) === 0)
            $scope.noMatches = "No Matches Found";
    }
});
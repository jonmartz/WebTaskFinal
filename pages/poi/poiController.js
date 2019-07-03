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
    /*
    $http.get('http://localhost:3000/select/pointOfInterest/name,city,categoryName/name != '/' ').then(function(response) {
                $scope.pois = response.data;
            }
    )
    $http.get('http://localhost:3000/select/category/name/').then(function(response) {
                $scope.allCategories = response.data;
            }
    )*/
    $http.get('http://localhost:3000/select/category/name/').then(function(response) {
                $scope.allCategories = response.data;
                let s=$scope.allCategories;
                let filtered={};
                let curr=0;
                for (let i = 0; i < s.length; i++) {
                    for(let j=i+1; j<s.length; j++){
                        if(s[j]!==undefined && s[i]!==undefined && s[j].name===s[i].name)
                        {
                            delete s[j];
                        }
                    }
                }
                for(let a=0; a<s.length; a++){
                    if(s[a]!==undefined){
                        filtered[curr]=s[a].name;
                        curr++;
                    }
                }
                $scope.allCategories=filtered;
            }
    )
    $scope.do=function(){
        let currentCategories=$scope.allCategories;
        let myPois=$scope.pois;
        let poisIndex=0;
        for(idx in currentCategories)
        {
            let urlCat=currentCategories[idx].toString();
            $http.get("http://localhost:3000/select/pointOfInterest/name,categoryName,image/categoryName="+'\''+urlCat+'\'').then(function(response) {
                    if(response.data.length !== 0)
                    {
                        myPois[poisIndex]=response.data;
                        poisIndex++;
                    }
                }
            )
        }
        $scope.pois=myPois;
        //let arr=[[{a:'a1', d:'d1'},{b:'b1', d:'d1'},{c:'c1', d:'d1'}],[{a:'a2', d:'d2'},{b:'b2', d:'d2'},{c:'c2', d:'d2'}]];
        //TODO: flatten pois array
    }
    
    //$scope.filteCategories();
    //$scope.filteCategories=function()
    //{

    //}
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
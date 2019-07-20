// poi controller
angular.module("myApp")
.controller("poiController", function ($scope, $http, $window, service, $rootScope) {
    self = this;
    self.cities = {
        1: {name:"Paris", state: "France", image: "https://media-cdn.tripadvisor.com/media/photo-s/0d/f5/7c/f2/eiffel-tower-priority.jpg"},
        2: {name:"Jerusalem", state: "Israel", image: "https://cdni.rt.com/files/2017.12/article/5a3fe04efc7e93cd698b4567.jpg"},
        3: {name:"London", state: "England", image: "http://www.ukguide.co.il/Photos/England/London/British-Royal-Tour.jpg"}
    }
    $scope.pois={};
    $scope.poisByRank={};
    $scope.allCategories={};
    $scope.relevantCategories={};
    $scope.allPoisNames={};
    $scope.currPoisByCategory={};
    $scope.currPoisByName={};
    $scope.nameVisible=false;
    $scope.categoryVisible=false;
    $scope.allCategoriesVisible=false;
    $scope.byRankVisible=false;
    $scope.favorites={};
    $scope.isLogged="";


    if(service.username === "")
    {
        $scope.isLogged=false;
    }
    else
    {
        $scope.isLogged=true;
    }

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
                $scope.catCount=curr;
                $scope.viewAll();
            }
    )


    $scope.addFav=function(){
        var currAll=$scope.pois;
        var currFav=$scope.favorites;
        for(var i in currAll)
        {
            let myName=currAll[i].name;
            if(currFav[myName]===undefined)
                currFav[myName]='images/emptyStar.png';
        }
        $scope.favorites=currFav;
        service.favoritesList = $scope.favorites;
        service.poisData = $scope.pois;
    }

    $scope.changeStar=function(poiName){
        var currFav=$scope.favorites;
        if(currFav[poiName] === 'images/emptyStar.png'){
            currFav[poiName]='images/fullStar.png';
            $rootScope.favorsCount++;
        }
        else{
            if(currFav[poiName] === 'images/fullStar.png'){
                currFav[poiName]='images/emptyStar.png';
                $rootScope.favorsCount--;
            }
        }
        $scope.favorites=currFav;
        service.favoritesList = $scope.favorites;
    }
    

    $scope.viewAll=function(){
        $scope.nameVisible=false;
        $scope.categoryVisible=false;
        $scope.allCategoriesVisible=false;
        $scope.byRankVisible=false;
        let myPois=$scope.pois;
        $http.get("http://localhost:3000/select/pointOfInterest/name,categoryName,image,rank").then(function(response) {
                myPois=response.data;
                $scope.pois=myPois;
                $scope.addFav();
            }
        )
        $scope.allCategoriesVisible=true;
        if(service.favoritesList!==undefined)
            $scope.favorites=service.favoritesList;
    }

    $scope.getPoisByCategory=async function(category)
    {
        //let urlCat=category.toString();
        await $http.get("http://localhost:3000/select/pointOfInterest/name,categoryName,image,rank/categoryName="+'\''+category+'\'').then(function(response) {
                let x=response.data;
                if(x[0] !== undefined)
                    alert(x[0].name);
                return x;
            }
        )
        if(service.favoritesList!==undefined)
            $scope.favorites=service.favoritesList;
    }

    $scope.sortByRank=function(){
        $scope.nameVisible=false;
        $scope.categoryVisible=false;
        $scope.allCategoriesVisible=false;
        $scope.byRankVisible=false;
        let currPois=$scope.pois;
        var byRank=currPois;
        byRank.sort(function(a, b) {return parseFloat(b.rank) - parseFloat(a.rank);})
        $scope.poisByRank=byRank;
        $scope.byRankVisible=true;
        if(service.favoritesList!==undefined)
            $scope.favorites=service.favoritesList;

    }
    $scope.getPoisFromSearch=function()
    {
        $scope.nameVisible=false;
        $scope.categoryVisible=false;
        $scope.allCategoriesVisible=false;
        $scope.byRankVisible=false;
        if($scope.selection===undefined)
            alert("please choose your search option");
        else
        {
            let request=$scope.selection;
            let param=myText.value;
            if(request === 'name')
            {
                let urlName=param.toString();
                let curr=$scope.currPoisByName;
                $http.get("http://localhost:3000/select/pointOfInterest/name,categoryName,image,rank/name="+'\''+urlName+'\'').then(function(response) {
                        curr=response.data;
                        $scope.currPoisByName=curr;
                        if(curr.length === 0)
                            alert("no such name");
                    }
                )
                $scope.nameVisible=true;
            }
            else if(request === 'category')
            {
                let urlCat=param.toString();
                let curr=$scope.currPoisByCategory;
                $http.get("http://localhost:3000/select/pointOfInterest/name,categoryName,image,rank/categoryName="+'\''+urlCat+'\'').then(function(response) {
                        curr=response.data;
                        $scope.currPoisByCategory=curr;
                        if(curr.length === 0)
                            alert("no such category");
                    }
                )
                
                $scope.categoryVisible=true;
            }
            if(service.favoritesList!==undefined)
                $scope.favorites=service.favoritesList;
        }
    }

    $scope.goToPointPage=function(name)
    {
        var currFavs=$scope.favorites;
        var flag=false;
        if(currFavs[name]==='images/fullStar.png')
            flag=true;
        $window.location.href = "#!pointPage#"+name+"_"+flag;         
    }


});
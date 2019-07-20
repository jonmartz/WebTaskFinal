let app = angular.module('myApp', ["ngRoute"]);


function pageLoaded(){
    document.getElementById('upperMessageBox').innerHTML = '<- Please login or register';
}

// config routes
app.config(function($routeProvider)  {
    $routeProvider
        // homepage
        .when('/', {
            templateUrl: 'pages/home/home.html',
            controller : 'homeController as homeCtrl'
        })
        .when('/about', {
            templateUrl: 'pages/about/about.html',
            controller : 'aboutController as abtCtrl'
        })
        .when('/poi', {
            templateUrl: 'pages/poi/poi.html',
            controller : 'poiController as poiCtrl'
        })
        .when('/httpRequest', {
            templateUrl: 'pages/http/request.html',
            controller : 'httpController as httpCtrl'
        })
        .when('/register', {
            templateUrl: 'pages/register/register.html',
            controller : 'registerController as registerCtrl'
        })
        .when('/pointPage', {
            templateUrl: 'pages/pointPage/pointPage.html',
            controller : 'pointPageController as pointPageCtrl'
        })
        .when('/login', {
            templateUrl: 'pages/login/login.html',
            controller : 'loginController as loginCtrl'
        })
        .when('/passwordRecovery', {
            templateUrl: 'pages/passwordRecovery/passwordRecovery.html',
            controller : 'passwordRecoveryController as passwordRecoveryCtrl'
        })
        .when('/favorites', {
            templateUrl: 'pages/favorites/favoritesPage.html',
            controller : 'favoritesPageController as favoritesPageCtrl'
        })
        // other
        .otherwise({ redirectTo: '/' });
});

// custom service
app.service('service', function() {
    this.fPois = [];
    this.username = "";
    this.favoritesList = {};

    this.getCountries = function() {
        return [
            "Australia",
            "Bolivia",
            "China",
            "Denemark",
            "Israel",
            "Latvia",
            "Monaco",
            "August",
            "Norway",
            "Panama",
            "Switzerland",
            "USA"
        ]
    };

    this.getCategories = function() {
        return [
            "food",
            "sightseeing",
            "shopping",
            "entertainment"
        ]
    };

    /**
     * Creates a customized body for POST requests
     * @param table
     * @param columnsString
     * @param values
     * @returns {{columns: *, values: (string|string), table: *}}
     */
    this.createBody = function(table, columnsString, values){

        let valuesString = "";
        for (let i = 0; i < values.length; i++){
            if (i > 0) valuesString += "+";
            valuesString += values[i];
        }
        return {
            "table": table,
            "columns": columnsString,
            "values": valuesString
        };
    }
});

app.service('modalService',['$q','$rootScope',function($q,$rootScope){

    var s=this;    		// Self reference

    // Attributes
    s.modalOn=false;	// Flag to indicate if the modal is on or off. Close by default

    s.openModal=function(){
        s.defer=$q.defer();										// We create a deferrer
        s.modalOn=true;												// Flag the showing of the modal
        $rootScope.$broadcast('MODAL_OPEN');	// Broadcast the message that the popup is open
        return s.defer.promise;								// Return a promise to the calling function
    };

    s.returnValue=function(value){

        s.modalOn=false;												// We flag the closing of the modal
        $rootScope.$broadcast('MODAL_CLOSE');		// Broadcast the event

        s.defer.resolve(value);									// Return the resolved value of the modal
    };

}]);
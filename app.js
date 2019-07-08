let app = angular.module('myApp', ["ngRoute"]);

// config routes
app.config(function($routeProvider)  {
    $routeProvider
        // homepage
        .when('/', {
            // this is a template
            template: '<h1>This is the default route</h1>'
        })
        // about
        .when('/about', {
            // this is a template url
            templateUrl: 'pages/about/about.html',
            controller : 'aboutController as abtCtrl'
        })
        // poi
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
        // other
        .otherwise({ redirectTo: '/' });
});

// custom service
app.service('service', function() {
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
    }

    this.getCategories = function() {
        return [
            "food",
            "sightseeing",
            "shopping",
            "entertainment"
        ]
    }

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
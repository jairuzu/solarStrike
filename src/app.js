var app = angular.module('Solar Strike', ['ngRoute', 'firebase']);

app.config(function($routeProvider) {

    $routeProvider
    .when('/', {
        templateUrl: 'src/home/homeTmpl.html',
        controller: 'homeCtrl'
    })
    .when('/game', {
        templateUrl: 'src/game/gameTmpl.html',
        controller: 'gameCtrl'
    })
    .when('/highScore', {
        templateUrl: 'src/highScore/highScoreTmpl.html',
        controller: 'highScoreCtrl',
        resolve: {
            /*fbScores: function($firebaseArray) {
                var fbBaseURL = 'https://solar-strike.firebaseio.com/scores';
                var fbRef = new Firebase(fbBaseURL);
                var scores = $firebaseArray(fbRef);
                
                return scores;
            }*/
        }
    })
    .otherwise({
        redirectTo: '/' 
    })
});
angular.module('Solar Strike').service('highScoreService', function($firebaseArray, $q) {
    
    var topScores;
    var fbBaseURL = 'https://solar-strike.firebaseio.com/scores';
    var fbRef = new Firebase(fbBaseURL);
    var scores;
  
    resetUserScoreObj();
    
    function resetUserScoreObj() {
        userScoreObj = {
            score: -1,
            level: 0
        }
    }
    
    this.setScoreStats = function(scoreObj) {
        userScoreObj = scoreObj;
    }
    
    this.getScoreStats = function() {
        return userScoreObj;
    }
    
    this.checkUserScore = function(checkScore) {
        if (checkScore.score !== -1) {
            if (topScores.length !== 0) {

                if (topScores.length < 10) {
                    var username = prompt("CONGRATULATIONS! New top 10 score! Please enter your name: ");
                    checkScore.user = username;
                    scores.$add(checkScore);
                }
                else if (checkScore.score > topScores[9].score) {
                    var username = prompt("CONGRATULATIONS! New top 10 score! Please enter your name: ");

                    if (topScores.length >= 10) {
                        deleteLowestFBScoreObj();
                    }
                    checkScore.user = username;
                    scores.$add(checkScore);
                }
            }
            else {
                var username = prompt("CONGRATULATIONS! New top 10 score! Please enter your name: ");
                checkScore.user = username;
                scores.$add(checkScore);
            }
            resetUserScoreObj();
        }
    }
    
    function addFBScoreObj(scoreObj) {
        scores.$add(scoreObj);
    }

    function deleteLowestFBScoreObj() {
        scores.$remove(topScores[9]).then(function (ref) {
            return ref;
        },
        function(err) {
        })
    }
    
    this.getFBScoreObjs = function() {
        var deferred = $q.defer();
        var scoresLoaded = false;
        scores = $firebaseArray(fbRef);
        
        scores.$loaded(function() {
            scoresLoaded = true;
            topScores = scores;
            topScores.sort(function(one,two) {
                var sortByScore = two.score - one.score;
                if (sortByScore === 0) {
                    return two.level - one.level;
                }
                else {
                    return sortByScore;
                }
            });
            deferred.resolve(scores); 
        });
        
        return deferred.promise;
    }
    
    /*this.addDefaultFBScores = function() {
        scores = $firebaseArray(fbRef);
        
        for (var i=0; i < 10; i++) {
            scores.$add({user: 'None', score: 0, level: 0});   
        }
    }*/

});
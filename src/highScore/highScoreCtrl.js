angular.module('Solar Strike').controller('highScoreCtrl', function($scope, highScoreService) {
    
    $scope.userStats = highScoreService.getScoreStats();
    
    highScoreService.getFBScoreObjs().then(function(data) {
        $scope.topScores = data;
        
        highScoreService.checkUserScore($scope.userStats);
        
        highScoreService.getFBScoreObjs().then(function(data2) {
            $scope.topScores = data2;
            $scope.setRootHighScore($scope.topScores[0]);
        });
    });
    
    $scope.sortBy = '-score';
    
});
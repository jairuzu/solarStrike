angular.module('Solar Strike').controller('gameCtrl', function($scope, drawService, objectService, gameService, $interval, $location, highScoreService, utilityService) {
	
    $scope.time = 0;
    $scope.score = 0;
    var timeUpdateDelay = 100;
    var screen = drawService.getScreen();
    $scope.alert = '';
    
    $scope.$watch('rootState.gameState', function() {
        if ($scope.rootState.gameState === 'started' || $scope.rootState.gameState === 'resumed') {
            if($scope.rootState.gameState === 'started') {
                $scope.time = 0;
                $scope.score = 0;
                $scope.alert = '';

                drawService.initialize();
                utilityService.initialize();
                objectService.initialize();
                gameService.initialize();
                
            }
        
        screen = drawService.getScreen();
        timeUpdateDelay = 100;

        window.requestAnimationFrame(nextGameIteration);
        }
    });
    
    function nextGameIteration() {
        drawService.clear(screen);
        objectService.updateObjData();
        drawService.drawObjData(screen, objectService.getObjData());
        drawService.drawObjData(screen, objectService.getSpriteData());
        
        if ($scope.rootState.gameState === 'started' || $scope.rootState.gameState === 'resumed') {
            window.requestAnimationFrame(nextGameIteration);
        }
    }
    
    $interval(function() {
        if ($scope.rootState.gameState === 'started' || $scope.rootState.gameState === 'resumed') {
            
            var doSomethingFun = utilityService.randomInt(1500);
            if (doSomethingFun === 1) {
                objectService.createCoin();
            }
            else if (doSomethingFun === 2) {
                objectService.createHealthPack();
            }
            
            $scope.userCount = objectService.getUserCount();
            if ($scope.userCount <= 0) {
                finishGame();
            }
            updateGameStats();
        
        }
    }, timeUpdateDelay);
    
    function updateGameStats() {
        $scope.time += (timeUpdateDelay/1000);
        $scope.health = objectService.getUserHealth();
        
        
        if ($scope.health < 33) {
            $scope.alert = 'alert_red';
        }
        else if ($scope.health < 66) {
            $scope.alert = 'alert_yellow';
        }
        else {
            $scope.alert = '';
        }
        
        objectService.addToGameScore(-1);
        $scope.score = objectService.getUserScore();
        $scope.enemyCount = objectService.getEnemyCount();

        if ($scope.enemyCount <= 0) gameService.nextLevel();
        $scope.level = gameService.getLevel();
    }

    function finishGame() {
        $scope.updateRootState({gameState: 'stopped', routeState: 'highScore'});
        highScoreService.setScoreStats({score: objectService.getUserScore(), level: gameService.getLevel()});
        $location.url('/highScore');
    }

});
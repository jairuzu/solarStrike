angular.module('Solar Strike').controller('rootCtrl', function($scope, $interval, highScoreService, audioService) {
    
    /*var homeMusic = document.getElementById('homeMusic');
    var gameMusic = document.getElementById('gameMusic');
    var highScoreMusic = document.getElementById('highScoreMusic');*/
    //$scope.rootHighScore = {};
    
    $scope.rootChange = 0;

    highScoreService.getFBScoreObjs().then(function(data) {
        $scope.rootHighScore = data[0];
    });
    
    $scope.rootState = {
        gameState: 'stopped',
        previousGameState: '',
        modalState: false,
        routeState: 'home',
        previousRouteState: '',
        musicState: true,
        previousMusicState: '',
        sfxState: true
    };
    
    audioService.updateMusic($scope.rootState);
    
    $scope.setRootHighScore = function(highScore) {
        $scope.rootHighScore = highScore;
    }
    
    $scope.updateRootState = function(state) {
        $scope.rootState.previousRouteState = $scope.rootState.routeState;
        $scope.rootState.previousGameState = $scope.rootState.gameState;
        $scope.rootState.previousMusicState = $scope.rootState.musicState;
        if (state.gameState !== undefined) $scope.rootState.gameState = state.gameState;
        if (state.modalState !== undefined) $scope.rootState.modalState = state.modalState;
        if (state.routeState !== undefined) $scope.rootState.routeState = state.routeState;
        if (state.musicState !== undefined) $scope.rootState.musicState = state.musicState;
        if (state.sfxState !== undefined) $scope.rootState.sfxState = state.sfxState;
        
        audioService.updateMusic($scope.rootState);
        
        $scope.broadcastRootStateChange();
    }
    
    $scope.broadcastRootStateChange = function() {
        $scope.rootChange++;
    }
    
    $scope.getRootState = function() {
        return $scope.rootState;
    }
    
    $scope.getRootGameState = function() {
        return $scope.rootState.gameState;
    } 
    
    $scope.getModalDisplay = function() {
        return $scope.rootState.modalState;
    }
    
    /*function updateMusic() {
        if ($scope.rootState.routeState !== $scope.rootState.previousRouteState) {
            pauseMusic();
            playMusic('start');
        }
        else if ($scope.rootState.gameState === 'paused') {
            pauseMusic();
        }
        else if ($scope.rootState.gameState === 'started' || $scope.rootState.gameState === 'resumed') {
            playMusic('resume');
        }
    }
    
    function pauseMusic() {
        switch ($scope.rootState.previousRouteState) {
            case 'home' :
                homeMusic.pause(); 
                break;
            case 'game' :
                gameMusic.pause();
                break;
            case 'highScore' :
                highScoreMusic.pause();
                break;
        }
    }
    
    function playMusic(type) {
        switch ($scope.rootState.routeState) {
            case 'home' :
                if (type === 'start') homeMusic.currentTime = .5;
                homeMusic.play();
                break;
            case 'game' :
                if (type === 'start') gameMusic.currentTime = 1.5;
                gameMusic.play();
                break;
            case 'highScore' :
                if (type === 'start') highScoreMusic.currentTime = 2;
                highScoreMusic.play();
                break;   
        }
    }*/
    
})
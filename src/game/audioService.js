angular.module('Solar Strike').service('audioService', function() {

    var rootState;
    var homeMusic = document.getElementById('homeMusic');
    var gameMusic = document.getElementById('gameMusic');
    var highScoreMusic = document.getElementById('highScoreMusic');
    
    this.updateMusic = function(state) {
        rootState = state;
                
            if (rootState.musicState === true) {
                if (rootState.routeState !== rootState.previousRouteState) {
                    pauseMusic();
                    playMusic('start');
                }
                else if (rootState.gameState === 'paused') {
                    pauseMusic();
                }
                else if (rootState.gameState === 'started' || rootState.gameState === 'resumed') {
                    playMusic('resume');
                }
                else if (rootState.previousMusicState !== rootState.musicState) {
                    playMusic('start');
                }
            }
            else {
                pauseMusic();
            }
    }
    
    this.getSFXState = function() {
        return rootState.sfxState;
    }

    function pauseMusic() {
        switch (rootState.previousRouteState) {
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
        switch (rootState.routeState) {
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
    }
        
});
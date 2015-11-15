angular.module('Solar Strike').directive('appHeaderDir', function($location) {
    return {
        templateUrl: 'directives/appHeader/appHeaderTmpl.html',
        scope: {
            rootStateChange: '=',
            sendState: '&',
            getRootState: '&',
            currentHighScore: '='
            
        },
        link: function($scope, element, attrs) {  
            
            $scope.homeClick = function() {
                if ($scope.modalState !== true) {
                    $location.url('/');
                    $scope.routeState = 'home';
                    $scope.sendBackState();
                }
            }

            $scope.playClick = function() {
                if ($scope.modalState !== true) {
                    $scope.gameState = 'started';
                    if ($location.url() !== '/game') $location.url('/game');
                    $scope.routeState = "game";
                    $scope.sendBackState();
                }
            }
            
            $scope.pauseClick = function() {
                if ($scope.modalState !== true) {
                    $scope.gameState = 'paused';
                    $scope.sendBackState();
                }
            }
            
            $scope.resumeClick = function() {
                if ($scope.modalState !== true) {
                    $scope.gameState = 'resumed';
                    $scope.sendBackState();
                }
            }
            
            $scope.quitClick = function() {
                if ($scope.modalState !== true) {
                    $scope.modalState = true;
                    $scope.gameState = 'paused';
                    $scope.sendBackState();
                }
            }
            
            $scope.highScoresClick = function() {
                if ($scope.modalState !== true) {
                    $location.url('/highScore');
                    $scope.routeState = 'highScore';
                    $scope.sendBackState();
                }
            }
            
            $scope.musicClick = function() {
                if ($scope.modalState !== true) {
                    $scope.musicState = !$scope.musicState;
                    $scope.sendBackState();
                }
            }
            
            $scope.sfxClick = function() {
                if ($scope.modalState !== true) {
                    $scope.sfxState = !$scope.sfxState;
                    $scope.sendBackState();
                }
            }
            
            $scope.sendBackState = function() {
                $scope.stateObj = {
                    gameState: $scope.gameState,
                    modalState: $scope.modalState,
                    routeState: $scope.routeState,
                    musicState: $scope.musicState,
                    sfxState: $scope.sfxState
                };
                $scope.sendState({state: $scope.stateObj});
            }
            
                
            $scope.$watch('rootStateChange', function() {
                $scope.currentRootState = $scope.getRootState();
                
                $scope.gameState = $scope.currentRootState.gameState;
                $scope.modalState = $scope.currentRootState.modalState;
                $scope.routeState = $scope.currentRootState.routeState;
                $scope.musicState = $scope.currentRootState.musicState;
                $scope.sfxState = $scope.currentRootState.sfxState;
                $scope.updateButtonState();
            });
            
            $scope.updateButtonState = function() {
                if ($scope.musicState) $scope.musicText = 'Mute Music';
                else $scope.musicText = 'Play Music';
                
                if ($scope.sfxState) $scope.sfxText = 'Mute SFX';
                else $scope.sfxText = 'Play SFX';
                
                if ($scope.gameState === 'stopped') {
                    $scope.homeState = true;
                    $scope.quitState = false;
                    $scope.playState = true;
                    $scope.pauseState = false;
                    $scope.resumeState = false;
                    $scope.highScoresState = true;
                } else if ($scope.gameState === 'started') {
                    $scope.homeState = false;
                    $scope.quitState = true;
                    $scope.playState = false;
                    $scope.pauseState = true;
                    $scope.resumeState = false;
                    $scope.highScoresState = false;
                } else if ($scope.gameState === 'paused') {
                    $scope.homeState = false;
                    $scope.quitState = true;
                    $scope.playState = false;
                    $scope.pauseState = false;
                    $scope.resumeState = true;
                    $scope.highScoresState = false;
                } else if ($scope.gameState === 'resumed') {
                    $scope.homeState = false;
                    $scope.quitState = true;
                    $scope.playState = false;
                    $scope.pauseState = true;
                    $scope.resumeState =false;
                    $scope.highScoresState = false;
                }
                
            }
        }
    }
});
angular.module('Solar Strike').directive('dialogBoxDir', function($location) {
   return {
       templateUrl: 'directives/dialogBox/dialogBoxTmpl.html',
       scope: {
           msg: '=msg',
           rootStateChange: '=',
           getRootState: '&',
           sendState: '&'
       },
       link: function($scope, element, atts) {
           $scope.windowW = window.innerWidth;
           $scope.windowH = window.innerHeight;
           $scope.elementW = element[0].childNodes[0].scrollWidth;
           $scope.elementH = element[0].childNodes[0].scrollHeight;
           element.css('top', ($scope.windowH/2 - $scope.elementH/2) + 'px');
           element.css('left', ($scope.windowW/2 - $scope.elementW/2) + 'px');
           
           $scope.pressedYes = function() {
               $scope.gameState = 'stopped';
               $location.url('/');
               $scope.routeState = 'home';
               $scope.sendBackState();
           }
           
           $scope.pressedNo = function() {
               $scope.gameState = 'resumed';
               $scope.sendBackState();
           }
           
           $scope.sendBackState = function() {
               $scope.modalState = false;
               $scope.stateObj = {
                   gameState: $scope.gameState,
                   modalState: $scope.modalState,
                   routeState: $scope.routeState
               };
               $scope.sendState({state: $scope.stateObj});
           }
           
           $scope.$watch('rootStateChange', function() {
               $scope.currentRootState = $scope.getRootState();
               
               $scope.gameState = $scope.currentRootState.gameState;
               $scope.modalState = $scope.currentRootState.modalState;
               $scope.routeState = $scope.currentRootState.routeState;
               $scope.showMe = $scope.modalState;
           });
       }
   } 
});
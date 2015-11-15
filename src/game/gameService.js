angular.module('Solar Strike').service('gameService', function(objectService, utilityService, collisionService) {

    var level = 1;
    var gameOver = false;
    
    this.initialize = function() {
        
        level = 1;
        gameOver = false;

        objectService.createUserSpaceship();

        loadLevel(); 
    }
    
    function loadLevel() {
        switch (level) {
            case 1:
                for (var i = 0; i < 1; i++) objectService.createEnemyShip();
                for (var i = 0; i < 1; i++) objectService.createCoin();
                for (var i = 0; i < 1; i++) objectService.createHealthPack();
            break;
            case 2:
                for (var i = 0; i < 2; i++) objectService.createEnemyShip();
                for (var i = 0; i < 2; i++) objectService.createCoin();
                for (var i = 0; i < 1; i++) objectService.createHealthPack();
            break;
            case 3:
                for (var i = 0; i < 3; i++) objectService.createEnemyShip();
                for (var i = 0; i < 3; i++) objectService.createCoin();
                for (var i = 0; i < 1; i++) objectService.createHealthPack();
            break;
            case 4:
                for (var i = 0; i < 4; i++) objectService.createEnemyShip();
                for (var i = 0; i < 4; i++) objectService.createCoin();
                for (var i = 0; i < 1; i++) objectService.createHealthPack();
                break;
            case 5:
                for (var i = 0; i < 5; i++) objectService.createEnemyShip();
                for (var i = 0; i < 5; i++) objectService.createCoin();
                for (var i = 0; i < 1; i++) objectService.createHealthPack();
                break;
            case 6:
                for (var i = 0; i < 6; i++) objectService.createEnemyShip();
                for (var i = 0; i < 5; i++) objectService.createCoin();
                for (var i = 0; i < 1; i++) objectService.createHealthPack();
                break;
            case 7:
                for (var i = 0; i < 7; i++) objectService.createEnemyShip();
                for (var i = 0; i < 4; i++) objectService.createCoin();
                for (var i = 0; i < 1; i++) objectService.createHealthPack();
                break;
            case 8:
                for (var i = 0; i < 8; i++) objectService.createEnemyShip();
                for (var i = 0; i < 3; i++) objectService.createCoin();
                for (var i = 0; i < 1; i++) objectService.createHealthPack();
                break;
            case 9:
                for (var i = 0; i < 9; i++) objectService.createEnemyShip();
                for (var i = 0; i < 2; i++) objectService.createCoin();
                for (var i = 0; i < 1; i++) objectService.createHealthPack();
                break;
            case 10:
                for (var i = 0; i < 10; i++) objectService.createEnemyShip();
                for (var i = 0; i < 1; i++) objectService.createCoin();
                for (var i = 0; i < 1; i++) objectService.createHealthPack();
                break;
            case 11:
                for (var i = 0; i < 11; i++) objectService.createEnemyShip();
                for (var i = 0; i < 2; i++) objectService.createCoin();
                for (var i = 0; i < 2; i++) objectService.createHealthPack();
                break;
            case 12:
                for (var i = 0; i < 12; i++) objectService.createEnemyShip();
                for (var i = 0; i < 3; i++) objectService.createCoin();
                for (var i = 0; i < 2; i++) objectService.createHealthPack();
                break;
            case 13:
                for (var i = 0; i < 13; i++) objectService.createEnemyShip();
                for (var i = 0; i < 4; i++) objectService.createCoin();
                for (var i = 0; i < 2; i++) objectService.createHealthPack();
                break;
            case 14:
                for (var i = 0; i < 14; i++) objectService.createEnemyShip();
                for (var i = 0; i < 5; i++) objectService.createCoin();
                for (var i = 0; i < 2; i++) objectService.createHealthPack();
                break;
            case 15:
                for (var i = 0; i < 15; i++) objectService.createEnemyShip();
                for (var i = 0; i < 5; i++) objectService.createCoin();
                for (var i = 0; i < 2; i++) objectService.createHealthPack();
                break;
            case 16:
                for (var i = 0; i < 16; i++) objectService.createEnemyShip();
                for (var i = 0; i < 5; i++) objectService.createCoin();
                for (var i = 0; i < 2; i++) objectService.createHealthPack();
                break;
            case 17:
                for (var i = 0; i < 17; i++) objectService.createEnemyShip();
                for (var i = 0; i < 5; i++) objectService.createCoin();
                for (var i = 0; i < 2; i++) objectService.createHealthPack();
                break;
            case 18:
                for (var i = 0; i < 18; i++) objectService.createEnemyShip();
                for (var i = 0; i < 5; i++) objectService.createCoin();
                for (var i = 0; i < 2; i++) objectService.createHealthPack();
                break;
            case 19:
                for (var i = 0; i < 19; i++) objectService.createEnemyShip();
                for (var i = 0; i < 5; i++) objectService.createCoin();
                for (var i = 0; i < 2; i++) objectService.createHealthPack();
                break;
            case 20:
                for (var i = 0; i < 20; i++) objectService.createEnemyShip();
                for (var i = 0; i < 5; i++) objectService.createCoin();
                for (var i = 0; i < 2; i++) objectService.createHealthPack();
                break;
        }
    }
    
    this.nextLevel = function() {
        if (level < 20) {
            level++;
            loadLevel();
        }
        else if (gameOver === false) {
            objectService.addToGameScore(Math.round(objectService.getUserHealth())*500);
            alert('CONGRATULATIONS MASTER COMMANDER! YOU WIN!!  Your final score is: ' + objectService.getUserScore());
            objectService.finishGame();
            gameOver = true;
        }
    }
    
    this.getLevel = function() {
        return level;
    }

});
angular.module('Solar Strike').service('utilityService', function() {
    
    var keysDown = []; 
    
    this.initialize = function() {
        keysDown = [];
    }
    
    window.onkeydown = function(event) {        
        if (event.which === 38) { // UP
            addKeyPush(event.which);
        }
        else if (event.which === 40) { // DOWN
            addKeyPush(event.which);
        }
        else if (event.which === 37) { // LEFT
            addKeyPush(event.which);
        }
        else if (event.which === 39) { // RIGHT
            addKeyPush(event.which);
        }
        else if (event.which == 32) { // SPACE
            addKeyPush(event.which);
        }
        else if (event.which === 73) { // i key for INFO
            addKeyPush(event.which);
        }
    }

    window.onkeyup = function(event) {        
        if (event.which === 38) { // UP
            removeKeyPush(event.which);
        }
        else if (event.which === 40) { // DOWN
            removeKeyPush(event.which);
        }
        else if (event.which === 37) { // LEFT
            removeKeyPush(event.which);
        }
        else if (event.which === 39) { // RIGHT
            removeKeyPush(event.which);
        }
        else if (event.which === 32) { // SPACE
            removeKeyPush(event.which);
        }
        else if (event.which === 73) { // i key for INFO
            removeKeyPush(event.which); 
        }
    }
    
    function addKeyPush(keyCode) {
        if (keysDown.indexOf(keyCode) === -1) keysDown.push(keyCode);
    }

    function removeKeyPush(keyCode) {
        var keyPos = keysDown.indexOf(keyCode);
        if (keyPos !== -1) keysDown.splice(keyPos,1);
    }
    
    this.getKeysDown = function() {
        return keysDown;
    }
        
    this.randomXY = function(x_max, y_max) {
        var x = Math.round(Math.random()*x_max);
        var y = Math.round(Math.random()*y_max);

        return {x: x, y: y}; 
    }
    
    this.randomXYRange = function(x_min, x_max, y_min, y_max) {
        var x = Math.round(Math.random()*(x_max - x_min)) + x_min;
        var y = Math.round(Math.random()*(y_max - y_min)) + y_min;

        return {x: x, y: y}; 
    }
    
    this.randomAngle = function() {
        return Math.floor(Math.random()*2*Math.PI);
    }
    
    this.randomInt = function(max) {
        return Math.round(Math.random()*max);
    }
    
    this.randomIntRange = function(min, max) {
        return Math.round(Math.random()*(max - min)) + min;
    }
    
    this.randomFloat = function(max) {
        return Math.random()*max;
    }
    
    this.randomFloatRange = function(min, max) {
        return Math.random()*(max - min) + min;
    }
    
    this.correctAngle2PI = function(angle) {
        while (angle > 2*Math.PI) {
            angle -= 2*Math.PI;
        }
        while (angle < 0) {
            angle += 2*Math.PI;
        }
        if (angle === 2*Math.PI) angle = 0;

        return angle;
    }
    
    this.mergeObjs = function(obj1) {
        newObj = {};
        
        for (var i = arguments.length - 1; i >= 0; i--) {
            for (var prop in arguments[i]) {
                newObj[prop] = arguments[i][prop];   
            }
        }

        return newObj;
    }
    
    this.calcCenterXYOffset = function(xOffset, yOffset, objAngle) {
        var hypotenuse = Math.sqrt(Math.pow(xOffset, 2) + Math.pow(yOffset, 2));
        var offsetAngle = Math.atan2(yOffset, xOffset);

        newXOffset = hypotenuse*Math.cos(objAngle+offsetAngle);
        newYOffset = hypotenuse*Math.sin(objAngle+offsetAngle);

        return {x: newXOffset, y: newYOffset}; 
    }
 
});
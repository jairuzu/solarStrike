angular.module('Solar Strike').service('drawService', function() {

    var canvas = document.getElementById('gameScreen');
    var screen = canvas.getContext('2d');
    
    this.initialize = function() {
        canvas = document.getElementById('gameScreen');
        screen = canvas.getContext('2d');
    }
        
    this.getScreen = function() {
        return screen;
    }
    
    this.clear = function(context) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	}

    this.drawObjData = function(context, objs) {
        for (var i = 0; i < objs.length; i++) {
            objs[i].draw(context);
        }
    }
    
    this.getContextSize = function(context) {
        return {width: context.canvas.width, height: context.canvas.height};
    }
    
    this.drawCircle = function(context, x, y, radius, options) {
        if (options.startAngle === undefined) {
            options.startAngle = 0;
        }
        if (options.endAngle === undefined) {
            options.endAngle = 2*Math.PI;
        }
        
        context.beginPath();
        context.arc(x, y, radius, options.startAngle, options.endAngle);
        context.closePath();
        
        for (var prop in options) {
            context[prop] = options[prop];
        }
        if (options.strokeStyle !== undefined) {
            context.stroke();
        }
        if (options.fillStyle !== undefined) {
            context.fill();  
        }
    }
    
    this.drawHealth = function(context, obj) {
        this.drawCircle(context, 0, 0, obj.width/2 + obj.width*.20, {startAngle: 0, endAngle: 2*Math.PI, strokeStyle: 'rgba(' + Math.round(255*(1 - obj.health)) + ',' + Math.round(255*obj.health) + ', 0, ' + (1 - obj.health) + ')', lineWidth: 10*(1 - obj.health)});
    }
    
});
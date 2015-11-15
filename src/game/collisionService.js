angular.module('Solar Strike').service('collisionService', function(utilityService) {
    
    this.checkCollision = function(objA, objB) {    
        
        if (objA.collisionObjNamesToDetect.indexOf(objB.name) !== -1 || objB.collisionObjNamesToDetect.indexOf(objA.name) !== -1) {
            var xDiff = objA.centerX - objB.centerX;
            var yDiff = objB.centerY - objA.centerY;
            var centerAngle = utilityService.correctAngle2PI(Math.atan2(yDiff, xDiff));

            if (objA.collisionShape === 'circle' && objB.collisionShape === 'circle') {
                var diff = Math.sqrt(Math.pow(Math.abs(xDiff),2)+Math.pow(Math.abs(yDiff),2));
                var dist = diff - objA.boundWidth/2 - objB.boundWidth/2;

                if (dist <= 0) {
                    return true;
                } else {
                    return false;
                }
            }
            else if (objA.collisionShape === "rectangle" && objB.collisionShape === "rectangle") {
                if (objA.centerX + objA.boundWidth/2 > objB.centerX - objB.boundWidth/2 &&
                objA.centerX - objA.boundWidth/2 < objB.centerX + objB.boundWidth/2 &&
                objA.centerY + objA.boundHeight/2 > objB.centerY - objB.boundHeight/2 &&
                objA.centerY - objA.boundHeight/2 < objB.centerY + objB.boundHeight/2) {

                    return true;
                }
                else {
                    return false;
                }
            }
            else if (objA.collisionShape === "point" || objB.collisionShape === "point") {
                if (objA.collisionShape === "point" && objB.collisionShape === "point") {
                    //Do nothing.
                }
                else if (objA.collisionShape === "point") {
                    var diff = Math.sqrt(Math.pow(Math.abs(xDiff),2)+Math.pow(Math.abs(yDiff),2));
                    var dist = diff - objB.boundWidth/2; 
                    if (dist <= 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    var diff = Math.sqrt(Math.pow(Math.abs(xDiff),2)+Math.pow(Math.abs(yDiff),2));
                    var dist = diff - objA.boundWidth/2;
                    if (dist <= 0) {
                        return true;
                    } else {
                        return false;
                    }  
                } 
            }
            else {
                console.log('TBD');
            }

        }
        else {
            return false;
        }
        
    }

});
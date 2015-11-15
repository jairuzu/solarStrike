angular.module('Solar Strike').service('objectService', function(utilityService, drawService, collisionService, audioService) {
   
    var gameObjs = [];
    var spriteObjs = [];
    var trashObjs = [];
    var gameScore = 1000;
    var gameObjID = 0;
    var userSpaceship;
    var enemyCount = 0;
    var userCount = 0;
    var screen = drawService.getScreen();
    var screenW = screen.canvas.width;
    var screenH = screen.canvas.height;
    
    this.initialize = function() {
        gameObjs = [];
        spriteObjs = [];
        trashObjs = [];
        gameScore = 1000;
        gameObjID = 0;
        enemyCount = 0;
        userCount = 0;
    }
    
    var SpriteObj = function(options) {
        this.objId = -1;
        this.sprite = new Image();
        this.sprite.src = 'images/TestBlock.png';
        this.centerX = screenW/2;
        this.centerY = screenH/2;
        this.angle = 0;
        this.alpha = 1;
        this.scale = 1;
        this.live = true;
        this.speed = 0;
        this.speedX = this.speed*Math.cos(this.angle);
        this.speedY = this.speed*Math.sin(this.angle);
        this.speedMax = 10;
        this.speedMin = -10;
        this.rotateSpeed = 0;
        this.rotateSpeedMax = 10;
        this.rotateSpeedMin = -10;
        this.draw = function(context) {
            context.save();
            context.globalAlpha = this.alpha;
            context.translate(this.centerX, this.centerY);
            context.scale(this.scale, this.scale);
            context.rotate(-this.angle);
            context.drawImage(this.sprite, -this.width/2, -this.height/2);
            context.restore();
        };
        this.rotate = function(degrees) {
            this.angle += (degrees*(Math.PI/180));
            this.angle = utilityService.correctAngle2PI(this.angle);
        };
        this.move = function() {
            this.speedY = this.speed*Math.sin(this.angle);
            this.speedX = this.speed*Math.cos(this.angle);
            this.y_top -= this.speedY;
            this.centerY -= this.speedY;
            this.x_left += this.speedX;
            this.centerX += this.speedX;
        };
        this.stepAction = function() {
            //console.log('Object ' + this + ' does not have a "stepAction" function');
        };
        this.destroy = function() {
            this.live = false;
        };
        
        updateObjOptions(this, options);
        this.width = this.sprite.width;
        this.height = this.sprite.height;
        this.x_left = this.centerX - this.width/2;
        this.y_top = this.centerY - this.height/2;
    }
    
    var GameObj = function(options) {
        var gameObj = new SpriteObj(options); 
        gameObj.name = 'null';
        gameObj.health = 1;
        gameObj.healthDisplayAngle = 0;
        gameObj.weaponStrength = 0;
        gameObj.collisionObjNamesToDetect = [];
        gameObj.collisionShape = 'circle';
        gameObj.strokeType = 'black';
        gameObj.diagonal = Math.sqrt(Math.pow(gameObj.width, 2) + Math.pow(gameObj.height, 2));
        gameObj.diagonalAngle = Math.atan2(gameObj.height, gameObj.width);
        gameObj.boundWidthScale = 1;
        gameObj.boundHeightScale = 1;

        gameObj.draw = function(context) {
            context.save();
            context.strokeStyle = this.strokeType;
            context.globalAlpha = this.alpha;
            if (this.collisionShape === 'rectangle') {
                //context.strokeRect(this.centerX - this.boundWidth/2, this.centerY - this.boundHeight/2, this.boundWidth, this.boundHeight);   
            }
            else if (this.collisionShape === 'circle') {
                //drawService.drawCircle(context, this.centerX, this.centerY, this.boundWidth/2, {strokeStyle: this.strokeType});
            }
            context.translate(this.centerX, this.centerY);
            context.scale(this.scale, this.scale);
            context.rotate(-this.angle);
            this.healthDisplayAngle = utilityService.correctAngle2PI(this.healthDisplayAngle + 5*(Math.PI/180));
            drawService.drawHealth(context, this);
            context.drawImage(this.sprite, -this.width/2, -this.height/2);
            context.restore();
        };
        gameObj.rotate = function(degrees) {
            this.angle += (degrees*(Math.PI/180));
            this.angle = utilityService.correctAngle2PI(this.angle);
            this.boundWidth = calcBoundingBox(this).boundWidth;
            this.boundHeight = calcBoundingBox(this).boundHeight;
            this.boundDiagonal = Math.sqrt(Math.pow(this.boundWidth, 2) + Math.pow(this.boundHeight, 2));
        }
        gameObj.boundaryCheckType = 'inside';
        gameObj.boundaryCheck = function() {
            var type = 1;
            var margin = 0;
            if (this.boundaryCheckType === 'inside') {
                type = 1;
                margin = 0;
            }
            else if (this.boundaryCheckType === 'outside') {
                type = -1;
                margin = 0;
            }
            else {
                type = -1;
                margin = this.boundaryCheckType;
            }

            if (this.centerX + type*(this.boundWidth/2) > screenW + margin) {
                this.boundaryAction('right');
            }
            if (this.centerX - type*this.boundWidth/2 < 0 - margin) {
                this.boundaryAction('left');
            }
            if (this.centerY - type*this.boundHeight/2 < 0 - margin) {
                this.boundaryAction('top');
            }
            if (this.centerY + type*this.boundHeight/2 > screenH + margin) {
                this.boundaryAction('bottom');
            }
        }

        gameObj.useUserInput = function() {
            //console.log('Object ' + this + ' does not have a "useUserInput" function');
        }

        gameObj.boundaryAction = function(boundarySide) {
            if (boundarySide === 'right') {
                this.centerX = screenW - this.boundWidth/2;
                this.speedX = 0;
            }
            if (boundarySide === 'left') {
                this.centerX = this.boundWidth/2;
                this.speedX = 0;
            }
            if (boundarySide === 'top') {
                this.centerY = this.boundHeight/2;
                this.speedY = 0;
            }
            if (boundarySide === 'bottom') {
                this.centerY = screenH - this.boundHeight/2;
                this.speedY = 0;
            }
        }

        gameObj.onCollision = function(collisionObj) {
            //console.log('Object ' + this + ' does not have a "onCollision" function');
        }
        
        updateObjOptions(gameObj, options);
        
        gameObj.boundWidth = calcBoundingBox(gameObj).boundWidth;
        gameObj.boundHeight = calcBoundingBox(gameObj).boundHeight;
        gameObj.boundDiagonal = Math.sqrt(Math.pow(gameObj.boundWidth, 2) + Math.pow(gameObj.boundHeight, 2));
        return gameObj;
    }
    
    var SpaceShipObj = function(options) {
        var spaceShip = GameObj(options);
        spaceShip.boundWidthScale = 1;
        spaceShip.boundHeightScale = 1;
        
        updateObjOptions(spaceShip, options);
        return spaceShip;
    }    
    
    var UserShipObj = function(options) {
        var userShip = SpaceShipObj(options);
        userShip.name = 'userSpaceship';
        //userShip.src = ''
        //userShip.width = 72;
        //userShip.height = 72;
        userShip.weaponStrength = .02;
        userShip.collisionObjNamesToDetect = ['coin', 'enemySpaceship', 'enemyLaser'];
        userShip.shootCount = 0;
        userShip.shootInterval = 10;
        userShip.useUserInput = function() {
            var keys = utilityService.getKeysDown();

            if (keys.indexOf(38) === -1 && keys.indexOf(40) === -1) { // NO UP OR DOWN
                if (this.speed > 1) this.speed -= .5;
                else if (this.speed < -1) this.speed +=.5;
                else if (this.speed >= -1 && this.speed <= 1) this.speed = 0;
            }
            if (keys.indexOf(37) === -1 && keys.indexOf(39) === -1) { // NO LEFT OR RIGHT
                if (this.rotateSpeed > 1.5) this.rotateSpeed -= 1;
                else if (this.rotateSpeed < -1.5) this.rotateSpeed += 1;
                else if (this.rotateSpeed >= -1.5 && this.rotateSpeed <= 1.5) this.rotateSpeed = 0;
            }

            if (keys.indexOf(38) !== -1) { // UP
                if (this.speed <= this.speedMax) this.speed += 1;
                
                var offsetXY = utilityService.calcCenterXYOffset(-this.width/2, 0, this.angle);
                
                addSpriteObject(
                    SpaceshipBooster({
                        src: 'images/spaceship_booster.png',
                        centerX: this.centerX+offsetXY.x,
                        centerY: this.centerY-offsetXY.y,
                        angle: this.angle,
                        lifeTime: 10,
                        endScale: .5,
                        endAlpha: 0
                    })
                );
                
            }
            if (keys.indexOf(40) !== -1) { // DOWN
                if (this.speed >= this.speedMin) this.speed -= 1;
            }
            if (keys.indexOf(37) !== -1) { // LEFT
                if (this.rotateSpeed < this.rotateSpeedMax) this.rotateSpeed += .5;
            }
            if (keys.indexOf(39) !== -1) { // RIGHT
                if (this.rotateSpeed > this.rotateSpeedMin) this.rotateSpeed -= .5;
            }
            if (keys.indexOf(32) !== -1) { // SPACEBAR

                if (this.shootCount >= this.shootInterval && gameScore > 0) {
                    this.shootCount = 0;
                    
                    var offsetXY = utilityService.calcCenterXYOffset(this.width/2, 28, this.angle);    
                        
                    addGameObject(
                        UserLaserObj({
                            src: 'images/userLaser.png',
                            centerX: this.centerX+offsetXY.x,
                            centerY: this.centerY-offsetXY.y,
                            angle: this.angle,
                            speed: 30,
                            speedMax: 30,
                            speedMin: -30
                        })
                    );
                    
                    var offsetXY = utilityService.calcCenterXYOffset(this.width/2, -28, this.angle);    

                    addGameObject(
                        UserLaserObj({
                            src: 'images/userLaser.png',
                            centerX: this.centerX+offsetXY.x,
                            centerY: this.centerY-offsetXY.y,
                            angle: this.angle,
                            speed: 30,
                            speedMax: 30,
                            speedMin: -30
                        })
                    );
                    
                    updateGameScore(-100);
                    
                    if (audioService.getSFXState()) {
                        var laserSFX = new Audio('sfx/freesfx/sound_design_effect_descend_futuristic_short.mp3');
                        laserSFX.volume -=.2;
                        laserSFX.play(); 
                    }
                }

            }
            if (keys.indexOf(73) !== -1) {
                outputDebugInfo();
            }

        }
        userShip.stepAction = function () {
            if (this.shootCount < this.shootInterval) this.shootCount++;
            if (this.health <= .50) {
                var offsetXY = utilityService.calcCenterXYOffset(-this.width/2, utilityService.randomIntRange(-this.width/2*.75, this.width/2*.75), this.angle);
                
                addSpriteObject(
                    SmokePuff({
                        src: 'images/smoke.png', 
                        centerX: this.centerX + offsetXY.x,
                        centerY: this.centerY - offsetXY.y,
                        angle: utilityService.randomFloat(2*Math.PI),
                        lifeTime: 15,
                        endScale: 2,
                        endAlpha: 0
                    })
                );
            }
        }
        userShip.onCollision = function(collisionObj) {
            this.health -= collisionObj.weaponStrength;
            
            if (collisionObj.name === "enemySpaceship") {
                addSpriteObject(
                    CollisionHalo({
                        src: 'images/collisionHalo.png', 
                        centerX: this.centerX,
                        centerY: this.centerY,
                        angle: 0,
                        lifeTime: 15,
                        endScale: 3,
                        endAlpha: 0
                    })
                );
                
                if (audioService.getSFXState()) {
                    var collisionSFX = new Audio('sfx/freesfx/sound_design_noise_organic_2.mp3');
                    collisionSFX.volume -=.8;
                    collisionSFX.play();
                }
            }
    
            if (this.health <= 0 ) {
                this.destroy();
                userCount--;
                if (audioService.getSFXState()) {
                    var userExplosionSFX1 = new Audio('sfx/freesfx/explosion.mp3');
                    userExplosionSFX1.play();
                    var userExplosionSFX2 = new Audio('sfx/freesfx/explosion_with_reverse_intro.mp3');
                    userExplosionSFX2.play();
                }
            }
            
            if (collisionObj.name === "coin") {
                updateGameScore(1000);
            }
            
            if (collisionObj.name === "healthPack") {
                updateHealth(.5);
            }
            
        }

        updateObjOptions(userShip, options);
        return userShip;
    }   
    
    var EnemyShipObj = function(options) {
        var enemyShip = SpaceShipObj(options);
        enemyShip.name = 'enemySpaceship';
        enemyShip.weaponStrength = .01;
        enemyShip.collisionObjNamesToDetect = ['userSpaceship', 'userLaser'];
        enemyShip.boundaryCheckType = 100;
        enemyShip.boundaryAction = function(boundarySide) {
            if (boundarySide === 'right' || boundarySide === 'left' || boundarySide === 'top' || boundarySide === 'bottom') {
                this.angle = utilityService.correctAngle2PI(this.angle + Math.PI);
                this.speed = utilityService.randomFloat(5);
            }
            if (boundarySide === 'bottom') {
                this.centerY = screenH + 72;
            } else if (boundarySide === 'left') {
                this.centerX = -72;
            } else if (boundarySide === 'right') {
                this.centerX = screenW + 72;
            } else {
                this.centerY = -72;
            }
        }
        enemyShip.stepAction = function() {
            if (utilityService.randomInt(50) === 1) {
            
                var offsetXY = utilityService.calcCenterXYOffset(this.width/2, 28, this.angle);
                
                addGameObject(
                    EnemyLaserObj({
                        src: 'images/enemyLaser.png',
                        centerX: this.centerX+offsetXY.x,
                        centerY: this.centerY-offsetXY.y,
                        angle: this.angle,
                        speed: 30,
                        speedMax: 30,
                        speedMin: -30
                    })
                );
                
                var offsetXY = utilityService.calcCenterXYOffset(this.width/2, -28, this.angle);
                
                addGameObject(
                    EnemyLaserObj({
                        src: 'images/enemyLaser.png',
                        centerX: this.centerX+offsetXY.x,
                        centerY: this.centerY-offsetXY.y,
                        angle: this.angle,
                        speed: 30,
                        speedMax: 30,
                        speedMin: -30
                    })
                );
                
            };

            if (utilityService.randomInt(2) === 1) {
                var userSpaceShipDir = utilityService.correctAngle2PI(Math.atan2(userSpaceship.centerX - this.centerX, userSpaceship.centerY - this.centerY) - Math.PI/2);
                
                if (this.angle > userSpaceShipDir) {
                    if (this.angle - userSpaceShipDir < (Math.PI*2 - this.angle + userSpaceShipDir)) this.angle -= .0175;
                    else this.angle += .0175;
                } else {
                    if (userSpaceShipDir - this.angle < (Math.PI*2 - userSpaceShipDir + this.angle)) this.angle += .0175;
                    else this.angle -= .0175; 
                }
                
            }
            if (utilityService.randomInt(20) === 1) {
                if (this.speed < this.speedMax && this.speed > this.speedMin) this.speed += utilityService.randomInt(3) - 1;
            }
            
            if (this.health <= .50) {
                var offsetXY = utilityService.calcCenterXYOffset(-this.width/2, utilityService.randomIntRange(-this.width/2*.75, this.width/2*.75), this.angle);

                addSpriteObject(
                    SmokePuff({
                        src: 'images/smoke.png', 
                        centerX: this.centerX + offsetXY.x,
                        centerY: this.centerY - offsetXY.y,
                        angle: utilityService.randomFloat(2*Math.PI),
                        lifeTime: 15,
                        endScale: 2,
                        endAlpha: 0
                    })
                );
            }
            
        }
        enemyShip.onCollision = function(collisionObj) {
            
            this.health -= collisionObj.weaponStrength;
            
            if (this.health <= 0) {
                addSpriteObject(
                    ExplosionObj({
                        src: 'images/explosion1.png', 
                        centerX: this.centerX,
                        centerY: this.centerY,
                        angle: utilityService.randomInt(10) - 5,
                        lifeTime: 15,
                        endScale: 2,
                        endAlpha: 0
                    })
                );
                if (audioService.getSFXState()) {
                    var explosionSFX = new Audio('sfx/freesfx/explosion_distant_003.mp3');
                    explosionSFX.play();
                }
                this.destroy();
                updateGameScore(2000);
                enemyCount--;
            }
        }
        
        updateObjOptions(enemyShip, options);
        return enemyShip;
    }
    
    var LaserObj = function(options) {
        var laser = GameObj(options);
        
        laser.boundaryCheckType = 'outside';
        laser.collisionShape = 'point';
        laser.boundaryAction = function(boundarySide) {
            if (boundarySide === 'right' || boundarySide === 'left' || boundarySide === 'top' || boundarySide === 'bottom') {
                this.destroy();
            }
        }
        
        updateObjOptions(laser, options);
        return laser;
    }
    
    var UserLaserObj = function(options) {
        var userLaser = LaserObj(options);

        userLaser.name = 'userLaser';
        userLaser.collisionObjNamesToDetect = ['enemySpaceShip', 'coin'];
        userLaser.weaponStrength = .5;
        userLaser.onCollision = function(collisionObj) {
            addSpriteObject(
                HitRing({
                    src: 'images/hitRing.png',
                    centerX: this.centerX,
                    centerY: this.centerY,
                    lifeTime: 15,
                    endScale: 2,
                    endAlpha: 0
                })
            );
            if (audioService.getSFXState()) {
                var hitSFX = new Audio('sfx/freesfx/beam_start.mp3');
                hitSFX.play();
            }
            this.destroy();
            
            if (collisionObj.name === "enemySpaceShip") {
                updateGameScore(200);
            }
        }
        
        updateObjOptions(userLaser, options);
        return userLaser;
    }
    
    var EnemyLaserObj = function(options) {
        var enemyLaser = LaserObj(options);
        
        enemyLaser.name = 'enemyLaser';
        enemyLaser.collisionObjNamesToDetect = ['userSpaceShip'];
        enemyLaser.weaponStrength = .05;
        enemyLaser.onCollision = function(collisionObj) {
            addSpriteObject(
                HitRing({
                    src: 'images/hitRing.png',
                    centerX: this.centerX,
                    centerY: this.centerY,
                    lifeTime: 15,
                    endScale: 2,
                    endAlpha: 0
                })
            );
            if (audioService.getSFXState()) {
                var hitSFX = new Audio('sfx/freesfx/beam_start.mp3');
                hitSFX.play();
            }
            this.destroy();
        }
        
        updateObjOptions(enemyLaser, options);
        return enemyLaser;
    }
    
    var Coin = function(options) {
        var coin = GameObj(options);
        coin.name = 'coin';
        coin.collisionObjNamesToDetect = ['userLaser', 'userSpaceship'];
        coin.collisionShape = 'circle';
        coin.onCollision = function(collisionObj) {
            if (collisionObj.name === 'userSpaceship') {
                addSpriteObject(
                    CoinStarObj({
                        src: 'images/coin_star.png',
                        centerX: this.centerX,
                        centerY: this.centerY,
                        angle: utilityService.randomInt(10) - 5,
                        lifeTime: 15,
                        endScale: 3,
                        endAlpha: 0
                    })
                );
                if (audioService.getSFXState()) {
                    var coinSFX = new Audio('sfx/freesfx/sound_design_effect_strange_ring_002.mp3');
                    coinSFX.play();
                }
                
            }
            if (collisionObj.name === 'userLaser') {
                addSpriteObject(
                    ExplosionObj({
                        src: 'images/explosion1.png', 
                        centerX: this.centerX,
                        centerY: this.centerY,
                        angle: utilityService.randomInt(10) - 5,
                        lifeTime: 15,
                        endScale: 2,
                        endAlpha: 0
                    })
                );
                if (audioService.getSFXState()) {
                    var explosionSFX = new Audio('sfx/freesfx/explosion_underwater_distant.mp3');
                    explosionSFX.play();
                }
            }

            this.destroy();          
        }
        
        updateObjOptions(coin, options);
        return coin;
    }
    
    var HealthPack = function(options) {
        var healthPack = GameObj(options);
        healthPack.name = 'healthPack';
        healthPack.collisionObjNamesToDetect = ['userLaser', 'userSpaceship'];
        healthPack.collisionShape = 'circle';
        healthPack.onCollision = function(collisionObj) {
            if (collisionObj.name === 'userSpaceship') {
                addSpriteObject(
                    CoinStarObj({
                        src: 'images/coin_star.png',
                        centerX: this.centerX,
                        centerY: this.centerY,
                        angle: utilityService.randomInt(10) - 5,
                        lifeTime: 15,
                        endScale: 3,
                        endAlpha: 0
                    })
                );
                if (audioService.getSFXState()) {
                    var healthSFX = new Audio('sfx/freesfx/terminal.mp3');
                    healthSFX.play();
                }
            }
            if (collisionObj.name === 'userLaser') {
                addSpriteObject(
                    ExplosionObj({
                        src: 'images/explosion1.png', 
                        centerX: this.centerX,
                        centerY: this.centerY,
                        angle: utilityService.randomInt(10) - 5,
                        lifeTime: 15,
                        endScale: 2,
                        endAlpha: 0
                    })
                );
                if (audioService.getSFXState()) {
                    var explosionSFX = new Audio('sfx/freesfx/explosion_underwater_distant.mp3');
                    explosionSFX.play();
                }
            }
            this.destroy();          
        }

        updateObjOptions(healthPack, options);
        return healthPack;
    }
    
    var AnimationObj = function(options) {
        animationObj = new SpriteObj(options);
        animationObj.lifeTime = 15;
        animationObj.startScale = animationObj.scale;
        animationObj.endScale = animationObj.scale;
        animationObj.startAlpha = animationObj.alpha;
        animationObj.endAlpha = animationObj.alpha;
        animationObj.lifeTimeSteps = animationObj.lifeTime;
        animationObj.stepAction = function() {
            if (this.lifeTime > 0) {
                this.lifeTime--;
                this.alpha -= (this.startAlpha - this.endAlpha)/this.lifeTimeSteps;
                this.scale += (this.endScale - this.startScale)/this.lifeTimeSteps;
            }
            if (this.lifeTime <= 0) {
                this.destroy();
            }
        }
        
        updateObjOptions(animationObj, options);
        return animationObj;
    }
    
    var ExplosionObj = function(options) {
        var explosion = AnimationObj(options);
        
        updateObjOptions(explosion, options);
        return explosion;
    }
    
    var SpaceshipBooster = function(options) {
        var spaceshipBooster = AnimationObj(options);
        
        updateObjOptions(spaceshipBooster, options);
        return spaceshipBooster;
    }
    
    var HitRing = function(options) {
        var hitRing = AnimationObj(options);
        
        updateObjOptions(hitRing, options);
        return hitRing;
    }
    
    var CoinStarObj = function(options) {
        var coinStar = AnimationObj(options);
        
        updateObjOptions(coinStar, options);
        return coinStar;
    }
    
    var SmokePuff = function(options) {
        var smokePuff = AnimationObj(options);

        updateObjOptions(smokePuff, options);
        return smokePuff;
    }
    
    var CollisionHalo = function(options) {
        var collisionHalo= AnimationObj(options);

        updateObjOptions(collisionHalo, options);
        return collisionHalo;
    }
    
    
    
    
    //--------SUPPORTING FUNCTIONS---------------
    
    
    function updateObjOptions(obj, options) {
        for (var prop in options) {
            if (prop === 'src') {
                obj.sprite.src = options[prop];
            } else {
                obj[prop] = options[prop];
            }
        }
        
        return obj;  
    }
    
    function calcBoundingBox(obj) {
        if (obj.collisionShape === 'rectangle' || obj.collisionShape === 'point') {
            var boundWidth1 = Math.abs(obj.diagonal*Math.cos(obj.angle + obj.diagonalAngle));
            var boundHeight1 = Math.abs(obj.diagonal*Math.sin(obj.angle + obj.diagonalAngle));
            var boundWidth2 = Math.abs(obj.diagonal*Math.cos(obj.angle - obj.diagonalAngle));
            var boundHeight2 = Math.abs(obj.diagonal*Math.sin(obj.angle - obj.diagonalAngle));
            var boundWidthMax = ((boundWidth1 >= boundWidth2) ? boundWidth1 : boundWidth2)*obj.boundWidthScale;
            var boundHeightMax = ((boundHeight1 >= boundHeight2) ? boundHeight1 : boundHeight2)*obj.boundHeightScale;
            var boundWidth = (boundWidthMax >= obj.width) ? boundWidthMax : obj.width;
            var boundHeight = (boundHeightMax >= obj.height) ? boundHeightMax : obj.height;
        }
        else if (obj.collisionShape === 'circle') {
            var boundWidth = obj.width*obj.boundWidthScale;
            var boundHeight = obj.height*obj.boundHeightScale;
        }
        return {boundWidth: boundWidth, boundHeight: boundHeight};
    }
    
    var addGameObject = function(obj) {
        obj.objId = gameObjID++;
        gameObjs.push(obj);
    }

    var addSpriteObject = function(obj) {
        obj.objId = gameObjID++;
        spriteObjs.push(obj);
    }
    
    this.updateObjData = function() {
        for (var i = 0; i < gameObjs.length; i++) {
            gameObjs[i].useUserInput();
            gameObjs[i].move();
            gameObjs[i].rotate(gameObjs[i].rotateSpeed);
            gameObjs[i].stepAction();
            gameObjs[i].boundaryCheck();
        }
        for (var i = 0; i < spriteObjs.length; i++) {
            spriteObjs[i].move();
            spriteObjs[i].rotate(spriteObjs[i].rotateSpeed);
            spriteObjs[i].stepAction();
        }
        flushDeadObjs();
        collisionCheck();
    }

    this.getObjData = function() {
        return gameObjs;
    }

    this.getSpriteData = function() {
        return spriteObjs;
    }

    function collisionCheck() {
        for (var i = 0; i < gameObjs.length; i++) {
            for (var k = i + 1; k < gameObjs.length; k++) {
                if(collisionService.checkCollision(gameObjs[i], gameObjs[k])) {
                    gameObjs[i].onCollision(gameObjs[k]);
                    gameObjs[k].onCollision(gameObjs[i]);
                }
            }
        }
    }

    function outputDebugInfo() {
    }

    function flushDeadObjs() {
        for (var i = 0; i < gameObjs.length; i++) {
            if (gameObjs[i].live === false) {
                gameObjs.splice(i, 1);
            }
        }
        for (var i = 0; i < spriteObjs.length; i++) {
            if (spriteObjs[i].live === false) {
                spriteObjs.splice(i, 1);
            }
        }

    }
    
    this.createUserSpaceship = function(){
    
        userSpaceship = UserShipObj({
            src: 'images/mySpaceship.png',
            centerX: screenW/2,
            centerY: screenH/2,
            speedMax: 10,
            speedMin: -10,
            rotateSpeedMax: 10,
            rotateSpeedMin: -10,
            boundWidthScale: .9,
            boundHeightScale: .9
        });
        addGameObject(userSpaceship);
        userCount++;
    }
    
    this.createCoin = function() {
        randXY = utilityService.randomXYRange(18,screenW-18,18,screenH-18);
        addGameObject(
            Coin({
                src: 'images/coin.png',
                centerX: randXY.x,
                centerY: randXY.y
            })
        );
    }
    
    this.createHealthPack = function() {
        randXY = utilityService.randomXYRange(18,screenW-18,18,screenH-18);
        addGameObject(
            HealthPack({
                src: 'images/health_pack.png',
                centerX: randXY.x,
                centerY: randXY.y
            })
        );
    }
    
    this.createEnemyShip = function() {
        var randAngle = utilityService.randomAngle();
        var side;
        var xPos;
        var yPos;
        if (randAngle < Math.PI/2) {
            if (Math.random() < .5) side = 'bottom';
            else side = 'left';
        } else if (randAngle < Math.PI && randAngle >= Math.PI/2) {
            if (Math.random() < .5) side = 'bottom';
            else side = 'right';
        } else if (randAngle < 3*Math.PI/2 && randAngle >= Math.PI) {
            if (Math.random() < .5) side = 'top';
            else side = 'right';
        } else {
            if (Math.random() < .5) side = 'top';
            else side = 'left';
        }

        if (side === 'bottom') {
            yPos = screenH + 72;
            xPos = Math.random()*screenW;
        } else if (side === 'left') {
            xPos = -72;
            yPos = Math.random()*screenH;
        } else if (side === 'right') {
            xPos = screenW + 72;
            yPos = Math.random()*screenH;
        } else {
            yPos = -72;
            xPos = Math.random()*screenW;
        }

        addGameObject(
            EnemyShipObj({
                src: 'images/enemySpaceship.png',
                centerX: xPos, 
                centerY: yPos, 
                angle: randAngle,
                speed: utilityService.randomInt(5),
                speedMax: 10, 
                speedMin: -10, 
                rotateSpeedMax: 10,
                rotateSpeedMin: -10,
                boundWidthScale: .9,
                boundHeightScale: .9
            })
        );
        enemyCount++;
    }
    
    this.getUserHealth = function() {
        if (userSpaceship.health < 0) {
            return 0;
        }
        return userSpaceship.health*100;
    }
    
    this.getUserScore = function() {
        return gameScore;
    }
    
    var updateGameScore = function(amount) {
        gameScore += amount;
        if (gameScore < 0) gameScore = 0;
    }
    
    var updateHealth = function(amount) {
        userSpaceship.health += amount;
        if (userSpaceship.health > 1) userSpaceship.health = 1;
    }
    
    this.addToGameScore = function(amount) {
        updateGameScore(amount);
    }
    
    this.getEnemyCount = function() {
        return enemyCount;
    }
    
    this.getUserCount = function() {
        return userCount;
    }
    
    this.finishGame = function() {
        userCount = 0;
    }
});
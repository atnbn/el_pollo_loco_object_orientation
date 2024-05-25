class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    bottleBar = new BottleBar();
    coinBar = new CoinBar();
    endbossBar = new EndbossEnergyBar();
    throwableObjects = [];
    coins = new Coin();
    bottle = new Bottle();
    gameover = new GameOver();
    winscreen = new WinScreen();
    lose = false;
    win = false;
    music_over = false;
    bottleThrow = false;
    bottlepause = false;

    // AUDIO 

    bottle_sound = new Audio('audio/bottle-collect.mp3');
    dead_sound = new Audio('audio/464623_7787874-lq.mp3');
    coin_sound = new Audio('audio/coin.mp3');
    glass_sound = new Audio('audio/glass.mp3');
    throw_sound = new Audio('audio/throw.mp3');
    win_sound = new Audio('audio/win.mp3');
    deadchicken_sound = new Audio('audio/killchicken.mp3');
    hurt_sound = new Audio('audio/hurt.mp3');
    gameover_sound = new Audio('audio/gameover.mp3');
    // AUDIO
    muteSound() {
        this.bottle_sound.muted = true;
        this.dead_sound.muted = true;
        this.coin_sound.muted = true;
        this.glass_sound.muted = true;
        this.throw_sound.muted = true;
        this.win_sound.muted = true;
        this.deadchicken_sound.muted = true;
        this.hurt_sound.muted = true;
        this.gameover_sound.muted = true;
        this.character.jump_sound.muted = true;
        this.character.walking_sound.muted = true;
        document.getElementById('infoSound').style.display = 'block';
        document.getElementById('infoSound').innerHTML = 'Sound: Off';
        setTimeout(() => {
            document.getElementById('infoSound').style.display = 'none';
        }, 1000);


    }

    playSound() {
        this.throw_sound.muted = false;
        this.bottle_sound.muted = false;
        this.coin_sound.muted = false;
        this.glass_sound.muted = false;
        this.deadchicken_sound.muted = false;
        this.hurt_sound.muted = false;
        this.win_sound.muted = false;
        this.gameover_sound.muted = false;
        this.character.jump_sound.muted = false;
        this.character.walking_sound.muted = false;
        document.getElementById('infoSound').style.display = 'block';
        document.getElementById('infoSound').innerHTML = 'Sound: ON';
        setTimeout(() => {
            document.getElementById('infoSound').style.display = 'none';
        }, 1000);

    }

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    restartGame() {
        window.location.reload();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {

            this.checkThrowObjects();
            this.checkCollisionswithBottle();
            this.checkCollisionswithCoins();
            this.checkGameOver();
            this.checkCharacterEndbossCollision(this.level.endboss);
            this.level.enemies.forEach((e, index) => {
                this.checkEnemyCharacterCollision(e, index, this.character)
            });
            this.throwableObjects.forEach((bubble) => {
                this.checkBottleCollisionwithEnemy(bubble, this.level.enemies[6]);

            });
        }, 100);
    }

    checkGameOver() {
        if (this.character.isDead() == true && this.bottleBar.bottleAmount > 0) {
            this.lose = true;
            console.log('lose')
        }
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.bottlepause == false && this.bottleBar.bottleAmount > 0) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 50);
            this.throwableObjects.push(bottle)
            this.throw_sound.play();
            this.bottleBar.bottleAmount--;
            this.bottleBar.setPercentage(this.bottleBar.bottleAmount);
            this.bottlepause = true;
            setTimeout(() => {
                this.bottlepause = false
            }, 1000);
        }
    }

    checkCollisionswithBottle() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isCollidingObjects(bottle)) {
                this.level.bottles.splice(index, 1)
                this.bottleBar.bottleAmount++;
                this.bottle_sound.play();
                this.bottleBar.setPercentage(this.bottleBar.bottleAmount);
            }
        });
    }

    checkCollisionswithCoins() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isCollidingObjects(coin, index) && this.character.isAboveGround()) {
                this.level.coins.splice(index, 1);
                this.coinBar.coinAmount++;
                this.coinBar.setPercentage(this.coinBar.coinAmount);
                this.coin_sound.play();
            }
        })
    }

    checkBottleCollisionwithEnemy() {
        this.throwableObjects.forEach((bubble) => {
            this.level.endboss.forEach((endboss) => {
                if (bubble.isCollidingObjects(endboss)) {
                    endboss.hit(bubble);
                    this.endbossBar.setPercentage(endboss.energy);
                    bubble.splash = true;
                    this.glass_sound.play();

                    setTimeout(() => {
                        let index = this.throwableObjects.indexOf(bubble)
                        this.throwableObjects.splice(index, 1)
                    }, 200);
                    if (endboss.energy == 0) {
                        this.win = true;
                    }
                }
            })
        })
    }

    deleteObject(object, collection) {
        setTimeout(() => {
            let index = collection.indexOf(object)
            this.throwableObjects.splice(index, 1)
        }, 200);
    }





    checkCharacterEndbossCollision() {
        this.level.endboss.forEach((endboss) => {
            if (endboss.isCollidingObjects(this.character)) {
                this.character.hit(endboss);
                endboss.jumpAttack();
                this.hurt_sound.play();
                this.statusBar.setPercentage(this.character.energy);
            }
        })
    }

    checkEnemyCharacterCollision(enemy, index, char) {
        if (this.canCollide(enemy, char) && char.isColliding(enemy)) {
            if (char.isStamping(enemy, index)) {
                enemy.energy = 0;
                this.deadchicken_sound.play();
                setTimeout(() => {
                    const indexEnemy = this.level.enemies.indexOf(enemy);
                    this.level.enemies.splice(indexEnemy, 1);
                }, 780);
            } else {
                char.hit(enemy);
                this.hurt_sound.play();
                this.statusBar.setPercentage(char.energy);
            }
        }
    }
    /**
     * 
     * @param {Enemy} enemy 
     * @param {Character} char 
     * @returns {boolean}
     */
    canCollide(enemy, char) {
        return !(char.isDead() || enemy.isDead() || char.isHurt())
    }

    draw() {    // hier müssen die Objecte eingefügt werden um gesehen zu werden
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0); // Back
        // -------------- Space for fixed objects
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.statusBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.coinBar);
        // Endboss Healthbar 
        if (this.character.x > 3800) {
            this.addToMap(this.endbossBar);
        }
        this.ctx.translate(this.camera_x, 0);// Forwards
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.endboss);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        // Draw() wird immer wieder aufgerufen
        let self = this;

        requestAnimationFrame(function () {
            self.draw();
        });

        this.checkWin();
        this.checkLose();


    }
    checkLose() {                // check why this is not working
        if (this.lose) {
            this.addToMap(this.gameover);
            this.gameover_sound.play();
            setTimeout(() => {
                window.location.href = "";
            }, 1000)
        }
    }

    checkWin() {
        if (this.win) {
            this.addToMap(this.winscreen);
            this.win_sound.play();
            setTimeout(() => {
                window.location.href = "";
            }, 2500)
        }
    }
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        // mo.drawFrame(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore()
    }


} 
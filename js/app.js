var Enemy,
    enemy,
    Player,
    player,
    allEnemies = [];

Enemy = function(enemyX, enemyY) {
    // Image/sprite for enemies, uses a helper provided in resources.js
    this.sprite = "images/enemy-bug.png";
    this.x = enemyX;
    this.y = enemyY;
    this.isMoving = true;
    this.won = false;
    // Sets initial speed.
    this.speed = Math.floor((Math.random() * 400) + 50);
    // this.direction = "right";
};

// Updates enemy's position using dt param, a time delta between ticks.
Enemy.prototype.update = function(dt) {
    if (this.x < 550) {
        this.x += this.speed * dt;
    } else {
        this.x = -(Math.floor(Math.random() * 50) + 30);
    }
    // Multiply movement by dt ensures game runs at the same speed for
    // all computers.
    if (player.x >= this.x - 40 && player.x <= this.x + 40) {
        if (player.y >= this.y - 20 && player.y <= this.y + 20) {
            player.reset(this.player);
        }
    }
};

// Draws enemy on screen.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class.
Player = function() {
    this.sprite = "images/char-boy.png";
    this.x = 200;
    this.y = 380;
    this.width = 101;
    this.height = 171;
    this.isMoving = false;
    this.direction = "up";
    this.won = false;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

// this didn't work, it doesn't erase easily
Player.prototype.win = function() {
    ctx.font = "46px Orbitron";
    ctx.fillText("You Win!!!", 140, 40);
};

Player.prototype.reset = function() {
    this.x = 200;
    this.y = 380;
    this.won = false;
    this.isMoving = false;
};

Player.prototype.update = function() {
    var futureX = this.x,
        futureY = this.y;

    if (this.isMoving) {
        switch (this.direction) {
            case "up":
                if (futureY === 60 && this.won === false) {
                    futureY = futureY - 59;
                } else {
                    futureY = futureY - 80;
                }
                break;
            case "right":
                futureX = futureX + 100;
                break;
            case "down":
                futureY = futureY + 80;
                break;
            case "left":
                futureX = futureX - 100;
                break;
        }
        if (futureY > 402 || futureY < 0) {
            this.isMoving = true;
            return false;
        } else if (futureX > 400 || futureX < 0) {
            this.isMoving = false;
            return false;
        } else if (futureY === 1) {
            this.y = futureY;
            this.won = true;
            // this.win();

            // Let player reach water then reset after 1 second delay.
            setTimeout(function() {
                this.player.reset();
            }, 1000);
            // TODO: something for winning?
            console.log("you win");
        } else {
            this.x = futureX;
            this.y = futureY;
            this.isMoving = false;
        }
    }
};

Player.prototype.handleInput = function(keyDirection) {
    this.isMoving = true;
    this.direction = keyDirection;
};

for (var i = 0; i < 4; i++) {
    var tempY = [60, 150, 220, 150];
    allEnemies.push(new Enemy(-2, tempY[i]));
}

// TODOLAST: make different players based on dif chars
// Place the player object in a variable called player
player = new Player();

// This listens for key presses and sends the keys to player.handleInput
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
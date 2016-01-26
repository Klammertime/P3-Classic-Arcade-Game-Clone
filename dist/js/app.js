var Enemy,
    enemy,
    Player,
    player,
    allEnemies = [],
    princess,
    catGirl,
    hornGirl,
    pinkGirl,
    charBoy,
    board,
    allGems = [],
    Gem;

Enemy = function(enemyX, enemyY) {
    // Image/sprite for enemies, uses a helper provided in resources.js
    this.sprite = "images/enemy-bug.png";
    this.x = enemyX;
    this.y = enemyY;
    this.isMoving = true;
    this.won = false;
    // Sets initial speed.
    this.speed = Math.floor((Math.random() * 400) + 50);
};

// Updates enemy's position using dt param, a time delta between ticks.
Enemy.prototype.update = function(dt) {
    if (this.x < 550) {
        this.x += this.speed * dt;
    } else {
        this.x = -(Math.floor(Math.random() * 50) + 30);
    }

    // Multiply movement by dt ensures game runs same speed for all computers.
    if (player.x >= this.x - 40 && player.x <= this.x + 40) {
        if (player.y >= this.y - 20 && player.y <= this.y + 20) {
            // Player lost, got hit by enemy.
            player.reset(this.player);
            player.updateScore(-20);
            player.updateLives(-1);
        }
    }
};

// Draws enemy on screen.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class.
Player = function(playerX, playerY, playerImgID) {
    this.sprite = "images/" + playerImgID + ".png";
    this.x = playerX;
    this.y = playerY;
    this.width = 101;
    this.height = 171;
    this.isMoving = false;
    this.direction = "up";
    this.won = false;
    this.score = 0;
    this.lives = 5;
};

player = new Player(200, 380, "char-pink-girl");
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

Player.prototype.reset = function() {
    this.x = 200;
    this.y = 380;
    this.won = false;
    this.isMoving = false;
    resetGem();
};

Player.prototype.updateLives = function(life) {
    var parentDiv = document.getElementById("lives");
    var span2 = document.getElementById("hearts");
    var span1 = document.createElement("span");

    span1.id = "hearts";
    this.lives += life;
    for (i = 0; i < this.lives; i++) {
        var img = new Image(); // HTML5 Constructor
        img.src = 'images/Heart.png';
        img.id = 'life'
        img.alt = 'Lives';
        span1.appendChild(img);
    }
    parentDiv.replaceChild(span1, span2);
};

player.updateLives(0);
Player.prototype.updateScore = function(amount) {
    this.score += amount;
    var el = document.getElementById("score");
    el.textContent = "Your score: " + this.score;
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
            this.updateScore(20);
            // Let player reach water then reset after 1 second delay.
            setTimeout(function() {
                this.player.reset();
            }, 1000);
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

Gem = function(gemX, gemY, gemColor) {
    this.sprite = "images/Gem-" + gemColor + ".png";
    this.x = gemX;
    this.y = gemY;
};

for (var j = 0; j < 3; j++) {
    var tempY = [60, 150, 220, 150];
    var tempX = [0, 100, 200, 300];
    var colors = ["Blue", "Green", "Orange", "Blue"];
    var k = Math.round(Math.random() * 3);
    allGems.push(new Gem(tempX[k], tempY[k], colors[k]));
}

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Gem.prototype.update = function() {
    if (player.x >= this.x - 20 && player.x <= this.x + 20) {
        if (player.y >= this.y - 10 && player.y <= this.y + 10) {
            player.score += 2;
            for (i = 0; i < 3; i++) {
                if (this.x === allGems[i].x) {
                    allGems.splice(i, 1);
                    return false;
                }
            }
        }
    }
};

function resetGem() {
    allGems = [];
    for (var j = 0; j < 3; j++) {
        var tempY = [60, 150, 220, 150];
        var tempX = [0, 100, 200, 300];
        var colors = ["Blue", "Green", "Orange", "Blue"];
        var k = Math.round(Math.random() * 3);
        allGems.push(new Gem(tempX[k], tempY[k], colors[k]));
    }
}

function handleDragStart(event) {
    sourceID = this.id;
    player.sprite = "images/" + sourceID + ".png";
    sourceClass = this.id;
    document.body.className = sourceClass;
}

function handleDragDrop(event) {
    if (event.preventDefault) event.preventDefault();
}

// neccessary to make drop work, weird but necessary.
function handleDragOver(event) {
    if (event.preventDefault) event.preventDefault();
    return false;
}

princess = document.getElementById("char-princess-girl");
catGirl = document.getElementById("char-cat-girl");
hornGirl = document.getElementById("char-horn-girl");
pinkGirl = document.getElementById("char-pink-girl");
charBoy = document.getElementById("char-boy");
gameZone = document.getElementById("game-zone");

princess.addEventListener("dragstart", handleDragStart, false);
catGirl.addEventListener("dragstart", handleDragStart, false);
hornGirl.addEventListener("dragstart", handleDragStart, false);
pinkGirl.addEventListener("dragstart", handleDragStart, false);
charBoy.addEventListener("dragstart", handleDragStart, false);
gameZone.addEventListener("dragover", handleDragOver, false);
gameZone.addEventListener("drop", handleDragDrop, false);
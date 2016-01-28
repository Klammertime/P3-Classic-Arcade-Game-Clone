/* MVC (from MDN)
 * MODEL: Defines data structure e.g. updates application state to
 * reflect added item. (Updates V. e.g. list updated to show new item)
 * Here: Enemy and Player objects
 *
 * VIEW: Defines display (UI) e.g. user clicks 'add to cart'.
 * (Sends input from user to C)
 * Here: Canvas board, player, enemies, gems, score, bg, hearts,
 * lose or win notification
 *
 * CONTROLLER: Contains control logic e.g. receives update from
 * view, then notifies model to 'add item'. (Manipulates M, sometimes
 * updates V directly)
 * Here: User clicks and moves player to hit gem, increase score
 * and update M. Update V to remove gem. User clicks hits enemy.
 * Update M with lose = true?, reduce score, reduce lives. Does C or
 * M update V with that new info???
 */

var Enemy,
    Player,
    player,
    allEnemies = [],
    allGems = [],
    Gem;

/*
 * Enemy class section:
 *
 */

Enemy = function(enemyX, enemyY) {
    // Sprite for enemies uses helper provided in resources.js
    this.sprite = "images/enemy-bug.png";
    this.x = enemyX;
    this.y = enemyY;
    this.isMoving = true; // TODO: Are you using this anywhere?
    this.speed = Math.floor((Math.random() * 400) + 50); // Sets initial speed.
};

// Updates enemy's position using dt param, a time delta between ticks.
Enemy.prototype.update = function(dt) {
    if (this.x < 550) {
        this.x += this.speed * dt;
    } else {
        this.x = -(Math.floor(Math.random() * 50) + 30);
    }
    this.checkCollision(player.x, player.y, this.x, this.y);
};

Enemy.prototype.checkCollision = function(playerX, playerY, enemyX, enemyY) {
    // if within 40 x and 20 y of each other, player hit
    if (playerX >= enemyX - 40 && playerX <= enemyX + 40) {
        if (playerY >= enemyY - 20 && playerY <= enemyY + 20) {
            // if player has only 1 life left
            player.changeLives(-1);
        }
    }
};

// Draws enemy on screen.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

for (var i = 0; i < 4; i++) {
    var tempY = [60, 150, 220, 150];
    allEnemies.push(new Enemy(-2, tempY[i]));
}

/*
 * Player class section:
 *
 */
Player = function(playerX, playerY, playerImgID) {
    this.sprite = "images/" + playerImgID + ".png";
    this.x = playerX;
    this.y = playerY;
    this.width = 101;
    this.height = 171;
    this.isMoving = false;
    this.direction = "up";
    this.score = 0;
    this.lives = 5;
    this.status = "playing"; // "lostGame", "won", "died"
};

player = new Player(200, 380, "char-pink-girl");

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

Player.prototype.reset = function() {
    this.x = 200;
    this.y = 380;
    this.isMoving = false;

    setTimeout(function() {
        this.player.status = "playing";
        this.player.displayStatus(this.player.status);
    }, 1000);
};

Player.prototype.displayLives = function(totalLives) {
    var parentDiv = document.getElementById("lives");
    var span2 = document.getElementById("hearts");
    var span1 = document.createElement("span");
    span1.id = "hearts";
    for (i = 0; i < totalLives; i++) {
        var img = new Image(); // HTML5 Constructor
        img.src = 'images/Heart.png';
        img.id = 'life';
        img.alt = 'Lives';
        span1.appendChild(img);
    }
    parentDiv.replaceChild(span1, span2);
};

Player.prototype.changeLives = function(life) {
    this.lives += life;
    this.displayLives(this.lives);

    if (life > 0) {
        this.status = "won";
        pointsNow = this.changeScore(20);

    } else if (this.lives === 0) {
        this.lostGame();
        return false;

    } else {
        this.status = "died";
        pointsNow = this.changeScore(-20);
    }
    this.displayStatus(this.status);
    this.displayScore(pointsNow);
    this.reset();
    resetGems();
};

Player.prototype.lostGame = function() {
    this.status = "lost game";
    this.displayStatus(this.status);
    this.lives = 5;
    this.displayLives(this.lives);
    this.reset();
    resetGems();
};

// all V
// need them to go back to blank though after 1 second?
Player.prototype.displayStatus = function(status) {
    var msg,
        parentDiv,
        span1,
        span2;

    switch (status) {
        case "playing":
            msg = "Keep trying.";
            break;
        case "lost game":
            msg = "You lost all of your lives! That's okay, we'll give you 5 new ones.";
            break;
        case "won":
            msg = "You won!";
            break;
        case "died":
            msg = "You died!";
            break;
    }
    parentDiv = document.getElementById("displayStatus");
    span2 = document.getElementById("wl-update");
    span1 = document.createElement("span");
    span1.id = "wl-update";
    span1.innerHTML = msg;
    parentDiv.replaceChild(span1, span2);
};
player.displayStatus(player.status);

Player.prototype.changeScore = function(points) {
    this.score += points;
    return this.score;
};

Player.prototype.displayScore = function(totalPoints) {
    var scoreBoard = document.getElementById("score");
    scoreBoard.textContent = "Your score: " + totalPoints;
};

// Assignment wants this called update
Player.prototype.update = function() {
    var futureX = this.x,
        futureY = this.y,
        pointsNow;

    if (this.isMoving) {
        switch (this.direction) {
            case "up":
                if (futureY === 60 && this.status !== "won") {
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
            // Player reached water and has won!
            this.y = futureY;
            this.changeLives(1);
        } else {
            this.x = futureX;
            this.y = futureY;
            this.isMoving = false;
        }
    }
};

player.displayLives(player.lives);
player.displayStatus(player.status);

Player.prototype.handleInput = function(keyDirection) {
    this.isMoving = true;
    this.direction = keyDirection;
};

/*
 * Gem class section:
 *
 */

Gem = function(gemX, gemY, gemColor) {
    this.sprite = "images/Gem-" + gemColor + ".png";
    this.x = gemX;
    this.y = gemY;
};

resetGems();

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

function resetGems() {
    allGems = [];
    for (var j = 0; j < 3; j++) {
        var tempY = [60, 150, 220, 150];
        var tempX = [0, 100, 200, 300];
        var colors = ["Blue", "Green", "Orange", "Blue"];
        var k = Math.round(Math.random() * 3);
        allGems.push(new Gem(tempX[k], tempY[k], colors[k]));
    }
}

/*
 * User event section:
 *
 */

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


function handleDragDrop(event) {
    if (event.preventDefault) event.preventDefault();
}

// neccessary to make drop work, weird but necessary.
function handleDragOver(event) {
    if (event.preventDefault) event.preventDefault();
    return false;
}

/* Set up event delegation for character list. Made class w/ same name as ID
that changes body background color to match player. This uses Drag & Drop HTML5 API */
function handleDragStart(event) {
    player.sprite = "images/" + event.target.id + ".png"; // Grab character ID from event.target
    document.body.className = event.target.id; // set body class to class w/ same name as ID
}

var characters = document.getElementById("characters");
characters.addEventListener("dragstart", function(event) {
    handleDragStart(event);
}, false);

gameZone = document.getElementById("game-zone");
gameZone.addEventListener("dragover", handleDragOver, false);
gameZone.addEventListener("drop", handleDragDrop, false);
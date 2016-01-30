var allEnemies = [],
    allGems = [],
    Enemy,
    Player,
    player,
    Gem,
    Entity;


Entity = function() {

};



/**
 * @description Represents the enemy bugs that run across screen
 * @constructor
 * @param {number} enemyX - Enemy's x coordinate on canvas
 * @param {number} enemyY - Enemy's y coordinate on canvas
 * Enemy declared at top of app.js with all global variables
 */

Enemy = function(enemyX, enemyY) {
    // Sprite for enemies uses helper provided in resources.js
    this.sprite = 'images/enemy-bug.png';
    this.x = enemyX;
    this.y = enemyY;
    this.speed = Math.floor((Math.random() * 400) + 50); // Sets random initial speed
};

/**
 * @description Updates enemy's position using dt param, a time delta between ticks
 * @param {number} dt - Time delta between ticks defined in engine.js: var now = Date.now(),
 * dt = (now - lastTime) / 1000.0; Often used in online games.
 * As long as enemy's x coordinate is still on the canvas, or less than 550, keep updating
 * the speed. Otherwise, if it's reached the end of canvas, reset its x to a negative random value
 * to start on left of canvas. Its random so that each enemy has a different starting position.
 */

//
Enemy.prototype.update = function(dt) {
    // If the x-coord is not more than canvas width, enenmy can keep moving forward, else randomly reset x-coord.
    this.x = this.x < 550 ? this.x + this.speed * dt : -(Math.floor(Math.random() * 50) + 30);
    this.checkCollision(player.x, player.y, this.x, this.y);
};

/**
 * @description Check if enemy collided with player
 * @param {number} playerX - Player x-coordinate
 * @param {number} playerY - Player y-coordinate
 * @param {number} enemyX - Enemy x-coordinate
 * @param {number} enemyX - Enemy y-coordinate
 * Checks to see if player and enemy are within 40px of each other on x-axis. This asks, does player
 * not only have an x-coord that is exactly the x-coord of the enemy or greater, but because this could cause
 * problems when the player is to the right of ANY enemy, we must also check to see if player's x-coord
 * is less than or equal to the enemy's x-coord when you add 40, assuring its within 40 of enemy.
 * Same logic is applied to y-coordinates, but only 20 is needed since enemies and player are placed on same
 * y-coord when instantiated.
 */

Enemy.prototype.checkCollision = function(playerX, playerY, enemyX, enemyY) {
    // if within 40 x and 20 y of each other, player hit
    if ((playerX >= enemyX - 40 && playerX <= enemyX + 40) &&
        (playerY >= enemyY - 20 && playerY <= enemyY + 20)) {
        player.changeLives(-1);
    }
};

// Draws, or renders, each enemy on the canvas using a get method defined in resources.js
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

createAllEnemies();

// Creates array of enemies used in app.js in updateEntities() to update enemies, player, and gems
function createAllEnemies() {
    var allEnemyY = [60, 150, 220, 150];
    allEnemyY.forEach(function(val) {
        allEnemies.push(new Enemy(-2, val));
    });
}

/**
 * @description Represents the player
 * @constructor
 * @param {number} playerX - Player's x coordinate on canvas
 * @param {number} playerY - Player's y coordinate on canvas
 * @param {string} playerImgID - Player's image ID which is also the name of
 * the image. There are 5 possible images for a player, using Drag & Drop HTML5 API
 * when an image is dropped onto the canvas, it grabs the image ID and that is used
 * here. Player declared at top of app.js with all global variables
 */

Player = function(playerX, playerY, playerImgID) {
    this.sprite = 'images/' + playerImgID + '.png';
    this.x = playerX;
    this.y = playerY;
    this.width = 101;
    this.height = 171;
    this.isMoving = false;
    this.direction = 'up';
    this.score = 0;
    this.lives = 5;
    this.status = 'playing'; // Possible: "lostGame", "won", "died"
};

/* Player variable declared at top of app.js with all global variables
Player on board initially is image 'char-pink-girl.png' */
player = new Player(200, 380, 'char-pink-girl');

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};
Player.prototype.delayThisStatus = function() {
    window.setTimeout(this.displayStatus.bind(this), 1000);
};
// When player dies or wins, reset to original x & y location.
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 380;
    this.isMoving = false;
    this.status = 'playing';
    this.delayThisStatus();
    // var delayThisStatus = (function(){
    //     this.status = 'playing'; // Default status is 'playing'
    //     this.displayStatus(this.status);
    // }).bind(player);

    // setTimeout(delayThisStatus, 1000);
};

/**
 * @description Display function to display player's remaining lives as hearts at top of window
 * @param {number} totalLives - 5 minus 1 (when die) or plus 1 (when win)
 * @param {number} playerY - Player y-coordinate
 * Creates a span with same ID as span on page and appends each newly created image with Heart.png src.
 * Then it replaces the span on the page now, span2, with this newly created one with updated life or heart count.
 */

Player.prototype.displayLives = function() {
    var parentDiv = document.getElementById('lives');
    var span2 = document.getElementById('hearts');
    var span1 = document.createElement('span');
    span1.id = 'hearts';
    for (var i = 0; i < this.lives; i++) {
        var img = new Image(); // HTML5 Constructor
        img.src = 'images/Heart.png';
        img.id = 'life';
        img.alt = 'Lives';
        span1.appendChild(img);
    }
    parentDiv.replaceChild(span1, span2);
};

/**
 * @description Change life count based on winning (reaching water), dying without any remaining lives, or dying with
 * remaining lives.
 * @param {number} life - Can be negative or positive
 * First, update player's lives, display it. If life is positive, change status to won, increase score 20.
 * If they have 0 lives, call lostGame and exit out. Otherwise they just died but have lives left, decrease score 20.
 * Then show their new status message, points, reset player back to start and place new gems on the board.
 */

Player.prototype.changeLives = function(life) {
    this.lives += life;
    this.displayLives();

    if (life > 0) {
        this.status = 'won';
        this.changeScore(40);
    } else if (this.lives === 0) {
        this.lostGame();
        return false;
    } else {
        this.status = 'died';
        this.changeScore(-20);
    }

    this.displayStatus();
    this.reset();
    resetGems();
};

Player.prototype.lostGame = function() {
    this.status = 'lost game';
    this.displayStatus();
    this.changeScore(-50);
    this.lives = 5; // When lose game, player is reset with 5 new lives.
    this.displayLives();
    this.reset(); // Player's x & y are set to initial value
    resetGems(); // Place new gems on board
};

/**
 * @description Based on whether player is playing, loses game, wins, or loses game and all lives, a different status
 * message appears in top right corner of window.
 * @param {string} status - 4 possible
 * Creates a span with same ID as span on page, inserts message into it using .innerHTML DOM method.
 * Then replaces the span on the page now, span2, with this newly created one with updated status message.
 */

Player.prototype.displayStatus = function() {
    var msg,
        parentDiv,
        span1,
        span2;

    switch (this.status) {
        case 'playing':
            msg = 'Keep going!';
            break;
        case 'lost game':
            msg = 'You lost. That\'s okay.';
            break;
        case 'won':
            msg = 'You won!';
            break;
        case 'died':
            msg = 'You died!';
            break;
        case 'gem':
            msg = '20 points!';
            break;
    }
    parentDiv = document.getElementById('displayStatus');
    span2 = document.getElementById('wl-update');
    span1 = document.createElement('span');
    span1.id = 'wl-update';
    span1.innerHTML = msg;
    parentDiv.replaceChild(span1, span2);
};

player.displayStatus();

// Changes player's score and calls displayScore with new score.
Player.prototype.changeScore = function(points) {
    this.score += points;
    this.displayScore();
};

Player.prototype.displayScore = function() {
    var scoreBoard = document.getElementById('score');
    scoreBoard.textContent = 'Your score: ' + this.score;
};

/**
 * @description Moves player when user presses arrow key. Player has a direction property
 * based on keyDirection, direction = keyDirection;
 * Based on this.direction, execute that code block to set futureY or futureX. In case it's up and they haven't just won
 * I wanted to decrease the amount they could move so they wouldn't move off the screen when
 * they won, instead player sits on edge of water. Otherwise, they move up 80 like normal.
 */

Player.prototype.update = function() {
    // Store current location in future location variable
    var futureX = this.x,
        futureY = this.y;
    // Here we set futureY or futureX value
    if (this.isMoving) {
        switch (this.direction) {
            case 'up':
                futureY -= futureY === 60 && this.status !== 'won' ? 59 : 80;
                break;
            case 'right':
                futureX += 100;
                break;
            case 'down':
                futureY += 80;
                break;
            case 'left':
                futureX -= 100;
                break;
        }
        // Now update player
        if (futureY > 402 || futureY < 0) { // Will fall off top of canvas, so don't move.
            this.isMoving = false;
            return false;
        } else if (futureX > 400 || futureX < 0) { // Will fall off sides of canvas, so don't move.
            this.isMoving = false;
            return false;
        } else if (futureY === 1) { // Player reached water and has won!
            this.y = futureY;
            this.changeLives(1); // They earn an extra life and changeLives takes care of rest.
        } else { // Otherwise, they can be moved, so update location.
            this.x = futureX;
            this.y = futureY;
            this.isMoving = false;
        }
    }
};

player.displayLives();

player.displayStatus();

Player.prototype.handleInput = function(keyDirection) {
    this.isMoving = true;
    this.direction = keyDirection;
};

/**
 * @description Represents a gem
 * @constructor
 * @param {number} gemX - Gem's x coordinate on canvas
 * @param {number} gemY - Gem's x coordinate on canvas
 * @param {string} gemColor - Gem's image file name based on color
 * Gem declared at top of app.js with all global variables
 */

Gem = function(gemX, gemY, gemColor) {
    this.sprite = 'images/' + gemColor + '.png';
    this.x = gemX;
    this.y = gemY;
};

// Sets gems on canvas for first time.
resetGems();

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// If player reaches a gem, increase score by 20, find the gem in the allGems array and remove it
Gem.prototype.update = function() {
    if ((player.x >= this.x - 20 && player.x <= this.x + 20) &&
        (player.y === this.y)) {

        for (var i = 0; i < 3; i++) {
            if (this.y === allGems[i].y) {
                allGems.splice(i, 1);
                player.changeScore(20);
                player.status = 'gem';
                player.displayStatus();
                player.status ='playing';
                return setTimeout(function() {
                    player.displayStatus();
                }, 1000);
            }
        }
    }
};

// Randomly set x & y of gems and colors.
function resetGems() {
    allGems = [];
    for (var i = 0; i < 3; i++) {
        var tempX = [0, 100, 200, 300, 400];
        var tempY = [60, 140, 220];
        var colors = ['Gem-Blue', 'Gem-Green', 'Gem-Orange'];
        var j = Math.floor(Math.random() * 5); // Wanted gems apart so different indexes for x & y
        var k = Math.floor(Math.random() * 3);
        allGems.push(new Gem(tempX[j], tempY[k], colors[k]));
    }
}

/**
 * @description This Event Listener is fired when a key is released.
 * @param {string} keyup - The keyup event is fired when a key is released.
 * @param {Object} listener: anonymouse function - Passes event object when key pressed and released.
 * The allowed keys are place into an array. 37, 38, 39, 40 correspond to the event.keycode DOM element
 * when you click on the arrow keys. MDN: "KeyboardEvent.keyCode Returns a Number representing a system and
 * implementation dependent numerical code identifying the unmodified value of the pressed key." handleInput
 * is invoked passing the string representation of the key as an argument.
 */

// This listens for key presses and sends the keys to player.handleInput
document.addEventListener('keyup', function(event) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[event.keyCode]); // Passes string representation of key.
});

/**
 * @description Function used in dragstart event listener to choose character image.
 * @param {Object} event - The event object gets passed when user starts dragging a character image, the event
 *                         listener was set up to invoke handleDragStart with the event object as an argument.
 * This uses Drag & Drop HTML5 API which has good support. Made CSS class w/ same name as ID
 * that changes body background color to match player.
 */

Player.prototype.handleDragStart = function(event) {
    this.sprite = 'images/' + event.target.id + '.png'; // Grab character ID from event.target
    document.body.className = event.target.id; // Set body class to class w/ same name as ID
};

Player.prototype.handleDragDrop = function(event) {
    if (event.preventDefault) event.preventDefault();
};

// Neccessary to make drop work, weird but necessary.
Player.prototype.handleDragOver = function(event) {
    if (event.preventDefault) event.preventDefault();
    return false;
}

/* Using characters element allows for event delegation and one event listeners
instead of 5. Characters declared at top of app.js with all global variables.
Event listener needs to be on dragstart for drag and drop to work. */
document.getElementById('characters').addEventListener('dragstart', function(event) {
    player.handleDragStart(event);
}, false);


document.getElementById('game-zone').addEventListener('dragover', player.handleDragOver, false);
document.getElementById('game-zone').addEventListener('drop', player.handleDragDrop, false);
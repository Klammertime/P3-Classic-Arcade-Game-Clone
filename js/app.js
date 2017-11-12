
var TILE_WIDTH = 100,
    TILE_HEIGHT = 80,
    allEnemies = [],
    allGems = [],
    Enemy, // Typically bad practice to have upper and lowercase of same var name
    enemy,
    Player,
    player,
    Gem,
    gem,
    Entity;

/**
 * Superclass representing the entities on the screen: Enemy, Player and Gem
 * @constructor
 * @param {number} x - Entity's x coordinate on canvas
 * @param {number} y - Entity's y coordinate on canvas
 * @param {string} sprite - Entity's sprite used to render entity on canvas
 */

Entity = function(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/' + sprite + '.png';
    this.width = 101;
    this.height = 171;
};

// Draws, or renders, each entity on the canvas using a get method defined in resources.js
Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

/**
 * Represents the enemy bugs that run across screen
 * @constructor
 * @param {number} enemyX - Enemy's x coordinate on canvas
 * @param {number} enemyY - Enemy's y coordinate on canvas
 * Enemy declared at top of app.js with all global variables.
 * Entity.call calls the Entity function passing in the Enemy being constructed
 * so any Entity-related initialization can occur.
 */

Enemy = function(x, y, sprite) {
    // This makes sure Entity constructor is called from the Enemy constructor
    Entity.call(this, x, y, sprite);
    this.speed = Math.floor((Math.random() * 400) + 50); // Sets random initial speed
};

/**
 * Setting up prototype chain so that Enemy inherits from the Entity prototype.
 * In order to do that, you use Object.create and point it to prototype you'd
 * like it to inherit from.
 */

Enemy.prototype = Object.create(Entity.prototype);

/**
 * You want the constructor to still be the Enemy constructor even though
 * Enemy's prototype inherits from Entity's prototype, so you must point
 * the Enemy.prototype.constructor at itself. Otherwise the constructor will
 * be the Entity constructor, since when we set Enemy's prototype to Entity's
 * prototype, that's what it does. Now you can create new Enemy's using the
 * 'new' keyword.
 */

Enemy.prototype.constructor = Enemy;

enemy = new Enemy(-2, 60, 'enemy-bug');

Enemy.prototype.createCollection = function(x, yArray, sprite, newCollection) {
    yArray.forEach(function(val, ind, arr) {
        newCollection.push(new Enemy(x, val, sprite));
    });
};

/**
 * Updates enemy's position using dt param, a time delta between ticks
 * @param {number} dt - Time delta between ticks defined in engine.js: var now = Date.now(),
 * dt = (now - lastTime) / 1000.0; Often used in online games. It ensures all graphics
 * render at same speed regardless of the browser.
 * As long as enemy's x coordinate is still on the canvas, or less than 550, keep updating
 * the speed. Otherwise, if it's reached the end of canvas, reset enemy's x to a random negative
 * value to reset it back to the start on left of canvas.
 * Its random so that each enemy has a different starting position.
 */

Enemy.prototype.update = function(dt) {
    // If the x-coord is not more than canvas width, entity can keep moving forward, else randomly reset x-coord.
    this.x = this.x < 550 ? this.x + this.speed * dt : -(Math.floor(Math.random() * 50) + 30);
    this.checkCollision(player.x, player.y, this.x, this.y);
};

enemy.createCollection(-2, [60, 150, 220, 150], 'enemy-bug', allEnemies);


/**
 * Check if enemy collided with player
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

/**
 * Represents the player
 * @constructor
 * @param {number} x - Player's x coordinate on canvas
 * @param {number} y - Player's y coordinate on canvas
 * @param {string} sprite - Player's image ID which is also the name of
 * the image. There are 5 possible images for a player, using Drag & Drop HTML5 API
 * when an image is dropped onto the canvas, it grabs the image ID and that is used
 * here. Player declared at top of app.js with all global variables
 */

Player = function(x, y, sprite) {
    Entity.call(this, x, y, sprite);
    this.isMoving = false;
    this.direction = 'up';
    this.score = 0;
    this.lives = 5;
    this.status = 'playing'; // Possible: "lostGame", "won", "died"
};

Player.prototype = Object.create(Entity.prototype);

Player.prototype.constructor = Player;

player = new Player(200, 380, 'char-pink-girl');

/** Player variable declared at top of app.js with all global variables.
* Player on board initially is image 'char-pink-girl.png'.
* '.bind(this)' is a way to bind the value of 'this' in setTimout to be 'player'
* without having to use 'self'.
*/

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
};

/**
 * Display function to display player's remaining lives as hearts at top of window
 * Creates a span with same ID as span on page and appends each newly created image with Heart.png src.
 * Then it replaces the span on the page now, span2, with this newly created one with updated life or heart count.
 */

Player.prototype.displayLives = function() {
    var parentDiv = document.getElementById('lives'),
        span2 = document.getElementById('hearts'),
        span1 = document.createElement('span'),
        img;
        span1.id = 'hearts';
    for (var i = 0, j = this.lives; i < j; i++) {
        img = new Image(); // HTML5 Constructor
        img.src = 'images/Heart.png';
        img.id = 'life';
        img.alt = 'Lives';
        span1.appendChild(img);
    }
    parentDiv.replaceChild(span1, span2);
};

/**
 * Change life count based on winning (reaching water), dying without any remaining lives, or dying with
 * remaining lives.
 * @param {number} life - Can be negative or positive
 * First, update player's lives, display it. If life is positive, change status to won, increase score 20.
 * If they have 0 lives, call lostGame and exit out. Otherwise they just died but have lives left, decrease score 20.
 * Then show their new status message, points, reset player back to start and place new gems on the board.
 */
//TODO: Any reason to use switch statement here?
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
    gem.resetGems();
};

Player.prototype.lostGame = function() {
    this.status = 'lost game';
    this.displayStatus();
    this.changeScore(-50);
    this.lives = 5; // When lose game, player is reset with 5 new lives.
    this.displayLives();
    this.reset(); // Player's x & y are set to initial value
    gem.resetGems(); // Place new gems on board
};

/**
 * Based on whether player is playing, loses game, wins, or loses game and all lives, a different status
 * message appears in top right corner of window.
 * @param {string} status - 4 possible
 * Creates a span with same ID as span on page, inserts message into it using .innerHTML DOM method.
 * Then replaces the span on the page now, span2, with this newly created one with updated status message.
 */

Player.prototype.displayStatus = function() {
    var brew parentDiv,
        span1,
        span2;

    // switch (this.status) {
    //     case 'playing':
    //         msg = 'Keep going!';
    //         break;
    //     case 'lost game':
    //         msg = 'You lost. That\'s okay.';
    //         break;
    //     case 'won':
    //         msg = 'You won!';
    //         break;
    //     case 'died':
    //         msg = 'You died!';
    //         break;
    //     case 'gem':gulgit
    //         msg = '20 points!';
    //         break;
    // }

    function getMessage (status) {
        return 'You ' + {
            'playing': 'are great. Keep going!',
            'lost game': 'lost. That\'s okay.',
            'won': 'won!', 
            'died': 'died!',
            'gem': ' earned 20 points.'
        }[status];
    }
    
    parentDiv = document.getElementById('displayStatus');
    span2 = document.getElementById('wl-update');
    span1 = document.createElement('span');
    span1.id = 'wl-update';
    span1.innerHTML = getMessage(this.status);
    parentDiv.replaceChild(span1, span2);
};

player.displayStatus();

// Changes player's score and calls displayScore with new score.
Player.prototype.changeScore = function(points) {
    this.score += points;
    this.displayScore();
};

Player.prototype.displayScore = function() {
   document.getElementById('score').textContent = 'Your score: ' + this.score;
};

/**
 * Moves player when user presses arrow key. Player has a direction property based on keyDirection, direction = keyDirection;
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
                futureY -= futureY === 60 && this.status !== 'won' ? 59 : TILE_HEIGHT;
                break;
            case 'right':
                futureX += TILE_WIDTH;
                break;
            case 'down':
                futureY += TILE_HEIGHT;
                break;
            case 'left':
                futureX -= TILE_WIDTH;
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
 * Represents a gem which supplies points when collected
 * @constructor, subclass of Entity
 * @param {number} x - Gem's x coordinate on canvas
 * @param {number} y - Gem's x coordinate on canvas
 * @param {string} sprite - Gem's image file name based on color
 * Gem declared at top of app.js with all global variables
 */

Gem = function(x, y, sprite) {
    Entity.call(this, x, y, sprite);
};

Gem.prototype = Object.create(Entity.prototype);

Gem.prototype.constructor = Gem;

gem = new Gem(0, 60, 'Gem-Blue');

// If player reaches a gem, increase score by 20, find the gem in the allGems array and remove it
Gem.prototype.update = function() {
    if ((player.x >= this.x - 20 && player.x <= this.x + 20) &&
        // (player.y === this.y)) {
        (player.y >= this.y - 20 && player.y <= this.y + 20)){
    //     if ((playerX >= enemyX - 40 && playerX <= enemyX + 40) &&
    //     (playerY >= enemyY - 20 && playerY <= enemyY + 20)) {
    //     player.changeLives(-1);
    // }

        for (var g = 0; g < allGems.length; g++) {
            if (this.y === allGems[g].y) {
                allGems.splice(g, 1);
                player.changeScore(20);
                player.status = 'gem';
                player.displayStatus();
                player.status = 'playing';
                return player.delayThisStatus();
            }
        }
    }
};

// Randomly set x & y of gems and colors.
Gem.prototype.resetGems = function() {
    allGems = [];
    var tempX = [0, 100, 200, 300, 400],
        tempY = [60, 140, 220],
        colors = ['Gem-Blue', 'Gem-Green', 'Gem-Orange'],
        j,
        k;

    for (var i = 0; i < 4; i++) {
        j = Math.floor(Math.random() * 5); // Wanted gems apart so different indexes for x & y
        k = Math.floor(Math.random() * 3);
        allGems.push(new Gem(tempX[j], tempY[k], colors[k]));
    }
};

gem.resetGems();

/**
 * This Event Listener is fired when a key is released.
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
 * Function used in dragstart event listener to choose character image.
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
    if (event.preventDefault){
        event.preventDefault();
    }
};

// Neccessary to make drop work, weird but necessary.
Player.prototype.handleDragOver = function(event) {
    if (event.preventDefault){
        event.preventDefault();
    }
    return false;
};

/**
 * Using characters element allows for event delegation and one event listener
 * instead of 5. Characters declared at top of app.js with all global variables.
 * Event listener needs to be on dragstart for drag and drop to work.
 */

document.getElementById('characters').addEventListener('dragstart', function(event) {
    player.handleDragStart(event);
}, false);

document.getElementById('game-zone').addEventListener('dragover', player.handleDragOver, false);
document.getElementById('game-zone').addEventListener('drop', player.handleDragDrop, false);



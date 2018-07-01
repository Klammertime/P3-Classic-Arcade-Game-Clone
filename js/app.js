const TILE_WIDTH = 100,
  TILE_HEIGHT = 80;

let allEnemies = [],
  allGems = [],
  enemy,
  player,
  gem;

/**
 * Superclass representing the entities on the screen: Enemy, Player and Gem
 * @constructor
 * @param {number} x - Entity's x coordinate on canvas
 * @param {number} y - Entity's y coordinate on canvas
 * @param {string} sprite - Entity's sprite used to render entity on canvas
 */

class Entity {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/' + sprite + '.png';
    this.width = 101;
    this.height = 171;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
  }
}

let entity = new Entity();

/**
 * Represents the enemy bugs that run across screen
 * @constructor
 * @param {number} enemyX - Enemy's x coordinate on canvas
 * @param {number} enemyY - Enemy's y coordinate on canvas
 * Enemy declared at top of app.js with all global variables.
 * Entity.call calls the Entity function passing in the Enemy being constructed
 * so any Entity-related initialization can occur.
 */

class Enemy extends Entity {
  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.speed = Math.floor(Math.random() * 400 + 50); // Sets random initial speed
  }

  createCollection(x, yArray, sprite, newCollection) {
    yArray.forEach(function(val, ind, arr) {
      newCollection.push(new Enemy(x, val, sprite));
    });
  }

  update(dt) {
    // If the x-coord is not more than canvas width, entity can keep moving forward, else randomly reset x-coord.
    this.x = this.x < 550 ? this.x + this.speed * dt : -(Math.floor(Math.random() * 50) + 30);
    this.checkCollision(player.x, player.y, this.x, this.y);
  }

  checkCollision(playerX, playerY, enemyX, enemyY) {
    // if within 40 x and 20 y of each other, player hit
    if (
      playerX >= enemyX - 40 &&
      playerX <= enemyX + 40 &&
      (playerY >= enemyY - 20 && playerY <= enemyY + 20)
    ) {
      player.changeLives(-1);
    }
  }
}

enemy = new Enemy(-2, 60, 'enemy-bug');

enemy.createCollection(-2, [60, 150, 220, 150], 'enemy-bug', allEnemies);

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

class Player extends Entity {
  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.isMoving = false;
    this.direction = 'up';
    this.score = 0;
    this.lives = 5;
    this.status = 'playing'; // Possible: "lostGame", "won", "died"
  }

  delayThisStatus() {
    window.setTimeout(this.displayStatus.bind(this), 1000);
  }

  reset() {
    this.x = 200;
    this.y = 380;
    this.isMoving = false;
    this.status = 'playing';
    this.delayThisStatus();
  }

  displayLives() {
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
  }

  changeLives(life) {
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
  }

  handleDragStart(event) {
    this.sprite = 'images/' + event.target.id + '.png'; // Grab character ID from event.target
    document.body.className = event.target.id; // Set body class to class w/ same name as ID
  }

  handleDragDrop(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
  }

  // Neccessary to make drop work, weird but necessary.
  handleDragOver(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    return false;
  }

  displayStatus() {
    var msg, parentDiv, span1, span2;

    switch (this.status) {
      case 'playing':
        msg = 'Keep going!';
        break;
      case 'lost game':
        msg = "You lost. That's okay.";
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
  }

  changeScore(points) {
    this.score += points;
    this.displayScore();
  }

  displayScore() {
    document.getElementById('score').textContent = 'Your score: ' + this.score;
  }

  update() {
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
      if (futureY > 402 || futureY < 0) {
        // Will fall off top of canvas, so don't move.
        this.isMoving = false;
        return false;
      } else if (futureX > 400 || futureX < 0) {
        // Will fall off sides of canvas, so don't move.
        this.isMoving = false;
        return false;
      } else if (futureY === 1) {
        // Player reached water and has won!
        this.y = futureY;
        this.changeLives(1); // They earn an extra life and changeLives takes care of rest.
      } else {
        // Otherwise, they can be moved, so update location.
        this.x = futureX;
        this.y = futureY;
        this.isMoving = false;
      }
    }
  }

  handleInput(keyDirection) {
    this.isMoving = true;
    this.direction = keyDirection;
  }
}

player = new Player(200, 380, 'char-pink-girl');

player.displayStatus();

player.displayLives();

player.displayStatus();

/**
 * Represents a gem which supplies points when collected
 * @constructor, subclass of Entity
 * @param {number} x - Gem's x coordinate on canvas
 * @param {number} y - Gem's x coordinate on canvas
 * @param {string} sprite - Gem's image file name based on color
 * Gem declared at top of app.js with all global variables
 */

class Gem extends Entity {
  constructor(x, y, sprite) {
    super(x, y, sprite);
  }

  update() {
    if (
      player.x >= this.x - 20 &&
      player.x <= this.x + 20 &&
      (player.y >= this.y - 20 && player.y <= this.y + 20)
    ) {
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
  }

  resetGems() {
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
  }
}

gem = new Gem(0, 60, 'Gem-Blue');

gem.resetGems();

// This listens for key presses and sends the keys to player.handleInput
document.addEventListener('keyup', function(event) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[event.keyCode]);
});

document.getElementById('characters').addEventListener(
  'dragstart',
  function(event) {
    player.handleDragStart(event);
  },
  false
);

document.getElementById('game-zone').addEventListener('dragover', player.handleDragOver, false);
document.getElementById('game-zone').addEventListener('drop', player.handleDragDrop, false);

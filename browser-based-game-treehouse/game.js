var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// character in our game
imgFrog = new Image();
imgFrog.src = "img/mikethefrog.png";
// don't want game to load until the image is loaded so call
// init fcn from event listener after load
// if a lot of images would use sprite sheet and wait til loaded
// to start game
imgFrog.addEventListener("load", init, false);

// uses whatever browswers best method is for requesting
// animation frame w/ fallbacks for diff browsers
// and eventually fallback to JS for setting timeout
// which was original way
var requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000/60);
    };



// frogs x & y since he's moving, used in update fcn
var frogX = 65;
var frogY = 65;

// says next time you draw the frame, call this update
// update method, and the update method says next time you
// draw a frame, call the update method again, recursive pattern
// common game logic, init to initialize game
// then update function that calls on an ongoing basis
function init() {
  requestAnimFrame(update);
}

// inside update method, move characters around, check
// for collisions with walls, create objects
function update() {

  // Put frog in game w/ drawImage method on context
  // pass in image object we want to use
  // plus x, y, w, h where image drawn
  // If using sprite sheet w/ a lot of images can pass in
  // 4 more args tell what coords from sprite sheet to pull out
  // Instead of using x, y coordin. as hard coded values:
  // context.drawImage(imgFrog, 65, 65, 100, 77);
  // lets use a var since frog will move so x,y will change
  context.drawImage(imgFrog, frogX, frogY, 100, 77);
  // draw rectangle for outer walls
  // ctx.fillRect(x, y, width, height); and color
  // left-hand wall
  context.fillRect( 10, 10, 40, 380, "#000000");
  // top wall
  context.fillRect( 10, 10, 380, 40, "#000000");
  // bottom wall
  context.fillRect( 10, 350, 380, 40, "#000000");
  // right wall
  context.fillRect( 350, 10, 40, 380, "#000000");
  // line into rectangle
  context.fillRect( 180, 10, 40, 180, "#000000");

  // next time draw frame, call update, recursive pattern
  requestAnimFrame(update);
}













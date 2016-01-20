goog.provide('treehouse.Frog');
goog.require('lime.Sprite');

treehouse.Frog = function() {

    goog.base(this);

    this.setSize(80,58).setFill('img/mikethefrog.png');
    this.isMoving = false;
    this.direction = NORTH;
    this.speed = 0.3;

};

goog.inherits(treehouse.Frog,lime.Sprite);

treehouse.Frog.prototype.startMovement = function(direction) {
  this.isMoving = true;
  this.direction = direction;
}; 
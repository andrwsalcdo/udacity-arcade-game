// ******global global parameters*********//
var Canvas_width = 808;
var Canvas_height = 808;
var Player_start_x = 300;
var Player_start_y = 575;






//***********   SUPER CLASS   ********************//
//************** ENTITIES IN THE GAME ********************//
//***********(Not Include the Player)******************//

var Entity = function (x,y) {
    this.x = x;
    this.y = y;
    this.originalPosition = [x,y];
    this.width = 60;
    this.height =60;
};

Entity.prototype.reset = function() {
    this.x = this.originalPosition[0];
    this.y = this.originalPosition[1];
};

Entity.prototype.render = function() {
    ctx.drawImage (Resources.get(this.sprite), this.x, this.y);
};

//***********   SUB CLASS   ********************//
//************** Enemy moving LEFT-right  ********************//
var EnemyL = function(x,y, originalPosition, width, height) {
  Entity.call (this, x, y, originalPosition);
  this.width = 70;
  this.height = 60;
  this.speed = Math.floor(Math.random() * 400) + 150;
  this.sprite = 'images/enemy-bug.png';
};

EnemyL.prototype = Object.create(Entity.prototype);

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
EnemyL.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // ensures the game runs at the same speed for all computers.
    this.x += this.speed * dt;
    if (this.x > Canvas_width) {
        this.x = -20; // bugs 'teleport' to starting point
    }
};

var allEnemies = [];
var enemy0 =  new EnemyL (300,65);
var enemy1 = new EnemyL (0,65);
var enemy2 = new EnemyL (0,150);
var enemy3 = new EnemyL (0,235);
allEnemies.push(enemy0,enemy1,enemy2,enemy3);

//***********   SUB CLASS   ********************//
//************** Enemy moving RIGHT-left  ********************//
var EnemyR = function(x,y, originalPosition, width, height) {
  Entity.call (this, x, y, originalPosition);
  this.width = 70;
  this.height = 60;
  this.speed = Math.floor(Math.random() * 200) + 100;
  this.sprite = 'images/enemy-bug-r.png';
};

EnemyR.prototype = Object.create(Entity.prototype);

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
EnemyR.prototype.update = function(dt) {
    this.x -= this.speed * dt;
    if (this.x < -70) {
        this.x = Canvas_width;  // bugs 'teleport' to starting point
    }
};

var enemy4 =  new EnemyR (800,320);
var enemy5 = new EnemyR (400,320);
var enemy6 = new EnemyR (800,405);
var enemy7 = new EnemyR (400,405);
var enemy8 = new EnemyR (800,490);
var enemy9 = new EnemyR (400,490);
allEnemies.push(enemy4,enemy5,enemy6,enemy7,enemy8,enemy9);






//***********   PLAYER   ********************//
//**************  ********************//
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x,y) {
  this.x = x;
  this.y = y;
  this.width = 60;
  this.height = 70;
  // this.lives = 5; //how to add on html bar, etc
  this.sprite = 'images/char-boy.png';
};

Player.prototype.reset = function() {
  this.x = Player_start_x;
  this.y = Player_start_y;
  // this.lives = 5;
  this.sprite = 'images/char-boy.png';
}

// ----TODO when the player collides-----
// Player.prototype.collision = function() {
//
// }

Player.prototype.render = function() {
    ctx.drawImage (Resources.get(this.sprite), this.x, this.y);
};

// TODO: Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
  // preventing player moving off the canvas...boundary
  if (this.x > 700) {
      this.x = 700; // highest x for player
  }
  if (this.x < 0) {
      this.x = 0; //origin
  }
  if (this.y > Player_start_y) {
      this.y = Player_start_y; //don't allow down movement. mu haha.
  }
  if (this.y < -12) {
      this.y = -10; //  -(10+70) < 81, so player fits snuggly inside row
  }
}

//Enable the player to be moved around the canvas
Player.prototype.handleInput = function(movement) {
  if (movement == "left") {
    this.x -= 100;
  }
  if (movement == 'right') {
    this.x += 100;
  }
  if (movement == "up") {
    this.y -= 83;
  }
  if (movement == "down") {
    this.y += 83;
  }
};

// instantiate the player by Placing the player obj in a var called player
var player = new Player (Player_start_x,Player_start_y);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

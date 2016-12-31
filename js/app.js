// ******global global parameters*********//
var Canvas_width = 808;
var Canvas_height = 808;
var Player_start_x = 300;
var Player_start_y = 575;
//var win = false; //Whether level has been won; used to trigger animations.
var play = false; //Whether the game has begun; used to trigger character selector screen
var selectedChar; //Used as pointer for the selected sprite URL in array
var chars = [ //Array of URLs for player and NPC sprites
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];

//***********   GAME Class  ********************//
//************** START, RESET, WIN ********************//
var Game = function() {};

Game.prototype.win = function() {
    alert ("CONGRATS! YOU WIN!"); ////**To play again: Refresh the page**
    this.resetGame();
};

Game.prototype.lose = function() {
    alert ("GAME OVER!"); //Instantiates our selector;
    this.resetGame();
};

//Reset the game in the event of game over
Game.prototype.resetGame = function() {
    collectedGems = [];
    collectedHearts = [];
    //reset the html for lives,hearts, gems
    document.getElementById("lives").innerHTML = 3;
    document.getElementById("gems").innerHTML = collectedGems.length.toString();
    //
    player.reset();
    var allGemsLength = allGems.length;
    for (i=0; i < allGemsLength; i++) {
        allGems[i].reset();
    }
    var allEnemiesLength = allEnemies.length;
    for (i=0; i < allEnemiesLength; i++) {
        allEnemies[i].reset();
    }
    var allRocksLength = allRocks.length;
    for (i=0; i < allRocksLength; i++) {
        allRocks[i].reset();
    }
    var allHeartsLength = allHearts.length;
    for (i=0; i < allHeartsLength; i++) {
        allHearts[i].reset();
    }
};

var game = new Game;

// ---------- Selector Class ---------- \\

/* Selector used for character selection
 * col Selector column
 * realx Vertical coordinate at which to draw selector
 * y Vertical coordinate
 * alpha Transparency value for the sprite
 * throbdir Direction of visual throb:  transparent & opaque
 */
var Selector = function() {
    this.col = 0;
    this.x = this.col * 101 + 152;
    this.y = 608;
    this.sprite = 'images/Selector.png';
    this.alpha = 1;
    this.throbdir = 'transparent';
};

// Receives input from user to move selector
Selector.prototype.handleInput = function(key) {
    if (key == 'left') {
        this.col > 0 ? (this.col--, this.x = this.col * 101 + 152) : this.col;
    }
    if (key == 'right') {
      this.col < 4 ? (this.col++, this.x = this.col * 101 + 152) : this.col;
    }
    if (key == 'enter') {
      selectedChar = this.col;
      play = true;
      game.resetGame();
    }
};

// Selector render function
Selector.prototype.render = function() {
    ctx.save();
    this.throb();
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.restore();
};

// Helper for Selector.render that uses alpha transparency to "throb" the selector
Selector.prototype.throb = function() {
    if (this.alpha > 0.5 && this.throbdir === 'transparent') {//'down') {
        this.alpha -= 0.0075;
    }
    else {
        this.throbdir = 'opaque';//'up';
        this.alpha += 0.0075;
        if (this.alpha > 1 && this.throbdir === 'opaque') { //'up') {
            this.throbdir = 'transparent';//'down';
        }
    }
}


//***********   SUPER CLASS   ********************//
//************** ENTITIES IN THE GAME ********************//
//***********(Not Include the Player)******************//
  //entity this will be handy when include rocks,gem,starts, etc!
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

//*****************   SUB-CLASS   *****************//
//****************** Rocks: obstacles******************//
var Rock = function(x,y, originalPosition, width, height) {
  Entity.call (this, x, y, originalPosition, width, height);
  this.sprite = 'images/Rock1.png';
}
Rock.prototype = Object.create(Entity.prototype);


var allRocks = [];
//the obstacles
var rock1 = new Rock (608,498);
var rock2 = new Rock (508,412);
var rock3 = new Rock (206,327);
var rock4 = new Rock (306,327);
var rock5 = new Rock (407,244);
var rock6 = new Rock (713,244);
var rock7 = new Rock (104,162);
var rock8 = new Rock (107,-5);
var rock9 = new Rock (511,-5);
var rock10 = new Rock (711,-5);
allRocks.push(rock1,rock2,rock3,rock4,rock5,rock6,rock7,rock8,rock9,rock10);

// var collectedRocks = []; // (x,y) of the hea collected

//*****************   SUB-CLASS   *****************//
//****************** Hearts: lives******************//
var Heart = function(x,y, originalPosition, width, height) {
  Entity.call (this, x, y, originalPosition, width, height);
  this.sprite = 'images/Heart1.png';
}

Heart.prototype = Object.create(Entity.prototype);

var allHearts = [];
var heart1 = new Heart (608,419);
var heart2 = new Heart (305,249);
allHearts.push(heart1,heart2);

var collectedHearts = []; // (x,y) of the hearts collected

//***************   SUB-CLASS   ********************//
//************** Gems to collect *****************//
var Gem = function (x,y, originalPosition, width, height) {
    Entity.call (this, x, y, originalPosition, width, height);
    this.sprite = 'images/Gem-Blue1.png';
};

Gem.prototype = Object.create(Entity.prototype);
var allGems = [];
var gem1 = new Gem (517,503); //a bit of trial & error to center it.
var gem2 = new Gem (10,418);
var gem3 = new Gem (720,88);
allGems.push(gem1,gem2,gem3);

var collectedGems = []; // (x,y) of gems obtained

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
  this.width = 85; //70
  this.height = 65; //60
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
  //record the x,y coordinates of the player for non-enemy collisions
  this.playerPosition = []; // [ [x,y], [x,y], [x,y], etc... ]
  this.width = 60;
  this.height = 70;
  this.lives = 3; //how to add on html bar, etc
  this.sprite = chars[selectedChar]; //'images/char-boy.png';
};

Player.prototype.reset = function() {
  this.x = Player_start_x;
  this.y = Player_start_y;
  this.lives = 3;
  this.sprite = chars[selectedChar]; //'images/char-boy.png';
}

// ----when the player collides with enemy -----
Player.prototype.collision = function() {
    //Game Over....
    if (this.lives === 1) {
      this.lives -= 1;
      document.getElementById("lives").innerHTML = this.lives.toString();
      //Delay the Game Over alert or it pops up too fast for doc to update lives status to 0
      setTimeout(function() {
      game.lose();
      }, 50);
    }
      //Scenario 2: Player still has lives left
    else if (this.lives > 1) {
      this.lives -= 1;
      document.getElementById("lives").innerHTML = this.lives.toString();
      this.x = Player_start_x;
      this.y = Player_start_y;
    }
};

Player.prototype.render = function() {
    ctx.drawImage (Resources.get(this.sprite), this.x, this.y);
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
  // preventing player moving off the canvas...boundary
  if (this.x > 700) {
      this.x = 700; // highest x for player--right
  }
  if (this.x < 0) {
      this.x = 0; //left boundary
  }
  if (this.y > Player_start_y) {
      this.y = Player_start_y; //don't allow down movement. mu haha.
  }
  if (this.y <= -7) { //-(10+70) < 83, player fits snuggly inside row
      this.y === -6; //  70 = player height, 83 = row size.
      game.win();
  }

  // Collide with ENEMY BUGS
  for (i=0; i < allEnemies.length; i++) {
    if (this.x < allEnemies[i].x + allEnemies[i].width &&
        this.x + this.width > allEnemies[i].x &&
        this.y < allEnemies[i].y + allEnemies[i].height &&
        this.y + this.height > allEnemies[i].y) {
          this.collision();
      }
  }
  //Hit the rocks. can't move past them
  for (i=0; i < allRocks.length; i++) {
      if (this.x < allRocks[i].x + allRocks[i].width &&
          this.x + this.width > allRocks[i].x &&
          this.y < allRocks[i].y + allRocks[i].height &&
          this.y + this.height > allRocks[i].y) {
            this.x = this.playerPosition[this.playerPosition.length-1][0];
            this.y = this.playerPosition[this.playerPosition.length-1][1];
          }
  }
  //collect hearts....todo: gain lives.
  for (i=0; i < allHearts.length; i++) {
    if (this.x < allHearts[i].x + allHearts[i].width &&
        this.x + this.width > allHearts[i].x &&
        this.y < allHearts[i].y + allHearts[i].height &&
        this.y + this.height > allHearts[i].y) {
          collectedHearts.push([allHearts[i].x,allHearts[i].y]);
          this.lives += 1;
          document.getElementById("lives").innerHTML = this.lives.toString();
          //move heart img off canvas
          allHearts[i].x = 1000;
          allHearts[i].y = 1000;
        }
  }
  // collect Gems.
  for (i = 0; i < allGems.length; i++) {
    if (this.x < allGems[i].x + allGems[i].width &&
        this.x + this.width > allGems[i].x &&
        this.y < allGems[i].y + allGems[i].height &&
        this.y + this.height > allGems[i].y) {
          collectedGems.push([allGems[i].x, allGems[i].y]);
          document.getElementById('gems').innerHTML = collectedGems.length.toString();
          //move the gem off canvas. disappear
          allGems[i].x = 1000;
          allGems[i].y = 1000;
        }
    }
};


//Enable the player to be moved around the canvas
Player.prototype.handleInput = function(movement) {
  if (movement == "left") {
    //keep track of [x,y]..to help with non-enemy collisions.
    //before this code, player wouldn't move after 'hitting' non-enmy objects
    //very much of console.log([this.x, this.y]);
    this.playerPosition.push([this.x, this.y]);
    this.x -= 100;
  }
  if (movement == 'right') {
    this.playerPosition.push([this.x, this.y]);
    this.x += 100;
  }
  if (movement == "up") {
    this.playerPosition.push([this.x, this.y]);
    this.y -= 83;
  }
  if (movement == "down") {
    this.playerPosition.push([this.x, this.y]);
    this.y += 83;
  }
};

// instantiate the player by Placing the player obj in a var called player
var player = new Player (Player_start_x,Player_start_y);

// Instantiates our selector; called in Engine.js before init()
function initLoad() {
     selector = new Selector();
}
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if (play === false) {
        selector.handleInput(allowedKeys[e.keyCode]);
    }
    else {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});

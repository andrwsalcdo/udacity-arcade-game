/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 808;
    canvas.height = 808;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */


        var now = Date.now(),
        dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */

        win.requestAnimationFrame(main);
    }



    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        initLoad();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();

    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
      if (play === true) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        // player.reset();
      }
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
      if (play === true) {
        document.getElementById('menu').hidden = false;
        document.getElementById('easy').hidden = true;
        document.getElementById('medium').hidden = true;
        document.getElementById('hard').hidden = true;

        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/grass-block.png',   // Row 1 of 6 is grass
                'images/grass-block.png',   // Row 2 of 6 is grass
                'images/grass-block.png',   // Row 3 of 6 is grass
                'images/grass-block.png',   // Row 4 of 6 is grass
                'images/grass-block.png',   // Row 5 of 6 is grass
                'images/grass-block.png',   // Row 6 of 6 is grass
                'images/stone-block.png',   // Bottom Row stone
            ],
            numRows = 8,
            numCols = 8,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                   ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }

        }
        renderEntities();
      }
      else {
        startScreen();
      }
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allRocks.forEach(function(rock) {
            rock.render();
            // Rock.swim();
        });
        allHearts.forEach(function(heart) {
            heart.render();
        });
        allGems.forEach(function(gem) {
            gem.render();
        });
        allEnemies.forEach(function(enemy) {
          enemy.render();
        });
        player.render();
      }




    /* This function draws starting screen. User can choose a hero.
     *T: add instructions, game info, etc */
     // Renders our load screen
    function startScreen() {
      //*****get rid of game html menu items--hearts & lives.*****
      document.getElementById('menu').hidden = true;
      //******initial canvas..resuing the CSS background image****
      ctx.drawImage(Resources.get('images/background-11.png'), canvas.width, 680);

      //I want to use HTML5 canvas, because we learned that for the project. I realize that this could be solved with a simple image made in gimp/photoshop, or manipulating the DOM w/ jQuery, or plain html w/ vanilla JS...right? does that sound remotely correct?  :D
      //maybe using those methods would be easier for creating a Start Menu, but again, I thought it ideal to use HTML canvas for the menu, since we learned it during the lessons.

      //how to import google font into the canvas? I tried to make the canvas font like the HTML font, but no dice. I tried Stack Overflow, and answers from 2010, 2011,2013 wouldn't work...any advice? because Verdana is boring :D

      //*********Game Description.----****see comment above***
      var gameDescription = "Collect all Gems and reach the Water to win!";
      var gameDescription2 ="Avoid the Bugs! Collect Hearts to gain lives";
      var gameDescription3 = "...Good Luck!";
      ctx.font = 'bold 20pt Verdana';
      ctx.textAlign = 'center';

      ctx.fillStyle = '#556B2F';
      ctx.fillText(gameDescription, canvas.width/2, 78);
      ctx.fillText(gameDescription2, canvas.width/2, 110);
      ctx.fillText(gameDescription3, canvas.width/2, 145);

      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      ctx.strokeText(gameDescription, canvas.width/2, 78);
      ctx.strokeText(gameDescription2, canvas.width/2, 110);
      ctx.strokeText(gameDescription3, canvas.width/2, 145);

      //*********Controls....**********
      var control = "Move your Player";
      ctx.font = 'bold 20pt Verdana';
      ctx.textAlign = 'center';

      ctx.fillStyle = '#556B2F';
      ctx.fillText(control, canvas.width/2, 204);

      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      ctx.strokeText(control, canvas.width/2, 204);

      ctx.drawImage(Resources.get("images/aUp.png"), 364, 220);
      ctx.drawImage(Resources.get("images/aLeft.png"), 292, 295);
      ctx.drawImage(Resources.get("images/aDown.png"), 369, 295);
      ctx.drawImage(Resources.get("images/aRight.png"), 440, 295);

      // ******difficulty TODO: add difficulty code for mouse events.******
      ctx.font = "bold 20pt Verdana";
      ctx.textAlign = 'center';

      ctx.fillStyle = "#556B2F";
      ctx.fillText("Choose your Difficulty", canvas.width/2, 417);

      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      ctx.strokeText("Choose your Difficulty", canvas.width/2, 417);

      //********character section********
      ctx.font = "bold 20pt Verdana";
      ctx.textAlign = 'center';

      ctx.fillStyle = "#556B2F";
      ctx.fillText("Choose your Player. Press Enter to Start Game", (canvas.width*0.5), 540);

      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      ctx.strokeText("Choose your Player. Press Enter to Start Game", (canvas.width*0.5), 540);

        function loadRender() {
                for (col = 0; col <5; col++) {
                ctx.drawImage(Resources.get("images/stone-block.png"), col * 101 + 152, 540); //650
              }
            selector.render();
            for (var i = 0; i < chars.length; i++) {
              ctx.drawImage(Resources.get(chars[i]), i * 101 + 152, 504); //34 diff.
            }
        }
        loadRender(); //invoke the loadRender function. call it. make it work.
    }


    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
        // startScreen();
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/enemy-bug-r.png',
        'images/Gem-Blue1.png',
        'images/Heart1.png',
        'images/Rock1.png',
        'images/Selector.png',
        'images/aLeft.png',
        'images/aDown.png',
        'images/aRight.png',
        'images/aUp.png',
        'images/green_button02.png',
        'images/yellow_button02.png',
        'images/red_button01.png',
        'images/background-11.png',
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);

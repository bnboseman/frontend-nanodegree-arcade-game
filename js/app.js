var konamicode = ["up", "up", "down", "down", "left", "right", "left", "right", "B", "A"];
var keys = [];
// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    //Enemy location
    this.x = x;
    this.y = y;

    // Randomly generated speed for the enemy
    this.speed = Math.floor((Math.random() * 300) + 75);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // speed multiplied by dt parameter so game runs smoothly on all computers
    this.x += (this.speed * dt)
    if (this.x > 500) {
        this.x = 0
        this.speed = Math.floor((Math.random() * 175) + 50);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Player = function(x, y) {
    Enemy.call(this, x, y);
    //set the image to the catgirl
    this.sprite = 'images/char-cat-girl.png';

};

Player.prototype = Object.create(Enemy.prototype);
Player.prototype.constructor = Player;

// check for collision o update
Player.prototype.update = function() {
    this.checkCollision();
};

Player.prototype.handleInput = function(keycode) {
    // check to see if we have the konami code (instant win)
    keys.push(keycode);
    if (keys.toString().indexOf(konamicode) >= 0) {
        this.x = 250;
        this.y = 0;
        keys = [];
    } else {
        //move the characters based on input character
        switch (keycode) {
            case "left":
                if (this.x > 0) {
                    this.x -= 25;
                }
                break;
            case "up":
                if (this.y > 0) {
                    this.y -= 25;
                }
                break;
            case "right":
                if (this.x < 400) {
                    this.x += 25;
                }
                break;
            case "down":
                if (this.y < 425) {
                    this.y += 25;
                }
                break;

        }
    }

    // Remove all enemies if the player makes it accross
    if (this.y == 0) {
        allEnemies = [];
    }

};

// Function to see if the player collided with any of the enemies.
Player.prototype.checkCollision = function() {
    for (enemy in allEnemies) {
        var dx = allEnemies[enemy].x - this.x;
        var dy = allEnemies[enemy].y - this.y;

        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 50) {
            this.y = 425;
            return true;
        }
    }
    return false;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
allEnemies[0] = new Enemy(400, 140);
allEnemies[1] = new Enemy(200, 60);
allEnemies[2] = new Enemy(0, 225);
var player = new Player(250, 425);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        66: 'B',
        65: 'A'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
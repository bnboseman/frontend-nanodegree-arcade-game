var konamicode = ["up", "up", "down", "down", "left", "right", "left", "right", "B", "A"];
var keys = [];
// Base class for different pieces of the game
var Sprite = function(x, y) {    
    // All sprites should have a sprite depending on their class
    this.sprite = null;

    //Enemy location
    this.x = x;
    this.y = y;
};

// Draw the sprite on the screen, required method for game
Sprite.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Sprite.prototype.collisionDetection = function(sprite ) {
    var dx = sprite.x - this.x;
    var dy = sprite.y - this.y;

    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 50) {
        return true;
    } else {
        return false;
    }
}

Sprite.prototype.update = function() {
    
};

// Enemy class to keep trap of all enemies
var Enemy = function(x,y) {
    Sprite.call(this, x,y);
    // The image/sprite for our enemies
    this.sprite = 'images/enemy-bug.png';
    // Randomly generated speed for the enemy
    this.speed = Math.floor((Math.random() * 300) + 75);
}
Enemy.prototype = Object.create(Sprite.prototype);
Enemy.constructor = Enemy;
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

Enemy.generateEnemies = function() {
    var enemies = [];
    enemies[0] = new Enemy(((Math.random() * 275) + 25), 140);
    enemies[1] = new Enemy(((Math.random() * 275) + 25), 60);
    enemies[2] = new Enemy(((Math.random() * 275) + 25), 225);
    return enemies;
}
// Player function to keep track of our hero
var Player = function(x, y) {
    Sprite.call(this, x, y);
    //set the image to the catgirl
    this.sprite = 'images/char-cat-girl.png';
};

Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;

// check for collision to update
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

    // Reset the game
    if (this.y == 0) {
        allEnemies = Enemy.generateEnemies();
        allPowerUps = PowerUps.generatePowerups();
        this.x = 250;
        this.y = 425;
    }

};

// Function to see if the player collided with any of the enemies.
Player.prototype.checkCollision = function() {
    for (enemy in allEnemies) {
        if (this.collisionDetection( allEnemies[enemy])) {
            this.y = 425;
        }
    }
    
    for (powerup in allPowerUps) {
        if (this.collisionDetection( allPowerUps[powerup])) {
            allPowerUps.splice(powerup,1);
            score.score += 100;
        }
    }
    return false;
}

var PowerUps = function() {
    // Create a sprite with a randomly placed location
    Sprite.call(this, Math.floor((Math.random() * 275) + 25), Math.floor((Math.random() * 275) + 25));
    
    //Set the image
    this.sprite = "images/star.png";
}

PowerUps.prototype = Object.create(Sprite.prototype);
PowerUps.prototype.constructor = PowerUps;
PowerUps.generatePowerups = function() {
    var powerups = [];
    for ( i = 0; i < 3; i++) {
        powerups[i] = new PowerUps();
       
    }
    return powerups;
}

var Score = function() {
    // create a sprite for the bottom
    Sprite.call(this, 450, 450);
    this.score = 0;
}

Score.prototype = Object.create(Sprite.prototype);
Score.prototype.constructor = Score;
Score.prototype.render = function() {
    ctx.font = "30px Comic Sans MS";  // Hey, its a game. Comic Sans Serif is an approiate font for this use!
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.fillText("Score: " + this.score, this.x, this.y);
}

// Generate all enemies
var allEnemies = Enemy.generateEnemies();


// Generate all powerups
var allPowerUps = PowerUps.generatePowerups();

var score = new Score();
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


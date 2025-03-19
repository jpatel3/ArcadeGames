// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
function resizeCanvas () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game state
const gameState = {
  running: true,
  level: 1,
  coins: 0,
  lives: 3,
  gravity: 0.5,
  friction: 0.8,
  gameOver: false,
  levelComplete: false
};

// Audio elements
const jumpSound = document.getElementById('jumpSound');
const coinSound = document.getElementById('coinSound');
const gameOverSound = document.getElementById('gameOverSound');
const levelCompleteSound = document.getElementById('levelCompleteSound');
const backgroundMusic = document.getElementById('backgroundMusic');

// Audio state
let isMusicEnabled = true;
let isSoundEnabled = true;

// Player object
const player = {
  x: 100,
  y: 100,
  width: 32,
  height: 48,
  speed: 5,
  jumpForce: 12,
  velocityX: 0,
  velocityY: 0,
  jumping: false,
  grounded: false,
  facingRight: true,
  color: '#e52521', // Red color for the player
  update () {
    // Apply gravity
    this.velocityY += gameState.gravity;

    // Apply friction
    this.velocityX *= gameState.friction;

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Check for collisions with platforms
    this.grounded = false;
    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i];
      const collision = checkCollision(this, platform);

      if (collision.fromTop && this.velocityY >= 0) {
        this.grounded = true;
        this.jumping = false;
        this.velocityY = 0;
        this.y = platform.y - this.height;
      } else if (collision.fromBottom && this.velocityY < 0) {
        this.velocityY = 0;
        this.y = platform.y + platform.height;
      } else if (collision.fromLeft && this.velocityX > 0) {
        this.velocityX = 0;
        this.x = platform.x - this.width;
      } else if (collision.fromRight && this.velocityX < 0) {
        this.velocityX = 0;
        this.x = platform.x + platform.width;
      }
    }

    // Check for collisions with coins
    for (let i = 0; i < coins.length; i++) {
      if (checkSimpleCollision(this, coins[i])) {
        gameState.coins++;
        updateUI();
        coins.splice(i, 1);
        playSound('coin');
        i--;
      }
    }

    // Check for collisions with enemies
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (checkSimpleCollision(this, enemy)) {
        // If player is falling onto enemy, destroy enemy
        if (this.velocityY > 0 && this.y + this.height < enemy.y + enemy.height / 2) {
          enemies.splice(i, 1);
          this.velocityY = -this.jumpForce / 2; // Bounce
          i--;
        } else {
          // Player gets hurt
          playerHit();
        }
      }
    }

    // Check for collision with goal
    if (goal && checkSimpleCollision(this, goal)) {
      levelComplete();
    }

    // Check boundaries
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;

    // Check if player fell off the screen
    if (this.y > canvas.height) {
      playerHit();
    }
  },
  draw () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw eyes
    ctx.fillStyle = 'white';
    if (this.facingRight) {
      ctx.fillRect(this.x + this.width - 12, this.y + 10, 8, 8);
    } else {
      ctx.fillRect(this.x + 4, this.y + 10, 8, 8);
    }
  },
  jump () {
    if (!this.jumping && this.grounded) {
      this.jumping = true;
      this.grounded = false;
      this.velocityY = -this.jumpForce;
      playSound('jump');
    }
  },
  moveLeft () {
    this.velocityX = -this.speed;
    this.facingRight = false;
  },
  moveRight () {
    this.velocityX = this.speed;
    this.facingRight = true;
  }
};

// Platform object constructor
function Platform (x, y, width, height, color = '#4a752c') {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
}

// Coin object constructor
function Coin (x, y) {
  this.x = x;
  this.y = y;
  this.width = 20;
  this.height = 20;
  this.color = '#ffd700'; // Gold color
}

// Enemy object constructor
function Enemy (x, y, width, height, speed) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;
  this.direction = 1; // 1 for right, -1 for left
  this.color = '#8e44ad'; // Purple color

  this.update = function () {
    this.x += this.speed * this.direction;

    // Check for platform edges to change direction
    let onPlatform = false;
    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i];
      if (this.x + this.width > platform.x + platform.width) {
        this.direction = -1;
        this.x = platform.x + platform.width - this.width;
        onPlatform = true;
        break;
      } else if (this.x < platform.x) {
        this.direction = 1;
        this.x = platform.x;
        onPlatform = true;
        break;
      }

      // Check if enemy is on this platform
      if (this.y + this.height === platform.y &&
                this.x + this.width >= platform.x &&
                this.x <= platform.x + platform.width) {
        onPlatform = true;

        // Check if about to walk off the edge
        if (this.direction === 1 && this.x + this.width + 5 > platform.x + platform.width) {
          this.direction = -1;
        } else if (this.direction === -1 && this.x - 5 < platform.x) {
          this.direction = 1;
        }
      }
    }

    // If not on any platform, reverse direction
    if (!onPlatform) {
      this.direction *= -1;
    }
  };

  this.draw = function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

// Goal object
function Goal (x, y) {
  this.x = x;
  this.y = y;
  this.width = 40;
  this.height = 60;
  this.color = '#f1c40f'; // Yellow color

  this.draw = function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw flag
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(this.x + 10, this.y, 20, 15);
  };
}

// Game objects
let platforms = [];
let coins = [];
let enemies = [];
let goal = null;

// Collision detection
function checkCollision (obj1, obj2) {
  const result = {
    fromTop: false,
    fromBottom: false,
    fromLeft: false,
    fromRight: false
  };

  // Check for collision
  if (obj1.x + obj1.width > obj2.x &&
        obj1.x < obj2.x + obj2.width &&
        obj1.y + obj1.height > obj2.y &&
        obj1.y < obj2.y + obj2.height) {
    // Calculate collision sides
    const fromTop = obj1.y + obj1.height - obj2.y;
    const fromBottom = obj2.y + obj2.height - obj1.y;
    const fromLeft = obj1.x + obj1.width - obj2.x;
    const fromRight = obj2.x + obj2.width - obj1.x;

    // Find the smallest overlap
    const min = Math.min(fromTop, fromBottom, fromLeft, fromRight);

    if (min === fromTop) result.fromTop = true;
    else if (min === fromBottom) result.fromBottom = true;
    else if (min === fromLeft) result.fromLeft = true;
    else if (min === fromRight) result.fromRight = true;
  }

  return result;
}

// Simple collision detection (no direction)
function checkSimpleCollision (obj1, obj2) {
  return obj1.x + obj1.width > obj2.x &&
           obj1.x < obj2.x + obj2.width &&
           obj1.y + obj1.height > obj2.y &&
           obj1.y < obj2.y + obj2.height;
}

// Player hit function
function playerHit () {
  gameState.lives--;
  updateUI();

  if (gameState.lives <= 0) {
    gameOver();
  } else {
    // Reset player position
    player.x = 100;
    player.y = 100;
    player.velocityX = 0;
    player.velocityY = 0;
  }
}

// Game over function
function gameOver () {
  gameState.gameOver = true;
  gameState.running = false;
  document.getElementById('gameOverScreen').classList.remove('hidden');
  document.getElementById('finalScore').textContent = gameState.coins;
  playSound('gameOver');
  stopMusic();
}

// Level complete function
function levelComplete () {
  gameState.levelComplete = true;
  gameState.running = false;
  document.getElementById('levelCompleteScreen').classList.remove('hidden');
  document.getElementById('levelCoins').textContent = gameState.coins;
  playSound('levelComplete');
}

// Update UI
function updateUI () {
  document.getElementById('coinCount').textContent = gameState.coins;
  document.getElementById('lifeCount').textContent = gameState.lives;
  document.getElementById('levelNumber').textContent = gameState.level;
}

// Load level
function loadLevel (level) {
  // Clear existing objects
  platforms = [];
  coins = [];
  enemies = [];
  goal = null;

  // Reset player position
  player.x = 100;
  player.y = 100;
  player.velocityX = 0;
  player.velocityY = 0;

  // Set level
  gameState.level = level;
  updateUI();

  // Create level based on level number
  switch (level) {
  case 1:
    createLevel1();
    break;
  case 2:
    createLevel2();
    break;
  default:
    createLevel1();
  }

  // Start game
  gameState.running = true;
  gameState.gameOver = false;
  gameState.levelComplete = false;
}

// Create level 1
function createLevel1 () {
  // Ground
  platforms.push(new Platform(0, canvas.height - 40, canvas.width, 40));

  // Platforms
  platforms.push(new Platform(200, canvas.height - 120, 200, 20));
  platforms.push(new Platform(500, canvas.height - 200, 200, 20));
  platforms.push(new Platform(800, canvas.height - 280, 200, 20));

  // Coins
  coins.push(new Coin(300, canvas.height - 150));
  coins.push(new Coin(600, canvas.height - 230));
  coins.push(new Coin(900, canvas.height - 310));

  // Enemies
  enemies.push(new Enemy(300, canvas.height - 80, 30, 40, 2));
  enemies.push(new Enemy(600, canvas.height - 240, 30, 40, 2));

  // Goal
  goal = new Goal(canvas.width - 100, canvas.height - 100);
}

// Create level 2
function createLevel2 () {
  // Ground with gaps
  platforms.push(new Platform(0, canvas.height - 40, 300, 40));
  platforms.push(new Platform(400, canvas.height - 40, 300, 40));
  platforms.push(new Platform(800, canvas.height - 40, 300, 40));

  // Platforms
  platforms.push(new Platform(150, canvas.height - 150, 150, 20));
  platforms.push(new Platform(400, canvas.height - 200, 150, 20));
  platforms.push(new Platform(650, canvas.height - 250, 150, 20));
  platforms.push(new Platform(900, canvas.height - 300, 150, 20));

  // Coins
  coins.push(new Coin(200, canvas.height - 180));
  coins.push(new Coin(450, canvas.height - 230));
  coins.push(new Coin(700, canvas.height - 280));
  coins.push(new Coin(950, canvas.height - 330));

  // Enemies
  enemies.push(new Enemy(200, canvas.height - 80, 30, 40, 3));
  enemies.push(new Enemy(500, canvas.height - 80, 30, 40, 3));
  enemies.push(new Enemy(450, canvas.height - 240, 30, 40, 2));

  // Goal
  goal = new Goal(canvas.width - 100, canvas.height - 340);
}

// Game loop
function gameLoop () {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState.running) {
    // Update player
    player.update();

    // Update enemies
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].update();
    }
  }

  // Draw background
  drawBackground();

  // Draw platforms
  for (let i = 0; i < platforms.length; i++) {
    ctx.fillStyle = platforms[i].color;
    ctx.fillRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
  }

  // Draw coins
  for (let i = 0; i < coins.length; i++) {
    ctx.fillStyle = coins[i].color;
    ctx.beginPath();
    ctx.arc(coins[i].x + coins[i].width / 2, coins[i].y + coins[i].height / 2, coins[i].width / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw enemies
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].draw();
  }

  // Draw goal
  if (goal) {
    goal.draw();
  }

  // Draw player
  player.draw();

  // Request next frame
  requestAnimationFrame(gameLoop);
}

// Draw background
function drawBackground () {
  // Sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#5c94fc');
  gradient.addColorStop(1, '#c0e6ff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(100, 80, 30, 0, Math.PI * 2);
  ctx.arc(130, 70, 40, 0, Math.PI * 2);
  ctx.arc(160, 80, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(500, 120, 30, 0, Math.PI * 2);
  ctx.arc(530, 110, 40, 0, Math.PI * 2);
  ctx.arc(560, 120, 30, 0, Math.PI * 2);
  ctx.fill();
}

// Play sound
function playSound (sound) {
  if (!isSoundEnabled) return;

  switch (sound) {
  case 'jump':
    jumpSound.currentTime = 0;
    jumpSound.play();
    break;
  case 'coin':
    coinSound.currentTime = 0;
    coinSound.play();
    break;
  case 'gameOver':
    gameOverSound.currentTime = 0;
    gameOverSound.play();
    break;
  case 'levelComplete':
    levelCompleteSound.currentTime = 0;
    levelCompleteSound.play();
    break;
  }
}

// Play background music
function playMusic () {
  if (isMusicEnabled) {
    backgroundMusic.play();
  }
}

// Stop background music
function stopMusic () {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}

// Toggle music
function toggleMusic () {
  isMusicEnabled = !isMusicEnabled;
  if (isMusicEnabled) {
    backgroundMusic.play();
    document.getElementById('toggleMusic').innerHTML = '<span class="icon">🔊</span>';
  } else {
    backgroundMusic.pause();
    document.getElementById('toggleMusic').innerHTML = '<span class="icon">🔇</span>';
  }
}

// Toggle sound effects
function toggleSound () {
  isSoundEnabled = !isSoundEnabled;
  document.getElementById('toggleSound').innerHTML = isSoundEnabled
    ? '<span class="icon">🔔</span>'
    : '<span class="icon">🔕</span>';
}

// Keyboard controls
const keys = {
  left: false,
  right: false,
  up: false
};

document.addEventListener('keydown', function (e) {
  switch (e.key) {
  case 'ArrowLeft':
  case 'a':
    keys.left = true;
    break;
  case 'ArrowRight':
  case 'd':
    keys.right = true;
    break;
  case 'ArrowUp':
  case 'w':
  case ' ':
    keys.up = true;
    player.jump();
    break;
  }
});

document.addEventListener('keyup', function (e) {
  switch (e.key) {
  case 'ArrowLeft':
  case 'a':
    keys.left = false;
    break;
  case 'ArrowRight':
  case 'd':
    keys.right = false;
    break;
  case 'ArrowUp':
  case 'w':
  case ' ':
    keys.up = false;
    break;
  }
});

// Mobile controls
document.getElementById('leftButton').addEventListener('touchstart', function (e) {
  e.preventDefault();
  keys.left = true;
});

document.getElementById('leftButton').addEventListener('touchend', function (e) {
  e.preventDefault();
  keys.left = false;
});

document.getElementById('rightButton').addEventListener('touchstart', function (e) {
  e.preventDefault();
  keys.right = true;
});

document.getElementById('rightButton').addEventListener('touchend', function (e) {
  e.preventDefault();
  keys.right = false;
});

document.getElementById('jumpButton').addEventListener('touchstart', function (e) {
  e.preventDefault();
  keys.up = true;
  player.jump();
});

document.getElementById('jumpButton').addEventListener('touchend', function (e) {
  e.preventDefault();
  keys.up = false;
});

// Button event listeners
document.getElementById('restartButton').addEventListener('click', function () {
  document.getElementById('gameOverScreen').classList.add('hidden');
  gameState.lives = 3;
  gameState.coins = 0;
  loadLevel(1);
  playMusic();
});

document.getElementById('nextLevelButton').addEventListener('click', function () {
  document.getElementById('levelCompleteScreen').classList.add('hidden');
  loadLevel(gameState.level + 1);
});

document.getElementById('toggleMusic').addEventListener('click', toggleMusic);
document.getElementById('toggleSound').addEventListener('click', toggleSound);

// Game update function (separate from rendering)
function update () {
  if (gameState.running) {
    if (keys.left) {
      player.moveLeft();
    }
    if (keys.right) {
      player.moveRight();
    }
  }

  setTimeout(update, 1000 / 60); // 60 FPS
}

// Track game events with Google Analytics
function trackGameStart () {
  if (typeof gtag === 'function') {
    gtag('event', 'game_start', {
      game_name: 'MarioPlatformer',
      level: gameState.level
    });
  }
}

function trackGameOver () {
  if (typeof gtag === 'function') {
    gtag('event', 'game_over', {
      game_name: 'MarioPlatformer',
      level: gameState.level,
      score: gameState.coins
    });
  }
}

function trackLevelComplete () {
  if (typeof gtag === 'function') {
    gtag('event', 'level_complete', {
      game_name: 'MarioPlatformer',
      level: gameState.level,
      score: gameState.coins
    });
  }
}

// Initialize game
function init () {
  loadLevel(1);
  update();
  gameLoop();
  playMusic();
  trackGameStart();
}

// Start the game
window.onload = init;

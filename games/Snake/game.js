/* global Howl */

class SnakeGame {
  constructor () {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // Set canvas size based on container
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Game settings
    this.gridSize = Math.floor(this.canvas.width / 20); // Make grid size responsive
    this.tileCount = 20; // Keep consistent number of tiles
    this.snake = [{ x: 10, y: 10 }];
    this.food = this.generateFood();
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.lives = 3; // Initialize with 3 lives
    this.isInvulnerable = false; // For temporary invulnerability after getting hit
    this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
    this.gameLoop = null;
    this.isPaused = false;

    // Initialize heart image
    this.heartImage = new Image();
    this.heartImage.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJyZWQiPjxwYXRoIGQ9Ik0xMiAyMS4zNWwtMS40NS0xLjMyQzUuNCAxNS4zNiAyIDEyLjI4IDIgOC41IDIgNS40MiA0LjQyIDMgNy41IDNjMS43NCAwIDMuNDEuODEgNC41IDIuMDlDMTMuMDkgMy44MSAxNC43NiAzIDE2LjUgMyAxOS41OCAzIDIyIDUuNDIgMjIgOC41YzAgMy43OC0zLjQgNi44Ni04LjU1IDExLjU0TDEyIDIxLjM1eiIvPjwvc3ZnPg==';

    // Initialize UI elements
    this.scoreElement = document.getElementById('score');
    this.highScoreElement = document.getElementById('highScore');
    this.gameOverElement = document.getElementById('gameOver');
    this.finalScoreElement = document.getElementById('finalScore');
    this.gameOverElement.classList.add('hidden'); // Initialize with hidden class

    // Initialize sounds using global Howl
    this.sounds = {
      eat: new Howl({
        src: ['assets/sounds/eat.mp3']
      }),
      turn: new Howl({
        src: ['assets/sounds/turn.mp3']
      }),
      gameOver: new Howl({
        src: ['assets/sounds/game-over.mp3']
      })
    };

    // Set up controls
    this.setupControls();
    this.setupButtons();

    // Update high score display
    this.highScoreElement.textContent = this.highScore;
  }

  resizeCanvas () {
    const container = document.querySelector('.game-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const headerHeight = document.querySelector('.game-header').offsetHeight;
    const controlsHeight = document.querySelector('.controls').offsetHeight;
    const padding = 32; // 2rem padding from container

    // Calculate available space
    const availableWidth = containerWidth - (padding * 2);
    const availableHeight = containerHeight - headerHeight - controlsHeight - (padding * 2);

    // Set canvas size to maintain aspect ratio and fit container
    const size = Math.min(availableWidth, availableHeight, 600); // Max size of 600px
    this.canvas.width = size;
    this.canvas.height = size;
    this.gridSize = size / this.tileCount;

    // Redraw if game is in progress
    if (this.gameLoop) {
      this.draw();
    }
  }

  setupControls () {
    document.addEventListener('keydown', (e) => {
      // Prevent default behavior for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'Space', ' '].includes(e.key)) {
        e.preventDefault();
      }
      this.handleKeyPress(e.key);
    });

    // Mobile controls
    document.getElementById('upBtn').addEventListener('click', () => this.setDirection('up'));
    document.getElementById('downBtn').addEventListener('click', () => this.setDirection('down'));
    document.getElementById('leftBtn').addEventListener('click', () => this.setDirection('left'));
    document.getElementById('rightBtn').addEventListener('click', () => this.setDirection('right'));
  }

  setupButtons () {
    document.getElementById('startBtn').addEventListener('click', () => this.startGame());
    document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
    document.getElementById('restartBtn').addEventListener('click', () => this.startGame());
  }

  handleKeyPress (key) {
    const keyActions = {
      ArrowUp: () => this.setDirection('up'),
      ArrowDown: () => this.setDirection('down'),
      ArrowLeft: () => this.setDirection('left'),
      ArrowRight: () => this.setDirection('right'),
      w: () => this.setDirection('up'),
      s: () => this.setDirection('down'),
      a: () => this.setDirection('left'),
      d: () => this.setDirection('right'),
      ' ': () => this.togglePause()
    };

    if (keyActions[key]) {
      keyActions[key]();
    }
  }

  setDirection (newDirection) {
    const opposites = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    };

    if (this.direction !== opposites[newDirection] && this.direction !== newDirection) {
      this.nextDirection = newDirection;
      this.sounds.turn.play();
    }
  }

  generateFood () {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * this.tileCount),
        y: Math.floor(Math.random() * this.tileCount)
      };
    } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }

  moveSnake () {
    const head = { ...this.snake[0] };
    this.direction = this.nextDirection;

    switch (this.direction) {
    case 'up': head.y--; break;
    case 'down': head.y++; break;
    case 'left': head.x--; break;
    case 'right': head.x++; break;
    }

    // Check for collisions before clamping
    const hitWall = head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount;
    if (hitWall) {
      // Keep snake at the last valid position
      head.x = Math.max(0, Math.min(head.x, this.tileCount - 1));
      head.y = Math.max(0, Math.min(head.y, this.tileCount - 1));
      // Update snake's head position at the border
      this.snake[0] = { ...head };
      this.handleCollision();
      return;
    }

    // Check for self collision
    const selfCollision = this.snake.some((segment, index) =>
      index > 0 && segment.x === head.x && segment.y === head.y
    );

    if (selfCollision) {
      this.handleCollision();
      return;
    }

    // If we reach here, no collision occurred or we're invulnerable
    if (!this.isInvulnerable) {
      // Check if snake ate food
      const ateFood = head.x === this.food.x && head.y === this.food.y;

      if (ateFood) {
        // Add new head without removing tail for growth
        this.snake.unshift({ ...head });
        this.score += 10;
        this.scoreElement.textContent = this.score;
        this.food = this.generateFood();
        this.sounds.eat.play();
      } else {
        // Normal movement: add head and remove tail
        this.snake.unshift({ ...head });
        this.snake.pop();
      }
    }
  }

  handleCollision () {
    if (this.isInvulnerable) {
      return false;
    }

    this.lives--;
    if (this.lives <= 0) {
      this.gameOver();
      return true;
    }

    // Make snake invulnerable for 2 seconds
    this.isInvulnerable = true;
    setTimeout(() => {
      this.isInvulnerable = false;
      // Reset snake position after invulnerability ends
      this.snake = [{ x: 10, y: 10 }];
      this.direction = 'right';
      this.nextDirection = 'right';
    }, 2000);

    return false;
  }

  draw () {
    // Clear canvas
    this.ctx.fillStyle = '#ecf0f1';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw lives
    const heartSize = 30;
    const padding = 10;
    for (let i = 0; i < this.lives; i++) {
      this.ctx.drawImage(
        this.heartImage,
        this.canvas.width - (heartSize + padding) * (i + 1),
        padding,
        heartSize,
        heartSize
      );
    }

    // Make snake blink when invulnerable
    if (!this.isInvulnerable || Math.floor(Date.now() / 100) % 2) {
      // Draw snake
      this.ctx.fillStyle = '#2ecc71';
      this.snake.forEach((segment, index) => {
        // Calculate position with 1px gap
        const gap = 1;
        const x = segment.x * this.gridSize + gap;
        const y = segment.y * this.gridSize + gap;
        const size = this.gridSize - (gap * 2);

        // Draw snake segment
        this.ctx.fillRect(x, y, size, size);

        // Draw snake eyes on head
        if (index === 0) {
          this.ctx.fillStyle = '#000';
          const eyeSize = 4;
          let leftEye, rightEye;

          // Position eyes based on direction
          switch (this.direction) {
          case 'right':
            leftEye = { x: x + size - 6, y: y + 6 };
            rightEye = { x: x + size - 6, y: y + size - 10 };
            break;
          case 'left':
            leftEye = { x: x + 4, y: y + 6 };
            rightEye = { x: x + 4, y: y + size - 10 };
            break;
          case 'up':
            leftEye = { x: x + 6, y: y + 4 };
            rightEye = { x: x + size - 10, y: y + 4 };
            break;
          case 'down':
            leftEye = { x: x + 6, y: y + size - 6 };
            rightEye = { x: x + size - 10, y: y + size - 6 };
            break;
          }

          this.ctx.fillRect(leftEye.x, leftEye.y, eyeSize, eyeSize);
          this.ctx.fillRect(rightEye.x, rightEye.y, eyeSize, eyeSize);
        }
      });
    }

    // Draw food
    this.ctx.fillStyle = '#e74c3c';
    this.ctx.beginPath();
    this.ctx.arc(
      this.food.x * this.gridSize + this.gridSize / 2,
      this.food.y * this.gridSize + this.gridSize / 2,
      this.gridSize / 2 - 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  startGame () {
    // Reset game state
    this.snake = [{ x: 10, y: 10 }];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.lives = 3;
    this.isInvulnerable = false;
    this.scoreElement.textContent = '0';
    this.gameOverElement.classList.add('hidden');

    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }

    this.gameLoop = setInterval(() => {
      if (!this.isPaused) {
        this.moveSnake();
        this.draw();
      }
    }, 200); // Slower speed: changed from 100ms to 200ms
  }

  togglePause () {
    this.isPaused = !this.isPaused;
    document.getElementById('pauseBtn').textContent = this.isPaused ? 'Resume' : 'Pause';
  }

  gameOver () {
    this.sounds.gameOver.play();
    clearInterval(this.gameLoop);
    this.gameLoop = null;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('snakeHighScore', this.highScore);
      this.highScoreElement.textContent = this.highScore;
    }

    this.gameOverElement.classList.remove('hidden');
    this.finalScoreElement.textContent = this.score;
  }
}

// Initialize game when page loads
window.addEventListener('load', () => {
  window.snakeGame = new SnakeGame();
});

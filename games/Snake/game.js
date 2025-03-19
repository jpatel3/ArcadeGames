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
    this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
    this.gameLoop = null;
    this.isPaused = false;

    // Initialize UI elements
    this.scoreElement = document.getElementById('score');
    this.highScoreElement = document.getElementById('highScore');
    this.gameOverElement = document.getElementById('gameOver');
    this.finalScoreElement = document.getElementById('finalScore');

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

    // Check for collisions
    if (this.checkCollision(head)) {
      this.gameOver();
      return;
    }

    this.snake.unshift(head);

    // Check if snake ate food
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.scoreElement.textContent = this.score;
      this.food = this.generateFood();
      this.sounds.eat.play();
    } else {
      this.snake.pop();
    }
  }

  checkCollision (head) {
    // Wall collision
    if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
      return true;
    }

    // Self collision
    return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
  }

  draw () {
    // Clear canvas
    this.ctx.fillStyle = '#ecf0f1';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw snake
    this.ctx.fillStyle = '#2ecc71';
    this.snake.forEach((segment, index) => {
      this.ctx.fillRect(
        segment.x * this.gridSize,
        segment.y * this.gridSize,
        this.gridSize - 2,
        this.gridSize - 2
      );

      // Draw snake eyes on head
      if (index === 0) {
        this.ctx.fillStyle = '#000';
        const eyeSize = 4;
        let leftEye, rightEye;

        // Position eyes based on direction
        switch (this.direction) {
        case 'right':
          leftEye = { x: 14, y: 6 };
          rightEye = { x: 14, y: 12 };
          break;
        case 'left':
          leftEye = { x: 4, y: 6 };
          rightEye = { x: 4, y: 12 };
          break;
        case 'up':
          leftEye = { x: 6, y: 4 };
          rightEye = { x: 12, y: 4 };
          break;
        case 'down':
          leftEye = { x: 6, y: 14 };
          rightEye = { x: 12, y: 14 };
          break;
        }

        this.ctx.fillRect(
          segment.x * this.gridSize + leftEye.x,
          segment.y * this.gridSize + leftEye.y,
          eyeSize,
          eyeSize
        );
        this.ctx.fillRect(
          segment.x * this.gridSize + rightEye.x,
          segment.y * this.gridSize + rightEye.y,
          eyeSize,
          eyeSize
        );
      }
    });

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
    this.scoreElement.textContent = '0';
    this.food = this.generateFood();
    this.isPaused = false;

    // Hide game over screen
    this.gameOverElement.classList.add('hidden');

    // Clear existing game loop if any
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }

    // Start new game loop with slower speed (200ms instead of 100ms)
    this.gameLoop = setInterval(() => {
      if (!this.isPaused) {
        this.moveSnake();
        this.draw();
      }
    }, 200);
  }

  togglePause () {
    this.isPaused = !this.isPaused;
    document.getElementById('pauseBtn').textContent = this.isPaused ? 'Resume' : 'Pause';
  }

  gameOver () {
    clearInterval(this.gameLoop);
    this.gameLoop = null;
    this.sounds.gameOver.play();

    // Update high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.highScoreElement.textContent = this.highScore;
      localStorage.setItem('snakeHighScore', this.highScore);
    }

    // Show game over screen
    this.finalScoreElement.textContent = this.score;
    this.gameOverElement.classList.remove('hidden');
  }
}

// Initialize game when page loads
window.addEventListener('load', () => {
  window.snakeGame = new SnakeGame();
});

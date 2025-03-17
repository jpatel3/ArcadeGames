// Game state
let grid = [];
let score = 0;
let bestScore = 0;
let playerName = '';
let moveHistory = [];
let isGameOver = false;
let hasWon = false;

// DOM elements
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const winScreen = document.getElementById('winScreen');
const gridContainer = document.querySelector('.grid-container');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('bestScore');
const playerNameInput = document.getElementById('playerName');
const playerNameDisplay = document.getElementById('playerNameDisplay');
const winPlayerNameDisplay = document.getElementById('winPlayerNameDisplay');
const finalScoreElement = document.getElementById('finalScore');
const winFinalScoreElement = document.getElementById('winFinalScore');
const leaderboardList = document.getElementById('leaderboardList');

// Audio elements
const backgroundMusic = document.getElementById('backgroundMusic');
const moveSound = document.getElementById('moveSound');
const mergeSound = document.getElementById('mergeSound');
const gameOverSound = document.getElementById('gameOverSound');
const winSound = document.getElementById('winSound');
const toggleMusicButton = document.getElementById('toggleMusic');
const toggleSoundButton = document.getElementById('toggleSound');

// Audio state
let isMusicEnabled = true;
let isSoundEnabled = true;

// Initialize game
function initGame() {
    grid = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    moveHistory = [];
    isGameOver = false;
    hasWon = false;
    updateScore();
    addNewTile();
    addNewTile();
    renderGrid();
    updateLeaderboard();
}

// Add new tile
function addNewTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({ x: i, y: j });
            }
        }
    }
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Render grid
function renderGrid() {
    gridContainer.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            if (grid[i][j] !== 0) {
                cell.classList.add(`tile-${grid[i][j]}`);
                cell.textContent = grid[i][j];
            }
            gridContainer.appendChild(cell);
        }
    }
}

// Move tiles
function move(direction) {
    const oldGrid = JSON.parse(JSON.stringify(grid));
    let moved = false;

    switch (direction) {
        case 'left':
            moved = moveLeft();
            break;
        case 'right':
            moved = moveRight();
            break;
        case 'up':
            moved = moveUp();
            break;
        case 'down':
            moved = moveDown();
            break;
    }

    if (moved) {
        moveHistory.push(oldGrid);
        document.getElementById('undoMove').disabled = false;
        addNewTile();
        renderGrid();
        checkGameState();
        playSound('move');
    }

    return moved;
}

// Move left
function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        const row = grid[i].filter(cell => cell !== 0);
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                score += row[j];
                row.splice(j + 1, 1);
                moved = true;
                playSound('merge');
            }
        }
        const newRow = row.concat(Array(4 - row.length).fill(0));
        if (JSON.stringify(grid[i]) !== JSON.stringify(newRow)) {
            moved = true;
        }
        grid[i] = newRow;
    }
    return moved;
}

// Move right
function moveRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        const row = grid[i].filter(cell => cell !== 0);
        for (let j = row.length - 1; j > 0; j--) {
            if (row[j] === row[j - 1]) {
                row[j] *= 2;
                score += row[j];
                row.splice(j - 1, 1);
                moved = true;
                playSound('merge');
            }
        }
        const newRow = Array(4 - row.length).fill(0).concat(row);
        if (JSON.stringify(grid[i]) !== JSON.stringify(newRow)) {
            moved = true;
        }
        grid[i] = newRow;
    }
    return moved;
}

// Move up
function moveUp() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        const column = grid.map(row => row[j]).filter(cell => cell !== 0);
        for (let i = 0; i < column.length - 1; i++) {
            if (column[i] === column[i + 1]) {
                column[i] *= 2;
                score += column[i];
                column.splice(i + 1, 1);
                moved = true;
                playSound('merge');
            }
        }
        const newColumn = column.concat(Array(4 - column.length).fill(0));
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== newColumn[i]) {
                moved = true;
            }
            grid[i][j] = newColumn[i];
        }
    }
    return moved;
}

// Move down
function moveDown() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        const column = grid.map(row => row[j]).filter(cell => cell !== 0);
        for (let i = column.length - 1; i > 0; i--) {
            if (column[i] === column[i - 1]) {
                column[i] *= 2;
                score += column[i];
                column.splice(i - 1, 1);
                moved = true;
                playSound('merge');
            }
        }
        const newColumn = Array(4 - column.length).fill(0).concat(column);
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== newColumn[i]) {
                moved = true;
            }
            grid[i][j] = newColumn[i];
        }
    }
    return moved;
}

// Check game state
function checkGameState() {
    // Check for win
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 2048) {
                hasWon = true;
                showWinScreen();
                return;
            }
        }
    }

    // Check for game over
    if (isGridFull()) {
        isGameOver = true;
        showGameOverScreen();
    }
}

// Check if grid is full
function isGridFull() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return false;
        }
    }
    return true;
}

// Update score
function updateScore() {
    scoreElement.textContent = score;
    if (score > bestScore) {
        bestScore = score;
        bestScoreElement.textContent = bestScore;
    }
}

// Show game over screen
function showGameOverScreen() {
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    finalScoreElement.textContent = score;
    playerNameDisplay.textContent = playerName;
    playSound('gameOver');
    trackGameOver();
}

// Show win screen
function showWinScreen() {
    gameScreen.classList.add('hidden');
    winScreen.classList.remove('hidden');
    winFinalScoreElement.textContent = score;
    winPlayerNameDisplay.textContent = playerName;
    playSound('win');
    trackWin();
}

// Update leaderboard
function updateLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('2046Leaderboard') || '[]');
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboardList.innerHTML = leaderboard.slice(0, 5).map((entry, index) => `
        <div class="leaderboard-entry">
            <span>${index + 1}. ${entry.name}</span>
            <span>${entry.score}</span>
        </div>
    `).join('');
}

// Save to leaderboard
function saveToLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('2046Leaderboard') || '[]');
    leaderboard.push({ name: playerName, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('2046Leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
}

// Undo move
function undoMove() {
    if (moveHistory.length > 0) {
        grid = moveHistory.pop();
        renderGrid();
        if (moveHistory.length === 0) {
            document.getElementById('undoMove').disabled = true;
        }
    }
}

// Play sound
function playSound(sound) {
    if (!isSoundEnabled) return;
    switch (sound) {
        case 'move':
            moveSound.currentTime = 0;
            moveSound.play();
            break;
        case 'merge':
            mergeSound.currentTime = 0;
            mergeSound.play();
            break;
        case 'gameOver':
            gameOverSound.currentTime = 0;
            gameOverSound.play();
            break;
        case 'win':
            winSound.currentTime = 0;
            winSound.play();
            break;
    }
}

// Track game events with Google Analytics
function trackGameStart() {
    gtag('event', 'game_start', {
        'game_name': '2046',
        'player_name': playerName
    });
}

function trackGameOver() {
    gtag('event', 'game_over', {
        'game_name': '2046',
        'player_name': playerName,
        'score': score
    });
}

function trackWin() {
    gtag('event', 'game_win', {
        'game_name': '2046',
        'player_name': playerName,
        'score': score
    });
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (isGameOver || hasWon) return;
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            move('left');
            break;
        case 'ArrowRight':
            e.preventDefault();
            move('right');
            break;
        case 'ArrowUp':
            e.preventDefault();
            move('up');
            break;
        case 'ArrowDown':
            e.preventDefault();
            move('down');
            break;
    }
});

// Touch events for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    if (isGameOver || hasWon) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) move('right');
        else move('left');
    } else {
        if (deltaY > 0) move('down');
        else move('up');
    }
});

// Button event listeners
document.getElementById('startGame').addEventListener('click', () => {
    playerName = playerNameInput.value.trim() || 'Anonymous';
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    initGame();
    trackGameStart();
});

document.getElementById('newGame').addEventListener('click', () => {
    initGame();
    trackGameStart();
});

document.getElementById('undoMove').addEventListener('click', undoMove);

document.getElementById('playAgain').addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    initGame();
    trackGameStart();
});

document.getElementById('continuePlaying').addEventListener('click', () => {
    winScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    hasWon = false;
});

document.getElementById('mainMenu').addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    saveToLeaderboard();
});

document.getElementById('winMainMenu').addEventListener('click', () => {
    winScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    saveToLeaderboard();
});

toggleMusicButton.addEventListener('click', () => {
    isMusicEnabled = !isMusicEnabled;
    if (isMusicEnabled) {
        backgroundMusic.play();
        toggleMusicButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        backgroundMusic.pause();
        toggleMusicButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
});

toggleSoundButton.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    toggleSoundButton.innerHTML = isSoundEnabled ?
        '<i class="fas fa-volume-mute"></i>' :
        '<i class="fas fa-volume-off"></i>';
});

// Initialize game
initGame();

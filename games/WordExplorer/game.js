// Word Explorer - Game Logic
// Main game functionality for the crossword puzzle game

// Game state
let gameState = {
    currentLevel: 1,
    hintsRemaining: 3,
    selectedCell: null,
    selectedDirection: 'across',
    selectedWord: null,
    completedWords: [],
    grid: [],
    userAnswers: []
};

// Audio elements
const correctSound = document.getElementById('correctSound');
const incorrectSound = document.getElementById('incorrectSound');
const completeSound = document.getElementById('completeSound');
const backgroundMusic = document.getElementById('backgroundMusic');
const hintSound = document.getElementById('hintSound');

// Audio state
let isMusicEnabled = true;
let isSoundEnabled = true;

// DOM elements
const levelSelectScreen = document.getElementById('levelSelectScreen');
const gameScreen = document.getElementById('gameScreen');
const levelCompleteScreen = document.getElementById('levelCompleteScreen');
const wordAnimationContainer = document.getElementById('wordAnimationContainer');
const crosswordGrid = document.getElementById('crosswordGrid');
const acrossClues = document.getElementById('acrossClues');
const downClues = document.getElementById('downClues');
const keyboard = document.getElementById('keyboard');
const currentLevelElement = document.getElementById('currentLevel');
const hintsRemainingElement = document.getElementById('hintsRemaining');
const completedLevelElement = document.getElementById('completedLevel');
const learnedWordsElement = document.getElementById('learnedWords');
const levelGrid = document.querySelector('.level-grid');

// Initialize the game
function initGame() {
    // Load saved progress
    loadProgress();

    // Generate level selection buttons
    generateLevelButtons();

    // Add event listeners
    addEventListeners();

    // Show level selection screen
    showScreen(levelSelectScreen);

    // Play background music
    playMusic();

    // Track game start
    trackGameStart();
}

// Load saved progress
function loadProgress() {
    const savedProgress = localStorage.getItem('wordExplorerProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        gameState.completedWords = progress.completedWords || [];
    }
}

// Save progress
function saveProgress() {
    const progress = {
        completedWords: gameState.completedWords
    };
    localStorage.setItem('wordExplorerProgress', JSON.stringify(progress));
}

// Generate level selection buttons
function generateLevelButtons() {
    levelGrid.innerHTML = '';

    for (let i = 0; i < WordData.totalLevels; i++) {
        const level = i + 1;
        const button = document.createElement('button');
        button.className = 'level-button';
        button.textContent = level;

        // Check if level is completed
        if (isLevelCompleted(level)) {
            button.classList.add('completed');
        }

        // Check if level is locked
        if (level > 1 && !isLevelCompleted(level - 1)) {
            button.classList.add('locked');
            button.disabled = true;
        }

        button.addEventListener('click', () => {
            if (!button.disabled) {
                loadLevel(level);
            }
        });

        levelGrid.appendChild(button);
    }
}

// Check if level is completed
function isLevelCompleted(level) {
    const levelData = WordData.levels.find(l => l.id === level);
    if (!levelData) return false;

    return levelData.words.every(word =>
        gameState.completedWords.includes(`${level}-${word.id}`)
    );
}

// Load level
function loadLevel(level) {
    // Set current level
    gameState.currentLevel = level;
    currentLevelElement.textContent = level;

    // Get level data
    const levelData = WordData.levels.find(l => l.id === level);
    if (!levelData) return;

    // Set hints
    gameState.hintsRemaining = levelData.hintsAllowed;
    hintsRemainingElement.textContent = gameState.hintsRemaining;

    // Reset game state
    gameState.selectedCell = null;
    gameState.selectedDirection = 'across';
    gameState.selectedWord = null;
    gameState.grid = [];
    gameState.userAnswers = [];

    // Generate grid
    generateGrid(levelData);

    // Generate clues
    generateClues(levelData);

    // Generate keyboard
    generateKeyboard();

    // Show game screen
    showScreen(gameScreen);

    // Track level start
    trackLevelStart(level);
}

// Generate grid
function generateGrid(levelData) {
    crosswordGrid.innerHTML = '';

    // Set grid dimensions
    crosswordGrid.style.gridTemplateRows = `repeat(${levelData.grid.rows}, var(--grid-cell-size))`;
    crosswordGrid.style.gridTemplateColumns = `repeat(${levelData.grid.cols}, var(--grid-cell-size))`;

    // Initialize grid and user answers
    gameState.grid = Array(levelData.grid.rows).fill().map(() =>
        Array(levelData.grid.cols).fill(null)
    );

    gameState.userAnswers = Array(levelData.grid.rows).fill().map(() =>
        Array(levelData.grid.cols).fill('')
    );

    // Find cells that need number indicators
    const cellNumbers = {};
    levelData.words.forEach(word => {
        const key = `${word.row}-${word.col}`;
        if (!cellNumbers[key]) {
            cellNumbers[key] = word.id;
        }
    });

    // Create grid cells
    for (let row = 0; row < levelData.grid.rows; row++) {
        for (let col = 0; col < levelData.grid.cols; col++) {
            const cellData = levelData.grid.data[row]?.[col];

            // Create cell
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            // Check if cell is a black cell
            if (cellData === null) {
                cell.classList.add('black');
                gameState.grid[row][col] = null;
            } else {
                // Check if cell needs a number indicator
                const cellKey = `${row}-${col}`;
                if (cellNumbers[cellKey]) {
                    const cellNumber = document.createElement('span');
                    cellNumber.className = 'cell-number';
                    cellNumber.textContent = cellNumbers[cellKey];
                    cell.appendChild(cellNumber);

                    // Find word that starts with this number
                    const word = levelData.words.find(w => w.id === cellNumbers[cellKey]);
                    if (word) {
                        cell.dataset.wordId = word.id;
                        cell.dataset.wordDirection = word.direction;
                    }
                }

                // Find the correct letter for this cell
                const correctLetter = findCorrectLetterForCell(levelData, row, col);
                gameState.grid[row][col] = correctLetter;

                // If cell has a letter in the grid data, use it
                if (typeof cellData === 'string') {
                    gameState.grid[row][col] = cellData.toUpperCase();
                }

                // Add click event
                cell.addEventListener('click', () => selectCell(row, col));
            }

            crosswordGrid.appendChild(cell);
        }
    }
}

// Helper function to find the correct letter for a cell
function findCorrectLetterForCell(levelData, row, col) {
    for (const word of levelData.words) {
        if (word.direction === 'across') {
            // Check if the cell is part of this across word
            if (row === word.row && col >= word.col && col < word.col + word.word.length) {
                // Calculate the index in the word
                const letterIndex = col - word.col;
                return word.word[letterIndex].toUpperCase();
            }
        } else { // down
            // Check if the cell is part of this down word
            if (col === word.col && row >= word.row && row < word.row + word.word.length) {
                // Calculate the index in the word
                const letterIndex = row - word.row;
                return word.word[letterIndex].toUpperCase();
            }
        }
    }
    return '';
}

// Generate clues
function generateClues(levelData) {
    acrossClues.innerHTML = '';
    downClues.innerHTML = '';

    // Sort words by id
    const sortedWords = [...levelData.words].sort((a, b) => a.id - b.id);

    // Create clue elements
    sortedWords.forEach(word => {
        const clueItem = document.createElement('li');
        clueItem.className = 'clue-item';
        clueItem.dataset.wordId = word.id;
        clueItem.dataset.direction = word.direction;
        clueItem.textContent = `${word.id}. ${word.clue}`;

        // Check if word is completed
        if (isWordCompleted(word)) {
            clueItem.classList.add('completed');
        }

        // Add click event
        clueItem.addEventListener('click', () => selectWord(word));

        // Add to appropriate list
        if (word.direction === 'across') {
            acrossClues.appendChild(clueItem);
        } else {
            downClues.appendChild(clueItem);
        }
    });
}

// Generate keyboard
function generateKeyboard() {
    keyboard.innerHTML = '';

    // Create keys A-Z
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const key = document.createElement('button');
        key.className = 'key';
        key.textContent = letter;
        key.addEventListener('click', () => enterLetter(letter));
        keyboard.appendChild(key);
    }

    // Create delete key
    const deleteKey = document.createElement('button');
    deleteKey.className = 'key';
    deleteKey.textContent = '⌫';
    deleteKey.addEventListener('click', deleteLetter);
    keyboard.appendChild(deleteKey);
}

// Select cell
function selectCell(row, col) {
    // Deselect previous cell
    if (gameState.selectedCell) {
        const prevCell = document.querySelector(`.grid-cell[data-row="${gameState.selectedCell.row}"][data-col="${gameState.selectedCell.col}"]`);
        if (prevCell) prevCell.classList.remove('selected');
    }

    // Select new cell
    const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
    if (cell && !cell.classList.contains('black')) {
        cell.classList.add('selected');
        gameState.selectedCell = { row, col };

        // Determine word direction
        if (cell.dataset.wordDirection) {
            gameState.selectedDirection = cell.dataset.wordDirection;
        }

        // Highlight current word
        highlightCurrentWord();
    }
}

// Select word
function selectWord(word) {
    // Deselect previous word
    if (gameState.selectedWord) {
        const prevClue = document.querySelector(`.clue-item[data-word-id="${gameState.selectedWord.id}"]`);
        if (prevClue) prevClue.classList.remove('active');
    }

    // Select new word
    const clue = document.querySelector(`.clue-item[data-word-id="${word.id}"]`);
    if (clue) {
        clue.classList.add('active');
        gameState.selectedWord = word;
        gameState.selectedDirection = word.direction;

        // Select first cell of word
        selectCell(word.row, word.col);
    }
}

// Highlight current word
function highlightCurrentWord() {
    // Remove previous highlights
    const highlightedCells = document.querySelectorAll('.grid-cell.highlighted');
    highlightedCells.forEach(cell => cell.classList.remove('highlighted'));

    if (!gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;
    const direction = gameState.selectedDirection;

    // Find word at current position
    const levelData = WordData.levels.find(l => l.id === gameState.currentLevel);
    if (!levelData) return;

    let wordToHighlight = null;

    // Check if cell is part of a word in the selected direction
    for (const word of levelData.words) {
        if (word.direction !== direction) continue;

        let isPartOfWord = false;
        let wordCells = [];

        if (direction === 'across') {
            if (row === word.row && col >= word.col && col < word.col + word.word.length) {
                isPartOfWord = true;
                for (let c = 0; c < word.word.length; c++) {
                    wordCells.push({ row: word.row, col: word.col + c });
                }
            }
        } else { // down
            if (col === word.col && row >= word.row && row < word.row + word.word.length) {
                isPartOfWord = true;
                for (let r = 0; r < word.word.length; r++) {
                    wordCells.push({ row: word.row + r, col: word.col });
                }
            }
        }

        if (isPartOfWord) {
            wordToHighlight = { word, cells: wordCells };
            break;
        }
    }

    // If no word found in the selected direction, try the other direction
    if (!wordToHighlight) {
        const otherDirection = direction === 'across' ? 'down' : 'across';

        for (const word of levelData.words) {
            if (word.direction !== otherDirection) continue;

            let isPartOfWord = false;
            let wordCells = [];

            if (otherDirection === 'across') {
                if (row === word.row && col >= word.col && col < word.col + word.word.length) {
                    isPartOfWord = true;
                    for (let c = 0; c < word.word.length; c++) {
                        wordCells.push({ row: word.row, col: word.col + c });
                    }
                }
            } else { // down
                if (col === word.col && row >= word.row && row < word.row + word.word.length) {
                    isPartOfWord = true;
                    for (let r = 0; r < word.word.length; r++) {
                        wordCells.push({ row: word.row + r, col: word.col });
                    }
                }
            }

            if (isPartOfWord) {
                wordToHighlight = { word, cells: wordCells };
                gameState.selectedDirection = otherDirection; // Switch direction
                break;
            }
        }
    }

    // Highlight word cells
    if (wordToHighlight) {
        wordToHighlight.cells.forEach(({ row, col }) => {
            const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
            if (cell && !cell.classList.contains('black')) {
                cell.classList.add('highlighted');
            }
        });

        // Select word in clue list
        selectWord(wordToHighlight.word);
    }
}

// Enter letter
function enterLetter(letter) {
    if (!gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;
    const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);

    if (cell && !cell.classList.contains('black')) {
        // Update user answer
        gameState.userAnswers[row][col] = letter;

        // Update cell text
        const existingLetter = cell.querySelector('.letter');
        if (existingLetter) {
            existingLetter.textContent = letter;
        } else {
            const letterElement = document.createElement('span');
            letterElement.className = 'letter';
            letterElement.textContent = letter;
            cell.appendChild(letterElement);
        }

        // Check if the letter is correct
        const correctLetter = gameState.grid[row][col];
        if (letter === correctLetter) {
            cell.classList.add('correct');
            setTimeout(() => {
                cell.classList.remove('correct');
            }, 500);
        }

        // Move to next cell
        setTimeout(() => {
            moveToNextCell();
        }, 100);
    }
}

// Delete letter
function deleteLetter() {
    if (!gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;
    const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);

    if (cell && !cell.classList.contains('black')) {
        // Update user answer
        gameState.userAnswers[row][col] = '';

        // Update cell text
        const letterElement = cell.querySelector('.letter');
        if (letterElement) {
            cell.removeChild(letterElement);
        }

        // Move to previous cell
        moveToPreviousCell();
    }
}

// Move to next cell
function moveToNextCell() {
    if (!gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;
    const direction = gameState.selectedDirection;

    let nextRow = row;
    let nextCol = col;

    if (direction === 'across') {
        nextCol++;
    } else { // down
        nextRow++;
    }

    // Check if next cell exists and is not black
    const nextCell = document.querySelector(`.grid-cell[data-row="${nextRow}"][data-col="${nextCol}"]`);
    if (nextCell && !nextCell.classList.contains('black')) {
        selectCell(nextRow, nextCol);
    }
}

// Move to previous cell
function moveToPreviousCell() {
    if (!gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;
    const direction = gameState.selectedDirection;

    let prevRow = row;
    let prevCol = col;

    if (direction === 'across') {
        prevCol--;
    } else { // down
        prevRow--;
    }

    // Check if previous cell exists and is not black
    const prevCell = document.querySelector(`.grid-cell[data-row="${prevRow}"][data-col="${prevCol}"]`);
    if (prevCell && !prevCell.classList.contains('black')) {
        selectCell(prevRow, prevCol);
    }
}

// Check answers
function checkAnswers() {
    const levelData = WordData.levels.find(l => l.id === gameState.currentLevel);
    if (!levelData) return;

    let allCorrect = true;
    let newlyCompletedWords = [];

    // Check each word
    for (const word of levelData.words) {
        let wordCorrect = true;

        // Check each letter of the word
        for (let i = 0; i < word.word.length; i++) {
            const row = word.direction === 'across' ? word.row : word.row + i;
            const col = word.direction === 'across' ? word.col + i : word.col;

            const expectedLetter = word.word[i].toUpperCase();
            const userLetter = gameState.userAnswers[row][col];

            if (userLetter !== expectedLetter) {
                wordCorrect = false;
                allCorrect = false;

                // Mark cell as incorrect
                const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
                if (cell) {
                    cell.classList.add('incorrect');
                    setTimeout(() => {
                        cell.classList.remove('incorrect');
                    }, 1000);
                }
            }
        }

        // If word is correct and not already completed
        if (wordCorrect && !isWordCompleted(word)) {
            // Mark word as completed
            const wordId = `${gameState.currentLevel}-${word.id}`;
            gameState.completedWords.push(wordId);

            // Mark clue as completed
            const clue = document.querySelector(`.clue-item[data-word-id="${word.id}"]`);
            if (clue) {
                clue.classList.add('completed');
            }

            // Add to newly completed words
            newlyCompletedWords.push(word);
        }
    }

    // Play sound
    if (allCorrect) {
        playSound('complete');
    } else {
        playSound('incorrect');
    }

    // Save progress
    saveProgress();

    // Show animations for newly completed words
    if (newlyCompletedWords.length > 0) {
        showWordAnimations(newlyCompletedWords);
    }

    // Check if level is completed
    if (isLevelCompleted(gameState.currentLevel)) {
        setTimeout(() => {
            showLevelComplete();
        }, newlyCompletedWords.length * 1500 + 500);
    }
}

// Show word animations
function showWordAnimations(words) {
    wordAnimationContainer.innerHTML = '';
    wordAnimationContainer.classList.remove('hidden');

    words.forEach((word, index) => {
        setTimeout(() => {
            const animatedWord = document.createElement('div');
            animatedWord.className = 'animated-word';
            animatedWord.textContent = word.word;
            wordAnimationContainer.appendChild(animatedWord);

            // Remove after animation
            setTimeout(() => {
                wordAnimationContainer.removeChild(animatedWord);

                // Hide container if no more words
                if (wordAnimationContainer.children.length === 0) {
                    wordAnimationContainer.classList.add('hidden');
                }
            }, 1500);
        }, index * 1500);
    });
}

// Show level complete screen
function showLevelComplete() {
    // Update level complete screen
    completedLevelElement.textContent = gameState.currentLevel;

    // Update learned words
    const levelData = WordData.levels.find(l => l.id === gameState.currentLevel);
    if (levelData) {
        learnedWordsElement.innerHTML = '';
        levelData.words.forEach(word => {
            const wordItem = document.createElement('li');
            wordItem.textContent = word.word;
            learnedWordsElement.appendChild(wordItem);
        });
    }

    // Show level complete screen
    showScreen(levelCompleteScreen);

    // Play sound
    playSound('complete');

    // Track level complete
    trackLevelComplete(gameState.currentLevel);

    // Update level buttons
    generateLevelButtons();
}

// Use hint
function useHint() {
    if (gameState.hintsRemaining <= 0) return;

    if (!gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;
    const levelData = WordData.levels.find(l => l.id === gameState.currentLevel);
    if (!levelData) return;

    // Find correct letter
    const correctLetter = gameState.grid[row][col];
    if (!correctLetter) return;

    // Update user answer
    gameState.userAnswers[row][col] = correctLetter;

    // Update cell
    const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
        // Remove existing letter
        const existingLetter = cell.querySelector('.letter');
        if (existingLetter) {
            cell.removeChild(existingLetter);
        }

        // Add correct letter
        const letterElement = document.createElement('span');
        letterElement.className = 'letter';
        letterElement.textContent = correctLetter;
        cell.appendChild(letterElement);

        // Highlight cell as correct
        cell.classList.add('correct');
        setTimeout(() => {
            cell.classList.remove('correct');
        }, 1000);
    }

    // Decrease hints
    gameState.hintsRemaining--;
    hintsRemainingElement.textContent = gameState.hintsRemaining;

    // Disable hint button if no hints left
    if (gameState.hintsRemaining <= 0) {
        document.getElementById('useHint').disabled = true;
    }

    // Play sound
    playSound('hint');

    // Move to next cell
    moveToNextCell();
}

// Reset puzzle
function resetPuzzle() {
    const levelData = WordData.levels.find(l => l.id === gameState.currentLevel);
    if (!levelData) return;

    // Reset user answers
    gameState.userAnswers = Array(levelData.grid.rows).fill().map(() =>
        Array(levelData.grid.cols).fill('')
    );

    // Reset grid cells
    const cells = document.querySelectorAll('.grid-cell:not(.black)');
    cells.forEach(cell => {
        const letterElement = cell.querySelector('.letter');
        if (letterElement) {
            cell.removeChild(letterElement);
        }

        cell.classList.remove('correct', 'incorrect');
    });

    // Reset selection
    gameState.selectedCell = null;
    gameState.selectedWord = null;

    // Reset hints
    gameState.hintsRemaining = levelData.hintsAllowed;
    hintsRemainingElement.textContent = gameState.hintsRemaining;
    document.getElementById('useHint').disabled = false;
}

// Check if word is completed
function isWordCompleted(word) {
    const wordId = `${gameState.currentLevel}-${word.id}`;
    return gameState.completedWords.includes(wordId);
}

// Show screen
function showScreen(screen) {
    // Hide all screens
    levelSelectScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    levelCompleteScreen.classList.add('hidden');

    // Show selected screen
    screen.classList.remove('hidden');
}

// Play sound
function playSound(sound) {
    if (!isSoundEnabled) return;

    switch (sound) {
        case 'correct':
            correctSound.currentTime = 0;
            correctSound.play();
            break;
        case 'incorrect':
            incorrectSound.currentTime = 0;
            incorrectSound.play();
            break;
        case 'complete':
            completeSound.currentTime = 0;
            completeSound.play();
            break;
        case 'hint':
            hintSound.currentTime = 0;
            hintSound.play();
            break;
    }
}

// Play music
function playMusic() {
    if (isMusicEnabled) {
        backgroundMusic.play();
    }
}

// Toggle music
function toggleMusic() {
    isMusicEnabled = !isMusicEnabled;

    if (isMusicEnabled) {
        backgroundMusic.play();
        document.getElementById('toggleMusic').innerHTML = '<span class="icon">🎵</span>';
    } else {
        backgroundMusic.pause();
        document.getElementById('toggleMusic').innerHTML = '<span class="icon">🔇</span>';
    }
}

// Toggle sound
function toggleSound() {
    isSoundEnabled = !isSoundEnabled;

    document.getElementById('toggleSound').innerHTML = isSoundEnabled ?
        '<span class="icon">🔊</span>' :
        '<span class="icon">🔇</span>';
}

// Add event listeners
function addEventListeners() {
    // Button event listeners
    document.getElementById('useHint').addEventListener('click', useHint);
    document.getElementById('checkAnswers').addEventListener('click', checkAnswers);
    document.getElementById('resetPuzzle').addEventListener('click', resetPuzzle);
    document.getElementById('backToLevels').addEventListener('click', () => showScreen(levelSelectScreen));
    document.getElementById('nextLevel').addEventListener('click', () => {
        const nextLevel = gameState.currentLevel + 1;
        if (nextLevel <= WordData.totalLevels) {
            loadLevel(nextLevel);
        } else {
            showScreen(levelSelectScreen);
        }
    });
    document.getElementById('replayLevel').addEventListener('click', () => {
        loadLevel(gameState.currentLevel);
    });
    document.getElementById('backToLevelSelect').addEventListener('click', () => {
        showScreen(levelSelectScreen);
    });
    document.getElementById('toggleMusic').addEventListener('click', toggleMusic);
    document.getElementById('toggleSound').addEventListener('click', toggleSound);

    // Keyboard event listeners
    document.addEventListener('keydown', (e) => {
        if (gameScreen.classList.contains('hidden')) return;

        if (e.key >= 'a' && e.key <= 'z' || e.key >= 'A' && e.key <= 'Z') {
            enterLetter(e.key.toUpperCase());
        } else if (e.key === 'Backspace') {
            deleteLetter();
        } else if (e.key === 'ArrowRight') {
            if (gameState.selectedDirection !== 'across') {
                gameState.selectedDirection = 'across';
                highlightCurrentWord();
            } else {
                moveToNextCell();
            }
        } else if (e.key === 'ArrowLeft') {
            if (gameState.selectedDirection !== 'across') {
                gameState.selectedDirection = 'across';
                highlightCurrentWord();
            } else {
                moveToPreviousCell();
            }
        } else if (e.key === 'ArrowDown') {
            if (gameState.selectedDirection !== 'down') {
                gameState.selectedDirection = 'down';
                highlightCurrentWord();
            } else {
                moveToNextCell();
            }
        } else if (e.key === 'ArrowUp') {
            if (gameState.selectedDirection !== 'down') {
                gameState.selectedDirection = 'down';
                highlightCurrentWord();
            } else {
                moveToPreviousCell();
            }
        } else if (e.key === 'Enter') {
            checkAnswers();
        }
    });
}

// Track game events with Google Analytics
function trackGameStart() {
    if (typeof gtag === 'function') {
        gtag('event', 'game_start', {
            'game_name': 'WordExplorer'
        });
    }
}

function trackLevelStart(level) {
    if (typeof gtag === 'function') {
        gtag('event', 'level_start', {
            'game_name': 'WordExplorer',
            'level': level
        });
    }
}

function trackLevelComplete(level) {
    if (typeof gtag === 'function') {
        gtag('event', 'level_complete', {
            'game_name': 'WordExplorer',
            'level': level
        });
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);

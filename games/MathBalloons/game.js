// Game state
const gameState = {
    score: 0,
    playerName: '',
    currentNumbers: [],
    correctAnswer: 0,
    isPlaying: false
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const playerNameInput = document.getElementById('player-name');
    const scoreDisplay = document.getElementById('score');
    const answerInput = document.getElementById('answer');
    const checkButton = document.getElementById('check-answer');
    const finalScoreDisplay = document.getElementById('final-score');
    const playerNameDisplay = document.getElementById('player-name-display');

    // Audio Elements
    const popSound = document.getElementById('pop-sound');
    const correctSound = document.getElementById('correct-sound');
    const incorrectSound = document.getElementById('incorrect-sound');
    const backgroundMusic = document.getElementById('background-music');

    // Debug logging
    console.log('DOM Elements:', {
        startScreen,
        gameScreen,
        gameOverScreen,
        playerNameInput,
        scoreDisplay,
        answerInput,
        checkButton,
        finalScoreDisplay,
        playerNameDisplay
    });

    // Event Listeners
    const startButton = document.getElementById('start-button');
    console.log('Start Button:', startButton);

    if (startButton) {
        startButton.addEventListener('click', () => {
            console.log('Start button clicked');
            startGame();
        });
    } else {
        console.error('Start button not found!');
    }

    // Add Enter key listener for player name input
    playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            console.log('Enter key pressed on player name input');
            startGame();
        }
    });

    document.getElementById('play-again-button').addEventListener('click', () => {
        console.log('Play again button clicked');
        startGame();
    });

    document.getElementById('main-menu-button').addEventListener('click', () => {
        console.log('Main menu button clicked');
        showScreen(startScreen);
    });

    checkButton.addEventListener('click', () => {
        console.log('Check answer button clicked');
        checkAnswer();
    });

    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            console.log('Enter key pressed');
            checkAnswer();
        }
    });

    // Sound Controls
    document.getElementById('toggle-sound').addEventListener('click', () => {
        console.log('Toggle sound clicked');
        toggleSound();
    });

    document.getElementById('toggle-music').addEventListener('click', () => {
        console.log('Toggle music clicked');
        toggleMusic();
    });

    // Game Functions
    function startGame() {
        console.log('Starting game...');
        initAudio();
        gameState.score = 0;
        gameState.playerName = playerNameInput.value.trim() || 'Player';
        gameState.isPlaying = true;

        updateScore();
        showScreen(gameScreen);

        // Get the balloons container
        const balloonsContainer = document.getElementById('balloons-container');
        console.log('Looking for balloons container:', balloonsContainer);

        if (!balloonsContainer) {
            console.error('Balloons container not found!');
            return;
        }

        // Create the first problem
        generateNewProblem(balloonsContainer);
        answerInput.focus();
        console.log('Game started successfully');
    }

    function generateNewProblem(balloonsContainer) {
        console.log('Generating new problem...');
        // Generate two random numbers between 1 and 20
        gameState.currentNumbers = [
            Math.floor(Math.random() * 20) + 1,
            Math.floor(Math.random() * 20) + 1
        ];
        gameState.correctAnswer = gameState.currentNumbers[0] + gameState.currentNumbers[1];

        // Create balloons
        createBalloons(balloonsContainer);
        console.log('New problem generated:', gameState.currentNumbers);
    }

    function createBalloons(balloonsContainer) {
        console.log('Creating numbers...');
        if (!balloonsContainer) {
            console.error('Numbers container not found in createBalloons!');
            return;
        }

        balloonsContainer.innerHTML = '';

        gameState.currentNumbers.forEach((number, index) => {
            const numberElement = document.createElement('div');
            numberElement.className = 'number';
            numberElement.style.backgroundColor = index === 0 ? '#FF6B6B' : '#4ECDC4';
            numberElement.textContent = number;

            // Add click event for sound only
            numberElement.addEventListener('click', () => {
                if (gameState.isPlaying) {
                    const popSound = document.getElementById('pop-sound');
                    popSound.currentTime = 0;
                    popSound.play().catch(error => {
                        console.log('Pop sound play prevented:', error);
                    });
                }
            });

            balloonsContainer.appendChild(numberElement);
        });
        console.log('Numbers created');
    }

    function checkAnswer() {
        console.log('Checking answer...');
        const userAnswer = parseInt(answerInput.value);

        if (isNaN(userAnswer)) {
            showError('Please enter a valid number');
            return;
        }

        if (userAnswer === gameState.correctAnswer) {
            handleCorrectAnswer();
        } else {
            handleIncorrectAnswer();
        }
    }

    function handleCorrectAnswer() {
        console.log('Correct answer!');
        gameState.score += 10;
        const correctSound = document.getElementById('correct-sound');
        correctSound.currentTime = 0;
        correctSound.play().catch(error => {
            console.log('Correct sound play prevented:', error);
        });

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Great Job! +10';
        document.body.appendChild(successMessage);

        // Animate score
        const scoreElement = document.getElementById('score');
        scoreElement.classList.add('pop');
        setTimeout(() => scoreElement.classList.remove('pop'), 500);

        // Pop numbers with sparkle effect
        const numbers = document.querySelectorAll('.number');
        numbers.forEach((number, index) => {
            setTimeout(() => {
                number.classList.add('sparkle');
                setTimeout(() => {
                    number.classList.add('pop');
                    setTimeout(() => {
                        number.remove();
                    }, 500);
                }, 200);
            }, index * 200);
        });

        // Wait for animations to complete before generating new problem
        setTimeout(() => {
            const balloonsContainer = document.getElementById('balloons-container');
            if (balloonsContainer) {
                generateNewProblem(balloonsContainer);
            }
        }, numbers.length * 200 + 700);

        answerInput.value = '';
        answerInput.focus();
    }

    function handleIncorrectAnswer() {
        console.log('Incorrect answer');
        const incorrectSound = document.getElementById('incorrect-sound');
        incorrectSound.currentTime = 0;
        incorrectSound.play().catch(error => {
            console.log('Incorrect sound play prevented:', error);
        });

        showError('Try again!');
        answerInput.value = '';
        answerInput.focus();
    }

    function showError(message) {
        console.log('Showing error:', message);
        answerInput.classList.add('error');
        answerInput.value = message;
        setTimeout(() => {
            answerInput.classList.remove('error');
            answerInput.value = '';
        }, 1000);
    }

    function showSuccess(message) {
        console.log('Showing success:', message);
        answerInput.classList.add('success');
        answerInput.value = message;
        setTimeout(() => {
            answerInput.classList.remove('success');
            answerInput.value = '';
        }, 1000);
    }

    function updateScore() {
        console.log('Updating score:', gameState.score);
        scoreDisplay.textContent = gameState.score;
    }

    function showGameOver() {
        console.log('Showing game over screen');
        gameState.isPlaying = false;
        finalScoreDisplay.textContent = gameState.score;
        playerNameDisplay.textContent = gameState.playerName;
        showScreen(gameOverScreen);
    }

    function showScreen(screen) {
        console.log('Showing screen:', screen.id);
        [startScreen, gameScreen, gameOverScreen].forEach(s => {
            s.style.display = 'none';
        });
        screen.style.display = 'block';

        // Show/hide balloons container and game header based on current screen
        const balloonsContainer = document.getElementById('balloons-container');
        const gameHeader = document.getElementById('game-header');

        if (balloonsContainer) {
            balloonsContainer.style.display = screen.id === 'game-screen' ? 'flex' : 'none';
        }

        if (gameHeader) {
            gameHeader.style.display = screen.id === 'game-screen' ? 'flex' : 'none';
        }
    }

    function toggleSound() {
        console.log('Toggling sound');
        const isMuted = popSound.muted;
        popSound.muted = !isMuted;
        correctSound.muted = !isMuted;
        incorrectSound.muted = !isMuted;
        document.getElementById('toggle-sound').textContent = isMuted ? '🔊' : '🔈';
    }

    function toggleMusic() {
        console.log('Toggling music');
        const isMuted = backgroundMusic.muted;
        backgroundMusic.muted = !isMuted;
        document.getElementById('toggle-music').textContent = isMuted ? '🎵' : '🎵';
    }

    // Initialize audio
    function initAudio() {
        // Set initial volume
        popSound.volume = 0.5;
        correctSound.volume = 0.5;
        incorrectSound.volume = 0.5;
        backgroundMusic.volume = 0.3;

        // Preload sounds
        popSound.load();
        correctSound.load();
        incorrectSound.load();
        backgroundMusic.load();

        // Start background music
        backgroundMusic.play().catch(error => {
            console.log('Background music autoplay prevented:', error);
        });
    }

    // Initialize game
    console.log('Initializing game...');
    showScreen(startScreen);
    console.log('Game initialized');
});

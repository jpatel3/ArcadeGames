document.addEventListener('DOMContentLoaded', () => {
    // Game configuration
    const config = {
        totalSpaces: 20,
        roarSpaces: [5, 10, 15, 20],
        dinoStartPosition: -10,
        dinoRoarMove: 3,
        numPlayers: 2,
        diceMax: 6,
        confettiCount: 150, // Number of confetti pieces
        confettiColors: ['#ffcc00', '#ff9900', '#ff6600', '#4a752c', '#ffffff', '#ff3366']
    };

    // Audio state
    const audio = {
        musicEnabled: true,
        soundEnabled: true,
        elements: {
            backgroundMusic: document.getElementById('background-music'),
            diceSound: document.getElementById('dice-sound'),
            moveSound: document.getElementById('move-sound'),
            roarSound: document.getElementById('roar-sound'),
            winSound: document.getElementById('win-sound'),
            loseSound: document.getElementById('lose-sound')
        }
    };

    // Game state
    const gameState = {
        players: [],
        dinoPosition: config.dinoStartPosition,
        currentPlayerIndex: 0,
        gameOver: false,
        winner: null
    };

    // DOM elements
    const elements = {
        startScreen: document.getElementById('start-screen'),
        gameScreen: document.getElementById('game-screen'),
        player1NameInput: document.getElementById('player1-name'),
        player2NameInput: document.getElementById('player2-name'),
        player1TokenOptions: document.querySelectorAll('#player1-tokens .token-option'),
        player2TokenOptions: document.querySelectorAll('#player2-tokens .token-option'),
        startGameButton: document.getElementById('start-game-button'),
        pathContainer: document.querySelector('.path-container'),
        playersContainer: document.querySelector('.players-container'),
        dinoContainer: document.querySelector('.dino-container'),
        rollButton: document.getElementById('roll-button'),
        restartButton: document.getElementById('restart-button'),
        currentPlayerDisplay: document.getElementById('current-player'),
        diceResultDisplay: document.getElementById('dice-result'),
        gameMessageDisplay: document.getElementById('game-message'),
        confettiContainer: document.getElementById('confetti-container'),
        musicToggle: document.getElementById('music-toggle'),
        soundToggle: document.getElementById('sound-toggle')
    };

    // Add event listeners for audio controls
    elements.musicToggle.addEventListener('click', toggleMusic);
    elements.soundToggle.addEventListener('click', toggleSound);

    // Function to initialize audio
    function initAudio() {
        // Create context for audio to work around autoplay restrictions
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            const audioContext = new AudioContext();

            // Load all audio files
            Object.values(audio.elements).forEach(audioElement => {
                // Set volume
                audioElement.volume = 0.5;

                // Preload audio
                audioElement.load();
            });
        }
    }

    // Function to toggle background music
    function toggleMusic() {
        audio.musicEnabled = !audio.musicEnabled;

        if (audio.musicEnabled) {
            elements.musicToggle.classList.remove('muted');
            elements.musicToggle.innerHTML = '<i class="fas fa-music"></i>';

            // Try to play music
            const playPromise = audio.elements.backgroundMusic.play();

            // Handle play promise to avoid uncaught errors
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Autoplay prevented: ", error);
                    // Show a message to the user that they need to interact with the page first
                    elements.gameMessageDisplay.textContent = "Click anywhere to enable sound";

                    // Add a one-time click handler to the document
                    const enableAudio = () => {
                        audio.elements.backgroundMusic.play();
                        document.removeEventListener('click', enableAudio);
                        elements.gameMessageDisplay.textContent = "";
                    };
                    document.addEventListener('click', enableAudio);
                });
            }
        } else {
            elements.musicToggle.classList.add('muted');
            elements.musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            audio.elements.backgroundMusic.pause();
        }
    }

    // Function to toggle sound effects
    function toggleSound() {
        audio.soundEnabled = !audio.soundEnabled;

        if (audio.soundEnabled) {
            elements.soundToggle.classList.remove('muted');
            elements.soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            elements.soundToggle.classList.add('muted');
            elements.soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    }

    // Function to play a sound
    function playSound(soundName) {
        if (!audio.soundEnabled) return;

        const sound = audio.elements[soundName];
        if (sound) {
            // Reset the audio to the beginning
            sound.currentTime = 0;

            // Try to play the sound
            const playPromise = sound.play();

            // Handle play promise to avoid uncaught errors
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log(`Error playing ${soundName}: `, error);
                });
            }
        }
    }

    // Add event listeners for token selection
    elements.player1TokenOptions.forEach(option => {
        option.addEventListener('click', () => selectToken(option, 1));
    });

    elements.player2TokenOptions.forEach(option => {
        option.addEventListener('click', () => selectToken(option, 2));
    });

    // Function to handle token selection
    function selectToken(option, playerNum) {
        // Get the token data
        const selectedToken = option.dataset.token;

        // Check if this token is already selected by the other player
        const otherPlayerNum = playerNum === 1 ? 2 : 1;
        const otherPlayerSelected = document.querySelector(`#player${otherPlayerNum}-tokens .token-option.selected`);

        if (otherPlayerSelected && otherPlayerSelected.dataset.token === selectedToken) {
            // Don't allow selection of the same token
            playSound('diceSound');
            elements.gameMessageDisplay.textContent = "This token is already chosen by the other player!";
            setTimeout(() => {
                elements.gameMessageDisplay.textContent = "";
            }, 2000);
            return;
        }

        // Remove selected class from all options for this player
        const selector = `#player${playerNum}-tokens .token-option`;
        document.querySelectorAll(selector).forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selected class to the clicked option
        option.classList.add('selected');

        // Play sound
        playSound('diceSound');

        // Update token availability
        updateTokenAvailability();
    }

    // Function to update token availability
    function updateTokenAvailability() {
        // Get selected tokens
        const player1Selected = document.querySelector('#player1-tokens .token-option.selected');
        const player2Selected = document.querySelector('#player2-tokens .token-option.selected');

        if (!player1Selected || !player2Selected) return;

        // Reset all tokens to available
        document.querySelectorAll('.token-option').forEach(option => {
            option.classList.remove('unavailable');
        });

        // Mark player 1's selected token as unavailable for player 2
        const player1Token = player1Selected.dataset.token;
        document.querySelectorAll(`#player2-tokens .token-option[data-token="${player1Token}"]`)
            .forEach(option => {
                if (!option.classList.contains('selected')) {
                    option.classList.add('unavailable');
                }
            });

        // Mark player 2's selected token as unavailable for player 1
        const player2Token = player2Selected.dataset.token;
        document.querySelectorAll(`#player1-tokens .token-option[data-token="${player2Token}"]`)
            .forEach(option => {
                if (!option.classList.contains('selected')) {
                    option.classList.add('unavailable');
                }
            });
    }

    // Add event listener for start game button
    elements.startGameButton.addEventListener('click', startGame);
    elements.restartButton.addEventListener('click', () => {
        // Show start screen again
        elements.gameScreen.classList.add('hidden');
        elements.startScreen.classList.remove('hidden');

        // Remove any winner announcement
        const winnerAnnouncement = document.querySelector('.winner-announcement');
        if (winnerAnnouncement) {
            winnerAnnouncement.remove();
        }

        // Clear confetti
        elements.confettiContainer.innerHTML = '';
    });

    // Start the game with player names and tokens
    function startGame() {
        // Get player names (use default names if empty)
        const player1Name = elements.player1NameInput.value.trim() || 'Player 1';
        const player2Name = elements.player2NameInput.value.trim() || 'Player 2';

        // Get selected tokens
        const player1TokenElement = document.querySelector('#player1-tokens .token-option.selected');
        const player2TokenElement = document.querySelector('#player2-tokens .token-option.selected');

        const player1Token = player1TokenElement ? player1TokenElement.dataset.token : 'token-1';
        const player2Token = player2TokenElement ? player2TokenElement.dataset.token : 'token-2';

        // Track game start event in Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'game_start', {
                'event_category': 'Game',
                'event_label': 'DinosaurChase',
                'player1_name': player1Name,
                'player2_name': player2Name
            });
        }

        // Hide start screen and show game screen
        elements.startScreen.classList.add('hidden');
        elements.gameScreen.classList.remove('hidden');

        // Start background music
        if (audio.musicEnabled) {
            audio.elements.backgroundMusic.play();
        }

        // Initialize the game with player names and tokens
        initGame(player1Name, player2Name, player1Token, player2Token);
    }

    // Initialize the game
    function initGame(player1Name = 'Player 1', player2Name = 'Player 2', player1Token = 'token-1', player2Token = 'token-2') {
        // Reset game state
        gameState.players = [];
        gameState.dinoPosition = config.dinoStartPosition;
        gameState.currentPlayerIndex = 0;
        gameState.gameOver = false;
        gameState.winner = null;

        // Create players with names and tokens
        gameState.players.push({
            id: 1,
            name: player1Name,
            position: 1,
            isOut: false,
            element: null,
            token: player1Token
        });

        gameState.players.push({
            id: 2,
            name: player2Name,
            position: 1,
            isOut: false,
            element: null,
            token: player2Token
        });

        // Clear existing elements
        elements.pathContainer.innerHTML = '';
        elements.playersContainer.innerHTML = '';
        elements.dinoContainer.innerHTML = '';
        elements.diceResultDisplay.innerHTML = '';
        elements.gameMessageDisplay.innerHTML = '';
        elements.confettiContainer.innerHTML = '';

        // Create game board
        createGameBoard();

        // Create player tokens
        createPlayerTokens();

        // Create dino
        createDino();

        // Update UI
        updateUI();

        // Add event listeners
        elements.rollButton.addEventListener('click', handleRollClick);
    }

    // Create the game board with spaces
    function createGameBoard() {
        for (let i = 1; i <= config.totalSpaces; i++) {
            const space = document.createElement('div');
            space.classList.add('path-space');
            space.dataset.space = i;

            // Add special classes
            if (i === 1) {
                space.classList.add('jungle');
                space.innerHTML = '<div class="space-number">1</div><div>Jungle</div>';
            } else if (i === config.totalSpaces) {
                space.classList.add('cave');
                space.innerHTML = '<div class="space-number">20</div><div>Safe Cave</div>';
            } else if (config.roarSpaces.includes(i)) {
                space.classList.add('roar');
                space.innerHTML = `<div class="space-number">${i}</div><div>Roar!</div>`;
            } else {
                space.innerHTML = `<div class="space-number">${i}</div>`;
            }

            elements.pathContainer.appendChild(space);
        }
    }

    // Create player tokens
    function createPlayerTokens() {
        gameState.players.forEach(player => {
            const token = document.createElement('div');
            // Use the token class from the player's selected token
            const tokenClass = player.token.replace('token-', 'token-');
            token.classList.add('player-token', tokenClass);
            token.dataset.player = player.id;
            token.title = player.name;
            elements.playersContainer.appendChild(token);
            player.element = token;

            // Position the token
            positionPlayerToken(player);
        });
    }

    // Create the T-Rex
    function createDino() {
        const dino = document.createElement('div');
        dino.classList.add('dino');
        dino.title = "T-Rex";
        elements.dinoContainer.appendChild(dino);

        // Position the dino
        positionDino();
    }

    // Position a player token on the board
    function positionPlayerToken(player) {
        if (!player.element) return;

        const space = document.querySelector(`.path-space[data-space="${player.position}"]`);
        if (!space) return;

        const spaceRect = space.getBoundingClientRect();
        const boardRect = elements.pathContainer.getBoundingClientRect();

        // Calculate position relative to the board
        const left = spaceRect.left - boardRect.left + spaceRect.width / 2;
        const top = spaceRect.top - boardRect.top + spaceRect.height / 2;

        // Add a slight offset for player 2 to avoid overlap
        const offset = player.id === 2 ? 15 : -15;

        player.element.style.left = `${left + offset}px`;
        player.element.style.top = `${top}px`;
    }

    // Position the T-Rex on the board
    function positionDino() {
        const dino = document.querySelector('.dino');
        if (!dino) return;

        // If dino is off the board (behind start)
        if (gameState.dinoPosition < 1) {
            const firstSpace = document.querySelector('.path-space[data-space="1"]');
            if (!firstSpace) return;

            const spaceRect = firstSpace.getBoundingClientRect();
            const boardRect = elements.pathContainer.getBoundingClientRect();

            // Calculate position relative to the board
            // Position dino behind the start based on its position
            const left = spaceRect.left - boardRect.left - 100 + (gameState.dinoPosition + 10) * 30;
            const top = spaceRect.top - boardRect.top + spaceRect.height / 2;

            dino.style.left = `${left}px`;
            dino.style.top = `${top}px`;
        } else {
            // If dino is on the board
            const space = document.querySelector(`.path-space[data-space="${gameState.dinoPosition}"]`);
            if (!space) return;

            const spaceRect = space.getBoundingClientRect();
            const boardRect = elements.pathContainer.getBoundingClientRect();

            // Calculate position relative to the board
            const left = spaceRect.left - boardRect.left + spaceRect.width / 2;
            const top = spaceRect.top - boardRect.top + spaceRect.height / 2;

            dino.style.left = `${left}px`;
            dino.style.top = `${top}px`;
        }
    }

    // Handle roll button click
    function handleRollClick() {
        if (gameState.gameOver) return;

        // Disable roll button during animation
        elements.rollButton.disabled = true;

        // Get current player
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        if (currentPlayer.isOut) {
            // Skip to next player if current player is out
            nextPlayer();
            elements.rollButton.disabled = false;
            return;
        }

        // Clear any previous messages
        elements.gameMessageDisplay.textContent = '';

        // Play dice sound
        playSound('diceSound');

        // Roll the dice
        const diceResult = rollDice();

        // Track dice roll in Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'dice_roll', {
                'event_category': 'Game',
                'event_label': 'DinosaurChase',
                'player_name': currentPlayer.name,
                'dice_result': diceResult
            });
        }

        // Show dice result with animation
        showDiceResult(diceResult);

        // Move player after animation completes (longer delay for the enhanced animation)
        setTimeout(() => {
            movePlayer(currentPlayer, diceResult);

            // Play move sound
            playSound('moveSound');

            // Check for roar space
            if (config.roarSpaces.includes(currentPlayer.position) && !gameState.gameOver) {
                triggerDinoRoar();
            }

            // Check win/lose conditions
            checkGameConditions();

            // Move to next player if game not over
            if (!gameState.gameOver) {
                nextPlayer();
            }

            // Update UI
            updateUI();

            // Re-enable roll button
            elements.rollButton.disabled = false;
        }, 1500); // Increased from 1000 to 1500 to account for longer dice animation
    }

    // Roll the dice
    function rollDice() {
        return Math.floor(Math.random() * config.diceMax) + 1;
    }

    // Show dice result with animation
    function showDiceResult(result) {
        // Create dice element if it doesn't exist
        let diceElement = document.querySelector('.dice');
        if (!diceElement) {
            diceElement = document.createElement('div');
            diceElement.classList.add('dice');
            elements.diceResultDisplay.appendChild(diceElement);
        }

        // Add shake animation
        diceElement.classList.add('shake');

        // Show rolling animation
        let rollCount = 0;
        const maxRolls = 10; // Number of "rolls" to show
        const rollInterval = setInterval(() => {
            // Show random numbers during rolling
            const randomNum = Math.floor(Math.random() * config.diceMax) + 1;

            // Update dice face
            updateDiceFace(diceElement, randomNum);

            rollCount++;
            if (rollCount >= maxRolls) {
                clearInterval(rollInterval);

                // Show final result
                updateDiceFace(diceElement, result);
                diceElement.classList.remove('shake');

                // Add result announcement
                const currentPlayer = gameState.players[gameState.currentPlayerIndex];
                elements.gameMessageDisplay.textContent = `${currentPlayer.name} rolled a ${result}!`;
            }
        }, 100);
    }

    // Update dice face with dots
    function updateDiceFace(diceElement, value) {
        // Clear previous face
        diceElement.innerHTML = '';

        // Create new face
        const face = document.createElement('div');
        face.classList.add('dice-face');
        face.dataset.value = value;

        // Add dots based on value
        for (let i = 0; i < value; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dice-dot');
            face.appendChild(dot);
        }

        diceElement.appendChild(face);
    }

    // Move player token
    function movePlayer(player, spaces) {
        // Calculate new position
        const newPosition = Math.min(player.position + spaces, config.totalSpaces);
        player.position = newPosition;

        // Position the token
        positionPlayerToken(player);

        // Highlight the space
        highlightSpace(newPosition);
    }

    // Trigger dino roar and move dino closer
    function triggerDinoRoar() {
        // Show roar message
        elements.gameMessageDisplay.textContent = 'ROAR! T-Rex moves closer!';

        // Play roar sound
        playSound('roarSound');

        // Add roar animation to dino
        const dino = document.querySelector('.dino');
        dino.classList.add('roar-animation');

        // Remove animation after it completes
        setTimeout(() => {
            dino.classList.remove('roar-animation');
        }, 500);

        // Move dino closer
        gameState.dinoPosition += config.dinoRoarMove;

        // Position the dino
        setTimeout(() => {
            positionDino();
        }, 600);
    }

    // Highlight a space
    function highlightSpace(spaceNumber) {
        // Remove highlight from all spaces
        document.querySelectorAll('.path-space').forEach(space => {
            space.classList.remove('active');
        });

        // Add highlight to the target space
        const space = document.querySelector(`.path-space[data-space="${spaceNumber}"]`);
        if (space) {
            space.classList.add('active');
        }
    }

    // Move to next player
    function nextPlayer() {
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;

        // Skip if player is out
        if (gameState.players[gameState.currentPlayerIndex].isOut) {
            nextPlayer();
        }
    }

    // Check win/lose conditions
    function checkGameConditions() {
        // Check if dino caught any players
        gameState.players.forEach(player => {
            if (gameState.dinoPosition >= player.position && !player.isOut) {
                player.isOut = true;
                elements.gameMessageDisplay.textContent = `${player.name} has been caught by the T-Rex!`;

                // Track player caught event in Google Analytics
                if (typeof gtag === 'function') {
                    gtag('event', 'player_caught', {
                        'event_category': 'Game',
                        'event_label': 'DinosaurChase',
                        'player_name': player.name,
                        'position': player.position,
                        'dino_position': gameState.dinoPosition
                    });
                }

                // Add caught animation
                if (player.element) {
                    player.element.style.opacity = '0.5';
                }
            }
        });

        // Check if all players are out
        const allOut = gameState.players.every(player => player.isOut);
        if (allOut) {
            gameState.gameOver = true;
            elements.gameMessageDisplay.textContent = 'Game Over! The T-Rex caught everyone!';
            elements.rollButton.disabled = true;

            // Play lose sound
            playSound('loseSound');
        }

        // Check if any player reached the cave
        gameState.players.forEach(player => {
            if (player.position === config.totalSpaces && !player.isOut) {
                gameState.gameOver = true;
                gameState.winner = player;
                elements.gameMessageDisplay.textContent = `${player.name} reached the Safe Cave and won!`;
                elements.rollButton.disabled = true;

                // Track win event in Google Analytics
                if (typeof gtag === 'function') {
                    gtag('event', 'game_win', {
                        'event_category': 'Game',
                        'event_label': 'DinosaurChase',
                        'player_name': player.name,
                        'moves_taken': player.movesTaken || 0
                    });
                }

                // Add victory animation
                if (player.element) {
                    player.element.classList.add('victory-animation');
                }

                // Show winner celebration
                showWinnerCelebration(player);
            }
        });
    }

    // Show winner celebration with confetti
    function showWinnerCelebration(player) {
        // Play win sound
        playSound('winSound');

        // Create confetti
        createConfetti();

        // Create winner announcement
        const winnerAnnouncement = document.createElement('div');
        winnerAnnouncement.classList.add('winner-announcement');

        // Create winner token display
        const winnerToken = document.createElement('div');
        winnerToken.classList.add('winner-token');
        winnerToken.style.backgroundImage = getComputedStyle(player.element).backgroundImage;

        // Create announcement text
        const winnerTitle = document.createElement('h2');
        winnerTitle.textContent = 'WINNER!';

        const winnerName = document.createElement('p');
        winnerName.textContent = `${player.name} escaped the T-Rex!`;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Continue';
        closeButton.addEventListener('click', () => {
            winnerAnnouncement.remove();
        });

        // Assemble winner announcement
        winnerAnnouncement.appendChild(winnerToken);
        winnerAnnouncement.appendChild(winnerTitle);
        winnerAnnouncement.appendChild(winnerName);
        winnerAnnouncement.appendChild(closeButton);

        // Add to document
        document.body.appendChild(winnerAnnouncement);
    }

    // Create confetti animation
    function createConfetti() {
        // Clear any existing confetti
        elements.confettiContainer.innerHTML = '';

        // Create confetti pieces
        for (let i = 0; i < config.confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');

            // Random position
            confetti.style.left = `${Math.random() * 100}%`;

            // Random delay
            confetti.style.animationDelay = `${Math.random() * 3}s`;

            // Random color
            const colorIndex = Math.floor(Math.random() * config.confettiColors.length);
            confetti.style.backgroundColor = config.confettiColors[colorIndex];

            // Random size
            const size = Math.random() * 10 + 5;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;

            // Random rotation
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

            // Add to container
            elements.confettiContainer.appendChild(confetti);
        }
    }

    // Update UI elements
    function updateUI() {
        // Update current player display
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        elements.currentPlayerDisplay.textContent = `${currentPlayer.name}'s turn`;

        // Position all player tokens
        gameState.players.forEach(player => {
            positionPlayerToken(player);
        });

        // Position dino
        positionDino();
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        // Reposition all elements
        gameState.players.forEach(player => {
            positionPlayerToken(player);
        });
        positionDino();
    });

    // Initialize audio when the page loads
    initAudio();
});

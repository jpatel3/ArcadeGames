// Game state variables
let players = [];
let currentPlayerIndex = 0;
let deck = [];
let discardPile = [];
let gameDirection = 1; // 1 for clockwise, -1 for counter-clockwise
let currentColor = '';
let gameStarted = false;
let selectedWildCardId = null;

// Audio elements
const backgroundMusic = document.getElementById('background-music');
const cardDealSound = document.getElementById('card-deal-sound');
const cardShuffleSound = document.getElementById('card-shuffle-sound');
const unoCallSound = document.getElementById('uno-call-sound');
const gameWinSound = document.getElementById('game-win-sound');
const drawCardSound = document.getElementById('draw-card-sound');

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const playerCountSelect = document.getElementById('player-count');
const startGameButton = document.getElementById('start-game-button');
const playerHand = document.querySelector('.player-hand');
const drawCardButton = document.getElementById('draw-card-button');
const callUnoButton = document.getElementById('call-uno-button');
const restartButton = document.getElementById('restart-button');
const gameMessage = document.getElementById('game-message');
const colorSelectionModal = document.getElementById('color-selection-modal');
const confettiContainer = document.getElementById('confetti-container');
const musicToggle = document.getElementById('music-toggle');
const soundToggle = document.getElementById('sound-toggle');

// Audio settings
let musicEnabled = true;
let soundEnabled = true;

// Card types and colors
const cardColors = ['red', 'blue', 'green', 'yellow'];
const cardTypes = {
  number: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  action: ['skip', 'reverse', 'draw-two'],
  wild: ['wild', 'wild-draw-four']
};

// Initialize the game
function init () {
  setupEventListeners();
  updatePlayerInputs();
  setupAudioControls();

  // Track game start in Google Analytics
  if (typeof gtag === 'function') {
    gtag('event', 'game_load', {
      game_name: 'Uno',
      event_category: 'game',
      event_label: 'Uno Game Loaded'
    });
  }
}

// Setup event listeners
function setupEventListeners () {
  // Player count change
  playerCountSelect.addEventListener('change', updatePlayerInputs);

  // Start game button
  startGameButton.addEventListener('click', startGame);

  // Game action buttons
  drawCardButton.addEventListener('click', drawCard);
  callUnoButton.addEventListener('click', callUno);
  restartButton.addEventListener('click', restartGame);

  // Color selection for player setup
  document.querySelectorAll('.player-input .color-option').forEach(option => {
    option.addEventListener('click', function () {
      selectPlayerColor(this);
    });
  });

  // Color selection in modal (for wild cards)
  document.querySelectorAll('.color-selection-modal .color-option').forEach(option => {
    option.addEventListener('click', function () {
      selectWildColor(this.getAttribute('data-color'));
    });
  });
}

// Update player inputs based on selected player count
function updatePlayerInputs () {
  const playerCount = parseInt(playerCountSelect.value);

  // Show/hide player inputs based on count
  for (let i = 1; i <= 4; i++) {
    const playerInput = document.getElementById(`player${i}-input`);
    if (i <= playerCount) {
      playerInput.classList.remove('hidden');
    } else {
      playerInput.classList.add('hidden');
    }
  }

  // Update opponent containers visibility
  updateOpponentContainers(playerCount);
}

// Update opponent containers based on player count
function updateOpponentContainers (playerCount) {
  const opponents = document.querySelectorAll('.opponent');

  opponents.forEach((opponent, index) => {
    if (index < playerCount - 1) {
      opponent.classList.remove('hidden');
    } else {
      opponent.classList.add('hidden');
    }
  });
}

// Setup audio controls
function setupAudioControls () {
  // Music toggle
  musicToggle.addEventListener('click', function () {
    musicEnabled = !musicEnabled;
    if (musicEnabled) {
      backgroundMusic.play();
      this.classList.remove('muted');
    } else {
      backgroundMusic.pause();
      this.classList.add('muted');
    }
  });

  // Sound effects toggle
  soundToggle.addEventListener('click', function () {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      this.classList.remove('muted');
    } else {
      this.classList.add('muted');
    }
  });
}

// Play sound if enabled
function playSound (sound) {
  if (soundEnabled) {
    sound.currentTime = 0;
    sound.play();
  }
}

// Select player color during setup
function selectPlayerColor (colorElement) {
  const playerInput = colorElement.closest('.player-input');
  const colorOptions = playerInput.querySelectorAll('.color-option');

  // Remove selected class from all options
  colorOptions.forEach(option => option.classList.remove('selected'));

  // Add selected class to clicked option
  colorElement.classList.add('selected');

  // Update available colors for other players
  updateAvailableColors();
}

// Update available colors for players
function updateAvailableColors () {
  const selectedColors = [];

  // Get all selected colors
  document.querySelectorAll('.player-input:not(.hidden) .color-option.selected').forEach(option => {
    selectedColors.push(option.getAttribute('data-color'));
  });

  // Update availability for all color options
  document.querySelectorAll('.player-input .color-option').forEach(option => {
    const color = option.getAttribute('data-color');

    if (selectedColors.includes(color) && !option.classList.contains('selected')) {
      option.classList.add('unavailable');
    } else {
      option.classList.remove('unavailable');
    }
  });
}

// Create a new deck of cards
function createDeck () {
  const newDeck = [];
  let cardId = 0;

  // Add numbered cards (0-9)
  cardColors.forEach(color => {
    // Add one 0 card for each color
    newDeck.push({
      id: cardId++,
      color,
      type: 'number',
      value: 0,
      imageUrl: `assets/images/cards/${color}-0.png`
    });

    // Add two of each number 1-9 for each color
    cardTypes.number.slice(1).forEach(number => {
      for (let i = 0; i < 2; i++) {
        newDeck.push({
          id: cardId++,
          color,
          type: 'number',
          value: number,
          imageUrl: `assets/images/cards/${color}-${number}.png`
        });
      }
    });

    // Add action cards (skip, reverse, draw two)
    cardTypes.action.forEach(action => {
      for (let i = 0; i < 2; i++) {
        newDeck.push({
          id: cardId++,
          color,
          type: 'action',
          value: action,
          imageUrl: `assets/images/cards/${color}-${action}.png`
        });
      }
    });
  });

  // Add wild cards
  cardTypes.wild.forEach(wild => {
    for (let i = 0; i < 4; i++) {
      newDeck.push({
        id: cardId++,
        color: null,
        type: 'wild',
        value: wild,
        imageUrl: `assets/images/cards/${wild}.png`
      });
    }
  });

  return newDeck;
}

// Shuffle the deck using Fisher-Yates algorithm
function shuffleDeck (deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Deal cards to players
function dealCards () {
  // Deal 7 cards to each player
  for (let i = 0; i < 7; i++) {
    players.forEach(player => {
      if (deck.length > 0) {
        const card = deck.pop();
        player.hand.push(card);
      }
    });
  }

  // Place first card on discard pile
  let firstCard;
  do {
    firstCard = deck.pop();
    // If first card is a wild card, put it back and try again
    if (firstCard.type === 'wild') {
      deck.unshift(firstCard);
      firstCard = null;
    }
  } while (!firstCard);

  discardPile.push(firstCard);
  currentColor = firstCard.color;

  // Handle if first card is an action card
  if (firstCard.type === 'action') {
    handleActionCard(firstCard, true);
  }
}

// Draw a card from the deck
function drawCardFromDeck () {
  // If deck is empty, shuffle discard pile and make it the new deck
  if (deck.length === 0) {
    const lastDiscarded = discardPile.pop();
    deck = shuffleDeck(discardPile);
    discardPile = [lastDiscarded];
    playSound(cardShuffleSound);
  }

  return deck.pop();
}

// Start the game
function startGame () {
  // Get player count
  const playerCount = parseInt(playerCountSelect.value);

  // Create players array
  players = [];
  for (let i = 1; i <= playerCount; i++) {
    const nameInput = document.getElementById(`player${i}-name`);
    const colorOption = document.querySelector(`#player${i}-input .color-option.selected`);

    const name = nameInput.value.trim() || `Player ${i}`;
    const color = colorOption.getAttribute('data-color');

    players.push({
      id: i,
      name,
      color,
      hand: [],
      calledUno: false
    });
  }

  // Create and shuffle deck
  deck = shuffleDeck(createDeck());

  // Deal cards to players
  dealCards();

  // Set current player to first player
  currentPlayerIndex = 0;

  // Show game screen
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  // Update UI
  updateGameUI();

  // Start background music
  if (musicEnabled) {
    backgroundMusic.play();
  }

  // Set game as started
  gameStarted = true;

  // Track game start in Google Analytics
  if (typeof gtag === 'function') {
    gtag('event', 'game_start', {
      game_name: 'Uno',
      player_count: playerCount,
      event_category: 'game',
      event_label: 'Uno Game Started'
    });
  }

  // If first player is AI, make their move
  if (currentPlayerIndex !== 0) {
    setTimeout(playAITurn, 1000);
  }
}

// Update the game UI
function updateGameUI () {
  // Update player hand
  updatePlayerHand();

  // Update opponent cards
  updateOpponentCards();

  // Update discard pile
  updateDiscardPile();

  // Update current player indicator
  updateCurrentPlayerIndicator();

  // Update current color indicator
  updateColorIndicator();

  // Update direction indicator
  updateDirectionIndicator();

  // Update game message
  updateGameMessage();
}

// Update player hand display
function updatePlayerHand () {
  // Clear current hand
  playerHand.innerHTML = '';

  // Get current player's hand
  const currentPlayer = players[0]; // Player 1 is always the human player

  // Add cards to hand
  currentPlayer.hand.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.style.backgroundImage = `url('${card.imageUrl}')`;
    cardElement.setAttribute('data-card-id', card.id);

    // Add click event for playing cards
    cardElement.addEventListener('click', () => playCard(card));

    // Disable cards that can't be played
    if (!canPlayCard(card)) {
      cardElement.classList.add('disabled');
    }

    playerHand.appendChild(cardElement);
  });

  // Update card count
  document.querySelector('.player-area .card-count').textContent = `${currentPlayer.hand.length} cards`;

  // Update player name
  document.querySelector('.player-area .player-name').textContent = currentPlayer.name;
}

// Update opponent cards display
function updateOpponentCards () {
  // Skip player 1 (human player)
  for (let i = 1; i < players.length; i++) {
    const player = players[i];
    const opponentElement = document.getElementById(`opponent-${i}`);

    if (opponentElement) {
      // Update name and card count
      opponentElement.querySelector('.player-name').textContent = player.name;
      opponentElement.querySelector('.card-count').textContent = `${player.hand.length} cards`;

      // Update cards
      const cardsContainer = opponentElement.querySelector('.opponent-cards');
      cardsContainer.innerHTML = '';

      // Add card backs based on hand size
      for (let j = 0; j < player.hand.length; j++) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'card-back');

        // Position cards in a fan shape
        const angle = (j - (player.hand.length - 1) / 2) * 5;
        const translateX = angle * 2;

        cardElement.style.transform = `rotate(${angle}deg) translateX(${translateX}px)`;
        cardsContainer.appendChild(cardElement);
      }
    }
  }
}

// Update discard pile display
function updateDiscardPile () {
  const discardPileElement = document.querySelector('.discard-pile');
  discardPileElement.innerHTML = '';

  if (discardPile.length > 0) {
    const topCard = discardPile[discardPile.length - 1];
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.style.backgroundImage = `url('${topCard.imageUrl}')`;
    discardPileElement.appendChild(cardElement);
  }
}

// Update current player indicator
function updateCurrentPlayerIndicator () {
  // Remove highlight from all players
  document.querySelectorAll('.player-info').forEach(info => {
    info.style.boxShadow = 'none';
  });

  // Highlight current player
  if (currentPlayerIndex === 0) {
    // Highlight human player
    document.querySelector('.player-area .player-info').style.boxShadow = '0 0 10px #ffcc00';
  } else {
    // Highlight AI player
    const opponentElement = document.getElementById(`opponent-${currentPlayerIndex}`);
    if (opponentElement) {
      opponentElement.querySelector('.player-info').style.boxShadow = '0 0 10px #ffcc00';
    }
  }
}

// Update color indicator
function updateColorIndicator () {
  const colorIndicator = document.querySelector('.color-indicator');
  colorIndicator.style.backgroundColor = currentColor;
}

// Update direction indicator
function updateDirectionIndicator () {
  const directionIndicator = document.querySelector('.direction-indicator i');

  if (gameDirection === 1) {
    directionIndicator.className = 'fas fa-arrow-right';
  } else {
    directionIndicator.className = 'fas fa-arrow-left';
  }
}

// Update game message
function updateGameMessage () {
  const currentPlayer = players[currentPlayerIndex];

  if (currentPlayerIndex === 0) {
    gameMessage.textContent = 'Your turn';
  } else {
    gameMessage.textContent = `${currentPlayer.name}'s turn`;
  }
}

// Check if a card can be played
function canPlayCard (card) {
  // If it's not the player's turn, they can't play
  if (currentPlayerIndex !== 0) {
    return false;
  }

  const topCard = discardPile[discardPile.length - 1];

  // Wild cards can always be played
  if (card.type === 'wild') {
    return true;
  }

  // Match by color
  if (card.color === currentColor) {
    return true;
  }

  // Match by number or action
  if (card.value === topCard.value) {
    return true;
  }

  return false;
}

// Play a card
function playCard (card) {
  // Check if card can be played
  if (!canPlayCard(card)) {
    return;
  }

  // Remove card from player's hand
  const player = players[currentPlayerIndex];
  const cardIndex = player.hand.findIndex(c => c.id === card.id);

  if (cardIndex !== -1) {
    const playedCard = player.hand.splice(cardIndex, 1)[0];

    // Add card to discard pile
    discardPile.push(playedCard);

    // Play card sound
    playSound(cardDealSound);

    // Update current color
    if (playedCard.type === 'wild') {
      // Show color selection modal
      selectedWildCardId = playedCard.id;
      colorSelectionModal.classList.remove('hidden');
    } else {
      currentColor = playedCard.color;

      // Handle action cards
      if (playedCard.type === 'action') {
        handleActionCard(playedCard);
      } else {
        // Move to next player
        nextPlayer();
      }
    }

    // Check if player has one card left
    if (player.hand.length === 1 && !player.calledUno) {
      // AI players automatically call UNO
      if (currentPlayerIndex !== 0) {
        player.calledUno = true;
        gameMessage.textContent = `${player.name} says UNO!`;
        playSound(unoCallSound);
      }
    }

    // Check for win condition
    if (player.hand.length === 0) {
      endGame(player);
      return;
    }

    // Update UI
    updateGameUI();

    // Track card play in Google Analytics
    if (typeof gtag === 'function') {
      gtag('event', 'card_played', {
        game_name: 'Uno',
        card_type: playedCard.type,
        card_value: playedCard.value,
        card_color: playedCard.color,
        event_category: 'gameplay',
        event_label: 'Card Played'
      });
    }
  }
}

// Handle action cards
function handleActionCard (card, isFirstCard = false) {
  let nextPlayerIndex = getNextPlayerIndex();

  switch (card.value) {
  case 'skip':
    // Skip next player's turn
    if (!isFirstCard) {
      gameMessage.textContent = `${players[nextPlayerIndex].name}'s turn is skipped!`;
      nextPlayer(); // Skip once
    }
    break;

  case 'reverse':
    // Reverse direction
    gameDirection *= -1;

    if (players.length === 2 && !isFirstCard) {
      // In 2-player game, reverse acts like skip
      nextPlayer();
    }
    break;

  case 'draw-two':
    if (!isFirstCard) {
      // Next player draws 2 cards
      const nextPlayer = players[nextPlayerIndex];

      for (let i = 0; i < 2; i++) {
        if (deck.length > 0) {
          const card = drawCardFromDeck();
          nextPlayer.hand.push(card);
          playSound(drawCardSound);
        }
      }

      gameMessage.textContent = `${nextPlayer.name} draws 2 cards!`;

      // Skip their turn
      nextPlayerIndex = getNextPlayerIndex();
      currentPlayerIndex = nextPlayerIndex;
    }
    break;

  case 'wild-draw-four':
    if (!isFirstCard) {
      // Next player draws 4 cards
      const nextPlayer = players[nextPlayerIndex];

      for (let i = 0; i < 4; i++) {
        if (deck.length > 0) {
          const card = drawCardFromDeck();
          nextPlayer.hand.push(card);
          playSound(drawCardSound);
        }
      }

      gameMessage.textContent = `${nextPlayer.name} draws 4 cards!`;

      // Skip their turn
      nextPlayerIndex = getNextPlayerIndex();
      currentPlayerIndex = nextPlayerIndex;
    }
    break;
  }
}

// Select wild card color
function selectWildColor (color) {
  // Set current color
  currentColor = color;

  // Hide modal
  colorSelectionModal.classList.add('hidden');

  // Get the played wild card
  const wildCard = discardPile[discardPile.length - 1];

  // Handle wild draw four
  if (wildCard.value === 'wild-draw-four') {
    handleActionCard(wildCard);
  } else {
    // Move to next player
    nextPlayer();
  }

  // Update UI
  updateGameUI();

  // Track wild color selection in Google Analytics
  if (typeof gtag === 'function') {
    gtag('event', 'wild_color_selected', {
      game_name: 'Uno',
      color,
      event_category: 'gameplay',
      event_label: 'Wild Color Selected'
    });
  }
}

// Move to next player
function nextPlayer () {
  // Reset UNO call status for current player
  players[currentPlayerIndex].calledUno = false;

  // Get next player index
  currentPlayerIndex = getNextPlayerIndex();

  // If next player is AI, make their move
  if (currentPlayerIndex !== 0) {
    setTimeout(playAITurn, 1000);
  }
}

// Get next player index based on direction
function getNextPlayerIndex () {
  return (currentPlayerIndex + gameDirection + players.length) % players.length;
}

// Draw a card (player action)
function drawCard () {
  // Only allow drawing if it's the player's turn
  if (currentPlayerIndex !== 0 || !gameStarted) {
    return;
  }

  // Draw a card from the deck
  const card = drawCardFromDeck();

  // Add to player's hand
  players[0].hand.push(card);

  // Play sound
  playSound(drawCardSound);

  // Check if drawn card can be played
  const canPlay = canPlayCard(card);

  // Update UI
  updateGameUI();

  // Show message
  if (canPlay) {
    gameMessage.textContent = 'You drew a card that can be played. Click it to play.';
  } else {
    gameMessage.textContent = 'You drew a card. Your turn is over.';

    // Move to next player
    setTimeout(() => {
      nextPlayer();
      updateGameUI();
    }, 1500);
  }

  // Track card draw in Google Analytics
  if (typeof gtag === 'function') {
    gtag('event', 'draw_card', {
      game_name: 'Uno',
      event_category: 'gameplay',
      event_label: 'Card Drawn'
    });
  }
}

// Call UNO
function callUno () {
  // Only allow calling UNO if it's the player's turn and they have 2 cards
  if (currentPlayerIndex !== 0 || players[0].hand.length !== 2 || !gameStarted) {
    return;
  }

  // Set UNO flag
  players[0].calledUno = true;

  // Play sound
  playSound(unoCallSound);

  // Show message
  gameMessage.textContent = 'You called UNO!';

  // Track UNO call in Google Analytics
  if (typeof gtag === 'function') {
    gtag('event', 'call_uno', {
      game_name: 'Uno',
      event_category: 'gameplay',
      event_label: 'UNO Called'
    });
  }
}

// AI player turn
function playAITurn () {
  if (!gameStarted) return;

  const player = players[currentPlayerIndex];
  const topCard = discardPile[discardPile.length - 1];

  // Find playable cards
  const playableCards = player.hand.filter(card => {
    // Wild cards can always be played
    if (card.type === 'wild') {
      return true;
    }

    // Match by color
    if (card.color === currentColor) {
      return true;
    }

    // Match by number or action
    if (card.value === topCard.value) {
      return true;
    }

    return false;
  });

  // If AI has playable cards
  if (playableCards.length > 0) {
    // Sort cards by priority (action cards first, then by color)
    playableCards.sort((a, b) => {
      // Prioritize action cards
      if (a.type === 'action' && b.type !== 'action') return -1;
      if (a.type !== 'action' && b.type === 'action') return 1;

      // Prioritize wild cards
      if (a.type === 'wild' && b.type !== 'wild') return -1;
      if (a.type !== 'wild' && b.type === 'wild') return 1;

      // Prioritize by color frequency
      const colorFrequency = {};
      player.hand.forEach(card => {
        if (card.color) {
          colorFrequency[card.color] = (colorFrequency[card.color] || 0) + 1;
        }
      });

      if (a.color && b.color) {
        return colorFrequency[b.color] - colorFrequency[a.color];
      }

      return 0;
    });

    // Choose the best card
    const cardToPlay = playableCards[0];

    // Remove card from hand
    const cardIndex = player.hand.findIndex(c => c.id === cardToPlay.id);
    const playedCard = player.hand.splice(cardIndex, 1)[0];

    // Add to discard pile
    discardPile.push(playedCard);

    // Play sound
    playSound(cardDealSound);

    // Update game message
    gameMessage.textContent = `${player.name} plays a ${playedCard.color || ''} ${playedCard.value}`;

    // Handle wild cards
    if (playedCard.type === 'wild') {
      // Choose most frequent color in hand
      const colorFrequency = {};
      player.hand.forEach(card => {
        if (card.color) {
          colorFrequency[card.color] = (colorFrequency[card.color] || 0) + 1;
        }
      });

      let mostFrequentColor = 'red'; // Default
      let maxFrequency = 0;

      for (const color in colorFrequency) {
        if (colorFrequency[color] > maxFrequency) {
          maxFrequency = colorFrequency[color];
          mostFrequentColor = color;
        }
      }

      // Set color
      currentColor = mostFrequentColor;
      gameMessage.textContent += ` and chooses ${mostFrequentColor}`;

      // Handle wild draw four
      if (playedCard.value === 'wild-draw-four') {
        handleActionCard(playedCard);
      } else {
        // Move to next player
        nextPlayer();
      }
    } else {
      // Set color
      currentColor = playedCard.color;

      // Handle action cards
      if (playedCard.type === 'action') {
        handleActionCard(playedCard);
      } else {
        // Move to next player
        nextPlayer();
      }
    }

    // Check if AI has one card left
    if (player.hand.length === 1 && !player.calledUno) {
      player.calledUno = true;
      gameMessage.textContent += ' and says UNO!';
      playSound(unoCallSound);
    }

    // Check for win condition
    if (player.hand.length === 0) {
      endGame(player);
      return;
    }
  } else {
    // No playable cards, draw one
    const drawnCard = drawCardFromDeck();
    player.hand.push(drawnCard);

    // Play sound
    playSound(drawCardSound);

    // Update game message
    gameMessage.textContent = `${player.name} draws a card`;

    // Check if drawn card can be played
    if (canPlayCardAI(drawnCard)) {
      // Remove card from hand
      const cardIndex = player.hand.findIndex(c => c.id === drawnCard.id);
      const playedCard = player.hand.splice(cardIndex, 1)[0];

      // Add to discard pile
      discardPile.push(playedCard);

      // Play sound
      playSound(cardDealSound);

      // Update game message
      gameMessage.textContent += ` and plays it: ${playedCard.color || ''} ${playedCard.value}`;

      // Handle wild cards
      if (playedCard.type === 'wild') {
        // Choose most frequent color in hand
        const colorFrequency = {};
        player.hand.forEach(card => {
          if (card.color) {
            colorFrequency[card.color] = (colorFrequency[card.color] || 0) + 1;
          }
        });

        let mostFrequentColor = 'red'; // Default
        let maxFrequency = 0;

        for (const color in colorFrequency) {
          if (colorFrequency[color] > maxFrequency) {
            maxFrequency = colorFrequency[color];
            mostFrequentColor = color;
          }
        }

        // Set color
        currentColor = mostFrequentColor;
        gameMessage.textContent += ` and chooses ${mostFrequentColor}`;

        // Handle wild draw four
        if (playedCard.value === 'wild-draw-four') {
          handleActionCard(playedCard);
        } else {
          // Move to next player
          nextPlayer();
        }
      } else {
        // Set color
        currentColor = playedCard.color;

        // Handle action cards
        if (playedCard.type === 'action') {
          handleActionCard(playedCard);
        } else {
          // Move to next player
          nextPlayer();
        }
      }

      // Check if AI has one card left
      if (player.hand.length === 1 && !player.calledUno) {
        player.calledUno = true;
        gameMessage.textContent += ' and says UNO!';
        playSound(unoCallSound);
      }

      // Check for win condition
      if (player.hand.length === 0) {
        endGame(player);
        return;
      }
    } else {
      // Move to next player
      nextPlayer();
    }
  }

  // Update UI
  updateGameUI();
}

// Check if a card can be played by AI
function canPlayCardAI (card) {
  const topCard = discardPile[discardPile.length - 1];

  // Wild cards can always be played
  if (card.type === 'wild') {
    return true;
  }

  // Match by color
  if (card.color === currentColor) {
    return true;
  }

  // Match by number or action
  if (card.value === topCard.value) {
    return true;
  }

  return false;
}

// End the game
function endGame (winner) {
  // Set game as not started
  gameStarted = false;

  // Play win sound
  playSound(gameWinSound);

  // Create winner announcement
  const winnerAnnouncement = document.createElement('div');
  winnerAnnouncement.classList.add('winner-announcement');

  // Set winner message
  if (winner.id === 1) {
    winnerAnnouncement.innerHTML = `
      <h2>Congratulations!</h2>
      <p>You won the game!</p>
      <button id="play-again-button">Play Again</button>
    `;
  } else {
    winnerAnnouncement.innerHTML = `
      <h2>Game Over</h2>
      <p>${winner.name} won the game!</p>
      <button id="play-again-button">Play Again</button>
    `;
  }

  // Add to game container
  document.querySelector('.game-container').appendChild(winnerAnnouncement);

  // Add play again button event
  document.getElementById('play-again-button').addEventListener('click', () => {
    winnerAnnouncement.remove();
    restartGame();
  });

  // Create confetti for winner
  createConfetti();

  // Track game end in Google Analytics
  if (typeof gtag === 'function') {
    gtag('event', 'game_end', {
      game_name: 'Uno',
      winner_id: winner.id,
      winner_name: winner.name,
      event_category: 'game',
      event_label: 'Uno Game Ended'
    });
  }
}

// Create confetti animation
function createConfetti () {
  // Clear existing confetti
  confettiContainer.innerHTML = '';

  // Create confetti pieces
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');

    // Random position
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDelay = `${Math.random() * 3}s`;

    // Random color
    const colors = ['#ff5555', '#5555ff', '#55aa55', '#ffaa00'];
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    // Random size
    const size = Math.random() * 10 + 5;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;

    // Random rotation
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    confettiContainer.appendChild(confetti);
  }
}

// Restart the game
function restartGame () {
  // Reset game state
  players = [];
  currentPlayerIndex = 0;
  deck = [];
  discardPile = [];
  gameDirection = 1;
  currentColor = '';
  gameStarted = false;

  // Show start screen
  startScreen.classList.remove('hidden');
  gameScreen.classList.add('hidden');

  // Clear confetti
  confettiContainer.innerHTML = '';

  // Track game restart in Google Analytics
  if (typeof gtag === 'function') {
    gtag('event', 'game_restart', {
      game_name: 'Uno',
      event_category: 'game',
      event_label: 'Uno Game Restarted'
    });
  }
}

// Initialize the game
init();

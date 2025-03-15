#!/bin/bash

# Create directories
mkdir -p assets/images
mkdir -p assets/sounds

# Download favicon
curl -o assets/images/favicon.png "https://raw.githubusercontent.com/jpatel3/ArcadeGames/main/games/MarioPlatformer/assets/images/favicon.png"

# Download game screenshot for main page
curl -o assets/images/game-screenshot.jpg "https://raw.githubusercontent.com/jpatel3/ArcadeGames/main/games/MarioPlatformer/assets/images/game-screenshot.jpg"

# Download sound effects
curl -o assets/sounds/jump.mp3 "https://raw.githubusercontent.com/jpatel3/ArcadeGames/main/games/MarioPlatformer/assets/sounds/jump.mp3"
curl -o assets/sounds/coin.mp3 "https://raw.githubusercontent.com/jpatel3/ArcadeGames/main/games/MarioPlatformer/assets/sounds/coin.mp3"
curl -o assets/sounds/game-over.mp3 "https://raw.githubusercontent.com/jpatel3/ArcadeGames/main/games/MarioPlatformer/assets/sounds/game-over.mp3"
curl -o assets/sounds/level-complete.mp3 "https://raw.githubusercontent.com/jpatel3/ArcadeGames/main/games/MarioPlatformer/assets/sounds/level-complete.mp3"
curl -o assets/sounds/background-music.mp3 "https://raw.githubusercontent.com/jpatel3/ArcadeGames/main/games/MarioPlatformer/assets/sounds/background-music.mp3"

echo "Assets downloaded successfully!"

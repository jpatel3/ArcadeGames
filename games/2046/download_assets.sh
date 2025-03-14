#!/bin/bash

# Create directories
mkdir -p assets/images
mkdir -p assets/sounds

# Download favicon
curl -o assets/images/favicon.png "https://raw.githubusercontent.com/jpatel3/ArcadeGames/main/games/2046/assets/images/favicon.png"

# Download sound effects
curl -o assets/sounds/background-music.mp3 "https://raw.githubusercontent.com/jpatel3/ArcadeGames/main/games/2046/assets/sounds/background-music.mp3"
curl -o assets/sounds/move.mp3 "https://raw.githubusercontent.com/jpatel3/ArcadeGames/main/games/2046/assets/sounds/move.mp3"
curl -o assets/sounds/merge.mp3 "https://raw.githubusercontent.com/jpatel3/ArcadeGames/main/games/2046/assets/sounds/merge.mp3"
curl -o assets/sounds/game-over.mp3 "https://raw.githubusercontent.com/jpatel3/ArcadeGames/main/games/2046/assets/sounds/game-over.mp3"
curl -o assets/sounds/win.mp3 "https://raw.githubusercontent.com/jpatel3/ArcadeGames/main/games/2046/assets/sounds/win.mp3"

echo "Assets downloaded successfully!"

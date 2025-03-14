#!/bin/bash

# Create directories if they don't exist
mkdir -p assets/images/cards
mkdir -p assets/sounds

# Download card back image
curl -o assets/images/card-back.png https://cdn-icons-png.flaticon.com/512/8453/8453218.png

# Download card images for each color (red, blue, green, yellow)
# Numbers 0-9
for color in red blue green yellow; do
  for number in {0..9}; do
    curl -o assets/images/cards/${color}-${number}.png https://cdn-icons-png.flaticon.com/512/8453/8453$(printf "%03d" $((220 + number))).png
  done
done

# Special cards (skip, reverse, draw two)
for color in red blue green yellow; do
  curl -o assets/images/cards/${color}-skip.png https://cdn-icons-png.flaticon.com/512/8453/8453230.png
  curl -o assets/images/cards/${color}-reverse.png https://cdn-icons-png.flaticon.com/512/8453/8453231.png
  curl -o assets/images/cards/${color}-draw-two.png https://cdn-icons-png.flaticon.com/512/8453/8453232.png
done

# Wild cards
curl -o assets/images/cards/wild.png https://cdn-icons-png.flaticon.com/512/8453/8453233.png
curl -o assets/images/cards/wild-draw-four.png https://cdn-icons-png.flaticon.com/512/8453/8453234.png

# Download game table background
curl -o assets/images/table-background.jpg https://img.freepik.com/free-photo/green-poker-table-background_95678-7.jpg

# Download favicon
curl -o assets/images/favicon.ico https://cdn-icons-png.flaticon.com/512/686/686589.png

# Download sound files
curl -o assets/sounds/card-deal.mp3 https://assets.mixkit.co/sfx/preview/mixkit-poker-card-placement-2001.mp3
curl -o assets/sounds/card-shuffle.mp3 https://assets.mixkit.co/sfx/preview/mixkit-casino-card-game-shuffle-1998.mp3
curl -o assets/sounds/uno-call.mp3 https://assets.mixkit.co/sfx/preview/mixkit-male-voice-cheer-2010.mp3
curl -o assets/sounds/game-win.mp3 https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3
curl -o assets/sounds/draw-card.mp3 https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3
curl -o assets/sounds/background-music.mp3 https://assets.mixkit.co/music/preview/mixkit-games-worldbeat-668.mp3

echo "All Uno assets downloaded successfully!"

# Make the script executable
chmod +x download_assets.sh

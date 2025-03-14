#!/bin/bash

# Create directories if they don't exist
mkdir -p assets/images/tokens
mkdir -p assets/sounds

# Download background image
curl -o assets/images/jungle-background.jpg https://img.freepik.com/free-vector/cartoon-jungle-background_52683-61450.jpg

# Download dinosaur image
curl -o assets/images/dinosaur.png https://cdn-icons-png.flaticon.com/512/3196/3196017.png

# Download favicon
curl -o assets/images/favicon.ico https://cdn-icons-png.flaticon.com/512/2236/2236839.png

# Download token images
curl -o assets/images/tokens/token-1.png https://cdn-icons-png.flaticon.com/512/6198/6198527.png
curl -o assets/images/tokens/token-2.png https://cdn-icons-png.flaticon.com/512/6198/6198551.png
curl -o assets/images/tokens/token-3.png https://cdn-icons-png.flaticon.com/512/1864/1864593.png
curl -o assets/images/tokens/token-4.png https://cdn-icons-png.flaticon.com/512/1998/1998610.png
curl -o assets/images/tokens/token-5.png https://cdn-icons-png.flaticon.com/512/3940/3940131.png
curl -o assets/images/tokens/token-6.png https://cdn-icons-png.flaticon.com/512/1752/1752776.png
curl -o assets/images/tokens/token-7.png https://cdn-icons-png.flaticon.com/512/3069/3069172.png
curl -o assets/images/tokens/token-8.png https://cdn-icons-png.flaticon.com/512/616/616438.png
curl -o assets/images/tokens/token-9.png https://cdn-icons-png.flaticon.com/512/2977/2977402.png
curl -o assets/images/tokens/token-10.png https://cdn-icons-png.flaticon.com/512/1998/1998679.png

# Download sound files
curl -o assets/sounds/background-music.mp3 https://assets.mixkit.co/music/preview/mixkit-games-worldbeat-668.mp3
curl -o assets/sounds/dice-roll.mp3 https://assets.mixkit.co/sfx/preview/mixkit-plastic-bubble-click-1124.mp3
curl -o assets/sounds/move.mp3 https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3
curl -o assets/sounds/roar.mp3 https://assets.mixkit.co/sfx/preview/mixkit-wild-lion-animal-roar-6.mp3
curl -o assets/sounds/win.mp3 https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3
curl -o assets/sounds/lose.mp3 https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-game-over-470.mp3

echo "All assets downloaded successfully!"

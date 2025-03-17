#!/bin/bash

# 2046 Game - Asset Downloader
# This script downloads the screenshot image for the 2046 game

# Create directories if they don't exist
mkdir -p assets/images

echo "Downloading game screenshot..."

# Download game screenshot - using a better image
curl -L "https://cdn.pixabay.com/photo/2017/08/05/11/16/logo-2582748_640.png" -o assets/images/game-screenshot.jpg

echo "Game screenshot downloaded successfully!"

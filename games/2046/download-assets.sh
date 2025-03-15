#!/bin/bash

# 2046 Game - Asset Downloader
# This script downloads the screenshot image for the 2046 game

# Create directories if they don't exist
mkdir -p assets/images

echo "Downloading game screenshot..."

# Download game screenshot
curl -L "https://cdn.pixabay.com/photo/2017/01/31/13/14/number-2023966_640.png" -o assets/images/game-screenshot.jpg

echo "Game screenshot downloaded successfully!"

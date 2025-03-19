#!/bin/bash

# Make the script exit on any error
set -e

echo "Installing dependencies..."
npm install

echo "Downloading game assets..."
node download-assets.js

echo "Setup complete! You can now start the game using: npm start"

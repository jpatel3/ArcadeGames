#!/bin/bash

# Create sounds directory if it doesn't exist
mkdir -p assets/sounds

# Download sound effects
echo "Downloading sound effects..."

# Pop sound (balloon pop)
curl -L "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3" -o assets/sounds/pop.mp3

# Correct answer sound (success chime)
curl -L "https://assets.mixkit.co/active_storage/sfx/1434/1434-preview.mp3" -o assets/sounds/correct.mp3

# Incorrect answer sound (gentle error)
curl -L "https://assets.mixkit.co/active_storage/sfx/1433/1433-preview.mp3" -o assets/sounds/incorrect.mp3

# Background music (happy game music)
curl -L "https://assets.mixkit.co/active_storage/sfx/123/123-preview.mp3" -o assets/sounds/background.mp3

echo "Sound assets downloaded successfully!"

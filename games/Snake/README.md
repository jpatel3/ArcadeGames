# Snake Game

A classic Snake game implementation for the Arcade Games Collection. Control the snake, eat the food, and try to achieve the highest score without hitting the walls or yourself!

## How to Play

1. Click the "Start Game" button or press any arrow key to begin
2. Control the snake using:
   - Arrow keys (↑, ↓, ←, →)
   - WASD keys (W, A, S, D)
   - On-screen buttons (mobile devices)
3. Eat the red food dots to grow longer and increase your score
4. Avoid hitting:
   - The walls
   - Your own tail
5. Press Space or the "Pause" button to pause/resume the game

## Features

- Responsive design that works on both desktop and mobile devices
- Touch-friendly controls for mobile play
- Local storage high score tracking
- Pause/Resume functionality
- Game over screen with final score display
- Smooth snake movement and controls
- Visual feedback with snake eyes that follow direction

## Scoring

- Each food item eaten: 10 points
- High scores are saved locally and persist between sessions

## Tips

- Plan your route carefully to avoid getting trapped
- Use the walls to your advantage when collecting food
- Keep track of your tail length when making turns
- The snake moves faster as you progress

## Technical Details

The game is built using vanilla JavaScript and HTML5 Canvas, making it lightweight and fast. It features:

- Modular JavaScript code using ES6+ features
- Responsive canvas sizing
- Touch event handling for mobile devices
- Local storage integration for high scores
- Collision detection system
- Smooth animation using requestAnimationFrame 

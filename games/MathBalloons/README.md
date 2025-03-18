# Math Balloons

A fun educational math game where players solve addition problems by adding numbers displayed on colorful balloons.

## Features

- Kid-friendly interface with animated balloons
- Random number generation (1-20)
- Score tracking
- Sound effects and background music
- Responsive design for all devices

## Setup

1. Place the following sound files in the `assets/sounds` directory:
   - `pop.mp3`: A short "pop" sound effect for when balloons are clicked
   - `correct.mp3`: A success sound for correct answers
   - `incorrect.mp3`: A gentle error sound for incorrect answers
   - `background.mp3`: Light background music for the game

2. Open `index.html` in a web browser to start playing

## How to Play

1. Enter your name and click "Start Game"
2. Two balloons will appear with random numbers
3. Add the numbers together and enter your answer
4. Click "Check Answer" or press Enter to submit
5. Correct answers will:
   - Add 10 points to your score
   - Play a success sound
   - Generate new numbers
6. Incorrect answers will:
   - Play an error sound
   - Allow you to try again

## Technical Details

- Built with vanilla JavaScript
- Uses CSS animations for balloon effects
- Responsive design using CSS Grid and Flexbox
- No external dependencies required

## Future Enhancements

- Additional arithmetic operations (subtraction, multiplication, division)
- Difficulty levels
- High score tracking
- More balloon colors and animations
- Additional sound effects 

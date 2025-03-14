# Contributing to Arcade Games Collection

Thank you for considering contributing to the Arcade Games Collection! This document outlines the process for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please create an issue with the following information:
- A clear, descriptive title that includes the game name (e.g., "[DinosaurChase] Bug in dice rolling animation")
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your browser and operating system

### Suggesting Enhancements

If you have an idea for an enhancement, please create an issue with:
- A clear, descriptive title that includes the game name (e.g., "[DinosaurChase] Add difficulty levels")
- A detailed description of the enhancement
- Any relevant mockups or examples

### Adding a New Game

If you want to add a new game to the collection:
1. Create a new directory under the `games/` folder with your game name
2. Follow the structure of existing games
3. Include a README.md file with game instructions
4. Make sure your game works independently
5. Update the main README.md to include your game

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests if available
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

1. Clone the repository
2. Navigate to the game directory you want to work on
3. Run the download assets script if available (e.g., `./download_assets.sh`)
4. Open the game's index.html in your browser to test

## Style Guidelines

- Use consistent indentation (2 spaces)
- Follow the existing code style
- Comment your code when necessary
- Keep functions small and focused
- Use descriptive variable and function names

## Game-Specific Guidelines

### Dinosaur Chase Game
- Maintain the existing game mechanics
- Ensure the T-Rex movement logic remains consistent
- Test any changes to the dice rolling or token selection features thoroughly

### Uno Card Game
- Maintain the standard Uno rules (matching colors or values)
- Ensure special cards (skip, reverse, draw two, wild) function correctly
- Test the game with different player counts (2-4 players)
- Verify that the AI player logic makes reasonable decisions
- Ensure the UI updates correctly after each action

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License. 

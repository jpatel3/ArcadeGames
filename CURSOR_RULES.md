# Cursor Rules for Arcade Games Collection

This document outlines the conventions and rules for developing and maintaining games in the Arcade Games Collection.

## Project Structure

```
arcade-games/
├── games/
│   ├── GameName/
│   │   ├── index.html
│   │   ├── game.js
│   │   ├── styles.css
│   │   ├── package.json (if needed)
│   │   ├── README.md
│   │   ├── download_assets.sh
│   │   ├── download-assets.js (if needed)
│   │   └── assets/
│   │       ├── sounds/
│   │       └── images/
├── package.json
├── README.md
└── CURSOR_RULES.md
```

## Package.json Conventions

### Root Package.json
- Must include scripts for each game:
  ```json
  {
    "scripts": {
      "start": "serve .",
      "start:gamename": "serve games/GameName",
      "download-assets:gamename": "cd games/GameName && ./download_assets.sh",
      "lint": "eslint . --ext .js",
      "lint:fix": "eslint . --ext .js --fix",
      "validate": "html-validate games/**/index.html"
    }
  }
  ```

### Game-Specific Package.json (if needed)
- Only include game-specific dependencies
- Use consistent script names:
  ```json
  {
    "scripts": {
      "start": "serve .",
      "download-assets": "node download-assets.js"
    }
  }
  ```

## Asset Management

### Naming Conventions
- Shell scripts: `download_assets.sh` (use underscore)
- JavaScript scripts: `download-assets.js` (use hyphen)
- Asset directories: `assets/sounds/`, `assets/images/`

### Asset Download Script Structure
1. Shell Script (`download_assets.sh`):
   ```bash
   #!/bin/bash
   set -e
   
   echo "Installing dependencies..."
   npm install
   
   echo "Downloading game assets..."
   node download-assets.js
   
   echo "Setup complete! You can now start the game using: npm start"
   ```

2. JavaScript Script (`download-assets.js`):
   ```javascript
   const https = require('https');
   const fs = require('fs');
   const path = require('path');
   
   const ASSETS = [
     {
       name: 'filename.ext',
       url: 'https://example.com/asset'
     }
   ];
   
   // Include standard download and directory creation functions
   ```

## Development Server

- Use `serve` package for development servers
- Do not use alternative servers like `http-server`

## File Structure Requirements

### Each Game Directory Must Include
1. `index.html` - Main game file
2. `game.js` - Game logic
3. `styles.css` - Game styles
4. `README.md` - Game documentation
5. `download_assets.sh` - Asset download script
6. `assets/` directory - For game assets

### README.md Requirements
Each game's README.md should include:
1. Game description
2. How to play instructions
3. Controls documentation
4. Features list
5. Technical details
6. Setup instructions

## Code Style

### JavaScript
- Use ESLint with standard configuration
- Follow project's `.eslintrc.json` rules
- Use 2 spaces for indentation

### HTML
- Validate using html-validate
- Follow semantic HTML principles
- Include proper meta tags and viewport settings

### CSS
- Use consistent class naming conventions
- Implement responsive design
- Include mobile-friendly controls when applicable

## Game Implementation Guidelines

1. Asset Loading
   - Use asynchronous loading for assets
   - Implement loading screens for large assets
   - Handle loading errors gracefully

2. Sound Management
   - Use Howler.js for sound effects
   - Implement volume controls
   - Allow sound muting

3. Responsive Design
   - Support both desktop and mobile
   - Implement touch controls for mobile
   - Use relative units (rem, %, vh/vw)

4. State Management
   - Use localStorage for high scores
   - Implement pause/resume functionality
   - Handle game over states

## Testing and Validation

Before submitting a new game:
1. Run `npm run lint` to check JavaScript
2. Run `npm run validate` to check HTML
3. Test on multiple browsers
4. Test on mobile devices
5. Verify all assets load correctly

## Deployment

1. Ensure all assets are properly linked
2. Test the download-assets script
3. Verify the game works with clean installation
4. Update main README.md with game entry

## Common Pitfalls to Avoid

1. Don't hardcode asset URLs in game code
2. Don't commit large binary files to git
3. Don't use different development servers
4. Don't skip mobile device support
5. Don't forget to handle loading states

## Adding a New Game

1. Create directory structure
2. Copy template files if available
3. Implement game following guidelines
4. Add scripts to root package.json
5. Test all functionality
6. Update documentation 

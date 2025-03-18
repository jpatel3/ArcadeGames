const fs = require('fs');
const path = require('path');

// Create sounds directory if it doesn't exist
const soundsDir = path.join(__dirname, 'assets', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// Create empty sound files
const soundFiles = [
  'pop.mp3',
  'correct.mp3',
  'incorrect.mp3',
  'background.mp3'
];

soundFiles.forEach(file => {
  const filePath = path.join(soundsDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
    console.log(`Created placeholder sound file: ${file}`);
  }
});

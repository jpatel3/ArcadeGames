const https = require('https');
const fs = require('fs');
const path = require('path');

const SOUND_ASSETS = [
  {
    name: 'eat.mp3',
    url: 'https://assets.mixkit.co/active_storage/sfx/2205/2205-preview.mp3'
  },
  {
    name: 'game-over.mp3',
    url: 'https://assets.mixkit.co/active_storage/sfx/2218/2218-preview.mp3'
  },
  {
    name: 'turn.mp3',
    url: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'
  }
];

const downloadFile = (url, destination) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https.get(url, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${destination}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {
        reject(err);
      });
    });
  });
};

const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const downloadAssets = async () => {
  const soundsDir = path.join(__dirname, 'assets', 'sounds');
  ensureDirectoryExists(soundsDir);

  console.log('Downloading sound assets...');

  for (const asset of SOUND_ASSETS) {
    const destination = path.join(soundsDir, asset.name);
    try {
      await downloadFile(asset.url, destination);
    } catch (error) {
      console.error(`Error downloading ${asset.name}:`, error.message);
    }
  }

  console.log('Asset download complete!');
};

downloadAssets().catch(console.error);

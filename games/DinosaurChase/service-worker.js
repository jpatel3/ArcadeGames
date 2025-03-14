const CACHE_NAME = 'dinosaur-chase-game-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './game.js',
  './manifest.json',
  './assets/images/jungle-background.jpg',
  './assets/images/chameleon.png',
  './assets/images/favicon.ico',
  './assets/sounds/background-music.mp3',
  './assets/sounds/dice-roll.mp3',
  './assets/sounds/move.mp3',
  './assets/sounds/roar.mp3',
  './assets/sounds/win.mp3',
  './assets/sounds/lose.mp3'
];

// Add token images to cache
for (let i = 1; i <= 10; i++) {
  urlsToCache.push(`./assets/images/tokens/token-${i}.png`);
}

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

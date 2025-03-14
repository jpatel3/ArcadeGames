// Service Worker for Uno Game

const CACHE_NAME = 'uno-game-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './game.js',
  './assets/images/card-back.png',
  './assets/images/table-background.jpg',
  './assets/images/favicon.ico',
  './assets/sounds/card-deal.mp3',
  './assets/sounds/card-shuffle.mp3',
  './assets/sounds/uno-call.mp3',
  './assets/sounds/game-win.mp3',
  './assets/sounds/draw-card.mp3',
  './assets/sounds/background-music.mp3'
];

// Card images to cache
const cardColors = ['red', 'blue', 'green', 'yellow'];
const cardNumbers = Array.from({ length: 10 }, (_, i) => i); // 0-9
const cardActions = ['skip', 'reverse', 'draw-two'];
const cardWilds = ['wild', 'wild-draw-four'];

// Add all card images to cache list
cardColors.forEach(color => {
  cardNumbers.forEach(number => {
    urlsToCache.push(`./assets/images/cards/${color}-${number}.png`);
  });

  cardActions.forEach(action => {
    urlsToCache.push(`./assets/images/cards/${color}-${action}.png`);
  });
});

cardWilds.forEach(wild => {
  urlsToCache.push(`./assets/images/cards/${wild}.png`);
});

// Install event - cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
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
          return Promise.resolve(); // Return a resolved promise for caches we want to keep
        })
      );
    })
  );
});

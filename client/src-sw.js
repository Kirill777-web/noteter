const { warmStrategyCache } = require('workbox-recipes');
const { NetworkFirst, CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

// Pre-cache all assets mentioned in the manifest generated by Workbox
precacheAndRoute(self.__WB_MANIFEST);

// Define pageCache for HTML pages using Cache First strategy
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({ statuses: [0, 200] }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});
//Event listener for the 'install' event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event in progress.');
  event.waitUntil(
    caches.open('static-cache').then((cache) => {
      return cache.addAll(['/main.bundle.js', '/install.bundle.js']);
    })
  );
});

// Event listener for the 'activate' event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event in progress.');
  warmStrategyCache({
    urls: ['/index.html', '/'],
    strategy: pageCache,
  });
});

// Event listener for the 'fetch' event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log(
            `Service Worker: Serving ${event.request.url} from cache.`
          );
          return cachedResponse;
        }
        console.log(
          `Service Worker: Fetching ${event.request.url} from network.`
        );
        return fetch(event.request);
      })
      .catch((error) => {
        console.error(
          `Service Worker: Fetch failed for ${event.request.url}`,
          error
        );
      })
  );
});

// Register routes

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  })
);

registerRoute(
  ({ request }) => ['style', 'script', 'image'].includes(request.destination),
  new CacheFirst({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60,
        maxEntries: 60,
      }),
    ],
  })
);

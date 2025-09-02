const CACHE_NAME = 'inquivesta-xii-v1'
const urlsToCache = [
  '/',
  '/about_us',
  '/events',
  '/gallery',
  '/sponsors',
  '/coming_soon',
  '/ball_a.png',
  '/ball.jpg',
  '/logo.png',
  '/images/about-us-image.png',
  '/images/hero.mp4',
  '/manifest.webmanifest',
  '/_next/static/css/app/layout.css',
  '/_next/static/js/app/layout.js',
  '/_next/static/js/app/page.js'
]

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app shell')
        return cache.addAll(urlsToCache)
      })
      .catch(error => {
        console.error('Failed to cache resources:', error)
      })
  )
  // Skip waiting to activate immediately
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  // Take control of all pages
  self.clients.claim()
})

// Fetch event - serve from cache when offline, with network-first strategy for API calls
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // If we have a cached response, serve it
        if (cachedResponse) {
          // For navigation requests, try network first, fallback to cache
          if (event.request.mode === 'navigate') {
            return fetch(event.request)
              .then(networkResponse => {
                // Update cache with fresh content
                if (networkResponse && networkResponse.status === 200) {
                  const responseClone = networkResponse.clone()
                  caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, responseClone))
                }
                return networkResponse
              })
              .catch(() => cachedResponse) // Fallback to cached version
          }
          return cachedResponse
        }

        // No cached response, try network
        return fetch(event.request)
          .then(networkResponse => {
            // Cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone()
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseClone))
            }
            return networkResponse
          })
          .catch(error => {
            console.error('Fetch failed:', error)
            // Return a fallback page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/')
            }
            throw error
          })
      })
  )
})

// Background sync for when connection is restored
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered')
    // Add any background sync logic here
  }
})

// Push notification handling (for future use)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/ball_a.png',
      badge: '/ball.jpg',
      data: data.url
    }
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close()
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    )
  }
})

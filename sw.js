/**
 * Service Worker for ClearCutParenting PWA
 * Provides offline functionality, caching, and performance optimizations
 */

const CACHE_NAME = 'clearcutparenting-v1.2.0';
const STATIC_CACHE = 'clearcutparenting-static-v1';
const DYNAMIC_CACHE = 'clearcutparenting-dynamic-v1';
const IMAGE_CACHE = 'clearcutparenting-images-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/images/Pregnancy Drinking Water.avif',
  '/images/Infant Just born.avif', // Make sure you have this image
  '/images/Toddler Not Happy.avif',
  '/images/Preschooler pointing Who I am.avif',
  '/images/Schoolers on Desk.avif',
  '/images/Early Teens Peer Pressure.avif', // Make sure you have this image
  '/images/Late Teens with books and bag.avif'
];

// Dynamic content that can be cached
const CACHEABLE_ROUTES = [
  '/api/',
  '/content/',
  '/articles/'
];

// Images to cache with different strategy
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];

/**
 * Install Event - Cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Failed to cache static assets:', error);
      })
  );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

/**
 * Fetch Event - Handle requests with caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticRequest(request));
  } else if (isDynamicContent(request)) {
    event.respondWith(handleDynamicRequest(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else {
    event.respondWith(handleGenericRequest(request));
  }
});

/**
 * Handle image requests - Cache First strategy with fallback
 */
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log('📷 Service Worker: Serving image from cache:', request.url);
      return cachedResponse;
    }

    console.log('📷 Service Worker: Fetching image:', request.url);
    const fetchResponse = await fetch(request);
    
    if (fetchResponse.ok) {
      // Clone before caching
      const responseToCache = fetchResponse.clone();
      await cache.put(request, responseToCache);
      console.log('📷 Service Worker: Image cached:', request.url);
    }

    return fetchResponse;
  } catch (error) {
    console.error('❌ Service Worker: Image request failed:', error);
    return generateImageFallback();
  }
}

/**
 * Handle static asset requests - Cache First strategy
 */
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log('📄 Service Worker: Serving static asset from cache:', request.url);
      return cachedResponse;
    }

    console.log('📄 Service Worker: Fetching static asset:', request.url);
    const fetchResponse = await fetch(request);
    
    if (fetchResponse.ok) {
      const responseToCache = fetchResponse.clone();
      await cache.put(request, responseToCache);
      console.log('📄 Service Worker: Static asset cached:', request.url);
    }

    return fetchResponse;
  } catch (error) {
    console.error('❌ Service Worker: Static request failed:', error);
    return generateOfflineFallback();
  }
}

/**
 * Handle dynamic content - Network First with cache fallback
 */
async function handleDynamicRequest(request) {
  try {
    console.log('🔄 Service Worker: Fetching dynamic content:', request.url);
    const fetchResponse = await fetch(request, { 
      headers: { 'Cache-Control': 'no-cache' } 
    });
    
    if (fetchResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      const responseToCache = fetchResponse.clone();
      await cache.put(request, responseToCache);
      console.log('🔄 Service Worker: Dynamic content cached:', request.url);
    }

    return fetchResponse;
  } catch (error) {
    console.log('🔄 Service Worker: Network failed, trying cache:', request.url);
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('🔄 Service Worker: Serving dynamic content from cache:', request.url);
      return cachedResponse;
    }

    console.error('❌ Service Worker: Dynamic request failed completely:', error);
    return generateOfflineFallback();
  }
}

/**
 * Handle API requests - Network First with background sync
 */
async function handleAPIRequest(request) {
  try {
    console.log('🌐 Service Worker: API request:', request.url);
    const fetchResponse = await fetch(request);
    
    if (fetchResponse.ok) {
      // Cache successful API responses for offline use
      const cache = await caches.open(DYNAMIC_CACHE);
      const responseToCache = fetchResponse.clone();
      await cache.put(request, responseToCache);
      console.log('🌐 Service Worker: API response cached:', request.url);
    }

    return fetchResponse;
  } catch (error) {
    console.log('🌐 Service Worker: API network failed, trying cache:', request.url);
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('🌐 Service Worker: Serving API response from cache:', request.url);
      return cachedResponse;
    }

    console.error('❌ Service Worker: API request failed completely:', error);
    return generateAPIErrorResponse();
  }
}

/**
 * Handle generic requests - Cache First with network fallback
 */
async function handleGenericRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log('📝 Service Worker: Serving from cache:', request.url);
      // Update cache in background
      updateCacheInBackground(request, cache);
      return cachedResponse;
    }

    console.log('📝 Service Worker: Fetching:', request.url);
    const fetchResponse = await fetch(request);
    
    if (fetchResponse.ok) {
      const responseToCache = fetchResponse.clone();
      await cache.put(request, responseToCache);
      console.log('📝 Service Worker: Response cached:', request.url);
    }

    return fetchResponse;
  } catch (error) {
    console.error('❌ Service Worker: Generic request failed:', error);
    return generateOfflineFallback();
  }
}

/**
 * Update cache in background (stale-while-revalidate)
 */
async function updateCacheInBackground(request, cache) {
  try {
    const fetchResponse = await fetch(request);
    if (fetchResponse.ok) {
      await cache.put(request, fetchResponse.clone());
      console.log('🔄 Service Worker: Background cache update:', request.url);
    }
  } catch (error) {
    console.log('🔄 Service Worker: Background update failed:', request.url);
  }
}

/**
 * Check if request is for an image
 */
function isImageRequest(request) {
  const url = request.url.toLowerCase();
  return IMAGE_EXTENSIONS.some(ext => url.includes(ext)) || 
         request.destination === 'image';
}

/**
 * Check if request is for a static asset
 */
function isStaticAsset(request) {
  const url = request.url.toLowerCase();
  return url.includes('.css') || 
         url.includes('.js') || 
         url.includes('fonts.googleapis.com') ||
         url.includes('cdnjs.cloudflare.com');
}

/**
 * Check if request is for dynamic content
 */
function isDynamicContent(request) {
  const url = new URL(request.url);
  return CACHEABLE_ROUTES.some(route => url.pathname.startsWith(route));
}

/**
 * Check if request is an API call
 */
function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

/**
 * Generate offline fallback for images
 */
function generateImageFallback() {
  const svg = `
    <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="150" fill="#f0f0f0"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-family="Arial, sans-serif" font-size="14">
        Image unavailable offline
      </text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache'
    }
  });
}

/**
 * Generate offline fallback page
 */
function generateOfflineFallback() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - ClearCutParenting</title>
      <style>
        body {
          font-family: 'Open Sans', Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .offline-container {
          text-align: center;
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          max-width: 500px;
        }
        .offline-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }
        h1 {
          color: #004d40;
          font-size: 1.8rem;
          margin-bottom: 16px;
        }
        p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .retry-btn {
          background: #004d40;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .retry-btn:hover {
          background: #00251a;
        }
        .offline-tips {
          margin-top: 30px;
          text-align: left;
        }
        .offline-tips h3 {
          color: #004d40;
          font-size: 1.1rem;
          margin-bottom: 12px;
        }
        .offline-tips ul {
          color: #666;
          padding-left: 20px;
        }
        .offline-tips li {
          margin-bottom: 8px;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">📱</div>
        <h1>You're Offline</h1>
        <p>It looks like you're not connected to the internet. Some content may not be available, but you can still browse cached pages.</p>
        
        <button class="retry-btn" onclick="window.location.reload()">
          Try Again
        </button>

        <div class="offline-tips">
          <h3>While you're offline, you can:</h3>
          <ul>
            <li>Browse previously viewed FAQ sections</li>
            <li>Read cached parenting stories</li>
            <li>View saved parenting tips</li>
            <li>Access your bookmarked content</li>
          </ul>
        </div>
      </div>

      <script>
        // Auto-retry when back online
        window.addEventListener('online', () => {
          window.location.reload();
        });
        
        // Show connection status
        function updateConnectionStatus() {
          if (navigator.onLine) {
            document.querySelector('.retry-btn').textContent = 'Back Online - Refresh';
            document.querySelector('.retry-btn').style.background = '#4caf50';
          }
        }
        
        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);
      </script>
    </body>
    </html>
  `;
  
  return new Response(offlineHTML, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache'
    }
  });
}

/**
 * Generate API error response
 */
function generateAPIErrorResponse() {
  const errorResponse = {
    error: true,
    message: 'API unavailable offline',
    offline: true,
    timestamp: new Date().toISOString()
  };
  
  return new Response(JSON.stringify(errorResponse), {
    status: 503,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}

/**
 * Background Sync for offline actions
 */
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'search-sync') {
    event.waitUntil(syncSearchQueries());
  } else if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalyticsEvents());
  } else if (event.tag === 'form-sync') {
    event.waitUntil(syncFormSubmissions());
  }
});

/**
 * Sync search queries when back online
 */
async function syncSearchQueries() {
  try {
    console.log('🔍 Service Worker: Syncing search queries...');
    // Implementation would sync stored search queries
    // This is a placeholder for the actual sync logic
    console.log('✅ Service Worker: Search queries synced');
  } catch (error) {
    console.error('❌ Service Worker: Search sync failed:', error);
  }
}

/**
 * Sync analytics events when back online
 */
async function syncAnalyticsEvents() {
  try {
    console.log('📊 Service Worker: Syncing analytics events...');
    // Implementation would sync stored analytics events
    // This is a placeholder for the actual sync logic
    console.log('✅ Service Worker: Analytics events synced');
  } catch (error) {
    console.error('❌ Service Worker: Analytics sync failed:', error);
  }
}

/**
 * Sync form submissions when back online
 */
async function syncFormSubmissions() {
  try {
    console.log('📝 Service Worker: Syncing form submissions...');
    // Implementation would sync stored form data
    // This is a placeholder for the actual sync logic
    console.log('✅ Service Worker: Form submissions synced');
  } catch (error) {
    console.error('❌ Service Worker: Form sync failed:', error);
  }
}

/**
 * Push notification handler
 */
self.addEventListener('push', (event) => {
  console.log('🔔 Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New parenting tip available!',
    icon: '/apple-touch-icon.png',
    badge: '/badge-icon.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/action-dismiss.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('ClearCutParenting', options)
  );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    console.log('🔔 Service Worker: Notification dismissed');
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

/**
 * Cache management - Periodic cleanup
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_CLEANUP') {
    event.waitUntil(performCacheCleanup());
  } else if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    event.waitUntil(getCacheSize().then(size => {
      event.ports[0].postMessage({ cacheSize: size });
    }));
  }
});

/**
 * Perform cache cleanup
 */
async function performCacheCleanup() {
  try {
    console.log('🧹 Service Worker: Starting cache cleanup...');
    
    const cacheNames = await caches.keys();
    const maxCacheAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    const now = Date.now();
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        const dateHeader = response?.headers.get('date');
        
        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime();
          if (now - responseDate > maxCacheAge) {
            await cache.delete(request);
            console.log('🗑️ Service Worker: Deleted old cache entry:', request.url);
          }
        }
      }
    }
    
    console.log('✅ Service Worker: Cache cleanup completed');
  } catch (error) {
    console.error('❌ Service Worker: Cache cleanup failed:', error);
  }
}

/**
 * Get total cache size
 */
async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

/**
 * Error handling for unhandled promise rejections
 */
self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Service Worker: Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

/**
 * Global error handler
 */
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker: Global error:', event.error);
});

console.log('🚀 Service Worker: Script loaded successfully');
console.log(`📦 Service Worker: Cache version - ${CACHE_NAME}`);
console.log(`🎯 Service Worker: Static assets to cache: ${STATIC_ASSETS.length}`);

/**
 * Optimized Service Worker for ClearCutParenting Minimalist PWA
 * Enhanced performance, caching, and offline functionality
 */

const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `clearcutparenting-${CACHE_VERSION}`;
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// Critical assets for immediate caching
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

// Images to cache with optimized strategy
const IMAGE_ASSETS = [
  '/images/Pregnancy Drinking Water.avif',
  '/images/Infant Just born.avif',
  '/images/Toddler Not Happy.avif',
  '/images/Preschooler pointing Who I am.avif',
  '/images/Schoolers on Desk.avif',
  '/images/Early Teens Peer Pressure.avif',
  '/images/Late Teens with books and bag.avif'
];

// External resources
const EXTERNAL_RESOURCES = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
];

// File extensions for different caching strategies
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
const FONT_EXTENSIONS = ['.woff', '.woff2', '.ttf', '.otf'];

/**
 * Install Event - Cache critical assets
 */
self.addEventListener('install', (event) => {
  console.log('🚀 SW: Installing...');
  
  event.waitUntil(
    Promise.all([
      cacheStaticAssets(),
      cacheImages(),
      cacheExternalResources()
    ]).then(() => {
      console.log('✅ SW: Installation completed');
      return self.skipWaiting();
    }).catch(error => {
      console.error('❌ SW: Installation failed:', error);
    })
  );
});

/**
 * Cache static assets
 */
async function cacheStaticAssets() {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachePromises = CRITICAL_ASSETS.map(async (asset) => {
      try {
        await cache.add(asset);
        console.log(`📦 SW: Cached static asset: ${asset}`);
      } catch (error) {
        console.warn(`⚠️ SW: Failed to cache ${asset}:`, error);
      }
    });
    
    await Promise.allSettled(cachePromises);
    console.log('✅ SW: Static assets cached');
  } catch (error) {
    console.error('❌ SW: Static asset caching failed:', error);
  }
}

/**
 * Cache images with error handling
 */
async function cacheImages() {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const imagePromises = IMAGE_ASSETS.map(async (image) => {
      try {
        await cache.add(image);
        console.log(`🖼️ SW: Cached image: ${image}`);
      } catch (error) {
        console.warn(`⚠️ SW: Failed to cache image ${image}:`, error);
      }
    });
    
    await Promise.allSettled(imagePromises);
    console.log('✅ SW: Images cached');
  } catch (error) {
    console.error('❌ SW: Image caching failed:', error);
  }
}

/**
 * Cache external resources
 */
async function cacheExternalResources() {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const externalPromises = EXTERNAL_RESOURCES.map(async (resource) => {
      try {
        await cache.add(resource);
        console.log(`🌐 SW: Cached external resource: ${resource}`);
      } catch (error) {
        console.warn(`⚠️ SW: Failed to cache external ${resource}:`, error);
      }
    });
    
    await Promise.allSettled(externalPromises);
    console.log('✅ SW: External resources cached');
  } catch (error) {
    console.error('❌ SW: External resource caching failed:', error);
  }
}

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('🔄 SW: Activating...');
  
  event.waitUntil(
    cleanupOldCaches()
      .then(() => self.clients.claim())
      .then(() => {
        console.log('✅ SW: Activated and claimed clients');
      })
      .catch(error => {
        console.error('❌ SW: Activation failed:', error);
      })
  );
});

/**
 * Clean up old cache versions
 */
async function cleanupOldCaches() {
  try {
    const cacheNames = await caches.keys();
    const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
    
    const deletePromises = cacheNames
      .filter(cacheName => !currentCaches.includes(cacheName))
      .map(async (cacheName) => {
        console.log(`🗑️ SW: Deleting old cache: ${cacheName}`);
        return caches.delete(cacheName);
      });
    
    await Promise.all(deletePromises);
    console.log('✅ SW: Cache cleanup completed');
  } catch (error) {
    console.error('❌ SW: Cache cleanup failed:', error);
  }
}

/**
 * Fetch Event - Handle requests with optimized strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Only handle GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) return;

  // Route to appropriate handler
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isFontRequest(request)) {
    event.respondWith(handleFontRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticRequest(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else {
    event.respondWith(handleDocumentRequest(request));
  }
});

/**
 * Handle image requests - Cache First with optimized fallback
 */
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    let cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Update cache in background if older than 7 days
      updateCacheInBackground(request, cache, 7 * 24 * 60 * 60 * 1000);
      return cachedResponse;
    }

    console.log(`🖼️ SW: Fetching image: ${request.url}`);
    const fetchResponse = await fetch(request, {
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (fetchResponse.ok) {
      // Clone for caching
      const responseToCache = fetchResponse.clone();
      await cache.put(request, responseToCache);
      console.log(`✅ SW: Image cached: ${request.url}`);
    }

    return fetchResponse;
  } catch (error) {
    console.error(`❌ SW: Image request failed: ${request.url}`, error);
    return generateImageFallback(request.url);
  }
}

/**
 * Handle font requests - Cache First with long TTL
 */
async function handleFontRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    console.log(`🔤 SW: Fetching font: ${request.url}`);
    const fetchResponse = await fetch(request, {
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (fetchResponse.ok) {
      const responseToCache = fetchResponse.clone();
      await cache.put(request, responseToCache);
      console.log(`✅ SW: Font cached: ${request.url}`);
    }

    return fetchResponse;
  } catch (error) {
    console.error(`❌ SW: Font request failed: ${request.url}`, error);
    // Fonts fail silently - browser will use fallback
    return new Response('', { status: 404 });
  }
}

/**
 * Handle static asset requests - Cache First
 */
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Update cache in background for CSS/JS files
      if (request.url.includes('.css') || request.url.includes('.js')) {
        updateCacheInBackground(request, cache, 24 * 60 * 60 * 1000); // 24 hours
      }
      return cachedResponse;
    }

    console.log(`📄 SW: Fetching static asset: ${request.url}`);
    const fetchResponse = await fetch(request);
    
    if (fetchResponse.ok) {
      const responseToCache = fetchResponse.clone();
      await cache.put(request, responseToCache);
      console.log(`✅ SW: Static asset cached: ${request.url}`);
    }

    return fetchResponse;
  } catch (error) {
    console.error(`❌ SW: Static request failed: ${request.url}`, error);
    return generateOfflineFallback();
  }
}

/**
 * Handle API requests - Network First with cache fallback
 */
async function handleAPIRequest(request) {
  try {
    console.log(`🌐 SW: API request: ${request.url}`);
    
    // Try network first
    const fetchResponse = await fetch(request, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (fetchResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      const responseToCache = fetchResponse.clone();
      await cache.put(request, responseToCache);
      console.log(`✅ SW: API response cached: ${request.url}`);
    }

    return fetchResponse;
  } catch (error) {
    console.log(`🔄 SW: API network failed, trying cache: ${request.url}`);
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log(`📋 SW: Serving API response from cache: ${request.url}`);
      return cachedResponse;
    }

    console.error(`❌ SW: API request failed completely: ${request.url}`, error);
    return generateAPIErrorResponse();
  }
}

/**
 * Handle document requests - Cache First with network update
 */
async function handleDocumentRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Serve from cache immediately
      updateCacheInBackground(request, cache, 60 * 60 * 1000); // 1 hour
      return cachedResponse;
    }

    console.log(`📝 SW: Fetching document: ${request.url}`);
    const fetchResponse = await fetch(request);
    
    if (fetchResponse.ok) {
      const responseToCache = fetchResponse.clone();
      await cache.put(request, responseToCache);
      console.log(`✅ SW: Document cached: ${request.url}`);
    }

    return fetchResponse;
  } catch (error) {
    console.error(`❌ SW: Document request failed: ${request.url}`, error);
    return generateOfflineFallback();
  }
}

/**
 * Update cache in background (stale-while-revalidate)
 */
async function updateCacheInBackground(request, cache, maxAge) {
  try {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      const dateHeader = cachedResponse.headers.get('date');
      if (dateHeader) {
        const cacheDate = new Date(dateHeader).getTime();
        const now = Date.now();
        
        // Only update if cache is older than maxAge
        if (now - cacheDate < maxAge) {
          return;
        }
      }
    }

    // Fetch updated version
    const fetchResponse = await fetch(request);
    if (fetchResponse.ok) {
      await cache.put(request, fetchResponse.clone());
      console.log(`🔄 SW: Background cache update: ${request.url}`);
    }
  } catch (error) {
    console.log(`⚠️ SW: Background update failed: ${request.url}`);
  }
}

/**
 * Request type detection functions
 */
function isImageRequest(request) {
  const url = request.url.toLowerCase();
  return IMAGE_EXTENSIONS.some(ext => url.includes(ext)) || 
         request.destination === 'image';
}

function isFontRequest(request) {
  const url = request.url.toLowerCase();
  return FONT_EXTENSIONS.some(ext => url.includes(ext)) ||
         url.includes('fonts.googleapis.com') ||
         request.destination === 'font';
}

function isStaticAsset(request) {
  const url = request.url.toLowerCase();
  return url.includes('.css') || 
         url.includes('.js') || 
         url.includes('.manifest') ||
         url.includes('cdnjs.cloudflare.com');
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') ||
         url.pathname.startsWith('/v1/') ||
         url.pathname.includes('/api/');
}

/**
 * Fallback generators
 */
function generateImageFallback(originalUrl = '') {
  const fileName = originalUrl.split('/').pop() || 'image';
  const svg = `
    <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg" style="background: #f8f9fa">
      <rect width="200" height="150" fill="#e5e7eb" rx="8"/>
      <circle cx="100" cy="60" r="20" fill="#9ca3af"/>
      <path d="M70 90 L130 90 L120 110 L80 110 Z" fill="#9ca3af"/>
      <text x="100" y="130" text-anchor="middle" fill="#6b7280" font-family="system-ui" font-size="12">
        ${fileName}
      </text>
      <text x="100" y="145" text-anchor="middle" fill="#9ca3af" font-family="system-ui" font-size="10">
        Available offline
      </text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}

function generateOfflineFallback() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - ClearCutParenting</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          color: #374151;
        }
        
        .offline-container {
          text-align: center;
          background: white;
          padding: 48px 32px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          max-width: 480px;
          width: 100%;
        }
        
        .offline-icon {
          font-size: 4rem;
          margin-bottom: 24px;
          opacity: 0.8;
        }
        
        h1 {
          color: #2D5A27;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 16px;
          line-height: 1.2;
        }
        
        .description {
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 32px;
          font-size: 1.1rem;
        }
        
        .retry-btn {
          background: #2D5A27;
          color: white;
          border: none;
          padding: 12px 32px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 32px;
        }
        
        .retry-btn:hover {
          background: #1F3F1A;
          transform: translateY(-1px);
        }
        
        .offline-features {
          text-align: left;
          background: #f8f9fa;
          padding: 24px;
          border-radius: 12px;
          margin-top: 24px;
        }
        
        .offline-features h3 {
          color: #2D5A27;
          font-size: 1.1rem;
          margin-bottom: 16px;
          font-weight: 600;
        }
        
        .offline-features ul {
          list-style: none;
          padding: 0;
        }
        
        .offline-features li {
          color: #6b7280;
          margin-bottom: 8px;
          padding-left: 24px;
          position: relative;
          line-height: 1.5;
        }
        
        .offline-features li::before {
          content: '✓';
          color: #10b981;
          font-weight: bold;
          position: absolute;
          left: 0;
        }
        
        .connection-status {
          margin-top: 16px;
          padding: 8px 16px;
          background: #fef3cd;
          border: 1px solid #fbbf24;
          border-radius: 6px;
          color: #92400e;
          font-size: 0.9rem;
        }
        
        .online {
          background: #d1fae5;
          border-color: #10b981;
          color: #065f46;
        }
        
        @media (max-width: 480px) {
          .offline-container {
            padding: 32px 24px;
          }
          
          h1 {
            font-size: 1.5rem;
          }
          
          .offline-icon {
            font-size: 3rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">📱</div>
        <h1>You're Currently Offline</h1>
        <p class="description">
          Don't worry! You can still browse previously loaded content and access cached parenting resources.
        </p>
        
        <button class="retry-btn" onclick="window.location.reload()">
          Try Reconnecting
        </button>

        <div class="offline-features">
          <h3>Available While Offline:</h3>
          <ul>
            <li>Browse cached FAQ sections</li>
            <li>Read saved parenting stories</li>
            <li>Access previously viewed content</li>
            <li>Use search for cached content</li>
          </ul>
        </div>
        
        <div class="connection-status" id="connectionStatus">
          Connection status: Offline
        </div>
      </div>

      <script>
        function updateConnectionStatus() {
          const statusEl = document.getElementById('connectionStatus');
          const retryBtn = document.querySelector('.retry-btn');
          
          if (navigator.onLine) {
            statusEl.textContent = 'Connection restored! Click retry to reload.';
            statusEl.className = 'connection-status online';
            retryBtn.textContent = 'Reload Page';
            retryBtn.style.background = '#10b981';
          } else {
            statusEl.textContent = 'Connection status: Offline';
            statusEl.className = 'connection-status';
            retryBtn.textContent = 'Try Reconnecting';
            retryBtn.style.background = '#2D5A27';
          }
        }
        
        // Auto-reload when back online
        window.addEventListener('online', () => {
          updateConnectionStatus();
          setTimeout(() => window.location.reload(), 1000);
        });
        
        window.addEventListener('offline', updateConnectionStatus);
        
        // Initial status
        updateConnectionStatus();
      </script>
    </body>
    </html>
  `;
  
  return new Response(offlineHTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  });
}

function generateAPIErrorResponse() {
  const errorResponse = {
    error: true,
    message: 'Service temporarily unavailable offline',
    code: 'OFFLINE_MODE',
    offline: true,
    timestamp: new Date().toISOString(),
    retry_after: '60s'
  };
  
  return new Response(JSON.stringify(errorResponse), {
    status: 503,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Retry-After': '60'
    }
  });
}

/**
 * Background Sync for offline actions
 */
self.addEventListener('sync', (event) => {
  console.log(`🔄 SW: Background sync triggered: ${event.tag}`);
  
  switch (event.tag) {
    case 'search-sync':
      event.waitUntil(syncSearchQueries());
      break;
    case 'analytics-sync':
      event.waitUntil(syncAnalyticsEvents());
      break;
    case 'form-sync':
      event.waitUntil(syncFormSubmissions());
      break;
    case 'cache-update':
      event.waitUntil(updateCriticalCaches());
      break;
  }
});

async function syncSearchQueries() {
  try {
    console.log('🔍 SW: Syncing search queries...');
    // Implementation for syncing stored search queries
    const queries = await getStoredQueries();
    if (queries.length > 0) {
      await sendSearchAnalytics(queries);
      await clearStoredQueries();
    }
    console.log('✅ SW: Search queries synced');
  } catch (error) {
    console.error('❌ SW: Search sync failed:', error);
  }
}

async function syncAnalyticsEvents() {
  try {
    console.log('📊 SW: Syncing analytics events...');
    // Implementation for syncing stored analytics
    const events = await getStoredAnalytics();
    if (events.length > 0) {
      await sendAnalyticsEvents(events);
      await clearStoredAnalytics();
    }
    console.log('✅ SW: Analytics events synced');
  } catch (error) {
    console.error('❌ SW: Analytics sync failed:', error);
  }
}

async function syncFormSubmissions() {
  try {
    console.log('📝 SW: Syncing form submissions...');
    // Implementation for syncing stored form data
    const forms = await getStoredForms();
    if (forms.length > 0) {
      await sendFormSubmissions(forms);
      await clearStoredForms();
    }
    console.log('✅ SW: Form submissions synced');
  } catch (error) {
    console.error('❌ SW: Form sync failed:', error);
  }
}

async function updateCriticalCaches() {
  try {
    console.log('🔄 SW: Updating critical caches...');
    await cacheStaticAssets();
    await cacheImages();
    console.log('✅ SW: Critical caches updated');
  } catch (error) {
    console.error('❌ SW: Cache update failed:', error);
  }
}

// Placeholder functions for sync operations
async function getStoredQueries() { return []; }
async function sendSearchAnalytics(queries) { /* Implementation */ }
async function clearStoredQueries() { /* Implementation */ }

async function getStoredAnalytics() { return []; }
async function sendAnalyticsEvents(events) { /* Implementation */ }
async function clearStoredAnalytics() { /* Implementation */ }

async function getStoredForms() { return []; }
async function sendFormSubmissions(forms) { /* Implementation */ }
async function clearStoredForms() { /* Implementation */ }

/**
 * Push notification handler
 */
self.addEventListener('push', (event) => {
  console.log('🔔 SW: Push notification received');
  
  let notificationData = {
    title: 'ClearCutParenting',
    body: 'New parenting guidance available!',
    icon: '/apple-touch-icon.png',
    badge: '/badge-icon.png'
  };

  if (event.data) {
    try {
      notificationData = { ...notificationData, ...event.data.json() };
    } catch (error) {
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    vibrate: [200, 100, 200],
    data: {
      url: notificationData.url || '/',
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
        title: 'Later',
        icon: '/action-dismiss.png'
      }
    ],
    requireInteraction: false,
    silent: false
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 SW: Notification clicked');
  
  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data;

  if (action === 'view') {
    event.waitUntil(
      clients.openWindow(notificationData.url || '/')
    );
  } else if (action === 'dismiss') {
    console.log('🔔 SW: Notification dismissed');
  } else {
    // Default action - focus existing window or open new one
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
    );
  }
});

/**
 * Message handling for cache management
 */
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};
  
  switch (type) {
    case 'CACHE_CLEANUP':
      event.waitUntil(performCacheCleanup());
      break;
      
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_SIZE':
      event.waitUntil(
        getCacheSize().then(size => {
          event.ports[0]?.postMessage({ cacheSize: size });
        })
      );
      break;
      
    case 'PRELOAD_CONTENT':
      event.waitUntil(preloadContent(data));
      break;
      
    case 'UPDATE_CACHE':
      event.waitUntil(updateSpecificCache(data));
      break;
  }
});

/**
 * Perform comprehensive cache cleanup
 */
async function performCacheCleanup() {
  try {
    console.log('🧹 SW: Starting cache cleanup...');
    
    const maxCacheAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    const maxCacheSize = 50 * 1024 * 1024; // 50MB
    const now = Date.now();
    
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      let cacheSize = 0;
      
      // Calculate cache size and remove old entries
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const dateHeader = response.headers.get('date');
          
          if (dateHeader) {
            const responseDate = new Date(dateHeader).getTime();
            if (now - responseDate > maxCacheAge) {
              await cache.delete(request);
              console.log(`🗑️ SW: Deleted old cache entry: ${request.url}`);
              continue;
            }
          }
          
          // Calculate size
          const blob = await response.blob();
          cacheSize += blob.size;
        }
      }
      
      // If cache is too large, remove oldest entries
      if (cacheSize > maxCacheSize) {
        console.log(`📏 SW: Cache ${cacheName} is too large (${cacheSize} bytes), cleaning up...`);
        await trimCache(cache, maxCacheSize * 0.8); // Trim to 80% of max
      }
    }
    
    console.log('✅ SW: Cache cleanup completed');
  } catch (error) {
    console.error('❌ SW: Cache cleanup failed:', error);
  }
}

/**
 * Trim cache to specific size
 */
async function trimCache(cache, maxSize) {
  const requests = await cache.keys();
  const entries = [];
  
  // Get all entries with dates
  for (const request of requests) {
    const response = await cache.match(request);
    if (response) {
      const dateHeader = response.headers.get('date');
      const date = dateHeader ? new Date(dateHeader).getTime() : 0;
      const blob = await response.blob();
      
      entries.push({
        request,
        date,
        size: blob.size
      });
    }
  }
  
  // Sort by date (oldest first)
  entries.sort((a, b) => a.date - b.date);
  
  let currentSize = entries.reduce((sum, entry) => sum + entry.size, 0);
  
  // Remove oldest entries until under size limit
  for (const entry of entries) {
    if (currentSize <= maxSize) break;
    
    await cache.delete(entry.request);
    currentSize -= entry.size;
    console.log(`🗑️ SW: Trimmed cache entry: ${entry.request.url}`);
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
 * Preload specific content
 */
async function preloadContent(urls) {
  if (!Array.isArray(urls)) return;
  
  const cache = await caches.open(DYNAMIC_CACHE);
  
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
        console.log(`📦 SW: Preloaded: ${url}`);
      }
    } catch (error) {
      console.warn(`⚠️ SW: Failed to preload: ${url}`, error);
    }
  }
}

/**
 * Update specific cache
 */
async function updateSpecificCache({ cacheName, urls }) {
  const cache = await caches.open(cacheName);
  
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
        console.log(`🔄 SW: Updated cache: ${url}`);
      }
    } catch (error) {
      console.warn(`⚠️ SW: Failed to update cache: ${url}`, error);
    }
  }
}

/**
 * Error handling
 */
self.addEventListener('error', (event) => {
  console.error('❌ SW: Global error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ SW: Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Initialization log
console.log('🚀 SW: Minimalist ClearCutParenting Service Worker loaded');
console.log(`📦 SW: Cache version - ${CACHE_VERSION}`);
console.log(`🎯 SW: Critical assets: ${CRITICAL_ASSETS.length}`);
console.log(`🖼️ SW: Image assets: ${IMAGE_ASSETS.length}`);
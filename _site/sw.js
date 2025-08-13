/**
 * Minimalist Service Worker for ClearCutParenting PWA
 * Optimized for performance and reliability
 * Version: 3.0.0 - Minimalist Design Update
 */

const CACHE_VERSION = 'v3.0.0';
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

// External resources - Updated for minimalist design
const EXTERNAL_RESOURCES = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
];

// Cache strategies
const CACHE_STRATEGIES = {
  cacheFirst: [
    /\.(?:css|js|woff2?|ttf|otf)$/,
    /fonts\.googleapis\.com/,
    /fonts\.gstatic\.com/
  ],
  networkFirst: [
    /\/api\//,
    /\/manifest\.json$/
  ],
  staleWhileRevalidate: [
    /\.(?:jpg|jpeg|png|gif|webp|avif|svg)$/,
    /cdn-icons-png\.flaticon\.com/
  ]
};

/**
 * Install Event - Cache critical assets
 */
self.addEventListener('install', (event) => {
  console.log('🚀 SW v3.0.0: Installing minimalist version...');
  
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
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('🔄 SW v3.0.0: Activating minimalist version...');
  
  event.waitUntil(
    cleanupOldCaches()
      .then(() => self.clients.claim())
      .then(() => {
        console.log('✅ SW: Activated and claimed clients');
        // Notify all clients about the update
        return notifyClients('SW_UPDATED', { version: CACHE_VERSION });
      })
      .catch(error => {
        console.error('❌ SW: Activation failed:', error);
      })
  );
});

/**
 * Fetch Event - Optimized request handling
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) return;

  // Determine caching strategy
  const url = new URL(request.url);
  
  // Use appropriate strategy based on request type
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request));
  } else if (isImageRequest(request)) {
    event.respondWith(staleWhileRevalidateStrategy(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirstStrategy(request));
  } else {
    event.respondWith(networkFirstStrategy(request));
  }
});

/**
 * Cache static assets
 */
async function cacheStaticAssets() {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachePromises = CRITICAL_ASSETS.map(async (asset) => {
      try {
        const response = await fetch(asset, { cache: 'no-cache' });
        if (response.ok) {
          await cache.put(asset, response);
          console.log(`📦 Cached: ${asset}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to cache ${asset}:`, error);
      }
    });
    
    await Promise.allSettled(cachePromises);
    console.log('✅ Static assets cached');
  } catch (error) {
    console.error('❌ Static caching failed:', error);
  }
}

/**
 * Cache images with optimization
 */
async function cacheImages() {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const imagePromises = IMAGE_ASSETS.map(async (image) => {
      try {
        const response = await fetch(image, { 
          cache: 'no-cache',
          mode: 'cors'
        });
        if (response.ok) {
          await cache.put(image, response);
          console.log(`🖼️ Cached: ${image}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to cache image ${image}:`, error);
      }
    });
    
    await Promise.allSettled(imagePromises);
    console.log('✅ Images cached');
  } catch (error) {
    console.error('❌ Image caching failed:', error);
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
        const response = await fetch(resource, {
          mode: 'cors',
          credentials: 'omit'
        });
        if (response.ok) {
          await cache.put(resource, response);
          console.log(`🌐 Cached: ${resource}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to cache ${resource}:`, error);
      }
    });
    
    await Promise.allSettled(externalPromises);
    console.log('✅ External resources cached');
  } catch (error) {
    console.error('❌ External caching failed:', error);
  }
}

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
        console.log(`🗑️ Deleting old cache: ${cacheName}`);
        return caches.delete(cacheName);
      });
    
    await Promise.all(deletePromises);
    console.log('✅ Cache cleanup completed');
  } catch (error) {
    console.error('❌ Cache cleanup failed:', error);
  }
}

/**
 * Cache First Strategy - For static assets
 */
async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Update cache in background for CSS/JS
      if (request.url.includes('.css') || request.url.includes('.js')) {
        updateCacheInBackground(request, cache);
      }
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return generateOfflineFallback();
  }
}

/**
 * Network First Strategy - For dynamic content
 */
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request, {
      cache: 'no-cache'
    });
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Try cache on network failure
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return generateOfflineFallback();
    }
    
    throw error;
  }
}

/**
 * Stale While Revalidate Strategy - For images
 */
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

/**
 * Update cache in background
 */
async function updateCacheInBackground(request, cache) {
  try {
    const freshResponse = await fetch(request, {
      cache: 'no-cache'
    });
    if (freshResponse.ok) {
      await cache.put(request, freshResponse);
      console.log(`🔄 Updated: ${request.url}`);
    }
  } catch (error) {
    // Silent fail - we have cached version
  }
}

/**
 * Check request types
 */
function isStaticAsset(request) {
  const url = request.url;
  return url.includes('.css') || 
         url.includes('.js') || 
         url.includes('manifest.json') ||
         url.includes('fonts.googleapis.com') ||
         url.includes('fonts.gstatic.com');
}

function isImageRequest(request) {
  const url = request.url.toLowerCase();
  return /\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/.test(url) ||
         url.includes('cdn-icons-png.flaticon.com');
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

/**
 * Generate offline fallback page - Minimalist design
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
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #FFFFFF;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          color: #000000;
        }
        
        .offline-container {
          text-align: center;
          background: #FFFFFF;
          padding: 48px 32px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          max-width: 480px;
          width: 100%;
          border: 1px solid #E0E0E0;
        }
        
        .offline-icon {
          font-size: 3rem;
          margin-bottom: 24px;
          color: #2D5A27;
        }
        
        h1 {
          font-family: Georgia, serif;
          color: #2D5A27;
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 16px;
          line-height: 1.2;
        }
        
        .description {
          color: #666666;
          line-height: 1.6;
          margin-bottom: 32px;
          font-size: 1rem;
        }
        
        .retry-btn {
          background: #2D5A27;
          color: #FFFFFF;
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
          background: #4A7C59;
          transform: translateY(-1px);
        }
        
        .offline-features {
          text-align: left;
          background: #FAFAFA;
          padding: 24px;
          border-radius: 8px;
          margin-top: 24px;
          border: 1px solid #E0E0E0;
        }
        
        .offline-features h3 {
          color: #2D5A27;
          font-size: 1rem;
          margin-bottom: 12px;
          font-weight: 600;
        }
        
        .offline-features ul {
          list-style: none;
          padding: 0;
        }
        
        .offline-features li {
          color: #666666;
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
          line-height: 1.5;
          font-size: 0.875rem;
        }
        
        .offline-features li::before {
          content: '✓';
          color: #87A96B;
          font-weight: bold;
          position: absolute;
          left: 0;
        }
        
        .connection-status {
          margin-top: 16px;
          padding: 8px 16px;
          background: #FFF8F0;
          border: 1px solid #E0E0E0;
          border-radius: 6px;
          color: #666666;
          font-size: 0.875rem;
        }
        
        .online {
          background: #F0FFF4;
          border-color: #87A96B;
          color: #2D5A27;
        }
        
        @media (max-width: 480px) {
          .offline-container {
            padding: 32px 24px;
          }
          
          h1 {
            font-size: 1.5rem;
          }
          
          .offline-icon {
            font-size: 2.5rem;
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
            statusEl.textContent = 'Connection restored! Reloading...';
            statusEl.className = 'connection-status online';
            setTimeout(() => window.location.reload(), 1000);
          } else {
            statusEl.textContent = 'Connection status: Offline';
            statusEl.className = 'connection-status';
          }
        }
        
        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);
        
        // Check initial status
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

/**
 * Notify all clients
 */
async function notifyClients(type, data) {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({ type, ...data });
  });
}

/**
 * Message handling
 */
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_CLEANUP':
      event.waitUntil(performCacheCleanup());
      break;
      
    case 'GET_VERSION':
      event.ports[0]?.postMessage({ version: CACHE_VERSION });
      break;
  }
});

/**
 * Perform cache cleanup
 */
async function performCacheCleanup() {
  try {
    console.log('🧹 Starting cache cleanup...');
    
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    const now = Date.now();
    
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const dateHeader = response.headers.get('date');
          if (dateHeader) {
            const responseDate = new Date(dateHeader).getTime();
            if (now - responseDate > maxAge) {
              await cache.delete(request);
              console.log(`🗑️ Deleted old entry: ${request.url}`);
            }
          }
        }
      }
    }
    
    console.log('✅ Cache cleanup completed');
  } catch (error) {
    console.error('❌ Cache cleanup failed:', error);
  }
}

/**
 * Background sync
 */
self.addEventListener('sync', (event) => {
  console.log(`🔄 Background sync: ${event.tag}`);
  
  if (event.tag === 'cache-update') {
    event.waitUntil(
      Promise.all([
        cacheStaticAssets(),
        cacheImages()
      ])
    );
  }
});

/**
 * Error handling
 */
self.addEventListener('error', (event) => {
  console.error('❌ SW Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ SW Unhandled rejection:', event.reason);
  event.preventDefault();
});

// Initialization log
console.log('🚀 Minimalist ClearCutParenting Service Worker v3.0.0');
console.log(`📦 Cache version: ${CACHE_VERSION}`);
console.log(`✨ Optimized for minimalist design`);
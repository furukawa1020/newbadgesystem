// Service Worker for Hakusan League Gym Badge Rally PWA
// Version 1.0.0

const CACHE_NAME = 'hakusan-league-v1.0.0';
const STATIC_CACHE_NAME = 'hakusan-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'hakusan-dynamic-v1.0.0';

// キャッシュするファイル一覧
const STATIC_FILES = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/incentive-system.css',
  '/incentive-system.js',
  '/marketing-effects.js',
  '/rpg-map.css',
  '/rpg-map.js',
  '/manifest.json',
  '/白山.png',
  // タウンファイル
  '/town/tsurugi.html',
  '/town/mikawa.html',
  '/town/mattou.html',
  '/town/kawachi.html',
  '/town/shiramine.html',
  '/town/yoshinodani.html',
  '/town/torigoe.html',
  '/town/oguchi.html',
  '/town/town-script.js',
  '/town/town-styles.css'
];

// オフライン用のフォールバックページ
const OFFLINE_PAGE = '/offline.html';

// インストール時の処理
self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  
  event.waitUntil(
    Promise.all([
      // 静的ファイルをキャッシュ
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('SW: Caching static files');
        return cache.addAll(STATIC_FILES.map(url => {
          // URLの正規化
          return new Request(url, { cache: 'reload' });
        })).catch((error) => {
          console.warn('SW: Failed to cache some static files:', error);
          // 一部のファイルがキャッシュできなくても続行
          return Promise.resolve();
        });
      }),
      // オフラインページを作成・キャッシュ
      createOfflinePage()
    ]).then(() => {
      console.log('SW: Installation complete');
      // 即座にアクティブ化
      return self.skipWaiting();
    }).catch((error) => {
      console.error('SW: Installation failed:', error);
    })
  );
});

// アクティベート時の処理
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    Promise.all([
      // 古いキャッシュを削除
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('hakusan-')) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // すべてのクライアントを制御下に
      self.clients.claim()
    ]).then(() => {
      console.log('SW: Activation complete');
    })
  );
});

// フェッチイベントの処理
self.addEventListener('fetch', (event) => {
  // GETリクエストのみ処理
  if (event.request.method !== 'GET') {
    return;
  }

  // chrome-extension:// などの特殊URLは無視
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    handleFetch(event.request).catch((error) => {
      console.error('SW: Fetch failed:', error);
      return new Response('ネットワークエラーが発生しました', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain; charset=utf-8'
        })
      });
    })
  );
});

// フェッチ処理のメイン関数
async function handleFetch(request) {
  const url = new URL(request.url);
  
  // 静的ファイルの場合：キャッシュファースト
  if (isStaticFile(url.pathname)) {
    return handleStaticFile(request);
  }
  
  // APIや動的コンテンツの場合：ネットワークファースト
  if (isDynamicContent(url.pathname)) {
    return handleDynamicContent(request);
  }
  
  // その他：キャッシュファースト（フォールバック付き）
  return handleDefault(request);
}

// 静的ファイルかどうかの判定
function isStaticFile(pathname) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2'];
  return staticExtensions.some(ext => pathname.endsWith(ext)) || 
         STATIC_FILES.includes(pathname) ||
         pathname === '/' ||
         pathname.startsWith('/town/');
}

// 動的コンテンツかどうかの判定
function isDynamicContent(pathname) {
  return pathname.includes('/api/') || 
         pathname.includes('?badge=') ||
         pathname.includes('/share');
}

// 静的ファイルの処理（キャッシュファースト）
async function handleStaticFile(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('SW: Serving from cache:', request.url);
      return cachedResponse;
    }
    
    console.log('SW: Fetching static file:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Static file fallback for:', request.url);
    return getOfflineFallback(request);
  }
}

// 動的コンテンツの処理（ネットワークファースト）
async function handleDynamicContent(request) {
  try {
    console.log('SW: Fetching dynamic content:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Trying cache for dynamic content:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return getOfflineFallback(request);
  }
}

// デフォルトの処理（キャッシュファースト、フォールバック付き）
async function handleDefault(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('SW: Serving default from cache:', request.url);
      return cachedResponse;
    }
    
    console.log('SW: Fetching default:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return getOfflineFallback(request);
  }
}

// オフライン用フォールバック
async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // HTMLページの場合はオフラインページを返す
  if (request.destination === 'document' || 
      request.headers.get('Accept')?.includes('text/html')) {
    const offlineResponse = await caches.match(OFFLINE_PAGE);
    if (offlineResponse) {
      return offlineResponse;
    }
  }
  
  // 画像の場合はプレースホルダー画像を返す
  if (request.destination === 'image') {
    return new Response(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#f0f0f0"/>
        <text x="100" y="100" text-anchor="middle" dy=".3em" fill="#666">
          画像を読み込めません
        </text>
      </svg>
    `, {
      headers: new Headers({
        'Content-Type': 'image/svg+xml'
      })
    });
  }
  
  // その他の場合は基本的なエラーレスポンス
  return new Response('オフラインです', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: new Headers({
      'Content-Type': 'text/plain; charset=utf-8'
    })
  });
}

// オフラインページの作成
async function createOfflinePage() {
  const offlineContent = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>オフライン - ハクサンリーグ</title>
        <style>
            body {
                font-family: 'Hiragino Sans', 'Yu Gothic', sans-serif;
                background: linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #FFB6C1 100%);
                margin: 0;
                padding: 2rem;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
            .offline-container {
                background: rgba(255, 255, 255, 0.95);
                padding: 3rem;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                max-width: 500px;
                width: 100%;
            }
            .offline-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            h1 {
                color: #2c3e50;
                margin-bottom: 1rem;
                font-size: 2rem;
            }
            p {
                color: #7f8c8d;
                line-height: 1.6;
                margin-bottom: 2rem;
            }
            .retry-btn {
                background: #4682B4;
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 10px;
                cursor: pointer;
                font-size: 1.1rem;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            .retry-btn:hover {
                background: #5F9EA0;
                transform: translateY(-2px);
            }
            .cached-data {
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid #eee;
            }
            .cached-data h3 {
                color: #2c3e50;
                margin-bottom: 1rem;
            }
            .badge-count {
                background: #32CD32;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                display: inline-block;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="offline-container">
            <div class="offline-icon">🏔️</div>
            <h1>オフラインモード</h1>
            <p>
                インターネット接続が利用できません。<br>
                キャッシュされたデータを使用して、一部の機能をご利用いただけます。
            </p>
            <button class="retry-btn" onclick="window.location.reload()">
                🔄 再試行
            </button>
            
            <div class="cached-data">
                <h3>📱 利用可能な機能</h3>
                <p>
                    • 獲得済みバッジの確認<br>
                    • ジムマップの表示<br>
                    • 基本情報の閲覧
                </p>
                <div class="badge-count" id="offlineBadgeCount">
                    バッジ: 0/8
                </div>
            </div>
        </div>
        
        <script>
            // オフライン時でもローカルストレージから情報を取得
            try {
                const badges = JSON.parse(localStorage.getItem('hakusan_badges') || '[]');
                document.getElementById('offlineBadgeCount').textContent = 'バッジ: ' + badges.length + '/8';
            } catch (e) {
                console.log('Failed to load badge data');
            }
        </script>
    </body>
    </html>
  `;
  
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    await cache.put(OFFLINE_PAGE, new Response(offlineContent, {
      headers: new Headers({
        'Content-Type': 'text/html; charset=utf-8'
      })
    }));
    console.log('SW: Offline page created');
  } catch (error) {
    console.error('SW: Failed to create offline page:', error);
  }
}

// メッセージハンドリング
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// 背景同期（将来的な機能）
self.addEventListener('sync', (event) => {
  if (event.tag === 'badge-sync') {
    event.waitUntil(syncBadgeData());
  }
});

// バッジデータの同期
async function syncBadgeData() {
  try {
    // 将来的にサーバーとの同期機能を実装
    console.log('SW: Badge data sync requested');
  } catch (error) {
    console.error('SW: Badge sync failed:', error);
  }
}

// プッシュ通知のハンドリング（将来的な機能）
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'ハクサンリーグからの通知です',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: [
        {
          action: 'open',
          title: '開く'
        },
        {
          action: 'close',
          title: '閉じる'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'ハクサンリーグ', options)
    );
  }
});

// 通知クリックのハンドリング
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('SW: Service Worker script loaded');

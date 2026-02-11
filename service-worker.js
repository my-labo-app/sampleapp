const CACHE_NAME = "my-calendar-cache-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./sample.css",
  "./sample.js",
  "./manifest.json"
];

/* インストール時 */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

/* リクエスト時（キャッシュ優先） */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

/* 古いキャッシュ削除 */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
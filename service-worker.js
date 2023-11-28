const cacheName = 'cache-2';

const precache = [
    'js/register-sw.js',
    'index.html',
    'offline.html',
    'css/style.css',
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(

        caches.open(cacheName).then(cache => {
        return cache.addAll(precache)
        })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [cacheName];
    event.waitUntil(
    caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
            }
            })
        )
        })
    );
});

function shouldAcceptResponse(response) {
    return response.status !== 0 && !(response.status >= 400 && response.status < 500) ||
        response.type === 'opaque' ||
        response.type === 'opaqueredirect';
}

self.addEventListener('fetch', event => {

    event.respondWith(
        caches.open(cacheName).then(cache => { 
        return cache.match(event.request).then(response => {

            if (response) {
            return response;
            }

        return fetch(event.request).then(
            function(response) {

            if(shouldAcceptResponse(response)) {
                return response;
            }

            var responseToCache = response.clone();

            caches.open(cacheName)
                .then(function(cache) {
                cache.put(event.request, responseToCache);
                });

            return response;
            }
        )
        }).catch(error => {
            console.log('Fallo SW', error); 
            return caches.match('offline.html');
        });
        })
    );
});
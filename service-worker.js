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
    // Si es una solicitud POST, simplemente realiza la solicitud a la red sin pasar por el caché
    if (event.request.method === 'POST') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    return response;
                })
                .catch(error => {
                    console.error('Error en fetch:', error);
                })
        );
    } else {
        // Para solicitudes GET, utiliza el caché según la lógica anterior
        event.respondWith(
            caches.open(cacheName).then(cache => {
                return cache.match(event.request).then(response => {
                    if (response) {
                        return response;
                    }

                    return fetch(event.request).then(
                        function(response) {
                            if (shouldAcceptResponse(response)) {
                                var responseToCache = response.clone();

                                caches.open(cacheName)
                                    .then(function(cache) {
                                        cache.put(event.request, responseToCache);
                                    });

                                return response;
                            } else {
                                return response;
                            }
                        }
                    );
                }).catch(error => {
                    console.log('Fallo SW', error); 
                    return caches.match('offline.html');
                });
            })
        );
    }
});
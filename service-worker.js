const cacheName = 'cache-2';//nombre delacache

//recursos a almacenar en cache
const precache = [
    'js/register-sw.js',
    'index.html',
    'offline.html',
    'css/style.css',
];

//evento de instalacion del SW
self.addEventListener('install', event => {
    self.skipWaiting();//SW pasa al estado activo inmediatamente
    
    //espera a la cache q este abierta y agrega los recursos a cachear
    event.waitUntil(
        caches.open(cacheName).then(cache => {
        return cache.addAll(precache)
        })
    );
});

//activacion SW
self.addEventListener('activate', event => {
    const cacheWhitelist = [cacheName];
    
    //todas las caches no deseadas sean eliminadas
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

// para determinar si se debe aceptar una respuesta
function shouldAcceptResponse(response) {
    return response.status !== 0 && !(response.status >= 400 && response.status < 500) ||
        response.type === 'opaque' ||
        response.type === 'opaqueredirect';
}

//evento interceptacion de solicitudes fecht
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
        //paara solicitudes GET, utiliza el caché según la lógica anterior
        event.respondWith(
            caches.open(cacheName).then(cache => {
                return cache.match(event.request).then(response => {
                    if (response) {
                        return response;//si el recurso esta en cache, devuelve desde la cache
                    }

                    //si no esta en cache, realiza la solicitud a la red
                    return fetch(event.request).then(
                        function(response) {

                            //almacena la respuesta en cache si es valida
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
                }).catch(error => {//si hay un error en la solicitud de red, devuelve una pag sin conexion 
                    console.log('Fallo SW', error); 
                    return caches.match('offline.html');
                });
            })
        );
    }
});
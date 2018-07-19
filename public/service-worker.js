const version = '0.2.0';
const staticCacheName = `demo-static-v${version}`;
const responseCache = `demo-response-v${version}`;

addEventListener('install', installEvent => {
    installEvent.waitUntil(
        caches.open(staticCacheName)
            // Cache static assets
            .then(staticCache => {
                return staticCache.addAll([
                    '/',
                    '/style.css',
                    '/index.js'
                ]);
            })
    );
});

addEventListener('fetch', fetchEvent => {
    const request = fetchEvent.request;

    if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
        return;
    }

    if (request.url.includes('api/messages') && request.method == 'GET') {
        return fetchEvent.respondWith(
            fetch(request).then(responseFromFetch => {
                const copy = responseFromFetch.clone();

                return caches.open(responseCache).then(cache => {
                    cache.put(request, copy);
                    return responseFromFetch;
                });
            }).catch( error => {
                return caches.match(request).then(responseFromCache => {
                    if (responseFromCache) { 
                        return responseFromCache;
                    }

                    return new Response(
                        `[{ "message": "something went wrong", "id": "1337"}]`,
                        { headers: { 'Content-Type': 'application/json'}}
                    );
            })
        })
    )}

    fetchEvent.respondWith(
        caches.match(request).then(
            responseFromCache => {
                if (responseFromCache) {
                    return responseFromCache;
                }

                return fetch(request);
            }
        ).catch(error => console.log(error))
    );
});

addEventListener('activate', activateEvent => {
    activateEvent.waitUntil(
        caches.keys().then(cacheNames=> {
            return Promise.all(cacheNames.map(cacheName => {
                console.log(cacheName);
                if (cacheName != staticCacheName && cacheName != responseCache) {
                    return caches.delete(cacheName);
                }
            }))
        })
    )
});

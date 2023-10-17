console.log("Hola mundo de las PWA");
console.log("You can do it");

//Archivos de propios de nuestra app pwa
const STATIC = 'staticv2'
const INMUTABLE = 'inmutablev1'
const DYNAMIC = 'dynamicv1'
//const OFFLINE_PAGE_URL = 'pages/offline.html';

const APP_SHELL = [
    '/',
    '/index.html',
    'js/app.js',
    'img/images.jpg',
    'css/styles.css',
    'pages/offline.html',
];

const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
];

self.addEventListener('install', (e) => {
    console.log('Instalando');
    const staticCache = caches.open(STATIC).then((cache) => {
        cache.addAll(APP_SHELL);
    });
    const inmutableCache = caches.open(INMUTABLE).then((cache) => {
        cache.addAll(APP_SHELL_INMUTABLE)
    });
    e.waitUntil(Promise.all([staticCache, inmutableCache]));
    //e.skipWaiting();
});

self.addEventListener('activate', (e) => {
    console.log('Activado');
});

// self.addEventListener('fetch', (e) => {
//     console.log(e.request);

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                return response;
            })
            .catch(() => {
                return caches.match('pages/offline.html');
            })
    );
});

    //1. Caché Only

    // if(e.request.url.includes('images.jpg')) {
    //     e.respondWith(fetch('img/burro.png'))
    // } else {
    //     e.respondWith(fetch(e.request));
    // } 
    // e.respondWith(caches.match(e.request));
    //-----------------------------------------------------

    // //3. Network with cache fallback
    // const source = fecth(e.request)
    // .then( res => {
    //     if(!res) throw Error("Not Found");
    //     caches.open(DYNAMIC).then(cache => {
    //         cache.put(e.request, res);
    //     });
    //     return res.clone();
    // })
    // .catch((err) => {
    //     return caches.match(e.request);
    // });
    // e.respodWith(source);
    //-------------------------------------------------------

    //2. Cache with network falllback
    // const source = caches.match(e.request)
    // .then(res => {
    //     if(res) return(res);
    //     return fetch(e.request).then(resFetch => {
    //         caches.open(DYNAMIC).then(cache => {
    //             cache.put(e.request, resFetch);
    //         });
    //         return resFetch.clone();
    //     });
    // });
    // e.respondWith(source);
    //-------------------------------------------------------

    //4. Caché with Network Update
    // Primero todo lo devuelve del caché, después actualiza el recurso.
    // Se recomienda usar cuando el el rendimiento del PC es crítico
    // const source = caches.open(STATIC).then(cache => {
    //     fetch(e.request).then((resFetch) => {
    //         cache.put(e.request, resFetch);
    //     })
    //     return caches.match(e.request);
    // });
    // e.respondWith(source);
    //--------------------------------------------------------

    //5. Caché and Network race
    const source = new Promise((resolve, reject) => {
        let flag = false;
        const failsOnce = () =>{
            if (flag) {
                // Si ya falló una vez aquí poner la lógica para controlarlo
                if (/\.(png|jpg)/i.test(e.request.url)) {
                    resolve(caches.match('/img/not-fount.png'))
                }else {
                    reject('SourceNotFound');
                }
    // if(e.request.url.includes('page2.hmtl')){
    //     resolve (caches.match('/pages/offline.html')),

    // }else{

    // }
            }else{
                flag = true; 
            }
        };

        fetch(e.request).then(resFetch=>{
            resFetch.ok ? resolve(resFetch): failsOnce();
        }).catch(failsOnce);

        caches.match(e.request).then(sourceCache => {
            sourceCache.ok ? resolve(sourceCache) : failsOnce();
        }).catch(failsOnce);
    });
    e.respondWith(source);


//});
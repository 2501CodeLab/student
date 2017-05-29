var CACHE_NAME = 'lt_student_v1';
var urlsToCache = ['./', './index.html', './news.html', './calendar.html', './agenda.html', './grades.html', './profile.html', './privacy.html', './about.html', './assets/css/custom.css', './assets/js/core.js', './assets/js/index.js', './assets/js/news.js', './assets/js/calendar.js', './assets/js/agenda.js', './assets/js/profile.js', './assets/js/grades.js', './assets/media/main_logo.svg', './assets/media/main_logo_dark.svg', './assets/media/zyplos_logo.svg', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js', 'https://bootswatch.com/paper/bootstrap.min.css', 'https://ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css', './dev.html', './manifest.json', "./assets/media/default_background.png", "./assets/js/fullcalendar.js", "./assets/css/fullcalendar.css", "./assets/js/moment.js"];
//
self.addEventListener('install', function(event) {
    event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
        console.log("%c>> CACHE OPENED", "color: #39b54a;");
        return cache.addAll(urlsToCache);
    }));
});
//
self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
        if (response) {
            return response;
        }
        return fetch(event.request);
    }));
});
//
//self.addEventListener('activate', function(event) {
//    console.log("%c>> ACTIVATED", "color: #39b54a;");
//    var cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1'];
//    event.waitUntil(caches.keys().then(function(cacheNames) {
//        return Promise.all(cacheNames.map(function(cacheName) {
//            if (cacheWhitelist.indexOf(cacheName) === -1) {
//                return caches.delete(cacheName);
//            }
//        }));
//    }));
//});

//from 
//https://developers.google.com/web/fundamentals/primers/service-workers/
//https://developers.google.com/web/ilt/pwa/lab-caching-files-with-service-worker

let filesToCache = "my-site-cache-v1";
let urlsToCache = [
  "./",
  "index.html",  
  "restaurant.html",
  "css/styles.css",  
  "img/1.jpg",
  "img/2.jpg",
  "img/3.jpg",
  "img/4.jpg",
  "img/5.jpg",
  "img/6.jpg",
  "img/7.jpg",
  "img/8.jpg",
  "img/9.jpg",
  "img/10.jpg",
  "data/restaurants.json",
  "js/dbhelper.js",
  "js/main.js",
  "js/restaurant_info.js"
];

self.addEventListener("install", function(event) {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches
      .open(filesToCache)
      .then(function(cache) { cache.addAll(urlsToCache)}
       
  ));
});

self.addEventListener("activate", function(event) {
  console.log('Activating new service worker...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {Promise.all(cacheNames.map(function(cache) {
      if (cache !== filesToCache) {
        console.log("SW: now is removing cached files from ", cache);
        return caches.delete(cache);
      }
    }))})
  )
})

self.addEventListener("fetch", function(event) {
  console.log('Fetch event for ', event.request.url);
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
           console.log("SW: found in cache ", event.request.url);
          return response;
        }
        return fetch(event.request);
      })
    );
  }
});

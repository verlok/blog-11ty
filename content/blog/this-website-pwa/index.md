---
title: Making my blog a Progressive Web Application
description: Some of my workmates and I took part to a Google Hackathon about Progressive Web Application and we learned a lot, so I've decided to enable this website as a PWA. Here's what I did.
date: 2019-06-10
tags:
  - techniques
---

Some of my workmates and I took part to a Google Hackathon about Progressive Web Application and we learned a lot, so I've decided to enable this website as a PWA. Here's what I did...

To make an app installable, you need to add a manifest to your website. Here's the manifest for this website.

```json
{
    "name": "Andrea Verlicchi’s Blog",
    "short_name": "AV's Blog",
    "icons": [
        {
            "src": "/android-chrome-192x192.png?v=wAXeG66EQW",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/android-chrome-512x512.png?v=wAXeG66EQW",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "theme_color": "#D90009",
    "background_color": "#977f34",
    "display": "standalone",
    "start_url": "/"
}
```

If you want to enable your website as a PWA, I reccommend you to start with reading the [Workbox Getting Started](https://developers.google.com/web/tools/workbox/guides/get-started) guide.

## Service Worker file

I'm using [Workbox](https://developers.google.com/web/tools/workbox/) to enable Service Workers and manage cache strategies etc.

```js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

/*
 * ROUTING RULES
 */

// Caching every JS file with the Stale While Revalidate strategy
workbox.routing.registerRoute(
  /\.js$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "js-cache",
  })
);

// Caching every CSS file with the Stale While Revalidate strategy
workbox.routing.registerRoute(
  /\.css$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'css-cache',
  })
);

// Caching every Image file with the Cache First strategy
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
);

// Caching every post's HTML with the Network First strategy
workbox.routing.registerRoute(
  /\/[^\/]+\/$/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'posts-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20
      })
    ],
  })
);
```

I've temporarily disabled precaching of other pages because I found out that those information are then added to the routing strategy with the Cache First strategy, whichs is not good in order to make your website always retrieve fresh information.

```js
/*
 * PRECACHING
 */

// TURNED OFF BECAUSE THESE RESOURCES WOULD BE CACHE-FIRST ONLY!
/*workbox.precaching.precacheAndRoute([
  { url: '/', revision: '20190607' },
  { url: '/about/', revision: '20190607' },
  { url: '/contact/', revision: '20190607' }
]);*/
```

But I'm currently investigating and understanding how to manage this.

## Results

The result is that this website is now:

1. Installable
2. Accessible offline
3. Modern :)

If you have any hints or comments, please [reach out](/contact/) and let me know!

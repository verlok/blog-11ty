---
title: "Trasformare il mio blog in una Progressive Web Application"
description: "Alcuni colleghi ed io abbiamo partecipato a un Hackathon di Google sulle Progressive Web Application e abbiamo imparato molto, così ho deciso di abilitare questo sito web come PWA. Ecco cosa ho fatto."
tags:
  - techniques
layout: layouts/post.njk
---

Alcuni colleghi ed io abbiamo partecipato a un Hackathon di Google sulle Progressive Web Application e abbiamo imparato molto, così ho deciso di abilitare questo sito web come PWA. Ecco cosa ho fatto...

Per rendere un'app installabile, è necessario aggiungere un manifest al sito web. Ecco il manifest di questo sito.

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

Se vuoi abilitare il tuo sito web come PWA, ti consiglio di iniziare leggendo la guida [Workbox Getting Started](https://developers.google.com/web/tools/workbox/guides/get-started).

## Il file del Service Worker

Utilizzo [Workbox](https://developers.google.com/web/tools/workbox/) per abilitare i Service Worker e gestire le strategie di cache, ecc.

```js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

/*
 * REGOLE DI ROUTING
 */

// Caching di tutti i file JS con la strategia Stale While Revalidate
workbox.routing.registerRoute(
  /\.js$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "js-cache",
  })
);

// Caching di tutti i file CSS con la strategia Stale While Revalidate
workbox.routing.registerRoute(
  /\.css$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'css-cache',
  })
);

// Caching di tutti i file immagine con la strategia Cache First
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

// Caching dell'HTML di tutti i post con la strategia Network First
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

Ho temporaneamente disabilitato il precaching delle altre pagine perché ho scoperto che queste informazioni vengono poi aggiunte alla strategia di routing con la strategia Cache First, il che non è ideale per fare in modo che il sito recuperi sempre informazioni aggiornate.

```js
/*
 * PRECACHING
 */

// DISATTIVATO PERCHÉ QUESTE RISORSE SAREBBERO SOLO CACHE-FIRST!
/*workbox.precaching.precacheAndRoute([
  { url: '/', revision: '20190607' },
  { url: '/about/', revision: '20190607' },
  { url: '/contact/', revision: '20190607' }
]);*/
```

Ma sto studiando e approfondendo come gestire questa cosa.

## Risultati

Il risultato è che questo sito web ora è:

1. Installabile
2. Accessibile offline
3. Moderno :)

Se hai suggerimenti o commenti, per favore [contattami](/contact/) e fammi sapere!

---
title: "Abbiamo ancora bisogno delle librerie di lazy loading e di `data-src`?"
description: "In passato, quando il supporto dei browser per il lazy loading nativo non era diffuso, la best practice consisteva nell'usare gli attributi `data-src` e una libreria JavaScript come vanilla-lazyload per caricare le immagini man mano che entravano nella viewport. Questa è ancora la best practice oggi?"
tags:
  - considerations
  - lazy loading
  - hybrid lazy loading
  - native lazy loading
---

In passato, quando il supporto dei browser per il [lazy loading nativo](https://web.dev/browser-level-image-lazy-loading/) non era diffuso, la best practice consisteva nell'usare gli attributi `data-src` e una libreria JavaScript come la mia [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) per caricare le immagini man mano che entravano nella viewport. Questa è ancora la best practice oggi?

{% image "do-we-still-need-lazyload-2022.webp", "Abbiamo ancora bisogno delle librerie di lazy loading e di data-src nel 2022", [648, 1296], "648px" %}

## Cos'è il lazy loading?

**Il lazy loading delle immagini** è una tecnica per **rimandare il caricamento delle immagini _below-the-fold_** (sotto la piega) fino a quando non stanno per entrare nella viewport (la parte visibile della pagina). Questa tecnica fa risparmiare larghezza di banda, riduce i costi del CDN, abbassa l'impronta di carbonio del sito web e migliora il tempo di rendering della pagina, in particolare il [Largest Contentful Paint](https://web.dev/lcp/).

## Lazy loading delle immagini gestito da JavaScript

Tradizionalmente, il lazy loading delle immagini comportava la sostituzione dell'attributo `src` con un attributo `data-src` e l'uso di JavaScript per rilevare quando le immagini si avvicinavano alla viewport, per poi copiare gli attributi `data` in quelli corretti, avviando così il loro caricamento differito.

```html
<img
  data-src="turtle.jpg"
  alt="Lazy turtle"
  class="lazy"
/>
```

## Lazy loading nativo

Con il lazy loading nativo, <abbr title="anche noto come">detto anche</abbr> [lazy loading a livello di browser](https://web.dev/browser-level-image-lazy-loading/), basta aggiungere l'attributo `loading="lazy"` al tag `<img>`.

```html
<img
  src="turtle.jpg"
  alt="Lazy turtle"
  loading="lazy"
/>
```

Questo funziona su [tutti i browser moderni](https://caniuse.com/loading-lazy-attr).

## Abbiamo ancora bisogno del lazy loading gestito da JavaScript?

No, a meno che non si desideri un maggiore controllo sul processo di lazy loading.

Vediamo quali sono i casi in cui ha senso usare il lazy loading guidato da JavaScript invece di affidarsi solo a `loading="lazy"`.

### 1. Supportare gli utenti con connessioni lente o instabili

Le librerie JavaScript come [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) possono annullare il download delle immagini che escono dalla viewport e riprovare i download se interrotti, migliorando l'esperienza utente sulle connessioni lente.

Un caso d'uso tipico è:

- pagine con molte immagini +
- utenti con connessioni lente +
- scorrimento veloce verso il basso

Il lazy loading nativo fa sì che i browser scarichino le immagini in lazy loading dall'alto verso il basso, con conseguente ritardo nel mostrare le immagini in fondo.

Le librerie Javascript come [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) annulleranno il download delle immagini che escono dalla viewport, mantenendo la larghezza di banda dell'utente concentrata sulle immagini attualmente visibili.

Un altro caso d'uso è:

- download delle immagini in corso
- connessione di rete interrotta

[vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) riproverà a scaricare quelle immagini una volta ripristinata la connessione.

Puoi provare queste funzionalità in una qualsiasi delle [demo di vanilla-lazyload](https://verlok.github.io/vanilla-lazyload/#-demos), come la [demo del caso base](https://verlok.github.io/vanilla-lazyload/demos/image_basic.html), limitando o disattivando la velocità di connessione nei developer tools del tuo browser.

### 2. Callback avanzate o classi CSS

Il lazy loading gestito da JavaScript fornisce callback e classi CSS per vari eventi (inizio caricamento, fine caricamento, errore, ingresso nella viewport, uscita dalla viewport, ecc.), consentendo di monitorare il processo e creare effetti visivi avanzati.

Queste callback e classi CSS possono essere molto utili per creare effetti visivi sulla pagina.

Scopri di più su callback e classi nelle [API di vanilla-lazyload](https://verlok.github.io/vanilla-lazyload/#-api) / [opzioni](https://verlok.github.io/vanilla-lazyload/#options).

### 3. Ottimizzare le performance web, nello specifico il Largest Contentful Paint

Il lazy loading guidato da JavaScript offre un maggiore controllo su quali immagini vengono scaricate, aiutando a ottimizzare il Largest Contentful Paint (LCP).

Con il lazy loading nativo, non hai il controllo su quali immagini vengono scaricate dal browser.

Il caso d'uso:

- alcune immagini sono sotto la piega ma non molto lontane
- alcune immagini compaiono appena nella parte visibile della pagina

Il lazy loading nativo inizierebbe a scaricare queste immagini, che condividerebbero la larghezza di banda con il download dell'immagine LCP, mentre vorresti scaricare quest'ultima con la massima priorità.

Il lazy loading gestito da JavaScript come vanilla-lazyload fornisce [API](https://verlok.github.io/vanilla-lazyload/#-api) e [opzioni](https://verlok.github.io/vanilla-lazyload/#options) per controllare con precisione quanto debbano essere distanti dalla viewport le immagini prima di iniziare a scaricarle.

### 4. Lazy loading di altre risorse

Per effettuare il lazy loading di immagini di sfondo, video, SVG animati e altro, è ancora necessaria una libreria JavaScript come [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload).

## Scopri di più

Consulta la [documentazione di vanilla-lazyload](https://verlok.github.io/vanilla-lazyload/) o il mio post sul blog [lazy load delle immagini responsive nel 2020](/blog/lazy-load-responsive-images-in-2020-srcset-sizes-picture-webp/).

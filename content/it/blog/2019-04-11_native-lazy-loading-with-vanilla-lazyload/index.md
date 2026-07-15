---
title: "Lazy loading nativo e fallback js con vanilla-lazyload 12"
description: "Il 6 aprile 2019, Addy Osmani ha scritto del lazy loading nativo delle immagini. Due giorni dopo Yvain, uno sviluppatore front-end di Parigi, mi ha chiesto se il mio vanilla-lazyload potesse essere usato come polyfill per l'attributo loading, ispirandomi a sviluppare e rilasciare la versione 12 del mio script, che introduce la nuova opzione use_native per abilitare il lazy loading nativo dove supportato. Puoi già provarlo oggi stesso."
tags:
  - lazy loading
  - images
  - libraries
  - techniques
layout: layouts/post.njk
---

Il 6 aprile 2019, Addy Osmani ha scritto sul [lazy-loading nativo delle immagini](https://addyosmani.com/blog/lazy-loading/). Due giorni dopo Yvain, uno sviluppatore front-end di Parigi, [mi ha chiesto](https://github.com/verlok/vanilla-lazyload/issues/331) se il mio [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload/) potesse fungere da **polyfill per l'attributo loading**, ispirandomi a sviluppare e rilasciare la versione 12 dello script, che introduce la nuova opzione `use_native` per abilitare il lazy-loading nativo dove supportato. Puoi già usarlo oggi stesso.

{% image "lazyload-use_native.png", "Usa caricamento nativo in vanilla lazyload", [648, 1296], "648px" %}

## Aspetta... cosa?

Nel caso ti fossi perso l'articolo di Addy Osmani, sarà possibile caricare le immagini e gli iframe in modalità lazy _nativamente_ tramite l'attributo `loading="lazy"`, ed è già possibile farlo su Chrome 75 (attualmente Canary).

```html
<img loading="lazy" src="..." />
<iframe
  loading="lazy"
  src="..."
></iframe>
```

I browser scaricheranno inizialmente una piccolissima parte delle immagini (~2kb) per ottenere alcune informazioni iniziali (ad es. le dimensioni), per poi scaricare il resto quando stanno _per entrare nel viewport_.

Il problema è che se assegni direttamente il `src` (e/o `srcset`) alle immagini, i browser che non supportano ancora il lazy loading nativo le scaricheranno tutte immediatamente, e questo è qualcosa che potresti voler evitare per risparmiare larghezza di banda e velocizzare il tuo sito o applicazione web.

Per questo motivo, ho aggiunto l'opzione `use_native` nella versione 12 di _vanilla-lazyload_, che abilita il lazy-loading nativo dove supportato.

Maggiori informazioni sul lazy loading nativo possono essere trovate nel post di Addy Osmani [native image lazy-loading](https://addyosmani.com/blog/lazy-loading/).

## Il browser necessario

A partire dal 10 aprile 2019, il lazy loading nativo è nelle prime fasi (developer preview) ed è disponibile solo in Chrome 75 (attualmente Canary), e dietro un flag. Quindi per testarlo, devi:

1. [Scarica Chrome Canary](https://www.google.com/chrome/canary/) e installalo
2. In Chrome Canary, vai all'URL _chrome://flags_ e abilita i seguenti flag:
   - _Enable lazy image loading_
   - _Enable lazy iframe loading_
3. Riavvia Chrome Canary

## Demo

Ora che hai il browser Chrome Canary con il lazy loading nativo abilitato, puoi iniziare visitando la seguente pagina demo.

&rarr; [Apri la demo](https://verlok.github.io/vanilla-lazyload/demos/native_lazyload_conditional.html) _e/o_ [Controlla il codice](https://github.com/verlok/vanilla-lazyload/blob/master/demos/native_lazyload_conditional.html)

Se hai fatto tutto correttamente, ecco cosa succederà:

- Su Chrome 75 (Canary), LazyLoad attiverà il **lazy-loading nativo**
- Su altri browser e versioni precedenti di Chrome, verrà eseguito il **lazy loading basato su JavaScript**

## Provalo sul tuo sito!

Per provarlo tu stesso, devi seguire questi passaggi.

### Markup

Per assicurarti che i tuoi utenti vedano le tue immagini il prima possibile, ti consiglio di caricare immediatamente le immagini in cima alla tua pagina web, solo quelle che sai che saranno posizionate _above-the-fold_ nei viewport più comuni, considerando smartphone, tablet e computer.

Per farlo, le prime immagini nella pagina dovrebbero essere caricate usando normali tag `<img>`. Puoi usare l'attributo `loading="eager"` per assicurarti che vengano caricate il prima possibile.

```html
<img
  src="eager-eagle.jpg"
  loading="eager"
  alt="Eager Eagle"
/>
```

Tutte le altre immagini _below-the-fold_ dovrebbero invece essere caricate usando gli attributi `data-src`, `data-srcset` e `data-sizes` al posto di `src`, `srcset` e `sizes`, per evitare un caricamento immediato (eager) nei browser che non supportano `loading="lazy"`.

```html
<img
  data-src="lazy-sloth.jpg"
  class="lazy"
  alt="Lazy Sloth"
/>
```

**Link:** per una guida completa su come caricare in modo lazy le immagini responsive, leggi [maggiori informazioni sul lazy loading delle immagini responsive](./lazy-load-responsive-images-in-2019-srcset-sizes-more).

### E ora passiamo al codice Javascript!

Avrai bisogno della versione 12 di vanilla-lazyload.
<br>Puoi includerla tramite CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@12.0.0/dist/lazyload.min.js"></script>
```

Oppure installarla tramite npm:

```
npm install vanilla-lazyload@12.0.0
```

Nel tuo codice, imposta l'opzione `use_native` a `true` quando istanzi LazyLoad:

```js
new LazyLoad({
  elements_selector: `.lazy`,
  use_native: true // Questo qui
});
```

Il flag `use_native: true` imposta questi comportamenti contestuali:

- dove il lazy loading nativo è supportato, LazyLoad aggiunge l'attributo `loading="lazy"` alle immagini, quindi si limita a sostituire gli attributi `data-*` con quelli corretti. A questo punto il browser gestirà il lazy loading da solo.
- dove il lazy loading nativo NON è supportato, il lazy loading continuerà a essere gestito da JavaScript, sfruttando l'API IntersectionObserver del browser.

## Per concludere

Caricare i contenuti in modalità lazy è molto importante per **migliorare la velocità di caricamento di un sito web**; i produttori di browser stanno finalmente iniziando a implementarlo nativamente e non vedo l'ora che sia disponibile su Edge, Safari e Firefox.

Fino ad allora, puoi avere **sia il lazy loading nativo che quello basato su JavaScript** usando [vanilla-lazyload 12](https://github.com/verlok/vanilla-lazyload), semplicemente impostando l'opzione `use_native` a `true`.

Provalo!

Se ti piace, [metti una stella ⭐ alla repository](https://github.com/verlok/vanilla-lazyload). Se trovi qualcosa che non va, [apri una segnalazione (issue)](https://github.com/verlok/vanilla-lazyload/issues) in modo che io possa provare a risolverlo. Per qualsiasi domanda, [contattami su Twitter](https://twitter.com/verlok).

Un saluto!

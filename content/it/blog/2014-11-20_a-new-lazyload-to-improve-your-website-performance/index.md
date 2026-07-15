---
title: "Un nuovo LazyLoad per migliorare le prestazioni del tuo sito web"
description: "Negli ultimi giorni ho lavorato all'ottimizzazione delle prestazioni dei siti web e mi sono reso conto che non c'è modo di sfruttare il formato immagine JPEG progressivo sui siti web se si utilizza jQuery_lazyload di Mika Tuupola, così ho deciso di scrivere il mio lazy load personale, che si è rivelato migliore per molteplici motivi."
tags:
  - lazyload
  - web performance
  - open source
---

Negli ultimi giorni ho lavorato all'ottimizzazione delle prestazioni dei siti web e mi sono reso conto che non c'è modo di sfruttare il formato di immagine **JPEG progressivo** sui siti web se si utilizza [jQuery_lazyload](https://github.com/tuupola/jquery_lazyload "Mika Tuupola"). Quindi, dopo aver inviato una pull request al suo autore, ho deciso di scrivere il mio lazy load personale, che si è rivelato migliore perché:

* è 6 volte più veloce
* consente di [caricare in modalità lazy le immagini responsive](./lazy-load-responsive-images-srcset)
* non dipende da jQuery
* supporta al meglio il formato JPEG progressivo

Maggiori informazioni sul [repository GitHub](https://github.com/verlok/vanilla-lazyload).

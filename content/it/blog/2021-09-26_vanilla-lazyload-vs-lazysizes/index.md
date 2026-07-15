---
title: "vanilla-lazyload vs lazysizes"
description: "Come autore di vanilla-lazyload, non è la prima volta che mi viene posta questa domanda: quali sono le differenze tra vanilla-lazyload e lazysizes? Questo post è la risposta a tale domanda."
tags:
  - libraries
  - lazy loading
  - vanilla-lazyload
layout: layouts/post.njk
---

Come autore di vanilla-lazyload, non è la prima volta che mi viene posta questa domanda: <q>Quali sono le differenze tra vanilla-lazyload e lazysizes?</q> Questo post è la risposta a tale domanda.

{% image "vanilla-lazyload-vs-lazysizes.webp", "vanilla-lazyload vs lazysizes", [648, 1296], "648px" %}

## Cosa sono vanilla-lazyload e lazysizes?

[vanilla-lazyload](https://github.com/verlok/vanilla-lazyload/) e [lazysizes](https://github.com/afarkas/lazysizes/) sono due popolari librerie JavaScript per il [lazy-loading](https://web.dev/lazy-loading/) di immagini e altri elementi DOM, il che significa <strong>caricarli solo quando entrano nella porzione visibile della pagina web</strong> (il viewport del browser), o poco prima.

L'uso di una di esse è fondamentale per migliorare il <strong>tempo di rendering</strong> del tuo sito web, posticipando il caricamento di tutti i contenuti non critici a un momento successivo, al fine di ottenere migliori [Core Web Vitals](https://web.dev/cwv) e in particolare di ridurre il [Largest Contentful Paint](https://web.dev/lcp).

Quali sono quindi le <strong>differenze tra vanilla-lazyload e lazysizes</strong>? Di seguito viene riportato un confronto dettagliato tra le due librerie.

## Confronto tra vanilla-lazyload e lazysizes

Trovi le caratteristiche principali di vanilla-lazyload a confronto con quelle di lazysizes nella tabella seguente.

| Caratteristica | vanilla-lazyload | lazysizes       |
| ---------------------------------------------------------------------------------------- | ---------------- | --------------- |
| È leggera (fonte: [bundlephobia](https://bundlephobia.com/)) | ✔ (2.8 kB)       | ✔ (3.4 kB)      |
| È estendibile | ✔ (via API)      | ✔ (via plugin)  |
| È SEO friendly | ✔                | ✔               |
| Ottimizza le prestazioni annullando i download delle immagini già uscite dal viewport | ✔                |                 |
| Riprova il caricamento se la connessione di rete cade e poi si ripristina | ✔                |                 |
| Supporta l'uso condizionale del lazy loading nativo | ✔                |                 |
| Funziona con il tuo DOM, le tue classi e i tuoi attributi data-* | ✔                |                 |
| Può caricare in modalità lazy immagini responsive | ✔                | ✔               |
| ...e calcolare automaticamente il valore dell'attributo sizes |                  | ✔               |
| Può caricare in modalità lazy gli iframe | ✔                | ✔               |
| Può caricare in modalità lazy i video | ✔                |                 |
| Può caricare in modalità lazy immagini di sfondo | ✔                |                 |
| Può eseguire codice in modalità lazy quando determinati elementi entrano nel viewport | ✔                |                 |
| Può ripristinare il DOM allo stato originale | ✔                |                 |

## Spiegazione delle righe della tabella

### È estendibile

Sia vanilla-lazyload sia lazysizes sono estendibili, vedi le [API di vanilla-lazyload](https://www.github.com/verlok/vanilla-lazyload#-api) e i [plugin di lazysizes](https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins).

### È SEO friendly

Entrambi gli script **non nascondono le immagini o gli asset ai motori di ricerca**, indipendentemente dal pattern di markup utilizzato. I motori di ricerca non scorrono né interagiscono con il tuo sito. Questi script rilevano se lo user agent è in grado di scorrere la pagina e, in caso contrario, mostrano istantaneamente tutte le immagini.

### Ottimizza le prestazioni annullando i download delle immagini già uscite dal viewport

Se i tuoi utenti mobili hanno connessioni lente e scorrono velocemente, vanilla-lazyload annulla il download delle immagini ancora in fase di caricamento ma che sono già uscite dal viewport. Se per qualche motivo preferisci evitare questo comportamento, questa funzione può essere disattivata.

### Riprova il caricamento se la connessione di rete cade e poi si ripristina

Se i tuoi utenti da mobile hanno connessioni instabili e passano offline per poi tornare online, vanilla-lazyload riprova a scaricare le immagini che avevano generato un errore.

### Supporta l'uso condizionale del lazy-loading nativo

Se i tuoi utenti utilizzano un browser che supporta il lazy-loading nativo e desideri utilizzarlo, con vanilla-lazyload puoi attivarlo in modo condizionale impostando l'opzione `use_native` a `true`. Trovi qui [maggiori informazioni](https://github.com/verlok/vanilla-lazyload#mixed-native-and-js-based-lazy-loading) e la [demo del lazy-loading nativo condizionale](https://verlok.github.io/vanilla-lazyload/demos/native_lazyload_conditional.html).

### Funziona con il tuo DOM, le tue classi e i tuoi attributi data-*

Entrambi gli script funzionano per impostazione predefinita con l'attributo `data-src` e la classe `lazy` nel tuo DOM. Tuttavia, in vanilla-lazyload puoi modificarli (ad esempio in `data-origin`), se desideri migrare da altri script di caricamento lazy a vanilla-lazyload senza dover cambiare il markup HTML.

### Può caricare in modalità lazy le immagini responsive

Sia vanilla-lazyload sia lazysizes possono caricare in modalità lazy immagini responsive di ogni tipo, dal semplice tag `img` al tag `picture` con tag `source` multipli.

Per ulteriori informazioni, consulta l'articolo [Lazy loading delle immagini responsive nel 2020](/blog/lazy-load-responsive-images-in-2020-srcset-sizes-picture-webp/) scritto dal sottoscritto.

### ...e calcolare automaticamente il valore dell'attributo `sizes`

Lo script lazysizes ha una funzione che può risparmiarti la "fatica" di scrivere il valore dell'attributo `sizes` nel tuo markup HTML. Inserendo `data-sizes="auto"` nel markup delle tue immagini, la libreria calcola il valore tramite JavaScript basandosi sul tuo CSS.

Questa funzionalità manca intenzionalmente in vanilla-lazyload. Per fare in modo che i browser visualizzino i contenuti del tuo sito il più velocemente possibile, dovrai <strong>combinare lazy loading ed eager loading</strong> (eager è il contrario di lazy). La best practice in questo caso consiste nel caricare immediatamente (eager) le immagini above-the-fold e in modalità lazy quelle below-the-fold. Nelle immagini caricate subito (eager), dovrai comunque impostare un valore corretto per l'attributo `sizes`. Ciò significa che dovrai calcolare quel valore in ogni caso e, una volta fatto, che senso ha calcolarlo di nuovo tramite JavaScript? Puoi utilizzare lo stesso valore calcolato sia per le immagini eager sia per quelle lazy.

### Può caricare in modalità lazy gli iframe

Sia vanilla-lazyload sia lazysizes possono caricare in modalità lazy il tag `iframe`.

### Può caricare in modalità lazy i video

Solo vanilla-lazyload può caricare in modalità lazy il tag `video`, anche con tag `source` multipli.

Vedi la sezione [lazy video](https://github.com/verlok/vanilla-lazyload#lazy-video) nella documentazione di vanilla-lazyload per maggiori dettagli.

### Può caricare in modalità lazy le immagini di sfondo

Solo vanilla-lazyload può caricare in modalità lazy le immagini di sfondo, comprese quelle multiple. Offre inoltre una modalità per supportare display HiDPI come Retina e Super Retina.

Vedi la sezione [lazy background images](https://github.com/verlok/vanilla-lazyload#lazy-background-image) nella documentazione di vanilla-lazyload per maggiori dettagli.

### Può eseguire codice in modalità lazy quando determinati elementi entrano nel viewport

Solo con vanilla-lazyload puoi eseguire del codice quando determinati elementi entrano nella parte visibile della pagina.

Vedi la sezione [lazy functions](https://www.github.com/verlok/vanilla-lazyload#lazy-functions) nella documentazione di vanilla-lazyload per saperne di più.

### Può ripristinare il DOM allo stato originale

A volte è necessario ripulire il DOM prima di scaricarlo ed effettuare una navigazione fluida verso un'altra pagina, ad esempio quando si utilizza TurboLinks.

vanilla-lazyload ti consente di ripristinare tutto il DOM che ha manipolato al suo stato originale chiamando il metodo `restoreAll()`.

## Conclusione

vanilla-lazyload offre più funzionalità per il lazy-loading di immagini, immagini di sfondo, video e iframe; è ottimizzato per connessioni lente, riprova automaticamente a caricare le immagini dopo una disconnessione di rete, supporta il lazy loading nativo condizionale, può eseguire codice in modalità lazy e ripristinare il DOM allo stato originale.

Dall'altro lato, lazysizes è estendibile e offre la possibilità di calcolare automaticamente l'attributo `sizes` delle immagini, se preferisci non farlo manualmente.

Link:

- [Pagina GitHub di vanilla-lazyload](https://github.com/verlok/vanilla-lazyload)
- [Pagina GitHub di lazysizes](https://github.com/afarkas/lazysizes/)

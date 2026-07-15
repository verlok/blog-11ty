---
title: "Prepararsi a Interaction to Next Paint (INP), una nuova Core Web Vital da marzo 2024"
description: "Come consulente di web performance, sono sempre attento alle novità che influenzano l'esperienza utente dei siti web. Una di queste novità è l'introduzione da parte di Google di una nuova metrica chiamata Interaction to Next Paint (INP). Destinata a diventare una Core Web Vital a marzo 2024, l'INP è progettata per misurare il tempo impiegato da un sito web per rispondere alle interazioni dell'utente. In questo articolo approfondiremo cos'è l'INP, perché è importante e come le aziende possono prepararsi per garantire che i loro siti soddisfino questa metrica fondamentale."
tags:
  - core web vitals
  - web performance
  - interaction to next paint
---

<figure>
	{% image "creation-of-adam.webp", "Il dipinto 'Creazione di Adamo' di Michelangelo", [648, 1296], "648px" %}
	<figcaption>Il dipinto "Creazione di Adamo" di Michelangelo</figcaption>
</figure>

Come consulente di web performance, sono sempre attento alle novità che influenzano l'esperienza utente dei siti web. Una di queste novità è l'introduzione da parte di Google di una nuova metrica chiamata [Interaction to Next Paint (INP)](https://web.dev/inp/). Destinata a diventare una [Core Web Vital](https://web.dev/cwv/) a marzo 2024, l'INP è progettata per misurare il tempo impiegato da un sito web per rispondere alle interazioni degli utenti. In questo articolo approfondiremo cos'è l'INP, perché è importante e come le aziende possono prepararsi per garantire che i loro siti web soddisfino questa metrica fondamentale.

## Comprendere l'Interaction to Next Paint (INP)

L'INP è un'importante aggiunta alle Core Web Vitals, un insieme di metriche che Google utilizza per valutare e posizionare i siti web in base all'esperienza utente.

A differenza di altre metriche come il Largest Contentful Paint (LCP) e il Cumulative Layout Shift (CLS), che misurano rispettivamente il caricamento e la stabilità visiva, l'INP si concentra sull'interattività, ovvero sulla rapidità con cui un sito web risponde agli input degli utenti dopo il caricamento. Questa metrica quantifica il tempo necessario affinché il sito sia pronto a mostrare un aggiornamento visivo (paint) dopo l'interazione dell'utente, con l'obiettivo di garantire un'esperienza priva di ritardi percepibili.

## Perché l'INP è importante

Nel panorama digitale odierno, le aspettative degli utenti sono più alte che mai. Le persone esigono interazioni rapide e fluide quando navigano sul web, e qualsiasi ritardo o elemento che non risponde può causare frustrazione e abbandono. L'INP affronta direttamente questo problema misurando il tempo impiegato da un sito web per rispondere agli input degli utenti, un fattore cruciale per offrire un'esperienza utente eccezionale.

Inoltre, Google ha sottolineato l'importanza delle Core Web Vitals como fattore di posizionamento per la SEO. I siti web che offrono esperienze utente migliori, misurate da queste metriche, hanno maggiori probabilità di posizionarsi più in alto nei risultati di ricerca. Con l'INP destinato a diventare una Core Web Vital, le aziende che daranno priorità all'interattività del proprio sito non solo miglioreranno l'esperienza d'uso, ma otterranno anche un vantaggio in termini di visibilità sui motori di ricerca.

## Prepararsi all'INP

Con l'avvicinarsi della scadenza di marzo 2024, le aziende devono prepararsi all'inclusione dell'INP come Core Web Vital. Ecco alcuni passaggi per assicurarsi che il proprio sito sia pronto:

1. **Valutare le prestazioni attuali dell'INP**: inizia analizzando le prestazioni attuali dell'INP del tuo sito. Il modo più semplice per verificare i valori di INP del tuo sito web è tramite la [Google Search Console](https://search.google.com/search-console/about). In alternativa, puoi utilizzare il [Chrome User Experience Report](https://developer.chrome.com/docs/crux/) (CrUX) o [PageSpeed Insights](https://pagespeed.web.dev/). Misura i tuoi punteggi INP attuali e stabilisci obiettivi di miglioramento.

2. **Migliorare l'INP**: consulta il capitolo successivo per scoprire cosa fare per migliorare l'INP sul tuo sito web.

3. **Monitorare e iterare continuamente**: le prestazioni web sono un processo continuo, ed è fondamentale monitorare e misurare l'INP regolarmente. Analizza costantemente le prestazioni del tuo sito, implementa ottimizzazioni e ripeti i test per assicurarti che i punteggi INP soddisfino i target desiderati. Consulta regolarmente la documentazione per sviluppatori di Google e i forum della community per rimanere aggiornato sulle best practice.


## Come migliorare l'INP

Entriamo ora un po' più nel tecnico. Ci sono 3 tipi di azioni che puoi intraprendere per migliorare l'INP sul tuo sito web: evitare o spezzare i task lunghi (long tasks), evitare il JavaScript non necessario ed evitare aggiornamenti di rendering troppo grandi.

### Evitare o spezzare i task lunghi

I task (compiti) sono singole unità di lavoro eseguite dal browser. Includono il rendering, il calcolo del layout, il parsing, la compilazione e l'esecuzione degli script. Quando i task diventano "task lunghi" (long tasks)—ovvero durano 50 millisecondi o più—bloccano il thread principale (main thread), impedendogli di rispondere rapidamente agli input dell'utente.

Un'altra opzione è considerare l'uso di API come `isInputPending` e la Scheduler API. `isInputPending` è una funzione che restituisce un valore booleano indicante se c'è un input utente in attesa. Se restituisce vero, puoi cedere il controllo (yield) al thread principale in modo che possa gestire l'interazione pendente. [Scopri di più su `isInputPending`](https://web.dev/optimize-long-tasks/#yield-only-when-necessary) per cedere il controllo solo quando necessario.

La Scheduler API è un approccio più avanzato, che consente di pianificare il lavoro in base a un sistema di priorità che tiene conto se l'attività in corso sia visibile all'utente o in background. [Scopri di più sulla Scheduler API](https://web.dev/optimize-long-tasks/#a-dedicated-scheduler-api).

Spezzando i task lunghi, offri al browser maggiori opportunità di inserire tempestivamente il lavoro critico visibile all'utente, come la gestione delle interazioni e i relativi aggiornamenti di rendering.

### Evitare il JavaScript superfluo

Non c'è dubbio: i siti web stanno [inviando più JavaScript](https://almanac.httparchive.org/en/2022/javascript#how-much-javascript-do-we-load) che mai, e la tendenza non sembra destinata a cambiare a breve. Quando invii troppo JavaScript, crei un ambiente in cui i vari task competono per l'attenzione del thread principale. Questo può influire negativamente sulla reattività del tuo sito, specialmente durante la cruciale fase di avvio (startup).

Tuttavia, questo non è un problema irrisolvibile. Hai a disposizione diverse opzioni:

- Usa lo strumento Coverage in Chrome DevTools per individuare il codice inutilizzato nelle risorse del tuo sito. Riducendo le dimensioni delle risorse necessarie all'avvio, farai in modo che il sito passi meno tempo a fare il parsing e a compilare il codice, a tutto vantaggio di una migliore esperienza utente iniziale. [Scopri lo strumento Coverage](https://developer.chrome.com/docs/devtools/coverage/).
- A volte il codice inutilizzato trovato con lo strumento Coverage è contrassegnato come tale semplicemente perché non è stato eseguito all'avvio, ma è comunque necessario per funzionalità future. Questo è codice che puoi spostare in un bundle separato tramite il code splitting (divisione del codice). [Scopri di più sul code splitting](https://web.dev/reduce-javascript-payloads-with-code-splitting/).
- Se utilizzi un tag manager, assicurati di controllare periodicamente i tag per verificare che siano ottimizzati o se siano ancora effettivamente necessari. I vecchi tag con codice inutilizzato possono essere rimossi per rendere il JavaScript del tag manager più leggero ed efficiente. [Ulteriori best practice per i tag manager](https://web.dev/tag-best-practices/).

### Evitare aggiornamenti di rendering di grandi dimensioni

Il JavaScript non è l'unico fattore che può influire sulla reattività del tuo sito. Il rendering stesso può essere un'attività molto onerosa e, quando si verificano aggiornamenti di rendering di grandi dimensioni, questi possono ostacolare la capacità del sito di rispondere tempestivamente agli input dell'utente.

Ottimizzare il lavoro di rendering non è un processo lineare e spesso dipende da ciò che si vuole ottenere. Ciononostante, ci sono alcune accortezze che puoi adottare per garantire che gli aggiornamenti di rendering siano contenuti e non si trasformino in task lunghi:

- Evita di usare `requestAnimationFrame()` per attività non visive. Le chiamate a `requestAnimationFrame()` vengono gestite durante la fase di rendering dell'event loop e, se si esegue troppo lavoro in questa fase, gli aggiornamenti visivi possono subire ritardi. È fondamentale che qualsiasi operazione eseguita all'interno di `requestAnimationFrame()` sia riservata strettamente ad attività legate agli aggiornamenti di rendering.
- Mantieni ridotte le dimensioni del DOM. Esiste una correlazione diretta tra la dimensione del DOM e l'onerosità del calcolo del layout. Quando il renderer deve aggiornare il layout per un DOM molto grande, il lavoro richiesto per ricalcolarlo aumenta in modo significativo. [Evitare un DOM dalle dimensioni eccessive](https://developer.chrome.com/docs/lighthouse/performance/dom-size/).
- Usa il CSS containment. Questa tecnica si basa sulla proprietà CSS `contain`, che fornisce istruzioni al browser su come gestire il layout per il contenitore su cui è applicata, arrivando persino a isolare l'ambito del layout e del rendering a una radice specifica nel DOM. Non è sempre un processo semplice, ma isolando le aree con layout complessi si evita di eseguire per esse lavori di layout e rendering non necessari. [Scopri di più sul CSS Containment](https://developer.mozilla.org/docs/Web/CSS/CSS_Containment).


## Conclusione

Con l'Interaction to Next Paint (INP) destinato a diventare una Core Web Vital a marzo 2024, le aziende dovrebbero iniziare a dare priorità all'interattività del proprio sito web per offrire un'esperienza utente eccezionale e migliorare il posizionamento sui motori di ricerca.

Valutando le prestazioni INP attuali, ottimizzando l'interattività e monitorando e iterando costantemente, le aziende possono prepararsi al meglio a questo cambiamento.

Adottare l'INP come metrica fondamentale per le prestazioni non porterà solo benefici agli utenti, ma contribuirà anche al successo a lungo termine della propria presenza online.

## Hai bisogno di aiuto?

Se desideri saperne di più sull'INP, su come ottimizzarlo o se hai bisogno di una consulenza sulle prestazioni web, non esitare a [contattarmi](/contact/).

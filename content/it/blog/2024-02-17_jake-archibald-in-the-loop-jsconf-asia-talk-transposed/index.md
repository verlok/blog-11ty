---
title: "Il talk di Jake Archibald \"In the loop\", trascritto"
description: "Il talk di Jake Archibald \"In the loop\" è ancora una delle migliori fonti di informazioni su come i browser gestiscono i task e rispondono all'input dell'utente. Poiché non ho trovato nulla di così chiaro in formato testuale, ho deciso di trascrivere il suo intervento in questo articolo."
tags:
  - web performance
  - interaction to next paint
---

Il talk di [Jake Archibald](https://jakearchibald.com/) "In the loop" (JS Conf Asia) è ancora una delle migliori fonti di informazioni su come i browser elaborano i task e riescono a rispondere all'input dell'utente. Non avendo trovato nulla di così comprensibile in formato testuale, ho deciso di trascrivere il suo intervento in questo articolo. Trovi il video alla fine.

## Main thread e ordine deterministico

Prendi i seguenti frammenti di codice:

```js
document.body.appendChild(el);
el.style.display = 'none';
```

```js
el.style.display = 'none';
document.body.appendChild(el);
```

Diresti che si comportano allo stesso modo per quanto riguarda l'esperienza dell'utente? Gli utenti vedranno un lampeggiamento dovuto all'elemento aggiunto al DOM e subito nascosto?

La risposta è che i due frammenti di codice si comportano esattamente allo stesso modo, e questo a causa di come funziona il thread principale (main thread).

## Il thread principale (main thread)

Lo chiamiamo thread principale perché qui accadono un'infinità di cose. È dove viene eseguito JavaScript. È dove avviene il rendering. È dove vive il DOM. 

Ciò significa che le operazioni sul web hanno un ordine deterministico. Non abbiamo diversi frammenti di codice che girano contemporaneamente cercando di modificare lo stesso DOM, il che porterebbe a una sfilza di terribili race condition.

Ma significa anche che se qualcosa sul thread principale richiede molto tempo (ad esempio 200 millisecondi, che è un'eternità in termini di interazione dell'utente), allora diventa estremamente evidente perché ha bloccato molte altre cose, come il rendering e l'interattività.

Pensa a un blocco del thread principale come a quando starnutiamo. Tutto il resto si ferma finché lo starnuto non è finito. Inutile dire che non vogliamo scrivere codice che si comporti come uno starnuto.

Quindi, sebbene ci sia questo thread principale, tendiamo ad avviare tutta una serie di thread collaterali (ad esempio per le richieste di rete, la codifica e decodifica, la crittografia, il monitoraggio dei dispositivi di input), ma una volta che questi thread hanno completato un'operazione di cui la pagina deve essere a conoscenza, devono in qualche modo tornare al thread principale per fornirgli queste informazioni. Ed è proprio l'**event loop** che orchestra tutto questo.

## Le code dei task (Task queues)

Prendi `setTimeout`, ad esempio. Hai mai pensato a come funzioni in realtà? Quando viene invocato, deve eseguire i seguenti passaggi:

- attendere `ms` millisecondi
- invocare la callback

Fatto. 

Eseguiamo questi passaggi in parallelo — il che è un modo per dire che usciamo dal thread principale per eseguire questa roba contemporaneamente ad altro — ma così facendo creiamo un nuovo problema, perché ora stiamo invocando una callback da qualcosa che non è il thread principale, e questo non può funzionare. Finiresti per avere molto codice JavaScript in esecuzione in parallelo che modifica lo stesso DOM, creando inevitabili race condition.

Quindi facciamo così: accodiamo un task. Accodiamo un task per tornare sul thread principale a un certo punto, e a quel punto eseguiamo JavaScript sul thread in cui vive JavaScript, facendo funzionare tutto correttamente.

## Conosciamo l'event loop

<figure>
	{% image "01 - the event loop and the task detour on the left.png", "L'event loop e la deviazione dei task sulla sinistra", [648, 1296], "648px" %}
	<figcaption>Questo è come Jake descrive l'event loop. È un cerchio, l'esecuzione gira continuamente finché un task non viene accodato nella "deviazione dei task" a sinistra.</figcaption>
</figure>

Ora, cosa succede se facciamo questo:

```js
setTimeout(callback1, 1000);
setTimeout(callback2, 1000);
```

Ebbene, secondo le specifiche, questi due algoritmi vengono eseguiti in parallelo, ciascuno attende mille millisecondi, e poi devono tornare al thread principale. E lo fanno accodando un task.

Quindi, il browser dice all'event loop: "Ehi, ho qualcosa qui che vuole eseguire del lavoro sul thread principale. Anzi, ho due cose", e aggiunge ciascuna di esse come un elemento separato nella coda dei task.

<figure>
	{% image "02 - tasks in the queue.png", "Due task sono pianificati per l'esecuzione nella coda dei task", [648, 1296], "648px", true %}
	<figcaption>Ora due task sono pianificati per l'esecuzione nella coda dei task</figcaption>
</figure>

L'event loop risponde: "Certo, va bene, me ne occuperò". Quindi, esegue la prima callback, **fa un giro dell'event loop** ed esegue la seconda.

E questi sono i task. Sarebbe piuttosto semplice se fosse tutto qui, ma le cose si complicano quando consideriamo gli step di rendering.

## Gli step di rendering (render steps)

Questo è ciò che il browser utilizza per aggiornare effettivamente ciò che appare sullo schermo.

<figure>
	{% image "03 - the render steps - style, layout, painting.png", "Gli step di rendering", [648, 1296], "648px", true %}
	<figcaption>Sul lato destro dell'event loop, gli step di rendering: style, layout, painting</figcaption>
</figure>

Gli step di rendering sono un'altra deviazione e coinvolgono il calcolo dello stile. 

- Style (S): consiste nell'analizzare tutto il CSS presente e calcolare cosa si applica a ciascun elemento.
- Layout (L): consiste nel creare un render tree, calcolando la posizione e le dimensioni di ogni elemento nella pagina.
- Paint (P): consiste nel generare i dati effettivi dei pixel, eseguendo il disegno vero e proprio sulla pagina.

Quindi, a un certo punto il browser dirà all'event loop: "Ehi, sai, dobbiamo aggiornare lo schermo" e l'event loop risponderà: "Nessun problema, me ne occuperò al prossimo giro dell'event loop".

## Un ciclo infinito con `while(true)`

Ecco una pagina con una GIF, del testo e un grande pulsante che avvia un ciclo infinito in JavaScript.

<figure>
	{% image "04 - example page for infinite loop.png", "Una pagina semplice con la GIF di un gatto, del testo e un pulsante per il ciclo infinito", [648, 1296], "648px", true %}
	<figcaption>Una pagina semplice con la GIF di un gatto, del testo e un pulsante per il ciclo infinito</figcaption>
</figure>

```js
button.addEventListener('click', (event) => {  
    while(true);
});
```

Quindi, se clicco quel pulsante, tutto si ferma. La GIF si blocca. Non posso più selezionare il testo. L'intera scheda va in stallo.

<figure>
	{% image "05 - infinite loop in the event loop.png", "Il punto di esecuzione è bloccato nel singolo task in coda", [648, 1296], "648px", true %}
	<figcaption>Visualizzazione dell'event loop che esegue un ciclo infinito</figcaption>
</figure>

L'utente clicca sul pulsante, quindi il browser dice: "Ehi, event loop, ho un task per te", e l'event loop risponde: "Sì, nessun problema, me ne occupo io". Ma questo task non finisce mai. Continua a eseguire JavaScript all'infinito.

Un paio di millisecondi dopo il browser dice: "Ehi, event loop, dobbiamo aggiornare la GIF sulla pagina. Quindi, se potessi effettuare il rendering non appena sei libero, sarebbe fantastico". L'event loop risponde: "Sì, okay, me ne occuperò subito dopo aver finito questo ciclo infinito in cui sono impegnato in questo momento".

Poi l'utente prova a evidenziare del testo, il che comporta operazioni come l'hit testing ed esaminare il DOM per capire quale sia il testo effettivo. Quindi, il browser dice: "Ehi, ho altri elementi da aggiungere alla tua lista di cose da fare". E l'event loop risponde: "Stai scherzando? Hai idea di quanto tempo ci voglia per completare un ciclo infinito? È un sacco di tempo. C'è un indizio nel nome stesso".

Ecco perché un ciclo `while` blocca il rendering e le altre interazioni della pagina. Ma nella pratica questo è un bene. Diamo di nuovo un'occhiata al codice iniziale.

```js
document.body.appendChild(el);
el.style.display = 'none';
```

Un tempo mi preoccupavo che questo potesse causare un lampeggiamento dei contenuti (flash of content), ma non è possibile, giusto? Perché questo script viene eseguito come parte di un task, il quale deve essere completato del tutto prima che il browser possa tornare a occuparsi degli step di rendering.

**L'event loop garantisce che il tuo task sarà completato prima che avvenga il rendering successivo.**

## Un ciclo infinito con `setTimeout()`

Questo è un ciclo, ma ogni volta che lo eseguiamo usiamo `setTimeout` per accodare la chiamata successiva.

```js
function loop() {
    setTimeout (loop, 0);
}
loop();
```

Se eseguiamo questo ciclo `setTimeout` nella pagina demo, sembra che non sia cambiato nulla, ma ecco cosa succede dietro le quinte.

<figure>
	{% image "06 - setTimeout loop being executed.png", "Il punto di esecuzione si sposta verso il task successivo in coda", [648, 1296], "648px", true %}
	<figcaption>L'esecuzione di un ciclo <code>setTimeout</code> esegue un singolo task, per poi accodarne un altro</figcaption>
</figure>

Accodiamo un task, facciamo un giro dell'event loop, prendiamo quel task e, di conseguenza, ne accodiamo un altro. 

Questo continua a succedere all'infinito, ma come abbiamo già visto, può essere elaborato solo un task alla volta. Quindi, quando elabora un task, l'event loop deve fare un intero giro completo per raccogliere il task successivo.

Ciò significa che a un certo punto il browser può dire: "Uhm, dovremmo aggiornare la visualizzazione di quella GIF", perché in quel momento ha la possibilità di deviare e aggiornare lo schermo.

<figure>
	{% image "07 - still have time to process rendering tasks.png", "Il punto di esecuzione si sposta verso gli step di rendering", [648, 1296], "648px", true %}
	<figcaption>Dopo l'esecuzione di quella callback di <code>setTimeout</code>, il ciclo è in grado di effettuare il rendering</figcaption>
</figure>

Ed è per questo che un ciclo `setTimeout` non blocca il rendering.

## `requestAnimationFrame`

Ora, se vuoi eseguire del codice che ha a che fare con il rendering, un task è davvero il posto sbagliato per farlo, perché un task si trova all'estremo opposto rispetto a tutto ciò che riguarda il rendering, per quanto concerne l'event loop. Quello che vogliamo fare è eseguire il codice negli step di rendering. 

Vogliamo eseguire il codice qui:

<figure>
	{% image "08 - requestAnimationFrame.png", "Un riquadro giallo contrassegnato con rAF è apparso prima del blocco style nella deviazione del rendering", [648, 1296], "648px", true %}
	<figcaption><code>requestAnimationFrame</code> è il riquadro giallo etichettato come "rAF" che appare prima del blocco di calcolo dello stile (S) nella deviazione del rendering</figcaption>
</figure>

E il browser ci permette di farlo utilizzando `requestAnimationFrame`.

Le callback "rAF" vengono eseguite come parte degli step di rendering. Per mostrare perché questo sia utile, animerò una scatola, una semplice scatola, usando questo codice.

<figure>
	{% image "09 - one box.png", "Un riquadro quadrato su sfondo blu", [648, 1296], "648px", true %}
	<figcaption>Il riquadro che sta per essere animato</figcaption>
</figure>

```js
function callback() {
	moveBoxForwardOnePixel();
	requestAnimationFrame(callback);
}
callback();
```

Quindi sposterò il riquadro in avanti di un pixel, e poi userò `requestAnimationFrame` per creare un ciclo. Tutto qui. Non fa nient'altro. 

Ma cosa succederebbe se sostituissimo `requestAnimationFrame` con `setTimeout`?

```js
function callback() {
	moveBoxForwardOnePixel();
	setTimeout(callback, 0);
}
callback();
```

Il risultato è questo:

<figure>
	{% image "10 - two boxes.png", "Due riquadri quadrati su sfondo blu, il primo etichettato requestAnimationFrame, il secondo setTimeout", [648, 1296], "648px", true %}
	<figcaption>I due riquadri mentre vengono animati. Quello con <code>setTimeout</code> si muove più velocemente di quello con <code>requestAnimationFrame</code></figcaption>
</figure>

Il nuovo riquadro animato con `setTimeout` si muove circa 3,5 volte più velocemente, il che significa che questa callback viene chiamata più spesso, e questo non è affatto un bene.

Abbiamo visto in precedenza che il rendering può avvenire tra un task e l'altro. Ma solo perché può avvenire, non significa che debba per forza succedere.

Possiamo eseguire un task, chiederci "Dobbiamo fare il rendering?" e la risposta potrebbe essere "No, non ne vale ancora la pena". 

<figure>
	{% image "10a - Should we render no.png", "Nell'event loop, l'interruttore che porta alla deviazione del rendering è chiuso", [648, 1296], "648px", true %}
	<figcaption>Dobbiamo renderizzare? Non ancora.</figcaption>
</figure>

Facciamo un giro dell'event loop, prendiamo un altro task. "Renderizziamo adesso?", "No, non sembra il momento giusto". Possono verificarsi molti task prima che il browser decida: "Sì, in realtà al prossimo giro aggiorneremo lo schermo".

<figure>
	{% image "10b - Should we render yes.png", "Nell'event loop, l'interruttore che porta alla deviazione del rendering è aperto", [648, 1296], "648px", true %}
	<figcaption>Dobbiamo renderizzare? Ora è il momento.</figcaption>
</figure>

Il browser decide quando fare questo e cerca di essere il più efficiente possibile. Gli step di rendering avvengono solo se c'è effettivamente qualcosa da aggiornare. Se non è cambiato nulla, non si disturberà.

Ad esempio, se la scheda del browser è in background e non è visibile, non eseguirà mai gli step di rendering perché non avrebbe senso. Inoltre, la maggior parte degli schermi si aggiorna a una frequenza fissa. Nella maggior parte dei casi si tratta di 60 volte al secondo. Alcuni schermi sono più veloci, altri più lenti, ma i 60 Hz rappresentano lo standard più comune.

Quindi, se modificassimo gli stili della pagina mille volte al secondo, il browser non eseguirebbe gli step di rendering mille volte al secondo: si sincronizzerà con lo schermo e renderizzerà solo fino alla frequenza massima supportata dal display. Solitamente, 60 volte al secondo.

Altrimenti sarebbe solo una perdita di tempo; non ha senso renderizzare elementi che l'utente non vedrà mai. Ma è proprio quello che fa `setTimeout` in questo caso. Si muove più velocemente perché aggiorna la posizione del riquadro più volte di quante l'utente possa effettivamente vederlo, più volte rispetto a quanto il display sia in grado di mostrare.

#### Altri modi per accodare un task

Finora abbiamo usato `setTimeout` come scorciatoia per dire "accodare un task", ma in realtà non lo è. Anche se impostiamo 0 millisecondi per la callback, il browser utilizzerà di default circa 4,7 millisecondi (le specifiche dicono che il browser può scegliere qualsiasi numero, ma Jake ha effettuato test e misurazioni precise).

<figure>
	{% image "11 - Three boxes.png", "Tre riquadri quadrati su sfondo blu, il primo etichettato requestAnimationFrame, il secondo setTimeout, il terzo queueTask", [648, 1296], "648px", true %}
	<figcaption>I tre riquadri mentre vengono animati. Quello etichettato come <code>queueTask</code> si muove così velocemente da apparire in posizioni casuali sulla sua riga</figcaption>
</figure>

Non esiste un singolo metodo che si limiti ad accodare un task, ma possiamo simularlo usando i MessageChannel. Jake ha fatto un test proprio con questo approccio. 

Il risultato è che si verificano così tanti task che il riquadro sembra assumere posizioni casuali. Riceviamo un task ogni due centesimi (2/100) di millisecondo. Quindi il rendering può avvenire tra i task, ma si possono avere molti task, persino decine di migliaia, tra un rendering e l'altro.

## Task e frame nel tempo

Immaginiamo che ciascuno di questi sia un frame mostrato all'utente. 

Quindi, i nostri step di rendering avvengono all'inizio di ciascun frame e questo include il calcolo dello stile, il layout e il paint, anche se non necessariamente tutti e tre ogni volta.

<figure>
	{% image "12 - Frames with rendering tasks.png", "Tre rettangoli che rappresentano i frame, ciascuno contenente un rettangolo viola e uno verde che rappresentano le attività di stile e rendering", [648, 1296], "648px", true %}
	<figcaption>Tre frame, ciascuno contenente un task di stile (viola) e uno di rendering (verde)</figcaption>
</figure>

Dipende da cosa deve effettivamente essere aggiornato, ma questo mi piace. È molto ordinato e pulito. È una bellissima rappresentazione.

<figure>
	{% image "13 - Tasks are everythere.png", "I task vengono eseguiti ovunque durante un singolo frame", [648, 1296], "648px", true %}
	<figcaption>I task vengono eseguiti ovunque durante un singolo frame</figcaption>
</figure>

I task, d'altro canto, non si curano affatto del frame. Appaiono semplicemente dove capita. L'event loop garantisce che avvengano nel giusto ordine, ovvero l'ordine in cui sono stati accodati, ma in termini di tempistiche all'interno di un singolo frame non vi è alcun tipo di sincronizzazione.

E lo abbiamo visto con il nostro `setTimeout`. Ne ricevevamo tre o quattro per frame, il che significa che tre quarti di quelle callback erano sforzi inutili in termini di rendering.

<figure>
	 {% image "14 - 3 out of 4 tasks highlghted.png", "Stessa figura precedente, ora 3 rettangoli gialli su 4 sono spostati, a rappresentare lo sforzo sprecato", [648, 1296], "648px", true %}
	<figcaption>3 task su 4 evidenziati come sforzo sprecato in termini di rendering</figcaption>
</figure>

Le vecchie librerie di animazione facevano qualcosa del genere, cercando di usare un valore in millisecondi che desse loro circa 60 callback al secondo...

```js
setTimeout (animFrame, 1000 / 60);
```

...e assumevano molto sullo schermo. Si dava per scontato che lo schermo fosse a 60 Hz, che all'epoca era il caso comune.

<figure>
	{% image "15 - Tasks distributed across frames.png", "I task vengono pianificati in ogni frame usando setTimeout", [648, 1296], "648px", true %}
	<figcaption>I task vengono pianificati in ogni frame usando <code>setTimeout</code></figcaption>
</figure>

Funzionava in qualche modo, eliminando parte del lavoro duplicato. Purtroppo si trattava di un enorme hack, perché setTimeout non è stato progettato per le animazioni e questo si nota: a causa di imprecisioni temporali si finisce per avere delle discrepanze (drift).

<figure>
	{% image "16 - Tasks distributed across frames, with mistake.png", "Un quadrato giallo che doveva trovarsi nel secondo frame appare nel terzo frame", [648, 1296], "648px", true %}
	<figcaption>Un task doveva essere eseguito nel secondo frame, ma è stato eseguito nel terzo frame</figcaption>
</figure>

Quello che succede qui è che non facciamo nulla in un frame e poi nel frame successivo facciamo il doppio del lavoro; questo provoca un'interruzione visiva (visual jank) per l'utente, e non è bello da vedere.

Inoltre, si blocca uno dei tuoi task per molto tempo, puoi finire per spostare gli step di rendering perché tutto gira sullo stesso thread, andando a disturbare quella precisa routine del browser.

<figure>
	{% image "17 - Tasks distributed along frames, one going long to the next frame.png", "Quadrati gialli che partono all'interno di ciascun frame, il primo dei quali si estende nel frame successivo", [648, 1296], "648px", true %}
	<figcaption>I frame partono all'interno di ciascun blocco, e il primo di essi viene eseguito a cavallo del frame successivo</figcaption>
</figure>

Se usiamo `requestAnimationFrame` anziché `setTimeout`, la situazione apparirà molto più simile a questa. Tutto pulito e ordinato. Tutto in fila. Ogni cosa rientra nelle tempistiche del frame, persino questo task più lungo. 

<figure>
	{% image "18 - Tasks are grouped together at the beginning of every frame.png", "I rettangoli gialli che rappresentano i task sono raggruppati all'inizio di ciascun frame", [648, 1296], "648px", true %}
	<figcaption>I task sono raggruppati all'inizio di ogni frame, utilizzando <code>requestAnimationFrame</code> invece di <code>setTimeout</code></figcaption>
</figure>

Jake afferma che quando vede tracce di performance come queste si sente felice, perché mostrano una buona esperienza utente.

Ovviamente non si possono evitare completamente i task, perché elementi come gli eventi click ti verranno recapitati tramite un task, e in genere si desidera rispondere ad essi il prima possibile. Ma se hai timer o dati provenienti dalla rete, Jake consiglia di usare `requestAnimationFrame` per raggruppare quel lavoro, specialmente se hai già delle animazioni in corso, in modo da risparmiarti un sacco di lavoro duplicato.

## Task e tempistiche di rendering

C'è un ultimo dettaglio su cui voglio soffermarmi, ed è qualcosa che trae in inganno molti sviluppatori (ha ingannato anche me). `requestAnimationFrame` viene eseguito prima dell'elaborazione del CSS e prima del paint.

```js
button.addEventListener('click', () => {
	box.style.display = "none";
	box.style.display = "block";
	box.style.display = "none";
	box.style.display = "block";
	box.style.display = "none";
	box.style.display = "block";
	box.style.display = "none";
	box.style.display = "block";
	box.style.display = "none";
});
```

Quindi, un codice come questo potrebbe sembrare costoso, dato che stiamo mostrando e nascondendo un elemento molte volte, ma in realtà è molto economico, poiché JavaScript completerà sempre la sua esecuzione prima che avvenga il rendering.

Quindi, mentre fai questo, il browser si rilassa, ti lascia divertire a cambiare i valori e non pensa minimamente al CSS. Alla fine, quando arriva il momento di eseguire gli step di rendering, analizza la situazione e si chiede: "Ok, cosa hai effettivamente cambiato alla fine?" E l'unica parte che conta davvero è l'ultima riga.

So il codice sopra, in termini di rendering, equivale al seguente frammento:

```js
button.addEventListener('click', () => {
	box.style.display = "none";
});
```

## Animare un elemento?

Sto omettendo la parte in cui Jake spiega come accodare del codice JavaScript per animare un elemento da 1000 a 500 pixel utilizzando una doppia callback `requestAnimationFrame`, poiché non è più rilevante al momento della scrittura: le [Web Animation API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API), che all'epoca del talk di Jake erano disponibili solo su Chrome, sono ormai supportate da tutti i browser.

## Microtask

Negli anni '90, i browser volevano fornire agli sviluppatori un modo per monitorare le modifiche al DOM e il W3C creò i mutation event.

```js
document.body.addEventListener('DOMNodeInserted', () => {
	console.log('Stuff added to the <body>');
});
```

In questo modo potevo dire, ad esempio, che volevo sapere quando un nodo veniva inserito all'interno dell'elemento `body`. E si riceveva anche una serie di altri eventi correlati.

Ma nella pratica questo approccio si è rivelato alquanto problematico. 

Prendiamo questo pezzo di codice: sto inserendo cento elementi `span` all'interno dell'elemento `body`.

```js
for (let i=0; i<100; i++) {
	const span = document.createElement('span');
	document.body.appendChild(span);
	span.textContent = 'Hello';
}
```

Quanti eventi ti aspetteresti di ricevere come risultato?
Un solo evento? Un evento unico per l'intera operazione? No. 
100 eventi? Uno per ogni span. Sì.

Ma anche un altro centinaio per `span.textContent = 'Hello';` quando il nodo di testo entra nello span. E poiché questi eventi si propagano (bubble), questo semplice frammento di codice finirà per generare ben 200 eventi.

A causa di ciò, modifiche del DOM relativamente semplici finivano per scatenare migliaia di eventi, e se eseguivi anche solo un minimo lavoro all'interno di questi listener, questo si accumulava rapidamente diventando un disastro in termini di prestazioni.

Quello che volevamo davvero era un modo per ricevere notifiche su un blocco (batch) di queste operazioni, in modo simile a quanto visto prima per gli stili.
Vogliamo che il browser si rilassi, ci lasci fare le nostre operazioni e poi, in un momento opportuno, ci segnali che qualcosa è cambiato.
Qualcosa che rappresenti cumulativamente tutti questi cambiamenti.

Vogliamo ricevere la notifica una sola volta, non 200 volte. E la soluzione sono stati i mutation observer. Che hanno introdotto una nuova coda chiamata microtask.

Molta documentazione che ho letto sui microtask suggerisce che vengano eseguiti a ogni giro dell'event loop o dopo un task o qualcosa del genere, ed è in parte vero. C'è un punto specifico dell'event loop in cui i microtask vengono elaborati, ma in genere non è lì che li incontrerai. Essi vengono eseguiti anche ogni volta che JavaScript termina l'esecuzione di uno script.

Ciò significa che lo stack di JavaScript si svuota completamente, ed è proprio in quel momento che eseguiamo i microtask.

Quindi puoi trovarti con microtask eseguiti a metà di un task, o all'interno degli step di rendering come parte di `requestAnimationFrame`, praticamente ovunque possa essere eseguito JavaScript.

```js
for (let i=0; i<100; i++) {
	const span = document.createElement('span');
	document.body.appendChild(span);
	span.textContent = 'Hello';
}
```

Ciò significa che questo JavaScript verrà eseguito fino alla fine, aggiungendo i cento span e i relativi contenuti. JavaScript termina l'esecuzione e viene attivata la callback del nostro mutation observer.

Anche le Promise fanno uso dei microtask.

```js
Promise.resolve().then(() => console.log('Hey!'));
console.log('Yo!');
```

Quindi, qui accodiamo un microtask e poi stampiamo 'Yo!'. JavaScript ha terminato l'esecuzione. Quindi, passiamo ai microtask e stampiamo 'Hey!'.

Questo significa che quando la callback della Promise viene eseguita, hai la garanzia che nessun altro codice JavaScript si trovi a metà esecuzione in quel momento, poiché la callback della Promise è proprio alla base dello stack, ed è per questo che le Promise utilizzano i microtask.

## Un ciclo infinito con `Promise.resolve()`

Ma cosa succede se creiamo un ciclo utilizzando i microtask? In termini di codice, in modo simile a quanto fatto in precedenza con `setTimeout` [in precedenza](#un-ciclo-infinito-con-settimeout).

```js
function loop() {
	Promise.resolve().then(loop);
}
loop();
```

<figure>
	{% image "19 - Cat demo microtasks loop.png", "Una pagina web con la GIF di un gatto, del testo e un pulsante etichettato \"Microtask Loop\"", [648, 1296], "648px", true %}
	<figcaption>Di nuovo la stessa demo: la GIF di un gatto, del testo e un pulsante con scritto "Microtask Loop"</figcaption>
</figure>

Cliccando sul pulsante... il rendering si blocca e la scheda va in stallo esattamente come succedeva con il ciclo `while`, in modo del tutto diverso rispetto al `setTimeout` visto prima.

Quindi, le callback delle `Promise` sono asincrone, d'accordo, ma cosa significa in realtà asincrono?
Significa semplicemente che avvengono dopo l'esecuzione del codice sincrono, ed è per questo che viene stampato 'Yo!' prima di 'Hey!'.
Ma il semplice fatto di essere asincrono non significa che debba cedere il controllo al rendering, né che debba cedere il passo a una parte specifica dell'event loop.

<figure>
	{% image "20 - Three types of queues.png", "Tre pile di rettangoli contenenti ciascuno la parola \"Item\". La prima pila è etichettata Tasks, la seconda \"Animation callbacks\", la terza \"Microtasks\"", [648, 1296], "648px", true %}
	<figcaption>Tre tipi di code: Tasks, Animation Callbacks, Microtasks</figcaption>
</figure>

Finora abbiamo esaminato tre diverse code. Abbiamo visto la coda dei task, la coda delle callback di animazione (in cui avvengono le callback di `requestAnimationFrame`) e ora stiamo guardando i microtask. E, giusto per semplificarci la vita, ognuna di esse viene elaborata in modo leggermente diverso.

Come abbiamo visto con la coda dei task, preleviamo un solo elemento alla volta. E se viene accodato un altro elemento, questo va semplicemente alla fine della coda. E fin qui tutto bene.

<figure>
	{% image "21 - Task queue one item only.png", "La stessa immagine mostrata nella figura precedente, ma ora il primo elemento in cima alla coda dei task è verde ed è etichettato \"Additional item\"", [648, 1296], "648px", true %}
	<figcaption>L'elemento aggiuntivo aggiunto alla coda dei task non viene elaborato immediatamente</figcaption>
</figure>

Le callback di animazione vengono eseguite fino al completamento, ad eccezione di quelle accodate durante l'elaborazione delle callback stesse, le quali vengono rimandate al frame successivo. 

<figure>
	{% image "22 - rAF queue all items but not the newly added ones.png", "La stessa immagine mostrata nella figura precedente, ma ora tutti gli elementi nella coda requestAnimationFrame sono verdi ed etichettati \"Additional item\"", [648, 1296], "648px", true %}
	<figcaption>Tutti i task della coda <code>requestAnimationFrame</code> vengono elaborati, tranne quelli appena aggiunti</figcaption>
</figure>

I microtask, d'altro canto, vengono elaborati fino al completo svuotamento della coda, inclusi tutti gli elementi che vengono accodati durante l'elaborazione stessa.

<figure>
	{% image "23 - Microtasks queue all processed until completion.png", "La stessa immagine mostrata nella figura precedente, ma ora tutti gli elementi nella coda dei microtask sono verdi, etichettati \"Additional item\", e altri appaiono in cima", [648, 1296], "648px", true %}
	<figcaption>I nuovi microtask continuano ad essere elaborati fino a quando la coda non è vuota</figcaption>
</figure>

Quindi, se aggiungi elementi alla coda alla stessa velocità con cui li elabori, continuerai a elaborare microtask all'infinito.
L'event loop non può proseguire finché quella coda non si è svuotata del tutto. Ed è per questo che il rendering si blocca.

## Altro nel video

Il talk termina con alcuni quiz JavaScript sui microtask e sull'ordine di esecuzione, ma questo articolo è già lunghiiiiiissimo, quindi se vuoi davvero risolvere i quesiti ti consiglio di guardare il video.

Dovresti davvero guardare il video originale se non l'hai ancora fatto, perché le "slide" create da Jake utilizzano animazioni straordinarie che spiegano tutto in modo perfetto.

<iframe width="560" height="315" src="https://www.youtube.com/embed/cCOL7MC4Pl0?si=EEhZlFn4UuzsfCpj" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" style="width: 100%; height: auto; aspect-ratio: 16 / 9"></iframe>

## Conclusione

Spero che tu abbia trovato utile questa trascrizione del talk di Jake!
Mi ha davvero aiutato a capire come funzionano i browser sotto il cofano.

Mi ci è voluto un po' per scriverlo, se ti va offrimi un caffè su [Kofi](https://ko-fi.com/verlok).

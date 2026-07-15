---
title: "Verificare se un elemento è ancora nella viewport dopo un certo tempo"
description: "Cosa faresti se qualcuno ti chiedesse di caricare un elemento DOM solo se rimane all'interno della viewport per un determinato periodo di tempo? Utilizzeresti vanilla-lazyload, giusto?"
tags:
  - techniques
  - vanilla-lazyload
---

Cosa faresti se qualcuno ti chiedesse di caricare un elemento DOM solo se **rimane all'interno della viewport per un determinato periodo di tempo**? Utilizzeresti [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload), vero? 😉 Questa è esattamente la nuova funzionalità che la community di GitHub ha richiesto per LazyLoad, allo scopo di **evitare il caricamento di elementi che gli utenti hanno saltato** scorrendo via velocemente. In questo post vorrei condividere con te la soluzione.

Ci sono un paio di modi per farlo. Il primo consiste nel controllare la posizione dell'elemento nel tempo, il secondo sfrutta `IntersectionObserver`.

## Il metodo (lento) senza IntersectionObserver

Questo metodo è molto più lento rispetto all'utilizzo di `IntersectionObserver` perché comporta:

- il monitoraggio degli eventi `scroll` e `resize` del browser per chiamare una callback (gestita con throttling)
- all'interno della callback, un ciclo su tutti gli elementi osservati per chiamare una funzione `isInsideViewport` che verifichi se sono nella viewport
- la funzione `isInsideViewport` a sua volta controlla una [serie di parametri](https://github.com/verlok/vanilla-lazyload/blob/support/8.x/src/lazyload.viewport.js) come `getBoundingClientRect` dell'elemento, `innerHeight` della finestra, `pageYOffset`, ecc., e restituisce un valore booleano

Tutto questo solo per sapere quando gli elementi entrano nella viewport.

Per sapere se un determinato elemento è rimasto nella viewport per un certo tempo, dovresti fare qualcosa del genere:

- quando l'elemento entra nella viewport, avvii una funzione tramite `setTimeout`. Chiamiamola `isStillInsideViewport`.
- all'interno di questa funzione, verifichi se l'elemento è ancora nella viewport chiamando `isInsideViewport` su quell'elemento, quindi:
  - se lo è, lo carichi e lo rimuovi dagli elementi osservati
  - se NON lo è, non lo carichi e continui a monitorarlo

Un concetto piuttosto lineare, ma non così rapido da eseguire.

## Il metodo con IntersectionObserver

Questo metodo è molto più veloce perché comporta unicamente quanto segue:

- configuri un `IntersectionObserver` e lo usi per osservare tutti gli elementi da monitorare
- questo chiama una funzione `onIntersection` ogni volta che un elemento si interseca con la viewport
- puoi gestire tutta la logica di caricamento all'interno della funzione `onIntersection`

Non c'è alcun bisogno di monitorare gli eventi `scroll` o `resize` del browser.

### Prima idea

Il mio primo pensiero era di farlo senza `IntersectionObserver`, il che significava dover verificare lo stato "è all'interno della viewport" dopo un determinato timeout.

Si è scoperto però che non esiste un modo elegante per verificare se un elemento si trova all'interno della viewport usando `IntersectionObserver`. Tutto ciò che si ottiene sono delle callback quando un elemento si interseca con la viewport.

### Scoprire i threshold (soglie)

Ma aspetta, cos'è quell'opzione `thresholds` di `IntersectionObserver` menzionata nella [documentazione](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)? 😲

Dice MDN:

> Un singolo numero o un array di numeri che indicano a quale percentuale di visibilità del target debba essere eseguita la callback dell'observer. Se desideri rilevare solo quando la visibilità supera il 50%, puoi usare il valore 0.5. Se vuoi che la callback venga eseguita ogni volta che la visibilità supera un altro 25%, specificherai l'array [0, 0.25, 0.5, 0.75, 1]. Il valore predefinito è 0 (ovvero, non appena anche un solo pixel è visibile, la callback viene eseguita). Un valore di 1.0 significa che la soglia non è considerata superata finché ogni singolo pixel non è visibile.

Dopo aver fatto qualche prova con questa opzione e aver testato il risultato in una specifica [demo di caricamento ritardato (delay load)](https://github.com/verlok/vanilla-lazyload/blob/master/demos/delay_test.html), ho scoperto che passando `0` all'opzione `thresholds` (che è il valore predefinito), la funzione `onIntersection` viene chiamata anche quando l'elemento *esce* dalla viewport.

### La soluzione definitiva

Una volta capito come intercettare quando un elemento **esce dalla viewport**, risolvere il problema principale è diventato **molto più semplice**.

La soluzione finale consiste nel:

- quando un elemento entra nella viewport, impostare un `setTimeout` per caricare l'elemento
- memorizzare ciascun ID del timeout in un attributo `data-` dell'elemento correlato
- lasciare che l'elemento si carichi allo scadere del timeout
- se l'elemento esce dalla viewport prima che il timeout venga eseguito, annullare il timeout tramite `clearTimeout`

Semplice e lineare! 😊

---

## Mostrami il codice!

Puoi trovare il codice completo nel file [`lazyload.js`](https://github.com/verlok/vanilla-lazyload/blob/master/src/lazyload.js) di vanilla-lazyload e nei relativi import correlati. Se non ti va di saltare da un file all'altro, puoi anche aprire il file pacchettizzato [`lazyload.es2015.js`](https://github.com/verlok/vanilla-lazyload/blob/master/dist/lazyload.es2015.js) nella cartella `dist`.

Di seguito è riportata una **versione semplificata** del codice per comodità.

### Configurazione di IntersectionObserver

```js
const gObserver = new IntersectionObserver(onIntersection, {
  rootMargin: "0px",
  threshold: 0
});
```

L'opzione `rootMargin` impostata su `0px` indica di osservare la dimensione effettiva della viewport. Puoi passare qualsiasi lunghezza CSS per espandere l'area osservata. Ad esempio, passare `300px` la espanderà di tale misura sopra, a destra, sotto e a sinistra.

### La funzione onIntersection

Questa funzione viene chiamata ogni volta che si verifica un'intersezione e il parametro rappresenta l'insieme di elementi (entries) che si sono intersecati con la viewport.

Ipotizzando che `watchedElements` siano gli elementi monitorati dallo script (vedi sotto), dopo ogni intersezione essi dovrebbero essere rimossi dall'elenco degli elementi già gestiti (caricati).

La funzione `purgeElements` esula dagli scopi di questo post, ma si limita a restituire un sottoinsieme di `watchedElements`.

```js
const onIntersection = entries => {
  entries.forEach(manageIntersection);
  watchedElements = purgeElements(watchedElements);
};
```

### La funzione manageIntersection

Questa funzione viene chiamata per ciascuna entry che si è intersecata con la viewport. Sia in entrata che in uscita.

In entrata avvia il caricamento ritardato dell'elemento. In uscita lo annulla.

```js
const manageIntersection = entry => {
  var element = entry.target;
  if (isIntersecting(entry)) {
    delayLoad(element, delayTime);
  } else {
    cancelDelayLoad(element);
  }
};
```

### Funzione di utilità isIntersecting

Questa è una funzione di utilità per comprendere se un elemento si stia intersecando o meno con la viewport.

Nota che:

- `entry.isIntersecting` necessita di un fallback perché è `null` in alcune versioni di Microsoft Edge
- `entry.intersectionRatio` da solo non è sufficiente poiché potrebbe essere `0` su alcuni elementi in intersezione

```js
const isIntersecting = (entry) =>
  entry.isIntersecting || entry.intersectionRatio > 0;
```

### La funzione delayLoad

Questa è la funzione che ritarda il caricamento dell'elemento di un tempo pari a `delayTime`.

`getTimeoutData` e `setTimeoutData` sono funzioni di utilità per leggere e scrivere l'ID del timeout da/in un attributo data- dell'elemento.

```js
const delayLoad = (element, delayTime) => {
  var timeoutId = getTimeoutData(element);
  if (timeoutId) {
    return; // il timeout era già impostato, non fa nulla
  }
  timeoutId = setTimeout(function() {
    loadAndUnobserve(element);
    cancelDelayLoad(element);
  }, delayTime);
  setTimeoutData(element, timeoutId);
};
```

### La funzione cancelDelayLoad

Questa funzione ha il compito di annullare il timeout dell'elemento, si impostato.

```js
const cancelDelayLoad = element => {
  var timeoutId = getTimeoutData(element);
  if (!timeoutId) {
    return; // non fa nulla se il timeout non esiste
  }
  clearTimeout(timeoutId);
  deleteTimeoutData(element);
};
```

### La funzione loadAndUnobserve

Questa funzione carica immediatamente l'elemento e lo rimuove dagli elementi monitorati dall'istanza di `IntersectionObserver`.

```js
const loadAndUnobserve = (element) => {
  // Qui è dove fai effettivamente qualcosa con l'elemento
  revealElement(element);
  gObserver.unobserve(element);
};
```

### Al mio segnale, scatenate l'inferno!

Abbiamo fatto tutto nel migliore dei modi finora, ma non abbiamo ancora avviato nulla! Abbiamo bisogno di un insieme di elementi da monitorare (`watchedElements`) da passare al nostro `IntersectionObserver`, altrimenti non succederà nulla.

```js
var watchedElements = document.querySelectorAll("img");
watchedElements.forEach(element => gObserver.observe(element));
```

### Tutto insieme

Puoi trovare una versione funzionante del codice sopra indicato su CodeSandbox per poterci sperimentare direttamente!

[![Verifica se un elemento è ancora nella viewport dopo un certo tempo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/mzokk46vlx)

## Conclusioni

Hai visto com'è semplice verificare se un elemento è ancora nella viewport dopo un po' di tempo usando `IntersectionObserver`?

Per ulteriori informazioni su come realizzare un LazyLoad utilizzando `IntersectionObserver`, leggi [Intersection Observer e caricamento lazy degli elementi](./using-intersection-observers-to-create-vanilla-lazyload).

C'è qualcosa che avresti fatto diversamente, o sei d'accordo con le mie scelte? [Contattami](/contact/) e fammi sapere cosa ne pensi!

Se vuoi mostrare il tuo apprezzamento per LazyLoad, [lascia una stella su GitHub](https://github.com/verlok/vanilla-lazyload)! ⭐

---
title: "Come usare scheduler.yield per migliorare la reattività delle pagine web"
description: "Google Chrome sta introducendo una nuova funzionalità chiamata scheduler.yield. Questa funzione consente agli sviluppatori web di cedere esplicitamente il controllo al thread principale. Ecco i punti chiave."
tags:
  - web performance
  - google chrome
  - interaction to next paint
---

<figure>
	{% image "yield.webp", "Un segnale stradale, un triangolo bianco con bordo rosso con all'interno la parola YIELD in rosso", [648, 1296], "648px" %}
	<figcaption>Un'immagine casuale per rappresentare il dare la precedenza (yield)</figcaption>
</figure>

Nell'agosto del 2023, Google ha introdotto `scheduler.yield`, disponibile come origin trial in Chrome 115 e versioni successive.

## Cos'è

`scheduler.yield` è una nuova funzionalità di Chrome che consente agli sviluppatori web di cedere esplicitamente il controllo (yield) al thread principale. Ciò può essere utile per attività che richiedono molto tempo, in quanto consente ad _altri_ task di ottenere tempo di esecuzione sul thread principale prima (rispetto a dover attendere il completamento di task molto lunghi).

Quando cedi esplicitamente il controllo, stai dicendo al browser: "Ehi, capisco che il lavoro che sto per fare potrebbe richiedere del tempo, e non voglio che tu debba completarlo interamente prima di poter rispondere agli input dell'utente o ad altri task che potrebbero essere altrettanto importanti".

Questo aiuta a migliorare la reattività complessiva della pagina web, poiché il browser sarà in grado di concentrarsi su altre attività mentre il task a lungo corso è in esecuzione.

E, naturalmente, questo si rivelerà estremamente utile nel lavoro di ottimizzazione della metrica [Interaction to Next Paint (INP)](https://web.dev/inp/), che diventerà una Core Web Vital a partire da marzo 2024.

## Come usarlo

Ecco come si usa:

```js
async function yieldy () {
  // Do some work...
  // ...

  // Yield!
  await scheduler.yield();

  // Do some more work...
  // ...
}
```

Ma aspetta, si può usare solo su Chrome?
Sì, ma in alternativa puoi ripiegare sul buon vecchio `setTimeout` per ottenere un comportamento simile.

L'unica differenza è che i browser che non supportano `scheduler.yield` cederanno il controllo senza il comportamento "front of queue" (in testa alla coda), poiché `setTimeout` sposta il lavoro rimanente in coda all'elenco dei task.

```js
// A function for shimming scheduler.yield and setTimeout:
function yieldToMain () {
  // Use scheduler.yield if it exists:
  if ('scheduler' in window && 'yield' in scheduler) {
    return scheduler.yield();
  }

  // Fall back to setTimeout:
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}

// Example usage:
async function doWork () {
  // Do some work:
  // ...

  await yieldToMain();

  // Do some other work:
  // ...
}
```

## Vuoi provarlo?

Puoi provare `scheduler.yield` sul tuo browser abilitando il flag "experimental web platform features", come mostrato nella figura seguente:

<figure>
	{% image "enable-experimental-web-platform-features.png", "Funzionalità sperimentali della piattaforma web abilitate nelle impostazioni del browser Chrome", [648, 1296], "648px", true %}
	<figcaption>Come abilitare le funzionalità sperimentali della piattaforma web nel browser Chrome</figcaption>
</figure>

Dopodiché, potrai utilizzarlo:

<figure>
	{% image "how-it-looks-in-console.png", "scheduler.yield è presente, scheduler.yield() restituisce una Promise (pending)", [648, 1296], "648px", true %}
	<figcaption>Come appare `scheduler.yield` quando viene invocato nella console dei developer tools</figcaption>
</figure>

## Vuoi provarlo in produzione?

Sì, puoi farlo! Al momento della scrittura di questo articolo (settembre 2023), `scheduler.yield` è in fase di origin trial in Chrome 115 e versioni successive. Puoi scoprire di più sulle origin trial e su come partecipare alla sperimentazione sul sito Chrome Developers: [Guida introduttiva alle origin trial](https://developer.chrome.com/docs/web-platform/origin-trials/).

Leggi l'articolo completo con una spiegazione dettagliata sul blog di Chrome Developers: [Introducing the scheduler.yield origin trial](https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/)

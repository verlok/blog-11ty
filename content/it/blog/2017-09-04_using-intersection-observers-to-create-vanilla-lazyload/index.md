---
title: "Intersection Observer e il caricamento lazy degli elementi"
description: "Ad agosto 2017 l'API Intersection Observer, una nuova ed entusiasmante API del browser, ha finalmente ottenuto un supporto piuttosto ampio. Possiamo usarla per sapere quando due elementi DOM si intersecano, o quando un determinato elemento DOM entra nella viewport del browser. Il caricamento lazy delle immagini è proprio il caso d'uso ideale."
tags:
  - browsers APIs
  - lazy loading
  - techniques
---

Ad agosto 2017 una nuova ed entusiasmante API del browser ha finalmente [ottenuto](https://hacks.mozilla.org/2017/08/intersection-observer-comes-to-firefox/) un [supporto piuttosto ampio](https://caniuse.com/#search=IntersectionObserver): l'**[Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)**, che possiamo utilizzare per rilevare quando due elementi DOM si intersecano, o quando un determinato elemento DOM **entra nella viewport del browser**. Il caricamento lazy (pigro) delle immagini è proprio il caso d'uso ideale.

Circa 3 anni e 500 commit fa, ho dato vita a un nuovo [script per il caricamento lazy](https://github.com/verlok/vanilla-lazyload) in vanilla JavaScript, attualmente noto come `vanilla-lazyload` su [npm](https://www.npmjs.com/package/vanilla-lazyload) e [cdnjs](https://cdnjs.com/libraries/vanilla-lazyload), che ha ricevuto oltre **1.135 stelle su GitHub**.


## Il passaggio a Intersection Observer

Con la crescita della community organizzata attorno al mio script, [alcuni](https://github.com/si14) [membri](https://github.com/ricardobrandao) hanno richiesto il supporto all'API Intersection Observer, tra [altri miglioramenti](https://github.com/verlok/vanilla-lazyload/issues?q=label%3Aenhancement+is%3Aclosed).

Così ho deciso di accontentare i fan dello script. Il codice sorgente risultante è **più piccolo del 40%** e vanilla-lazyload è ora **molto più veloce** rispetto alla versione precedente. (a proposito, se conosci un modo per misurare con precisione le prestazioni di uno script, lascia pure un commento!)


## Come creare un Intersection Observer

L'implementazione è piuttosto semplice: si crea una nuova istanza di `IntersectionObserver` specificando **una funzione di callback** da chiamare ogni volta che si verifica un evento di intersezione, e un paio di opzioni: **root** e **rootMargin**, ovvero:

* `root`: l'elemento rispetto al quale si desidera **verificare l'intersezione** (`null` indica la viewport del browser)
* `rootMargin`: utile nel caso in cui si voglia **espandere o ridurre** l'area sensibile dell'elemento `root`

```js
var myObserver = new IntersectionObserver((entries) => {
    /* fai qualcosa */
}, {
    root: null,
    rootMargin: "300px 0"
});
```

Una volta creato l'intersection observer e assegnato a una variabile, puoi iniziare a osservare un elemento target in questo modo:

```js
var elementToObserve = document.getElementById('observeMe');
myObserver.observe(elementToObserve);
```


## Creare l'observer

Dovendo verificare l'intersezione di un insieme di immagini/elementi **rispetto al contenitore in scorrimento** (la viewport o qualsiasi elemento con stile `overflow: scroll`), ho creato un nuovo `IntersectionObserver` memorizzandolo nella proprietà `_observer` di LazyLoad.

```js
this._observer = new IntersectionObserver(onIntersection, {
    root: settings.container === document ? null : settings.container,
    rootMargin: settings.threshold + "px"
});
```

Note:

* `onIntersection` è una funzione, illustrata di seguito
* `settings.container` è il contenitore con lo scorrimento, il cui valore predefinito è `document`, passato dall'utente di LazyLoad nell'oggetto delle opzioni
* `settings.threshold` è il numero di pixel oltre il contenitore di scorrimento da cui iniziare a caricare le immagini/elementi (default `300`px)


## La funzione onIntersection

Il punto cardine è che ogni volta che un elemento DOM si interseca con il contenitore di scorrimento, viene chiamata la funzione `onIntersection`. Ecco come è definita:

```js
const onIntersection = (entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }
        let element = entry.target;
        revealElement(element, settings);
        this._observer.unobserve(element);
    });
};
```

Al parametro `entries` vengono passati **tutti gli elementi osservati** dall'observer che invoca la funzione. Dobbiamo quindi **ciclare su ogni elemento (entry)** e verificare se **si sta intersecando** o meno con l'elemento `root`. Fortunatamente, la proprietà `isIntersecting` fa proprio questo:

* se l'elemento non si interseca, lo ignoriamo semplicemente eseguendo un `return`
* se l'elemento si interseca, **avviamo il caricamento della sorgente dell'elemento** invocando `revealElement`, e poi **smettiamo di osservare questa specifica entry** (tramite `unobserve`), dato che il caricamento è già iniziato e non c'è più bisogno di tenerlo d'occhio


## Osservare un elemento

Non manca qualcosa? Certo! Il codice spiegato finora non produce alcun effetto se non **diciamo al nostro observer di monitorare un elemento** (o più di uno, nel nostro caso). Quello che dobbiamo fare è:

```js
this._elements.forEach(element => {
    this._observer.observe(element);
});
```

Dove `this._elements` è l'insieme di elementi che LazyLoad ha individuato all'interno di `this._container` tramite un selettore specifico, al netto di quelli già commessi o elaborati (per gestire scenari come lo *scroll infinito* o altri casi di aggiornamento del DOM).


## Fallback

Poiché *non tutti i browser sono creati uguali*, dobbiamo verificare il supporto a `IntersectionObserver` prima di poterlo utilizzare. Il modo per farlo è semplice:

```js
if (!("IntersectionObserver" in window)) {
    return;
}
```

Nel mio caso, sui browser in cui `IntersectionObserver` non è supportato, LazyLoad caricherà **tutte le immagini contemporaneamente**. Di conseguenza, se hai la necessità di caricare moltissime immagini e il tuo pubblico utilizza in percentuale significativa browser più datati, ti consiglio di utilizzare una versione di LazyLoad precedente alla 9. Consulta il [changelog](https://github.com/verlok/vanilla-lazyload/blob/master/CHANGELOG.md) per maggiori dettagli.


## Conclusione

Tutto qui! Intersection Observer rende il codice molto più compatto, veloce e leggibile. Se non lo stai già usando, dovresti assolutamente iniziare a provarlo.

E non dimenticare: se hai una pagina molto lunga piena di immagini e altri contenuti, dovresti caricarli in modalità lazy utilizzando uno script dedicato, e la scelta migliore è sicuramente [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload)!

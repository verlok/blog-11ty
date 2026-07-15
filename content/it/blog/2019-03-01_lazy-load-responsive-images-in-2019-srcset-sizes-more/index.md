---
title: "Caricamento lazy di immagini responsive nel 2019"
description: "Negli ultimi anni, sia per lavoro che come manutentore di uno script LazyLoad, mi sono specializzato nel caricamento lazy delle immagini responsive. Oggi ti mostrerò quale codice HTML, CSS e JavaScript devi scrivere nel 2019 per servire immagini responsive e caricarle in modalità lazy."
tags:
  - techniques
  - lazy loading
  - responsive images
  - images
---

Negli ultimi anni, sia per lavoro che come autore e manutentore di uno [script LazyLoad](https://github.com/verlok/vanilla-lazyload), mi sono specializzato nel **lazy loading** (caricamento pigro) di **immagini responsive**. Oggi ti mostrerò quale codice HTML, CSS e JavaScript devi scrivere *nel 2019* per servire immagini responsive *e* caricarle in modalità lazy. Nella seconda parte del post, ti mostrerò anche come fare in modo che il browser **scelga nativamente l'immagine in formato WebP** quando lo supporta.

## Articolo obsoleto! 👀

**Un momento! Stai leggendo una vecchia versione di questo articolo.**

👉 [Leggi l'**aggiornamento del 2020**](./lazy-load-responsive-images-in-2020-srcset-sizes-picture-webp)

## Lazy responsive... cosa?

Le **immagini responsive** sono le immagini che si adattano allo schermo dell'utente *e al contempo* mantengono veloci i nostri siti web scaricando solo la sorgente corretta per la specifica **larghezza della viewport** (dai piccoli dispositivi mobili ai grandi computer desktop), considerando anche la **densità dello schermo** dell'utente (display retina, hiDPI, ecc.).

Il **lazy loading delle immagini** è una tecnica per velocizzare il sito web **evitando di caricare le immagini che si trovano sotto la piega (below the fold)**, caricandole poi **solo quando entrano nella viewport**. Oltre alle prestazioni, questo ti consente anche di risparmiare larghezza di banda e denaro, ad esempio se paghi un servizio CDN a consumo per le immagini.

## Ricevuto! Ora mostrami un po' di codice!

&rarr; [Dai un'occhiata ai risultati](http://verlok.github.io/vanilla-lazyload/demos/image_srcset_lazy_sizes.html) &larr; che otterrai. Apri gli **strumenti per sviluppatori (developer tools)** del tuo browser e vai nel pannello **Network**. Vedrai che le prime immagini vengono caricate immediatamente (in modalità *eager*) all'atterraggio sulla pagina, mentre le restanti vengono caricate via via che **scorri verso il basso** del documento.

### Il markup HTML

Ecco il markup di un'immagine responsive caricata immediatamente.

```html
<!-- Immagine responsive caricata immediatamente -->
<img
	alt="Image 01"
	src="https://via.placeholder.com/220x280?text=Img+01"
	srcset="
		https://via.placeholder.com/220x280?text=Img+01 220w,
		https://via.placeholder.com/440x560?text=Img+01 440w
	"
	sizes="220px"
/>
```

Per assicurarti che i tuoi utenti vedano le immagini **il prima possibile**, ti consiglio di **caricare immediatamente le immagini in cima** alla pagina web, ovvero solo quelle che si troveranno *sopra la piega (above the fold)* nelle viewport più comuni, considerando smartphone, tablet e computer.

Ricorda sempre che il lazy loading è un'operazione gestita tramite JavaScript, quindi prima che il download di qualsiasi immagine lazy **possa iniziare**, il codice JavaScript deve essere **scaricato, interpretato ed eseguito**, le immagini lazy devono essere **individuate nel DOM** e **la loro posizione valutata**. E tutte queste operazioni richiedono del tempo.

Ed ecco il markup di cui avrai bisogno per caricare un'immagine responsive in modalità *lazy*.

```html
<!-- Immagine responsive caricata in modalità lazy -->
<img
	alt="Image 03"
	class="lazy"
	data-src="https://via.placeholder.com/220x280?text=Img+03"
	data-srcset="https://via.placeholder.com/220x280?text=Img+03 220w,
        https://via.placeholder.com/440x560?text=Img+03 440w"
	data-sizes="220px"
/>
```

Se vuoi che le tue immagini lazy abbiano un'anteprima a bassa risoluzione durante il caricamento, puoi inserire una piccola immagine a bassa qualità nel tag `src` in questo modo:

```html
<!-- Immagine responsive in modalità lazy con anteprima a bassa qualità -->
<img
	alt="Image 03"
	class="lazy"
	src="https://via.placeholder.com/11x14?text=Img+03"
	data-src="https://via.placeholder.com/220x280?text=Img+03"
	data-srcset="https://via.placeholder.com/220x280?text=Img+03 220w,
        https://via.placeholder.com/440x560?text=Img+03 440w"
	data-sizes="220px"
/>
```

Stiamo usando il tag HTML `img` e non il tag `picture`, poiché quest'ultimo non è necessario in questo caso. Approfondirò i casi d'uso del tag `picture` [più in basso](#casi-d-uso-del-tag-picture).

*Ma aspetta, e per quanto riguarda Internet Explorer?*

È vero, Internet Explorer non supporta le immagini responsive, ma dato che è rimasta in circolazione solo la sua ultima versione e sta lentamente scomparendo dai nostri radar (nei siti che gestiamo, la sua quota si aggira intorno al 4%), ti suggerisco di NON utilizzare un polyfill per le immagini responsive, affidandoti invece semplicemente all'immagine specificata nell'attributo `src` (o `data-src`).

### Inclusione dello script

Per caricare le immagini lazy quando entrano nella viewport, hai bisogno di uno script di lazy load come [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload), uno script leggero come l'aria (1,9 kb gzipped), configurabile ed SEO-friendly che sviluppo e miglioro dal 2014. È basato sull'API del browser `IntersectionObserver`, quindi è velocissimo e garantisce uno scorrimento fluido (jank-free) anche sui dispositivi meno potenti.

Ecco il modo più semplice per includere lo script nella tua pagina.

```html
<script src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@11.0.4/dist/lazyload.min.js"></script>
```

Altri modi per includere LazyLoad nelle tue pagine web, ad esempio utilizzando uno script `async` con auto-inizializzazione, usando RequireJS, Webpack o Rollup, sono [documentati qui](https://github.com/verlok/vanilla-lazyload/#include-lazyload-in-your-project).

### Inizializzazione di LazyLoad

Devi fare in modo che LazyLoad gestisca e carichi tutte le immagini con la classe `.lazy` nella pagina. Puoi inizializzare `LazyLoad` in questo modo:

```js
var lazyLoad = new LazyLoad({
	elements_selector: ".lazy",
	// Altre opzioni qui
});
```

### Alcuni trucchi CSS

Ci sono anche alcune funzionalità che puoi ottenere utilizzando esclusivamente i CSS. Devi:

- **Fare in modo che le immagini lazy non ancora caricate occupino dello spazio**. Se non lo fai, tali immagini avranno altezza `0` e collasseranno una accanto all'altra. Di conseguenza, entreranno nella viewport tutte nello stesso momento, vanificando i nostri sforzi per caricarle man mano che compaiono sullo schermo.
- Evitare che le immagini vuote appaiano come interrotte (broken images)
- Risolvere un'anomalia di Firefox che mostra l'icona dell'immagine non trovata durante il caricamento delle immagini

Puoi fare tutto questo usando queste regole CSS:

```css
/*
Fa in modo che il contenitore delle immagini occupi spazio
quando le immagini non sono ancora caricate.
Questo valore dipende dal tuo layout.
*/
.imageList li {
	min-height: 300px;
}

/*
Evita che le immagini vuote appaiano come interrotte
*/
img:not([src]):not([srcset]) {
	visibility: hidden;
}

/*
Risolve l'anomalia di Firefox durante il caricamento delle immagini
*/
@-moz-document url-prefix() {
	img:-moz-loading {
		visibility: hidden;
	}
}
```

## Casi d'uso del tag picture

Finora ho parlato del tag `img` con gli attributi `srcset` e `sizes`, che rappresenta la soluzione per la stragrande maggioranza delle immagini responsive di cui potresti aver bisogno su un sito o un'applicazione web. Ora, in quali casi dovresti usare invece il tag `picture`?

### Proporzioni (width/height ratio) differenti

Caso d'uso: devi mostrare immagini con **proporzioni (aspect ratio) differenti** a seconda di una media query. Ad esempio, vuoi mostrare immagini verticali (*portrait*) sui dispositivi mobili e immagini orizzontali (*landscape*) su viewport più ampie, come tablet e computer.

&rarr; [Dai un'occhiata ai risultati](http://verlok.github.io/vanilla-lazyload/demos/picture_media.html) &larr;

Ecco il codice di cui avrai bisogno in questo caso. Per avere immagini caricate immediatamente, ti basterà usare gli attributi standard `src` e `srcset` senza il prefisso `data-`.

```html
<picture>
	<source
		media="(min-width: 1024px)"
		data-srcset="https://via.placeholder.com/1024x576?text=Horizontal+Image 1x,
      https://via.placeholder.com/2048x1152?text=Horizontal+Image 2x"
	/>
	<source
		media="(max-width: 1023px)"
		data-srcset="https://via.placeholder.com/640x960?text=Vertical+Image 1x,
      https://via.placeholder.com/1280x1920?text=Vertical+Image 2x"
	/>
	<img
		class="lazy"
		alt="Stivaletti"
		data-src="https://via.placeholder.com/1024x576?text=Horizontal+Image"
	/>
</picture>
```

### Passaggio automatico al formato WebP

Caso d'uso: vuoi che le immagini **passino automaticamente al formato WebP** se il browser supporta tale formato.

&rarr; [Dai un'occhiata ai risultati](http://verlok.github.io/vanilla-lazyload/demos/picture_type_webp.html) &larr;

Ecco il codice! Anche in questo caso, per caricare le immagini immediatamente, usa semplicemente gli attributi standard `src`, `srcset` e `sizes` senza il prefisso `data-`.

```html
<picture>
	<source
		type="image/webp"
		data-srcset="https://via.placeholder.com/1024x576?text=WebP+Image 1x,
      https://via.placeholder.com/2048x1152?text=WebP+Image 2x"
		data-sizes="220px"
	/>
	<img
		data-src="https://via.placeholder.com/256.jpg?text=1024x576+Jpg+Image"
		data-srcset="https://via.placeholder.com/1024x576?text=Jpg+Image 1x,
      https://via.placeholder.com/2048x1152?text=Jpg+Image 2x"
		data-sizes="220px"
		alt="An image"
		class="lazy"
	/>
</picture>
```

## *Un'ultima cosa*

Lo script vanilla [LazyLoad](https://github.com/verlok/vanilla-lazyload) sfrutta l'API `IntersectionObserver`, pertanto sui browser che non la supportano (come Internet Explorer e le vecchie versioni di Safari) caricherà tutte le immagini subito al momento dell'esecuzione, portando all'incirca allo stesso risultato che si otterrebbe senza usare alcun lazy loader.

Se vuoi caricare i tuoi contenuti in modalità lazy sul 100% dei browser in circolazione (io non lo farei, ma la scelta spetta a te), devi includere lo script [IntersectionObserver Polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) prima di LazyLoad.

Puoi inserire lo script nella pagina subito prima di quello di LazyLoad, in questo modo...

```html
<script src="https://cdn.jsdelivr.net/npm/intersection-observer@0.5.1/intersection-observer.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@11.0.4/dist/lazyload.min.js"></script>
```

...oppure puoi caricare il polyfill come dipendenza di LazyLoad utilizzando *RequireJS* o un altro caricatore di moduli AMD. [Maggiori informazioni qui](https://github.com/verlok/vanilla-lazyload/blob/master/README.md#include-via-requirejs-without-intersectionobserver-polyfill).

## Conclusioni

Ecco un riassunto dei punti chiave:

1. Non caricare tutte le immagini in modalità lazy, ma solo quelle *below the fold* (sotto la piega)
2. Utilizza il tag `img` per le immagini responsive semplici
3. Utilizza il tag `picture` per servire in modo condizionale la versione WebP delle immagini o per modificarne le proporzioni (aspect ratio)
4. Utilizza [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload/) per caricare le immagini lazy
5. Utilizza opzionalmente il polyfill per IntersectionObserver se vuoi abilitare il lazy loading sul 100% dei browser

Se qualcosa non fosse chiaro o potesse essere migliorato, ti invito a [contattarmi](/contact/) per farmelo sapere.

Se hai trovato utile questo post, non esitare a condividerlo!

### Risorse utili

- [Responsive images in practice](http://alistapart.com/article/responsive-images-in-practice) @ A List Apart (in inglese)
- [Responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) @ Mozilla Developer Network (in inglese)
- [Responsive images in CSS](https://css-tricks.com/responsive-images-css/) @ CSS Tricks (in inglese)
- Sito web del [Responsive images community group](https://responsiveimages.org)

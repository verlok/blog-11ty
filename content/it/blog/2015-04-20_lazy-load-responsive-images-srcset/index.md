---
title: "Caricamento lazy di immagini responsive con srcset e LazyLoad"
description: "Ora è possibile avere il caricamento lazy (lazy loading) sulle immagini responsive per fare in modo che si adattino agli schermi degli utenti e mantenere veloce il nostro sito web. In questo articolo vedremo quale markup dobbiamo scrivere e quali librerie Javascript ci serviranno."
tags:
  - techniques
  - lazy loading
  - images
---

Ora è possibile (sì, oggi stesso!) implementare il **lazy loading** (caricamento pigro) sulle **immagini responsive**, così da far sì che si adattino agli schermi degli utenti *e* mantenere veloce il nostro sito web. Evviva! \o/ In questo articolo vedremo quale markup dobbiamo scrivere e quali librerie JavaScript saranno necessarie per farlo.

## Articolo obsoleto! 👀

**Un momento! Stai leggendo una vecchia versione di questo articolo.**

👉 [Leggi l'**aggiornamento del 2020**](./lazy-load-responsive-images-in-2020-srcset-sizes-picture-webp)

## Lazy responsive... cosa?

Le **immagini responsive** sono una tecnica che permette alle immagini del tuo sito web di adattarsi alla **larghezza della viewport** e alla **densità dello schermo** (1x, 2x - display retina, ecc.). Per capire come fare, puoi leggere [Responsive images in practice](http://alistapart.com/article/responsive-images-in-practice) (in inglese) e puoi trovare ulteriori informazioni sul [sito web del responsive images community group](http://responsiveimages.org/).

Il **lazy loading delle immagini** è una tecnica per velocizzare il sito web **evitando di caricare le immagini** che l'utente potrebbe non vedere mai nella sua viewport, per poi **caricarle solo quando vi fanno ingresso**. Oltre alle prestazioni, questo ti permette anche di risparmiare larghezza di banda (e denaro, se utilizzi un servizio CDN a consumo per le tue immagini).

## Implementazione

[Dai un'occhiata ai risultati](http://verlok.github.io/img_srcset_lazyload) che otterremo combinando queste tecniche.

Se apri il pannello Network dell'inspector del browser, noterai che le prime immagini vengono caricate "normalmente" dal browser al caricamento della pagina, mentre le altre vengono caricate via via che scorri verso il basso del documento.

### Il markup

Ecco il markup di cui avrai bisogno per caricare in modalità lazy un'immagine responsive.

```html
<!-- Immagine caricata normalmente dal browser -->
<img
	srcset="
		img/41494516WM_10r_n_f.jpg 668w,
		img/41494516WM_10_n_f.jpg  334w,
		img/41494516WM_9r_n_f.jpg  446w,
		img/41494516WM_9_n_f.jpg   223w
	"
	sizes="(min-width: 361px) 50vw,
        (min-width: 481px) 33.333vw,
        (min-width: 769px) 25vw,
        (min-width: 1025px) 20vw,
        100vw"
/>

<!-- Immagine caricata in modalità lazy tramite JavaScript -->
<img
	data-srcset="img/41494516WM_10r_n_f.jpg 668w,
        img/41494516WM_10_n_f.jpg 334w,
        img/41494516WM_9r_n_f.jpg 446w,
        img/41494516WM_9_n_f.jpg 223w"
	sizes="(min-width: 361px) 50vw,
        (min-width: 481px) 33.333vw,
        (min-width: 769px) 25vw,
        (min-width: 1025px) 20vw,
        100vw"
/>
```

Nota che stiamo usando il tag HTML `img` e **non** `picture`. Quest'ultimo non è necessario perché in questo caso non stiamo modificando le proporzioni (ratio) dell'immagine.

### Inclusione degli script

Prima di tutto, abbiamo bisogno di una libreria per caricare le immagini lazy quando entrano nella viewport. Esistono diverse librerie per il caricamento lazy delle immagini, ma per avere il lazy loading di immagini *responsive* avrai bisogno di quella che ho scritto io: [LazyLoad](http://verlok.github.io/vanilla-lazyload/) (leggi tutti i suoi vantaggi [qui](./a-new-lazyload-to-improve-your-website-performance)).

Inoltre, poiché non tutti i browser supportano le immagini responsive, dobbiamo includere la libreria [picturefill](https://github.com/scottjehl/picturefill) di Filament Group, un polyfill che ci permette di colmare questa lacuna e far funzionare le immagini responsive su tutti i browser. Nota che questa libreria non sarà più necessaria quando tutti i browser che devi supportare offriranno il supporto nativo alle immagini responsive.

Quindi includeremo questi 2 script:

```html
<script src="js/vendor/lazyload.min.js"></script>
<script src="js/vendor/picturefill.min.js"></script>
```

### Inizializzazione dello script

Quello che dobbiamo fare è creare una nuova istanza di `LazyLoad` per trasformare l'attributo `data-srcset` in un vero e proprio attributo `srcset`. Questo sarebbe sufficiente per i browser che supportano nativamente le *immagini responsive* ma, per gli altri, dobbiamo chiamare `picturefill` subito dopo che `LazyLoad` ha modificato il DOM.

Possiamo fare tutto ciò con questo comando:

```js
/*var myLazyLoad = */ new LazyLoad({
	data_src: "src",
	data_srcset: "srcset",
	show_while_loading: true, // ideale per JPEG progressivi
	callback_set: function (img) {
		picturefill({
			elements: [img],
		});
	},
});
```

Per ulteriori riferimenti su ciò che abbiamo fatto qui, consulta la [documentazione di LazyLoad](http://verlok.github.io/vanilla-lazyload/).

### Il foglio di stile

Ci sono anche alcune funzionalità che possono essere ottenute solo tramite CSS. Dobbiamo:

- Fare in modo che le immagini vuote occupino un certo spazio. Se non lo facciamo, tutte le immagini vuote collasseranno una sull'altra ed entreranno nella viewport contemporaneamente, vanificando i nostri sforzi di caricarle in modo lazy.
- Evitare che le immagini vuote appaiano come immagini non trovate (broken)
- (se abbiamo usato l'opzione `show_while_loading`, come nel nostro caso) Risolvere un'anomalia di Firefox che mostra l'icona dell'immagine interrotta durante il caricamento delle immagini

Possiamo fare tutto questo usando queste regole CSS:

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
Evita che le immagini vuote appaiano come interrotte (broken)
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

## Tutto qui!

È stato molto facile, vero? Se non l'hai ancora fatto, [dai un'occhiata alla demo](http://verlok.github.io/img_srcset_lazyload) di ciò che abbiamo realizzato.

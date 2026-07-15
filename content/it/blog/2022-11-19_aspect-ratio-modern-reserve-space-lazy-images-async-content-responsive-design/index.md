---
title: "aspect-ratio: Un modo moderno per riservare spazio a immagini e contenuti asincroni nel responsive design"
description: "Per evitare lo spostamento del layout (layout shifting) e ottimizzare la metrica Web Vital Cumulative Layout Shift (CLS) nelle tue pagine web, è necessario riservare spazio per qualsiasi contenuto che potrebbe essere renderizzato in un secondo momento. Questo è il caso di immagini, video e qualsiasi contenuto caricato in modo asincrono (ad esempio con chiamate AJAX). Ecco un nuovo modo per farlo."
tags:
  - techniques
  - aspect-ratio
  - responsive design
  - responsive images
  - images
  - cumulative layout shift
  - core web vitals
---

Per evitare lo **spostamento del layout** (layout shifting) e ottimizzare la metrica [Cumulative Layout Shift](https://web.dev/cls/) delle [Core Web Vitals](https://web.dev/vitals/) nelle tue pagine web, devi riservare spazio per qualsiasi **contenuto che potrebbe essere renderizzato in un secondo momento**. Questo è il caso di immagini, video e qualsiasi contenuto caricato in modo asincrono (ad esempio tramite chiamate AJAX). Ecco un nuovo modo per farlo.

{% image "aspect-ratio.png", "Diversi rapporti d'aspetto rappresentati in quadrati e rettangoli. 1/1, 4/3, 16/9, 2/3", [648, 1296], "648px" %}

## Il buon vecchio metodo

Il metodo tradizionale per riservare spazio alle immagini consiste nell'utilizzare il trucco del padding verticale (padding-bottom hack).

```html
<div class="image-wrapper">
	<img alt="An image" src="image.jpg" />
</div>
```

```css
.image-wrapper {
	width: 100%;
	height: 0;
	padding-bottom: 150%;
	/* 👆 image height / width * 100% */
	position: relative;
}
.image {
	width: 100%;
	height: auto;
	position: absolute;
}
```

## Il metodo moderno 1 - `aspect-ratio` mappato

Il metodo moderno e più semplice consiste nel definire implicitamente un rapporto d'aspetto larghezza/altezza [impostando gli attributi width e height su immagini e video](https://twitter.com/addyosmani/status/1276779799198007301). Questo approccio è noto come "mapped aspect-ratio".

```html
<img alt="An image" src="image.jpg" width="200" height="300" />

<video alt="A video" src="video.mp4" width="1600" height="900">...</video>
```

```css
/* Modern browser stylesheets will add a default
  aspect ratio based on the element's existing
  width and height attributes */
img,
video {
	aspect-ratio: attr(width) / attr(height);
}
```

La buona notizia è che sia i browser basati su Chromium (Chrome, Microsoft Edge e Opera), sia Firefox e Safari (a partire dalla versione 14) ora supportano l'`aspect-ratio` mappato! Di conseguenza, la stragrande maggioranza dei browser è coperta, mentre Internet Explorer sta scomparendo e Microsoft Edge si sta diffondendo.

Tuttavia, ci sono alcune accortezze da considerare quando si utilizza il lazy loading gestito da JavaScript.

### Demo

Ho creato una serie di demo su Codepen per testare l'`aspect-ratio` mappato in diversi scenari.

| Caso d'uso | Funziona? | Demo |
| ------------------------------------------------------------- | ------ | --------------------------------------------- |
| Lazy loading nativo (nessun placeholder richiesto) | 🟢 Sì | [Demo](https://codepen.io/verlok/pen/ExPwzGO) |
| Lazy loading Javascript (nessun placeholder, senza fix `display`) | 🔴 No | [Demo](https://codepen.io/verlok/pen/bGEYyZe) |
| Lazy loading Javascript (nessun placeholder, con fix `display`) | 🟢 Sì | [Demo](https://codepen.io/verlok/pen/RwKeoBX) |
| Lazy loading Javascript (placeholder SVG, senza fix `display`) | 🟢 Sì | [Demo](https://codepen.io/verlok/pen/zYNmoxz) |

Con "fix `display`" intendo che ho dovuto impostare la proprietà `display` delle immagini su `block`, poiché lasciare il valore predefinito (`inline-block`) non funzionava correttamente per le immagini caricate in lazy loading tramite JavaScript.

Con "Funziona?" intendo se il browser ha riservato lo spazio per le immagini prima del loro effettivo caricamento.
Per verificare tu stesso il funzionamento, usa i developer tools del tuo browser per disabilitare la cache ed emulare una velocità di rete "slow 3G".
Dovresti notare che lo spazio viene riservato _prima_ che le immagini inizino a caricarsi, posizionando il paragrafo di testo molto al di sotto delle immagini.

## Il metodo moderno 2 - `aspect-ratio` esplicito

In alternativa, è possibile impostare esplicitamente il rapporto d'aspetto direttamente nel codice CSS utilizzando [la regola CSS aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio).

```html
<div class="async">Content is loading...</div>
```

```css
.async {
	aspect-ratio: 16/9;
}
```

~~Sfortunatamente, al momento (aprile 2021) questa funzionalità è supportata solo dai browser Chromium. Non sappiamo ancora se e quando sarà supportata nelle future versioni di Safari.~~

**Aggiornamento di novembre 2021:** questa proprietà è ora [supportata](https://caniuse.com/mdn-css_properties_aspect-ratio) da tutte le ultime versioni di tutti i browser (tranne Internet Explorer, ma... vabbè).

## Conclusione

Evviva! Oggi è finalmente possibile utilizzare l'`aspect-ratio` mappato per riservare lo spazio ai tuoi contenuti caricati in lazy loading, come immagini e video!

Basta impostare gli attributi `width` e `height` sulle immagini e scegliere una delle seguenti tre modalità:

1. Usare il lazy loading nativo con `loading="lazy"`
2. Usare il lazy loading JavaScript senza placeholder, ma applicando `display: block` alle immagini
3. Usare il lazy loading JavaScript con i placeholder

Non vedo l'ora di sapere come sei riuscito a ridurre il [CLS](https://web.dev/cls) delle tue pagine usando queste tecniche.
Per favore [contattami](/contact/) e fammi sapere!

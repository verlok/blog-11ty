---
title: "Come limitare la fedeltà delle immagini a 2x e risparmiare il 45% del peso sui telefoni cellulari di fascia alta"
description: "Con la diffusione di schermi ad altissima densità “super retina” nei dispositivi di fascia alta più recenti, limitare la fedeltà delle immagini a 2x porta a un notevole miglioramento nei tempi di rendering, senza alcuna perdita di qualità percepibile per gli utenti. Ecco una nuova best practice su come fare."
tags:
  - techniques
  - web performance
  - images
layout: layouts/post.njk
---

{% image "capping-image-fidelity.jpg", "Limitare la fedeltà delle immagini a 2x", [648, 1296], "648px" %}

Con la diffusione di schermi ad altissima densità “super retina” nei dispositivi di fascia alta più recenti, limitare la fedeltà delle immagini a 2x porta a un notevole miglioramento nei tempi di rendering, senza alcuna perdita di qualità percepibile per gli utenti. Ecco una nuova best practice su come fare.

## Immagini e densità degli schermi

Nel giugno 2010, Apple ha introdotto il primo display Retina sull'iPhone 4. "Retina" è solo un nome commerciale per descrivere uno schermo HiDPI, che ha il doppio dei pixel in orizzontale e in verticale (2x).

Gli schermi HiDPI sono perfetti per il rendering di vettori come font e immagini SVG, ma quando si tratta di immagini bitmap, se non forniamo un'immagine specifica per display HiDPI, la nostra immagine standard viene allungata (ingrandita) per coprire tutti i pixel aggiuntivi. E le immagini allungate non hanno un bell'aspetto.

Così, la prima cosa che abbiamo iniziato a fare è stata fornire sia un'immagine standard sia un'immagine ottimizzata per gli schermi Retina, utilizzando l'attributo `srcset` e il descrittore `x`. In questo modo:

```html
<img
	src="batman_1x.jpg"
	srcset="batman_1x.jpg 1x, batman_2x.jpg 2x"
	alt="Batman, Super-man and Wonder Woman"
	width="1280"
	height="720"
/>
```

Quel descrittore `x` nell'attributo `srcset` serve ad associare le sorgenti alle densità dello schermo. `1x` significa "questa è l'immagine per schermi normali", `2x` significa "questa è l'immagine per display HiDPI / Retina". A seconda dello schermo del dispositivo, i browser sceglieranno la sorgente corrispondente.

## Immagini responsive

Quella delle [immagini responsive](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) è una specifica HTML che ci consente di servire la dimensione corretta dell'immagine agli utenti, a seconda dello spazio che l'immagine occupa sul loro schermo e tenendo conto del pixel ratio del dispositivo.

Il modo più semplice per scrivere il codice per le immagini responsive è elencare tutte le dimensioni d'immagine disponibili in un attributo `srcset`, utilizzando il descrittore `w`, e indicare al browser quanto è grande la nostra immagine tramite l'attributo `sizes`. I browser faranno i calcoli e scaricheranno l'immagine più appropriata.

```html
<img
	src="batman_1280w.jpg"
	srcset="batman_1280w.jpg 1280w, batman_1024w.jpg 1024w, batman_768w.jpg 768w"
	alt="Batman, Super-man and Wonder Woman"
	sizes="100vw"
/>
```

Inoltre, se la dimensione delle immagini cambia a seconda delle media query, possiamo aggiungere le stesse media query nell'attributo `sizes`.

```html
<img
	src="batman_1280w.jpg"
	srcset="
		batman_1440w.jpg 1440w,
		batman_1280w.jpg 1280w,
		batman_1024w.jpg 1024w,
		batman_768w.jpg   768w
	"
	alt="Batman, Super-man and Wonder Woman"
	sizes="(min-width: 640px) 50vw, 100vw"
/>
```

Se ti senti confuso, ti consiglio di leggere [Srcset and Sizes di Eric Portis](https://ericportis.com/posts/2014/srcset-sizes/). Quell'articolo mi ha illuminato la strada quando ho iniziato a sperimentare con le immagini responsive.

## Dispositivi con schermi 3x

Al momento della scrittura di questo articolo, ci sono diversi dispositivi di fascia alta, sia di Apple che di Google, che montano uno schermo HiDPI con una densità di pixel pari a 3x o superiore. Apple li chiama display Super Retina, Google li chiama display FHD+.

<figure>
	{% image "devices-with-super-hidpi-display.jpg", "Apple iPhone 12 Mini, Apple iPhone X, Apple iPhone XS, Apple iPhone 11 Pro, Google Pixel 3, Google Pixel 4, Google Pixel 5, Apple iPhone 12, Apple iPhone 12 Pro", [648, 1296], "648px" %}
  <figcaption>Dispositivi con display super HiDPI</figcaption>
</figure>

Apple ha lanciato il suo primo display Super Retina con l'iPhone X; lo stesso tipo di display è montato su iPhone XS / Max, iPhone 11 Pro / 11 Pro Max e su tutti i telefoni della linea iPhone 12, compreso il 12 Mini.

I telefoni Google Pixel hanno display FHD+ con densità di pixel 3x, e display QHD+ con una densità di 3.5x sul Pixel 4 XL.

## Limitare la fedeltà delle immagini

Secondo l'analisi effettuata su una [modifica all'app mobile di Twitter](https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html), limitare la fedeltà dell'immagine a 2x porta a un notevole miglioramento dei tempi di rendering e a nessuna perdita di qualità percepibile dagli utenti.

> Le immagini nelle timeline sui dispositivi a risoluzione ultra-elevata ora si caricano circa il 33% più velocemente consumando un terzo di dati in meno, e senza alcuna variazione visibile della qualità.

Il problema con la gestione delle immagini responsive tramite il tag `img`, come abbiamo visto sopra, è che non c'è modo di impedire ai browser di scaricare l'immagine 3x. Il motivo è che per determinar quale immagine scaricare dallo `srcset`, effettuano questo calcolo:

```
larghezza dell'immagine sullo schermo × densità di pixel del dispositivo = larghezza dell'immagine da scaricare
```

Ad esempio, se un'immagine deve essere visualizzata con una larghezza di `300px` su un iPhone 12, i browser eseguiranno il seguente calcolo:

```
300 × 3 = 900
```

E scaricherebbero l'immagine larga 900 pixel. Quello che vogliamo fare noi è limitare la fedeltà a 2x in modo che scarichi invece l'immagine larga 600 pixel.

L'unico modo per farlo sul web è utilizzare il tag `picture` in questo modo:

```html
<picture>
	<!-- Tablet in modalità landscape / computer -->
	<source
		media="(min-width: ####px)"
		srcset="batman_###w.jpg 1x, batman_###w.jpg 2x"
	/>
	<!-- Tablet in modalità portrait / smartphone in modalità landscape -->
	<source media="(min-width: ###px)" srcset="batman_###w.jpg 2x" />
	<!-- Smartphone più grandi -->
	<source media="(min-width: ###px)" srcset="batman_###w.jpg 2x" />
	<!-- Smartphone più piccoli -->
	<img
		src="batman_###w.jpg"
		srcset="batman_###w.jpg 2x"
		alt="Batman Super-man e Wonder"
	/>
</picture>
```

Nota: ho sostituito i numeri reali con un segnaposto `###` perché quei valori non sono rilevanti per questa spiegazione.

Nota che:

- nelle media query degli smartphone descriviamo solo l'immagine `2x`, poiché oggi tutti gli smartphone montano un display retina
- nelle media query per tablet in modalità landscape (orizzontale) e computer, dovremmo descrivere sia le immagini `1x` sia quelle `2x`.
- l'attributo `src` sul tag `img` è obbligatorio, ma verrà utilizzato solo dai browser legacy, incluso IE 11

## Ridurre opzionalmente la complessità sulle media query di tablet e computer

Se il tuo layout richiede più di una media query per tablet e computer, dovresti considerare l'uso dell'attributo `srcset` con il descrittore `w` e l'attributo `sizes`, ottenendo questo:

```html
<picture>
	<!-- Tablet in modalità landscape / computer -->
	<source
		media="(min-width: ###px) "
		sizes="(min-width: ###px) 33vw, 50vw"
		srcset="
            batman_####w.jpg ####w,
            batman_####w.jpg ####w,
            batman_###w.jpg   ###w
        "
	/>
	<!-- Tablet in modalità portrait / smartphone in modalità landscape -->
	<source media="(min-width: ###px)" srcset="batman_###w.jpg 2x" />
	<!-- Smartphone più grandi -->
	<source media="(min-width: ###px)" srcset="batman_###w.jpg 2x" />
	<!-- Smartphone più piccoli -->
	<img
		src="batman_###w.jpg"
		srcset="batman_###w.jpg 2x"
		alt="Batman Super-man e Wonder"
	/>
</picture>
```

In questo modo, a partire dalla media query per tablet landscape e computer, non avrai bisogno di aggiungere altri tag `source`, poiché non c'è necessità di limitare la qualità dell'immagine sui computer. Il tag `source` più in alto si occuperà di tutto.

## “È un sacco di markup per una sola immagine”, dirai?

Se utilizzi immagini responsive, probabilmente hai già tag `img` di dimensioni considerevoli, ognuno dei quali elenca un set di URL di immagini nell'attributo `srcset` e un set di media query e dimensioni nell'attributo `sizes`. Il codice mostrato sopra può essere leggermente più esteso, ma non in modo significativo.

Detto questo, strumenti come GZip e Brotli — che funzionano nativamente nella maggior parte dei server applicativi e delle CDN — svolgono un lavoro eccellente nel comprimere i caratteri ripetuti nel markup, e ci sono molti caratteri ripetuti in questi tag di immagine.

Ho fatto un test e ho scoperto che un file HTML contenente 54 immagini pesa 37 kb non compresso, ma solo 530 byte una volta compresso con GZip. Se si confronta questo dato con un **risparmio del 45% sui dati** per le immagini scaricate, si tratta sicuramente di un ottimo compromesso.

## Risultato: immagini più leggere del 45%

L'utilizzo di questa tecnica sulla pagina dell'elenco dei prodotti di uno dei siti che gestiamo ha portato a una **riduzione del peso delle immagini del 45%**. Il peso delle immagini su un iPhone 11 Pro era di 1.7 MB prima ed è di soli 949 kB dopo la limitazione.

<figure>
	{% image "image-weight-reduction.jpg", "Nome w476.jpg, Dimensione 185kb vs Nome w360jpg, Dimensione 102kb, ecc.", [648, 1296], "648px" %}
  <figcaption>Peso delle immagini prima (a sinistra) e dopo la limitazione (a destra)</figcaption>
</figure>

<div class="videoWrapper">
    <iframe loading="lazy" width="560" height="315" src="https://www.youtube.com/embed/c2frAgQ_8lQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Demo

Ho creato una [repository su GitHub](https://github.com/verlok/cap-image-fidelity-to-2x) e un [Codepen](https://codepen.io/verlok/pen/wvWRgEG). Sentiti libero di provarli e di farne un fork.

Singola immagine con fedeltà limitata a 2x:

- [repository su GitHub](https://github.com/verlok/cap-image-fidelity-to-2x)
- [Live qui](https://verlok.github.io/cap-image-fidelity-to-2x/)
- [Codepen](https://codepen.io/verlok/pen/wvWRgEG)

O prova [la pagina mostrata nel video sopra](https://faulty-driving.surge.sh/).

🌟 [Apri la demo live](https://verlok.github.io/cap-image-fidelity-to-2x/) 💻

## Psst! Puoi ancora caricare le immagini in modalità lazy

Una delle migliori pratiche per ridurre al minimo il [Largest Contentful Paint (LCP)](https://web.dev/lcp/) del tuo sito consiste nel caricare immediatamente (eager) le immagini above-the-fold e in modalità lazy quelle below-the-fold. Puoi farlo utilizzando `data-src`, `data-srcset`, `data-sizes` al posto di `src`, `srcset`, `sizes` sia nei tag `img` sia in quelli `source`.

```html
<picture>
	<!-- Tablet in modalità landscape / computer -->
	<source
		media="(min-width: ###px) "
		data-sizes="(min-width: ###px) 33vw, 50vw"
		data-srcset="
            batman_####w.jpg ####w,
            batman_####w.jpg ####w,
            batman_###w.jpg   ###w
        "
	/>
	<!-- Tablet in modalità portrait / smartphone in modalità landscape -->
	<source media="(min-width: ###px)" data-srcset="batman_###w.jpg 2x" />
	<!-- Smartphone più grandi -->
	<source media="(min-width: ###px)" data-srcset="batman_###w.jpg 2x" />
	<!-- Smartphone più piccoli -->
	<img
		data-src="batman_###w.jpg"
		data-srcset="batman_###w.jpg 2x"
		alt="Batman Super-man e Wonder"
	/>
</picture>
```

Maggiori informazioni sul [lazy loading delle immagini responsive nel 2020](./lazy-load-responsive-images-in-2020-srcset-sizes-picture-webp).

## Per concludere

Nel web design con immagini responsive, limitare la fedeltà delle immagini su dispositivi super HiDPI è una best practice relativamente nuova, dovuta al numero sempre crescente di smartphone dotati di schermi super HiDPI.

Limitare la fedeltà dell'immagine migliorerà la velocità di rendering del tuo sito, l'esperienza dei tuoi utenti e la metrica [Largest Contentful Paint](https://web.dev/lcp/) delle tue pagine.

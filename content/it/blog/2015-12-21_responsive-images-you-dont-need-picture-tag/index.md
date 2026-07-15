---
title: "Immagini responsive? Il tag picture non serve"
description: "Supponiamo di avere un layout di sito web responsive in cui le immagini sono dimensionate al 100% del loro contenitore, ma il contenitore non è sempre largo quanto la viewport. Dobbiamo usare il tag picture o il tag img è sufficiente?"
tags:
  - responsive images
  - images
  - techniques
---

Supponiamo di avere un layout di sito web responsive in cui le immagini sono dimensionate al 100% del loro contenitore, ma **il contenitore non è sempre largo quanto la viewport**. Dobbiamo per forza usare il tag `picture` o il tag `img` è sufficiente? **Il tag `img` è in grado di farlo da solo**, utilizzando i suoi attributi `sizes` e `srcset`. Ecco come.

## Il layout delle immagini

Le immagini nel layout hanno le seguenti larghezze:

| Larghezza Viewport | Larghezza immagini | Larghezza contenitore |
| ----------------------- | ---------------- | -------------------------- |
| Da 0 a 767 px | 1/2 del contenitore | 100% senza padding |
| Da 768 px a 1023 px | 1/3 del contenitore | 100% con 30 px di padding |
| Da 1024 px a 1279 px | 1/4 del contenitore | 100% con 30 px di padding |
| Da 1280 px in su | 1/4 del contenitore | 1280 px con 30 px di padding |

## Unità utilizzabili nell'attributo `sizes`

Quando usi il tag `img`, nell'attributo `sizes` puoi specificare quanto larghe mostrare le tue immagini in base alle diverse media query. E puoi farlo non solo usando l'unità di misura della larghezza della viewport (`vw`), come spesso si legge in giro, ma **utilizzando qualsiasi valore di lunghezza** e anche la funzione CSS **`calc()`**, utilissima quando si ha a che fare con padding o con la proprietà `max-width` del contenitore.

| Larghezza Viewport | Larghezza immagini | Larghezza contenitore | Larghezza immagine in CSS |
| ----------------------- | ---------------- | -------------------------- | ----------------------------- |
| Da 0 a 767 px | 1/2 del contenitore | 100% senza padding | `50vw` |
| Da 768 px a 1023 px | 1/3 del contenitore | 100% con 30 px di padding | `calc(( 100vw - 60 px ) / 3)` |
| Da 1024 px a 1279 px | 1/4 del contenitore | 100% con 30 px di padding | `calc(( 100vw - 60 px ) / 4)` |
| Da 1280 px in su | 1/4 del contenitore | 1280 px con 30 px di padding | `305 px` |

Vedi [questa pen su CodePen](https://codepen.io/verlok/pen/JGXeyz?editors=110) che utilizza le media query e i CSS per specificare le larghezze di `img`, e [quest'altra pen](https://codepen.io/verlok/pen/adNQqX?editors=110) che specifica l'attributo `sizes` direttamente all'interno del tag `img`.

> Ti senti confuso? Se hai bisogno di una spiegazione più approfondita, leggi l'articolo [srcset and sizes](https://ericportis.com/posts/2014/srcset-sizes/) di Eric Portis (in inglese), a mio parere il miglior articolo in assoluto sull'uso di `img` con `srcset` e `sizes`.

## Calcolo delle dimensioni delle immagini ottimizzate in base a spaziatura, dispositivo e orientamento

Se vogliamo che le nostre immagini siano ottimizzate per le risoluzioni più comuni, dobbiamo:

1. Definire quali sono le risoluzioni e le densità di schermo più diffuse
2. Decidere per quali risoluzioni/densità vogliamo ottimizzare
3. Calcolare quali saranno le dimensioni delle immagini a queste risoluzioni/densità
4. Ridimensionare le nostre immagini a quelle specifiche dimensioni
5. Scrivere il markup delle `img` nel codice HTML:
    1. Elencare tutte le dimensioni delle immagini nell'attributo `srcset`, utilizzando il descrittore `w`
    2. Elencare tutte le larghezze delle immagini nell'attributo `sizes`, come definito nella tabella precedente

Per individuare le risoluzioni dello schermo e decidere quali ottimizzare, puoi utilizzare qualsiasi strumento come Google Analytics per raccogliere informazioni sui tuoi utenti e sui dispositivi che utilizzano maggiormente.

Dopo alcuni [calcoli](https://docs.google.com/spreadsheets/d/1BCeWGXOevUHlL8l9ti2i81C9BgSsHtybO9Z9WAYpfnQ/edit), le dimensioni delle immagini ottenute sono state le seguenti:

| Dispositivo e orientamento | Largh. schermo | Largh. img (css px) | Altez. img (css px) | Densità schermo | Largh. img (px) | Altez. img (px) |
| ----------------------- | ------------ | ------------------ | ------------------- | -------------- | -------------- | --------------- |
| iPhone 4/5/5s | 320 | 160 | 186 | 2 | **320** | **372** |
| iPhone 6 | 375 | 187 | 217 | 2 | **374** | **435** |
| iPhone 5/5s in orizzontale | 568 | 284 | 330 | 2 | **568** | **660** |
| iPhone 6 in orizzontale | 667 | 333 | 387 | 2 | **666** | **774** |
| iPad / mini | 768 | 236 | 274 | 2 | **472** | **549** |
| iPad / mini in orizzontale | 1024 | 241 | 280 | 2 | **482** | **560** |
| PC con larghezza da 1280px in su | 1280 | 305 | 355 | 1 | **305** | **355** |
| PC con larghezza 1280px e HiDPI | 1280 | 305 | 355 | 2 | **610** | **709** |
| PC con larghezza superiore a 1280px | 1920 | 305 | 355 | 1 | **305** | **355** |

## Passiamo al codice!

Il codice del proof of concept (POC) che ho creato si trova su GitHub in [questo repository](https://www.github.com/verlok/responsiveImagesTagsCompared), mentre la [demo live è disponibile qui](http://verlok.github.io/responsiveImagesTagsCompared).

### Markup con il tag picture

```html
<picture>
	<source media="(max-width: 320px)" srcset="http://placehold.it/320x372 2x" />
	<source media="(max-width: 375px)" srcset="http://placehold.it/374x435 2x" />
	<source media="(max-width: 568px)" srcset="http://placehold.it/568x660 2x" />
	<source media="(max-width: 667px)" srcset="http://placehold.it/666x774 2x" />
	<source media="(max-width: 768px)" srcset="http://placehold.it/472x549 2x" />
	<source
		media="(max-width: 1024px)"
		srcset="http://placehold.it/241x280 1x, http://placehold.it/482x560 2x"
	/>
	<source
		media="(min-width: 1280px)"
		srcset="http://placehold.it/305x355 1x, http://placehold.it/610x709 2x"
	/>
	<img src="http://placehold.it/305x355" alt="Immagine di un prodotto" />
</picture>
```

### Markup con il tag img

```html
<img
	src="http://placehold.it/305x355"
	srcset="
		http://placehold.it/241x280 241w,
		http://placehold.it/305x355 305w,
		http://placehold.it/320x372 320w,
		http://placehold.it/374x435 374w,
		http://placehold.it/472x549 472w,
		http://placehold.it/482x560 482w,
		http://placehold.it/568x660 578w,
		http://placehold.it/610x709 610w,
		http://placehold.it/666x774 666w
	"
	sizes="(min-width: 1280px) 305px,
            (min-width: 1024px) calc((100vw - 60px) / 4),
            (min-width: 768px) calc((100vw - 60px) / 3),
            50vw"
	alt="Immagine di un prodotto"
/>
```

## Conclusione

- Il markup con `picture` risulta essere molto più verboso, e non stiamo ancora supportando i display a densità singola sotto i 768px.
- Il markup con `img` è più breve, meno ripetitivo e lascia che sia il browser a calcolare quale sia l'immagine migliore da caricare in base alla risoluzione E alla densità di pixel.

**Non hai bisogno del tag `picture`.**

Il motivo è che utilizzando il tag `img` dovrai scrivere **molto meno codice** per supportare **molti più dispositivi e densità di schermo**. Grazie alla possibilità di utilizzare la funzione CSS `calc()` all'interno dell'attributo `sizes`, possiamo effettuare calcoli complessi per stabilire l'immagine corretta da caricare anche in layout elaborati.

Nota bene: i tag `picture` e `img` sono paragonabili solo quando tutte le immagini mantengono le **stesse proporzioni (aspect ratio) su tutte le media query**. Se le proporzioni dell'immagine devono cambiare per adattarsi a quelle del dispositivo, il tag `picture` rimane l'unica strada percorribile.

Ciao!

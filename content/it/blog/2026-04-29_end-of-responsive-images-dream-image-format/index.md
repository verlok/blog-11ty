---
title: "Il mio sogno di un formato d'immagine contenitore: un appello alla web community"
description: "Un singolo file d'immagine contenente ogni risoluzione potrebbe finalmente rendere il tag `<img>` di nuovo semplice. Un appello alla web community per creare un formato d'immagine contenitore."
date: 2026-04-29
tags:
  - responsive images
  - images
  - web performance
  - lazy loading
layout: layouts/post.njk
image: ./cover.png
image_alt: "Rappresentazione grafica di un formato d'immagine contenitore che raggruppa più dimensioni."
---

Qualche giorno fa, [Mat Marquis](https://piccalil.li/author/mat-marquis/) ha scritto un ottimo articolo sulla [fine delle immagini responsive](https://piccalil.li/blog/the-end-of-responsive-images/#the-beginning-and-the-end), spiegando come l'attributo `sizes="auto"`, ormai ampiamente supportato, consenta ai browser di calcolare autonomamente le dimensioni di rendering delle immagini caricate in modalità lazy, eliminando la necessità di creare manualmente l'attributo `sizes` per la maggior parte delle immagini.

Leggerlo ha risvegliato un sogno che porto con me da anni: un formato di immagine che ci permetterebbe di scrivere un tag `<img>` radicalmente più semplice — persino più semplice di quanto consenta `sizes="auto"`. Ci arriverò più in basso. Ma prima, un rapido riassunto del pezzo di Andy per il contesto.

<figure>
	{% image "cover.png", "A sinistra, il testo 'The dream of a container image format'. A destra, una rappresentazione grafica di un'immagine contenitore con estensione '.img' che raggruppa al suo interno diverse dimensioni dell'immagine.", [648, 1296], "648px", true %}
	<figcaption>Un formato di immagine ideale: un solo file, tutte le dimensioni necessarie.</figcaption>
</figure>

## Il TL;DR di Andy

Per le immagini caricate in modalità lazy (la maggior parte delle immagini su una pagina), possiamo abbandonare la scrittura manuale di `sizes` e lasciare che sia il browser a fare il lavoro:

```html
<img
  loading="lazy"
  sizes="auto"
  srcset="
    shirt_300w.jpg   300w,
    shirt_600w.jpg   600w,
    shirt_1200w.jpg 1200w,
    shirt_2400w.jpg 2400w
  "
  alt="A shirt"
/>
```

Per le immagini "hero" — quelle above the fold, candidate a diventare LCP della pagina — dobbiamo ancora essere meticolosi con il dimensionamento preventivo tramite `sizes`:

```html
<img
  loading="eager"
  srcset="
    shirt_300w.jpg   300w,
    shirt_600w.jpg   600w,
    shirt_1200w.jpg 1200w,
    shirt_2400w.jpg 2400w
  "
  sizes="(min-width: 1200px) 100vw,
         (min-width: 600px) 600px,
         300px"
  alt="A shirt"
/>
```

Quindi `sizes` può per lo più sparire. Ma ci rimane comunque quel lungo `srcset` che elenca ogni variante. Ed è qui che ritorna il mio vecchio sogno.

## Ho un sogno

Da anni sogno un formato di immagine contenitore — un singolo file che contenga al suo interno ogni risoluzione di un'immagine. Immaginatelo come una cartella di immagini compressa, confezionata come un unico file.

Con un formato simile, il tag `<img>`, almeno per le immagini lazy, potrebbe essere drasticamente semplificato. Qualcosa del genere:

```html
<img srcset="shirt.imgc *w" sizes="auto" loading="lazy" alt="A shirt" />
```

Niente più `srcset` complessi con elenchi di larghezze separati da virgole. Il browser aprirebbe il file, vedrebbe quali risoluzioni sono disponibili all'interno e scaricherebbe solo i byte necessari per la dimensione che deve renderizzare.

Il tag `<img>`, finalmente di nuovo semplice.

## Un appello alla community

L'articolo di Andy dimostra che la piattaforma può assorbire gran parte della complessità che ci portiamo dietro nel nostro markup. Mi piacerebbe vederci andare ancora oltre.

A chi si occupa di standard web, agli autori dei formati di immagine e agli ingegneri dei browser che stanno leggendo: un formato di immagine contenitore è qualcosa che potremmo effettivamente realizzare? Le richieste HTTP range consentono già ai browser di recuperare segmenti di file. I formati contenitore esistono già in altri ambiti. I mattoni fondamentali sono tutti lì.

Custodisco questo sogno da molto tempo. Potremmo finalmente renderlo realtà?

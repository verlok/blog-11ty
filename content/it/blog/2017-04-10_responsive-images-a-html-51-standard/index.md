---
title: "Immagini responsive, uno standard HTML 5.1"
description: "È ufficiale. Le immagini responsive sono una raccomandazione W3C da novembre 2016, con il nuovissimo tag picture e nuovi attributi per il tag img: srcset e sizes"

tags:
  - responsive images
  - images
  - web performance
  - techniques
---

È ufficiale. Le immagini responsive sono una [raccomandazione W3C](https://www.w3.org/TR/html51/) da novembre 2016, caratterizzate dal nuovissimo tag `picture` e dai nuovi attributi per il tag `img`: `srcset` e `sizes`.

## Perché le immagini responsive?

Nel 2010, Ethan Marcotte ha iniziato a parlare di [responsive web design](https://alistapart.com/article/responsive-web-design), un approccio al web design volto a consentire la visualizzazione delle pagine web in modo ottimale in base alle dimensioni della viewport del browser.

È stato qualcosa di rivoluzionario, ma all'improvviso noi sviluppatori ci siamo trovati di fronte a un nuovo problema: in un sito web responsive, **quanto grandi dovrebbero essere i file delle immagini**?

L'approccio iniziale consisteva nell'utilizzare un'unica immagine di grandi dimensioni per tutte le larghezze di viewport, in modo che le immagini apparissero eccellenti sugli schermi grandi anche se venivano rimpicciolite sui dispositivi più piccoli. Ben presto, però, questa si è rivelata una cattiva pratica: le *connessioni più lente* sui dispositivi mobili e le *CPU meno performanti* rallentavano il sito web, peggiorando l'esperienza dell'utente.

Gli sviluppatori hanno quindi iniziato a utilizzare JavaScript per *scegliere la dimensione corretta dell'immagine* in base alla viewport. È stato in quel periodo che sono nati script come [picturefill](https://github.com/scottjehl/picturefill).

Il fatto è che JavaScript è più lento del puro HTML: deve essere scaricato, interpretato (parsed) ed eseguito prima ancora che il browser possa iniziare a scaricare le immagini. Il web aveva bisogno di qualcosa di nativo per tornare a definire le immagini direttamente nel codice HTML, consentendo ai browser di avviarne il download il prima possibile.

Ecco perché un gruppo di designer e sviluppatori indipendenti, noto come [Responsive Images Community Group](http://ricg.io/), ha iniziato a proporre nuovi tag e attributi.

## Cosa sono le immagini responsive?

"Immagini responsive" è il nome dato alla tecnica che consiste nel **definire più sorgenti per ogni singola immagine**, facendo sì che i browser **scarichino quella migliore** in base ai seguenti fattori:

- viewport del browser, o layout del tuo sito web
- densità di pixel del dispositivo

Gli utenti hanno densità di pixel differenti a seconda dello schermo del loro dispositivo. I dispositivi standard hanno una densità di pixel pari a 1, il che significa che lo schermo ha 1 pixel fisico (device pixel) per ogni pixel CSS. I monitor HiDPI più recenti (inclusi i display "Retina") hanno invece una densità maggiore. Ad esempio, una densità di pixel pari a 2 significa che lo schermo ha 2x2 pixel fisici per ciascun pixel CSS, e così via.

I display HiDPI sono straordinari per il rendering di elementi vettoriali, come font o immagini SVG. Ma quando si tratta di renderizzare immagini bitmap, i browser si limitano a ingrandire l'immagine originale, rendendola sfuocata su dispositivi che dovrebbero invece offrire una qualità superiore.

## Supportare i display HiDPI

La cosa più semplice che puoi fare con il nuovo attributo `srcset` è supportare diverse densità di pixel. Ti basta specificare sorgenti diverse per la tua immagine, descrivendo ognuna con il descrittore `x`, che indica la densità di pixel della sorgente dell'immagine. In questo modo:

```html
<img
	src="shirt_300w.jpg"
	srcset="shirt_300w.jpg 1x, shirt_600w.jpg 2x"
	alt="Una bella camicia"
	width="300"
	height="380"
/>
```

In questo esempio, vogliamo mostrare un'immagine di 300 x 380 pixel *CSS*. L'immagine a densità standard è `shirt_300w.jpg` ed è descritta dal descrittore `1x`. L'immagine a doppia densità è `shirt_600w.jpg`, e deve essere di 600 x 760 pixel.

**Nota:** i browser che comprendono il nuovo attributo `srcset` ignoreranno l'attributo `src`, che è comunque richiesto come fallback.

Questo è già un ottimo risultato per offrire la migliore qualità d'immagine ai nostri utenti, ma cosa succede se nel nostro layout responsive la dimensione dell'immagine varia a seconda dello spazio disponibile?

## Dimensioni dell'immagine differenti

Supponiamo che la nostra immagine debba avere le seguenti larghezze:

- 300 pixel su viewport piccole (< 600)
- 600 pixel su viewport medie (>= 600)
- 1200 pixel su viewport grandi (>= 1200)

Come facciamo a garantire che i nostri utenti ottengano sempre la dimensione dell'immagine che meglio si adatta alla loro viewport *e* alla densità di pixel?

Possiamo definire immagini con queste dimensioni:

| Densità / Larghezza viewport | < 600     | >= 600      | >= 1200     |
| ------------------------ | --------- | ----------- | ----------- |
| 1x                       | 300 x 380 | 600 x 760   | 1200 x 1520 |
| 2x                       | 600 x 760 | 1200 x 1520 | 2400 x 3040 |

Come puoi vedere, stiamo usando 4 diverse dimensioni di immagine. Ti consiglio di includere la larghezza nel nome del file dell'immagine, poiché è molto più chiaro da comprendere.

- 300 x 380 - shirt_300w.jpg
- 600 x 760 - shirt_600w.jpg
- 1200 x 1520 - shirt_1200w.jpg
- 2400 x 3040 - shirt_2400w.jpg

Per scrivere il relativo markup nel nostro codice HTML, dobbiamo fare così:

```html
<img
	src="shirt_300w.jpg"
	srcset="
		shirt_300w.jpg   300w,
		shirt_600w.jpg   600w,
		shirt_1200w.jpg 1200w,
		shirt_2400w.jpg 2400w
	"
	alt="Una bella camicia"
	sizes="(min-width: 1200px) 1200px,
         (min-width: 600px) 600px,
         300px"
/>
```

Con questo markup, the browser conosce lo spazio che l'immagine occuperà sullo schermo (tramite `sizes`) e tutte le sorgenti di immagini disponibili che abbiamo preparato per i nostri utenti (tramite `srcset`).

A questo punto, il browser sceglierà quale sorgente scaricare in base alle informazioni fornite e a quelle che conosce sull'utente, come la densità dello schermo, i file in cache, la velocità di connessione, ecc.

## Supporto dei browser

L'attributo `srcset` è supportato da tutti i browser tranne Internet Explorer. Fortunatamente, esiste un [polyfill](https://github.com/scottjehl/picturefill/) ufficiale che possiamo utilizzare per emulare il comportamento nativo sui browser legacy.

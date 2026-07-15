---
title: "Lazy loading delle immagini responsive nel 2020"
description: "Vuoi migliorare le prestazioni del tuo sito web? Puoi farlo utilizzando le immagini responsive e il lazy loading! In questo articolo troverai il codice HTML, JavaScript e CSS per caricare le immagini responsive in modalità lazy, per fare in modo che i browser utilizzino formati di immagine moderni come WebP e Jpeg2000, e per abilitare il lazy loading nativo dove supportato."
tags:
  - techniques
  - lazy loading
  - images
  - vanilla-lazyload
layout: layouts/post.njk
---

Vuoi migliorare le prestazioni del tuo sito web? Puoi farlo usando le **immagini responsive** e il **lazy loading**! In questo articolo troverai il codice **HTML, JavaScript e CSS** per il lazy-loading delle immagini responsive, per fare in modo che i browser utilizzino **formati di immagine moderni** come **WebP** e **Jpeg2000**, e per abilitare il **lazy-loading nativo** dove supportato.

{% image "lazy-load-responsive-images-2020.webp", "Lazy Load delle immagini responsive nel 2020", [648, 1296], "648px" %}

## Definizioni

Le **immagini responsive** sono tag `img` che scaricano la sorgente d'immagine corretta a seconda del design e del dispositivo dell'utente. Puoi fornire informazioni sul layout nell'attributo `sizes` e un elenco di sorgenti d'immagine nell'attributo `srcset`. Puoi anche utilizzare le media query racchiudendo il tag `img` in un tag `picture`. Maggiori informazioni sulle [immagini responsive su MDN](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

Il **lazy-loading delle immagini** è una tecnica che velocizza il rendering del tuo sito web **posticipando il caricamento delle immagini below-the-fold** a quando **entrano nel viewport**. Oltre alle prestazioni, questo ti consente anche di risparmiare larghezza di banda e denaro, ad esempio se paghi un servizio CDN per le tue immagini.

## Prima l'above-the-fold

Tieni a mente che l'uso di uno script per il **lazy-loading delle immagini è un'attività basata su JavaScript** ed è **sensibilmente più lento rispetto al normale caricamento delle immagini** (d'ora in poi chiamato _eager loading_), che inizia non appena viene analizzato il documento HTML.

☝️ Per questo motivo, la best practice consiste nel **caricare immediatamente (eager) le immagini above-the-fold** e caricare in modalità **lazy solo le immagini below-the-fold**.

A questo punto, di solito ci si chiede:

💬 _Il mio sito è responsive, come faccio a sapere quante immagini saranno_ above-the-fold _al caricamento della pagina?_

La risposta è: contale! Apri la pagina web in un browser, ridimensiona il viewport alle dimensioni più comuni (smartphone, computer e tablet) magari utilizzando lo strumento di emulazione dei dispositivi, e contale.

Se vedi 4 immagini _above-the-fold_ su uno smartphone e solo la parte superiore di altre 4 su desktop, sii prudente e carica immediatamente (eager) solo le prime 4.

## E ora un po' di codice!

Ecco il markup HTML di un'immagine responsive caricata immediatamente (_eager_).

```html
<!-- Caricata immediatamente (eager),
     solo above-the-fold -->
<img
  alt="Eager above"
  src="220x280.jpg"
  srcset="
    220x280.jpg 220w,
    440x560.jpg 440w
  "
  sizes="220px"
/>
```

Ed ecco il markup per caricare un'immagine responsive in modalità _lazy_.

```html
<!-- Caricata in modalità lazy,
     solo below-the-fold -->
<img
  alt="Lazy below"
  class="lazy"
  data-src="220x280.jpg"
  data-srcset="220x280.jpg 220w,
    440x560.jpg 440w"
  data-sizes="220px"
/>
```

Vuoi mostrare un'anteprima a bassa risoluzione mentre le immagini lazy si stanno caricando? Puoi farlo inserendo una piccola immagine di bassa qualità nel tag `src`, come nell'esempio seguente.

```html
<!-- Caricata in modalità lazy,
     + anteprima a bassa risoluzione,
     solo below-the-fold -->
<img
  alt="Lazy below con anteprima"
  class="lazy"
  src="11x14.jpg"
  data-src="220x280.jpg"
  data-srcset="220x280.jpg 220w,
    440x560.jpg 440w"
  data-sizes="220px"
/>
```

[Apri la demo 👀](http://verlok.github.io/vanilla-lazyload/demos/image_srcset_lazy_sizes.html), quindi apri gli **strumenti per sviluppatori** del browser e vai alla **scheda Rete (Network)**. Vedrai che le prime 2 immagini vengono caricate immediatamente (_eager_) appena la pagina si apre, mentre le restanti vengono caricate in modalità _lazy_ **man mano che scorri verso il basso**.

Stiamo usando il tag HTML `img` e non il tag `picture`, poiché quest'ultimo non è necessario in questo caso. Approfondirò i casi d'uso del tag `picture` più avanti in questo articolo. ⏩ [Vai direttamente ai casi d'uso del tag `picture`](#casi-duso-del-tag-picture)

### Inclusione dello script

Per caricare le immagini lazy quando entrano nel viewport, hai bisogno di uno script di lazy-loading come [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload), uno script leggero (2.5 kb gzipped), velocissimo, configurabile e ottimizzato per la SEO che ho creato e continuo a migliorare costantemente dal 2014.

Ecco il modo più semplice per includerlo nella tua pagina.

```html
<script src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@18.0.0/dist/lazyload.min.js"></script>
```

Dai un'occhiata alla documentazione per [scoprire altri modi per includere LazyLoad](https://github.com/verlok/vanilla-lazyload/#-getting-started---script) nelle tue pagine web, come l'utilizzo di uno script `async` con auto-inizializzazione, l'uso di RequireJS, WebPack o Rollup.

### Inizializzazione di LazyLoad

L'inclusione dello script vanilla-lazyload ti fornisce la classe JS `LazyLoad` che puoi usare per caricare le immagini identificate dalla classe CSS `lazy`. Devi creare un'istanza di `LazyLoad` in questo modo:

```js
var lazyLoad = new LazyLoad({
  // Le tue impostazioni personalizzate vanno qui
});
```

### Minimizzare il reflow del layout

Quando usi il lazy loading, le immagini che non hanno ancora iniziato a caricarsi collassano a un'altezza pari a `0`, per poi espandersi una volta avviato il caricamento. Questo reflow del layout renderebbe il tuo sito scattoso (janky), quindi è una best practice **stabilizzare il layout** occupando lo spazio esatto che le immagini occuperanno una volta caricate, prima ancora che inizi il caricamento.

La soluzione universale per farlo è utilizzare il trucco del padding verticale (padding hack), mentre in futuro sarà possibile utilizzare la proprietà CSS `aspect-ratio` (al momento della scrittura, è [disponibile](https://twitter.com/Una/status/1260980901934137345) solo su Chrome Canary).

```css
.image-wrapper {
  width: 100%;
  height: 0;
  padding-bottom: 150%;
  /* ☝️ altezza immagine / larghezza immagine * 100% */
  position: relative;
}
.image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
```

Ecco anche un utile mixin SASS per farlo (fonte: [CSS-Tricks](https://css-tricks.com/snippets/sass/maintain-aspect-ratio-mixin/)).

```scss
@mixin aspect-ratio($width, $height) {
  position: relative;
  &:before {
    display: block;
    content: "";
    width: 100%;
    padding-top: ($height / $width) * 100%;
  }
  > .content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
```

Maggiori informazioni in [Sizing Fluid Image Containers with a Little CSS Padding Hack](http://andyshora.com/css-image-container-padding-hack.html) di Andy Shora.

### Evitare l'effetto immagini "rotte"

Per evitare che le immagini lazy appaiano come rotte, anche solo per un breve istante, usa il CSS. Nascondi le immagini che non hanno ancora impostato né l'attributo `src` né `srcset`.

```css
img:not([src]):not([srcset]) {
  visibility: hidden;
}
```

### Nessun polyfill richiesto

Potresti essere tentato di aggiungere uno o più polyfill per supportare Internet Explorer (_sì, l'ho nominato ed è il 2020_). Non farlo, **non ne hai bisogno**. Ti spiego perché:

- _Immagini responsive:_ Internet Explorer non supporta le immagini responsive, mas non serve un polyfill poiché <abbr title="Internet Explorer">IE</abbr> si adatta (degrada) elegantemente mostrando **l'immagine specificata nell'attributo `src`**. Ti basterà quindi scegliere un'immagine adatta a uno schermo desktop standard, inserirla nell'attributo `src` e sei a posto.

- _IntersectionObserver:_ Internet Explorer non supporta l'API `IntersectionObserver`, che viene utilizzata da vanilla-lazyload, ma non è necessario fornire un polyfill poiché vanilla-lazyload rileverà il supporto per quell'API e, in caso di mancanza, caricherà immediatamente tutte le immagini. Questo produce lo stesso risultato che si otterrebbe senza usare LazyLoad sulla pagina, ma senza generare errori.

Il che è ottimo, visto che Internet Explorer oggi non è usato da più del 5% degli utenti, e Microsoft lo sta silenziosamente sostituendo con [Edge](https://www.microsoft.com/edge) tramite Windows Update.

In ogni caso, se per qualche motivo vuoi che funzioni esattamente allo stesso modo su Internet Explorer, puoi includere il polyfill di IntersectionObserver prima di vanilla-lazyload.

```html
<!-- Non farlo se non sei sicuro! Leggi sopra -->
<script src="https://cdn.jsdelivr.net/npm/intersection-observer@0.10.0/intersection-observer.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@18.0.0/dist/lazyload.min.js"></script>
```

### Mettiamo tutto insieme

Per tua comodità, ecco tutto il codice HTML, JS e CSS riunito.

```html
<!-- Caricata immediatamente (eager),
     solo above-the-fold -->
<img
  alt="Eager above"
  src="220x280.jpg"
  srcset="
    220x280.jpg 220w,
    440x560.jpg 440w
  "
  sizes="220px"
/>

<!-- Caricata in modalità lazy,
     solo below-the-fold -->
<img
  alt="Lazy below"
  class="lazy"
  data-src="220x280.jpg"
  data-srcset="220x280.jpg 220w,
    440x560.jpg 440w"
  data-sizes="220px"
/>
```

```js
var lazyLoad = new LazyLoad({
  elements_selector: ".lazy",
  cancel_on_exit: true
});
```

```css
/*
Contenitore delle immagini per occupare spazio
quando le immagini non sono ancora caricate
*/
.image-wrapper {
  width: 100%;
  height: 0;
  padding-bottom: 150%;
  /* ☝️ altezza immagine / larghezza immagine * 100% */
  position: relative;
}
.image {
  position: absolute;
  /* ...altre regole di posizionamento */
}

/*
Nascondi le immagini "rotte" prima
che inizino a caricare
*/
img:not([src]):not([srcset]) {
  visibility: hidden;
}
```

E questo è tutto per quanto riguarda il semplice tag `img`.

## Casi d'uso del tag picture

Fino ad ora ho parlato del tag `img` con gli attributi `srcset` e `sizes`, che rappresenta la soluzione per la stragrande maggioranza delle immagini responsive che potresti dover usare in un sito o in un'applicazione web. Ora, in quali casi dovresti invece usare il tag `picture`?

### Rapporto larghezza/altezza differente (Art Direction)

Caso d'uso: devi mostrare immagini con un **rapporto larghezza/altezza differente** a seconda di una media query. Ad esempio, vuoi mostrare _immagini verticali (portrait)_ su dispositivi mobili e verticali, e _immagini orizzontali (landscape)_ su viewport più ampi come tablet e computer.

Ecco il codice di cui avrai bisogno in questo caso. Per caricare le immagini immediatamente (eager), usa semplicemente gli attributi standard `src` e `srcset`, senza il prefisso `data-`.

```html
<picture>
  <source
    media="(min-width: 1024px)"
    data-srcset="1024x576.jpg 1x,
      2048x1152.jpg 2x"
  />
  <source
    media="(max-width: 1023px)"
    data-srcset="640x960.jpg 1x,
      1280x1920.jpg 2x"
  />
  <img
    class="lazy"
    alt="Ritratto o panorama"
    data-src="1024x576.jpg"
  />
</picture>
```

[Apri la demo 👀](http://verlok.github.io/vanilla-lazyload/demos/picture_media.html), quindi apri gli **strumenti per sviluppatori** del browser e vai alla **scheda Rete (Network)**. Vedrai che viene scaricata solo la sorgente d'immagine corrispondente alla prima media query soddisfatta.

### Caricare formati moderni come WebP e Jpeg2000

Caso d'uso: vuoi che sia il browser a scegliere la sorgente per **caricare un formato moderno come WebP o Jpeg2000** in base al supporto per quel determinato formato.

Avrai bisogno del tag `source` e dell'attributo `type` che contiene il MIME type delle immagini nell'attributo `data-`/`srcset`.

```html
<picture>
  <source
    type="image/jp2"
    data-srcset="1024x576.jp2 1x,
      2048x1152.jp2 2x"
  />
  <source
    type="image/webp"
    data-srcset="1024x576.webp 1x,
      2048x1152.webp 2x"
  />
  <img
    data-src="1024x576.jpg"
    data-srcset="1024x576.jpg 1x,
      2048x1152.jpg 2x"
    data-sizes="1024px"
    alt="Jp2, WebP o Jpg"
    class="lazy"
  />
</picture>
```

[Apri la demo 👀](http://verlok.github.io/vanilla-lazyload/demos/picture_type_webp.html), apri gli **strumenti per sviluppatori** del browser e vai alla **scheda Rete (Network)**. Vedrai che scaricherà solo la sorgente dell'immagine corrispondente al primo formato supportato dal tuo browser.

💬 _Questo markup non è un po' troppo lungo per una singola immagine?_

Sì, lo è. E se hai budget da investire nell'ottimizzazione delle immagini, ci sono altri modi per farlo. La maggior parte dei server di immagini basati su cloud presenti sul mercato serve automaticamente diversi formati di immagine allo stesso URL. Ciò significa che puoi richiedere `1024x576.jpg` e ottenere un file WebP o Jpeg2000 di conseguenza. [Cloudinary](https://cloudinary.com/) e [Akamai Image & Video Manager](https://www.akamai.com/it/it/products/performance/image-and-video-manager.jsp) fanno proprio questo, tra gli altri.

### Limitare la fedeltà delle immagini a 2x

Con la diffusione di schermi ad altissima densità "super retina" nei dispositivi di fascia alta più recenti (come le serie iPhone 12 o Google Pixel), limitare la fedeltà dell'immagine a 2x porta a un notevole miglioramento nei tempi di download, senza alcuna perdita di qualità percepibile per gli utenti.

👉 [Ecco una nuova best practice su come fare.](./capping-image-fidelity-2x-minimize-loading-time)

## Lazy loading nativo

Forse avrai sentito o letto dell'arrivo del [lazy-loading nativo](https://web.dev/native-lazy-loading/) sul web. Fantastico, vero? A partire da maggio 2020, è supportato da Chrome, Firefox, Edge, Opera e, _dietro un flag_, da Safari.

Quindi il supporto al 100% dei browser non è ancora arrivato, ma nel caso in cui tu voglia abilitarlo sui browser supportati, puoi optare per il [lazy loading ibrido](https://www.smashingmagazine.com/2019/05/hybrid-lazy-loading-progressive-migration-native/) impostando l'opzione `use_native` di vanilla-lazyload su `true`.

```js
new LazyLoad({
  use_native: true
});
```

### Funzionalità a cui potresti dover rinunciare

Se opti per il lazy-loading nativo o quello ibrido, potresti perdere alcune **funzionalità offerte dal lazy-loading gestito da JavaScript**:

- **applicazione automatica delle classi** in base agli eventi (`loading`, `loaded`, ecc.)
- **riprovo automatico del caricamento** delle immagini in caso di errore di rete non appena si torna online
- **cancellazione del download** quando le immagini escono dal viewport mentre si stanno ancora caricando, in modo da **dare priorità a quelle nuove**
- **callback sugli eventi attivati** (ingresso/uscita dal viewport, caricamento iniziato/finito, ecc.)

Rifletti attentamente prima di passare al lazy-loading nativo. Se la mancanza di queste funzioni non rappresenta un problema per te, allora puoi procedere tranquillamente.

---

## Conclusioni

Ecco un riassunto:

1. Usa [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload/) per gestire il caricamento delle tue immagini.
2. Non caricare tutte le immagini in modalità lazy, ma solo quelle _below-the-fold_
3. Usa il tag `img` per le immagini responsive semplici
4. Usa il tag `picture` per:
   - modificare il rapporto larghezza/altezza delle immagini a specifiche media query
   - servire in modo condizionale le immagini in formati moderni come WebP o Jpeg2000
5. Non utilizzare alcun polyfill se non è strettamente necessario

Buon lazy loading!

### Riguardo questo articolo

Se qualcosa non è chiaro o ritieni possa essere migliorato, fammelo sapere nei commenti o [scrivimi su Twitter](https://twitter.com/verlok/).

☕ Se hai trovato utile questo articolo, puoi esprimere la tua gratitudine [offrendomi un caffè](https://ko-fi.com/verlok). ☕

### Risorse utili

- [Responsive images in practice](http://alistapart.com/article/responsive-images-in-practice) @ A List Apart
- [Responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) @ Mozilla Developer Network
- [Responsive images in CSS](https://css-tricks.com/responsive-images-css/) @ CSS Tricks
- Sito del [Responsive Images Community Group](https://responsiveimages.org)

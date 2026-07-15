---
title: "Generazione avanzata di sprite con Compass (SASS)"
description: "Creare sprite (spriting) è un modo per migliorare le prestazioni del tuo sito web raggruppando molte immagini (o icone) in un'unica immagine più grande, al fine di effettuare una singola richiesta HTTP anziché molte. Ecco come puoi creare sprite utilizzando Compass."
tags:
  - sprites
  - automation
---

La creazione di sprite (spriting) è un modo per migliorare le prestazioni del tuo sito web posizionando molte immagini (o icone) all'interno di un'unica immagine più grande, in modo da effettuare una sola richiesta HTTP anziché molte. Ecco come puoi creare gli sprite utilizzando Compass.

## Il metodo semplice

Il modo più semplice per creare uno sprite con Compass richiede di importare una cartella di immagini nel progetto e poi generare una classe per ciascuno sprite. Puoi farlo utilizzando il seguente codice:

```scss
// Importazione dello strumento Compass richiesto
@import "compass/utilities/sprites";
// Importazione di tutte le immagini png all'interno della cartella flags
@import "flags/*.png";
// Genera una classe CSS per ogni sprite
@include all-flags-sprites
```

Esempio di output CSS:

```css
.flags-it,
.flags-de,
.flags-fr {
  background: url('/images/flags-s34fe0604ab.png') no-repeat; }

.flags-it { background-position: 0 0; }
.flags-de { background-position: 0 -32px; }
.flags-fr { background-position: 0 -64px; }
```

Questo potrebbe essere sufficiente per le tue esigenze... ma tu vuoi di più, vero?

## Il metodo avanzato

Tralasciando tutti gli altri modi in cui è possibile generare gli sprite con Compass, ho scoperto che se devi fare quanto segue:

*   Generare dimensioni del box uguali a quelle dello sprite
*   Usare un offset all'interno del box
*   Spaziare gli sprite all'interno della mappa degli sprite (sprite map)
*   Gestire display con densità 1x, 2x, 3x
*   Ottimizzare il tempo di generazione degli sprite

L'unico modo per fare spriting con Compass è creare i tuoi mixin personali che utilizzino sotto il cofano i mixin di base di Compass.

### Struttura delle immagini e delle cartelle

Per avere le immagini a densità singola, doppia e magari tripla, dobbiamo fornire le immagini in dimensioni 1x, 2x e magari 3x.

Quindi, supponendo di voler creare una mappa di sprite contenente delle **bandiere (flags)**, puoi avere le seguenti cartelle nella cartella delle immagini:

* flagsSprite1x - _immagini delle bandiere a densità singola_
* flagsSprite2x - _immagini delle bandiere a densità doppia_
* flagsSprite3x - _...densità tripla_

E se volessimo creare anche una mappa di sprite per delle **icone (icons)**, dovremmo creare le cartelle:

* iconsSprite1x
    * ...
* iconsSprite2x
    * ...
* iconsSprite3x
    * ...

Ora diamo un'occhiata ai partial SASS da creare.

### Partial SASS

Per garantire la massima flessibilità e il minor tempo di compilazione (build), ti suggerisco di utilizzare la seguente struttura:

* _variables.scss - tutte le tue variabili
* _mixins.scss - tutti i tuoi mixin
* un file partial per ogni set di immagini:
    * _flagsSprite.scss - bandiere
    * _iconsSprite.scss - icone
    * ...

Vediamo cosa inserire nei nostri partial, uno per uno.

### _mixins.scss

Ecco alcuni mixin che potresti voler includere nel tuo file dei mixin. Trovi la spiegazione del loro funzionamento direttamente nei commenti del codice.

```scss
/*
Rende possibile l'utilizzo di uno sprite a densità n-pla
Adatta automaticamente background-size e offset quando $multiplier è maggiore di 1
Consente di utilizzare la generazione automatica delle dimensioni, che viene adattata automaticamente quando $multiplier è maggiore di 1

Parametri richiesti:
- $sprite - il nome dello sprite
- $spriteMap - la variabile spriteMap
- $spriteUrl - l'url della mappa degli sprite dello sprite

Parametri opzionali:
- $multiplier (1) - la densità dello sprite (1 per densità singola, 2 per retina, 3, ecc.)
- $renderSize (false) - indica al mixin di impostare width e height del box contenente lo sprite
- $offsetX (0) - l'offset orizzontale (px) per l'immagine nel box
- $offsetY (0) - l'offset verticale (px) per l'immagine nel box
*/
@mixin useNxSprite($sprite, $spriteMap, $spriteUrl, $multiplier: 1, $renderSize: false, $offsetX: 0, $offsetY: 0) {
  $spritePosition: sprite-position($spriteMap, $sprite, $offsetX * $multiplier, $offsetY * $multiplier);
  background: transparent $spriteUrl no-repeat nth($spritePosition, 1) / $multiplier nth($spritePosition, 2) / $multiplier;
  @if ($multiplier > 1) {
    background-size: (image-width(sprite-path($spriteMap)) / $multiplier) (image-height(sprite-path($spriteMap)) / $multiplier);
  }
  @if ($renderSize) {
    height: image-height(sprite-file($spriteMap, $sprite)) / $multiplier;
    width: image-width(sprite-file($spriteMap, $sprite)) / $multiplier;
  }
}

/*
Mixin di utilità per utilizzare sprite a singola e doppia densità, con media query per la doppia densità inclusa

Parametri richiesti:
- $sprite - il nome dello sprite
- $sprite1xMap - la variabile spriteMap per gli sprite 1x
- $sprite2xMap - la variabile spriteMap per gli sprite 2x
- $sprite1xUrl - l'url della mappa degli sprite per gli sprite 1x
- $sprite2xUrl - l'url della mappa degli sprite per gli sprite 2x

Parametri opzionali:
- $renderSize (false) - indica al mixin di impostare width e height del box contenente lo sprite
- $offsetX (0) - l'offset orizzontale (px) per l'immagine nel box
- $offsetY (0) - l'offset verticale (px) per l'immagine nel box
*/
@mixin use1x2xSprite($sprite, $sprite1xMap, $sprite2xMap, $sprite1xUrl, $sprite2xUrl, $renderSize: false, $offsetX: 0, $offsetY: 0) {
  @include useNxSprite($sprite, $sprite1xMap, $sprite1xUrl, 1, $renderSize, $offsetX, $offsetY);
  @media (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi) {
    @include useNxSprite($sprite, $sprite2xMap, $sprite2xUrl, 2, $renderSize, $offsetX, $offsetY);
  }
}
```

### _variables.scss

Questo è il file in cui definisci tutte le variabili del tuo sito, che utilizzerai in tutti i tuoi file scss.

Qui dovresti definire la spaziatura tra gli sprite nelle immagini della mappa degli sprite.

```scss
// Spaziatura generica (a 1x) per gli sprite
$spacing-sprites-generic: 10px;
```

### _flagsSprite.scss

Questo è il file in cui definisci le variabili e i mixin per gli sprite delle bandiere.

Ti suggerisco di importare (`@import`) il file `_flagsSprite.scss` solo nei file che richiedono effettivamente gli sprite delle bandiere. Questo **velocizza molto il tempo di build**, evitando frequenti controlli delle immagini sul file system.

```scss
// MAPPE e URL per flagsSprite
$flagsSprite1xMap: sprite-map("flagsSprite1x/*.png", $spacing: $spacing-sprites-generic);
$flagsSprite2xMap: sprite-map("flagsSprite2x/*.png", $spacing: $spacing-sprites-generic * 2);
$flagsSprite1xUrl: sprite-url($flagsSprite1xMap);
$flagsSprite2xUrl: sprite-url($flagsSprite2xMap);

// mixin flagsSprite
@mixin flagsSprite($spriteName, $renderSize: false, $offsetX: 0, $offsetY: 0) {
    @include use1x2xSprite($spriteName, $flagsSprite1xMap, $flagsSprite2xMap, $flagsSprite1xUrl, $flagsSprite2xUrl, $renderSize, $offsetX, $offsetY);
}
```

### style.scss - uso standard

Se non hai bisogno di spazio attorno allo sprite e non vuoi che Compass generi le dimensioni del box per te, puoi semplicemente fare così.

```scss
@import "compass/utilities/sprites";
@import "_variables";
@import "_flagsSprite";

// Uso semplice
.exampleSimple {
    @include flagsSprite(italy);
}
```

Questo produrrà quanto segue:

```css
.exampleSimple {
  background: transparent url('../img/flagsSprite1x-s479625030c.png') no-repeat 0 -882px;
}
@media (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi) {
  .exampleSimple {
    background: transparent url('../img/flagsSprite2x-s9a855cf705.png') no-repeat 0 -882px;
    background-size: 32px 2048px;
  }
}
```

### style.scss - con generazione delle dimensioni del box

Se vuoi che Compass generi le dimensioni del box per te, devi fare come segue.

```scss
@import "compass/utilities/sprites";
@import "_variables";
@import "_flagsSprite";

.exampleWithDimensions {
    @include flagsSprite(italy, true);
}
```

Questo produrrà quanto segue:

```css
.exampleWithDimensions {
  background: transparent url('../img/flagsSprite1x-s479625030c.png') no-repeat 0 -882px;
  height: 32px;
  width: 32px;
}
@media (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi) {
  .exampleWithDimensions {
    background: transparent url('../img/flagsSprite2x-s9a855cf705.png') no-repeat 0 -882px;
    background-size: 32px 2048px;
    height: 32px;
    width: 32px;
  }
}
```

### style.scss - con gestione dell'offset

Se non vuoi che Compass generi le dimensioni del box per te, ma desideri utilizzare un offset all'interno del box, devi fare come segue.

```scss
@import "compass/utilities/sprites";
@import "_variables";
@import "_flagsSprite";

.exampleWithPadding {
    @include flagsSprite(italy, false, 10, 10);
    width: 52px; height: 52px;
}
```

Questo produrrà quanto segue:

```css
.exampleWithPadding {
  background: transparent url('../img/flagsSprite1x-s479625030c.png') no-repeat 10px -872px;
  width: 52px;
  height: 52px;
}
@media (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi) {
  .exampleWithPadding {
    background: transparent url('../img/flagsSprite2x-s9a855cf705.png') no-repeat 10px -872px;
    background-size: 32px 2048px;
  }
}
```

## Tutto qui

La generazione automatica di sprite tramite Compass considerando tutti i fattori può essere piuttosto complessa, ma seguendo questa guida sarà semplice e anche più facile da mantenere.

Se hai riscontrato problemi con questo post, per favore [mandami un tweet](https://twitter.com/verlok) e provvederò a risolverli.

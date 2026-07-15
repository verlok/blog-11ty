---
title: "Critical CSS con Jekyll e SASS"
description: "In passato il mio blog era gestito da Jekyll su GitHub Pages e il suo CSS era compilato usando SASS. Oggi ho deciso di migliorare ulteriormente le prestazioni integrando inline il critical CSS che blocca il rendering, ma anche cercando su internet ho faticato a trovare un modo semplice per farlo. Questo post fa al caso tuo, se vuoi fare la stessa cosa."
tags:
  - techniques
  - web performance
  - css
layout: layouts/post.njk
---

In passato il mio blog era gestito da **Jekyll su GitHub Pages** e il suo CSS era compilato usando SASS. Oggi ho deciso di migliorare ulteriormente le prestazioni integrando inline il _critical_ CSS che blocca il rendering, ma anche cercando su internet ho faticato a trovare un modo semplice per farlo. Questo post fa al caso tuo, se vuoi fare la stessa cosa.

{% image "critical-css-jekyll-sass.png", "Codice sfocato casuale", [648, 1296], "648px" %}

## Lo stile critical

Nel file SASS per il critical CSS, usa la direttiva SASS `@import` per includere tutti i partial che hanno un impatto sul layout della tua pagina. Includi anche le tue variabili (_variables_) e mixin che potrebbero essere richiesti dai partial importati.

Ad esempio, io sto importando:

- il partial `base`, che contiene le regole di base del sito come il CSS reset e le regole tipografiche,
- il partial `layout`, che definisce lo stile dell'header e del layout della pagina,
- il partial `posts_above`, che definisce lo stile della parte _above-the-fold_ dell'elenco dei post e del dettaglio del post,
- il partial `utils`, che contiene alcune classi di utilità (ad es. `visuallyHidden`).

Il partial `posts_above` inizialmente era un unico file chiamato `posts`, ma ho deciso di dividerlo in due file separati per ottimizzare ancora di più. L'altro partial, chiamato `posts_below`, contiene le informazioni di stile per il footer del post (la sezione dell'autore, il pulsante di condivisione), quindi _non_ è incluso qui.

&rarr; Crea un file `critical.scss` all'interno della cartella `includes`.

File `includes/critical.scss`:

```scss
// Importa i partial per il contenuto del critical css
@import "variables", "mixins", "base",
  "layout", "posts_above", "pages",
  "utils";
```

IMPORTANTE: Posiziona questo file nella cartella `includes`! Più tardi dovrai includerlo nel tuo HTML.

## Inseriscilo nella sezione `head`

Inserisci il critical CSS inline all'interno di un tag `style` nella sezione `<head>` del tuo HTML. Puoi farlo usando il seguente codice Jekyll, basato sul motore di template Liquid utilizzato in Jekyll.

&rarr; Apri il tuo partial `head.html`, se ne hai uno.

File `includes/head.html`:

```liquid
{% raw %}{% capture critical %}
  {% include minima_critical.scss %}
{% endcapture %}

{{ critical | scssify }}{% endraw %}
```

## Il resto del tuo foglio di stile

Se il tuo sito è abbastanza semplice, puoi importare il resto dei tuoi partial all'interno di un singolo file SCSS, che caricherai in modo asincrono usando JavaScript.

Io, ad esempio, ho importato lì tutti i partial SASS che definiscono lo stile delle sezioni della pagina che probabilmente appariranno _below-the-fold_:

- lo stile di evidenziazione della sintassi (syntax highlighting),
- lo stile del footer,
- lo stile della paginazione,
- lo stile delle icone SVG,
- lo stile degli iframe e delle tabelle

&rarr; Inserisci il resto delle tue regole SASS all'interno del tuo normale file CSS.

File `assets/main.scss`:

```scss
---
---

// Importa i partial per il contenuto below-the-fold
@import "variables", "mixins",
  "posts_below", "syntax-highlighting",
  "footer", "code", "pagination",
  "icons", "iframes", "tables";
```

**IMPORTANTE**: Le due righe con tre trattini all'inizio del file sono richieste da Jekyll per riconoscere ed elaborare il file come contenuto.

## Carica il resto del foglio di stile

Ci sono molti modi per caricare il resto del tuo CSS usando JavaScript, ma ho deciso di usare la [tecnica asincrona moderna](https://www.filamentgroup.com/lab/async-css.html) che fa sì che un file CSS venga caricato con bassa priorità, per poi applicarlo alla pagina una volta caricato.

File `head.html`:

```html
{% raw %}<link
  rel="stylesheet"
  href="{{ '/assets/main.css' | relative_url }}"
  media="nope!"
  onload="this.media='all'"
/>{% endraw %}
```

Funziona!

## Conclusione

Integrare inline la parte critica del tuo CSS fa sì che le tue pagine vengano visualizzate più velocemente, poiché il CSS si trova nel percorso di rendering critico (critical rendering path) del browser.

Fai una prova! Se hai commenti, fammi sapere nella sezione commenti qui sotto!

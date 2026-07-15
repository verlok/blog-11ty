---
title: "Usare le variabili CSS come unità di spaziatura"
description: "In questo articolo ti mostro come utilizzare le variabili CSS, note popolarmente come proprietà personalizzate (CSS custom properties), per scalare gli spazi del tuo layout su diverse media query."
tags:
  - techniques
  - layout
  - css variables
---

In questo articolo ti mostro come puoi utilizzare le variabili CSS, note popolarmente come *proprietà personalizzate* (CSS custom properties), per **scalare gli spazi del tuo layout** su diverse media query.

> Il vantaggio: file CSS più corti, leggeri e facili da mantenere.

Per dimostrarlo, ho creato su CodePen l'esempio [CSS vars based layout spacing](https://codepen.io/verlok/pen/owzLPm?editors=1100). Lo trovi incorporato alla fine di questo post.


## Cosa sono le variabili CSS

Le variabili CSS sono una delle prossime grandi novità dei CSS. Non sono ancora [supportate universalmente](http://caniuse.com/#feat=css-variables) (spoiler: manca Internet Explorer) considerando le quote di mercato attuali dei browser, ma è giunto il momento di iniziare a sperimentarle, non trovi? Potrebbero rivelarsi utili nello sviluppo del tuo prossimo fantastico progetto!

La potenza delle variabili CSS risiede nel fatto che possiamo assegnare un valore a un nome e fare riferimento a quel valore usando il suo nome.

## Come definire una variabile CSS

Le variabili CSS possono essere definite in qualsiasi punto e vengono ereditate da tutti gli elementi figli dell'elemento DOM a cui vengono applicate.

```css
html {
  --base-spacing: 15px;
}
```

Qui abbiamo definito una variabile CSS chiamata `--base-spacing` e le abbiamo assegnato il valore `15px`. La variabile è definita sull'elemento `html`, quindi sarà disponibile in tutto il nostro documento.

(Sì, le variabili CSS devono iniziare con un doppio trattino (`--`), il che è un po' brutto, ma porta pazienza!)


## Differenza con le variabili SASS

Nel caso tu stia pensando: "E con ciò? Uso già SASS e il mio file `_variables.scss` è pieno zeppo di variabili!" - Beh, non è proprio la stessa cosa.

Le variabili SASS vengono pre-elaborate, quindi vengono trasformate in un valore CSS fisso e statico. Quando il CSS viene caricato, **la variabile va perduta** e rimane solo il suo valore, distribuito in tutti i punti in cui è stata utilizzata.

> Una variabile SASS non può essere modificata dopo che il CSS è stato caricato. Le variabili CSS, invece, possono essere modificate tramite media query, JavaScript o tramite gli strumenti di sviluppo (developer tools) del tuo browser preferito.


## Come utilizzare una variabile CSS

Vogliamo che la variabile `--base-spacing` funga da unità di spaziatura da utilizzare per padding e margini in tutta la nostra pagina. Come procediamo?

```css
.box {
  padding: var(--base-spacing);
  margin: var(--base-spacing);
}

h1 {
  margin-bottom: var(--base-spacing);
}
```

Fantastico! Ora stiamo usando la nostra variabile CSS come unità di spaziatura, proprio come faremmo con una variabile SASS, ma... ora possiamo modificarla!


## Modificare il valore delle variabili CSS

È qui che avviene la magia. I valori delle variabili CSS possono essere riassegnati come faresti con qualsiasi altra proprietà CSS, utilizzando:

- le media query
- JavaScript
- i developer tools del tuo browser preferito

La prima cosa che puoi fare per comprendere la potenza delle variabili CSS è **aprire i developer tools**, individuare la variabile nel file CSS e **cambiarne il valore**. [Prova qui](https://codepen.io/verlok/pen/owzLPm?editors=1100).

Nel nostro caso, vogliamo ampliare gli spazi sugli schermi più grandi, quindi ci basta fare così:

```css
@media (min-width: 500px) {
  html {
    --base-spacing: 30px;
  }
}
```

Tutto qui. Questa semplice riassegnazione della variabile farà scalare automaticamente tutti i nostri padding e margini, dato che abbiamo usato la variabile per definire i loro valori.

## DEMO

Ecco di cosa sto parlando:

<p data-height="265" data-theme-id="dark" data-slug-hash="owzLPm" data-default-tab="css,result" data-user="verlok" data-embed-version="2" data-pen-title="CSS vars based layout spacing" class="codepen">Vedi la Pen <a href="https://codepen.io/verlok/pen/owzLPm/">CSS vars based layout spacing</a> di Andrea Verlicchi (<a href="https://codepen.io/verlok">@verlok</a>) su <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>


## Possibilità infinite

Ora che hai imparato a padroneggiare le variabili CSS, puoi spingerti ben oltre e lasciare che siano i tuoi utenti a decidere la spaziatura del layout, il colore principale o qualsiasi altra cosa.

Ti bastano solo alcuni campi di input e poche righe di JavaScript, come dimostrato da [@wesbos](https://www.twitter.com/wesbos) in questo esempio.

<p data-height="265" data-theme-id="dark" data-slug-hash="adQjoY" data-default-tab="css,result" data-user="wesbos" data-embed-version="2" data-pen-title="Update CSS Variables with JS" class="codepen">Vedi la Pen <a href="https://codepen.io/wesbos/pen/adQjoY/">Update CSS Variables with JS</a> di Wes Bos (<a href="https://codepen.io/wesbos">@wesbos</a>) su <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

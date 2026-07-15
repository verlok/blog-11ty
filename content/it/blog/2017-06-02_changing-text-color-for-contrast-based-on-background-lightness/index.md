---
title: "Cambiare il colore del testo per contrasto in base alla luminosità dello sfondo"
description: "Se dovessi cambiare il colore di un testo con posizionamento fisso in base alla luminosità del suo sfondo durante lo scorrimento, come faresti? Filtri CSS, blend mode? E se dovessi supportare tutti i browser, incluso Internet Explorer? Ecco un paio di modi per farlo utilizzando le proprietà CSS clip e clip-path."
tags:
  - techniques
  - css
---

Se dovessi cambiare il colore di un testo in posizione fissa (`position: fixed`) in base alla luminosità dello sfondo che scorre sotto di esso, come faresti? Filtri CSS, blend mode? E se dovessi supportare tutti i browser, incluso Internet Explorer? Ecco un paio di modi per farlo utilizzando le proprietà CSS `clip` e `clip-path`.

Ecco il risultato ottenuto con `clip` - ampio supporto dei browser

<iframe loading="lazy" height='200' scrolling='no' title='Text color change at background using clip' src='https://codepen.io/verlok/embed/VWZeBL/?height=194&amp;theme-id=light&amp;default-tab=result&amp;embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>Vedi la Pen <a href='https://codepen.io/verlok/pen/VWZeBL/'>Text color change at background using clip</a> di Andrea Verlicchi (<a href='https://codepen.io/verlok'>@verlok</a>) su <a href='https://codepen.io'>CodePen</a>.
</iframe>

Ed ecco il risultato ottenuto con `clip-path` - solo browser moderni

<iframe loading="lazy" height='200' scrolling='no' title='Text color change at background using clip-path' src='https://codepen.io/verlok/embed/owvYjx/?height=265&amp;theme-id=light&amp;default-tab=result&amp;embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>Vedi la Pen <a href='https://codepen.io/verlok/pen/owvYjx/'>Text color change at background using clip-path</a> di Andrea Verlicchi (<a href='https://codepen.io/verlok'>@verlok</a>) su <a href='https://codepen.io'>CodePen</a>.
</iframe>

Cosa succede qui in pratica:

- il contenuto è avvolto da un box con classe `clipper` che ne ritaglia il contenuto
- viene copiato all'interno di ogni contenitore :(
- ha una posizione fissa tramite `position: fixed`

Dato che il contenuto ha una posizione fissa, rimane ancorato alla finestra del browser, ma viene ritagliato dagli elementi di ritaglio (clipping) che si muovono.

Questa soluzione presenta tuttavia due problemi:

- c'è un bug in IE ed Edge che rende invisibili i figli di tipo blocco del contenuto. Funziona però con gli elementi inline, anche se si tratta di un trucco (hack)
- dobbiamo copiare il contenuto all'interno di ciascun contenitore

Ti viene in mente una soluzione migliore? Se sì, scrivila nei commenti!

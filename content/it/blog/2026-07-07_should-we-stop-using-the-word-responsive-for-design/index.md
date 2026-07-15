---
title: 'Dovremmo smettere di usare la parola "Responsive" per il design?'
description: 'Come la definizione di "responsive" di Ethan Marcotte del 2010 si scontra con le linee guida delle app mobili sulla "adattabilità" e con le metriche di interattività delle performance web.'
date: 2026-07-07
tags:
  - web design
  - web performance
  - user experience
  - terminologia
layout: layouts/post.njk
image: ./cover.jpg
image_alt: "Uno sviluppatore pensieroso guarda schermi che mostrano siti web responsive e app adattive, chiedendosi informazioni sulla terminologia."
---

Nel lontano 2010, Ethan Marcotte ha coniato il termine [Responsive Web Design](https://ethanmarcotte.com/books/responsive-web-design/). Da allora, abbiamo usato "responsive" per descrivere un sito web che adatta il suo layout alle dimensioni del viewport. Griglie fluide, immagini flessibili, media queries.

<figure>
	{% image "cover.jpg", "Uno sviluppatore pensieroso guarda schermi che mostrano siti web responsive e app adattive, chiedendosi informazioni sulla terminologia.", [648, 1296], "648px", true %}
	<figcaption>Dovremmo usare "adattivo" per i layout e "responsive" per le performance?</figcaption>
</figure>

Per un certo periodo abbiamo cercato di separarlo dal design "adattivo" (adaptive). A quel tempo, i siti web "adattivi" avevano una cattiva reputazione perché di solito si affidavano al rilevamento del dispositivo lato server (device detection) e allo sniffing dello user-agent per servire codice HTML e CSS completamente diverso al browser. Poiché lo sniffing UA era fragile, la community web ha voluto prenderne le distanze. Il modello responsive di Ethan serviva lo stesso identico codice a tutti, lasciando che fosse il browser a fare il lavoro. Il termine "Responsive" ha vinto la guerra del vocabolario, e "adattivo" è diventato associato a layout obsoleti rilevati dal server.

Ma arriviamo a oggi: questi termini si sono divisi in modi che causano una reale confusione...

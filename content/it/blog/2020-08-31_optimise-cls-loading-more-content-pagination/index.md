---
title: "Come ottimizzare il CLS quando si caricano altri contenuti in modo asincrono"
description: "Il Cumulative Layout Shift (CLS) è un'importante metrica incentrata sull'utente per misurare la stabilità visiva, poiché aiuta a quantificare la frequenza con cui gli utenti riscontrano spostamenti imprevisti del layout — un CLS basso aiuta a garantire che l'esperienza sulla pagina sia piacevole."
tags:
  - cumulative layout shift
  - techniques
layout: layouts/post.njk
---

Il Cumulative Layout Shift (CLS) è un'importante metrica incentrata sull'utente per misurare la stabilità visiva, poiché aiuta a quantificare la frequenza con cui gli utenti riscontrano spostamenti imprevisti del layout — un CLS basso aiuta a garantire che l'esperienza sulla pagina sia piacevole.

{% image "optimise-cls-load-more.webp", "Un sito web che mostra 4 immagini e un pulsante Carica altro", [648, 1296], "648px" %}

Quello che forse non sai è che:

- **Il CLS viene misurato continuamente**. Di fatto, il suo valore viene aggiornato anche mentre gli utenti scorrono la pagina, se lo scorrimento genera movimenti del layout
- **La misurazione del CLS viene sospesa per 500 ms** ogni volta che si verifica un'interazione dell'utente, come un clic o un evento da tastiera

In parole povere, il Cumulative Layout Shift misura ogni movimento imprevisto del layout che si verifica mentre gli utenti interagiscono con la pagina, incluso quando scorrono verso il basso.

> Quando carichiamo altri contenuti nelle nostre pagine, la causa più comune di CLS è il footer della pagina che diventa visibile per un momento, per poi essere spinto nuovamente below-the-fold dal nuovo contenuto aggiunto dinamicamente.

Quindi, come possiamo evitare che il CLS aumenti quando dobbiamo caricare dinamicamente nuovi contenuti, ad esempio per caricare un'intera nuova pagina di prodotti?

[Continua a leggere su Medium](https://medium.com/ynap-tech/how-to-optimize-for-cls-when-having-to-load-more-content-3f60f0cf561c)

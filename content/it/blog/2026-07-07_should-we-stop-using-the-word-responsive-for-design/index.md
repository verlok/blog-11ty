---
title: "Dovremmo smettere di usare la parola \"Responsive\" per il design?"
description: "Come la definizione di \"responsive\" di Ethan Marcotte del 2010 si scontra con le linee guida delle app mobili sulla \"adattabilità\" e con le metriche di interattività delle performance web."
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

Ma arriviamo a oggi: questi termini si sono divisi in modi che causano una reale confusione.

## La definizione mobile di "adaptive" (Android e iOS)

Se guardiamo allo sviluppo di app mobili moderne — sia su Android che su iOS — la parola **"adaptive"** (adattivo) è lo standard.

Google la usa massicciamente per il design delle app Android. Con la diffusione di smartphone pieghevoli e tablet, le app non possono semplicemente allargarsi per riempire lo schermo. Hanno bisogno di ristrutturare completamente il proprio layout. Nella loro [guida sui layout adattivi](https://developer.android.com/design/ui/mobile/guides/layout-and-content/adapt-layout), il focus è interamente sui layout "adaptive" (ovvero che cambiano la struttura del layout in base a breakpoint e stati di piegatura del dispositivo), mentre i concetti "responsive" (come il dimensionamento fluido) sono visti solo come una base di partenza.

Apple segue una logica simile. Nelle loro [Human Interface Guidelines per il Layout](https://developer.apple.com/design/human-interface-guidelines/layout), inquadrano gli aggiustamenti di layout attorno al concetto di **"Adaptability"** (Adattabilità) piuttosto che di "Responsiveness". Guidano gli sviluppatori a creare interfacce che si adattano perfettamente a diversi dispositivi, dimensioni di schermo e orientamenti usando classi di dimensione (size classes) e strutture adattive.

Quindi, nel mondo delle app mobili, l'adattamento alle dimensioni dello schermo viene costantemente chiamato design _adaptive_.

## La definizione di "responsiveness" nelle performance web

Allo stesso tempo, nel mondo delle performance web — dove trascorro molto del mio tempo — la parola "responsive" ha assunto un significato completamente diverso.

Quando gli ingegneri delle performance dicono di voler rendere una pagina "responsive", non parlano affatto di viewport o media query. Parlano di **interattività**. Nello specifico, di quanto velocemente il browser reagisce agli input dell'utente.

Con la metrica di Google [Interaction to Next Paint (INP)](https://web.dev/inp/), la "responsiveness" viene misurata in millisecondi. Se un utente tocca un bottone e la pagina si blocca per 300 ms, quel sito web ha una scarsa reattività (responsiveness).

## La collisione terminologica

Questo ha creato un bel pasticcio.

Se un product manager dice: _"Dobbiamo rendere questo sito web più responsive."_
Cosa intende esattamente?

- Dobbiamo modificare le nostre media query CSS per i dispositivi pieghevoli e i tablet?
- Oppure dobbiamo spezzare i task JavaScript lunghi per migliorare il nostro INP?

Stiamo usando la stessa identica parola per indicare sia "si adatta alle dimensioni dello schermo" che "reagisce velocemente agli input dell'utente".

E questa confusione è destinata a crescere. Se parli con sviluppatori appena entrati nel settore, o se chiedi a un assistente di programmazione IA di "rendere questa UI più responsive", cosa faranno in realtà? Inizieranno a scrivere regole `@media` in CSS o apriranno i Chrome DevTools per profilare i tempi di blocco del thread principale (main thread)? Onestamente, entrambe le strade rappresentano un'interpretazione valida della parola.

## Una proposta: dividere la terminologia

Forse è giunto il momento di abbandonare la parola "responsive", almeno quando parliamo di dimensioni dello schermo.

E se iniziassimo a usare **"adaptive"** per tutto ciò che riguarda l'adattamento del layout (sia sul web che nelle app native), e riservassimo **"responsive"** puramente alle performance web?

Secondo questo modello:

- Un sito o un'app **adaptive** (adattivo) adatta il proprio layout al viewport (mobile, desktop, pieghevole).
- Un sito o un'app **responsive** (reattivo) risponde velocemente alle interazioni dell'utente (basso INP, nessun blocco del thread principale).

Per dirla in parole semplici, se dovessi spiegare questo concetto a mia madre, direi che un layout *si adatta* alle dimensioni dello schermo, non che "risponde" ad esse. È un modo di descriverlo decisamente più naturale.

Sembra più pulito, più logico e risolve la sovrapposizione terminologica. Ma la web community è pronta ad abbandonare la definizione del 2010 di Ethan Marcotte? O il "responsive design" è impresso troppo a fondo nei nostri cervelli?

Sono curioso di sapere cosa ne pensi. Questa distinzione ha senso o è troppo tardi per cambiare? Scrivimi pure per [farmi sapere cosa ne pensi](/contact/)!

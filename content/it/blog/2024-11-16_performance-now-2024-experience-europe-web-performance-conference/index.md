---
title: "La mia esperienza a performance.now() 2024: la principale conferenza sulla web performance in Europa"
description: "Un resoconto dettagliato della mia partecipazione e delle idee emerse frequentando e contribuendo a performance.now(), la più importante conferenza sulla web performance in Europa."
tags:
  - conferences
  - perf.now
---

Dal **14 al 15 novembre**, ho partecipato a [**performance.now**](https://www.perfnow.nl/) ad **Amsterdam**, la conferenza più stimata nel campo delle performance web in Europa. Per chi, come me, è profondamente immerso in questa nicchia dello sviluppo web, incontrare altre persone con le stesse passioni all'evento è stato sia stimolante sia prezioso.

<figure>
	{% image "cover.png", "performance.now() – Andrea Verlicchi – @verlok (he/him) – Speed Kit, IT, – Sponsor: Google, SpeedCurve, Mozilla, Akamai, Sentry. L'immagine contiene anche adesivi di Firefox, SpeedCurve #perfhero, No vanity metrics P50, Anti Javascript Javascript Club", [648, 1296], "648px" %}
	<figcaption>Il mio badge di performance.now 2024, oltre a gadget e adesivi</figcaption>
</figure>


## Contenuti e speaker eccezionali

<figure>
	{% image "schedule.png", "Programma del primo e del secondo giorno, disponibile anche seguendo il link nella didascalia della figura", [648, 1296], "648px", true %}
	<figcaption>Il <a href="https://perfnow.nl/schedule">programma</a> delle due giornate di conferenza.</figcaption>
</figure>

Fin dal primo momento è stato evidente che performance.now() si distingue per l'**alto livello dei contenuti e degli [speaker](https://perfnow.nl/speakers)**. Ogni sessione era curata nei minimi dettagli, con leader del settore che hanno affrontato una vasta gamma di sfide e soluzioni per le moderne performance web. 

I keynote hanno esplorato l'evoluzione dello scenario della velocità del web, sottolineando la necessità critica di reattività e di metriche incentrate sull'utente. I talk hanno affrontato svariati argomenti, dall'impatto dell'accessibilità sulle performance alle strategie pratiche per migliorare i Core Web Vitals, in particolare l'INP (Interaction to Next Paint). Altre presentazioni si sono concentrate su strumenti avanzati, ottimizzazione dei font e riduzione dell'impatto degli script di terze parti. 

Con studi di caso approfonditi e discussioni orientate al futuro, l'evento ha mostrato tecniche all'avanguardia e promosso una visione olistica delle web performance.

## Connettersi con professionisti affini

Uno dei momenti salienti della conferenza per me è stata l'opportunità di **connettermi con colleghi professionisti** che condividono la stessa passione per le performance web. Le numerose pause e la vivace festa serale hanno facilitato conversazioni significative e networking. È stato rigenerante scambiare idee, discutere di sfide ed esplorare potenziali collaborazioni con colleghi che comprendono davvero le complessità del nostro settore.

Oltre a partecipare, ho avuto l'onore di contribuire alla conferenza in due modi significativi. 

### Contribuire all'help desk sponsorizzato da Google

<figure>
	{% image "helpdesk_skyscanner.png", "Io all'help desk con Morten Sorth e Ismail Gunsaya di Skyscanner", [648, 1296], "648px", true %}
	<figcaption>Morten Sorth e Ismail Gunsaya di Skyscanner che mi chiedono consigli sull'ottimizzazione dell'INP</figcaption>
</figure>

Uno dei punti salienti per me è stata la partecipazione all'**Help Desk sponsorizzato da Google**, dove ho risposto per circa mezz'ora alle domande dei partecipanti offrendo soluzioni alle loro sfide di web performance. Questa esperienza mi ha permesso non solo di restituire qualcosa alla community, ma anche di imparare dalla grande varietà di problemi e prospettive presentati da altri professionisti.


### Partecipare all'intervista live di **Henri Helvetica su YouTube**

<figure>
	{% image "henri-helvetica-and-me.webp", "Henri Helvetica e io con un microfono verde e uno rosso durante lo streaming dal vivo", [648, 1296], "648px", true %}
	<figcaption>Henri Helvetica e io durante lo streaming dal vivo</figcaption>
</figure>

Un altro momento importante è stato partecipare all'**intervista dal vivo di Henri Helvetica su YouTube**. Essere intervistato da Henri mi ha dato l'opportunità di condividere la mia esperienza e il mio background con un pubblico più vasto. L'intervista ha approfondito il mio percorso e le mie sfide personali, ed è stato fantastico.

Date un'occhiata al [canale YouTube di Henri Helvetica](https://www.youtube.com/channel/UC927gvqy8i0vw0q5-6-WWBA).

## Pre-evento: Performance.Sync di Mozilla

**Il 13 novembre**, il giorno prima di Performance.now, ho avuto anche il piacere di partecipare a **Performance.Sync**, un evento organizzato da Mozilla. Durante questa sessione, il mio collega Brian Louis Ramirez ha tenuto una presentazione sul tema "**Finding the needle in the haystack**" (Trovare il ago nel pagliaio), incentrata sull'identificazione di anomalie nei **dati RUM (Real User Monitoring)**. 

Le intuizioni di Brian su come analizzare efficacemente enormi quantità di dati sulle prestazioni per individuare problemi critici sono state illuminanti e molto pratiche. La partecipazione a Performance.Sync mi ha fornito una comprensione più profonda delle tecniche avanzate di analisi dei dati e ha rafforzato l'importanza di un monitoraggio meticoloso nell'ottimizzazione delle performance web.

<figure>
	{% image "brian-perf-sync-needle-haystack.JPG", "Brian Louis Ramirez sul palco di Performance.sync 2024", [648, 1296], "648px", true %}
	<figcaption>Mesdames et messieurs, <a href="https://screenspan.net/">Brian Louis Ramirez</a> sul palco</figcaption>
</figure>


## Spunti raccolti e approfondimenti

Durante la conferenza ho preso alcuni appunti che rileggerò con attenzione, poiché molti di essi mi hanno spinto a pianificare delle attività.

- SpeedCurve ha scritto una [guida completa sulle web performance](https://www.speedcurve.com/web-performance-guide/)
- Ottima idea quella di correlare tasso di conversione e INP
- Configurare gli alert solo sui cambiamenti dei KPI principali, non quando cambiano i fattori abilitanti (enabler)
- Suddividere le regressioni in moderate, accettabili e critiche, in base alla percentuale di regressione
- Quando si verifica una regressione, analizzare chi, cosa, quando, dove e perché è accaduta
- ~Le immagini caricate in modalità lazy possono essere decodificate in modo asincrono, ma quelle caricate in modalità eager no.~ Discusso, vedi [cosa fa effettivamente `decode=async`](https://www.tunetheweb.com/blog/what-does-the-image-decoding-attribute-actually-do/). 
- La nuova funzionalità delle annotazioni nei Chrome DevTools sarà utilissima per me e altri professionisti
- Possiamo usare [crbug.com/new](https://crbug.com/new) per segnalare bug al progetto Chromium e richiedere nuove funzionalità
- Gli sviluppatori di Chrome stanno spostando le informazioni dal pannello Performance Insights a quello Performance — ce n'è uno anche per le prestazioni CSS, se si esegue una traccia con l'opzione "Selector stats (slow)" attiva
- I font variabili sono più leggeri solo se si utilizzano due o più variazioni dello stesso font, altrimenti conviene caricare la singola variazione (es. la versione bold per i titoli)
- La scheda CSS overview nei developer tools offre un'idea di quanti elementi della pagina utilizzano determinati font
- C'è un nuovo gruppo di lavoro per l'incremental font transfer, per scaricare solo la porzione di font di cui l'utente ha effettivamente bisogno al momento
- `size-adjust` (a livello di box) e `font-size-adjust` (a livello di font) sono utili per cercare di renderizzare il font di fallback in modo simile al web font. Ho preso nota di uno strumento chiamato css-size-adjust-tester, che al momento non riesco a trovare, mentre ho trovato il [generatore di font di fallback di Brian Louis Ramirez](https://screenspan.net/fallback/).
- Google Publisher Tag (GPT) ha una [funzionalità per cedere il controllo al main thread (yield)](https://developers.google.com/publisher-tag/reference#googletag.config.PageSettingsConfig.threadYield) per ottimizzare l'INP
- Quando ci sono buchi negli eventi di commit nei dev tools, controllate in altre tracce o caricate la traccia in Perfetto per capire il motivo

Questi appunti sono stati fondamentali per definire i passaggi successivi e integrare nuove tecniche nel mio flusso di lavoro, oltre che per i miei progetti personali. Condividere queste riflessioni sarà indubbiamente utile per chiunque voglia migliorare le proprie competenze sulle web performance.


## Riflessioni sull'esperienza

<figure>
	{% image "attendees.webp", "Partecipanti nelle prime file di performance.now()", [648, 1296], "648px", true %}
	<figcaption>Mi piace sedermi nelle prime file per interagire visivamente con gli speaker</figcaption>
</figure>

Partecipare a Performance.now è stata un'esperienza gratificante che ha rafforzato il mio impegno per l'eccellenza nelle performance web. Il mix di **contenuti di alto livello, speaker esperti e una community vibrante** rende questo evento imperdibile per chiunque operi in questa nicchia. Non vedo l'ora di applicare le conoscenze acquisite e di contribuire ulteriormente al dialogo continuo nel nostro settore.

Se avete la passione per le web performance e desiderate migliorare le vostre competenze, vi consiglio caldamente di partecipare a Performance.now. Non è solo una conferenza: è un incontro tra le menti più brillanti dedicate a spingere i limiti di ciò che è possibile sul web.

*Non esitate a contattarmi se avete domande sulla conferenza o sulle web performance in generale!*

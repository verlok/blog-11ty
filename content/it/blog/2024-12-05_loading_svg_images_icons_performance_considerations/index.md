---
title: "Ottimizzare l'uso degli SVG per le prestazioni web: una guida completa"
description: "Confronto tra varie tecniche per renderizzare gli SVG: SVG inline, tag `<img>`, sfondi CSS e sprite SVG. Ecco una sintesi delle principali considerazioni e raccomandazioni dal punto di vista del design e delle performance web."
tags:
  - svg
  - web performance
---

In una recente conversazione tra appassionati di web performance, è stato approfondito il tema del caricamento efficiente degli SVG (Scalable Vector Graphics) sui siti web. La discussione si è concentrata sui metodi migliori per integrare gli SVG, in particolare le icone, con un occhio di riguardo alle prestazioni. Sono state confrontate diverse tecniche: SVG inline, il tag `<img>`, gli sfondi CSS e gli sprite SVG. Ecco un riassunto dei punti chiave e dei consigli emersi da quel confronto.

<figure>
	{% image "svg-icons.jpg", "Un set di icone SVG", [648, 1296], "648px" %}
	<figcaption>Le immagini SVG sono ampiamente utilizzate per creare icone sul web</figcaption>
</figure>

Vediamo nel dettaglio i metodi per caricare gli SVG.

## 1. SVG inline

**Utilizzo:** Ideale per icone above-the-fold come loghi o pulsanti di menu, specialmente quando è necessario stilizzare o animare singoli elementi all'interno dell'SVG usando CSS o JavaScript.

**Vantaggi:**

- **Flessibilità di stile:** consente la manipolazione diretta degli elementi SVG.
- **Rendering immediato:** nessuna richiesta HTTP aggiuntiva poiché l'SVG è parte integrante dell'HTML.

**Svantaggi:**

- **Aumento delle dimensioni del DOM:** ogni SVG inline si aggiunge al DOM, il che può influire sulle prestazioni.
- **Impatto prestazionale:** elementi selezionabili e stilizzabili possono influire sulle prestazioni di rendering.

**Best practice:**

- **URL-Encoding invece di Base64:** quando si incorporano SVG inline tramite data URL, è preferibile utilizzare l'URL-encoding rispetto a base64 per ottenere una compressione migliore.
- **Limitarne l'uso:** riservare gli SVG inline per elementi grafici essenziali above-the-fold che richiedono interattività.

## 2. Il tag `<img>`

**Utilizzo:** Adatto per icone e immagini generiche dove non sono richiesti stili particolari o interazioni.

**Vantaggi:**

- **Lazy Loading:** supporta l'attributo `loading="lazy"` per posticipare il caricamento delle immagini finché non sono necessarie.
- **DOM più snello:** mantiene il DOM più pulito rispetto agli SVG inline.

**Svantaggi:**

- **Stile limitato:** non è possibile manipolare direttamente gli elementi interni dell'SVG tramite CSS o JavaScript.
- **Contenuto statico:** non è l'ideale per icone che devono cambiare colore o forma al passaggio del mouse.

**Best practice:**

- **Attributi delle dimensioni:** includere sempre `width` e `height` per evitare spostamenti di layout (layout shift).
- **Evitare il lazy loading per gli asset immediati:** non applicare il lazy-loading a immagini cruciali per il rendering iniziale o per interazioni immediate come gli stati di hover.

## 3. Immagini di sfondo CSS

**Utilizzo:** Ideale per elementi grafici decorativi o pattern di sfondo che non richiedono interattività.

**Vantaggi:**

- **Separazione dei ruoli (Separation of Concerns):** mantiene le immagini di sfondo nel CSS, lasciando la struttura HTML pulita.
- **Caricamento condizionale:** può essere combinato con media query o JavaScript per design reattivi.

**Svantaggi:**

- **Controllo limitato:** più difficile da manipolare o animare rispetto agli SVG inline.
- **Problemi di accessibilità:** le immagini di sfondo non vengono lette dagli screen reader.

**Best practice:**

- **Lazy Loading:** utilizzare librerie JavaScript come [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) per posticipare il caricamento delle immagini di sfondo non immediatamente visibili.
- **Utilizzo appropriato:** riservare solo a elementi decorativi non critici.

## 4. Sprite SVG e tag `<use>`

**Utilizzo:** Efficace quando si hanno più istanze di icone che devono essere stilizzate o animate, e quando gli SVG vengono serviti dallo stesso dominio.

**Vantaggi:**

- **Simboli riutilizzabili:** consente di definire i simboli SVG una sola volta e richiamarli più volte.
- **Capacità di stile:** consente la stilizzazione CSS degli elementi SVG come se fossero inline.
- **Meno richieste HTTP:** raggruppa le icone in un unico file.

**Svantaggi:**

- **Complessità di configurazione iniziale:** richiede la creazione e la gestione di un file di sprite esterno.
- **Same-Origin Policy:** lo sprite SVG esterno deve trovarsi sullo stesso dominio a causa delle restrizioni di sicurezza del browser.

**Best practice:**

- **Organizzazione efficiente:** raggruppare le icone usate più di frequente in un unico file di sprite.
- **Soluzioni di fallback:** implementare alternative per i browser che potrebbero non supportare gli sprite SVG esterni.

## Scegliere il metodo in base al caso d'uso

Scegliete il metodo di caricamento degli SVG in base alle esigenze specifiche del progetto. SVG inline per elementi interattivi, tag `<img>` per icone statiche, sfondi CSS per immagini decorative e sprite SVG per icone riutilizzabili e stilizzabili.

## Considerazioni sulle prestazioni

- **La dimensione del DOM conta:** un numero eccessivo di SVG inline può appesantire il DOM e peggiorare le prestazioni.
- **Lazy loading intelligente:** usate il lazy loading per le immagini non immediatamente necessarie, ma evitatelo per le risorse necessarie per le interazioni iniziali o per gli effetti di hover.
- **Tecniche di compressione:** preferite l'URL-encoding rispetto a base64 quando incorporate gli SVG nei data URL per mantenere rapporti di compressione migliori.

## Stile e interattività

- **Icone interattive:** usate gli SVG inline o gli sprite SVG con il tag `<use>` quando le icone devono rispondere alle interazioni dell'utente.
- **Icone statiche:** usate il tag `<img>` per le icone che non richiedono interattività per mantenere il DOM leggero.

## Accessibilità e semantica

- **Attributi corretti:** includete l'attributo `alt` per i tag `<img>` e `aria-label` o `role="img"` per gli SVG inline per migliorare l'accessibilità.
- **Evitare immagini di sfondo per contenuti essenziali:** poiché le immagini di sfondo CSS vengono ignorate dalle tecnologie assistive, non utilizzatele per contenuti importanti.

## Evitare tecniche superate:

- **Sprite di immagini:** i tradizionali sprite di immagini (CSS sprites) sono ampiamente considerati obsoleti a causa della complessità e dei rendimenti decrescenti nell'era di HTTP/2 e HTTP/3.
- **Font di icone (Icon Fonts):** valutate la migrazione dai font di icone agli SVG per una migliore scalabilità e flessibilità di stile, come descritto nell'[articolo di Erwin Hofman](https://calendar.perfplanet.com/2021/from-fonts-to-svg-an-icon-migration-strategy/).

## Conclusione

Ottimizzare l'uso degli SVG sui siti web richiede un equilibrio tra prestazioni, manutenibilità e funzionalità. Scegliendo il metodo appropriato per caricare gli SVG in base al loro scopo — che si tratti di visualizzazione statica, personalizzazione dello stile o interattività — è possibile migliorare sia l'esperienza utente sia le prestazioni del sito. Ricordate di considerare fattori come la dimensione del DOM, il lazy loading e l'accessibilità quando implementate gli SVG nei vostri progetti.

## Approfondimenti

- [SVG sprites generator](https://svgsprit.es/)
- [Styling SVG <use> Content with CSS](https://tympanus.net/codrops/2015/07/16/styling-svg-use-content-css/) di Sara Soueidan
- [From Fonts to SVG: An Icon Migration Strategy](https://calendar.perfplanet.com/2021/from-fonts-to-svg-an-icon-migration-strategy/) di Erwin Hofman
- [Repository GitHub di vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) di Andrea Verlicchi (il sottoscritto)

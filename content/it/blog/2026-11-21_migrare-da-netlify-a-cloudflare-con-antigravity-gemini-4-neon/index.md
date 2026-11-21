---
title: "Ho fatto pilotare il browser ad Antigravity e Gemini 4 Neon per migrare il mio blog su Cloudflare"
description: "Da performance.now() ad Amsterdam a Cloudflare Workers con HTTP/3 e QUIC 0-RTT: come Antigravity e Gemini 4 Neon hanno gestito non solo il codice, ma anche le dashboard di Cloudflare e GoDaddy (persino in olandese) pilotando direttamente il browser."
date: 2026-11-21
tags:
  - ai
  - antigravity
  - gemini
  - cloudflare
  - web performance
  - perf.now
layout: layouts/post.njk
translationKey: "2026-11-21_netlify-to-cloudflare-antigravity-gemini-4-neon"
image: ./cover.png
image_alt: "Schermata della dashboard di Cloudflare durante il trasferimento DNS del blog, con un ingrandimento sul cursore di Antigravity e il badge 'Thinking...' mentre l'agente opera direttamente nel browser."
---

<figure>
	{% image "cover.png", "Schermata della dashboard di Cloudflare durante il trasferimento DNS del blog, con un ingrandimento sul cursore di Antigravity e il badge 'Thinking...' mentre l'agente opera direttamente nel browser.", [648, 1296], "648px", false %}
	<figcaption>Antigravity al lavoro direttamente dentro la dashboard di Cloudflare: il cursore si muove, "pensa" e clicca sotto i miei occhi.</figcaption>
</figure>

Ieri, 20 novembre 2026, ero seduto in sala a [**performance.now()**](https://www.perfnow.nl/) ad **Amsterdam**. Sul palco c'era [**Max Inden**](https://max-inden.de), che stava parlando di come **HTTP/3** e **QUIC 0-RTT** permettano di tagliare diversi round-trip durante la connessione di rete e velocizzare il caricamento delle pagine. A un certo punto del talk ha lanciato una sfida al pubblico: aprire [**savearoundtrip.com**](https://savearoundtrip.com/) e verificare come se la cavasse il proprio sito.

Ho inserito l'indirizzo di questo blog e il responso è stato impietoso: **Netlify** — dove ospitavo il sito fino a ieri — non supportava né QUIC né HTTP/3. Per ottenerli, la via più diretta era migrare su **Cloudflare** (che peraltro era sponsor della conferenza).

<figure>
	{% image "http-3-fail-savearoundrip-andreaverlicchi.png", "Checklist HTTP/3 di savearoundtrip.com per andreaverlicchi.eu con 0 controlli superati su 4: falliscono il supporto HTTP/3, l'header HTTP Alt-Svc e il record DNS HTTPS, mentre QUIC 0-RTT per visite ripetute è non applicabile perché richiede prima HTTP/3.", [648, 1296], "648px", true %}
	<figcaption>Ecco come falliva il check del mio sito per HTTP/3 e 0-RTT prima della migrazione a Cloudflare.</figcaption>
</figure>

C'era anche un incentivo extra: uno **swag di Mozilla** in palio per chi avesse mostrato allo speaker, dopo il talk, che il proprio sito passava tutti e 5 i check svolti da savearoundtrip.com. Così mi sono detto: *"Ma sì, lo faccio al volo tra un talk e l'altro!"*. Spoiler: la migrazione è riuscita ma non è stata proprio immediata, quindi lo swag mi è sfuggito, ma l'esperienza vissuta in quell'ora di migrazione mi ha letteralmente lasciato a bocca aperta e merita di essere raccontata.

## Oltre il codice: quando l'AI prende il controllo del browser

Che Gemini, Claude o qualsiasi altro modello AI riuscissero ad adattare il codice del blog — costruito con Eleventy — per passare da Netlify a Cloudflare me lo potevo aspettare: riscrivere file di configurazione, redirect o piccole funzioni serverless è il loro pane quotidiano.

Quello che invece mi ha completamente sorpreso, e su cui voglio concentrare la prima parte di questo racconto, è stato vedere **Antigravity e Gemini 4 Neon pilotare direttamente il browser web integrato**, cliccando e compilando moduli al posto mio, mentre io osservavo la scena e controllavo (con un occhio allo schermo e uno alla conferenza) cosa facessero.

Ci sono arrivato quasi per esasperazione. All'inizio stavo seguendo il copione classico: io tenevo aperta la dashboard di Cloudflare e chiedevo all'AI come procedere. Peccato che Gemini continuasse a indirizzarmi verso una voce nascosta e difficilissima da scovare tra i mille menu di Cloudflare. Stavo per entrare nel solito loop frustrante che conosciamo tutti:

- "Vai nella sezione X e clicca Y."
- "Non c'è, non la trovo."
- "Scusa, fammi controllare la documentazione... ah ok, hanno spostato il menu, prova sotto Z."

_Questo anche perché io avevo trovato della documentazione obsoleta su come migrare a Cloudflare Pages, ma Cloudflare sta deprecando Pages in favore di Workers. Ci arrivo._

A quel punto ho cambiato approccio: invece di fare io da "braccio meccanico" alle istruzioni testuali dell'AI, ho chiesto ad Antigravity di **pilotare direttamente il browser**, e vedersela lui con l'interfaccia diversa dalle aspettative. E da lì in poi lo scenario è cambiato completamente.

Sotto la mia supervisione diretta, l'agente ha:

*   **Esplorato la dashboard di Cloudflare** fino a trovare da solo la sezione corretta, senza che dovessi impazzire io a cercarla nei sottomenu.
*   **Interagito con i controlli dell'interfaccia**: ha cliccato pulsanti, compilato campi di testo, configurato il progetto, gestito i record DNS e impostato le regole di redirect.
*   **Operato anche sul pannello del mio registrar** per puntare i nameserver del dominio verso Cloudflare anziché verso Netlify.
*   **Gestito persino una seconda migrazione completa** — da **Cloudflare Pages** a **Cloudflare Workers** — nel momento in cui mi sono accorto di aver appena migrato il sito su un prodotto che Cloudflare sta progressivamente deprecando (e che, ironia della sorte, era proprio ciò che bloccava lo 0-RTT!).

### Un particolare divertente: GoDaddy in olandese

Trovandomi ad Amsterdam, c'è stato un ulteriore ostacolo comico: appena ho aperto il sito del mio registrar per cambiare i nameserver, l'intera interfaccia si è caricata in **olandese**. Ho provato per un paio di minuti a cercare il selettore della lingua per rimetterlo in inglese o in italiano, ma non riuscivo proprio a trovarlo. Ma poi mi sono chiesto: serve davvero cambiare lingua, se il modello AI è multilingua?

Infatti, **la lingua diversa non lo ha minimamente scalfito**: l'agente ha navigato tra le impostazioni di GoDaddy in olandese — cliccando con totale naturalezza su voci come *Naamservers* e confermando i moduli nella lingua locale. Go, Dutch Daddy!


### Perché è stato mind-blowing

Grazie alla **delega delle operazioni nel browser all'AI** sono riuscito a **risparmiare tempo**, facendo la migrazione tra un talk e l'altro, mentre controllavo cosa stava succedendo a schermo.

Finora avevo fatto pilotare i browser all'AI solo per motivi di test o analisi delle pagine web, non per fare qualcosa al posto mio. Ma l'ho trovato super utile perché non mi capita molto spesso di migrare un dominio, avere a che fare con record DNS, cambiare nameserver o orientarmi nelle dashboard cloud che, peraltro, cambiano interfaccia ogni sei mesi.

Vedere un agente operare nel browser al posto mio in pochi minuti, sotto la mia supervisione, secondo me aggiunge un altro tassello al puzzle delle attività che l'AI può aiutarti a completare.

## Il video della migrazione

Ho registrato lo schermo durante diverse fasi del processo per mostrare dal vivo Antigravity mentre muove il cursore, naviga le dashboard e completa le configurazioni. Ecco il video qui di seguito.

<iframe width="560" height="315" src="https://www.youtube.com/embed/S7HjcHmonYc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" style="width: 100%; height: auto; aspect-ratio: 16 / 9"></iframe>

## Il risultato finale: 5 su 5

Alla fine la migrazione è andata completamente a buon fine: questo blog ora gira su **Cloudflare Workers**, e rilanciando il controllo su `savearoundtrip.com` sono finalmente comparse tutte e 5 le spunte verdi — sia per HTTP/3 che per QUIC 0-RTT.

<figure>
	{% image "http-3-success-savearoundrip-andreaverlicchi.png", "Checklist HTTP/3 di savearoundtrip.com per andreaverlicchi.eu con 5 controlli superati su 5: HTTP/3 servito, annunciato nell'header HTTP Alt-Svc e nel record DNS HTTPS, più QUIC 0-RTT attivo sia per visite ripetute che per richieste GET con query string.", [648, 1296], "648px", true %}
	<figcaption>Il risultato finale su savearoundtrip.com dopo la migrazione su Cloudflare Workers: 5 controlli superati su 5.</figcaption>
</figure>

---

## Dietro le quinte: tutto ciò che abbiamo fatto passo dopo passo

Per chi è curioso di conoscere i dettagli tecnici dell'intera operazione, ecco il racconto completo di tutto ciò che Gemini 4 Neon e Antigravity hanno gestito tra codice, dashboard, DNS e debugging fino al tanto agognato 5 su 5 su `savearoundtrip.com`.

### 1. Adattare il codice del blog da Netlify a Cloudflare Pages

Il primo passo è stato liberare il repository di questo blog (basato su Eleventy v3) dalla configurazione specifica di Netlify. L'agente ha rimpiazzato `netlify.toml` spostando tutti i vecchi redirect statici nel file `public/_redirects`, che Eleventy copia direttamente nella cartella di output `_site`, facendo attenzione a ordinare le regole statiche prima delle regole con wildcard come richiede Cloudflare.

C'era però una logica un po' più delicata: sulla root del sito avevo un redirect automatico basato sull'header `Accept-Language` del browser, per indirizzare i visitatori su `/it/` o `/en/` a seconda della lingua preferita. Su Netlify bastava una regola dichiarativa, mentre su Cloudflare Pages serviva un po' di codice ad hoc: l'agente ha quindi scritto una Cloudflare Pages Function (`functions/index.js`) capace di leggere correttamente i pesi di qualità (`q=...`) dell'header `Accept-Language` e restituire un `302` accompagnato dagli header corretti (`Vary: Accept-Language` e `Cache-Control: private, no-store`).

Prima di passare al deploy, abbiamo anche sistemato la coerenza SEO del dominio: abbiamo aggiornato `_data/metadata.js` e `content/index.html` per puntare ovunque a `https://www.andreaverlicchi.eu/` (in linea con il redirect dal dominio apex verso `www`), fatto il merge del branch su `main`, eseguito una build completa di tutti i 295 file del sito e verificato che `canonical`, `hreflang`, `og:url` e `sitemap.xml` non avessero più alcun riferimento residuo al dominio senza `www`.

### 2. Dashboard di Cloudflare e GoDaddy con il pilota automatico

Una volta pronto il codice su GitHub, Antigravity ha aperto il browser e ha preso in mano tutta la parte infrastrutturale.

Per prima cosa ha creato il progetto `blog-11ty` su **Cloudflare Pages**, collegandolo al repository GitHub con il comando di build `npm run build`, la directory di output `_site` e Node 20 (letto da `.nvmrc`), verificando che il primo deploy andasse a buon fine.

Subito dopo è passato alla configurazione DNS su Cloudflare: ha aggiunto la zona `andreaverlicchi.eu` sul piano gratuito e ha ripulito i quattro vecchi record `A` di Netlify che lo scanner automatico di Cloudflare aveva importato dalla configurazione precedente.

A quel punto è arrivato il momento del registrar — il famoso **GoDaddy in olandese**. L'agente è entrato nella sezione *Naamservers*, ha sostituito i vecchi nameserver di Netlify/NS1 con quelli assegnati da Cloudflare e ha atteso finché la zona non è risultata attiva in modalità *Full DNS Setup*. Infine, tornato su Cloudflare, ha collegato sia `andreaverlicchi.eu` che `www.andreaverlicchi.eu` come domini personalizzati del progetto e ha attivato la regola di redirect `301` da root a `www` preservando eventuali query string.

### 3. Il mistero dello 0-RTT (e il debugging da detective)

Con il blog ormai servito da Cloudflare, sono corso subito su `savearoundtrip.com` pronto a godermi il risultato. E invece: **3 su 5**. HTTP/3 funzionava alla perfezione, ma il controllo su **QUIC 0-RTT per le visite ripetute** risultava rosso (`0-RTT enabled: no`). È stato proprio questo intoppo a farmi sfumare lo swag di Mozilla!

Qui però Gemini 4 Neon mi ha stupito per la seconda volta, tirando fuori doti investigative notevoli:

1.  **Controllo via API**: ha interrogato direttamente le API di Cloudflare per verificare lo stato reale della zona, confermando che `http3`, `0rtt`, `tls_1_3` (con zero round-trip), `ech` e `always_use_https` erano tutti attivi — approfittandone anche per impostare la versione minima di TLS a **TLS 1.2**, un buon equilibrio tra sicurezza moderna e compatibilità.
2.  **Lettura del codice sorgente del tool di test**: invece di tirare a indovinare, l'agente è andato su GitHub a leggersi il codice Go del checker di `savearoundtrip.com` (`mxinden-bot/savearoundtrip`) per vedere *esattamente* cosa verificasse. Ha scoperto che lo strumento apre una connessione QUIC v1, invia una richiesta `HEAD /`, attende un `NewSessionTicket` TLS 1.3 e controlla che il flag `EarlyData` sia abilitato.
3.  **Isolamento della causa**: abbiamo lanciato il test sia sul mio dominio che sull'hostname interno `.pages.dev` — tutti e tre fallivano lo 0-RTT. Confrontandoli con `savearoundtrip.com` stesso, che girava sugli *stessi identici IP gratuiti di Cloudflare* ma otteneva un bel **5 su 5**, il quadro è diventato cristallino: i Custom Domain di Cloudflare Pages passano attraverso uno strato interno legato a `pages.dev` che sul piano Free non esponeva QUIC 0-RTT.

E proprio mentre indagavamo su questo comportamento, mi sono reso conto che **Cloudflare Pages** è la soluzione che Cloudflare stessa sta progressivamente lasciando alle spalle in favore di **Cloudflare Workers (con Static Assets)**.

### 4. La virata su Cloudflare Workers e il 5 su 5 immediato

A quel punto la scelta era ovvia: abbandonare Pages e migrare tutto su **Cloudflare Workers con Static Assets**, così da agganciare il dominio direttamente alla configurazione TLS/0-RTT della zona.

Lato codice l'operazione è stata rapidissima e molto pulita. L'agente ha creato `wrangler.jsonc` indicando `./_site` come cartella degli asset statici, configurato la gestione della pagina 404 e degli slash finali, e aggiunto un'ottimizzazione furba: `run_worker_first: ["/"]`. In questo modo il Worker JavaScript (`src/worker.js`, dove abbiamo trasferito la logica di redirect basata su `Accept-Language`) viene invocato **soltanto sulla homepage**, mentre tutte le altre pagine HTML, le immagini e le regole di `_redirects` vengono servite direttamente dall'edge senza consumare invocazioni del Worker.

Dopo un controllo locale della sintassi e della build di Eleventy, push su `main` e di nuovo Antigravity al volante nel browser:

*   ha creato il nuovo Worker `andreaverlicchi-blog` collegato a GitHub (`npm run build` + `npx wrangler deploy`) e seguito la prima build, riuscita al primo tentativo con tutti i 295 file statici caricati sull'edge;
*   ha scollegato `andreaverlicchi.eu` e `www.andreaverlicchi.eu` dal vecchio progetto Pages (lasciando che Cloudflare rimuovesse automaticamente i vecchi record `CNAME` verso `pages.dev`);
*   ha associato entrambi i domini come **Custom Domains** del nuovo Worker, generando i relativi record DNS gestiti da Cloudflare.

Appena finito lo scambio, nuovo giro su `savearoundtrip.com` — e questa volta è arrivato un **5 su 5 istantaneo**:

*   **HTTP/3 servito**: confermato.
*   **HTTP/3 annunciato via `Alt-Svc`**: confermato (`h3=":443"; ma=86400`).
*   **HTTP/3 annunciato nel record DNS HTTPS**: confermato (`alpn: h3 h2`, con `ech` configurato).
*   **QUIC 0-RTT per visite ripetute**: confermato (`0-RTT enabled: yes`).
*   **QUIC 0-RTT anche su `GET` con query string**: confermato.

Come tocco finale, abbiamo verificato dal vivo che tutti i redirect funzionassero (sia dall'apex al `www` con scelta della lingua, sia i vecchi percorsi come `/about/` verso `/en/about/`), rimosso dal repository l'ormai inutile `functions/index.js` e cancellato definitivamente il vecchio progetto Pages dalla dashboard di Cloudflare.

## Concludendo

Alla fine lo swag di Mozilla non l'ho vinto, è vero. Però torno da Amsterdam con un blog più veloce — finalmente su HTTP/3 e QUIC 0-RTT — ospitato su un'architettura moderna basata su Cloudflare Workers, e soprattutto con la consapevolezza che il modo in cui interagiamo con i servizi web può cambiare, anche prima dell'affermazione del protocollo di contesto Web (Web MCP).

Un agente AI non si limita più a suggerirti dove cliccare, ma apre il browser, naviga una dashboard in olandese e porta a termine il lavoro sotto i tuoi occhi: questo è il prossimo livello.

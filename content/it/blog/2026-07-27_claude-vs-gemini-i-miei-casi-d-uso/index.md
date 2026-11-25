---
title: "Claude vs Gemini, i miei casi d'uso"
description: "Un confronto pratico tra Anthropic Claude e Google Gemini: come li integro nel mio workflow quotidiano tra sviluppo, lavoro e vita personale."
date: 2026-07-27
tags:
  - ai
  - productivity
layout: layouts/post.njk
translationKey: "2026-07-27_claude-vs-gemini"
image: ./cover.jpg
image_alt: "Andrea pensieroso con due fumetti che mostrano i loghi di Anthropic Claude e Google Gemini."
---

C'è molto hype e si fa molto parlare di Claude ed Anthropic, soprattutto dopo l'annuncio di Fable 5 e, ultimamente, di Opus 5. Lo uso Claude eh, mica dico che non lo uso! Però per molte cose preferisco ancora **Gemini 3.6 Flash**.

Il motivo è semplice: sebbene la mia azienda abbia adottato Claude in full e ne spinga fortemente l'utilizzo, essendo molto in contatto con Google ed altri sviluppatori Google per via del programma **GDE (Google Developer Experts)**, sento pareri entusiasti anche sul fronte Gemini. Quindi voglio continuare a provarli e utilizzarli entrambi.

Non dico che per me si equivalgano in tutto, ma ci sono casi d'uso ben precisi in cui preferisco l'uno e casi in cui preferisco l'altro. Ecco come li ho divisi nel mio workflow quotidiano:

<figure>
	{% image "cover.jpg", "Andrea pensieroso con due fumetti che mostrano i loghi di Anthropic Claude e Google Gemini.", [648, 1296], "648px" %}
	<figcaption>Claude o Gemini? I due fumetti rappresentano le mie opzioni quotidiane di IA.</figcaption>
</figure>

## Claude in Claude Desktop

- **Task complessi e multi-tool**: Lunghi task che prevedono lettura e scrittura su più strumenti aziendali, tra cui lo Slack aziendale, Hex, o altri tool di integrazione.

## Claude in Claude Code

- **Sviluppo di codice complesso**: Per task di codice impegnativi (quelli che richiedono un bel po' di ragionamento, come i major release refactoring), mi affido ai modelli _Fable 5, Opus 4.8 o Sonnet 5_. Spesso questi task prevedono l'integrazione diretta con tool via CLI come GitLab (`glab`), Google Cloud (`gcloud`), o i nostri server MCP interni.
- **Troubleshooting di Git (con Haiku)**: Per uscire da situazioni complicate con `git` (ad esempio quando devo prendere gli ultimi commit fatti per errore su `main` e spostarli in un feature branch, oppure forzare il push su `staging` ignorando quello che c'era già — non giudicatemi: non ho quasi mai usato `git` da riga di comando, sono pigro!).

## Gemini in Antigravity / Antigravity IDE

- **Task di codice mediamente complessi**: Per feature medio-grandi utilizzo **Gemini 3.6 Flash (high)**.
- **DevTools e analisi di performance**: Per task che prevedono di utilizzare i DevTools for Agents e magari fare analisi approfondite di performance web, uso **Gemini 3.6 Flash (medium)**.
- **Manutenzione ed evoluzione del blog**: Per lavorazioni varie a questo blog (ad esempio di recente l'ho tradotto interamente in italiano, ho creato skill personalizzate per creare nuovi blog post, etc.), uso **Gemini 3.6 Flash (medium/high)**. Spoiler: questo stesso blog post, compresa l'immagine di copertina, è stato generato proprio con Antigravity e Gemini 3.6 Flash (Medium)!

## Gemini (web / desktop) – Account Personale

Per domande sulla vita, l'universo e tutto quanto (tanto la risposta è sempre [42](https://it.wikipedia.org/wiki/Risposta_alla_domanda_fondamentale_sulla_vita,_l%27universo_e_tutto_quanto)):

- **Accoglienza gattini**: Come accogliere due cuccioli di gatto non avendo mai avuto animali (una lunga chat ancora attiva dopo un mese!).
- **Alimentazione e nutrizione**: Consigli sull'alimentazione e piano alimentare (diverse chat generate mensilmente con Gem sempre aggiornati, per oltre 1 anno).
- **Progetti di casa**: Dimensionare correttamente un impianto fotovoltaico (chat fissata che mi servirà a breve).

## Gemini (web / desktop) – Account Aziendale

Per domande puramente work-related:

- **Analisi di codice**: Analisi di librerie JS minificate.
- **Ottimizzazione SQL**: Comparazione della complessità e dei costi delle query SQL.
- **Debugging di errori**: Analisi di stack trace o errori Python / JavaScript poco chiari.
- **Workflow Slack**: Richieste su come realizzare automazioni e feature avanzate in Slack (workflows, app, automations).

## Gemini (web / desktop) – Entrambi gli account

Ci sono poi casi d'uso trasversali per cui Gemini è il mio punto di riferimento sia sul profilo personale che aziendale:

- **Ricerche web persistenti**: Ricerche i cui risultati voglio che rimangano salvati in una history accessibile, anziché andare persi per sempre _come lacrime nella pioggia_.
- **Analisi di documenti e file**: Analisi di file caricati per estrarre informazioni ben organizzate.
- **Domande tech e configurazioni**: Risolvere dubbi tecnici, come configurare strumenti o far comunicare servizi tra loro, oppure capire come funzionano internamente alcuni aspetti dei modelli AI.
- **Brainstorming e presentazioni**: Discussione e generazione di idee su come preparare una presentazione.

---

In conclusione: non esiste un unico modello "vincitore" assoluto per ogni esigenza. Sperimentare con entrambi permette di sfruttare il meglio di ciascun ecosistema e di adattare lo strumento giusto al task specifico!

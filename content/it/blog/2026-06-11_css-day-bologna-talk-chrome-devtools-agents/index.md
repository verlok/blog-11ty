---
title: "Talk: \"Ehi Gemini, sistema il CSS!\" al CSS Day Bologna"
description: "Ho parlato al CSS Day Bologna di Chrome DevTools for Agents (DTA), mostrando come utilizzare il Model Context Protocol (MCP) per fare il debug di layout, visualizzazioni responsive e accessibilità in linguaggio naturale."
date: 2026-06-11
tags:
  - talks
  - ai
  - css
  - chrome-devtools
layout: layouts/post.njk
image: ./cover.png
image_alt: "Ehi Gemini, sistema il CSS!"
---

<figure>
	{% image "cover.png", "Ehi Gemini, sistema il CSS!", [648, 1296], "648px", true %}
	<figcaption>Talk: "Ehi Gemini, sistema il CSS!" al CSS Day Bologna</figcaption>
</figure>

<time datetime="2026-06-11">Giovedì 11 giugno 2026</time>, ho avuto il piacere di tenere una presentazione alla conferenza [CSS Day](https://cssday.it/) a Bologna.

Vi siete mai chiesti quanto tempo perdiamo ogni giorno a fare clic con il tasto destro su "Ispeziona", cambiare la dimensione del viewport 50 volte o andare a caccia di quella singola regola CSS che sovrascrive i nostri stili? I tradizionali assistenti di programmazione IA sono eccezionali, ma sono "ciechi" rispetto all'ambiente live del browser: non possono vedere il DOM in memoria, il traffico di rete o gli errori in console.

In questo talk del CSS Day, esploriamo **Chrome DevTools for Agents** (noto anche come DTA), uno strumento rilasciato in versione 1.0 a maggio durante il Google I/O. Grazie al **Model Context Protocol** (MCP), questo tool espone le funzionalità native di DevTools direttamente agli agenti IA (come Gemini, Claude Code, Cursor o Antigravity).

Il risultato? L'IA può navigare, ispezionare fogli di stile, compilare moduli ed eseguire un vero e proprio debugging per nostro conto.

## Guarda il video

<iframe width="560" height="315" src="https://www.youtube.com/embed/Ol2Xo29Z3tE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy" style="width: 100%; height: auto; aspect-ratio: 16 / 9"></iframe>

## Slide

Puoi scaricare o visualizzare le slide della presentazione qui:
[🔗 Scarica le slide della presentazione (PDF)](/pdf/ehi-gemini-sistema-il-css-chrome-devtools-for-agents-css-day-2026.pdf)

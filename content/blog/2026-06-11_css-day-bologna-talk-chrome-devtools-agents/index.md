---
title: 'Talk: "Ehi Gemini, sistema il CSS!" at CSS Day Bologna'
description: "I spoke at CSS Day Bologna about Chrome DevTools for Agents (DTA), showing how to use the Model Context Protocol (MCP) to debug layout, responsive views, and accessibility in natural language."
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
	<figcaption>Talk: "Ehi Gemini, sistema il CSS!" at CSS Day Bologna</figcaption>
</figure>

On <time datetime="2026-06-11">Thursday, June 11th, 2026</time>, I had the pleasure of presenting at the [CSS Day](https://cssday.it/) conference in Bologna.

Have you ever wondered how much time we waste every day right-clicking to "Inspect", changing the viewport size 50 times, or hunting down that one CSS rule overriding our styles? Traditional AI programming assistants are outstanding, but they are "blind" to the live browser environment: they cannot see the in-memory DOM, network traffic, or console errors.

In this talk from CSS Day, we explore **Chrome DevTools for Agents** (also known as DTA), a tool released in version 1.0 in May during Google I/O. Thanks to the **Model Context Protocol** (MCP), this tool exposes the native capabilities of DevTools directly to AI agents (such as Gemini, Claude Code, Cursor, or Antigravity).

The result? The AI can navigate, inspect stylesheets, fill out forms, and perform real debugging on our behalf.

## Watch the video

<iframe width="560" height="315" src="https://www.youtube.com/embed/Ol2Xo29Z3tE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy" style="width: 100%; height: auto; aspect-ratio: 16 / 9"></iframe>

## Slides

You can download or view the presentation slides here:
[🔗 Download presentation slides (PDF)](/pdf/ehi-gemini-sistema-il-css-chrome-devtools-for-agents-css-day-2026.pdf)

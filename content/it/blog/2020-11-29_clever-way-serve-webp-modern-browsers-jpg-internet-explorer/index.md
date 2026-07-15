---
title: "Un modo intelligente per servire immagini WebP ai browser moderni e JPG a Internet Explorer"
description: "Prima che Safari iniziasse a supportare le immagini WebP, eravamo costretti a usare il tag picture per servire le immagini WebP ai browser che le supportavano. Oggi tutti i browser moderni supportano il formato WebP, quindi c'è probabilmente un modo intelligente per farlo usando un singolo tag: img."
tags:
  - images
  - techniques
layout: layouts/post.njk
---

Prima che Safari iniziasse a supportare le immagini WebP, eravamo costretti a usare il tag `picture` per servire le immagini WebP ai browser che le supportavano. Oggi tutti i browser moderni supportano il formato WebP, quindi c'è probabilmente un modo intelligente per farlo usando un singolo tag: `img`.

## Come facevamo prima

Il vecchio metodo consisteva nell'utilizzare un tag `picture` contenente il normale tag `img` con gli attributi `src` e `srcset` per i browser che non supportavano il formato WebP, e un tag `source` fratello — contrassegnato con `type="image/webp"` — contenente lo `srcset` per i browser in grado di visualizzare il formato WebP.

In poche parole, questo:

```html
<picture>
    <source
        type="image/webp"
        srcset="
            {url-standard}.webp 1x,
            {url-retina}.webp   2x
        "
    />
    <img
        alt="Vecchio metodo"
        src="{url-standard}.jpg"
        srcset="
            {url-standard}.jpg 1x,
            {url-retina}.jpg   2x
        "
    />
</picture>
```

## Ma ora Safari è più moderno

Ora che tutti i browser moderni supportano il formato WebP, possiamo presumere che tutti i browser che supportano l'attributo `srcset` supportino anche il WebP. Possiamo quindi eliminare il tag `picture` e utilizzare un singolo tag `img`.

In questo modo:

```html
<img
    alt="Nuovo metodo intelligente"
    src="{url-standard}.jpg"
    srcset="
        {url-standard}.webp 1x,
        {url-retina}.webp   2x
    "
/>
```

I browser legacy utilizzeranno come fallback l'attributo `src`, scaricando l'immagine JPG. Semplice.

## Vantaggi

Il primo e più ovvio vantaggio è che è necessario scrivere e mantenere meno markup HTML.

Un secondo vantaggio si potrebbe avere se si stesse utilizzando una CDN per immagini per servire automaticamente il formato corretto in base al browser che lo richiede. In tal caso, probabilmente si può fare a meno di questo servizio, risparmiando tempo e denaro.

## Compatibilità

Se devi supportare versioni di iOS precedenti alla 14, probabilmente ti converrà continuare a utilizzare il tag `picture` per farlo. Questo dipende dal pubblico a cui ti rivolgi. Puoi scoprire di più sul tuo pubblico analizzando i dati di Google Analytics.

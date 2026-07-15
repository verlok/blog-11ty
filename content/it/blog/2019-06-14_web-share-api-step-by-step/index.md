---
title: "Web Share API, il passo successivo alla PWA"
description: "Oggi ho sperimentato con la Web Share API e l'ho implementata su questo sito, tanto per iniziare. Ecco cosa ho fatto e come puoi implementarla sul tuo sito."
tags:
  - APIs
  - techniques
layout: layouts/post.njk
---

Oggi ho sperimentato con la Web Share API e l'ho implementata su questo sito, tanto per iniziare. Ecco cosa ho fatto e come puoi implementarla sul tuo sito.

Dopo aver trasformato questo sito in una Progressive Web Application, ho rimosso lo script AddThis che veniva utilizzato per aggiungere i pulsanti di condivisione alla fine di ogni post, perché rallentava il sito. Mi sono poi reso conto che, dopo aver aggiunto il sito alla schermata iniziale del telefono come app standalone, gli utenti non potevano più condividere i post.

## Web Share API in soccorso!

Ho aggiunto il seguente script alle pagine dei post del mio sito:

```js
(function() {
  // Rileva il supporto per la funzionalità di condivisione web
  var supportsShare = "share" in navigator;

  // Nessun supporto?
  // - Aggiunge una classe "noShare" al documento
  // - Non fa nient'altro
  if (!supportsShare) {
    document.documentElement.classList.add("noShare");
    return;
  }

  // Supportato? Recupera:
  // - il pulsante di condivisione (elemento DOM)
  // - il canonicalUrl della pagina
  // - il titolo della pagina
  var shareButton = document.querySelector(".post-share");
  var canonicalUrl = document
    .querySelector("link[rel=canonical]")
    .getAttribute("href");
  var title = document.querySelector("title").innerText;

  // Aggiunge un listener al pulsante di condivisione
  shareButton.addEventListener("click", function(event) {
    // Chiama navigator.share con il titolo e l'URL canonico
    navigator
      .share({
        title: title,
        url: canonicalUrl
      })
      .then(() => {
        // Fai quello che vuoi qui
        console.log("Grazie per la condivisione!");
      })
      .catch(e => {
        // Gestisci gli errori qui
        console.error(e, "Condivisione fallita")
      });
  });
})();
```

Poi, per nascondere i pulsanti di condivisione tramite CSS quando la classe `noShare` viene aggiunta al documento:

```css
.noShare .post-share {
  display: none;
}
```

Facile, no?

Il [supporto per la Web Share API](https://caniuse.com/#feat=web-share) è ancora limitato, ma per lo meno è supportato da Safari e Chrome per Android, quindi aiuterà chiunque abbia installato la tua PWA sulla schermata iniziale del proprio smartphone.

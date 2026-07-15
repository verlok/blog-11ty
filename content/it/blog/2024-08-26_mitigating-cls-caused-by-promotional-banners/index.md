---
title: "Mitigare il CLS causato da banner promozionali: una soluzione pratica"
description: "Esploriamo una soluzione pratica per mitigare il Cumulative Layout Shift (CLS) causato dai banner promozionali. Evita spostamenti di layout imprevisti usando sessionStorage per memorizzare il contenuto e lo stato di visualizzazione del banner tra i caricamenti di pagina."
tags:
  - web performance
  - cumulative layout shift
---

<figure>
	{% image "screenshot.png", "La home page di un sito web con un banner promozionale in alto che spinge verso il basso il contenuto sottostante", [648, 1296], "648px" %}
	<figcaption>Un sito web con un banner promozionale in alto che spinge verso il basso il contenuto sottostante</figcaption>
</figure>

Il **Cumulative Layout Shift (CLS)** è una metrica Core Web Vital che misura la stabilità visiva. Si verifica quando il contenuto di una pagina web si sposta in modo imprevisto, causando spesso frustrazione negli utenti.

Una causa comune di CLS è l'iniezione di un **banner promozionale nella parte superiore della pagina** dopo che il contenuto principale è già stato caricato. Questo spinge verso il basso gli altri elementi della pagina, portando a una pessima esperienza utente. Sfortunatamente, questo esito è un problema molto comune che si verifica nei siti web su cui ho lavorato o per cui ho fatto consulenza.

In questo post, esploreremo un metodo per mitigare il CLS riservando spazio per un banner promozionale tramite il session storage. Questo approccio assicura che il banner non causi spostamenti di layout nei successivi caricamenti di pagina, offrendo un'esperienza più stabile e intuitiva per l'utente.

## Il problema

Nello scenario descritto in precedenza, la logica per determinare se mostrare o meno il banner viene eseguita tramite JavaScript, spesso dopo che il contenuto della pagina è già visibile. Ciò comporta uno spostamento del layout, in cui tutto il contenuto al di sotto del banner viene improvvisamente spinto verso il basso, causando un'esperienza utente fastidiosa.

## La soluzione

Per risolvere questo problema, possiamo usare `sessionStorage` per ricordare il contenuto e lo stato del banner durante la sessione dell'utente. In questo modo, possiamo iniettare il contenuto del banner immediatamente al caricamento della pagina, evitando qualsiasi spostamento di layout. Se l'utente ha chiuso il banner, ci assicuriamo che rimanga nascosto per il resto della sessione, in modo che non venga mostrato al caricamento successivo.

Ecco come possiamo implementarlo:

1. **Verificare se il banner è stato precedentemente chiuso**:<br>Per prima cosa controlliamo se l'utente ha chiuso il banner nella sessione corrente. In tal caso, non lo mostriamo di nuovo.

2. **Iniettare il contenuto del banner**:<br>Se il banner non è stato chiuso e c'è del contenuto salvato nel session storage, lo iniettiamo nella pagina il prima possibile. Questo evita che il layout si sposti quando il banner viene effettivamente caricato.

3. **Salvare il contenuto del banner**:<br>Quando il contenuto promozionale viene recuperato per la prima volta, lo salviamo nel session storage. Questo ci consente di riutilizzarlo nei successivi caricamenti di pagina senza causare alcuno spostamento di layout.

4. **Gestire la chiusura del banner**:<br>Se l'utente chiude il banner, impostiamo un flag nel session storage per assicurarci che non ricompaia durante la stessa sessione.

## Implementazione

Trovate qui il [repository GitHub](https://github.com/verlok/cls-issue-promotional-banner-mitigation/) con il codice e la [live demo](https://verlok.github.io/cls-issue-promotional-banner-mitigation/) su GitHub Pages.

Per comodità, ecco il codice copiato e incollato dalla pagina dimostrativa.

```js
document.addEventListener("DOMContentLoaded", function () {
  const bannerContainerId = "promo-banner"; // ID del contenitore del banner
  const bannerSessionKey = "promoBannerContent";
  const bannerClosedKey = "promoBannerClosed";

  // Funzione per verificare se il banner è stato chiuso dall'utente
  const isBannerClosed = () =>
    sessionStorage.getItem(bannerClosedKey) === "true";

  // Controlla se il banner è stato chiuso in precedenza dall'utente. Se sì, non fare nulla.
  if (isBannerClosed()) return;

  // Funzione per iniettare il banner nella pagina
  const injectBanner = (bannerContent) => {
    const bannerContainer = document.getElementById(bannerContainerId);
    if (bannerContainer) {
      bannerContainer.innerHTML = bannerContent;
      bannerContainer.style.display = "block";
    }
  };

  // 👀 Controlla se il contenuto del banner esiste in sessionStorage, ed eventualmente iniettalo
  const savedBannerContent = sessionStorage.getItem(bannerSessionKey);
  if (savedBannerContent) {
    injectBanner(savedBannerContent);
  }

  // Funzione per simulare il recupero della promozione.
  const loadPromotion = () => {
    setTimeout(() => {
      const bannerContent = "<div>Il tuo contenuto promozionale qui</div>";

      // Inietta il contenuto del banner
      injectBanner(bannerContent);

      // 👀 Salva il contenuto del banner in sessionStorage per la prossima volta
      sessionStorage.setItem(bannerSessionKey, bannerContent);
    }, 600);
  };

  // Funzione per gestire l'azione di chiusura del banner
  const closeBanner = () => {
    sessionStorage.setItem(bannerClosedKey, "true");
    const bannerContainer = document.getElementById(bannerContainerId);
    if (bannerContainer) {
      bannerContainer.style.display = "none";
    }
  };

  // Simula il recupero della promozione
  loadPromotion();

  // Esempio di event listener per la chiusura del banner
  document
    .getElementById("close-banner")
    .addEventListener("click", closeBanner);
});
</script>
```

## Come funziona

- **Session Storage**: viene utilizzato per memorizzare il contenuto promozionale e lo stato di chiusura del banner. I dati persistono tra i caricamenti di pagina all'interno della stessa sessione, garantendo un'esperienza utente coerente.
- **Iniezione immediata**: iniettando immediatamente il contenuto salvato nella pagina, evitiamo qualsiasi spostamento di layout che si verificherebbe se il banner venisse caricato dopo che la pagina è stata completamente renderizzata.
- **Controllo dell'utente**: se l'utente chiude il banner, questo non ricomparirà durante la stessa sessione, garantendo il rispetto delle preferenze dell'utente.

## Conclusione

Sfruttando il session storage per gestire la visualizzazione dei banner promozionali, puoi ridurre significativamente il CLS sul tuo sito web. Questo approccio non solo migliora l'esperienza utente, ma ottimizza anche le metriche prestazionali del sito, contribuendo a una migliore SEO e a tassi di coinvolgimento più elevati.

Questo metodo è particolarmente utile per i siti web con contenuti dinamici, in cui la decisione di mostrare determinati elementi viene presa dopo il caricamento della pagina. Pianificando questi elementi in anticipo, puoi creare un'esperienza più fluida e stabile per i tuoi utenti.

---

Questo approccio è un modo semplice ma efficace per affrontare una delle cause comuni di CLS, e può essere implementato con modifiche minime al codebase esistente.

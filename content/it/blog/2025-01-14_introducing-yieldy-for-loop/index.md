---
title: "Presentazione di yieldy-for-loop: un pacchetto npm per mantenere i loop non bloccanti (e la UI fluida)"
description: "Una piccola utility per elaborare cicli di grandi dimensioni in JavaScript senza bloccare l'interfaccia utente. Ispirato all'articolo di Rick Viscomi “Breaking up with long tasks, or how I learned to group loops and wield the yield”, yieldy-for-loop cede periodicamente il controllo al browser in modo che l'app rimanga reattiva."
tags:
  - inp
  - resources
---

Se avete mai dovuto elaborare migliaia (o milioni) di elementi in JavaScript, avrete probabilmente sperimentato quel fastidioso lag o blocco dell'interfaccia utente. Può accadere quando si eseguono cicli intensivi sul thread principale, bloccando gli aggiornamenti dell'interfaccia. Per affrontare questo problema, ho creato un pacchetto npm chiamato [yieldy-for-loop](https://www.npmjs.com/package/yieldy-for-loop). Questa piccola utility vi aiuta a suddividere cicli di grandi dimensioni in blocchi, cedendo periodicamente il controllo al browser per far sì che la vostra applicazione rimanga reattiva.

<figure>
	{% image "yieldy-for-loop-npm.png", "yieldy-for-loop su npm", [648, 1296], "648px" %}
	<figcaption>yieldy-for-loop sul sito web di npm</figcaption>
</figure>

## Contesto

I **long task** sono un comune collo di bottiglia per le prestazioni nelle applicazioni front-end. Quando il thread principale è occupato a eseguire cicli di grandi dimensioni, i browser non possono aggiornare l'interfaccia utente e gli utenti potrebbero notare una mancanza di reattività o uno scrolling a scatti. Ispirato dall'articolo [“Breaking up with long tasks, or how I learned to group loops and wield the yield” (PerfPlanet 2024)](https://calendar.perfplanet.com/2024/breaking-up-with-long-tasks-or-how-i-learned-to-group-loops-and-wield-the-yield/), volevo una funzione semplice e riutilizzabile che potesse:

1. **Suddividere cicli di grandi dimensioni** in lotti (batch) più piccoli.
2. **Cedere il controllo al browser (yield)** dopo ogni lotto, dando al motore di rendering la possibilità di aggiornare la pagina e all'utente quella di interagire.
3. **Adattarsi** a seconda che il documento sia visibile o nascosto, dato che il lavoro svolto in una scheda in background (nascosta) può essere deprioritarizzato o addirittura sospeso in molti browser.

Così è nato yieldy-for-loop.

## Cosa fa

- **Iterazione non bloccante**: elabora i vostri elementi in lotti, con l'obiettivo di rimanere entro una determinata frazione di tempo (ad es. 33ms per puntare a circa 30 FPS).  
- **Logica di auto-yield**:
  - Se la pagina è **nascosta**, cede il controllo meno frequentemente (ad es. ogni 500ms) per risparmiare risorse.
  - Se la pagina è **visibile**, cede il controllo più di frequente per mantenere fluide le animazioni e le interazioni dell'utente.
- **Compatibilità del browser**: utilizza una competizione (race) tra un breve `setTimeout` e `requestAnimationFrame`, ed eventualmente chiama la [Scheduler API](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler) se disponibile.

## Installazione

```bash
npm install yieldy-for-loop
```

## Esempio di utilizzo

```js
import yieldyForLoop from 'yieldy-for-loop';

const items = Array.from({ length: 100000 }, (_, i) => i);

function processItem(item) {
  // La vostra logica di elaborazione pesante
  console.log('Processing item:', item);
}

(async function main() {
  console.log('Starting yieldy loop...');
  
  await yieldyForLoop(items, processItem, {
    fps: 30,              // Punta a circa 30 fotogrammi al secondo
    hiddenThreshold: 500, // Soglia di yield (in ms) quando la scheda è nascosta
  });
  
  console.log('All items processed without blocking the UI!');
})();
```

## Come funziona

1. **Calcolo della frazione di tempo (Time Slice)**: 
   - I fotogrammi al secondo (FPS) predefiniti sono impostati a **30**, quindi viene calcolata una durata del lotto di circa 33ms.  
2. **Controllo `shouldYield()`**: 
   - Prima di elaborare ciascun elemento, la funzione controlla quanto tempo è trascorso dall'ultimo yield.  
   - Se supera la soglia (ad es. circa 33ms, o 500ms se il documento è nascosto), cede nuovamente il controllo al browser.  
3. **Meccanismi di Yielding**:
   - **Pagina nascosta**: utilizza `setTimeout(resolve, 1)` — il tempo minimo per consentire ad altri task di inserirsi.
   - **Pagina visibile**: utilizza una combinazione di `requestAnimationFrame` e un breve timeout. Se il metodo sperimentale `scheduler.yield()` è disponibile, chiama anche quello.  

Dividendo il ciclo in lotti, il browser ha lo spazio di manovra necessario per renderizzare la pagina, rispondere agli input dell'utente ed eseguire altri script, evitando così il temuto problema della "pagina che non risponde".

## Perché ne avete bisogno

- **Migliore esperienza utente**: scrolling fluido, pulsanti reattivi e nessun blocco improvviso.
- **Facile da usare**: basta racchiudere la normale logica del ciclo all'interno di `yieldyForLoop`. 
- **Micro-ottimizzato**: il codice è ridotto all'essenziale e lineare, quindi facile da mantenere o personalizzare.

## Prossimi passi

- **Provatelo**: installate il pacchetto, importatelo e integratelo in qualsiasi ciclo pesante abbiate.  
- **Contributi**: segnalazioni di bug e pull request sono i benvenuti! Date un'occhiata alla [repo GitHub](https://github.com/YourUsername/yieldy-for-loop) per segnalare problemi, richiedere funzionalità o aprire PR.  
- **Passate parola**: se lo trovate utile, fatelo sapere agli altri.  

## Ringraziamenti

Un ringraziamento speciale a [Rick Viscomi](https://rviscomi.dev/) per aver scritto l'articolo su PerfPlanet che mi ha spinto a realizzare questo strumento.
Suddividere i task di grandi dimensioni in blocchi più piccoli è diventata una strategia prestazionale chiave, e `yieldy-for-loop` mira a renderne ancora più semplice l'adozione.

## Conclusione

I cicli lunghi non devono per forza tradursi in interfacce utente bloccate. Cedendo periodicamente il controllo al browser, potete mantenere un'esperienza fluida per i vostri utenti. `yieldy-for-loop` si occupa della parte difficile con pochissimo codice, lasciandovi liberi di concentrarvi su ciò che sapete fare meglio: creare fantastiche applicazioni web.

Se avete domande, contattatemi o aprite una segnalazione su GitHub. 
Ora non vi resta che provarlo e mantenere i vostri cicli fluidi.

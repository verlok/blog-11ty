---
title: "Creare una libreria JavaScript con moduli ES2015, Gulp, Rollup e Jest"
description: "Vediamo come scrivere una libreria JavaScript in ES2015 transpilata con Babel, utilizzando i moduli ES impacchettati con Rollup tramite Gulp, e Jest per testare il codice."
tags:
  - tutorials
  - javascript
---

Vediamo come scrivere una libreria JavaScript utilizzando [ES2015](https://babeljs.io/learn-es2015/) transpilato con [Babel](https://babeljs.io/), sfruttando i [moduli ES](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) impacchettati con [Rollup](https://rollupjs.org/) tramite [Gulp](gulp.js) e usando [Jest](https://facebook.github.io/jest/) per testare il codice.

In questo articolo condivido l'esperienza maturata durante lo sviluppo del mio script [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload), poiché all'epoca non riuscii a trovare nulla che spiegasse come utilizzare queste librerie insieme, in particolare **Rollup e Jest**.


## Installare Gulp

Gulp è un **task runner** simile a [Grunt](https://gruntjs.com/) per automatizzare i compiti più noiosi o lunghi nel flusso di lavoro di sviluppo. Ho scelto di migrare **da Grunt a Gulp** perché quest'ultimo è incredibilmente veloce, essendo basato sugli [stream (flussi di dati)](https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93) di Node invece che sul file system.

Per utilizzare Gulp, devi installarlo localmente nel tuo progetto, eseguendo:

```sh
npm install --save-dev gulp
```

Una buona opzione per utilizzare Gulp è installare il suo eseguibile da riga di comando tramite:

```sh
npm install -g gulp-cli
```

Per maggiori informazioni, ti suggerisco di leggere l'articolo [Gulp for beginners](https://css-tricks.com/gulp-for-beginners/) su CSS-Tricks (in inglese).


## Configurare Gulp

L'esecuzione di Gulp richiede un file di configurazione chiamato `gulpfile.js`. Per ora creane uno vuoto, ti mostrerò passo dopo passo cosa inserire al suo interno.


### 1. Analisi statica (linting) dei file sorgente

Essendo JavaScript un linguaggio dinamico e a tipizzazione debole, è particolarmente incline agli errori di sviluppo. Strumenti di linting come [ESLint](https://eslint.org/) consentono agli sviluppatori di individuare errori nel codice JavaScript senza doverlo effettivamente eseguire.

Per installare ESLint per Gulp, basta eseguire:

```sh
npm install --save-dev gulp-eslint
```

Quindi, nel tuo file `gulpfile.js` vuoto, aggiungi:

```js
var gulp = require("gulp");
var eslint = require("gulp-eslint");

gulp.task("default", function () {
    process.env.NODE_ENV = "release";
    return gulp.src("./src/**/*.js")
        // ----------- linting --------------
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError()) // --> si interrompe in caso di errori
        // --> concatena altre operazioni qui
});
```

NOTA: Impostare la variabile `process.env.NODE_ENV` è necessario per farla coincidere con il task che stiamo eseguendo nella configurazione di Babel. Lo spiegherò [tra poco](#3-transpilazione-in-es5-con-babel).


### 2. Impacchettare i moduli con Rollup

Rollup è un module bundler per JavaScript che compila piccoli pezzi di codice in qualcosa di più grande, come una libreria. Utilizza il formato standard per i moduli di codice introdotto con la revisione ES2015 di JavaScript.

In parole povere, Rollup legge il tuo file JavaScript principale e genera automaticamente un unico file più grande contenente tutti i moduli inclusi.

Installa Rollup con:

```sh
npm install --save-dev gulp-rollup gulp-rename
```

Quindi nel tuo gulpfile, aggiungi semplicemente un comando `.pipe()`:

```js
// ----------- rollup --------------
.pipe(rollup({
    format: "umd",
    moduleName: "LazyLoad",
    entry: "./src/lazyload.js"
}))
```

Questo indica a Rollup che deve produrre un modulo di tipo `umd`, il cui nome sarà `LazyLoad`, e che il punto di ingresso (entry point) da cui iniziare a cercare le dipendenze è `./src/lazyload.js`.

Poiché voglio distribuire una versione dello script che non sia transpilata in ES5, la salvo come `lazyload.es2015.js` concatenando i comandi `rename` e `dest`.

```js
.pipe(rename("lazyload.es2015.js"))
.pipe(gulp.dest(destFolder)) // --> scrittura del bundle Rollup
```

`destFolder` è una variabile JavaScript ed è impostata su `./dist` all'interno del nostro `gulpfile.js`.

NOTA: [Webpack](https://webpack.github.io/) è uno strumento di bundling simile che potrebbe essere preferibile per applicazioni complesse, ma ho notato che il codice finale generato da Webpack è molto più pesante, perciò nel mio caso Rollup si è rivelato la scelta migliore.


### 3. Transpilazione in ES5 con Babel

Fino a questo punto abbiamo unito tutti i nostri moduli in un unico file che funzionerà solo nei browser moderni. Naturalmente, vogliamo produrre anche un file leggibile da browser *meno moderni*.

Per installare Babel e il suo preset per ES2015, più un plugin per trasformare `Object.assign()` in ES5, esegui:

```sh
npm install --save-dev babel-core gulp-babel babel-preset-es2015 babel-plugin-transform-object-assign
```

Quindi, per elaborare con Babel il file precedentemente creato con Rollup e salvarlo come `lazyload.js`, richiediamo `gulp-babel` e aggiungiamo il seguente passaggio nel nostro `gulpfile.js`:

```js
var babel = require("gulp-babel");
```

```js
// ----------- babelizzazione --------------
.pipe(babel())
.pipe(rename("lazyload.js"))
.pipe(gulp.dest(destFolder)) // --> scrittura del file js es5 transpilato con Babel
```

La configurazione di Babel deve essere memorizzata in un file `.babelrc` esterno, che nel mio caso si presenta così:

```json
{
    "ignore": [
        "node_modules/**"
    ],
    "env": {
        "test": {
            "presets": [
                "es2015"
            ],
            "plugins": ["transform-object-assign"]
        },
        "release": {
            "presets": [
                ["es2015", {
                    "modules": false
                }]
            ],
            "sourceMap": false,
            "plugins": ["transform-object-assign"]
        }
    }
}
```

Avrai notato che ho configurato i due ambienti (`env`) in modo diverso:

* `release` è quello utilizzato da Rollup in Gulp. Ricordi? Lo abbiamo impostato nel `gulpfile.js` usando `process.env.NODE_ENV = "release"`
* `test` è quello utilizzato da Jest (la spiegazione segue sotto)


### 4. Minificazione con Uglify

[Uglify JS](https://github.com/mishoo/UglifyJS2) è un set di strumenti per la compressione di JavaScript comunemente utilizzato per minificare la versione di distribuzione delle librerie JavaScript.

```sh
npm install --save-dev gulp-uglify
```

Quindi, aggiungi il require e il pipe seguenti al nostro `gulpfile.js`:

```js
var uglify = require("gulp-uglify");
```

```js
// ----------- minificazione --------------
.pipe(uglify())
.pipe(rename("lazyload.min.js"))
.pipe(gulp.dest(destFolder)); // --> scrittura del codice minificato
```

### Tutto insieme

Ecco come dovrebbe apparire il tuo file `gulpfile.js` completo:

```js
var gulp = require("gulp");
var eslint = require("gulp-eslint");
var rollup = require("gulp-rollup");
var rename = require("gulp-rename");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");

var destFolder = "./dist";

gulp.task("default", function () {
    process.env.NODE_ENV = "release";
    return gulp.src("./src/**/*.js")
        // ----------- linting --------------
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError()) // --> si interrompe in caso di errori
        // ----------- rollup --------------
        .pipe(rollup({
            format: "umd",
            moduleName: "LazyLoad",
            entry: "./src/lazyload.js"
        }))
        .pipe(rename("lazyload.es2015.js"))
        .pipe(gulp.dest(destFolder)) // --> scrittura del bundle Rollup
        // ----------- babelizzazione --------------
        .pipe(babel())
        .pipe(rename("lazyload.js"))
        .pipe(gulp.dest(destFolder)) // --> scrittura del file ES5 transpilato con Babel
        // ----------- minificazione --------------
        .pipe(uglify())
        .pipe(rename("lazyload.min.js"))
        .pipe(gulp.dest(destFolder)); // --> scrittura del codice minificato
});

gulp.task("watch", function () {
    gulp.watch("./src/**/*.js", ["default"]);
    // Altri watcher
});
```

La sezione `"watch"` fa sì che se eseguiamo il comando `gulp watch`, `gulp` monitora la cartella `src` in cerca di modifiche e ricrea automaticamente i file nella cartella `dist`. Comodo!


## Eseguire Gulp

Ora puoi compilare la tua libreria eseguendo Gulp in un'unica soluzione:

```sh
gulp
```

Oppure puoi fare in modo che monitori le modifiche ai file sorgente in `src` mentre stai sviluppando:

```sh
gulp watch
```


## Far funzionare Jest insieme a Rollup

Scriverò un altro post dettagliato su come ho usato Jest per testare moduli che diventano variabili e funzioni private minificate, ma il punto cruciale qui è come far convivere Jest e Rollup, dato che i due richiedono configurazioni di Babel differenti.

Come abbiamo visto, la configurazione di Babel è suddivisa in due ambienti (`env`) e quello impostato e utilizzato da Jest è `test`. Questo perché Jest ha solo bisogno che l'oggetto `presets` contenga `["es2015"]`, mentre Rollup richiede `["es2015", {"modules": false}]`.

Se hai seguito correttamente le spiegazioni, Jest dovrebbe funzionare fin da subito.

```sh
npm install --save-dev jest
npm install -g jest-cli
```

Quindi lancia Jest così:

```
jest
```

Trovi maggiori informazioni su Jest nella pagina di [guida all'avvio](https://facebook.github.io/jest/docs/en/getting-started.html).


## Passaggi successivi

Una configurazione più avanzata consisterebbe nel configurare `npm` come interfaccia a riga di comando per compilazione e test, in modo da poter eseguire `npm run build` e `npm run test` per lanciare la build o i test, o meglio ancora includere il processo di test nella build stessa in modo che se i test falliscono, fallisca anche la build. Questo sarà il mio prossimo passo.

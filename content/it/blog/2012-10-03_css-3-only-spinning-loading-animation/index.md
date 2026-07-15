---
title: "Animazione di caricamento \"loading\" rotante in solo CSS 3"
description: "Abbiamo usato immagini GIF per creare animazioni per anni, ma non sono belle da usare sopra gradienti o immagini (niente canale alfa, niente anti-aliasing) di cui i siti web moderni sono pieni. Esistono molte soluzioni alternative per animare invece immagini PNG, ma..."
tags:
  - css
  - animations
---

Abbiamo usato immagini GIF per creare animazioni per anni, ma non sono adatte ad essere utilizzate sopra sfumature o immagini (niente canale alfa, niente anti-aliasing) di cui i siti web moderni sono pieni. Esistono molte soluzioni alternative per animare invece immagini PNG, ma...

Voglio mostrarti una soluzione che ho trovato per creare un'animazione di caricamento ("loading") da zero, utilizzando solo CSS 3, senza immagini.

## Prima i risultati

<p data-height="265" data-theme-id="0" data-slug-hash="bWmvON" data-default-tab="css,result" data-user="verlok" data-embed-version="2" data-pen-title="CSS 3 only spinning circle quarter - loading animation" class="codepen">Vedi la Pen <a href="https://codepen.io/verlok/pen/bWmvON/">CSS 3 only spinning circle quarter - loading animation</a> di Andrea Verlicchi (<a href="https://codepen.io">@verlok</a>) su <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Cosa succede qui

Il fulcro di questo metodo consiste nel disegnare un quarto di cerchio e animarlo.
Continua a leggere per scoprire i passaggi passo-passo per farlo.

## 1. Creare un cerchio

```html
<!-- Cerchio interno mascherato -->
<div class="maskedCircle"></div>
```

```css
/* Cerchio rotante (cerchio interno) */
.loading .maskedCircle {
	width: 20px;
	height: 20px;
	border-radius: 12px;
	border: 3px solid white;
}
```

## 2. Mascherare un quarto del cerchio

```html
<!-- Maschera del quarto di cerchio -->
<div class="mask">
    <!-- Cerchio interno mascherato -->
    <div class="maskedCircle"></div>
</div>
```

```css
/* Maschera del cerchio rotante */
.loading .mask {
	width: 12px;
	height: 12px;
	overflow: hidden;
}
```

## 3. Far ruotare entrambi

```html
<!-- Facciamo ruotare questo div -->
<div class="spinner">
	<!-- Maschera del quarto di cerchio -->
	<div class="mask">
		<!-- Cerchio interno mascherato -->
		<div class="maskedCircle"></div>
	</div>
</div>
```

```css
/* Keyframe dell'animazione */
@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

/* Spinner */
.loading .spinner {
	position: absolute;
	left: 1px;
	top: 1px;
	width: 26px;
	height: 26px;
	animation: spin 1s infinite linear;
}
```

## 4. Avvolgere tutto in un contenitore "loading", che sarà centrato rispetto al suo genitore

```html
<!-- Contenitore dell'animazione di caricamento -->
<div class="loading">
	<!-- Facciamo ruotare questo div -->
	<div class="spinner">
		<!-- Maschera del quarto di cerchio -->
		<div class="mask">
			<!-- Cerchio interno mascherato -->
			<div class="maskedCircle"></div>
		</div>
	</div>
</div>
```

```css
/* Contenitore dell'animazione di caricamento */
.loading {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 28px;
	height: 28px;
	margin: -14px 0 0 -14px;
}
```

## Codice HTML e CSS risultante:

```html
<!-- Contenitore dell'animazione di caricamento -->
<div class="loading">
	<!-- Facciamo ruotare questo div -->
	<div class="spinner">
		<!-- Maschera del quarto di cerchio -->
		<div class="mask">
			<!-- Cerchio interno mascherato -->
			<div class="maskedCircle"></div>
		</div>
	</div>
</div>
```

```css
/* Keyframe dell'animazione - devi aggiungere i prefissi */
@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

/* Contenitore dell'animazione di caricamento */
.loading {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 28px;
	height: 28px;
	margin: -14px 0 0 -14px;
}

/* Cerchio rotante (cerchio interno) */
.loading .maskedCircle {
	width: 20px;
	height: 20px;
	border-radius: 12px;
	border: 3px solid white;
}

/* Maschera del cerchio rotante */
.loading .mask {
	width: 12px;
	height: 12px;
	overflow: hidden;
}

/* Spinner */
.loading .spinner {
	position: absolute;
	left: 1px;
	top: 1px;
	width: 26px;
	height: 26px;
	animation: spin 1s infinite linear;
}
```

Non è fantastico?

Funziona perfettamente su tutti i browser desktop come:

* Internet Explorer 10+
* Edge
* Chrome
* Firefox
* Safari
* Opera

e anche per tutti i principali browser mobile:

* Safari Mobile
* Chrome Mobile
* Firefox Mobile
* Opera Mobile
* Internet Explorer Mobile (solo Windows Phone 8)

Al momento, Internet Explorer su Windows Phone 7 non animerà la figura.

## I fallback?

Hai bisogno di un fallback per vedere l'animazione nei browser più vecchi? Se hai letto fin qui, probabilmente sì.

Sebbene il fallback non sia lo scopo di questo articolo, diciamo che la soluzione migliore sarebbe preparare **uno sprite con tutti i fotogrammi (frame)** dell'animazione a una distanza costante l'uno dall'altro, usare lo sprite come sfondo di un elemento DOM e **animare lo sfondo con Javascript**.

---
title: "Una tecnica elegante per il lazy loading delle immagini in Swiper e la creazione lazy delle istanze di Swiper"
description: "Immagina di avere più caroselli in una pagina, ognuno contenente più immagini, e di voler scaricare solo le immagini che si trovano all'interno della porzione visibile della pagina, magari risparmiando tempo di CPU creando le istanze del carosello in modalità lazy. Credo di aver trovato una tecnica valida ed elegante per farlo."
tags:
  - techniques
  - lazy loading
  - vanilla-lazyload
  - images
layout: layouts/post.njk
---

Immagina di avere più caroselli in una pagina, ognuno contenente più immagini, e di voler scaricare solo le immagini che si trovano all'interno della porzione visibile della pagina, magari risparmiando tempo di CPU creando le istanze del carosello in modalità lazy. Credo di aver trovato una tecnica valida ed elegante per farlo.

La tecnica seguente riguarda il lazy loading delle immagini all'interno di un'istanza di [Swiper JS](https://swiperjs.com/) e la creazione differita (lazy) delle istanze di Swiper below-the-fold, utilizzando Swiper insieme a [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload).

Il codice HTML del primo carosello imposta un paio di immagini da caricare immediatamente (eager) in modo che i browser diano priorità al loro scaricamento, lasciando tutto il resto al lazy loading.

```html
<div class="swiper swiper--eager">
	<div class="swiper-wrapper">
		<!-- Immagini caricate immediatamente (eager) -->
		<div class="swiper-slide">
			<img
				alt="Stivaletti"
				src="https://via.placeholder.com/220x280?text=S01E01"
				srcset="https://via.placeholder.com/440x560?text=S01E01 2x"
				width="220"
				height="280"
			/>
		</div>
		<div class="swiper-slide">
			<img
				alt="Stivaletti"
				src="https://via.placeholder.com/220x280?text=S01E02"
				srcset="https://via.placeholder.com/440x560?text=S01E02 2x"
				width="220"
				height="280"
			/>
		</div>
		<!-- Immagini caricate in lazy loading -->
		<div class="swiper-slide">
			<img
				alt="Stivaletti"
				class="lazy"
				data-src="https://via.placeholder.com/220x280?text=S01E03"
				data-srcset="https://via.placeholder.com/440x560?text=S01E03 2x"
				width="220"
				height="280"
			/>
		</div>
		<div class="swiper-slide">
			<img
				alt="Stivaletti"
				class="lazy"
				data-src="https://via.placeholder.com/220x280?text=S01E04"
				data-srcset="https://via.placeholder.com/440x560?text=S01E04 2x"
				width="220"
				height="280"
			/>
		</div>
		<div class="swiper-slide">
			<img
				alt="Stivaletti"
				class="lazy"
				data-src="https://via.placeholder.com/220x280?text=S01E05"
				data-srcset="https://via.placeholder.com/440x560?text=S01E05 2x"
				width="220"
				height="280"
			/>
		</div>
	</div>
	<div class="swiper-button-prev"></div>
	<div class="swiper-button-next"></div>
</div>
```

A partire dal secondo carosello, tutte le immagini vengono caricate in modalità lazy.

```html
<div class="swiper swiper--lazy" id="swiperLazy1">
	<div class="swiper-wrapper">
		<!-- Tutte le immagini caricate in lazy loading -->
		<div class="swiper-slide">
			<img
				alt="Stivaletti"
				class="lazy"
				data-src="https://via.placeholder.com/220x280?text=S02E01"
				data-srcset="https://via.placeholder.com/440x560?text=S02E01 2x"
				width="220"
				height="280"
			/>
		</div>
		<div class="swiper-slide">
			<img
				alt="Stivaletti"
				class="lazy"
				data-src="https://via.placeholder.com/220x280?text=S02E02"
				data-srcset="https://via.placeholder.com/440x560?text=S02E02 2x"
				width="220"
				height="280"
			/>
		</div>
		<div class="swiper-slide">
			<img
				alt="Stivaletti"
				class="lazy"
				data-src="https://via.placeholder.com/220x280?text=S02E03"
				data-srcset="https://via.placeholder.com/440x560?text=S02E03 2x"
				width="220"
				height="280"
			/>
		</div>
		<div class="swiper-slide">
			<img
				alt="Stivaletti"
				class="lazy"
				data-src="https://via.placeholder.com/220x280?text=S02E04"
				data-srcset="https://via.placeholder.com/440x560?text=S02E04 2x"
				width="220"
				height="280"
			/>
		</div>
		<div class="swiper-slide">
			<img
				alt="Stivaletti"
				class="lazy"
				data-src="https://via.placeholder.com/220x280?text=S02E05"
				data-srcset="https://via.placeholder.com/440x560?text=S02E05 2x"
				width="220"
				height="280"
			/>
		</div>
	</div>
	<div class="swiper-button-prev"></div>
	<div class="swiper-button-next"></div>
</div>
```

Ecco il codice JavaScript che compie la magia.

```js
const swiperOptions = {
	loop: true,
	slidesPerView: "auto",
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
	on: {
		// Carica in modalità lazy le immagini di Swiper dopo l'inizializzazione di Swiper
		afterInit: (swiper) => {
			new LazyLoad({
				container: swiper.el,
				cancel_on_exit: false,
			});
		},
	},
};

// Inizializza subito il primo swiper
const eagerSwiper = new Swiper(".swiper--eager", swiperOptions);

// Inizializza tutti gli altri swiper non appena entrano nel viewport
new LazyLoad({
	elements_selector: ".swiper--lazy",
	unobserve_entered: true,
	callback_enter: function (swiperElement) {
		new Swiper("#" + swiperElement.id, swiperOptions);
	},
});
```

Ho testato questa soluzione emulando una connessione "3G lento", e ho apprezzato la cascata di chiamate di rete e il valore ottimale ottenuto per il Largest Contentful Paint.

[Provalo live qui](https://verlok.github.io/vanilla-lazyload/demos/swiper.html).

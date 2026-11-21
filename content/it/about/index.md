---
layout: layouts/base.njk
wideLayout: true
templateEngineOverride: njk
eleventyNavigation:
  key: Chi sono
  order: 4
---

<div class="about-page">
	<h1>Chi sono</h1>

	<section class="about-grid">
		<figure class="about-face">
			{% image "profile-picture.png", "Andrea Verlicchi", [320, 648], "(min-width: 680px) 240px, 280px" %}
			<figcaption>Immagine: me stesso</figcaption>
		</figure>

		<div class="about-bio">
			<p class="about-lead">
				Ciao, sono Andrea, e amo creare e ottimizzare siti web. Sono appassionato di web performance, accessibilità e user experience.
			</p>
			<p>
				Scrivo del web su questo blog tecnologico, su <a href="https://medium.com/@andrea.verlicchi">Medium</a> e <a href="https://www.smashingmagazine.com/author/andrea-verlicchi/">Smashing Magazine</a>, e amo <a href="{{ '/tags/talks/' | locale_url }}">parlare</a> alle conferenze web.
			</p>
			<p>
				Attualmente lavoro presso <a href="https://www.speedkit.com">Speed Kit</a> come ingegnere di web performance (<a href="https://linkedin.com/in/andreaverlicchi">scopri di più su LinkedIn</a>).
			</p>
			<p class="about-personal">
				Amo la natura in tutte le sue forme, mi piace andare in bicicletta, fare escursioni, mangiare cibo locale e imparare tutto su culture e lingue di ogni tipo.
			</p>
		</div>
	</section>

	<section class="about-highlights">
		<h2>{{ strings.it.aboutHighlightsTitle }}</h2>
		<div class="highlights-grid">
			<div class="highlight-item">
				<h3>Speed Kit</h3>
				<p>Web performance engineer focalizzato su Core Web Vitals, caching e architetture front-end veloci.</p>
			</div>
			<div class="highlight-item">
				<h3>Open Source</h3>
				<p>Grande fan di GitHub e creatore di <a href="https://github.com/verlok/vanilla-lazyload">vanilla-lazyload</a> e altri progetti leggeri open-source.</p>
			</div>
			<div class="highlight-item">
				<h3>Scrittura tecnica</h3>
				<p>Autore di guide pratiche su questo blog, su <a href="https://www.smashingmagazine.com/author/andrea-verlicchi/">Smashing Magazine</a> e su <a href="https://medium.com/@andrea.verlicchi">Medium</a>.</p>
			</div>
			<div class="highlight-item">
				<h3>Conferenze e Talk</h3>
				<p>Speaker alle conferenze web su performance, accessibilità ed esperienza utente. <a href="{{ '/talks/' | locale_url }}">Vedi i talk &rarr;</a></p>
			</div>
		</div>
	</section>
</div>

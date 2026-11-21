---
layout: layouts/base.njk
wideLayout: true
templateEngineOverride: njk
eleventyNavigation:
  key: About
  order: 4
---

<div class="about-page">
	<h1>About</h1>

	<section class="about-grid">
		<figure class="about-face">
			{% image "profile-picture.png", "Andrea Verlicchi", [320, 648], "(min-width: 680px) 240px, 280px" %}
			<figcaption>Image courtesy: myself</figcaption>
		</figure>

		<div class="about-bio">
			<p class="about-lead">
				Hello, I'm Andrea, and I love to create and optimize websites. I'm passionate about web performance, accessibility and user experience.
			</p>
			<p>
				I write about the web on this tech blog, on <a href="https://medium.com/@andrea.verlicchi">Medium</a> and <a href="https://www.smashingmagazine.com/author/andrea-verlicchi/">Smashing Magazine</a>, and I love to <a href="{{ '/tags/talks/' | locale_url }}">speak</a> at web conferences.
			</p>
			<p>
				I currently work at <a href="https://www.speedkit.com">Speed Kit</a> as a web performance engineer (<a href="https://linkedin.com/in/andreaverlicchi">more on LinkedIn</a>).
			</p>
			<p class="about-personal">
				I love nature in all of its forms, I love cycling, hiking, eating regional food, and learning everything about all kinds of cultures and languages.
			</p>
		</div>
	</section>

	<section class="about-highlights">
		<h2>{{ strings.en.aboutHighlightsTitle }}</h2>
		<div class="highlights-grid">
			<div class="highlight-item">
				<h3>Speed Kit</h3>
				<p>Web performance engineer focused on Core Web Vitals, caching strategies, and fast front-end architectures.</p>
			</div>
			<div class="highlight-item">
				<h3>Open Source</h3>
				<p>GitHub fan and creator of <a href="https://github.com/verlok/vanilla-lazyload">vanilla-lazyload</a> and other lightweight open-source projects.</p>
			</div>
			<div class="highlight-item">
				<h3>Technical Writing</h3>
				<p>Author of practical web performance guides on this blog, <a href="https://www.smashingmagazine.com/author/andrea-verlicchi/">Smashing Magazine</a>, and <a href="https://medium.com/@andrea.verlicchi">Medium</a>.</p>
			</div>
			<div class="highlight-item">
				<h3>Conference Talks</h3>
				<p>Speaker at international web conferences sharing lessons on speed, accessibility, and UX. <a href="{{ '/talks/' | locale_url }}">Browse talks &rarr;</a></p>
			</div>
		</div>
	</section>
</div>

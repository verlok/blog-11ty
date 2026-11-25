---
layout: layouts/base.njk
wideLayout: true
templateEngineOverride: njk
eleventyNavigation:
  key: Lazy load
  order: 6
---

<div class="project-page">
	<header class="project-hero">
		<p class="home-kicker">Open Source Project</p>
		<h1>vanilla-lazyload</h1>
		<p class="project-intro">
			I'm the author of a popular, lightweight lazy-loading script for images, videos, and iframes. Here's where you can explore, install, or support it.
		</p>
	</header>

	<section class="project-resources" aria-label="Project links">
		<div class="resource-grid">
			<a href="https://verlok.github.io/vanilla-lazyload/" class="contact-card contact-card--primary">
				<span class="contact-card-main">
					<span class="contact-icon-badge" aria-hidden="true">
						<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
							<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
							<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
						</svg>
					</span>
					<span class="contact-card-text">
						<span class="contact-card-title">Documentation &amp; demos</span>
						<span class="contact-card-sub">verlok.github.io/vanilla-lazyload</span>
					</span>
				</span>
				<span class="contact-card-arrow" aria-hidden="true">&#8599;</span>
			</a>

			<a href="https://github.com/verlok/vanilla-lazyload" class="contact-card contact-card--primary">
				<span class="contact-card-main">
					<span class="contact-icon-badge" aria-hidden="true">
						<svg class="icon icon--fill" viewBox="0 0 24 24">
							<path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"></path>
						</svg>
					</span>
					<span class="contact-card-text">
						<span class="contact-card-title">GitHub</span>
						<span class="contact-card-sub">Code, issues &amp; sponsorship</span>
					</span>
				</span>
				<span class="contact-card-arrow" aria-hidden="true">&#8599;</span>
			</a>

			<a href="https://www.jsdelivr.com/package/npm/vanilla-lazyload" class="contact-card">
				<span class="contact-card-main">
					<span class="contact-icon-badge" aria-hidden="true">
						<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="2" y1="12" x2="22" y2="12"></line>
							<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
						</svg>
					</span>
					<span class="contact-card-text">
						<span class="contact-card-title">jsDelivr CDN</span>
						<span class="contact-card-sub">Use directly via CDN</span>
					</span>
				</span>
				<span class="contact-card-arrow" aria-hidden="true">&#8599;</span>
			</a>

			<a href="https://www.npmjs.com/package/vanilla-lazyload" class="contact-card">
				<span class="contact-card-main">
					<span class="contact-icon-badge" aria-hidden="true">
						<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
							<path d="m7.5 4.27 9 5.15"></path>
							<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
							<path d="m3.3 7 8.7 5 8.7-5"></path>
							<path d="M12 22V12"></path>
						</svg>
					</span>
					<span class="contact-card-text">
						<span class="contact-card-title">npm</span>
						<span class="contact-card-sub">npm i vanilla-lazyload</span>
					</span>
				</span>
				<span class="contact-card-arrow" aria-hidden="true">&#8599;</span>
			</a>
		</div>

		<div class="support-banner">
			<p class="support-banner-text">
				<span aria-hidden="true">&#9749;</span> Open source needs love and caffeine!
			</p>
			<a href="https://ko-fi.com/verlok" class="support-button">
				Buy me a coffee <span aria-hidden="true">&#8599;</span>
			</a>
		</div>
	</section>

	<section class="project-articles">
		<div class="section-header">
			<h2>Articles on lazy loading</h2>
			<a href="{{ '/tags/lazy-loading/' | locale_url }}" class="section-meta-link">All lazy loading posts &rarr;</a>
		</div>
		<p class="project-articles-intro">
			Here are some selected articles about lazy-loading images and performance:
		</p>

		<ul class="article-links-list">
			<li>
				<a href="{{ '/blog/do-we-still-need-lazy-loading-libraries-data-src/' | locale_url }}" class="article-link-row">
					<span class="article-link-title">Do we still need lazy loading libraries and <code>data-src</code> in 2022?</span>
					<span class="article-link-arrow" aria-hidden="true">&rarr;</span>
				</a>
			</li>
			<li>
				<a href="{{ '/blog/lazy-load-responsive-images-in-2020-srcset-sizes-picture-webp/' | locale_url }}" class="article-link-row">
					<span class="article-link-title">Lazy load responsive images in 2020</span>
					<span class="article-link-arrow" aria-hidden="true">&rarr;</span>
				</a>
			</li>
			<li>
				<a href="{{ '/blog/hybrid-lazy-loading-smashing-magazine-article/' | locale_url }}" class="article-link-row">
					<span class="article-link-title">A smashing article on hybrid lazy loading</span>
					<span class="article-link-arrow" aria-hidden="true">&rarr;</span>
				</a>
			</li>
			<li>
				<a href="{{ '/blog/native-lazy-loading-with-vanilla-lazyload/' | locale_url }}" class="article-link-row">
					<span class="article-link-title">Native lazy loading and JS-based fallback with vanilla-lazyload 12</span>
					<span class="article-link-arrow" aria-hidden="true">&rarr;</span>
				</a>
			</li>
			<li>
				<a href="{{ '/blog/check-if-element-still-inside-viewport-after-given-time/' | locale_url }}" class="article-link-row">
					<span class="article-link-title">Check if an element is still inside the viewport after a given time</span>
					<span class="article-link-arrow" aria-hidden="true">&rarr;</span>
				</a>
			</li>
			<li>
				<a href="{{ '/blog/using-intersection-observers-to-create-vanilla-lazyload/' | locale_url }}" class="article-link-row">
					<span class="article-link-title">Intersection Observer and lazy loading of elements</span>
					<span class="article-link-arrow" aria-hidden="true">&rarr;</span>
				</a>
			</li>
			<li>
				<a href="{{ '/blog/a-new-lazyload-to-improve-your-website-performance/' | locale_url }}" class="article-link-row">
					<span class="article-link-title">A new LazyLoad to improve your website performance</span>
					<span class="article-link-arrow" aria-hidden="true">&rarr;</span>
				</a>
			</li>
		</ul>
	</section>
</div>

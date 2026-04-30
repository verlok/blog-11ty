---
title: "The end of responsive images + a dream image format"
description: "Andy Bell argues that sizes=auto marks the end of responsive images as we know them. Here's my TL;DR plus a dream about a 'super image' format that bundles every size in a single file."
date: 2026-04-29
tags:
  - responsive images
  - images
  - web performance
  - lazy loading
layout: layouts/post.njk
---

Andy Bell wrote a great article on [the end of responsive images](https://piccalil.li/blog/the-end-of-responsive-images/#the-beginning-and-the-end), explaining how the `sizes="auto"` attribute, now widely supported, lets browsers figure out the rendered size of lazy-loaded images on their own, removing the need to manually specify the `sizes` attribute for most images.

<figure>
	{% image "cover.png", "A conceptual e-commerce product page showing a shirt and a 'Super Image' format that bundles multiple resolutions.", [648, 1296], "648px", true %}
	<figcaption>A dream image format: one file, all the sizes you need.</figcaption>
</figure>

My TL;DR of Andy's article is what follows.

## For most images: just let the browser do the work

For most images on the page — the lazy-loaded ones — we could simply do:

```html
<img
	loading="lazy"
	sizes="auto"
	srcset="
		shirt_300w.jpg   300w,
		shirt_600w.jpg   600w,
		shirt_1200w.jpg 1200w,
		shirt_2400w.jpg 2400w
	"
	alt="A shirt"
/>
```

And good bye to having to hand-craft `sizes`.

## For hero images: keep being meticulous

For the "hero" images, the ones "above the fold," which are candidates to become the page's LCP, we must continue to use meticulous upfront sizing via `sizes`.

```html
<img
	loading="eager"
	srcset="
		shirt_300w.jpg   300w,
		shirt_600w.jpg   600w,
		shirt_1200w.jpg 1200w,
		shirt_2400w.jpg 2400w
	"
	sizes="(min-width: 1200px) 100vw,
         (min-width: 600px) 600px,
         300px"
	alt="A shirt"
/>
```

We'd still have to provide all the image sizes in a relatively long `srcset` tag though.

## I have a dream

I've been dreaming about having a "super image" format containing all image sizes inside. Like if image files were a "bundled folder of images".

Then we could do:

```html
<img srcset="shirt_all-w.webp" sizes="auto" loading="lazy" alt="A shirt" />
```

And the browser would take care of checking what image sources are contained in that file, and only download the relevant part of it.

Do you think my dream will ever become true?

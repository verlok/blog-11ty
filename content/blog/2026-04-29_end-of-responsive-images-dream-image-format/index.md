---
title: "My dream of a container image format: a call to the web community"
description: "A single image file bundling every resolution could finally make the `<img>` tag simple again. A call to the web community to build a container image format."
date: 2026-04-29
tags:
  - responsive images
  - images
  - web performance
  - lazy loading
layout: layouts/post.njk
---

Andy Bell wrote a great article on [the end of responsive images](https://piccalil.li/blog/the-end-of-responsive-images/#the-beginning-and-the-end), explaining how the now widely supported `sizes="auto"` attribute lets browsers figure out the rendered size of lazy-loaded images on their own, removing the need to hand-craft the `sizes` attribute for most images.

Reading it brought back a dream I've been carrying for years: an image format that would let us write a radically simpler `<img>` tag — simpler than even `sizes="auto"` allows. I'll get to it below. But first, a quick recap of Andy's piece for context.

<figure>
	{% image "cover.png", "On the left, the text 'The dream of a container image format'. On the right, a graphical representation of a container image labeled '.img' bundling multiple image sizes inside it.", [648, 1296], "648px", true %}
	<figcaption>A dream image format: one file, all the sizes you need.</figcaption>
</figure>

## Andy's TL;DR

For lazy-loaded images (most images on a page), we can drop the hand-crafted `sizes` and let the browser do the work:

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

For "hero" images — the ones above the fold, candidates to become the page's LCP — we still need to be meticulous with upfront sizing via `sizes`:

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

So `sizes` can mostly go away. But we're still left with that long `srcset` listing every variant. And that's where my old dream comes back in.

## I have a dream

For years I've been dreaming about a container image format — a single file containing every resolution of an image inside it. Think of it as a bundled folder of images, packaged as one.

With a format like that, the `<img>` tag, at least for lazy images, could be drastically simplified. Something like this:

```html
<img srcset="shirt.imgc *w" sizes="auto" loading="lazy" alt="A shirt" />
```

No `srcset`. No comma-separated list of widths. The browser would open the file, see which resolutions are inside, and download only the bytes it needs for the size it has to render.

The `<img>` tag, finally simple again.

## A call to the community

Andy's article shows that the platform can absorb a lot of the complexity we've been carrying around in our markup. I'd love to see us go even further.

To the web standards folks, image format authors, and browser engineers reading this: is a container image format something we could actually build? HTTP range requests already let browsers fetch slices of files. Container formats already exist in other domains. The pieces feel like they're there.

I've been holding this dream for a long time. Could we finally make it real?

---
title: Do we still need lazy loading libraries and `data-src`?
description: Back in the day, when browser support for native lazy loading wasn’t widespread, the best practice was to use `data-src` attributes and a JavaScript library like my vanilla-lazyload to load images as they entered the viewport. Is this still best practice today?
date: 2022-11-13
tags:
  - considerations
  - lazy loading
  - hybrid lazy loading
  - native lazy loading
---

Back in the day, when browser support for [native lazy loading](https://web.dev/browser-level-image-lazy-loading/) wasn’t widespread, the best practice was to use `data-src` attributes and a JavaScript library like my [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) to load images as they entered the viewport. Is this still best practice today?

## What is lazy loading?

**Lazy loading images** is a technique to **defer the loading of _below-the-fold_ images** until they are about to enter the viewport (the visible portion of the page). This technique saves bandwidth, reduces CDN costs, lowers the website's carbon footprint, and improves page rendering time, particularly the [Largest Contentful Paint](https://web.dev/lcp/).

## JavaScript-driven image lazy loading

Traditionally, lazy loading images involved replacing the `src` attribute with a `data-src` attribute and using JavaScript to detect when the images are nearing the viewport, then copy the `data` attributes into the proper ones, triggering their deferred loading.

```html
<img
  data-src="turtle.jpg"
  alt="Lazy turtle"
  class="lazy"
/>
```

## Native lazy loading

With native lazy loading, <abbr title="also known as">AKA</abbr> [browser-level lazy loading](https://web.dev/browser-level-image-lazy-loading/), simply add the `loading="lazy"` attribute to the `<img>` tag.

```html
<img
  src="turtle.jpg"
  alt="Lazy turtle"
  loading="lazy"
/>
```

This works on [all modern browsers](https://caniuse.com/loading-lazy-attr).

## Do we still need JavaScript-driven lazy loading?

No, unless you want greater control over the lazy loading process.

Let's see what are the cases for using JavaScript-driven lazy loading, instead of just using `loading="lazy"`.

### 1. Supporting users on slow or faulty connections

JavaScript libraries like [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) can cancel the download of images that leave the viewport and retry downloads if interrupted, enhancing the user experience on slow connections.

A use case for that is:

- pages with many images +
- users on slow connections +
- fast scroll down

Native lazy loading makes browsers download lazy images from top to bottom, resulting in a delay to show the bottom images.

Javascript libraries like [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) will cancel the download of images that exit the viewport, keeping users' bandwidth focused on the images currently in the viewport.

Another use case is:

- images downloading
- network connection interrupted

[vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) will retry downloading those images when the network connection is restored.

You can try these features on any of the [vanilla-lazyload demos](https://verlok.github.io/vanilla-lazyload/#-demos), like the [basic case demo](https://verlok.github.io/vanilla-lazyload/demos/image_basic.html), and throttling or disabling your connection speed in the developer tools of your browser.

### 2. Advanced callbacks or CSS classes

JavaScript-driven lazy loading provides callbacks and CSS classes for various events (start loading, finish loading, error, enter viewport, exit viewport, etc.), allowing for enhanced visual effects and monitoring.

Those callbacks and CSS classes can be very helpful to create visual effects on your page.

Find more about callbacks and classes in [vanilla-lazyload API](https://verlok.github.io/vanilla-lazyload/#-api) / [options](https://verlok.github.io/vanilla-lazyload/#options).

### 3. Optimizing web performance, specifically Largest Contentful Paint

JavaScript-driven lazy loading offers more control over which images are downloaded, helping to optimize the Largest Contentful Paint (LCP).

With native lazy loading, you don't have control over what images get downloaded from the browser.

The use case:

- some images are below-the-fold but not far off
- some images barely appear in the visible portion of the page

Native lazy loading would start downloading those images, which will share the bandwidth with the download of your LCP image, while you want to download the latter with the highest priority.

JavaScript-driven lazy load like vanilla-lazyload provide [APIs](https://verlok.github.io/vanilla-lazyload/#-api) and [options](https://verlok.github.io/vanilla-lazyload/#options) to fine-grain control how far off-the-viewport images should be to start downloading.

### 4. Lazy loading other assets

For lazy loading background images, videos, animated SVGs, and more, a JavaScript library like [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) is still required.

## Find out more

Check the [vanilla-lazyload documentation](https://verlok.github.io/vanilla-lazyload/) or my blog post [lazy load responsive images in 2020](/blog/lazy-load-responsive-images-in-2020-srcset-sizes-picture-webp/).

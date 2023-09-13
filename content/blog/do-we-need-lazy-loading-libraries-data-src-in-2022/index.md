---
title: Do we still need lazy loading libraries and data-src in 2022?
description: Back in the days, as browser support for native lazy loading was not as widespread as today, the best practice was to markup our images with data attributes like data-src and use a JavaScript library like my vanilla-lazyload to start loading them as they entered the visible portion of the page. Is it still a best practice today?
date: 2022-11-13
tags:
  - considerations
  - lazy loading
  - hybrid lazy loading
  - native lazy loading
---

Back in the days, as browser support for [native lazy loading](https://web.dev/browser-level-image-lazy-loading/) was not as widespread as today, the best practice was to markup our images with data attributes like `data-src` and use a JavaScript library like my [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) to start loading them as they entered the visible portion of the page. Is it still a best practice today?

## What is lazy loading?

**Lazy loading images** is a technique to **defer the loading of _below-the-fold_ images** to when they **entered the viewport**, or are close to doing it, viewport meaning the visible portion of the page. It allows you to save bandwidth and money (if you're paying a CDN service for your images), reduce the carbon footprint of your website, and last but not least reduce the rendering time of your page, improving web performance, and particularly the [Largest Contentful Paint](https://web.dev/lcp/).

## JavaScript-driven image lazy loading

To lazy load images, it’s a very common practice to mark them up by replacing the proper `src` attribute with a similar data attribute, `data-src`, then rely on a JavaScript solution to a) detect when the images are getting close to the visible portion of the website (typically because the user scrolled down), b) to copy the `data` attributes into the proper ones, triggering the deferred loading of their content.

```html
<img
  data-src="turtle.jpg"
  alt="Lazy turtle"
  class="lazy"
/>
```

## Native lazy loading

With native lazy loading, <abbr title="also known as">aka</abbr> [browser-level lazy loading](https://web.dev/browser-level-image-lazy-loading/), to lazy load images, you just need to add the `loading="lazy"` attribute on the `<img>` tag.

```html
<img
  src="turtle.jpg"
  alt="Lazy turtle"
  loading="lazy"
/>
```

That enables native lazy loading on [browsers that support it](https://caniuse.com/loading-lazy-attr), meaning pretty much every browser except our old _"friend"_ Internet Explorer.

## Do we still need JavaScript-driven lazy loading?

The short answer is: no unless you want greater control over how lazy loading is handled.

So, what are the cases for using JavaScript-driven lazy loading, instead of just using `loading='lazy'`?

### 1. You care for users on slow or faulty connections (hint: you should)

What happens if you have some pages with many images, and some users on slow connections who scroll down faster than their connection would take to download the images?

Native lazy loading would make browsers download your lazy images in this order: from the first that appeared on the page to the last ones.

With Javascript-driven libraries like [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload), which cancels the download of images that exit the visible portion of the page while still downloading, your users bandwidth will be always focused on downloading the images that are in the visible portion of the page.

Moreover, if image download gets interrupted by a network error, e.g. if the user's connection goes off for a while, vanilla-lazyload will retry download those images when the network becomes available again.

All of this results in a much better user experience. You can try these features on any of the [vanilla-lazyload demos](https://verlok.github.io/vanilla-lazyload/#-demos), like the [basic case demo](https://verlok.github.io/vanilla-lazyload/demos/image_basic.html), and throttling or disabling your connection speed in the developer tools of your browser.

### 2. You need advanced callbacks or CSS classes on your images

Native lazy loading defers the loading of images and you can still watch over events like `loaded`, but you don't have the ability to watch for other events on your images, like start loading, error, exited viewport, etc.

JavaScript-driven lazy loading will trigger callbacks and apply CSS classes in different cases: when images start loading, when images enter or exit the viewport, when they all finished loading, and even when their loading fails because of a network error.

Those callbacks and CSS classes might be very helpful to create visual effects on your page.

Find more about callbacks and classes in [vanilla-lazyload API](https://verlok.github.io/vanilla-lazyload/#-api) / [options](https://verlok.github.io/vanilla-lazyload/#options).

### 3. You want to optimize web performance, specifically the Largest Contentful Paint of your page

With native lazy loading, you don't have control over what images get downloaded from the browser.

There might be some images that barely appear in the visible portion of the page, or they are below the fold but not far off, that browsers will download even if they are not the main image of the page, meaning the one that triggers the largest paint on your page.

With JavaScript-driven lazy load you have plenty of options to control if you want to pre-download images that are off-viewport, and how far off.

If you want to optimize the [Largest Contentful Paint](https://web.dev/lcp/) on the image causing the LCP, you might be interested in experimenting with JavaScript-driven lazy loading to have more control over it.

Check out [vanilla-lazyload API](https://verlok.github.io/vanilla-lazyload/#-api) / [options](https://verlok.github.io/vanilla-lazyload/#options) to know more.

### 4. Lazy loading of everything else

In this article, I focused only on _content_ images, but there is much more to lazy-load: _background_ images, to begin with, then videos, and animated SVGs. For these types of assets, you will still need a JavaScript lazy-loading library.

## Find out more

Check the [vanilla-lazyload documentation](https://verlok.github.io/vanilla-lazyload/) or my blog post [lazy load responsive images in 2020](/blog/lazy-load-responsive-images-in-2020-srcset-sizes-picture-webp/).

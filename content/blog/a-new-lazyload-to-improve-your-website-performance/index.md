---
title: A new LazyLoad to improve your website performance
description: In the latest days I've been working on websites performance optimization and I realized that there is no way to take advantage of the progressive JPEG image format on websites if you're using jQuery_lazyload from Mika Tuupola, so I decided to write my own lazy load, which turned to be better for multiple reasons.
date: 2014-11-20
tags:
  - lazyload
  - web performance
  - open source
---

In the latest days I've been working on websites performance optimization and I realized that there is no way to take advantage of the **progressive JPEG** image format on websites if you're using [jQuery_lazyload](https://github.com/tuupola/jquery_lazyload "Mika Tuupola"). So after sending a pull request to its author, I decided to write my own lazy load, which turned out to be better, because:

* it's 6x faster
* it allows you to [lazy load responsive images](./lazy-load-responsive-images-srcset)
* it doesn't depend on jQuery
* it best supports the progressive JPEG format

More information on the [GitHub Repo](https://github.com/verlok/vanilla-lazyload).

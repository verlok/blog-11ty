---
title: How to optimise for CLS when loading more content asynchronously
description: Cumulative Layout Shift (CLS) is an important, user-centric metric for measuring visual stability because it helps quantify how often users experience unexpected layout shifts — a low CLS helps ensure that the page is delightful.
date: 2020-08-31
tags:
  - cumulative layout shift
  - techniques
---

Cumulative Layout Shift (CLS) is an important, user-centric metric for measuring visual stability because it helps quantify how often users experience unexpected layout shifts — a low CLS helps ensure that the page is delightful.

{% image "optimise-cls-load-more.webp", "A website showing 4 images and a Load More button", [648, 1296], "648px" %}

What you might not know is:

- **CLS is measured continuously**. In fact, its value is also updated while your users scroll your page, if the scroll generates some layout movement
- **CLS measurement is paused for 500ms** whenever a user interaction like a click or a keyboard event occurs

Long story short, Cumulative Layout Shift measures every unexpected layout movement occurring while your users interact with the page, including while they scroll down.

> When loading more content in our pages, the most common source of CLS is the page footer becoming visible for a while, then being pushed below-the-fold again by new, dynamically added content.

So how to keep CLS from growing when we need to load new content dynamically, e.g. to load a whole new page of products?

[Continue reading on Medium](https://medium.com/ynap-tech/how-to-optimize-for-cls-when-having-to-load-more-content-3f60f0cf561c)

---
title: 'Should we stop using the word "Responsive" for design?'
description: "How Ethan Marcotte's 2010 definition of \"responsive\" is colliding with mobile app guidelines on \"adaptability\" and web performance interactivity metrics."
date: 2026-07-07
tags:
  - web design
  - web performance
  - user experience
  - terminology
layout: layouts/post.njk
image: ./cover.jpg
image_alt: "A pensive developer looking at screens showing responsive websites and adaptive apps, wondering about the terminology."
---

Back in 2010, Ethan Marcotte coined the term [Responsive Web Design](https://ethanmarcotte.com/books/responsive-web-design/). Since then, we've used "responsive" to describe a website that adapts its layout to the viewport size. Fluid grids, flexible images, media queries.

<figure>
	{% image "cover.jpg", "A pensive developer looking at screens showing responsive websites and adaptive apps, wondering about the terminology.", [648, 1296], "648px", true %}
	<figcaption>Should we use "adaptive" for layouts and "responsive" for performance?</figcaption>
</figure>

For a while, we tried to separate it from "adaptive" design. Back then, "adaptive" websites had a bit of a bad reputation because they usually relied on server-side device detection and user-agent sniffing to serve completely different HTML and CSS to the browser (remember Aaron Gustafson's book?). Because UA sniffing was brittle and prone to breaking, the web community wanted to distance itself from it. Ethan's responsive model served the exact same code to everyone, letting the browser do the work. "Responsive" won the vocabulary war, and "adaptive" became a word associated with outdated, server-detected layouts.

But fast-forward to today, and these terms have split in ways that are causing real confusion.

## The mobile definition of "adaptive" (Android and iOS)

If you look at modern mobile app development—both Android and iOS—the word **"adaptive"** is the standard.

Google heavily uses it for Android app design. With the rise of foldable phones and tablets, apps can't just stretch to fit. They need to completely restructure. In their [guide on adaptive layouts](https://developer.android.com/design/ui/mobile/guides/layout-and-content/adapt-layout), the focus is entirely on "adaptive" layouts (changing layout structures based on breakpoints and fold states), while "responsive" concepts (like fluid sizing) are just seen as a foundation.

Apple follows a similar logic. In their [Human Interface Guidelines for Layout](https://developer.apple.com/design/human-interface-guidelines/layout), they frame layout adjustments around the concept of **"Adaptability"** rather than "Responsiveness." They guide developers to build interfaces that adapt seamlessly to different devices, screen sizes, and orientations using size classes and adaptive structures.

So, in the mobile app world, adapting to screen sizes is consistently called _adaptive_ design.

## The web performance definition of "responsiveness"

At the same time, in the web performance space—where I spend a lot of time—the word "responsive" has taken on a completely different meaning.

When performance engineers say they want to make a page "responsive," they aren’t talking about viewports or media queries at all. They are talking about **interactivity**. Specifically, how fast the browser reacts to user inputs.

With Google's [Interaction to Next Paint (INP)](https://web.dev/inp/) metric, "responsiveness" is measured in milliseconds. If a user taps a button and the page freezes for 300ms, the website has poor responsiveness.

## The terminology collision

This has created a confusing mess.

If a product manager says: _"We need to make this website more responsive."_
What do they mean?

- Do we need to adjust our CSS media queries for foldables and tablets?
- Or do we need to break up long JavaScript tasks to improve our INP?

We are using the exact same word to mean "adapts to screen size" and "reacts fast to user input."

## A proposal: Split the terminology

Maybe it's time to let the word "responsive" go—at least when we talk about screen sizes.

What if we started using **"adaptive"** for everything related to layout adjustment (both on the web and in native apps), and reserved **"responsive"** purely for web performance?

Under this model:

- An **adaptive** website or app is one that adjusts its layout to the viewport (mobile, desktop, foldable).
- A **responsive** website or app is one that is fast to respond to user interactions (low INP, no frozen main thread).

It feels cleaner, more logical, and it solves the vocabulary overlap. But is the web community ready to drop Ethan Marcotte's 2010 definition? Or is "responsive design" too deeply engraved in our brains?

I'm curious to hear what you think. Does this distinction make sense, or is it too late to change? Feel free to [reach out](/contact/) and let me know!

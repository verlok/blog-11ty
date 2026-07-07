---
title: "Responsive vs. Adaptive: Are we using the wrong words?"
description: "How Ethan Marcotte's definition of 'responsive' is colliding with Google's 'adaptive' layouts for Android foldables and the web performance INP metric."
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

For a while, we tried to separate it from "adaptive" design. The latter usually meant snapping to fixed breakpoints, or serving different HTML based on server-side device detection (remember Aaron Gustafson's book?). But eventually, "responsive" won. It became the default term for "looks good on mobile and desktop."

But fast-forward to today, and these terms have split in ways that are causing real confusion.

<figure>
	{% image "cover.jpg", "A pensive developer looking at screens showing responsive websites and adaptive apps, wondering about the terminology.", [648, 1296], "648px", true %}
	<figcaption>Are we building a responsive layout or optimizing for responsiveness?</figcaption>
</figure>

## Google's definition of "adaptive" in Android

If you look at Android development or modern UI design guidelines, Google is heavily pushing the word **"adaptive"**.

With the rise of foldable phones and tablets, apps can't just stretch to fit. They need to completely restructure. In their [guide on adaptive layouts](https://developer.android.com/design/ui/mobile/guides/layout-and-content/adapt-layout), the main focus is entirely on "adaptive" layouts (changing layouts based on breakpoints and fold states). They still reference "responsive" design concepts (like fluid grids and flexible components) as a foundation, but the end-goal and the terminology they use for a screen-size layout adjustment is always **adaptive**.

So, in Google's mobile world, adapting to screen size has become *adaptive* design.

## The web performance definition of "responsiveness"

At the same time, in the web performance space—where I spend a lot of time—the word "responsive" has taken on a completely different meaning.

When performance engineers say they want to make a page "responsive," they aren’t talking about viewports or media queries at all. They are talking about **interactivity**. Specifically, how fast the browser reacts to user inputs.

With Google's [Interaction to Next Paint (INP)](https://web.dev/inp/) metric, "responsiveness" is measured in milliseconds. If a user taps a button and the page freezes for 300ms, the website has poor responsiveness.

## The terminology collision

This has created a confusing mess. 

If a product manager says: *"We need to make this website more responsive."*
What do they mean?
*   Do we need to adjust our CSS media queries for foldables and tablets?
*   Or do we need to break up long JavaScript tasks to improve our INP?

We are using the exact same word to mean "adapts to screen size" and "reacts fast to user input." 

## Should we stop using the word "Responsive" for layouts?

Maybe it's time to let the word "responsive" go—at least when we talk about screen sizes. 

What if we started using **"adaptive"** for everything related to layout adjustment (both on the web and in native apps), and reserved **"responsive"** purely for web performance? 

Under this model:
*   An **adaptive** website or app is one that adjusts its layout to the viewport (mobile, desktop, foldable).
*   A **responsive** website or app is one that is fast to respond to user interactions (low INP, no frozen main thread).

It feels cleaner, more logical, and it solves the vocabulary overlap. But is the web community ready to drop Ethan Marcotte's 2010 definition? Or is "responsive design" too deeply engraved in our brains?

I'm curious to hear what you think. Does this distinction make sense, or is it too late to change? Feel free to [reach out](/contact/) and let me know!

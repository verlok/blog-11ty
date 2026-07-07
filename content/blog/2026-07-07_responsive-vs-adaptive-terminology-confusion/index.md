---
title: "Responsive vs. Adaptive: What do these words even mean anymore?"
description: "How Ethan Marcotte's 2010 definition of 'responsive' is colliding with Google's modern 'adaptive' Android apps and web performance interactivity metrics."
date: 2026-07-07
tags:
  - web design
  - web performance
  - user experience
  - terminology
layout: layouts/post.njk
image: ./cover.jpg
image_alt: "A confused developer scratching their head while surrounded by screens adapting to different sizes and web pages responding to clicks."
---

Remember 2010? It was a simpler time (except for having to support IE6).

Back then, Ethan Marcotte coined the term [Responsive Web Design](https://ethanmarcotte.com/books/responsive-web-design/), and suddenly we had a unified vocabulary for making websites work on both desktops and those shiny new iPhones. A mix of fluid grids, flexible images, and media queries. If it adapted its layout to the viewport, it was "responsive."

For a brief moment, we tried to separate it from "adaptive" design—the latter usually meaning snapping to fixed breakpoints or serving different HTML based on server-side device detection (like Aaron Gustafson's approach). But eventually, "responsive" won. It became the blanket term for "looks good on any screen size."

But fast forward to today, and I’m starting to feel like these terms have lost all their original meaning. Actually, they’ve split in ways that are causing real confusion.

Here is why.

## Exhibit A: Google and Adaptive Android Apps

If you’ve dipped your toes into Android development or modern UI design guidelines recently, you'll know that Google is heavily pushing the word **"adaptive"** (in guidelines like their official guide on [how to build adaptive layouts](https://developer.android.com/design/ui/mobile/guides/layout-and-content/adapt-layout)).

With the rise of foldable phones (like the Pixel Fold) and tablets, apps can no longer just stretch to fit the screen. They need to completely restructure their layouts. Google’s design documentation now distinguishes the two terms:

- **Responsive layouts** are fluid—they stretch, squeeze, and use constraint-based rules to adjust spacing within a single layout structure.
- **Adaptive layouts** are structural—they change the entire layout structure (like swapping a bottom navigation bar for a navigation rail, or splitting into a list-detail view) depending on "Window Size Classes".

So in Google’s world, when you design for foldables, you are building an _adaptive_ app.

## Exhibit B: Web Performance and "Responsiveness"

At the same time, in the web performance world—a space I spend a lot of time in—the word "responsive" has been completely hijacked.

When web performance engineers talk about making a page "responsive," they aren’t talking about CSS media queries or viewports. They are talking about **interactivity**. Specifically, how fast the browser reacts to user input.

With Google’s **Interaction to Next Paint (INP)** metric now a Core Web Vital, "responsiveness" is a measure of millisecond delays. If a user clicks a button and the page freezes for 300ms because of a long-running JavaScript task, that page has poor _responsiveness_.

So now, we have a linguistic collision.

## The Cognitive Load of Vocabulary

If a product owner walks into a meeting and says, _"We need to make this app more responsive,"_ what do they mean?

- Do we need to rewrite our CSS to support tablets?
- Do we need to break up long tasks in our JS event handlers to fix INP?
- Or does the developer need to implement a master-detail panel for foldable screens?

We’re using the same word to mean "adapts to screen dimensions" and "reacts quickly to user inputs." And we're using "adaptive" to mean "adapts to screen dimensions, but only sometimes, and differently depending on if it's a website or a native app."

It’s messy.

<figure>
	{% image "cover.jpg", "A confused developer scratching their head while surrounded by screens adapting to different sizes and web pages responding to clicks.", [648, 1296], "648px", true %}
	<figcaption>Responsive? Adaptive? Interactive? It's getting crowded in here.</figcaption>
</figure>

## Let's Reset: What Should We Call Them?

I want to hear from you on this.

If we had a magic wand and could reset our industry jargon today, how would you name these concepts to make them clear for everyone—designers, web developers, app developers, and product managers?

- Do you think **"adaptive"** is a better word than "responsive" for layouts that adjust to screen sizes?
- Should **"responsive"** be reserved purely for interactivity and input delay (like INP)?
- Or has Ethan Marcotte's 2010 definition of "responsive" earned its place forever, performance metrics be damned?

Drop a comment below or find me on social media. Let’s figure out if we’re all speaking the same language anymore.

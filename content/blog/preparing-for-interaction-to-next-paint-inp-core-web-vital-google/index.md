---
title: Preparing for Interaction to Next Paint (INP), a new Core Web Vital starting March 2024
description: As a web performance consultant, I'm always on the lookout for new developments that impact the user experience of websites. One such upcoming change is the introduction of a new metric called Interaction to Next Paint (INP) by Google. Set to become a Core Web Vital in March 2024, INP is designed to measure the time it takes for a website to respond to user interactions. In this blog post, we will delve into what INP is, why it matters, and how companies can prepare themselves to ensure their websites meet this crucial web performance metric.
date: 2023-07-12
tags:
  - core web vitals
  - web performance
  - interaction to next paint
---

<figure>
	{% image "creation-of-adam.webp", "Michelangelo's 'Creation of Adam' painting", [648, 1296], "648px" %}
	<figcaption>Michelangelo's "Creation of Adam" painting</figcaption>
</figure>

As a web performance consultant, I'm always on the lookout for new developments that impact the user experience of websites. One such upcoming change is the introduction of a new metric called [Interaction to Next Paint (INP)](https://web.dev/inp/) by Google. Set to become a [Core Web Vital](https://web.dev/cwv/) in March 2024, INP is designed to measure the time it takes for a website to respond to user interactions. In this blog post, we will delve into what INP is, why it matters, and how companies can prepare themselves to ensure their websites meet this crucial web performance metric.

## Understanding Interaction to Next Paint (INP)

INP is an important addition to the Core Web Vitals, a set of metrics that Google uses to assess and rank websites based on their user experience.

Unlike other metrics such as Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS), which measure loading and visual stability, INP focuses on interactivity, meaning how quickly a website responds to user input after it has loaded. It quantifies the time it takes for the website to be ready to paint something after users interacted with them, and it aims to bring users an experience without any noticeable delays.

## Why INP Matters

In today's digital landscape, user expectations are higher than ever. People demand fast and seamless interactions when browsing the web, and any delays or unresponsive elements can result in frustration and abandonment. INP addresses this issue directly by measuring the time it takes for a website to respond to user inputs, which is a critical factor in delivering an exceptional user experience.

Moreover, Google has emphasized the importance of Core Web Vitals as a ranking factor for search engine optimization (SEO). Websites that provide better user experiences, as measured by these metrics, are more likely to rank higher in search results. With INP set to become a Core Web Vital, companies that prioritize website interactivity will not only enhance their user experience but also gain an advantage in search engine visibility.

## Preparing for INP

As the March 2024 deadline approaches, companies need to prepare for the inclusion of INP as a Core Web Vital. Here are some steps to ensure your website is ready:

1. **Evaluate Current INP Performance**: Start by assessing your website's current INP performance. The easiest way is to check your website's INP values on CrUX or PageSpeed Insights. You can also query INP values for your competitors' websites. Benchmark your current INP scores and set goals for improvement.

2. **Improve INP**: See next chapter to find out what to do to improve INP on your website.

3. **Continuously monitoring and iterate**: Web performance is an ongoing process, and it's crucial to monitor and measure INP regularly. Continuously analyze your website's performance, implement optimizations, and retest to ensure your INP scores meet the desired targets. Regularly review Google's developer documentation and community forums for updated best practices.


## How to improve INP

### Avoid or break up long tasks

Tasks are any piece of discrete work that the browser does. Tasks include rendering, layout, parsing, and compiling and executing scripts. When tasks become long tasks—that is, 50 milliseconds or longer—they block the main thread from being able to respond quickly to user inputs.

Another option is to consider using APIs such as `isInputPending` and the Scheduler API. `isInputPending` is a function that returns a boolean value that indicates whether user input is pending. If it returns true, you can yield to the main thread so it can handle the pending user input. [Check out `isInputPending`](https://web.dev/optimize-long-tasks/#yield-only-when-necessary) to yield only when necessary.

The Scheduler API is a more advanced approach, which allows you to schedule work based on a system of priorities that take into account whether the work being done is user-visible or backgrounded. [Check out the Scheduler API](https://web.dev/optimize-long-tasks/#a-dedicated-scheduler-api).

By breaking up long tasks, you're giving the browser more opportunities to fit in critical user-visible work, such as dealing with interactions and any resulting rendering updates.

### Avoid unnecessary JavaScript

There's no doubt about it: websites are [shipping more JavaScript](https://almanac.httparchive.org/en/2022/javascript#how-much-javascript-do-we-load) than ever before, and the trend doesn't look like it's changing any time soon. When you ship too much JavaScript, you're creating an environment where tasks are competing for the main thread's attention. This can definitely affect your website's responsiveness, especially during that crucial startup period.

This is not an unsolvable problem, however. You do have some options:

- Use the coverage tool in Chrome DevTools to find unused code in your website's resources. By reducing the size of the resources you need during startup, you can ensure your website spends less time parsing and compiling code, which leads to a smoother initial user experience. [Check out the Coverage Tool](https://developer.chrome.com/docs/devtools/coverage/).
- Sometimes the unused code you find using the coverage tool is marked "unused" because it wasn't executed during startup, but is still necessary for some functionality in the future. This is code that you can move to a separate bundle via code splitting. [Find out more about code splitting](https://web.dev/reduce-javascript-payloads-with-code-splitting/).
- If you're using a tag manager, be sure to periodically check your tags to make sure they are optimized, or even if they're still being used. Older tags with unused code can be cleared out to make your tag manager's JavaScript smaller and more efficient. [More best practices for tag managers](https://web.dev/tag-best-practices/).

### Avoid large rendering updates

JavaScript isn't the only thing that can affect your website's responsiveness. Rendering can be a type of expensive work in its own right—and when large rendering updates happen, they can interfere with your website's ability to respond to user inputs.

Optimizing rendering work isn't a straightforward process, and it often depends on what you're trying to achieve. Even so, there are some things you can do to ensure that your rendering updates are reasonable and don't sprawl into long tasks:

- Avoid using `requestAnimationFrame()` for doing any non-visual work. `requestAnimationFrame()` calls are handled during the rendering phase of the event loop, and when too much work is done during this step, rendering updates can be delayed. It's essential that any work you're doing with `requestAnimationFrame()` is reserved strictly for tasks that involve rendering updates.
- Keep your DOM size small. DOM size and the intensity of layout work are correlated. When the renderer has to update the layout for a very large DOM, the work required to recalculate its layout can increase significantly. [Avoiding excessive DOM size](https://developer.chrome.com/docs/lighthouse/performance/dom-size/).
- Use CSS containment. CSS containment relies on the CSS contain property, which gives instructions to the browser about how to do layout work for the container the contain property is set on, including even isolating the scope of layout and rendering to a specific root in the DOM. It's not always an easy process, but by isolating areas containing complex layouts, you can avoid doing layout and rendering work for them that isn't necessary. [More about CSS Containment](https://developer.mozilla.org/docs/Web/CSS/CSS_Containment).


## Conclusion

With Interaction to Next Paint (INP) set to become a Core Web Vital in March 2024, companies should start to prioritize website interactivity to deliver an exceptional user experience and improve search engine rankings.

By evaluating current INP performance, optimizing for interactivity, and continuously monitoring and iterating, businesses can prepare themselves for the upcoming change.

Embracing INP as a vital performance metric will not only benefit users but also contribute to the long-term success of their online presence.

## Need a hand?

If you want to know more about INP, how to optimize it, or you need web performance consultancy, feel free to [reach out to me](/contact/).

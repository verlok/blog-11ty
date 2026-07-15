---
title: "Introducing yieldy-for-loop: an npm package to keep your loops non-blocking (and your UI smooth)"
description: "A tiny utility to help you process large loops in JavaScript without freezing the UI. Inspired by Rick Viscomi's article “Breaking up with long tasks, or how I learned to group loops and wield the yield”, yieldy-for-loop periodically yields control to the browser so your app stays responsive."
tags:
  - inp
  - resources
---

If you’ve ever had to process thousands (or millions) of items in JavaScript, you’ve likely experienced that dreaded lag or UI freeze. It can happen when you perform intensive loops on the main thread, blocking updates to the interface. To tackle this, I’ve created an NPM package called [yieldy-for-loop](https://www.npmjs.com/package/yieldy-for-loop). This tiny utility helps you break large loops into chunks, periodically yielding control to the browser so your application remains responsive.

<figure>
	{% image "yieldy-for-loop-npm.png", "yieldy-for-loop on npm", [648, 1296], "648px" %}
	<figcaption>yieldy-for-loop in npm's website</figcaption>
</figure>

## Background

**Long tasks** are a common performance bottleneck in front-end applications. When the main thread is busy running large loops, browsers can’t update the UI, and users may notice unresponsiveness or janky scrolling. Inspired by the article [“Breaking up with long tasks, or how I learned to group loops and wield the yield” (PerfPlanet 2024)](https://calendar.perfplanet.com/2024/breaking-up-with-long-tasks-or-how-i-learned-to-group-loops-and-wield-the-yield/), I wanted a simple, reusable function that would:

1. **Break large loops** into smaller batches.
2. **Yield to the browser** after each batch, giving the rendering engine a chance to paint and the user a chance to interact.
3. **Adapt** to whether the document is visible or hidden, since work behind a hidden tab can be deprioritized or even paused in many browsers.

Hence, `yieldy-for-loop` was born.

## What it does

- **Non-blocking iteration**: Processes your items in batches, aiming to stay within a target time slice (e.g., 33ms for ~30 FPS).  
- **Auto-yield logic**:
  - If the page is **hidden**, yields less frequently (e.g., every 500ms) to save resources.
  - If the page is **visible**, yields more frequently to keep animations and user interactions smooth.
- **Browser compatibility**: Uses a race between a short `setTimeout` and `requestAnimationFrame`, and optionally calls the [Scheduler API](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler) if available.

## Installation

```bash
npm install yieldy-for-loop
```

## Usage example

```js
import yieldyForLoop from 'yieldy-for-loop';

const items = Array.from({ length: 100000 }, (_, i) => i);

function processItem(item) {
  // Your heavy processing logic
  console.log('Processing item:', item);
}

(async function main() {
  console.log('Starting yieldy loop...');
  
  await yieldyForLoop(items, processItem, {
    fps: 30,              // Aim for ~30 frames per second
    hiddenThreshold: 500, // Yield threshold (in ms) when tab is hidden
  });
  
  console.log('All items processed without blocking the UI!');
})();
```

## How it works

1. **Time Slice Calculation**: 
   - The default frames per second (FPS) is set to **30**, so it calculates a batch duration of ~33ms.  
2. **`shouldYield()` Check**: 
   - Before processing each item, the function checks how much time has passed since the last yield.  
   - If it exceeds the threshold (e.g., ~33ms or 500ms if the document is hidden), it yields control back to the browser.  
3. **Yielding Mechanisms**:
   - **Page Hidden**: Uses `setTimeout(resolve, 1)`—just enough to let other tasks slip in.
   - **Page Visible**: Uses a combination of `requestAnimationFrame` and a short timeout. If the experimental `scheduler.yield()` is available, it calls that as well.  

By splitting your loop into batches, the browser has breathing room to render, respond to user input, and run other scripts, thereby avoiding the dreaded “page unresponsive” problem.

## Why you need this

- **Better user experience**: Smooth scrolling, responsive buttons, and no random freezing.
- **Easy to use**: Just wrap your normal loop logic with `yieldyForLoop`. 
- **Micro-optimized**: The code is minimal and straightforward, so it’s easy to maintain or customize.

## Next steps

- **Try it out**: Install the package, import it, and integrate it into any heavy loop you have.  
- **Contributions**: Issues and pull requests are welcome! Check out the [GitHub repo](https://github.com/YourUsername/yieldy-for-loop) to file bugs, request features, or open PRs.  
- **Spread the word**: If you find this helpful, let others know.  

## Shout-out

A special thanks to [Rick Viscomi](https://rviscomi.dev/) for writing the PerfPlanet article that inspired me to build this.
Breaking up large tasks into smaller chunks has become a key performance strategy, and `yieldy-for-loop` aims to make it even easier to adopt.

## Conclusion

Long loops don’t have to mean unresponsive UIs. By periodically yielding to the browser, you can maintain a slick experience for your users. `yieldy-for-loop` takes care of the heavy lifting with minimal code, letting you focus on what you do best—building amazing web apps.

If you have questions, reach out or open an issue on GitHub. 
Now, go forth and keep those loops running smoothly.
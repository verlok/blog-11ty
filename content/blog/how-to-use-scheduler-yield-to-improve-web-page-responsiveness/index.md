---
title: How to use `scheduler.yield` to improve web page responsiveness
description: Google Chrome is introducing a new feature called `scheduler.yield`. This feature allows web developers to explicitly tell the browser to yield control to the main thread. Here are the key points.
date: 2023-08-31
tags:
  - web performance
  - google chrome
  - interaction to next paint
---

<figure>
	{% image "yield.webp", "A street signal, a white triangle with red border with a red YIELD word inside it", [648, 1296], "648px" %}
	<figcaption>Just a random yield image</figcaption>
</figure>

In August 2023, Google introduced the `scheduler.yield`, available as an origin trial in Chrome 115 and later.

The `scheduler.yield` is a new feature in Chrome that allows web developers to explicitly tell the browser to yield control back to the main thread. This can be useful for tasks that are known to take a long time, as this allows _other_ tasks to get time on the main thread sooner (than if they had to wait for long tasks to finish).

When you explicitly yield, you're telling the browser "Hey, I understand that the work I'm about to do could take a while, and I don't want you to have to do all of that work before responding to user input or other tasks that might be important, too".

This can help to improve the overall responsiveness of the web page, as the browser will be able to focus on other tasks while the long-running task is in progress.

And of course, this will come in handy when working on improving the [Interaction to Next Paint (INP)](https://web.dev/inp/) web vital, which will become a Core Web Vital starting March 2024.

This is how you use it:

```js
async function yieldy () {
  // Do some work...
  // ...

  // Yield!
  await scheduler.yield();

  // Do some more work...
  // ...
}
```

But wait, can I use it only in Chrome?
Yes, but you could fall back to using the good old `setTimeout` and do something similar.

The only difference is browsers that don't support `scheduler.yield` will yield without "front of queue" behavior, as `setTimeout` sends the remaining work to the back of the task queue.

```js
// A function for shimming scheduler.yield and setTimeout:
function yieldToMain () {
  // Use scheduler.yield if it exists:
  if ('scheduler' in window && 'yield' in scheduler) {
    return scheduler.yield();
  }

  // Fall back to setTimeout:
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}

// Example usage:
async function doWork () {
  // Do some work:
  // ...

  await yieldToMain();

  // Do some other work:
  // ...
}
```


The `scheduler.yield` is currently in origin trial in Chrome 115 and later. You can learn more about origin trials and how to participate in the trial on the Chrome Developers website: [Get started with origin trials](https://developer.chrome.com/docs/web-platform/origin-trials/).

Read the full article with a detailed explanation on the Chrome Developers blog: [Introducing the scheduler.yield origin trial](https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/)

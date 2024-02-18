---
title: Understand the event loop, the key to reactive websites - Part 1
description: Jake Archibald's talk on the Event Loop is still one of the main sources of information about how the Event Loop works and how to avoid blocking the browser's main thread and therefore, websites reactivity. In his video, Jake covers several key concepts, which I'm gonna try and summarize in this blog post.
date: 2024-02-17
tags:
  - web performance
  - interaction to next paint
---

Jake Archibald's talk on the Event Loop is still one of the main sources of information about how the Event Loop works and how to avoid blocking the browser's main thread and therefore, websites reactivity.

In this video from JSConf Asia 2018, [Jake](https://jakearchibald.com/) covers several key concepts, which I'm gonna try and summarize in this blog post.

## Main thread and deterministic order

Take the following code snippets:

```js
document.body.appendChild(el);
el.style.display = 'none';
```

```js
el.style.display = 'none';
document.body.appendChild(el);
```

Would you say they behave in the same way for the user experience? Will users see a blink because of the element was added to the DOM, then hidden right away?

The answer is the two code snippets behave exactly in the same way, and that's because of how the main thread works.

## The main thread

We call it the main thread because loads of stuff happen here. It's where JavaScript happens. It's where rendering happens. It's where the DOM lives. 

This means stuff on the web has a deterministic order. We don't get multiple bits of code running at the same time, like trying to edit the same DOM resulting in a world of horrible race conditions.

But it does mean that if something on the main thread takes a long time (e.g. 200 milliseconds, which is a long time in terms of user interaction) then it becomes really noticeable because it has blocked loads of other things, like rendering, interaction.

Think about a block in the main thread like when we sneeze. Everything else becomes blocked until the sneeze is over. Needless to say, we don't want to write code that is like a sneeze.

So, although we have this main thread thing, we tend to spawn a whole series of threads like for networking stuff, encoding and decoding, crypto, monitoring input devices, but once these threads have done something that the page needs to hear about, they need to sort of come back to the main thread to give it that information and it's the **event loop** that orchestrates all of this.

## Task queues

Take `setTimeout`, for instance. Have you thought about how it actually works?

The `setTimeout` method, when invoked, must run the following steps:

- wait `ms` milliseconds
- invoke callback

Done. 

We run the steps in parallel, which is a way to say get off the main thread and run this stuff at the same time as other stuff. 

But we create a new problem here, because now we're invoking a callback from something other than the main thread, and I mean, there's no way this can really work. You would end up with lots of JavaScript running in parallel, still editing the same DOM and you'd end up with all of these race conditions.

So, what we do is this: we queue a task. We queue a task to get back on to the main thread at some point, and now we're calling JavaScript on the thread where JavaScript lives, so it all works.

## Visualize the event loop

<figure>
	{% image "01 - the event loop and the task detour on the left.png", "The event loop and the task detour on the left", [648, 1296], "648px", true %}
	<figcaption>This is how Jake depicted the event loop. It's a circle, the execution goes round and round, until a task is queued in the "task detour" on the left.</figcaption>
</figure>

Now what if we do this:

```js
setTimeout(callback1, 1000);
setTimeout(callback2, 1000);
```

Well, according to the spec we wrote these two algorithms go parallel, each waits for a thousand milliseconds, and then they need to come back on to the main thread, and they do that by queuing a task.

So, the browser says to the event loop "hey, I've got something here that wants to do main thread work. In fact, I have two things", and it adds each one as a separate to-do item in the task queue.

<figure>
	{% image "02 - tasks in the queue.png", "Two tasks are scheduled for execution in the task queue", [648, 1296], "648px", true %}
	<figcaption>Now two tasks are scheduled for execution in the task queue</figcaption>
</figure>

The event loop's like: "sure, that's fine, I'll get around to it". So, it runs the first callback, it goes around the event loop and runs the second callback.

And that's tasks. It would be pretty simple if that's all it was, but it gets more complicated when we think about the render steps.

## The render steps

This is what the browser uses to update what's actually on the screen.

<figure>
	{% image "03 - the render steps - style, layout, painting.png", "The render steps", [648, 1296], "648px", true %}
	<figcaption>On the right side of the event loop, the render steps: style, layout, painting</figcaption>
</figure>

The render steps are another detour and that involves style calculation. 

- Style (S): this is looking at all of the CSS that's going on and working out what applies to each element.
- Layout (L): this is creating a render tree, figuring out where everything is on the page and where it's positioned.
- Paint (P): creating the actual pixel data, doing the actual painting.

So, at some point the browser will say to the event loop: "hey, you know, we need to update what's on the screen" and the event loop's like "no problem, I'll get around to that next time I go around the event loop."

## An infinite loop with `while(true)`

Here's a page with a gif and some text and a big button that runs an infinite JavaScript loop.

<figure>
	{% image "04 - example page for infinite loop.png", "A simple page with a gif of a cat, some text, and an infinite loop button", [648, 1296], "648px", true %}
	<figcaption>A simple page with a gif of a cat, some text, and an infinite loop button</figcaption>
</figure>

```js
button.addEventListener('click', (event) => {  
    while(true);
});
```

So, if I click that button, everything stops. The gif has stopped. I can no longer select text. The whole tab comes to a standstill.

<figure>
	{% image "05 - infinite loop in the event loop.png", "The execution point is stuck in the single task in the queue", [648, 1296], "648px", true %}
	<figcaption>Visualization of the event loop executing an infinite loop</figcaption>
</figure>

The user clicks the button, so, the browser says: "hey, event loop, I've got a task for you", and event loop's like "yep, no problem, I'm on it." But this task never ends. It's running JavaScript forever.

A couple of milliseconds later the browser says, "hey, event loop, we need to update that gif that was on the page. So, if you could just render at your next earliest convenience that would be fantastic". The event loop's like, "yeah, okay, I'll get around to that right after I finish this infinite loop that I'm busy doing right now."

Then the user tries to highlight text and that involves like hit testing, involves looking at the DOM to see what the text actually is. So, the browser says: "Hey, I've got a couple of more items for your to-do list there". And the event loop's like: "Are you having a laugh? Do you know how long it takes to perform an infinite loop? It's a long time, you know. There is a clue in the name."

So, that is why a `while` loop blocks rendering and other page interaction.

But this is a good thing in practice. 

## Your task will complete before next rendering

Let's look again at the code that we started with.

```js
document.body.appendChild(el);
el.style.display = 'none';
```

I used to worry that this would result in a flash of content, but it can't, right? Because this script runs as part of a task, and that must run to completion before the browser can get back around to the render steps.

The event loop guarantees your task will complete before next rendering happens.

## An infinite loop with `setTimeout()`

So, a while loop blocks rendering, but what about this?

```js
function loop() {
    setTimeout (loop, 0);
}
loop();
```

This is a loop, but each time we go round the loop we're using `setTimeout` to queue the next call.

If we execute that `setTimeout` loop in the demo page, it looks nothing has changed, but here's what's happening in the background.

<figure>
	{% image "06 - setTimeout loop being executed.png", "The execution point is going towards the next task queued", [648, 1296], "648px", true %}
	<figcaption>The execution of a <code>setTimeout</code> loop executes a single task, than queue another one</figcaption>
</figure>

We queue a task, go around the event loop, pick up that task, and we queue another task as a result. 

That just keeps happening and happening until the end of time, but as we've already seen like only one task can be processed at a time. So, when it's processing a task, it's having to go all the way around the event loop to pick up the next task.

So, that means at some point the browser can say "huh, we should update the display for that gif", because at that point it can go around and update the display.

<figure>
	{% image "07 - still have time to process rendering tasks.png", "The execution point is going towards the rendering steps", [648, 1296], "648px", true %}
	<figcaption>After the execution of that <code>setTimeout</code> callback, the loop is able to render</figcaption>
</figure>

And that's why a `setTimeout` loop is not render blocking.

## `requestAnimationFrame`

Now if you want to run code that has anything to do with rendering, a task is really the wrong place to do it, because a task is on the opposite side of the world to all of the rendering stuff, as far as the event loop is concerned. What we want to do is we want to run code in the render steps. 

We want to run code here:

<figure>
	{% image "08 - requestAnimationFrame.png", "A yellow box labeled rAF has appeared before the style block in the render detour", [648, 1296], "648px", true %}
	<figcaption><code>requestAnimationFrame</code> is the yellow box labeled "rAF" which appeared before the style (S) block in the render detour</figcaption>
</figure>

And the browser lets us do that and it lets us do that using `requestAnimationFrame`.

"rAF" callbacks, they happen as part of the render steps, and to show why this is useful, I'm going to animate a box, just a box, using this code.

<figure>
	{% image "09 - one box.png", "A square box on a blue background", [648, 1296], "648px", true %}
	<figcaption>The box which is about to be animated</figcaption>
</figure>

```js
function callback() {
	moveBoxForwardOnePixel();
	requestAnimationFrame(callback);
}
callback();
```

So, I'm going to move that box forward one pixel, and then use `requestAnimationFrame` to create a loop around this. And that's it. That's all it does. 

So, that's `requestAnimationFrame`, but what if we switched `requestAnimationFrame` for `setTimeout`?

```js
function callback() {
	moveBoxForwardOnePixel();
	setTimeout(callback, 0);
}
callback();
```

It looks like this.

<figure>
	{% image "10 - two boxes.png", "Two square boxes on a blue background, the first labeled requestAnimationFrame, the second labeled setTimeout", [648, 1296], "648px", true %}
	<figcaption>The two boxes being animated. The one labeled <code>setTimeout</code> is moving faster than the one labeled <code>requestAnimationFrame</code></figcaption>
</figure>

Now, this box is moving faster. 

It's moving about 3.5 times faster, and that means this callback is being called more often, and that is not a good thing. That's not a good thing at all. 

We saw earlier that rendering can happen in between tasks. But just because it can happen doesn't mean it must.

We can take a task, "Should we render?", "No, it can't be bothered yet." Go around the event loop, pick up another task. "Shall we render now?", "No, it doesn't feel like the right time". Many tasks can happen and before the browser goes, "Yeah, actually next time we will update the display". 

And the browser gets to decide when to do this, and it tries to be as efficient as possible. The render steps only happen if there's something actually worth updating.
If nothing's changed, it won't bother.

Like if the browser tab is in the background, if it isn't visible, it will never run the render steps because there's no point, but also the majority of screens update at a set frequency. In most cases that's 60 times a second. Some screens go faster, some screens go slower, but 60 Hertz is the most common.

So, if we changed page styles like a thousand times a second, it's not going to run the render steps a thousand times a second, it will synchronize itself with the display, and only render up to a frequency the display is capable of. Usually, 60 times a second.

Otherwise, it would be a waste of time, like there's no point rendering stuff the user will never see. But that's what `setTimeout` is doing here. It's moving faster because it's updating the position of that box more times than the user can see, more times than this display is capable of showing us.




<!--====== TO BE CONTINUED? ======-->

## To be continued...

This is about the first part of Jake's talk about the event loop. The second part will talk about microtasks, `requestIdleCallback`, and more.

## Watch the video!

Find below the video from the talk, which uses "slides" that Jake did an amazing job animating.

<iframe width="560" height="315" src="https://www.youtube.com/embed/cCOL7MC4Pl0?si=EEhZlFn4UuzsfCpj" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" style="width: 100%; height: auto; aspect-ratio: 16 / 9"></iframe>
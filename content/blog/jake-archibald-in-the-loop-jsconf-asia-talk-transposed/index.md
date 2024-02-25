---
title: "Jake Archibald's talk \"In the loop\" transposed"
description: Jake Archibald's talk "In the loop" is still one of the best sources of information about the event loop and about how it processes tasks in the browser. Understand how the event loop works is important to make sure we don't hinder websites reactivity. Since I didn't find anything as comprehensible as that in a blog post format, I'm transposing his talk into this blog post.
date: 2024-02-17
tags:
  - web performance
  - interaction to next paint
---

[Jake Archibald](https://jakearchibald.com/)'s talk "In the loop" (JS Conf Asia) is still one of the best sources of information about the event loop and about how it processes tasks in the browser. Understand how the event loop works is important to make sure we don't hinder websites reactivity.

Since I didn't find anything as comprehensible as that in a blog post format, I'm transposing his talk into this blog post. Find the video at the end of the post.

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

#### Other ways of queuing a task

So far, we've been using `setTimeout` as a shorthand for "queuing a task", and it isn't really, because even though we've put 0 milliseconds for the callback, it's more like 4.7 milliseconds that the browser will use as a default (the specs the browser can pick any number to use, but Jake has tested and measured it).

<!-- 🛑 TODO: replace image with one at a higher resolution -->

<figure>
	{% image "11 - three boxes LD.png", "Three square boxes on a blue background, the first labeled requestAnimationFrame, the second labeled setTimeout, the third labeled queueTask", [648, 1296], "648px", true %}
	<figcaption>The three boxes being animated. The one labeled <code>queueTask</code> is moving so fast that it appears randomly positioned on its lane</figcaption>
</figure>

There isn't a single method that just queues a task, but we can kind of fake it using message channels. Jake ran a test with that. The result is there are so many tasks happening that it kind of just looks like the box is getting a random position. We're getting a task every two-hundredths (2/100) of a millisecond. So rendering can happen between tasks, but you can have many, even tens of thousands of tasks between renderings.

## Tasks and frames in time

Let's imagine each of these is a frame that is displayed to the user. 

So, our rendering steps they happen at the start of each frame and that includes like style calculation, layout and paint, not necessarily all three every time.

<figure>
	{% image "12 - Frames with rendering tasks.png", "Three rectangles representing frames, each one containing a purple rectangle and a green rectangle representing style and render tasks", [648, 1296], "648px", true %}
	<figcaption>Three frames, each one containing a style task (purple) and a render tasks (green)</figcaption>
</figure>

Depends what actually needs updating, but I like this. I like this. This is very neat and tidy. This is a beautiful picture.

<figure>
	{% image "13 - Tasks are everythere.png", "Same as previous figure, now with yellow rectangle shown in random positions inside each rectangle representing a frame", [648, 1296], "648px", true %}
	<figcaption>Tasks are executed everythere during a single frame</figcaption>
</figure>

Tasks on the other hand, they couldn't give a stuff. They just kind of appear anywhere they fancy. The event loop ensures that they happen in the right order, they happen in the order they were queued, but in terms of timing within a frame there is no kind of ordering here at all.

And we saw this with our `setTimeout`. We were getting four per frame, three or four per frame, and that means that three-quarters of those callbacks were wasted effort in terms of rendering.

<figure>
	 {% image "14 - 3 out of 4 tasks highlghted.png", "Same as previous figure, now 3 out of 4 yellow rectangles are offset, representing the wasted effort", [648, 1296], "648px", true %}
	<figcaption>3 out of 4 tasks highlghted as wasted effort in terms of rendering</figcaption>
</figure>

Old animation libraries used to do something like this, where they were trying to use a millisecond value that's going to give them roughly 60 callbacks per second...

```js
setTimeout (animFrame, 1000 / 60);
```

...and they're assuming a lot about the screen there. They're assuming a screen is 60 Hertz, but that was the common case.

<figure>
	{% image "15 - Tasks distributed across frames.png", "Tasks distributed one per frame", [648, 1296], "648px", true %}
	<figcaption>Tasks are scheduled in every frame using <code>setTimeout</code></figcaption>
</figure>

So, it kind of worked, it eliminated some of the duplicate effort. Unfortunately, it was a massive hack because setTimeout was not designed for animation and it really shows like due to inaccuracies you can end up with drift.

<figure>
	{% image "16 - Tasks distributed across frames, with mistake.png", "One yellow square which was supposed to be in the second frame appears in the third frame", [648, 1296], "648px", true %}
	<figcaption>One task was supposed to be in the second frame, but was executed during the third frame</figcaption>
</figure>

So, what's happened here is we're doing nothing in one frame, and then in the next frame we're doing twice the amount of work, and that is a visual jank to user, it doesn't look great.

Also, if one of your tasks runs long, you can end up moving the render steps around because it's all running on the same thread and you're sort of disturbing that lovely routine that they have.

<figure>
	{% image "17 - Tasks distributed along frames, one going long to the next frame.png", "Yellow squares starting inside each frame, the first one of them extending over to the next frame", [648, 1296], "648px", true %}
	<figcaption>Frames are starting inside each frame, the first one of them being executed over to the next frame</figcaption>
</figure>

If we use `requestAnimationFrame` rather than `setTimeout`, it would look a lot more like this. All neat and tidy. All nice and ordered. Everything is within the timing of the frame, even this longer task here. 

<figure>
	{% image "18 - Tasks are grouped together at the beginning of every frame.png", "The yellow rectangles representing tasks are grouped together at the beginning of each frame", [648, 1296], "648px", true %}
	<figcaption>Tasks are grouped together at the beginning of every frame, using <code>requestAnimationFrame</code> instead of <code>setTimeout</code></figcaption>
</figure>

Jake says when he sees performance traces like this, it makes him happy, as this is showing a good user experience.

You can't avoid tasks completely of course because things like click events they're going to be delivered to you in a task, and generally you want to respond to those as soon as possible. But if you have things like timers or you have stuff coming from the network, Jake recommends using `requestAnimationFrame` to batch that work together, especially if you already have animations running because you can save yourself a lot of duplicate work.

## Tasks and render timing

There's one more detail I want to get to and this is something that catches a lot of developers out, it caught me out. `requestAnimationFrame` it comes before processing CSS and before painting.

```js
button.addEventListener('click', () => {
	box.style.display = "none";
	box.style.display = "block";
	box.style.display = "none";
	box.style.display = "block";
	box.style.display = "none";
	box.style.display = "block";
	box.style.display = "none";
	box.style.display = "block";
	box.style.display = "none";
});
```

So, code like this might seem expensive, like we're showing and hiding a box many many times, but this is actually really cheap, like JavaScript will always run to completion before rendering happens. 

So, while you're doing this the browser just sits back, and it lets you have your fun changing a value and it doesn't really think about it in terms of CSS at all. And then at the end when it actually comes around to the render steps it goes, right, what did you actually change in the end? And the only bit that matters is the final line. And the only bit that matters is the final line.

So the code above, in terms of rendering, is equivalent to the following code.

```js
button.addEventListener('click', () => {
	box.style.display = "none";
});
```

## Queuing transitions

I'm going to omit the part where Jake explained how to queue some Javascript to animate a box from 1000 to 500 pixels using a double `requestAnimationFrame` callback, as it's irrelevant at the time of writing: we now have the [Web Animation API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) which, at the time of Jake's talk, was available only in Chrome. 

<!--
THE REST OF THE TRANSCRIPT

## Microtasks

I want to take a look at microtasks.
This is probably the least understood part of the event loop I'd say.
I strongly associate microtasks with promises,
but this is not where they started.
Back in the 1990s,
browsers wanted to give developers a way to monitor DOM changes
and the W3C went, okay, we'll sort that out for you,
and they gave us mutation events.
So, this is where I could say,
okay, I want to know when a node is inserted into the body element.
And fine, excellent,
and you get a series of other events as well.
But, in practice this was pretty problematic.
We take this bit of code here,
what I'm doing is I'm adding a hundred spans into the body element.

How many events would you expect to receive as a result of this?
One event?
One event for the whole operation?
Nope.
100 events?
One for each span.
Yes.
But also, another hundred for this line here
when the content is going into the actual span,
a text node is going into the span
and because these events bubble,
this simple piece of code is going to land you with 200 events.
And because of this like relatively simple DOM modifications
ended up triggering thousands of events
and if you were doing like a tiny bit of work in these listeners
that quickly became a big bit of work,
and it was a performance disaster.
What we really wanted was a way to sort of hear about a batch of this work.
It's similar to what we saw with styles before.
We want the browser to kind of sit back,
let us do some stuff
and then at a convenient point, say, some stuff changed.
Here is a kind of an event or something to represent all of those changes.

We want to hear about it once not 200 times
and the answer became mutation observers,
and they created a new queue called microtasks.
A lot of documentation I read about microtasks
suggests that it happens like, I don't know, every turn of the event loop
or it happens after a task or something like that
and it is kind of true.
There is a single place on the event loop where microtasks happen,
but that is not where you'll generally encounter it.
They also happen whenever JavaScript finishes executing.
That means that the JavaScript stack has gone from having stuff in it
to having no stuff in it
and that's where we run microtasks.
So, you can end up with microtasks happening halfway through a task,
you can have microtasks in the render steps as part of requestAnimationFrames,
kind of anywhere, anywhere JavaScript can run.
So, that means this JavaScript will run to completion
adding a hundred spans and their contents.
JavaScript finishes executing
and we get our mutation observer callback.
Promises made use of them as well.
So, here we queue a microtask and then log(‘Yo!’),

JavaScript has finished executing.
So, we go for the microtasks, and we log(‘Hey!’).
And that means when the Promise callback is executing
you were guaranteed that no other JavaScript is midway through at the time,
the Promise callback is right at the bottom of the stack,
and that's why promises use microtasks.
But what happens if we create a loop using microtasks?
A bit like we did with setTimeout before.
Same demo again.
Click the button
and it blocks rendering,
it blocks the tab in the same way a plain while loop did,
very different from setTimeout before.
So, Promise callbacks are async,
fine,
but what does async actually mean?
I mean all it means is that they happen after synchronously executing code,
so that's why we get (‘Yo!’) before (‘Hey!’).
But just being async doesn't mean it must yield to rendering,
doesn't mean it must yield to any particular part of the event loop.
We've looked at three different queues so far.
We’ve looked at task queues,
animation callback queues
which is where requestAnimationFrame callbacks happen
and now we're looking at microtasks,
and just to make your lives a little bit easier
they all are processed very subtly differently.
Like we've seen with task queues,
we take one item and we take one item only
and if another item is queued it just goes to the end of the queue.
Fine.
Animation callbacks they happen until completion,
except ones that were queued while we were processing animation callbacks.
They are deferred to the next frame.
Microtasks on the other hand they are processed to completion
including any additionally queued items.
So, if you were adding items to the queue as quickly as you're processing them
you are processing microtasks forever.
The event loop cannot continue until that queue has completely emptied
and that is why it blocks rendering.
I get really excited about this stuff.
I hope other people are excited about this as I am.
Thank you.
One person. Excellent.
You know what, I used to have a real job like many of you did.
This stuff like it's sort of speaking the standards work, the creating slides.
This used to be my hobby
but then my hobby became my job,
and now I have no hobbies.
I'm a boring person now,
and I didn't actually notice when this happened, like genuinely.
The first time I noticed is when I went for an eye test
and the optician just making small talk asked,
“and what are your hobbies?”
I am like, “oh shit, when did this happen? I don't have any.”

Like I said, I stress,
so I got a bit like oh, I can't say nothing, who says nothing?
So, it's just totally true.
I panicked and I said “I play the piano.”
I don't play the piano.
And then I stressed even more because I thought like she was going to say,
“Oh well. That's great.
We don't need to use the letters chart then,
here's some sheet music.
Can you read me the first five bars? What chord is this?”
Thankfully she didn't.
But yeah, my optician now thinks I'm a pianist.
That’s great.
I don't go back to the opticians anymore. I'm terrified of like more piano chat.
I don't know how I survive in the real world.
I think you're ready for this next one.
Occasionally I run little JavaScript quizzes.
Maybe that's my hobby.
Nope. That's work too.
Never mind.
Yes, I run little JavaScript quizzes, and this is my favorite question.
So, I've got a button and on click I resolved a Promise
and then log something.
But I have two event listeners on the same element doing the same thing.

So, if the user clicks a button, what happens?
In which order are things logged?
Well, our first listener executes. Great.
So, that's on the JavaScript stack.
Queues a microtask
and then we get to the next line where we log Listener 1
and that's the first answer.
Most folks agree on that bit, but what next?
And I ran a Twitter poll on this last week.
I've been speaking to a few of you, a few of you saw it.
Most people would say the next thing logged is Listener 2, that's 63%,
5% of people think NaN is just logs and then Infinity,
that is not the answer,
but fair enough to that 5% of people,
but yes, we've got 63%
and Listener 2 is the wrong answer.
This is a real gotcha with script,
but if you thought it was Listener 2 then you're in very good company.
So, don't worry about it.
Our Listener has finished.
So, we've gone from having something on the JavaScript stack to nothing.
So, it is Microtask time.
We are going to run that promise
and we are going to log Microtask 1
and there we go.
And then it's time for the second listener
and that works the same.
So, the order is Listener 1 Microtask 1,
Listener 2 Microtask 2.
But that's if the user clicks the button.
What if the button is clicked using JavaScript?
Oh, yes, it's different.
For starters, our script is on the stack.
We call click and that synchronously dispatches the events.
So, we start with Listener 1. Great.
We queue a microtask and we log Listener 1
and now it's microtask time.
No. No, it is not microtask time.
We can't run microtasks.
This is where it's different
because our JavaScript stack is not empty,
button.click has not returned yet.
So, we move on to Listener 2.
We queue another microtask
and now we log Listener 2
and this is where it diverges.
And now, our listener is done.
In fact, all our listeners are done.
button.click returns,
our JavaScript stack empties
and now we can process those microtasks
and they happen in order
and this has real-world implications.
So, beware if you're using promises in this way,
if you're using automated tests as well
because automated tests if they're clicking things on the page,
they're likely to be using JavaScript to do it
and that can change the behavior of your code.
This also came up when we were looking at
how to add observables to the DOM
and how they'd integrate with promises.
We hit this question,
If we have a promise that represents the next click of a particular link,
it's just this little bit of code here,
can someone use that promise and still call event.preventDefault?

Promises are async.
So, have we missed our chance to prevent the default here?
Turns out no, it's fine. It's totally fine. This works.
This just works unless again the user clicks the link
or some code clicks the link using JavaScript.
And this is the final puzzle of the talk. I'm overrunning a little bit.
To figure this out we actually need to take a look at the spec.
So, this is a very rough description of how the spec for clicking a link works,
but we start by creating an event object
and then for every listener we have
we invoke that listener with the event object
and then we take a look at,
has that eventObject's canceled flag been set.
If it's been set then we're not going to follow the hyperlink,
but if it's unset, we will follow the hyperlink.
When you call event.preventDefault
it sets this canceled flag on the event object.
So, if the user clicks a link that's fine,
our microtasks happen here after each callback
because that's where the JavaScript stack empties,
but when we call click with JavaScript,
it's just going to call out to Process a link click algorithm,
and it only returns once that algorithm is complete.
So, the JavaScript stack never empties during this algorithm.
So, our micro tasks can't happen.
So, it hits this step 3 where it looks at the eventObject
and even if you've got loads of promises trying to call like preventDefault
it's too late.
It's going to follow the hyperlink
and then sometime later those promise callbacks happen,
but you've missed the boat.
You've missed the point where you can actually cancel that event.
So, remember that microtasks they behave quite differently
depending on the JavaScript stack.
-->

<!--====== TO BE CONTINUED? ======-->

## Work in progress

This blog post is a work in progress transcription of Jake's talk about the event loop. It's still missing the final part of Jake's talk about Microtasks. I will add in in the coming days and update this blog post.

## Watch the video!

Find below the video from the talk, which uses "slides" that Jake did an amazing job animating.

<iframe width="560" height="315" src="https://www.youtube.com/embed/cCOL7MC4Pl0?si=EEhZlFn4UuzsfCpj" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" style="width: 100%; height: auto; aspect-ratio: 16 / 9"></iframe>
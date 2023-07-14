---
title: Intersection Observer and lazy loading of elements
description: In August 2017 the Intersection Observer API, a new exciting browser API, finally gained quite wide support. We can use it to know when two DOM elements intersect, or when a given DOM element enters the browser viewport. The lazy loading of images is just the case.
date: 2017-09-04
tags:
  - browsers APIs
  - lazy loading
  - techniques
---

In August 2017 a new exciting browser API finally [gained](https://hacks.mozilla.org/2017/08/intersection-observer-comes-to-firefox/) quite [wide support](https://caniuse.com/#search=IntersectionObserver): the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), which we can use to know when two DOM elements intersect, or when a given DOM element **enters the browser viewport**. The lazy loading of images is just the case.

About 3 years and 500 commits ago, I gave birth to a new vanilla javascript [lazy load script](https://github.com/verlok/vanilla-lazyload), currently known as `vanilla-lazyload` on [npm](https://www.npmjs.com/package/vanilla-lazyload) and [cdnjs](https://cdnjs.com/libraries/vanilla-lazyload), and starred by **1,135 people on GitHub**.


## The switch to Intersection Observer

As the community around my script started to grow, [some](https://github.com/si14) [members](https://github.com/ricardobrandao) requested it to support the Intersection Observer API, amongst [other enhancements](https://github.com/verlok/vanilla-lazyload/issues?q=label%3Aenhancement+is%3Aclosed).

So I decided to make my script's fans happy, and I did it. The resulting source code is **40% smaller**, and vanilla-lazyload is now **much faster** than its previous version. (by the way, if you know how to measure a script performance precisely, please comment)


## How to create an Intersection Observer

The implementation is quite simple: you create a new Intersection Observer instance specifying **a callback function** to be called whenever an intersection event occurs, and a couple of options: **root** and **rootMargin**, that are:

* `root`: the element you want to **test the intersection against**, `null` meaning the browser viewport
* `rootMargin`: in case you want to **expand or shrink** the effective size of the `root` element

```js
var myObserver = new IntersectionObserver((entries) => {
    /* do something */
}, {
    root: null,
    rootMargin: "300px 0"
});
```

Once the intersection observer is created and assigned to a variable, you can start observing on a target element with:

```js
var elementToObserve = document.getElementById('observeMe');
myObserver.observe(elementToObserve);
```


## Creating the observer

Since I need to test the intersection of a set of images / elements **against the scrolling container** (the viewport, or any element styled with `overflow: scroll`), I create a new `IntersectionObserver` and store it in the LazyLoad property `_observer`.

```js
this._observer = new IntersectionObserver(onIntersection, {
    root: settings.container === document ? null : settings.container,
    rootMargin: settings.threshold + "px"
});
```

Notes:

* `onIntersection` is a function, which I explain below
* `settings.container` is the scrolling container, defaulting to `document`, passed by LazyLoad user in the options object
* `settings.threshold` is the amount of pixels beyond the scrolling container where to start loading the images / elements, defaulting to `300`.


## The onIntersection function

The point is that whenever a DOM element intersects with the scrolling container, the `onIntersection` function is called. Here goes the function definition:

```js
const onIntersection = (entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }
        let element = entry.target;
        revealElement(element, settings);
        this._observer.unobserve(element);
    });
};
```

The `entries` argument is passed **all the elements being observed** by the observer which calls this function. So we need to **cycle through each entry** and know whether or not **it is intersecting** with the `root` element. Fortunately, the `isIntersecting` property does this exactly, so:

* if the entry is not intersecting, we just ignore this entry, returning
* if the entry is intersecting, we **start loading the element source** calling `revealElement`, then **we `unobserve` this specific entry** since its loading is already started and we don't need to keep watching it.


## Observing an element

Isn't something missing? Yes it is! The code explained until now accomplishes nothing, if we don't **tell our observer to observe an element**, or more than one in our case. What we need to do is:

```js
this._elements.forEach(element => {
    this._observer.observe(element);
});
```

Being `this._elements` the set of elements that LazyLoad has found inside `this._container` by a specific selector, purged by the ones that are already being processed (to deal with cases of _infinite scroll_, or other DOM updating cases).


## Fallback

Since _not every browser are created equal_ we need to test the support for `IntersectionObserver` before we use it. The way to do it is simple:

```js
if (!("IntersectionObserver" in window)) {
    return;
}
```

In my case, on browsers where `IntersectionObserver` is not supported, LazyLoad will load **all the images at once**. Therefore, if you need to load lots of images and your user base is browsing with a consistent share of older browsers, you should use LazyLoad a version less than 9. See [changelog](https://github.com/verlok/vanilla-lazyload/blob/master/CHANGELOG.md) for more details.


## Conclusion

That's it! Intersection Observer makes your code much smaller, faster and more legible. If you're not using it already, you should definetly start playing around with it.

And don't forget, if you have a very long page stuffed with images and other content, you should load them lazily using a lazy load script, and your best choice is [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload)!

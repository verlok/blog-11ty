---
title: A clever way to serve WebP images to modern browsers and JPG to IE
description: Before the day Safari started to support WebP images, we were forced to use the picture tag to serve WebP images to browsers supporting it. Today all modern browsers support WebP, so there's probably a clever way to do that using a single tag, img.
date: 2020-11-29
tags:
  - images
  - techniques
---

Before the day Safari started to support WebP images, we were forced to use the `picture` tag to serve WebP images to browsers supporting it. Today all modern browsers support WebP, so there's probably a clever way to do that using a single tag: `img`.

## How we did it before

The old way to do that was using a `picture` tag containing the regular `img` tag with both `src` and `srcset` attributes for browsers not supporting WebP, and a sibling `source` tag - marked with the `type="image/webp"` - containing the `srcset` for browsers accepting the WebP image format.

Long story short, this:

```html
<picture>
    <source
        type="image/webp"
        srcset="
            {url-standard}.webp 1x,
            {url-retina}.webp   2x
        "
    />
    <img
        alt="Old way"
        src="{url-standard}.jpg"
        srcset="
            {url-standard}.jpg 1x,
            {url-retina}.jpg   2x
        "
    />
</picture>
```

## But Safari is more modern now

Now that all modern browsers support WebP, we can assume that all browsers that support the `srcset` attribute also support WebP. So we can get rid of the `picture` tag and use a single `img` tag.

Like this:

```html
<img
    alt="New, clever way"
    src="{url-standard}.jpg"
    srcset="
        {url-standard}.webp 1x,
        {url-retina}.webp   2x
    "
/>
```

Legacy browsers fallback to the `src` attribute, and they get the Jpg image. Simple as that.


## Advantages

The first, more obvious advantage is you need to write and maintain less HTML markup.

A second advantage you could have is if you were using an image CDN to automatically serve the correct image format depending on the browser requesting it. If you were, you can probably get rid of that and save some time and money.


## Compatibility

If you're supporting versions of iOS older than 14, you probably want to continue using the `picture` tag to to so. This depends on the audience you're targeting. Find more about your audience using Google Analytics data.

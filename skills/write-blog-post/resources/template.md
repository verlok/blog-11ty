---
title: "TITLE_HERE"
description: "DESCRIPTION_HERE"
date: YYYY-MM-DD
tags:
  - TAG_1
  - TAG_2
layout: layouts/post.njk
image: ./cover.png
image_alt: "IMAGE_ALT_HERE"
---

INTRODUCTORY_PARAGRAPH_HERE

<figure>
  {% image "cover.png", "IMAGE_ALT_HERE", [648, 1296], "648px", false %}
  <figcaption>COVER_CAPTION_HERE</figcaption>
</figure>

BODY_PARAGRAPH_HERE

## FIRST_HEADING_HERE

MORE_BODY_PARAGRAPH_HERE

```javascript
// Paste any code snippets here
console.log("Web Performance!");
```

### Video Embed Template (If Needed)
<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="width: 100%; height: auto; aspect-ratio: 16 / 9"></iframe>

### Inline Responsive Image Template (If Needed)
<figure>
  {% image "image.png", "IMAGE_ALT_HERE", [648, 1296], "648px", true %}
  <figcaption>IMAGE_CAPTION_HERE</figcaption>
</figure>

CONCLUSION_HERE

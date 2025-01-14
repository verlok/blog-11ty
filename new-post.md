# New post

## Steps

- [ ] Copy code from below
- [ ] Create new file with the name /blog/{ SLUG }/index.md
- [ ] Paste the code
- [ ] If image, copy the image in the folder

## Code to copy

```
---
title: {{ TITLE }}
description: {{ DESCRIPTION }}
tags:
  - {{ Tag 1 }}
  - {{ Tag 2 }}
---

{{ Text here }}

<figure>
	{% image "{{ image.png }}", "{{ Alt text }}", [648, 1296], "648px" %}
	<figcaption>{{ Image caption }}</figcaption>
</figure>

{{ More text here }}

{{ Lazy images need a `true` at the end }}

<figure>
	{% image "{{ image.png }}", "{{ Alt text }}", [648, 1296], "648px", true %}
	<figcaption>{{ Image caption }}</figcaption>
</figure>


```

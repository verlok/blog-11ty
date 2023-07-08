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
date: {{ 202$-$$-$$ }}
tags:
  - {{ Tag 1 }}
  - {{ Tag 2 }}
---

{{ Text here }}

<figure>
	{% image "{{ image.png }}", "{{ Alt text }}", [600, 1200], "600px" %}
	<figcaption>{{ Image caption }}</figcaption>
</figure>

{{ More text here }}
```

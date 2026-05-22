---
name: write-blog-post
description: "Draft a new blog post following the exact structure, performance-oriented writing style, and conventions of the Eleventy blog. Guides through cover image workflow (AI generation vs. user provided), responsive image shortcodes, and video iframe embeds."
---

# Agent Skill: Write Blog Post

This skill allows an agent to draft a new blog post in this Eleventy static site project while adhering perfectly to the blog's content standards, directory conventions, performance best practices, Nunjucks shortcodes, and writing voice.

## Core Project Conventions

- **Directory Location**: Every blog post lives in its own subdirectory under `content/blog/`.
- **Directory Name Format**: `YYYY-MM-DD_post-slug` (e.g. `2026-05-22_modern-web-performance-strategies`).
- **File Name**: The primary markdown file must be named `index.md` inside that folder.
- **Assets Location**: All images used in the post must be saved in the same post subdirectory and referenced relatively (e.g., `cover.png` or `image.png`).
- **Draft Mode**: If you want to keep the post as a draft during development, set `draft: true` in the frontmatter.

---

## Writing Voice & Tone

The writing style should perfectly replicate the existing articles:
- **Perspective**: Written in the first person ("I", "my workmate Brian", "my dream", etc.).
- **Tone**: Professional, friendly, enthusiastic, and deeply technical yet accessible.
- **Topics**: Front-end engineering, web performance, CSS features, JavaScript techniques, browser standards, developer tool automation, and developer life.
- **Styling**: Short, readable paragraphs, descriptive bold headings, clear bullet lists, and standard code blocks with appropriate language markers for prism syntax highlighting.

---

## Technical Specifications

### 1. Frontmatter Schema
Every `index.md` file must start with a YAML frontmatter block containing:
```yaml
---
title: "A Compelling and Descriptive Title"
description: "An engaging, SEO-optimized summary under 160 characters describing the post."
date: YYYY-MM-DD
tags:
  - web performance
  - javascript
  - css
layout: layouts/post.njk
image: ./cover.png
image_alt: "A premium conceptual/abstract description of the cover image."
# Optional: draft: true
---
```
*Note: Do not include the `YYYY-MM-DD` in the public URL. Eleventy handles URL routing automatically using directory structures.*

### 2. Cover & Inline Images Shortcode
Eleventy uses a custom responsive image shortcode from `@11ty/eleventy-img` to optimize assets.
The javascript shortcode signature is:
```javascript
async function imageShortcode(src, alt, widths, sizes, useLazyLoading, className)
```

In the markdown/Nunjucks template, render images using the custom `{% image %}` tag.

#### Cover/Hero Image Rules (Eager Loaded)
Because the cover image is above the fold and serves as the Largest Contentful Paint (LCP) candidate, **lazy loading must be set to `false`** (which maps to the `useLazyLoading` argument) so that `loading="eager"` and `fetchpriority="high"` are output:
```nunjucks
<figure>
  {% image "cover.png", "Detailed alt description of the cover image", [648, 1296], "648px", false %}
  <figcaption>Optional caption describing the cover image.</figcaption>
</figure>
```

#### Inline Content Images (Lazy Loaded)
For all other images lower down on the page, set `useLazyLoading` to `true` (which outputs `loading="lazy"`):
```nunjucks
<figure>
  {% image "screenshot-workflow.png", "Detailed alt description of the screenshot", [648, 1296], "648px", true %}
  <figcaption>Step 2: Configuring dev tools.</figcaption>
</figure>
```

### 3. Video Embeds
All video embeds (e.g., YouTube or Vimeo) must use standard iframe tags with inline styles for full-width responsive resizing and maintaining a 16:9 aspect ratio:
```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="width: 100%; height: auto; aspect-ratio: 16 / 9"></iframe>
```

---

## Detailed Step-by-Step Workflow

### Step 1: Brainstorm or Gather Content
Formulate or ask the user for the blog post topic, key takeaways, title, description, and tags. 

### Step 2: Cover Image Consent (CRITICAL)
Every post **must** have at least one cover image. Before generating or creating one, you **must explicitly ask the user** if they have a cover image they would like to provide.
- *If yes*: Instruct the user where to save the image (or help them copy it to the new post directory).
- *If no (or if they ask you to generate one)*: Proceed to Step 4 to generate a premium cover image using AI.

### Step 3: Establish Folder Structure
Create a new directory inside `content/blog/` following the `YYYY-MM-DD_post-slug` naming convention.

### Step 4: Handle Cover Image Asset
- If the user provided an image, ensure it is in the post folder as `cover.png` (or `.jpg`, `.webp`).
- If you are generating the cover image:
  1. Construct a detailed image prompt related to the blog topic (e.g. for a performance post: *"A sleek, modern glassmorphic visualization of fast website speed, clean code lines, neon gradient colors, abstract tech design"*).
  2. Call the `generate_image` tool with a descriptive name, saving the resulting image to the new post folder.
  3. Verify the image file is saved in the directory.

### Step 5: Draft the Post (`index.md`)
Create the `index.md` file inside the new post directory. 
1. Build the frontmatter exactly as specified in the schema.
2. Start the body with the eager-loaded cover image shortcode:
   `{% image "cover.png", "Alt text...", [648, 1296], "648px", false %}`
3. Write the rest of the post following the technical tone, incorporating code blocks, standard markdown headings, and any responsive video embedded iframes or lazy-loaded inline images.

### Step 6: Verify and Test the Post
1. Run the local build script to ensure there are no syntax or shortcode failures:
   ```bash
   npm run build
   ```
2. Start the development server:
   ```bash
   npm start
   ```
3. (Optional) Check the post visually by navigating the browser to `http://localhost:8080/blog/post-slug/`.

---
name: create-new-post
description: Drafts and creates a new blog post in either English or Italian following the blog's writing voice, cover image workflow, responsive image conventions, and Eleventy i18n structure, then automatically translates it to the other language.
---

# Create New Blog Post

Use this skill when the user asks to draft or create a new blog post. It is the single source of truth for the end-to-end blog post creation workflow. For project-wide technical conventions (including the `{% image %}` shortcode signature and `useLazyLoading` rules), follow `AGENTS.md`.

## Writing Voice & Tone

Match the existing articles on this blog:
- **Perspective**: First person ("I", "my workmate Brian", "my dream", etc.).
- **Tone**: Professional, friendly, enthusiastic, and deeply technical yet accessible.
- **Topics**: Front-end engineering, web performance, CSS features, JavaScript techniques, browser standards, developer tool automation, and developer life.
- **Formatting**: Short, readable paragraphs, descriptive headings, clear bullet lists, and fenced code blocks with language identifiers for Prism syntax highlighting.

## Workflow

### 1. Detect Language & Gather Content
- Determine whether the user's draft or topic is in **English** or **Italian**.
- Gather or propose the post title, SEO-friendly description (under 160 characters), tags, and key takeaways.
- Target directory:
  - **English**: `content/en/blog/YYYY-MM-DD_post-slug/`
  - **Italian**: `content/it/blog/YYYY-MM-DD_post-slug/`
  - Use a URL-friendly slug in the post's language.

### 2. Cover Image Consent (CRITICAL)
Every post should have a cover image. Before generating one, **explicitly ask the user** whether they want to provide their own cover image:
- **If yes**: save/copy the provided image into the new post folder (e.g., `cover.png` or `cover.jpg`).
- **If no (or if they ask you to generate one)**: generate a cover image aligned with the post topic and save it in the post folder.

### 3. Create Primary Post (`index.md`)
Use `resources/template.md` as a structural reference and create `index.md` inside the target post directory:
- **Front matter**:
  ```yaml
  ---
  title: "Post Title"
  description: "An engaging, SEO-optimized summary under 160 characters."
  date: YYYY-MM-DD
  tags:
    - tag1
    - tag2
  layout: layouts/post.njk
  translationKey: "YYYY-MM-DD_topic-identifier"
  image: ./cover.png
  image_alt: "Description of the cover image."
  # Optional: draft: true
  ---
  ```
  Always enclose `title` and `description` in double quotes (`"`) to prevent YAML parsing issues with colons (`:`).
- **Assets**: Place all post images/diagrams inside the post directory and reference them relatively.
- **Images (`{% image %}` shortcode)**: Follow the `useLazyLoading` rule in `AGENTS.md`:
  - **First / cover image (above the fold, LCP)**: pass `false` (or omit `useLazyLoading`) → `loading="eager"` and `fetchpriority="high"`.
  - **All subsequent images**: pass `true` → `loading="lazy"` without `fetchpriority`.
- **Video embeds**: Use responsive 16:9 `<iframe>` embeds:
  ```html
  <iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="width: 100%; height: auto; aspect-ratio: 16 / 9"></iframe>
  ```

### 4. Trigger Automatic Translation
- If the source post is in **English**, follow the `translate-post-en-to-it` skill to localize the post and assets into `content/it/blog/YYYY-MM-DD_it-post-slug/`.
- If the source post is in **Italian**, follow the `translate-post-it-to-en` skill to localize the post and assets into `content/en/blog/YYYY-MM-DD_en-post-slug/`.

### 5. Verify Build
Run `npm run build` to verify that both language versions build cleanly without errors.

---
name: create-new-post
description: Creates a new blog post in either English or Italian, auto-detecting the input language, and automatically translates it to the other language using the corresponding translation skills.
---

When the user asks to create a new blog post:

1. **Detect Language & Target Folder**:
   - Determine whether the draft text or topic provided by the user is in **English** or **Italian**.
   - If **English**: target directory is `content/en/blog/YYYY-MM-DD_post-slug/`
   - If **Italian**: target directory is `content/it/blog/YYYY-MM-DD_post-slug/`
   - Use the `YYYY-MM-DD_post-slug` naming convention, where `YYYY-MM-DD` is the publication date and `post-slug` is a URL-friendly title in the post's language.

2. **Create Primary Post (`index.md`)**:
   - Create `index.md` inside the post directory with proper front matter:
     ```yaml
     ---
     title: "Post Title"
     description: "Post description."
     date: YYYY-MM-DD
     tags:
       - tag1
       - tag2
     layout: layouts/post.njk
     translationKey: "YYYY-MM-DD_topic-identifier"
     image: ./cover.jpg
     image_alt: "Description of the image."
     ---
     ```
   - Enclose `title` and `description` in double quotes (`"`) to prevent YAML parsing issues with colons.
   - Place any post assets (images, cover, diagrams) directly inside the post directory.
   - Render images in the post body using the `{% image %}` shortcode (`src, alt, widths, sizes, useLazyLoading, className`):
     - **First / cover image (above the fold, LCP)**: pass `false` (or omit the 5th argument `useLazyLoading`) so Eleventy outputs `loading="eager"` and `fetchpriority="high"`:
       ```njk
       {% image "cover.jpg", "Detailed alt text", [648, 1296], "648px", false %}
       ```
     - **All subsequent images**: pass `true` as the 5th argument (`useLazyLoading`) so Eleventy outputs `loading="lazy"` without `fetchpriority`:
       ```njk
       {% image "screenshot.png", "Detailed alt text", [648, 1296], "648px", true %}
       ```

3. **Trigger Automatic Translation**:
   - If the source post is written in **English**, invoke the `translate-post-en-to-it` skill to localize the post and translate the folder slug to Italian under `content/it/blog/YYYY-MM-DD_it-post-slug/`.
   - If the source post is written in **Italian**, invoke the `translate-post-it-to-en` skill to localize the post and translate the folder slug to English under `content/en/blog/YYYY-MM-DD_en-post-slug/`.

4. **Verify Build**:
   - Run `npm run build` to verify that both post versions build cleanly without errors.

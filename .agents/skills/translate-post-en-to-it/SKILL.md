---
name: translate-post-en-to-it
description: Automatically localizes a new English blog post into Italian, copying assets and setting up the front matter correctly.
---

When the user requests to translate a new blog post to Italian, or when a new post is added under `content/en/blog/` that is not yet present under `content/it/blog/`:

1. Identify the English post folder name (e.g., `YYYY-MM-DD_en-post-slug`) under `content/en/blog/`.
2. Translate the `en-post-slug` part into a URL-friendly Italian slug (`it-post-slug`) and create the corresponding folder under `content/it/blog/YYYY-MM-DD_it-post-slug/`.
3. Copy all non-markdown files (images, screenshots, slides, etc.) from the English path to the Italian path.
4. Read the file `content/en/blog/<en_folder_name>/index.md`.
5. Translate the front matter (`title`, `description`, `image_alt`) and markdown body into natural and professional Italian:
   - Keep shortcode tags and parameters unchanged (e.g., `{% image %}`).
   - Always enclose the YAML front matter `title` and `description` fields in double quotes (`"`) to prevent syntax errors with colons (`:`).
6. Write the translated post to `content/it/blog/<it_folder_name>/index.md`.
7. Run `npm run build` to verify that the build succeeds.

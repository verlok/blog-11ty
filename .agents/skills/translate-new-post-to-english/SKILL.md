---
name: translate-new-post-to-english
description: Automatically localizes a new Italian blog post into English, copying assets and setting up the front matter correctly.
---

When the user requests to translate a new blog post to English, or when a new post is added under `content/it/blog/` that is not yet present under `content/en/blog/`:

1. Identify the post folder name (e.g., `YYYY-MM-DD_post-slug`) under `content/it/blog/`.
2. Create the corresponding folder under `content/en/blog/`.
3. Copy all non-markdown files (images, screenshots, slides, etc.) from the Italian path to the English path.
4. Read the file `content/it/blog/<folder_name>/index.md`.
5. Translate the front matter (`title`, `description`, `image_alt`) and markdown body into natural and professional English:
   - Keep shortcode tags and parameters unchanged (e.g., `{% image %}`).
   - Always enclose the YAML front matter `title` and `description` fields in double quotes (`"`) to prevent syntax errors with colons (`:`).
6. Write the translated post to `content/en/blog/<folder_name>/index.md`.
7. Run `npm run build` to verify that the build succeeds.

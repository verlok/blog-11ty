---
name: translate-post-it-to-en
description: Automatically localizes a new Italian blog post into English, copying assets and setting up the front matter correctly.
---

When the user requests to translate a new blog post to English, or when a new post is added under `content/it/blog/` that is not yet present under `content/en/blog/`:

1. Identify the Italian post folder name (e.g., `YYYY-MM-DD_it-post-slug`) under `content/it/blog/`.
2. Translate the `it-post-slug` part into a URL-friendly English slug (`en-post-slug`) and create the corresponding folder under `content/en/blog/YYYY-MM-DD_en-post-slug/`.
3. Copy all non-markdown files (images, screenshots, slides, etc.) from the Italian path to the English path.
4. Read the file `content/it/blog/<it_folder_name>/index.md`.
5. Translate the front matter (`title`, `description`, `image_alt`) and markdown body into natural and professional English:
   - Keep shortcode tags and parameters unchanged (e.g., `{% image %}`).
   - Always enclose the YAML front matter `title` and `description` fields in double quotes (`"`) to prevent syntax errors with colons (`:`).
   - Ensure `translationKey` (e.g., `"YYYY-MM-DD_topic-identifier"`) is included in the front matter to link localized URL versions across languages.
6. Write the translated post to `content/en/blog/<en_folder_name>/index.md`.
7. Run `npm run build` to verify that the build succeeds.

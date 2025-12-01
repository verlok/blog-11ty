# Project Overview

This is a personal blog built with the [Eleventy](https://www.11ty.dev/) static site generator. It uses a variety of plugins to handle images, RSS feeds, syntax highlighting, and more. The content is written in Markdown and the templates are written in Nunjucks.

## Writing a new post

To write a new post, create a new folder in the `content/blog` directory with the format `YYYY-MM-DD_post-slug`, where `YYYY-MM-DD` is the publication date and `post-slug` is a descriptive, URL-friendly title. For example: `content/blog/2025-11-24_google-antigravity-new-ide-agentic-ai`. Inside the folder, create a `index.md` file with the front matter and the content of the post. For images, add them in the same folder and reference them in the content using the `image` shortcode. See one of the existing posts for an example.

The front matter should include the following fields:

```yaml
---
title: "Google Antigravity: The New IDE That Embraces Agentic AI"
description: "Google Antigravity transforms AI assistance from a tool into an active partner. Discover how this new IDE leverages Gemini 3 and autonomous agents to change the way we develop software."
date: 2025-11-24
tags:
  - ai
  - google
  - antigravity
  - ide
layout: layouts/post.njk
image: ./cover.png
image_alt: "A futuristic abstract representation of the Google Antigravity IDE interface."
---
```

Note that, in the published version of the post, the `YYYY-MM-DD` is not included in the URL. For example, the URL of the post above is `https://www.andreaverlicchi.eu/blog/google-antigravity-new-ide-agentic-ai/`.


## Building and Running

### Prerequisites

*   [Node.js](https://nodejs.org/) (version 14 or higher)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/verlok/blog-11ty.git
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

### Running in Development

To start a local development server, run the following command:

```bash
npm start
```

This will start a server at `http://localhost:8080` and automatically rebuild the site when you make changes to the files.

### Building for Production

To build the site for production, run the following command:

```bash
npm run build
```

This will create a `_site` directory with the built site.

## Development Conventions

*   **Content:** All content is located in the `content` directory. Blog posts are in `content/blog`. Each blog post resides in a folder named with the format `YYYY-MM-DD_post-slug`, where `YYYY-MM-DD` is the publication date and `post-slug` is a descriptive, URL-friendly title. For example: `content/blog/2023-06-16_how-and-why-to-optimize-web-performance-practical-tips-2023/`.
*   **Templates:** Templates are located in the `_includes` directory. The main layout is `_includes/layouts/base.njk`.
*   **Static Assets:** Static assets like CSS and images are located in the `public` directory.
*   **Images:** The `@11ty/eleventy-img` plugin is used to generate responsive images. The `image` shortcode can be used to insert images in templates.
*   **Drafts:** To create a draft post, add `draft: true` to the front matter of the post. Drafts are only included in the build during development.

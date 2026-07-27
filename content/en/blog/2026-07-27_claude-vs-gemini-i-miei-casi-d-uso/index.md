---
title: "Claude vs Gemini: My Use Cases"
description: "A practical breakdown of how I use Anthropic Claude and Google Gemini across software development, work tasks, and personal life."
date: 2026-07-27
tags:
  - ai
  - claude
  - gemini
  - antigravity
  - productivity
layout: layouts/post.njk
image: ./cover.jpg
image_alt: "Thoughtful Andrea with speech bubbles showing Anthropic Claude and Google Gemini logos."
---

I definitely use Claude, I'm not saying I don't! But for many things, I still prefer **Gemini 3.6 Flash**.

The reason is simple: although my company has fully adopted Claude and strongly encourages its use, being in close contact with Google and other Google developers through the **GDE (Google Developer Experts)** program means I hear enthusiastic feedback about Gemini as well. So I want to keep testing and using both.

I'm not saying they are completely equivalent for me, but there are specific use cases where I prefer one over the other. Here is how I split them in my daily workflow:

<figure>
	{% image "cover.jpg", "Thoughtful Andrea with speech bubbles showing Anthropic Claude and Google Gemini logos.", [648, 1296], "648px", true %}
	<figcaption>Claude or Gemini? The speech bubbles represent my daily AI choices.</figcaption>
</figure>

## Claude in Claude Desktop

- **Complex multi-tool tasks**: Long tasks that involve reading and writing across multiple workplace tools, including company Slack, Hex, or other integrations.

## Claude in Claude Code

- **Complex code development**: For heavy coding tasks (the ones requiring a good amount of reasoning, like major release refactoring), I rely on *Fable 5, Opus 4.8, or Sonnet 5*. Often these tasks involve direct integrations via CLI with GitLab (`glab`), Google Cloud (`gcloud`), or our internal Athena MCP server.
- **Git troubleshooting (with Haiku)**: Getting out of tricky `git` situations (like moving recent commits mistakenly pushed to `main` over to a feature branch, or force-pushing the current feature branch to `staging` overriding what was already there — don't judge me: I almost never use `git` from the command line, I'm lazy!).

## Gemini in Antigravity / Antigravity IDE

- **Medium-complexity coding tasks**: For medium-to-large feature implementations, I use **Gemini 3.6 Flash (high)**.
- **DevTools & Performance Analysis**: For tasks involving DevTools for Agents and deep web performance profiling, I use **Gemini 3.6 Flash (medium)**.
- **Blog Maintenance & Enhancements**: For various work on this blog (e.g., recently translating it entirely into Italian, creating custom skills to write new posts, etc.), I use **Gemini 3.6 Flash (medium/high)**. Spoiler: this very blog post, including its cover image, was generated right here using Antigravity and Gemini 3.6 Flash (Medium)!

## Gemini (web / desktop) – Personal Account

For questions about life, the world, and the universe:

- **Kitten care**: How to welcome two kitten puppies when you've never had pets before (a long chat still active after a month!).
- **Diet & Nutrition**: Advice on diet and meal planning (an active chat used for over a year).
- **Home projects**: Correctly sizing a photovoltaic solar system (a pinned chat I'll need very soon).

## Gemini (web / desktop) – Work Account

For strictly work-related queries:

- **Code analysis**: Inspecting minified JS libraries.
- **SQL optimization**: Comparing complexity and execution cost of SQL queries.
- **Error debugging**: Analyzing unclear Python or JavaScript stack traces and errors.
- **Slack workflows**: Advanced Slack automation, app setup, and workflows.

## Gemini (web / desktop) – Both Accounts

Cross-cutting use cases where Gemini is my go-to choice across both personal and work profiles:

- **Persistent web searches**: Web searches whose results I want saved in an accessible history, rather than lost forever *"like tears in rain"*.
- **Document & File analysis**: Uploading files to extract structured information.
- **Tech questions & setup**: Resolving technical doubts, configuring tools, making services talk to each other, or understanding AI model internals.
- **Brainstorming & Presentations**: Generating ideas and structuring content for presentations.

---

In conclusion: there is no single absolute "winner" for every need. Experimenting with both lets me leverage the best of both ecosystems and choose the right tool for each specific task!

import fs from "fs";
import { DateTime } from "luxon";
import markdownItAnchor from "markdown-it-anchor";

import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginBundle from "@11ty/eleventy-plugin-bundle";
import pluginNavigation from "@11ty/eleventy-navigation";
import { EleventyHtmlBasePlugin, I18nPlugin } from "@11ty/eleventy";
import pluginDrafts from "./eleventy.config.drafts.js";
import pluginImages from "./eleventy.config.images.js";

import eleventyPluginSpeculationRules from "eleventy-plugin-speculation-rules";

export default function (eleventyConfig) {
	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
		"./node_modules/prismjs/themes/prism-okaidia.css": "/css/prism-okaidia.css",
	});

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

	// App plugins
	eleventyConfig.addPlugin(pluginDrafts);
	eleventyConfig.addPlugin(pluginImages);

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 },
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);
	eleventyConfig.addPlugin(I18nPlugin, {
		defaultLanguage: "en",
		filters: {
			url: "locale_url",
			links: "locale_links",
		},
	});

	eleventyConfig.addPlugin(eleventyPluginSpeculationRules);

	/* eleventyConfig.addPlugin(eleventyPluginSpeculationRules, {
		mode: "prerender", // prefetch | prerender
		eagerness: "moderate", // conservative | moderate | eager
		noPrerenderSelector: ".no-prerender",
		include: [],
		exclude: [],
	}); */

	// Filters
	eleventyConfig.addFilter("filterByLang", function (collection, lang) {
		return (collection || []).filter((item) => {
			if (!item) return false;
			const itemLang = item.lang || (item.data && item.data.lang) || "en";
			return itemLang === lang;
		});
	});

	eleventyConfig.addFilter("filterTagAltLinks", function (altLinks, tag) {
		if (!altLinks) {
			return altLinks;
		}
		let filtered = altLinks.filter(
			(alt) => alt.url !== "/" && alt.url !== "/index.html"
		);
		if (!tag) {
			return filtered;
		}
		const slugify = eleventyConfig.getFilter("slugify");
		const tagSlug = slugify(tag);
		return filtered.filter((alt) => alt.url.includes(`/${tagSlug}/`));
	});

	eleventyConfig.addFilter("getAlternateLocales", function (currentPage, collectionsAll, translationKey) {
		if (!currentPage || !collectionsAll) {
			return [];
		}
		const currentLang = currentPage.lang || (currentPage.data && currentPage.data.lang) || "en";
		const currentUrl = currentPage.url;

		const stripLangPrefix = (str) => {
			if (!str) return "";
			return str.replace(/^\/(en|it)\b/, "");
		};

		const currentPath = stripLangPrefix(currentUrl);
		const key = translationKey || (currentPage.data && currentPage.data.translationKey);

		const result = [{ lang: currentLang, url: currentUrl }];

		for (const item of collectionsAll) {
			if (!item.url || item.url === currentUrl || item.url === "/" || item.url === "/index.html") {
				continue;
			}
			const itemLang = item.data?.lang || "en";
			if (itemLang === currentLang) {
				continue;
			}
			let isMatch = false;
			if (key && item.data?.translationKey) {
				isMatch = item.data.translationKey === key;
			} else if (currentPath && item.url) {
				const itemPath = stripLangPrefix(item.url);
				isMatch = itemPath === currentPath;
			}
			if (isMatch && !result.some((r) => r.lang === itemLang && r.url === item.url)) {
				result.push({ lang: itemLang, url: item.url });
			}
		}

		return result;
	});

	eleventyConfig.addFilter("filterOtherLangs", function (locales, currentLang) {
		return (locales || []).filter((item) => item.lang !== currentLang);
	});

	eleventyConfig.addFilter("readableDate", (dateObj, format, zone, locale) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" })
			.setLocale(locale || "en")
			.toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter("readingTime", (content) => {
		if (!content) return 1;
		const text = String(content).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
		const words = text ? text.split(" ").length : 0;
		return Math.max(1, Math.round(words / 220));
	});

	eleventyConfig.addFilter("inlineCode", (str) => {
		if (!str) return "";
		const escaped = String(str)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
		return escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if (!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if (n < 0) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return all the tags used in a collection
	eleventyConfig.addFilter("getAllTags", (collection) => {
		let tagSet = new Set();
		for (let item of collection) {
			(item.data.tags || []).forEach((tag) => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(
			(tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1
		);
	});

	const getPostKeywords = (tags, keywords) => {
		const ignored = new Set(["all", "nav", "post", "posts"]);
		const combined = [];
		const seen = new Set();

		const addTerm = (raw) => {
			if (typeof raw !== "string") return;
			const term = raw.trim();
			if (!term) return;
			const key = term.toLowerCase();
			if (ignored.has(key) || seen.has(key)) return;
			seen.add(key);
			combined.push(term);
		};

		if (Array.isArray(tags)) {
			tags.forEach(addTerm);
		}
		if (Array.isArray(keywords)) {
			keywords.forEach(addTerm);
		} else if (typeof keywords === "string") {
			keywords.split(",").forEach(addTerm);
		}

		return combined;
	};

	eleventyConfig.addFilter("getPostKeywords", function (tags, keywords) {
		return getPostKeywords(tags, keywords);
	});

	eleventyConfig.addFilter("buildSearchIndex", function (collection, lang) {
		const locale = lang || "en";
		const items = [...(collection || [])].reverse().map((post) => {
			let minutes = 1;
			if (post.inputPath) {
				try {
					const raw = fs.readFileSync(post.inputPath, "utf8");
					const body = raw.replace(/^---[\s\S]*?---\s*/, "");
					const plainText = body
						.replace(/\{%[\s\S]*?%\}/g, " ")
						.replace(/<[^>]*>/g, " ")
						.replace(/\s+/g, " ")
						.trim();
					const words = plainText ? plainText.split(" ").length : 0;
					minutes = Math.max(1, Math.round(words / 220));
				} catch (e) {}
			}

			return {
				url: post.url,
				title: post.data?.title || "",
				description: post.data?.description || "",
				keywords: getPostKeywords(post.data?.tags, post.data?.keywords),
				date: DateTime.fromJSDate(post.date, { zone: "utc" })
					.setLocale(locale)
					.toFormat("d MMM yyyy"),
				readingTime: minutes,
			};
		});

		return JSON.stringify(items);
	});

	// Customize Markdown library settings:
	eleventyConfig.amendLibrary("md", (mdLib) => {
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.linkInsideHeader({
				placement: "after",
				class: "header-anchor",
				symbol: "#",
				ariaHidden: false,
				// Give each "#" link a meaningful accessible name instead of "number sign"
				renderAttrs: (slug, state) => {
					const idx = state.tokens.findIndex(
						(t) => t.type === "heading_open" && t.attrGet("id") === slug
					);
					const title =
						idx >= 0
							? state.tokens[idx + 1].children
									.filter((t) => t.type === "text" || t.type === "code_inline")
									.map((t) => t.content)
									.join("")
							: slug;
					const lang = state.env?.page?.lang || state.env?.lang || "en";
					const prefix = lang === "it" ? "Link alla sezione" : "Link to section";
					return { "aria-label": `${prefix}: ${title}` };
				},
			}),
			level: [1, 2, 3, 4],
			slugify: eleventyConfig.getFilter("slugify"),
		});
	});

	// Add collection to filter only talks
	eleventyConfig.addCollection("posts__talks", function (collectionApi) {
		return collectionApi.getFilteredByTag("talks");
	});

	// Add collection to filter only lazyload posts
	eleventyConfig.addCollection("posts__lazyload", function (collectionApi) {
		return collectionApi.getFilteredByTag("lazy loading");
	});

	// Language-specific collections
	eleventyConfig.addCollection("posts_en", (collectionApi) => {
		return collectionApi.getFilteredByTag("posts").filter((item) => (item.data.lang || "en") === "en");
	});

	eleventyConfig.addCollection("posts_it", (collectionApi) => {
		return collectionApi.getFilteredByTag("posts").filter((item) => item.data.lang === "it");
	});

	eleventyConfig.addCollection("posts__talks_en", (collectionApi) => {
		return collectionApi.getFilteredByTag("talks").filter((item) => (item.data.lang || "en") === "en");
	});

	eleventyConfig.addCollection("posts__talks_it", (collectionApi) => {
		return collectionApi.getFilteredByTag("talks").filter((item) => item.data.lang === "it");
	});

	eleventyConfig.addCollection("posts__lazyload_en", (collectionApi) => {
		return collectionApi.getFilteredByTag("lazy loading").filter((item) => (item.data.lang || "en") === "en");
	});

	eleventyConfig.addCollection("posts__lazyload_it", (collectionApi) => {
		return collectionApi.getFilteredByTag("lazy loading").filter((item) => item.data.lang === "it");
	});

	const getSortedTagsForLang = (collectionApi, lang) => {
		const posts = collectionApi
			.getFilteredByTag("posts")
			.filter((item) => (item.data.lang || "en") === lang);
		const ignored = new Set(["all", "nav", "post", "posts"]);
		const counts = new Map();
		for (const item of posts) {
			for (const tag of item.data.tags || []) {
				if (ignored.has(tag)) continue;
				counts.set(tag, (counts.get(tag) || 0) + 1);
			}
		}
		return Array.from(counts.entries())
			.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
			.map(([tag]) => tag);
	};

	eleventyConfig.addCollection("tags_en", (collectionApi) => {
		return getSortedTagsForLang(collectionApi, "en");
	});

	eleventyConfig.addCollection("tags_it", (collectionApi) => {
		return getSortedTagsForLang(collectionApi, "it");
	});

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	return {
		// Control which files Eleventy will process
		// e.g.: *.md, *.njk, *.html, *.liquid
		templateFormats: ["md", "njk", "html", "liquid"],

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: "njk",

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "njk",

		// These are all optional:
		dir: {
			input: "content", // default: "."
			includes: "../_includes", // default: "_includes"
			data: "../_data", // default: "_data"
			output: "_site",
		},

		// -----------------------------------------------------------------
		// Optional items:
		// -----------------------------------------------------------------

		// If your site deploys to a subdirectory, change `pathPrefix`.
		// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

		// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
		// it will transform any absolute URLs in your HTML to include this
		// folder name and does **not** affect where things go in the output folder.
		pathPrefix: "/",
	};
};

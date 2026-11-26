import fs from "fs";
import path from "path";
import eleventyImage from "@11ty/eleventy-img";
import { JSDOM } from "jsdom";

const IGNORED_IMAGE_PATTERNS = [
	/codesandbox\.io\/static\/img\/play-codesandbox/i,
	/img\.shields\.io/i,
];

const findFirstContentImage = (content) => {
	const dom = new JSDOM(content);
	const imgs = Array.from(dom.window.document.querySelectorAll("img"));
	return imgs.find((el) => {
		const src = el.getAttribute("src") || "";
		return !IGNORED_IMAGE_PATTERNS.some((re) => re.test(src));
	});
};

const correctLazyAttributes = (img, isFirst) => {
	if (isFirst) {
		img.setAttribute("fetchpriority", "high");
		img.setAttribute("loading", "eager");
	} else {
		img.removeAttribute("fetchpriority");
		img.setAttribute("loading", "lazy");
	}
};

export default (eleventyConfig) => {
	const generatedUrlToSourceFile = new Map();

	function relativeToInputPath(inputPath, relativeFilePath) {
		let split = inputPath.split("/");
		split.pop();

		return path.resolve(split.join(path.sep), relativeFilePath);
	}

	function resolveSourceFile(rawSrc, pageInputPath) {
		if (generatedUrlToSourceFile.has(rawSrc)) {
			return generatedUrlToSourceFile.get(rawSrc);
		}

		if (rawSrc.startsWith("/")) {
			const candidates = [
				path.join(eleventyConfig.dir.output, rawSrc),
				path.join("public", rawSrc),
				rawSrc,
			];
			const match = candidates.find((candidate) => fs.existsSync(candidate));
			return match || null;
		}

		if (pageInputPath) {
			return relativeToInputPath(pageInputPath, rawSrc);
		}

		return rawSrc;
	}

	// Eleventy Image shortcode
	// https://www.11ty.dev/docs/plugins/image/
	eleventyConfig.addAsyncShortcode(
		"image",
		async function imageShortcode(
			src,
			alt,
			widths,
			sizes,
			useLazyLoading,
			className
		) {
			// Full list of formats here: https://www.11ty.dev/docs/plugins/image/#output-formats
			// Commented AVIF in July 6th because Safari tries to render it, but it doesn't
			let formats = [/* "avif",  */ "webp", "auto"];
			let file = relativeToInputPath(this.page.inputPath, src);
			let metadata = await eleventyImage(file, {
				widths: widths || ["auto"],
				formats,
				outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we’re using addPlugin.
			});

			for (const entries of Object.values(metadata)) {
				for (const entry of entries) {
					if (entry?.url) {
						generatedUrlToSourceFile.set(entry.url, file);
					}
				}
			}

			// Find a way to pass loading lazy to second to more images
			const loading = useLazyLoading ? "lazy" : "eager";
			let imageAttributes = {
				alt,
				sizes,
				loading,
			};
			if (className) {
				imageAttributes.class = className;
			}
			if (!useLazyLoading) {
				imageAttributes.fetchpriority = "high";
			}
			return eleventyImage.generateHTML(metadata, imageAttributes);
		}
	);

	eleventyConfig.addFilter("extractImage", function (content, isFirst) {
		const img = findFirstContentImage(content);
		if (!img) return "";
		img.classList.add("postlist-image");
		correctLazyAttributes(img, isFirst);
		const picture = img.closest("picture");
		return (picture || img).outerHTML;
	});

	eleventyConfig.addFilter("extractImageUrl", function (content) {
		const dom = new JSDOM(content);
		const img = dom.window.document.querySelector("img");
		if (!img) return "";
		return img.src;
	});

	eleventyConfig.addAsyncFilter(
		"getOgImageUrl",
		async function (frontmatterImage, content) {
			let pageInputPath = this.page?.inputPath;
			let rawSrc = "";
			if (frontmatterImage) {
				rawSrc = frontmatterImage;
			} else if (content) {
				const img = findFirstContentImage(content);
				if (img) {
					rawSrc = img.getAttribute("src") || "";
				}
			}

			if (!rawSrc) {
				return "";
			}

			if (rawSrc.startsWith("http://") || rawSrc.startsWith("https://")) {
				return rawSrc;
			}

			try {
				let filePath = resolveSourceFile(rawSrc, pageInputPath);
				if (!filePath) {
					return rawSrc;
				}

				let metadata = await eleventyImage(filePath, {
					widths: [1200],
					formats: ["png"],
					outputDir: path.join(eleventyConfig.dir.output, "img"),
				});

				let pngFormat = metadata.png || metadata.jpeg;
				if (pngFormat && pngFormat.length > 0) {
					return pngFormat[pngFormat.length - 1].url;
				}
			} catch (e) {
				console.error("[getOgImageUrl Error]", e.message, "rawSrc:", rawSrc, "inputPath:", pageInputPath);
				return rawSrc;
			}

			return rawSrc;
		}
	);
};

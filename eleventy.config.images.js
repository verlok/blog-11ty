import path from "path";
import eleventyImage from "@11ty/eleventy-img";
import { JSDOM } from "jsdom";

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
	function relativeToInputPath(inputPath, relativeFilePath) {
		let split = inputPath.split("/");
		split.pop();

		return path.resolve(split.join(path.sep), relativeFilePath);
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
		const dom = new JSDOM(content);
		const img = dom.window.document.querySelector("img");
		if (!img) return "";
		img.classList.add("postlist-image");
		correctLazyAttributes(img, isFirst);
		const picture = img.closest("picture");
		//const returnedTag = picture || img;
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
				const dom = new JSDOM(content);
				const img = dom.window.document.querySelector("img");
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
				let filePath = rawSrc;
				if (!path.isAbsolute(rawSrc) && pageInputPath) {
					filePath = relativeToInputPath(pageInputPath, rawSrc);
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

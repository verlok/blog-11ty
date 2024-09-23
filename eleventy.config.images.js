const path = require("path");
const eleventyImage = require("@11ty/eleventy-img");
const { JSDOM } = require("jsdom");

module.exports = (eleventyConfig) => {
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
				decoding: "async",
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
	/*
	eleventyConfig.addShortcode("first-image", (post) => {
		extractFirstImage(post);
	});

	const extractFirstImage = (templateContent) => {
		if (templateContent.includes("<picture>")) {
			const pictureTagBegin = templateContent.indexOf("<picture>");
			const pictureTagEnd =
				templateContent.indexOf("</picture>", pictureTagBegin) +
				"</picture>".length;
			//console.log(pictureTagBegin, pictureTagEnd);
			//console.log(templateContent.substring(pictureTagBegin, pictureTagEnd));
			return "Cippa lippa";
			return templateContent.substring(pictureTagBegin, pictureTagEnd);
		}

		return "";
	};
	*/

	eleventyConfig.addFilter("extractImage", function (content, isFirst) {
		const dom = new JSDOM(content);
		const fig = dom.window.document.querySelector("figure");
		if (!fig) return "";
		const picture = fig.querySelector("picture");
		const img = fig.querySelector("img");
		if (isFirst) {
			img.setAttribute("fetchpriority", "high");
			img.setAttribute("loading", "eager");
		} else {
			img.removeAttribute("fetchpriority");
			img.setAttribute("loading", "lazy");
		}
		const returnedTag = picture || img;
		if (returnedTag) {
			returnedTag.classList.add("postlist-image");
			return returnedTag.outerHTML;
		}
		return "";
	});
};

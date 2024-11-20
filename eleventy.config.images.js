const path = require("path");
const eleventyImage = require("@11ty/eleventy-img");
const { JSDOM } = require("jsdom");

const correctLazyAttributes = (img, isFirst) => {
	img.setAttribute("decoding", "async"); // Always async, as Barry explains here https://www.tunetheweb.com/blog/what-does-the-image-decoding-attribute-actually-do/
	if (isFirst) {
		img.setAttribute("fetchpriority", "high");
		img.setAttribute("loading", "eager");
	} else {
		img.removeAttribute("fetchpriority");
		img.setAttribute("loading", "lazy");
	}
};

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
			const decoding = "async"; // Always async, as Barry explains here https://www.tunetheweb.com/blog/what-does-the-image-decoding-attribute-actually-do/
			let imageAttributes = {
				alt,
				sizes,
				loading,
				decoding,
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
};

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

	eleventyConfig.addFilter("extractImage", function (content, isFirst) {
		const dom = new JSDOM(content);

		// Find the first image
		const img = dom.window.document.querySelector("img");
		if (!img) return "";
		// And the closest picture
		const picture = img.closest("picture");

		// If this is asked to be the first, add fetch priority and eager
		// If not the first, set it to loading lazy and remove fetchpriority
		if (isFirst) {
			img.setAttribute("fetchpriority", "high");
			img.setAttribute("loading", "eager");
		} else {
			img.removeAttribute("fetchpriority");
			img.setAttribute("loading", "lazy");
		}

		// If a picture was found, return it, else return the image
		const returnedTag = picture || img;

		// Ah, I need that class on the correct tag
		returnedTag.classList.add("postlist-image");

		// Now I can return it
		return returnedTag.outerHTML;
	});
};

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

	// Emits social-sharing meta tags (Open Graph + Twitter) backed by a 1200w JPEG.
	const escapeAttr = (value) =>
		String(value)
			.replace(/&/g, "&amp;")
			.replace(/"/g, "&quot;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");

	eleventyConfig.addAsyncShortcode(
		"ogImageMeta",
		async function ogImageMetaShortcode(src, alt, baseUrl) {
			if (!src) return "";
			const file = relativeToInputPath(this.page.inputPath, src);
			const metadata = await eleventyImage(file, {
				widths: [1200],
				formats: ["jpeg"],
				outputDir: path.join(eleventyConfig.dir.output, "img"),
			});
			const jpeg = metadata.jpeg[0];
			const absolute = new URL(jpeg.url, baseUrl).toString();
			const altAttr = alt
				? `\n\t\t<meta property="og:image:alt" content="${escapeAttr(alt)}">`
				: "";
			const twAltAttr = alt
				? `\n\t\t<meta name="twitter:image:alt" content="${escapeAttr(alt)}">`
				: "";
			return [
				`<meta property="og:image" content="${absolute}">`,
				`\t\t<meta property="og:image:width" content="${jpeg.width}">`,
				`\t\t<meta property="og:image:height" content="${jpeg.height}">${altAttr}`,
				`\t\t<meta name="twitter:image" content="${absolute}">${twAltAttr}`,
			].join("\n");
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

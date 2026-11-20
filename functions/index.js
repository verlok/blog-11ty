/**
 * Cloudflare Pages Function for `/`
 * Redirects visitors to `/it/` or `/en/` based on the browser's `Accept-Language` header,
 * replacing the language-based redirect previously configured in `netlify.toml`.
 */
function getPreferredLanguage(acceptLanguage) {
	if (!acceptLanguage) {
		return "en";
	}

	const preferences = acceptLanguage
		.split(",")
		.map((part) => {
			const [rawTag, ...params] = part.trim().split(";");
			const tag = rawTag.toLowerCase();
			let quality = 1;
			for (const param of params) {
				const [key, value] = param.trim().split("=");
				if (key === "q" && value !== undefined) {
					const parsed = Number.parseFloat(value);
					if (!Number.isNaN(parsed)) {
						quality = parsed;
					}
				}
			}
			return { tag, quality };
		})
		.filter(({ tag, quality }) => tag && quality > 0)
		.sort((a, b) => b.quality - a.quality);

	for (const { tag } of preferences) {
		if (tag === "it" || tag.startsWith("it-")) {
			return "it";
		}
		if (tag === "en" || tag.startsWith("en-")) {
			return "en";
		}
	}

	return "en";
}

export function onRequest(context) {
	const url = new URL(context.request.url);
	const lang = getPreferredLanguage(context.request.headers.get("Accept-Language"));
	const target = new URL(`/${lang}/`, url.origin);
	target.search = url.search;

	return new Response(null, {
		status: 302,
		headers: {
			Location: target.toString(),
			Vary: "Accept-Language",
			"Cache-Control": "private, no-store",
		},
	});
}

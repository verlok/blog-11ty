/**
 * Cloudflare Worker entry point for andreaverlicchi.eu
 * Redirects visitors on `/` to `/it/` or `/en/` based on the browser's `Accept-Language` header,
 * and delegates all other requests to Cloudflare Static Assets.
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

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (url.pathname === "/") {
			const lang = getPreferredLanguage(request.headers.get("Accept-Language"));
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

		return env.ASSETS.fetch(request);
	},
};

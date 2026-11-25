(function () {
	"use strict";

	function readI18n() {
		var el = document.getElementById("search-i18n");
		if (!el) return {};
		try {
			return JSON.parse(el.textContent || "{}");
		} catch (e) {
			return {};
		}
	}

	var i18n = readI18n();

	function normalizeChar(ch) {
		return ch
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[`'’‘"“”]/g, function (c) {
				return c === "`" ? "" : "'";
			})
			.toLowerCase();
	}

	function normalizeText(str) {
		if (!str) return "";
		return normalizeChar(String(str)).trim();
	}

	function tokenize(query) {
		var norm = normalizeText(query);
		if (!norm) return [];
		return norm.split(/\s+/).filter(Boolean);
	}

	function escapeRegExp(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}

	function buildWordStartRegex(token) {
		return new RegExp("(?:^|[^a-z0-9])" + escapeRegExp(token));
	}

	function prepareSearchable(item) {
		var keywords = Array.isArray(item.keywords) ? item.keywords : [];
		var normKeywordsList = keywords.map(normalizeText).filter(Boolean);
		return {
			normTitle: normalizeText(item.title),
			normDesc: normalizeText(item.description),
			normKeywordsList: normKeywordsList,
			normKeywordsText: normKeywordsList.join(" "),
		};
	}

	function scoreRecord(rec, tokens, fullNormQuery) {
		if (!tokens.length) return 1;

		for (var i = 0; i < tokens.length; i++) {
			var t = tokens[i];
			if (
				rec.normTitle.indexOf(t) === -1 &&
				rec.normDesc.indexOf(t) === -1 &&
				rec.normKeywordsText.indexOf(t) === -1
			) {
				return 0;
			}
		}

		var score = 0;

		if (fullNormQuery.length >= 2) {
			if (rec.normTitle.indexOf(fullNormQuery) !== -1) score += 30;
			for (var k = 0; k < rec.normKeywordsList.length; k++) {
				if (rec.normKeywordsList[k] === fullNormQuery) {
					score += 25;
					break;
				}
			}
			if (rec.normDesc.indexOf(fullNormQuery) !== -1) score += 10;
		}

		for (var j = 0; j < tokens.length; j++) {
			var token = tokens[j];
			var wordRe = buildWordStartRegex(token);

			if (wordRe.test(rec.normTitle)) {
				score += 15;
			} else if (rec.normTitle.indexOf(token) !== -1) {
				score += 10;
			}

			var kwScore = 0;
			for (var m = 0; m < rec.normKeywordsList.length; m++) {
				var kw = rec.normKeywordsList[m];
				if (kw === token) {
					kwScore = Math.max(kwScore, 14);
				} else if (kw.indexOf(token) === 0) {
					kwScore = Math.max(kwScore, 10);
				} else if (kw.indexOf(token) !== -1) {
					kwScore = Math.max(kwScore, 7);
				}
			}
			score += kwScore;

			if (wordRe.test(rec.normDesc)) {
				score += 5;
			} else if (rec.normDesc.indexOf(token) !== -1) {
				score += 3;
			}
		}

		return score;
	}

	function appendHighlightedSegment(parent, text, tokens) {
		if (!text) return;
		if (!tokens.length) {
			parent.appendChild(document.createTextNode(text));
			return;
		}

		var normStr = "";
		var charMap = [];
		for (var i = 0; i < text.length; ) {
			var cp = text.codePointAt(i);
			var ch = String.fromCodePoint(cp);
			var step = ch.length;
			var normCh = normalizeChar(ch);
			if (!normCh) {
				if (charMap.length > 0) {
					charMap[charMap.length - 1].end = i + step;
				}
			} else {
				for (var c = 0; c < normCh.length; c++) {
					normStr += normCh.charAt(c);
					charMap.push({ start: i, end: i + step });
				}
			}
			i += step;
		}

		var ranges = [];
		for (var t = 0; t < tokens.length; t++) {
			var token = tokens[t];
			if (!token) continue;
			var pos = 0;
			while (pos <= normStr.length - token.length) {
				var idx = normStr.indexOf(token, pos);
				if (idx === -1) break;
				var startMap = charMap[idx];
				var endMap = charMap[idx + token.length - 1];
				if (startMap && endMap) {
					ranges.push({ start: startMap.start, end: endMap.end });
				}
				pos = idx + token.length;
			}
		}

		if (!ranges.length) {
			parent.appendChild(document.createTextNode(text));
			return;
		}

		ranges.sort(function (a, b) {
			return a.start - b.start || b.end - a.end;
		});

		var merged = [ranges[0]];
		for (var r = 1; r < ranges.length; r++) {
			var prev = merged[merged.length - 1];
			var curr = ranges[r];
			if (curr.start <= prev.end) {
				prev.end = Math.max(prev.end, curr.end);
			} else {
				merged.push(curr);
			}
		}

		var cursor = 0;
		for (var m = 0; m < merged.length; m++) {
			var range = merged[m];
			if (range.start > cursor) {
				parent.appendChild(document.createTextNode(text.slice(cursor, range.start)));
			}
			var mark = document.createElement("mark");
			mark.textContent = text.slice(range.start, range.end);
			parent.appendChild(mark);
			cursor = range.end;
		}

		if (cursor < text.length) {
			parent.appendChild(document.createTextNode(text.slice(cursor)));
		}
	}

	function appendFormattedText(parent, rawText, tokens) {
		if (!rawText) return;
		var str = String(rawText);
		var re = /`([^`]+)`/g;
		var lastIndex = 0;
		var match;

		while ((match = re.exec(str)) !== null) {
			if (match.index > lastIndex) {
				appendHighlightedSegment(parent, str.slice(lastIndex, match.index), tokens);
			}
			var codeEl = document.createElement("code");
			appendHighlightedSegment(codeEl, match[1], tokens);
			parent.appendChild(codeEl);
			lastIndex = re.lastIndex;
		}

		if (lastIndex < str.length) {
			appendHighlightedSegment(parent, str.slice(lastIndex), tokens);
		}
	}

	function formatCountMessage(count) {
		if (count === 1) {
			return i18n.resultsSingular || "1 article found";
		}
		var template = i18n.resultsPlural || "{n} articles found";
		return template.replace("{n}", String(count));
	}

	/* ======================================================================
	 * 1. Global Search Dialog (Mobile + Desktop)
	 * ====================================================================== */
	function initSearchDialog() {
		var toggleBtn = document.getElementById("search-toggle");
		var dialog = document.getElementById("search-dialog");
		var input = document.getElementById("search-dialog-input");
		var clearBtn = document.getElementById("search-dialog-clear");
		var closeBtn = document.getElementById("search-dialog-close");
		var statusEl = document.getElementById("search-dialog-status");
		var tagsEl = document.getElementById("search-dialog-tags");
		var emptyEl = document.getElementById("search-dialog-empty");
		var resultsEl = document.getElementById("search-dialog-results");

		if (!toggleBtn || !dialog || !input || !resultsEl) return;

		var indexUrl = dialog.getAttribute("data-index-url");
		var cachedPosts = null;
		var popularTags = [];
		var fetchPromise = null;
		var renderedLinks = [];
		var lastFocused = null;

		function loadIndex() {
			if (cachedPosts) return Promise.resolve(cachedPosts);
			if (fetchPromise) return fetchPromise;

			fetchPromise = fetch(indexUrl, { credentials: "same-origin" })
				.then(function (res) {
					if (!res.ok) throw new Error("HTTP " + res.status);
					return res.json();
				})
				.then(function (items) {
					var tagCounts = Object.create(null);
					cachedPosts = (items || []).map(function (item, idx) {
						var prepared = prepareSearchable(item);
						var kws = Array.isArray(item.keywords) ? item.keywords : [];
						for (var i = 0; i < kws.length; i++) {
							var kw = kws[i];
							tagCounts[kw] = (tagCounts[kw] || 0) + 1;
						}
						return {
							index: idx,
							url: item.url,
							title: item.title || "",
							description: item.description || "",
							keywords: kws,
							date: item.date || "",
							readingTime: item.readingTime || 1,
							normTitle: prepared.normTitle,
							normDesc: prepared.normDesc,
							normKeywordsList: prepared.normKeywordsList,
							normKeywordsText: prepared.normKeywordsText,
						};
					});

					popularTags = Object.keys(tagCounts)
						.sort(function (a, b) {
							return tagCounts[b] - tagCounts[a] || a.localeCompare(b);
						})
						.slice(0, 8);

					return cachedPosts;
				})
				.catch(function (err) {
					fetchPromise = null;
					throw err;
				});

			return fetchPromise;
		}

		function focusResultAt(index) {
			if (!renderedLinks.length) return;
			var clamped = Math.max(0, Math.min(index, renderedLinks.length - 1));
			var target = renderedLinks[clamped];
			if (target) {
				target.focus();
				target.scrollIntoView({ block: "nearest" });
			}
		}

		function renderPopularTags() {
			if (!tagsEl) return;
			tagsEl.textContent = "";

			if (!popularTags.length) {
				tagsEl.hidden = true;
				return;
			}

			var heading = document.createElement("p");
			heading.className = "search-dialog-tags-label";
			heading.textContent = i18n.popularKeywords || "Popular keywords";
			tagsEl.appendChild(heading);

			var list = document.createElement("div");
			list.className = "search-dialog-tags-list";

			for (var i = 0; i < popularTags.length; i++) {
				(function (tag) {
					var btn = document.createElement("button");
					btn.type = "button";
					btn.className = "search-tag-chip";
					btn.textContent = tag;
					btn.addEventListener("click", function () {
						input.value = tag;
						performSearch();
						input.focus();
					});
					list.appendChild(btn);
				})(popularTags[i]);
			}

			tagsEl.appendChild(list);
			tagsEl.hidden = false;
		}

		function buildResultItem(post, idx, tokens) {
			var li = document.createElement("li");
			li.className = "search-result-item";

			var link = document.createElement("a");
			link.className = "search-result-link";
			link.href = post.url;
			link.setAttribute("data-result-index", String(idx));

			var titleEl = document.createElement("div");
			titleEl.className = "search-result-title";
			appendFormattedText(titleEl, post.title, tokens);
			link.appendChild(titleEl);

			if (post.description) {
				var descEl = document.createElement("p");
				descEl.className = "search-result-desc";
				appendFormattedText(descEl, post.description, tokens);
				link.appendChild(descEl);
			}

			var metaEl = document.createElement("div");
			metaEl.className = "search-result-meta";

			var dateSpan = document.createElement("span");
			dateSpan.textContent = post.date;
			metaEl.appendChild(dateSpan);

			var sep = document.createElement("span");
			sep.className = "meta-sep";
			sep.setAttribute("aria-hidden", "true");
			sep.textContent = "·";
			metaEl.appendChild(sep);

			var timeSpan = document.createElement("span");
			timeSpan.textContent = post.readingTime + " " + (i18n.minRead || "min read");
			metaEl.appendChild(timeSpan);

			if (post.keywords.length) {
				var sortedKeywords = post.keywords.slice().sort(function (a, b) {
					var na = normalizeText(a);
					var nb = normalizeText(b);
					var aMatch = tokens.some(function (t) {
						return na.indexOf(t) !== -1;
					});
					var bMatch = tokens.some(function (t) {
						return nb.indexOf(t) !== -1;
					});
					if (aMatch !== bMatch) return aMatch ? -1 : 1;
					return 0;
				});

				var kwWrap = document.createElement("div");
				kwWrap.className = "search-result-keywords";
				var maxKws = Math.min(sortedKeywords.length, 4);
				for (var k = 0; k < maxKws; k++) {
					var kwText = sortedKeywords[k];
					var badge = document.createElement("span");
					var normKw = normalizeText(kwText);
					var matchesToken = tokens.some(function (t) {
						return normKw.indexOf(t) !== -1;
					});
					badge.className = "search-result-keyword" + (matchesToken ? " is-match" : "");
					appendHighlightedSegment(badge, kwText, tokens);
					kwWrap.appendChild(badge);
				}
				metaEl.appendChild(kwWrap);
			}

			link.appendChild(metaEl);
			li.appendChild(link);
			return { li: li, link: link };
		}

		function performSearch() {
			var rawQuery = input.value;
			var trimmed = rawQuery.trim();
			clearBtn.hidden = rawQuery.length === 0;
			renderedLinks = [];

			if (!cachedPosts) {
				statusEl.textContent = i18n.loading || "Loading search index…";
				resultsEl.textContent = "";
				resultsEl.hidden = true;
				if (emptyEl) emptyEl.hidden = true;
				if (tagsEl) tagsEl.hidden = true;
				return;
			}

			var tokens = tokenize(trimmed);
			resultsEl.textContent = "";

			if (!tokens.length) {
				statusEl.textContent = i18n.emptyPrompt || "Search across all articles by title, description, or keyword.";
				resultsEl.hidden = true;
				if (emptyEl) emptyEl.hidden = true;
				renderPopularTags();
				return;
			}

			if (tagsEl) tagsEl.hidden = true;

			var fullNormQuery = normalizeText(trimmed);
			var matches = [];

			for (var i = 0; i < cachedPosts.length; i++) {
				var post = cachedPosts[i];
				var s = scoreRecord(post, tokens, fullNormQuery);
				if (s > 0) {
					matches.push({ post: post, score: s });
				}
			}

			matches.sort(function (a, b) {
				return b.score - a.score || a.post.index - b.post.index;
			});

			if (!matches.length) {
				statusEl.textContent = (i18n.noResults || "No articles found for") + " “" + trimmed + "”";
				resultsEl.hidden = true;
				if (emptyEl) {
					emptyEl.textContent = i18n.noResultsHint || "Try fewer or different keywords.";
					emptyEl.hidden = false;
				}
				return;
			}

			if (emptyEl) emptyEl.hidden = true;
			resultsEl.hidden = false;
			statusEl.textContent = formatCountMessage(matches.length);

			var frag = document.createDocumentFragment();
			var limit = Math.min(matches.length, 40);
			for (var j = 0; j < limit; j++) {
				var built = buildResultItem(matches[j].post, j, tokens);
				renderedLinks.push(built.link);
				frag.appendChild(built.li);
			}
			resultsEl.appendChild(frag);
		}

		function openDialog() {
			if (dialog.open) return;
			lastFocused = document.activeElement;
			dialog.showModal();
			input.focus();

			if (!cachedPosts) {
				statusEl.textContent = i18n.loading || "Loading search index…";
				loadIndex()
					.then(function () {
						performSearch();
					})
					.catch(function () {
						statusEl.textContent = i18n.error || "Could not load search index. Please try again.";
					});
			} else {
				performSearch();
			}
		}

		function closeDialog() {
			if (dialog.open) {
				dialog.close();
			}
		}

		toggleBtn.addEventListener("pointerenter", function () {
			loadIndex().catch(function () {});
		}, { passive: true });
		toggleBtn.addEventListener("focus", function () {
			loadIndex().catch(function () {});
		});
		toggleBtn.addEventListener("click", openDialog);

		if (closeBtn) {
			closeBtn.addEventListener("click", closeDialog);
		}

		if (clearBtn) {
			clearBtn.addEventListener("click", function () {
				input.value = "";
				performSearch();
				input.focus();
			});
		}

		input.addEventListener("input", performSearch);

		input.addEventListener("keydown", function (e) {
			if (e.key === "ArrowDown") {
				if (renderedLinks.length) {
					e.preventDefault();
					focusResultAt(0);
				} else if (tagsEl && !tagsEl.hidden) {
					var firstChip = tagsEl.querySelector(".search-tag-chip");
					if (firstChip) {
						e.preventDefault();
						firstChip.focus();
					}
				}
			} else if (e.key === "Enter") {
				if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
					input.blur();
				}
			}
		});

		resultsEl.addEventListener("keydown", function (e) {
			var link = e.target && e.target.closest ? e.target.closest(".search-result-link") : null;
			if (!link) return;
			var idx = Number(link.getAttribute("data-result-index"));
			if (Number.isNaN(idx)) return;

			if (e.key === "ArrowDown") {
				e.preventDefault();
				if (idx < renderedLinks.length - 1) {
					focusResultAt(idx + 1);
				}
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				if (idx > 0) {
					focusResultAt(idx - 1);
				} else {
					input.focus();
				}
			} else if (e.key === "Home") {
				e.preventDefault();
				focusResultAt(0);
			} else if (e.key === "End") {
				e.preventDefault();
				focusResultAt(renderedLinks.length - 1);
			}
		});

		dialog.addEventListener("keydown", function (e) {
			if (e.key === "Escape") {
				e.preventDefault();
				closeDialog();
			}
		});

		dialog.addEventListener("click", function (e) {
			if (e.target === dialog) {
				closeDialog();
			}
		});

		dialog.addEventListener("close", function () {
			if (lastFocused && typeof lastFocused.focus === "function") {
				lastFocused.focus();
			}
			lastFocused = null;
		});

		document.addEventListener("keydown", function (e) {
			var isCmdOrCtrlK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
			if (isCmdOrCtrlK) {
				e.preventDefault();
				if (dialog.open) {
					closeDialog();
				} else {
					openDialog();
				}
				return;
			}

			if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !dialog.open) {
				var target = e.target;
				var tag = target && target.tagName ? target.tagName.toLowerCase() : "";
				var isEditable =
					tag === "input" ||
					tag === "textarea" ||
					tag === "select" ||
					(target && target.isContentEditable);
				if (!isEditable) {
					e.preventDefault();
					openDialog();
				}
			}
		});
	}

	/* ======================================================================
	 * 2. Inline Blog Archive Filter (/en/blog/ & /it/blog/)
	 * ====================================================================== */
	function initBlogFilter() {
		var input = document.getElementById("blog-search-input");
		var clearBtn = document.getElementById("blog-search-clear");
		var statusEl = document.getElementById("blog-search-status");
		var emptyEl = document.getElementById("blog-search-empty");
		var emptyTitleEl = document.getElementById("blog-search-empty-title");
		var resetBtn = document.getElementById("blog-search-reset");
		var searchWrap = input ? input.closest(".blog-search") : null;
		var postlistEl = document.querySelector(".postlist");

		if (!input || !postlistEl) return;

		var rawCards = Array.from(postlistEl.querySelectorAll(".postlist-item"));
		var totalCount = Number(searchWrap && searchWrap.getAttribute("data-total-count")) || rawCards.length;

		var cards = rawCards.map(function (el, idx) {
			var kwStr = el.getAttribute("data-search-keywords") || "";
			var kws = kwStr ? kwStr.split(" | ") : [];
			var prepared = prepareSearchable({
				title: el.getAttribute("data-search-title") || "",
				description: el.getAttribute("data-search-desc") || "",
				keywords: kws,
			});
			return {
				el: el,
				originalIndex: idx,
				normTitle: prepared.normTitle,
				normDesc: prepared.normDesc,
				normKeywordsList: prepared.normKeywordsList,
				normKeywordsText: prepared.normKeywordsText,
			};
		});

		function syncUrlQuery(value) {
			if (!window.history || !window.history.replaceState) return;
			try {
				var url = new URL(window.location.href);
				var trimmed = value.trim();
				if (trimmed) {
					url.searchParams.set("q", trimmed);
				} else {
					url.searchParams.delete("q");
				}
				window.history.replaceState(null, "", url.toString());
			} catch (e) {}
		}

		function applyFilter(updateHistory) {
			var rawQuery = input.value;
			var trimmed = rawQuery.trim();
			var tokens = tokenize(trimmed);
			var fullNormQuery = normalizeText(trimmed);

			if (clearBtn) {
				clearBtn.hidden = rawQuery.length === 0;
			}

			if (!tokens.length) {
				var restoreFrag = document.createDocumentFragment();
				for (var i = 0; i < cards.length; i++) {
					cards[i].el.hidden = false;
					restoreFrag.appendChild(cards[i].el);
				}
				postlistEl.appendChild(restoreFrag);
				postlistEl.hidden = false;
				if (statusEl) statusEl.hidden = true;
				if (emptyEl) emptyEl.hidden = true;
				if (updateHistory) syncUrlQuery("");
				return;
			}

			var matched = [];
			var hiddenCards = [];

			for (var j = 0; j < cards.length; j++) {
				var card = cards[j];
				var s = scoreRecord(card, tokens, fullNormQuery);
				if (s > 0) {
					matched.push({ card: card, score: s });
				} else {
					card.el.hidden = true;
					hiddenCards.push(card);
				}
			}

			matched.sort(function (a, b) {
				return b.score - a.score || a.card.originalIndex - b.card.originalIndex;
			});

			var frag = document.createDocumentFragment();
			for (var m = 0; m < matched.length; m++) {
				matched[m].card.el.hidden = false;
				frag.appendChild(matched[m].card.el);
			}
			for (var h = 0; h < hiddenCards.length; h++) {
				frag.appendChild(hiddenCards[h].el);
			}
			postlistEl.appendChild(frag);

			if (statusEl) {
				var tpl = i18n.ofTotal || "Showing {n} of {total} articles";
				statusEl.textContent = tpl
					.replace("{n}", String(matched.length))
					.replace("{total}", String(totalCount));
				statusEl.hidden = false;
			}

			if (emptyEl) {
				if (matched.length === 0) {
					postlistEl.hidden = true;
					if (emptyTitleEl) {
						emptyTitleEl.textContent = (i18n.noResults || "No articles found for") + " “" + trimmed + "”";
					}
					emptyEl.hidden = false;
				} else {
					postlistEl.hidden = false;
					emptyEl.hidden = true;
				}
			}

			if (updateHistory) syncUrlQuery(trimmed);
		}

		function resetFilter() {
			input.value = "";
			applyFilter(true);
			input.focus();
		}

		input.addEventListener("input", function () {
			applyFilter(true);
		});

		input.addEventListener("keydown", function (e) {
			if (e.key === "Enter" && window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
				input.blur();
			}
		});

		if (clearBtn) {
			clearBtn.addEventListener("click", resetFilter);
		}
		if (resetBtn) {
			resetBtn.addEventListener("click", resetFilter);
		}

		try {
			var initialQuery = new URLSearchParams(window.location.search).get("q");
			if (initialQuery) {
				input.value = initialQuery;
				applyFilter(false);
			}
		} catch (e) {}
	}

	initSearchDialog();
	initBlogFilter();
})();

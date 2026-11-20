# Cloudflare QUIC 0-RTT — Follow-Up Notes

## Already Verified (2026-11-20)

All zone-level Cloudflare settings for `andreaverlicchi.eu` are already correctly enabled at the API level:

- `http3`: `"on"`
- `0rtt`: `"on"`
- `tls_1_3`: `"zrt"` (TLS 1.3 with 0-RTT)
- `min_tls_version`: `"1.2"`
- `ech`: `"on"`
- `always_use_https`: `"on"`

What `savearoundtrip.com` showed (~2.5 hours after zone activation):
- `www.andreaverlicchi.eu`, `andreaverlicchi.eu`, and `blog-11ty-dpn.pages.dev` all returned `Session resumption: yes` and `0-RTT enabled: no` (`3 of 5 done`) — meaning Cloudflare's edge sent a QUIC `NewSessionTicket` without the `early_data` (`max_early_data_size = 0xffffffff`) extension.
- For comparison, `savearoundtrip.com` itself runs on the same Cloudflare Free-tier IPs (`188.114.96.0` / `188.114.97.0`) and returns `0-RTT enabled: yes` (`5 of 5 done`).

---

## Step 1: Re-test on 2026-11-21

Open:
- https://savearoundtrip.com/?d=www.andreaverlicchi.eu

- **If it shows `5 of 5 done` (`0-RTT enabled: yes`)**: it was just new-zone edge ticket-key rollout. Nothing else to do — delete this file.
- **If it still shows `0-RTT enabled: no`**: continue to Step 2.

---

## Step 2: If Still `0-RTT enabled: no` — Move from Cloudflare Pages to Cloudflare Workers (with Static Assets)

If 0-RTT is still `no` after 24 hours, the cause is almost certainly that **Cloudflare Pages Custom Domains** route through Cloudflare's internal `pages.dev` Custom Hostname layer (`blog-11ty-dpn.pages.dev` itself has `0-RTT enabled: no`), which does not inherit zone-level `0rtt` on the Free plan.

Moving to **Cloudflare Workers with Static Assets** (Cloudflare's recommended successor to Pages) attaches directly to your zone's TLS/0-RTT configuration:

1. **Add `wrangler.jsonc` at the repository root**:
   - Point `assets.directory` to `./_site` (Workers Static Assets supports `public/_redirects` automatically, copied into `_site/_redirects` by Eleventy).
   - Add a small Worker entry point (e.g., `src/worker.js`) that handles the root `/` `Accept-Language` redirect currently in `functions/index.js`, and falls back to `env.ASSETS.fetch(request)` for all other routes.
2. **Create a Worker with Git integration**:
   - In Cloudflare Dashboard → **Workers & Pages** → **Create** → **Workers** → connect `verlok/blog-11ty`.
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
3. **Move the custom domains from Pages to the Worker**:
   - Remove `andreaverlicchi.eu` and `www.andreaverlicchi.eu` from the old `blog-11ty` Pages project (**Custom domains** tab), and remove the two `blog-11ty-dpn.pages.dev` `CNAME` records in DNS if they remain.
   - Add `andreaverlicchi.eu` and `www.andreaverlicchi.eu` under the new Worker's **Settings** → **Domains & Routes** → **Custom Domain**.
   - Keep your existing Cloudflare **Redirect Rule** (`Redirect from root to WWW`, 301).
4. **Re-test**:
   - Re-run https://savearoundtrip.com/?d=www.andreaverlicchi.eu and verify `0-RTT enabled: yes` (`5 of 5 done`).
   - Once confirmed working, delete the old `blog-11ty` Pages project.

*(Tip: you can ask Antigravity on 2026-11-21 to generate `wrangler.jsonc` + `src/worker.js` from `functions/index.js` and walk through the Cloudflare dashboard swap with you.)*

---

## Cleanup

- Delete this file (`CLOUDFLARE_0RTT_NEXT_STEPS.md`) once you're done so it isn't committed to git.

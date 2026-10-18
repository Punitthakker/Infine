# infine.

Launch storefront for **infine**, real diamonds in solid 18k gold for Gen Z, sold in limited numbered drops out of Dubai.
Drop 01: *main character energy*.

Mobile-first, static, zero build step. Plain HTML, CSS and ES modules, so it deploys anywhere that serves files.

## Screens

| Route | Screen |
| --- | --- |
| `#/` | Launch home: "stack it" hero, drop 01 countdown, drop rail, first diamond, shop by vibe, after dark teaser, ear party, proof, how they stack, campaign posters, drop alerts |
| `#/shop`, `#/shop/<category>` | Shop with category chips (tennis bracelets, tennis necklaces, ear party, black diamonds) and sorting |
| `#/p/<slug>` | Product: gallery, carat / metal / length options, edition stock meter, add to bag, perks, specs, delivery / care / returns, related pieces, sticky buy bar on mobile |
| `#/drops` | Drop 01 (live early access + public countdown), drop 02 after dark (countdown + notify), drop 03 iced out (live: ceo, the goat, jesus cross, jesus piece, skull ring, money stack) |
| `#/bag` and the bag drawer | Line items, quantity (max 2 per drop piece), promo, totals, split-in-4 |
| `#/checkout` | 3 steps: you, delivery (same day Dubai, UAE, GCC, gift option), payment (Apple Pay, card, split in 4) with validation |
| `#/order/<id>` | Order confirmation |
| `#/saved` | Wishlist |
| `#/account` | Sign in (demo), orders, drop alerts |
| `#/story` | Brand story, how a drop works, what we won't do |
| `#/guide` | Diamond 101, bracelet sizer, FAQs |
| Search overlay | Live search across the catalogue |

## Run it locally

```bash
cd infine-web
python3 -m http.server 8080      # or: npx serve .
# open http://localhost:8080
```

ES modules need to be served over http, so opening `index.html` straight from disk won't work.

## Deploy

- **Vercel**: import the repo, framework preset "Other", no build command, output directory `.` (`vercel.json` included).
- **Netlify**: drag the folder in or connect the repo; publish directory `.` (`netlify.toml` included).
- **Cloudflare Pages / GitHub Pages / S3 + CloudFront**: upload the folder as-is.

Routing is hash-based (`#/shop`), so no server rewrites are needed.

## Project structure

```
index.html                 app shell (header, tabs, bag drawer, search, toast)
assets/css/infine.css      the whole design system (tokens at the top)
assets/js/data.js          catalogue, drops, launch dates, promo codes   <- edit this most
assets/js/views.js         every screen as a template
assets/js/app.js           router, bag drawer, search, checkout logic, countdowns
assets/js/store.js         bag, wishlist, orders, alerts (localStorage for now)
assets/js/jewel.js         renders tennis bracelets, necklaces, studs, huggies, climbers as SVG
assets/js/brand.js         pixel diamond, smiley diamond mascot, dotted orbit, icons
assets/img/                Gen Z lifestyle photography (gz-*.webp)
assets/brand/              drop 01 campaign posters
docs/BRAND.md              brand system: palette, type, voice, components
```

## Before launch

These are placeholders and must be confirmed:

1. **Prices, carat weights, stone counts, edition sizes and stock** in `assets/js/data.js`.
2. **Dates** in `LAUNCH` and `DROPS` (`data.js`). The posters say `drop 01 · [date] · dubai`; the site uses 14 Nov 2026, 8pm Dubai.
3. **Product claims**: natural vs lab-grown, colour/clarity grades (F-G / VS), the certificate (lab name, e.g. IGI or GIA), "solid 18k gold only", black diamond treatment wording, returns and delivery promises. The site currently says natural diamonds and a certificate in every box.
4. **Drop 03 media**: the iced out pieces use your own product videos (`assets/video/ice-*.mp4`, trimmed, silent loops) and photos (`assets/img/ice-cross.webp`, `ice-jesus.webp`). Prices and edition sizes for these six are placeholders.
5. **Photography**: the lifestyle shots (`assets/img/gz-*.webp`) are AI-generated with Figma AI: fictional young adults in plain, unbranded clothes, no logos. The jewellery in them is illustrative, so swap in your own shoot before launch. Product tiles use the rendered pieces from `jewel.js`. The bridal and colour-stone pieces (the old "vault") now live on infine.store only.
5. **Contact**: WhatsApp number and `@infine` handle in `LAUNCH`.

## Connecting the real backend

The front end is complete; the pieces below are demo stand-ins.

| Demo today | Replace with |
| --- | --- |
| `store.js` localStorage bag and orders | Shopify Storefront API, Medusa, Saleor or a small API. Keep the same function names and `views.js` won't change. |
| Checkout payment step (no money taken) | A hosted payment page or SDK: Checkout.com, Stripe, Network International, or your own PSP. Apple Pay through the same provider. Split-in-4 through Tabby or Tamara. Never collect raw card numbers on your own server. |
| Stock (`left`) in `data.js` | Inventory from the backend, decremented on paid orders, with a short reservation while a bag is in checkout so limited drops don't oversell. |
| Drop alerts saved locally | WhatsApp Business API (Meta Cloud API, Twilio, Gupshup) or Klaviyo SMS/email. Get explicit opt-in. |
| Demo sign-in | Magic-link email auth from the commerce backend. |
| Promo code `MAINCHARACTER` (10%) | Discounts from the backend. |

## Accessibility and performance

- Mobile-first with an app-style bottom tab bar; desktop gets the top nav.
- Visible keyboard focus everywhere, `prefers-reduced-motion` turns off all animation, form errors are announced.
- Images are webp, lazy-loaded below the fold. Total page weight is mostly photography (~2 MB for the whole catalogue).

# infine. for her (infine.store)

The ladies' storefront for infine: dark, elegant and sensual, in the mood of the *Adored Edit* film.
Real diamonds in solid 18k gold: rings, stacking bands, huggies and hoops, bracelets and necklaces.

Static site, no build step: HTML, CSS and ES modules. Deploys anywhere that serves files.

## Screens

| Route | Screen |
| --- | --- |
| `#/` | Home: video hero with the same-day delivery cut-off, shop by mood, rings, shoppable "Wear it tonight" look, stacking bands, the film (with sound), huggies & hoops, necklaces look, bracelets, gifts under AED 5,000, promises, private viewing, the list |
| `#/shop/<category>[/under5k]` | Shop: Rings, Stacking bands, Huggies & hoops, Bracelets, Necklaces, plus an under-AED-5k gift filter and sorting |
| `#/p/<slug>` | Product: gallery, size or length, scarcity, gift option, Add to bag, Buy it now, delivery cut-off, details, complete-the-look bundle, you may also love |
| Bag drawer, `#/bag` | Bag with quantities, gift note, totals, pay in 4 |
| `#/checkout` | Details, delivery (same day Dubai, UAE, GCC, gift wrap and note), payment (Apple Pay, card, pay in 4) |
| `#/order/<id>` | Confirmation |
| `#/saved`, `#/account` | Wishlist, sign in and orders |
| `#/story`, `#/guide` | Our story; ring size finder, bracelet length, FAQs |
| Menu, search | Full-screen mobile menu and live search |

## Run locally

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

## Deploy

- **Netlify**: drag the folder onto app.netlify.com/drop, or connect the repo (publish directory `.`).
- **GoDaddy cPanel**: upload the contents to `public_html` (`.htaccess` is included).

### Pointing infine.store at Netlify (DNS at GoDaddy)

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `75.2.60.5` |
| CNAME | `www` | `<your-site>.netlify.app` |

Add `infine.store` under Domain management in Netlify first. HTTPS is issued automatically.

## Before launch

Placeholders to confirm, all in `assets/js/data.js` unless noted:

1. Prices, stock (`left`) and stone descriptions for every piece.
2. Claims shown on product pages: natural diamonds, F-G / VS, certificate included, solid 18k gold, 14-day returns, free same-day delivery in Dubai before 2pm, lifetime cleaning, free resizing within 30 days.
3. Promo codes `ADORED10` and `STACK10` (10% each) are demo codes.
4. Photography: rings are cropped from the CAD sheets in *Rings_5.pdf*; bands, hoops and bracelets come from the supplier catalogues; necklaces and model shots from the earlier catalogue (some carry a faint supplier watermark). Get clean originals and written permission to use them under the infine brand.
5. The hero loop is built from five AI-generated stills (Figma AI, file "infine.store hero stills"): a fictional Indian model against an unbranded Dubai Marina skyline, no logos or landmarks. The film is the *Adored Edit*.
6. WhatsApp number and private-viewing details in `BRAND`.

## Connecting the backend

The front end is complete; these are demo stand-ins:

| Demo today | Replace with |
| --- | --- |
| `store.js` localStorage bag, wishlist, orders | Shopify Storefront API, Medusa or your own API (keep the function names) |
| Payment step (no money taken) | A hosted payment page or SDK (Checkout.com, Stripe, Network International or your PSP), Apple Pay through the same provider, Tabby or Tamara for pay in 4 |
| Stock in `data.js` | Inventory from the backend |
| The list, private viewing | Klaviyo or WhatsApp Business API, with explicit opt-in |

## Structure

```
index.html              shell: veil, header, bottom bar, menu, bag drawer, search, toast
assets/css/store.css    design system (tokens at the top)
assets/js/data.js       catalogue and brand settings   <- edit this most
assets/js/views.js      every screen
assets/js/app.js        router, bag, checkout, delivery cut-off, interactions
assets/js/store.js      bag, wishlist, orders
assets/img/             product and model images (webp)
assets/video/           hero loop and the Adored Edit film
```

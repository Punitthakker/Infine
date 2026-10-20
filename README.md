# infine. commerce backend (Medusa)

This is the shop engine behind infine.world: products, edition stock, carts, orders, customers, promo codes, and the **admin dashboard** (at `/app`). The website stays on Netlify and talks to this backend through Medusa's Store API.

Built on Medusa 2.21 (open source, MIT). It needs Node 22+, PostgreSQL 15+ and, optionally, Redis.

## What's loaded

`npm run seed` runs once on a fresh database. It skips itself if any products already exist, and it loads:

- **Store and region:** `infine.`, AED, with the UAE plus the GCC (Saudi Arabia, Qatar, Kuwait, Bahrain, Oman). Prices **include** 5% UAE VAT.
- **Stock location:** "Dubai studio", with one shared stock count per piece. That count is the edition, shared across every size, metal and length of the piece.
- **Delivery:** "Same day Dubai" (free), "UAE 1-2 days" (free), "GCC express" (AED 75).
- **Catalogue:** the drops as collections, the categories, and 20 pieces with 185 variants (size x metal x length), using prices and edition counts from `src/scripts/infine-catalogue.ts`.
- **Promo:** the code `MAINCHARACTER` gives 10% off.
- **Payment:** Medusa's built-in "system" provider, which records the order as *awaiting payment*. You then send a payment link or take payment on delivery and press **Capture payment** in the admin. To take cards and Apple Pay at checkout, add Stripe or Checkout.com later.

## Put it online on Railway (about 15 minutes)

1. Sign up at **railway.com** with your GitHub account. The Hobby plan is USD 5 a month and includes USD 5 of usage. Expect roughly USD 10-20 a month in total for this backend plus its database.
2. **New Project → Deploy from GitHub repo →** `Punitthakker/infine`, branch **`medusa-backend`**.
3. In the project, click **+ New → Database → PostgreSQL**. Redis is optional, so you can skip it to save cost.
4. Open the backend service and go to **Variables**. Add:
   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
   | `JWT_SECRET` | any long random text |
   | `COOKIE_SECRET` | another long random text |
   | `NODE_ENV` | `production` |
   | `STORE_CORS` | `https://infine.world,https://www.infine.world,https://infine-1grh.netlify.app` |
   | `ADMIN_CORS` | your Railway URL, e.g. `https://infine-backend.up.railway.app` |
   | `AUTH_CORS` | the same Railway URL |
   | `MEDUSA_BACKEND_URL` | the same Railway URL |
   | `STOREFRONT_URL` | `https://infine.world` |
5. Go to **Settings → Networking → Generate Domain** to get the Railway URL, then put it in the four places above. You can later add `api.infine.world` as a custom domain.
6. Deploy. `railway.json` builds the app, runs the database migrations and starts the server. The health check is `/health`.
7. In the service, open **Shell** and run, once:
   ```bash
   cd .medusa/server && npx medusa exec ./src/scripts/seed-infine.js
   npx medusa user -e you@yourmail.com -p 'a-strong-password'
   ```
8. Open `https://<railway-url>/app`, sign in, and go to **Settings → Publishable API Keys**. Copy the key that starts with `pk_`.
9. Paste the Railway URL and the `pk_` key into the website's `assets/js/config.js` and redeploy the site. From then on, checkout creates real orders.

## Day to day, in the admin (`/app`)

- **Orders:** every order from infine.world, with the customer, WhatsApp number and payment choice (link or pay on delivery). When paid, press **Capture payment**, then **Fulfill** once shipped.
- **Products:** edit prices, descriptions and images, or add new pieces. A price change shows on the site on the next page load.
- **Inventory:** the edition count per piece. Lowering it limits the drop, and at 0 the piece shows as sold out on the site.
- **Promotions:** create or turn off codes.
- **Customers:** everyone who has ordered.

## Local development

```bash
cp .env.template .env      # point DATABASE_URL at a local Postgres
npm install
npx medusa db:migrate
npm run seed
npx medusa user -e admin@example.com -p secret
npm run dev                # http://localhost:9000/app
```

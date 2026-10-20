// Medusa connector. The site keeps its fast local bag for browsing; at checkout the bag
// becomes a real Medusa cart and order. Live prices and stock flow back into the catalogue.
// If config.js is blank, everything here is skipped and the site runs in demo mode.
import { MEDUSA } from './config.js?v=202610201241';
import { PRODUCTS } from './data.js?v=202610201241';

export const live = () => !!(MEDUSA.url && MEDUSA.publishableKey);

async function api(path, { method = 'GET', body } = {}) {
  const r = await fetch(MEDUSA.url.replace(/\/$/, '') + path, {
    method,
    headers: { 'content-type': 'application/json', 'x-publishable-api-key': MEDUSA.publishableKey },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'omit',
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.message || `request failed (${r.status})`);
  return j;
}

let regionId = null;
const catalogue = new Map(); // slug -> Medusa product

async function region() {
  if (regionId) return regionId;
  const { regions } = await api('/store/regions');
  regionId = (regions.find(r => r.currency_code === 'aed') || regions[0]).id;
  return regionId;
}

const optionTitle = (product, ov) => (product.options || []).find(o => o.id === ov.option_id)?.title?.toLowerCase();
function variantFor(slug, size, metal, length) {
  const p = catalogue.get(slug); if (!p) return null;
  return p.variants.find(v => {
    const vals = {}; (v.options || []).forEach(ov => { vals[optionTitle(p, ov)] = ov.value; });
    return vals.size === size && vals.metal === metal && vals.length === length;
  }) || null;
}

// Pull live prices and edition stock into the catalogue the views render from.
export async function sync() {
  if (!live()) return false;
  const rid = await region();
  const { products } = await api(`/store/products?limit=200&region_id=${rid}&fields=*options,*variants,*variants.options,*variants.calculated_price,+variants.inventory_quantity`);
  products.forEach(mp => catalogue.set(mp.handle, mp));
  for (const p of PRODUCTS) {
    const mp = catalogue.get(p.slug); if (!mp) continue;
    const qty = Math.max(0, ...mp.variants.map(v => v.inventory_quantity ?? 0));
    if (mp.variants.some(v => v.manage_inventory)) p.left = qty;
    for (const s of p.sizes) {
      const prices = mp.variants.filter(v => (v.options || []).some(ov => optionTitle(mp, ov) === 'size' && ov.value === s.label))
        .map(v => v.calculated_price?.calculated_amount).filter(n => typeof n === 'number');
      if (prices.length) s.price = Math.min(...prices);
    }
  }
  return true;
}

const COUNTRY = { 'Saudi Arabia': 'sa', Qatar: 'qa', Kuwait: 'kw', Bahrain: 'bh', Oman: 'om' };
const SHIP_NAME = { dxb: 'same day dubai', uae: 'uae 1-2 days', gcc: 'gcc express' };

// Turn the local bag into a Medusa order. Returns { id, total }.
export async function checkout(items, f, promo) {
  if (!catalogue.size) await sync();
  const rid = await region();
  const { cart } = await api('/store/carts', { method: 'POST', body: { region_id: rid, email: f.email } });
  for (const it of items) {
    const v = variantFor(it.slug, it.size, it.metal, it.length);
    if (!v) throw new Error(`${it.slug} (${it.size}, ${it.metal}, ${it.length}) isn't available right now.`);
    await api(`/store/carts/${cart.id}/line-items`, { method: 'POST', body: { variant_id: v.id, quantity: it.qty } });
  }
  const address = {
    first_name: f.first, last_name: f.last, phone: f.phone,
    address_1: f.addr, address_2: f.apt || '', city: f.area, province: f.emirate || 'Dubai',
    country_code: COUNTRY[f.emirate] || 'ae',
  };
  await api(`/store/carts/${cart.id}`, { method: 'POST', body: {
    email: f.email, shipping_address: address, billing_address: address,
    metadata: { gift: !!f.gift, gift_note: f.note || '', payment_choice: f.pay || '', whatsapp: f.phone },
  } });
  if (promo) await api(`/store/carts/${cart.id}/promotions`, { method: 'POST', body: { promo_codes: [promo] } }).catch(() => {});
  const { shipping_options } = await api(`/store/shipping-options?cart_id=${cart.id}`);
  const want = SHIP_NAME[f.ship || 'dxb'];
  const opt = shipping_options.find(o => o.name.toLowerCase() === want) || shipping_options[0];
  if (!opt) throw new Error('no delivery option for that address.');
  await api(`/store/carts/${cart.id}/shipping-methods`, { method: 'POST', body: { option_id: opt.id } });
  const { payment_collection } = await api('/store/payment-collections', { method: 'POST', body: { cart_id: cart.id } });
  await api(`/store/payment-collections/${payment_collection.id}/payment-sessions`, { method: 'POST', body: { provider_id: 'pp_system_default' } });
  const done = await api(`/store/carts/${cart.id}/complete`, { method: 'POST' });
  if (done.type !== 'order') throw new Error(done.error?.message || 'the order could not be completed.');
  return { id: 'INF-' + done.order.display_id, total: done.order.total, medusaId: done.order.id };
}

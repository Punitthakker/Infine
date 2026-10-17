// Screens for infine.store. Each returns an HTML string; app.js wires behaviour.
import { PRODUCTS, CATEGORIES, BRAND, bySlug, inCat, catOf } from './data.js';
import * as S from './store.js';

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const aed = n => 'AED ' + Math.round(n).toLocaleString('en-US');
const IMG = s => `assets/img/${s}.webp`;

export const ICON = {
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M5 8h14l-1.1 12H6.1z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M4 11l8-6 8 6v9H4z"/></svg>',
  shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M7 4h10l4 5-9 11L3 9z"/><path d="M3 9h18"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
  cert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><rect x="4" y="3" width="16" height="13" rx="1"/><path d="M8 8h8M8 11h5"/><path d="M10 16l-1 5 3-2 3 2-1-5"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><rect x="4" y="9" width="16" height="11"/><path d="M3 9h18M12 9v11M12 9c-2-4-6-4-6-1.5S12 9 12 9zm0 0c2-4 6-4 6-1.5S12 9 12 9z"/></svg>',
  swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>',
  gold: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M3 18l3-8h12l3 8z"/><path d="M8 10l2-5h4l2 5"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg>',
};

export function tile(m, alt = '', eager = false, extra = '') {
  return `<div class="tile tile--${m.tone}">${`<img src="${IMG(m.img)}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`}${extra}</div>`;
}
export function card(p, eager = false) {
  const tag = p.tags?.includes('new') ? 'New' : p.tags?.includes('bestseller') ? 'Bestseller' : '';
  const alt = p.media[1] ? `<img class="alt" src="${IMG(p.media[1].img)}" alt="" loading="lazy">` : '';
  return `<article class="card">
    <a href="#/p/${p.slug}" aria-label="${esc(p.name)}">${tile(p.media[0], `${p.name}, ${p.metal}`, eager, alt)}</a>
    ${tag ? `<span class="card__tag">${tag}</span>` : ''}
    <button class="card__wish" data-act="wish" data-slug="${p.slug}" aria-pressed="${S.isWished(p.slug)}" aria-label="Save ${esc(p.name)}">${ICON.heart}</button>
    <button class="card__add" data-act="quick" data-slug="${p.slug}" aria-label="Add ${esc(p.name)} to bag">+<span> Add to bag</span></button>
    <a class="card__info" href="#/p/${p.slug}">
      <span class="card__name">${esc(p.name)}</span>
      <span class="price">${aed(p.price)}</span><span class="card__metal">${esc(p.metal)}</span>
      ${p.left <= 3 ? `<span class="card__left">Only ${p.left} left</span>` : ''}
    </a>
  </article>`;
}
const cutoff = () => `<p class="cutoff"><span>Order within <b data-cutoff-t>--</b> <span data-cutoff-w>for same-day delivery in Dubai</span></span></p>`;

/* ================= HOME ================= */
export function home() {
  const rings = inCat('rings'), bands = inCat('bands'), hoops = inCat('earrings'), brc = inCat('bracelets'), neck = inCat('necklaces');
  const moods = [
    ['necklaces', { img: 'model-fringe-tall', tone: 'photo' }, 'Necklaces'],
    ['rings', { img: 'ring-014', tone: 'dark' }, 'Rings'],
    ['earrings', { img: 'hoop-017', tone: 'light' }, 'Huggies & hoops'],
    ['bands', { img: 'band-1_11', tone: 'light' }, 'Stacking bands'],
    ['bracelets', { img: 'brc-01_00', tone: 'light' }, 'Bracelets'],
  ].map(([id, m, l]) => `<a class="mood tile--${m.tone}" href="#/shop/${id}" style="${m.tone === 'dark' ? 'background:#000' : ''}"><img src="${IMG(m.img)}" alt="" loading="lazy"><b>${l}</b><small>${inCat(id).length} pieces</small></a>`).join('');
  const spot = (x, y, slug) => { const p = bySlug(slug); return `<button class="spot" style="left:${x}%;top:${y}%" data-act="spot" aria-expanded="false" aria-label="Shop ${esc(p.name)}">+<a class="spot__card" href="#/p/${slug}"><img src="${IMG(p.media[0].img)}" alt=""><span><span class="card__name" style="font-size:18px;display:block">${esc(p.name)}</span><span class="price">${aed(p.price)}</span><br><span class="link" style="font-size:11px">Shop now</span></span></a></button>`; };
  return `
  <section class="hero">
    <div class="hero__media">
      <video autoplay muted loop playsinline preload="auto" poster="assets/video/hero-poster.jpg" aria-hidden="true"><source src="assets/video/hero.mp4" type="video/mp4"></video>
    </div>
    <div class="wrap hero__in">
      <p class="kicker">${BRAND.edit} · ${BRAND.city}</p>
      <h1 class="h-hero"><span class="ln"><span>Made to be</span></span><span class="ln"><span>adored.</span></span></h1>
      <p class="lede">Real diamonds in solid 18k gold, for the woman who doesn't wait to be given them.</p>
      <div class="hero__ctas"><a class="btn btn--gold" href="#/shop">Shop the edit</a><a class="btn btn--line" href="#film">Watch the film</a></div>
      ${cutoff()}
    </div>
  </section>
  <div class="marq" aria-hidden="true"><div class="marq__run">${Array(2).fill(['Rings', 'Stacking bands', 'Huggies & hoops', 'Tennis bracelets', 'Necklaces', 'Made to be adored'].map(w => `<span>${w}</span>`).join('')).join('')}</div></div>

  <section class="sec"><div class="wrap sec__in">
    <div class="sec__head"><div><p class="kicker">Shop by mood</p><h2 class="h2">What are you <span class="it">in the mood for?</span></h2></div></div>
    <div class="moods">${moods}</div>
  </div></section>

  <section class="sec" style="background:#000"><div class="wrap sec__in">
    <div class="sec__head"><div><p class="kicker">Rings</p><h2 class="h2">Say yes <span class="it">to yourself.</span></h2></div><a class="link" href="#/shop/rings">All rings</a></div>
    <div class="rail">${rings.map((p, i) => card(p, i < 2)).join('')}</div>
  </div></section>

  <section class="sec"><div class="wrap look">
    <div class="look__pic"><img src="${IMG('model-fringe-tall')}" alt="The Fringe Riviera, worn" loading="lazy">${spot(52, 58, 'fringe-riviera')}</div>
    <div class="look__copy">
      <p class="kicker">Tonight</p>
      <h2 class="h1">Wear it <span class="it">tonight.</span></h2>
      <p class="lede">Order before 2pm and it's at your door in Dubai the same day, gift-wrapped, with a handwritten note if you want one. Tap the necklace to shop it.</p>
      <div><a class="btn btn--gold" href="#/p/fringe-riviera">Shop the Fringe Riviera</a></div>
    </div>
  </div></section>

  <section class="sec" style="background:var(--noir-2)"><div class="wrap sec__in">
    <div class="sec__head"><div><p class="kicker">Stacking bands</p><h2 class="h2">Stack your <span class="it">stories.</span></h2><p class="lede">Rose gold bands made to be worn three at a time. Take two and use STACK10 for 10% off.</p></div><a class="link" href="#/shop/bands">All bands</a></div>
    <div class="grid">${bands.slice(0, 8).map(p => card(p)).join('')}</div>
  </div></section>

  <section class="sec" id="film"><div class="wrap film">
    <div class="film__frame">
      <video preload="none" playsinline poster="assets/video/film-poster.jpg" data-film><source src="assets/video/film.mp4" type="video/mp4"></video>
      <button class="film__play" data-act="film" aria-label="Play the film with sound"><span>${ICON.play}</span></button>
    </div>
    <div style="display:grid;gap:20px">
      <p class="kicker">The film</p>
      <h2 class="h1">${esc(BRAND.edit)}.</h2>
      <p class="lede">Sixty seconds of emeralds, rubies, sapphires and a lot of light. Turn the sound on.</p>
      <div><a class="btn btn--line" href="#/shop/necklaces">Shop the necklaces</a></div>
    </div>
  </div></section>

  <section class="sec" style="background:var(--noir-2)"><div class="wrap sec__in">
    <div class="sec__head"><div><p class="kicker">Huggies & hoops</p><h2 class="h2">Close <span class="it">to you.</span></h2></div><a class="link" href="#/shop/earrings">All earrings</a></div>
    <div class="rail">${hoops.map(p => card(p)).join('')}</div>
  </div></section>

  <section class="sec"><div class="wrap look look--rev">
    <div class="look__pic"><img src="${IMG('model-emerald-long-tall')}" alt="Emerald necklace, worn" loading="lazy">${spot(50, 62, 'emerald-drop')}</div>
    <div class="look__copy">
      <p class="kicker">Necklaces</p>
      <h2 class="h1">Made to be <span class="it">noticed.</span></h2>
      <p class="lede">Rivieras, rubies, emeralds, one very serious choker. Pieces for the nights you'll still be talking about next year.</p>
      <div class="rail" style="grid-auto-columns:min(42vw,200px)">${neck.slice(0, 6).map(p => card(p)).join('')}</div>
    </div>
  </div></section>

  <section class="sec" style="background:var(--noir-2)"><div class="wrap sec__in">
    <div class="sec__head"><div><p class="kicker">Bracelets</p><h2 class="h2">Something <span class="it">for the wrist.</span></h2></div><a class="link" href="#/shop/bracelets">All bracelets</a></div>
    <div class="grid">${brc.slice(0, 8).map(p => card(p)).join('')}</div>
  </div></section>

  <section class="sec"><div class="wrap sec__in">
    <div class="sec__head"><div><p class="kicker">Gifts under AED 5,000</p><h2 class="h2">Go on. <span class="it">You've earned it.</span></h2></div><a class="link" href="#/shop/all/under5k">See all</a></div>
    <div class="rail">${PRODUCTS.filter(p => p.price < 5000).sort((a, b) => a.price - b.price).map(p => card(p)).join('')}</div>
  </div></section>

  <div class="promise">
    <div>${ICON.cert}<b>Real diamonds</b><span>Graded and certified, with the certificate in the box.</span></div>
    <div>${ICON.gold}<b>Solid 18k gold</b><span>White, yellow or rose. Never plated.</span></div>
    <div>${ICON.truck}<b>Same day in Dubai</b><span>Order before 2pm. Free, insured, signed for.</span></div>
    <div>${ICON.gift}<b>Gift-wrapped</b><span>Every order, with a handwritten note if you like.</span></div>
    <div>${ICON.swap}<b>14-day returns</b><span>Free across the UAE.</span></div>
  </div>

  <section class="viewing">
    <img src="${IMG('model-ruby-tall')}" alt="" loading="lazy">
    <div class="wrap viewing__in">
      <p class="kicker">Private viewing</p>
      <h2 class="h1">Try it on <span class="it">in person.</span></h2>
      <p class="lede">Book a private appointment in Dubai, at our studio or at home. Champagne optional, sparkle guaranteed.</p>
      <p class="h3" style="color:var(--champagne-2)">WhatsApp ${BRAND.whatsapp}</p>
    </div>
  </section>

  <section class="sec"><div class="wrap sec__in" style="justify-items:center;text-align:center">
    <p class="kicker">The list</p>
    <h2 class="h2">Be the first <span class="it">to know.</span></h2>
    <p class="lede">New pieces, private sales and the occasional love letter. Never more than twice a month.</p>
    ${S.me() ? '' : ''}<form class="inline" data-form="list" novalidate style="justify-content:center"><label class="sr" for="li-email">Email or WhatsApp</label><input class="input" id="li-email" name="c" placeholder="Email or WhatsApp number" autocomplete="email"><button class="btn btn--gold" type="submit">Join the list</button><p class="err" aria-live="polite" style="width:100%"></p></form>
  </div></section>`;
}

/* ================= SHOP ================= */
export function shop(cat = 'all', filter = '', sort = 'featured') {
  let ps = inCat(cat);
  if (filter === 'under5k') ps = ps.filter(p => p.price < 5000);
  if (filter === 'new') ps = ps.filter(p => p.tags?.includes('new'));
  if (sort === 'low') ps = [...ps].sort((a, b) => a.price - b.price);
  if (sort === 'high') ps = [...ps].sort((a, b) => b.price - a.price);
  const c = catOf(cat) || CATEGORIES[0];
  return `<div class="wrap">
    <header class="pagehead"><p class="kicker">${filter === 'under5k' ? 'Gifts under AED 5,000' : esc(BRAND.edit)}</p><h1 class="h1">${c.id === 'all' ? '<span class="it">The</span> Collection' : esc(c.label)}</h1>${c.line ? `<p class="lede it" style="font-family:var(--serif);font-size:24px;color:var(--champagne-2)">${esc(c.line)}</p>` : ''}</header>
    <div class="toolbar">
      <div class="chips" role="group" aria-label="Category">${CATEGORIES.map(x => `<a class="chip" href="#/shop/${x.id}${filter ? '/' + filter : ''}" aria-pressed="${x.id === cat}">${x.label}</a>`).join('')}
        <a class="chip" href="#/shop/${cat}${filter === 'under5k' ? '' : '/under5k'}" aria-pressed="${filter === 'under5k'}">Under AED 5k</a></div>
      <span class="small muted">${ps.length} pieces</span>
      <label class="sr" for="sort">Sort</label>
      <select class="select" id="sort" data-act="sort">${[['featured', 'Featured'], ['low', 'Price, low to high'], ['high', 'Price, high to low']].map(([v, l]) => `<option value="${v}"${v === sort ? ' selected' : ''}>${l}</option>`).join('')}</select>
    </div>
    <div class="grid" style="padding-block:24px 80px">${ps.map((p, i) => card(p, i < 2)).join('')}</div>
  </div>`;
}

/* ================= PRODUCT ================= */
const PAIR = { rings: 'bands', bands: 'rings', earrings: 'necklaces', bracelets: 'earrings', necklaces: 'earrings' };
export function product(slug, sel = {}) {
  const p = bySlug(slug); if (!p) return notFound();
  const size = sel.size || (p.sizes.length === 1 ? p.sizes[0] : '');
  const g = S.gift();
  const slides = p.media;
  const pair = inCat(PAIR[p.cat]).filter(x => x.price <= p.price * 1.2).sort((a, b) => b.tags?.includes('bestseller') - a.tags?.includes('bestseller'))[0];
  const related = inCat(p.cat).filter(x => x.slug !== p.slug).slice(0, 8);
  const sizeLabel = p.cat === 'rings' || p.cat === 'bands' ? 'Ring size (US)' : p.cat === 'bracelets' ? 'Length' : p.cat === 'necklaces' ? 'Length' : 'Option';
  return `<div class="wrap">
  <div class="pdp">
    <div>
      <div class="gal" data-gal>${slides.map((m, i) => tile(m, `${p.name} view ${i + 1}`, i === 0)).join('')}</div>
      ${slides.length > 1 ? `<div class="dots" aria-hidden="true">${slides.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>` : ''}
    </div>
    <div class="buy">
      <div class="buy__title">
        <p class="kicker">${esc(catOf(p.cat).label)}</p>
        <h1 class="h1" style="font-size:clamp(44px,6vw,72px)">${esc(p.name)}</h1>
        <p class="muted">${esc(p.metal)} · ${esc(p.stones)}</p>
        <p class="buy__price">${aed(p.price)}</p>
        <p class="split">Or 4 interest-free payments of ${aed(p.price / 4)}</p>
      </div>
      <p style="font-family:var(--serif);font-size:21px;line-height:1.5;font-weight:300">${esc(p.story)}</p>
      ${p.sizes.length > 1 ? `<div class="optgroup"><span>${sizeLabel}${p.cat === 'rings' || p.cat === 'bands' ? ' <a class="link" style="font-size:11px" href="#/guide">Find your size</a>' : ''}</span><div class="optrow">${p.sizes.map(s => `<button class="opt" data-act="size" data-v="${esc(s)}" aria-pressed="${s === size}">${esc(s)}</button>`).join('')}</div><p class="err" data-size-err aria-live="polite"></p></div>` : ''}
      ${p.left <= 5 ? `<p class="scarcity">Only ${p.left} left in this edition.</p>` : ''}
      <label class="giftbox"><input type="checkbox" data-act="gift" ${g.on ? 'checked' : ''}><div><b style="font-weight:500">Make it a gift</b><small>Signature box, handwritten note, no prices inside.</small></div></label>
      <div style="display:grid;gap:10px">
        <button class="btn btn--gold btn--block" data-act="add" data-slug="${p.slug}">Add to bag</button>
        <button class="btn btn--line btn--block" data-act="buynow" data-slug="${p.slug}">Buy it now</button>
        <button class="btn btn--block btn--sm" data-act="wish" data-slug="${p.slug}" aria-pressed="${S.isWished(p.slug)}" style="color:var(--mute)">${S.isWished(p.slug) ? 'Saved to your wishlist' : 'Save for later'}</button>
      </div>
      ${cutoff()}
      <div class="perks">
        <div>${ICON.truck}Free same-day delivery in Dubai, insured and signed for</div>
        <div>${ICON.cert}Diamond certificate included</div>
        <div>${ICON.swap}14-day free returns across the UAE</div>
      </div>
      <div>
        <details class="acc" open><summary>Details</summary><div><table class="specs"><tbody><tr><th>Metal</th><td>${esc(p.metal)}</td></tr><tr><th>Stones</th><td>${esc(p.stones)}</td></tr><tr><th>Diamonds</th><td>Natural, F-G colour, VS clarity</td></tr><tr><th>Certificate</th><td>Included</td></tr></tbody></table></div></details>
        <details class="acc"><summary>Delivery & returns</summary><div><p>Dubai: same day if you order before 2pm, free. Rest of the UAE: 1-2 days, free. GCC: 3-5 days.</p><p>Free returns within 14 days, unworn, with the certificate and box. Resized and engraved pieces are final sale.</p></div></details>
        <details class="acc"><summary>Care</summary><div><p>Take it off for the gym, the pool and the beach. Warm water, mild soap, a soft brush. We clean and check your pieces for free, for life.</p></div></details>
      </div>
    </div>
  </div>
  ${pair ? `<section class="together"><p class="kicker">Complete the look</p><h2 class="h3">${esc(p.name)} <span class="it muted">with</span> ${esc(pair.name)}</h2>
    <div class="together__pics">${tile(p.media[0], p.name)}<b>+</b>${tile(pair.media[0], pair.name)}</div>
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between"><p class="buy__price">${aed(p.price + pair.price)}</p><button class="btn btn--gold" data-act="pair" data-a="${p.slug}" data-b="${pair.slug}">Add both to bag</button></div></section>` : ''}
  ${related.length ? `<section class="sec__in" style="padding-block:56px 80px"><h2 class="h2">You may <span class="it">also love</span></h2><div class="rail">${related.map(x => card(x)).join('')}</div></section>` : ''}
  </div>
  <div class="stickybuy" data-sticky><div style="display:grid;min-width:0"><span class="card__name" style="font-size:18px">${esc(p.name)}</span><span class="price muted">${aed(p.price)}</span></div><button class="btn btn--gold" data-act="add" data-slug="${p.slug}">Add to bag</button></div>`;
}

/* ================= BAG ================= */
export function bagItems() {
  const items = S.bag();
  if (!items.length) return `<div class="empty"><p class="h3 it">Your bag is waiting<br>for something beautiful.</p><a class="btn btn--gold btn--sm" href="#/shop" data-act="close-bag">Shop the edit</a></div>`;
  return items.map(it => { const { p, total } = S.lineOf(it); return `<div class="li"><a href="#/p/${p.slug}" data-act="close-bag">${tile(p.media[0], p.name)}</a>
    <div class="li__info"><div class="li__top"><a class="li__name" href="#/p/${p.slug}" data-act="close-bag">${esc(p.name)}</a><span class="price">${aed(total)}</span></div>
    <span class="small muted">${esc(p.metal)}${it.size && it.size !== 'Pair' ? ' · ' + esc(it.size) : ''}</span>
    <div style="display:flex;justify-content:space-between;align-items:center"><div class="qty"><button data-act="qty" data-key="${esc(it.key)}" data-d="-1" aria-label="One less">−</button><span>${it.qty}</span><button data-act="qty" data-key="${esc(it.key)}" data-d="1" aria-label="One more">+</button></div>
    <button class="small muted" data-act="qty" data-key="${esc(it.key)}" data-d="-9" style="text-decoration:underline">Remove</button></div></div></div>`; }).join('');
}
export function bagFoot() {
  const t = S.totals(), g = S.gift(); if (!t.count) return '';
  return `<p class="note">${g.on ? 'Gift-wrapped with a handwritten note. ' : ''}Free same-day delivery in Dubai when you order before 2pm.</p>
    <div class="sum"><span>Subtotal</span><span>${aed(t.sub)}</span></div>
    ${t.off ? `<div class="sum"><span>Code ${esc(t.code)}</span><span>−${aed(t.off)}</span></div>` : ''}
    <div class="sum total"><span>Total</span><span>${aed(t.total)}</span></div>
    <a class="btn btn--gold btn--block" href="#/checkout" data-act="close-bag">Checkout</a>
    <p class="split" style="text-align:center">Or 4 interest-free payments of ${aed(t.total / 4)}</p>`;
}
export const bagPage = () => `<div class="wrap" style="max-width:760px;padding-bottom:80px"><header class="pagehead"><h1 class="h1">Your <span class="it">bag</span></h1></header><div data-bag-body>${bagItems()}</div><div data-bag-foot style="display:grid;gap:12px;padding-top:18px">${bagFoot()}</div></div>`;

/* ================= CHECKOUT ================= */
export function checkout(step = 1, f = {}) {
  const t = S.totals(), g = S.gift();
  if (!t.count) return `<div class="wrap"><div class="empty"><h1 class="h2 it">Nothing to check out yet.</h1><a class="btn btn--gold" href="#/shop">Shop the edit</a></div></div>`;
  const v = k => esc(f[k] || ''), ship = { dxb: 0, uae: 0, gcc: 95 }[f.ship || 'dxb'];
  const steps = ['Details', 'Delivery', 'Payment'].map((s, i) => `<span class="${i + 1 === step ? 'on' : i + 1 < step ? 'done' : ''}">${i + 1}. ${s}</span>`).join('');
  let body = '';
  if (step === 1) body = `<form class="panel" data-form="co" data-step="1" novalidate><h2 class="h3">Your details</h2><div class="fgrid">
    <div class="field"><label for="fn">First name</label><input class="input" id="fn" name="first" autocomplete="given-name" value="${v('first')}"></div>
    <div class="field"><label for="ln">Last name</label><input class="input" id="ln" name="last" autocomplete="family-name" value="${v('last')}"></div>
    <div class="field full"><label for="em">Email</label><input class="input" id="em" name="email" type="email" autocomplete="email" value="${v('email')}"></div>
    <div class="field full"><label for="ph">Mobile, for delivery updates on WhatsApp</label><input class="input" id="ph" name="phone" type="tel" autocomplete="tel" placeholder="+971" value="${v('phone')}"></div></div>
    <p class="err" aria-live="polite"></p><button class="btn btn--gold btn--block" type="submit">Continue to delivery</button></form>`;
  if (step === 2) body = `<form class="panel" data-form="co" data-step="2" novalidate><h2 class="h3">Where should we deliver?</h2><div class="fgrid">
    <div class="field full"><label for="ad">Building and street</label><input class="input" id="ad" name="addr" autocomplete="address-line1" value="${v('addr')}"></div>
    <div class="field"><label for="apt">Apartment / villa</label><input class="input" id="apt" name="apt" autocomplete="address-line2" value="${v('apt')}"></div>
    <div class="field"><label for="ar">Area</label><input class="input" id="ar" name="area" value="${v('area')}"></div>
    <div class="field full"><label for="emi">Emirate / country</label><select class="input" id="emi" name="emirate" style="background:transparent">${['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman'].map(e => `<option${f.emirate === e ? ' selected' : ''}>${e}</option>`).join('')}</select></div></div>
    <div style="display:grid;gap:8px">${[['dxb', 'Same day in Dubai', 'Order before 2pm · insured · signed for', 'Free'], ['uae', 'Rest of the UAE', '1-2 days · insured', 'Free'], ['gcc', 'GCC express', '3-5 days · duties shown before you pay', aed(95)]].map(([val, a, b, c]) => `<label class="radio"><input type="radio" name="ship" value="${val}"${(f.ship || 'dxb') === val ? ' checked' : ''}><div><b style="font-weight:500">${a}</b><small>${b}</small></div><span class="price">${c}</span></label>`).join('')}</div>
    <label class="giftbox"><input type="checkbox" name="gift" ${g.on ? 'checked' : ''}><div><b style="font-weight:500">Make it a gift</b><small>Signature box, no prices inside.</small></div></label>
    <div class="field"><label for="gn">Gift note (optional)</label><input class="input" id="gn" name="note" maxlength="160" value="${esc(g.note)}" placeholder="For you, because you deserve it"></div>
    <p class="err" aria-live="polite"></p><div style="display:flex;gap:10px"><button class="btn btn--line btn--sm" type="button" data-act="back">Back</button><button class="btn btn--gold" style="flex:1" type="submit">Continue to payment</button></div></form>`;
  if (step === 3) body = `<form class="panel" data-form="co" data-step="3" novalidate><h2 class="h3">Payment</h2><div style="display:grid;gap:8px">
    ${[['apple', 'Apple Pay', 'Face ID and done'], ['card', 'Card', 'Visa, Mastercard, Amex · 3D Secure'], ['split', 'Pay in 4', `${aed((t.total + ship) / 4)} today, then every two weeks, 0% interest`]].map(([val, a, b]) => `<label class="radio"><input type="radio" name="pay" value="${val}"${(f.pay || 'card') === val ? ' checked' : ''}><div><b style="font-weight:500">${a}</b><small>${b}</small></div></label>`).join('')}</div>
    <div class="fgrid" data-cardf><div class="field full"><label for="cn">Card number</label><input class="input" id="cn" name="cardno" inputmode="numeric" autocomplete="cc-number" placeholder="4242 4242 4242 4242"></div>
    <div class="field"><label for="ce">Expiry</label><input class="input" id="ce" name="exp" autocomplete="cc-exp" placeholder="MM / YY"></div><div class="field"><label for="cv">CVC</label><input class="input" id="cv" name="cvc" inputmode="numeric" autocomplete="cc-csc" placeholder="123"></div></div>
    <p class="small muted">Demo checkout: no payment is taken yet.</p><p class="err" aria-live="polite"></p>
    <div style="display:flex;gap:10px"><button class="btn btn--line btn--sm" type="button" data-act="back">Back</button><button class="btn btn--gold" style="flex:1" type="submit">Pay ${aed(t.total + ship)}</button></div></form>`;
  const items = S.bag().map(it => { const { p, total } = S.lineOf(it); return `<div class="li" style="grid-template-columns:64px 1fr">${tile(p.media[0], p.name)}<div class="li__info"><div class="li__top"><span class="li__name" style="font-size:18px">${esc(p.name)}${it.qty > 1 ? ' × ' + it.qty : ''}</span><span class="price">${aed(total)}</span></div><span class="small muted">${esc(p.metal)}${it.size && it.size !== 'Pair' ? ' · ' + esc(it.size) : ''}</span></div></div>`; }).join('');
  return `<div class="wrap"><div class="co">
    <div style="display:grid;gap:18px;align-content:start"><a class="link" href="#/bag" style="justify-self:start">Back to bag</a><h1 class="h1">Checkout</h1><div class="steps">${steps}</div>${body}</div>
    <aside class="panel"><h2 class="h3">Your order</h2><div>${items}</div>
      <form class="inline" data-form="promo" novalidate><label class="sr" for="promo">Promo code</label><input class="input" id="promo" name="code" placeholder="Promo code" value="${esc(t.code)}"><button class="btn btn--line btn--sm" type="submit">Apply</button><p class="err" aria-live="polite" style="width:100%"></p></form>
      <div class="sum"><span>Subtotal</span><span>${aed(t.sub)}</span></div>${t.off ? `<div class="sum"><span>Code ${esc(t.code)}</span><span>−${aed(t.off)}</span></div>` : ''}
      <div class="sum"><span>Delivery</span><span>${ship ? aed(ship) : 'Free'}</span></div>${g.on ? '<div class="sum"><span>Gift wrapping</span><span>Complimentary</span></div>' : ''}
      <div class="sum total"><span>Total</span><span>${aed(t.total + ship)}</span></div></aside></div></div>`;
}
export function done(id) {
  const o = S.orders().find(x => x.id === id); if (!o) return notFound();
  return `<div class="wrap"><div class="done">
    <p class="kicker">Order ${esc(o.id)}</p><h1 class="h-hero" style="font-size:clamp(56px,12vw,130px)">It's yours.</h1>
    <p class="lede">Thank you, ${esc(o.details.first)}. Your confirmation is on its way to ${esc(o.details.email)}, and we'll message ${esc(o.details.phone)} on WhatsApp the moment it's out for delivery.</p>
    <div class="panel" style="width:min(100%,520px)">${o.items.map(it => { const { p, total } = S.lineOf(it); return `<div class="sum" style="color:var(--text)"><span>${esc(p.name)}${it.qty > 1 ? ' × ' + it.qty : ''}</span><span>${aed(total)}</span></div>`; }).join('')}<div class="sum total"><span>Paid</span><span>${aed(o.total + (o.details.shipCost || 0))}</span></div></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn--gold" href="#/shop">Keep shopping</a><a class="btn btn--line" href="#/account">Your orders</a></div></div></div>`;
}

/* ================= SAVED / ACCOUNT ================= */
export function saved() {
  const ps = S.wish().map(bySlug).filter(Boolean);
  return `<div class="wrap" style="padding-bottom:80px"><header class="pagehead"><h1 class="h1">Your <span class="it">wishlist</span></h1></header>
  ${ps.length ? `<div class="grid">${ps.map(p => card(p)).join('')}</div>` : `<div class="empty"><p class="h3 it">Nothing saved yet.<br>Tap the heart on anything you love.</p><a class="btn btn--gold btn--sm" href="#/shop">Shop the edit</a></div>`}</div>`;
}
export function account() {
  const u = S.me(), os = S.orders();
  if (!u) return `<div class="wrap"><div class="acct"><h1 class="h1">Sign <span class="it">in</span></h1><p class="lede">Track orders, keep your wishlist on every device, and get early access to new pieces.</p>
    <form class="panel" data-form="signin" novalidate><div class="field"><label for="sn">Name</label><input class="input" id="sn" name="name" autocomplete="name"></div><div class="field"><label for="se">Email</label><input class="input" id="se" name="email" type="email" autocomplete="email"></div><p class="err" aria-live="polite"></p><button class="btn btn--gold btn--block" type="submit">Send me a sign-in link</button><p class="small muted">Demo: signs you in on this device.</p></form></div></div>`;
  return `<div class="wrap"><div class="acct"><p class="kicker">Welcome back</p><h1 class="h1">${esc(u.name.split(' ')[0])}<span class="it">.</span></h1>
    <section><h2 class="h3">Orders</h2>${os.length ? os.map(o => `<a class="orow" href="#/order/${o.id}"><span>${esc(o.id)}<br><span class="muted">${new Date(o.at).toLocaleDateString('en-GB')}</span></span><span>${aed(o.total)}<br><span style="color:var(--champagne)">Confirmed</span></span></a>`).join('') : '<p class="muted" style="padding-top:8px">No orders yet.</p>'}</section>
    <button class="btn btn--line btn--sm" data-act="signout" style="justify-self:start">Sign out</button></div></div>`;
}

/* ================= STORY / GUIDE ================= */
export function story() {
  return `<section class="hero" style="min-height:70vh"><div class="hero__media"><img src="${IMG('model-diamond-tall')}" alt=""></div>
    <div class="wrap hero__in"><p class="kicker">Our story</p><h1 class="h-hero" style="font-size:clamp(56px,12vw,140px)"><span class="ln"><span>For the woman</span></span><span class="ln"><span>who knows.</span></span></h1></div></section>
  <section class="sec"><div class="wrap pair"><div class="prose">
    <p>infine. began with a simple idea: the most beautiful diamonds shouldn't wait for someone else to give them to you.</p>
    <p>Every piece is made in solid 18k gold and set with natural diamonds, graded and certified. We design for real life in Dubai: the brunch, the boardroom, the rooftop, the moment you catch your own reflection and smile.</p>
    <p>We make in small editions, so what you wear feels like yours. When a piece is gone, it's gone.</p></div>
    <div class="tile tile--photo"><img src="${IMG('model-emerald-tall')}" alt="" loading="lazy"></div></div></section>`;
}
export function guide() {
  return `<div class="wrap" style="padding-bottom:80px"><header class="pagehead"><p class="kicker">Care & sizing</p><h1 class="h1">Find your <span class="it">fit.</span></h1></header>
  <section class="pair" style="padding-block:24px 56px"><div class="panel sizer" style="gap:16px"><h2 class="h3">Ring size finder</h2>
    <label for="circ" class="small muted">Wrap a strip of paper around your finger and measure it in millimetres</label>
    <input type="range" id="circ" min="44" max="62" step="0.5" value="51.5" data-act="circ">
    <p class="small muted" data-circ-out>51.5 mm around</p><output for="circ" data-circ-size>US 6</output>
    <p class="small muted">Between sizes? Go up. Rings are resized free within 30 days.</p></div>
  <div class="panel sizer" style="gap:16px"><h2 class="h3">Bracelet length</h2>
    <label for="wrist" class="small muted">Your wrist, measured snugly, in centimetres</label>
    <input type="range" id="wrist" min="13" max="20" step=".5" value="15.5" data-act="wrist">
    <p class="small muted" data-wrist-out>Wrist 15.5 cm</p><output for="wrist" data-wrist-size>6.5"</output></div></section>
  <section style="max-width:760px">${[['Are your diamonds real?', 'Yes. Natural diamonds, graded F-G colour and VS clarity, set in solid 18k gold. A certificate comes with every piece.'], ['How fast is delivery?', 'Same day in Dubai when you order before 2pm. 1-2 days across the UAE, 3-5 days to the GCC. Always insured and signed for.'], ['Can I return it?', 'Within 14 days, unworn, with the certificate and box. Free across the UAE. Resized and engraved pieces are final sale.'], ['How do I care for my jewellery?', 'Take it off for the gym, the pool and the beach. Clean with warm water, mild soap and a soft brush. We clean and check your pieces for free, for life.'], ['Can I see pieces in person?', `Yes. Book a private viewing in Dubai on WhatsApp ${BRAND.whatsapp}.`]].map(([q, a]) => `<details class="acc"><summary>${q}</summary><div><p>${a}</p></div></details>`).join('')}</section></div>`;
}
export const notFound = () => `<div class="wrap"><div class="empty"><h1 class="h1 it">This page slipped away.</h1><a class="btn btn--gold" href="#/">Back home</a></div></div>`;
export function searchResults(q) {
  q = q.trim().toLowerCase();
  if (!q) return `<div class="chips">${['Tennis bracelet', 'Hoops', 'Rose gold', 'Oval', 'Emerald', 'Under 5k'].map(s => `<button class="chip" data-act="q" data-q="${s}">${s}</button>`).join('')}</div>`;
  const ps = PRODUCTS.filter(p => (q === 'under 5k' ? p.price < 5000 : [p.name, p.metal, p.stones, p.cat, catOf(p.cat).label, p.story].join(' ').toLowerCase().includes(q)));
  return ps.length ? `<p class="small muted">${ps.length} pieces</p><div class="grid">${ps.map(p => card(p)).join('')}</div>` : `<p class="h3 it">Nothing for "${esc(q)}" yet.</p>`;
}

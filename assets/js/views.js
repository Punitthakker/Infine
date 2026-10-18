// Screen templates. Each view returns an HTML string; app.js wires behaviour.
import { PRODUCTS, DROPS, CATEGORIES, LAUNCH, bySlug, fromPrice, dropOf, dropStatus, availability, earPartyFrom } from './data.js?v=202610181016';
import { jewelSVG } from './jewel.js?v=202610181016';
import { pixelDiamond, mascot, orbit, sparkle, ICON } from './brand.js?v=202610181016';
import * as S from './store.js?v=202610181016';

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const aed = n => 'AED ' + Math.round(n).toLocaleString('en-US');
const IMG = s => `assets/img/${s}.webp`;
const shortDate = iso => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'Asia/Dubai' }).toLowerCase();

export function media(m, label = '', eager = false) {
  if (m.video) return `<video autoplay muted loop playsinline preload="${eager ? 'auto' : 'metadata'}" poster="${IMG(m.video)}" aria-label="${esc(label)}"><source src="assets/video/${m.video}.mp4" type="video/mp4"></video>`;
  if (m.img) return `<img src="${IMG(m.img)}" alt="${esc(label)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  return jewelSVG(m.art, { bg: m.bg || 'ink', label });
}
const prodMedia = (p, eager) => media(p.video ? { video: p.video } : p.img ? { img: p.img } : { art: p.art, bg: p.bg }, `${p.name}, ${p.type}`, eager);

function badges(p) {
  const a = availability(p), out = [];
  if (a === 'soon') out.push(`<span class="sticker sticker--lilac">drops ${shortDate(dropOf(p).opens)}</span>`);
  else if (a === 'gone') out.push('<span class="sticker sticker--ink">sold out</span>');
  else if (p.left <= 10) out.push(`<span class="sticker sticker--pink">${p.left} left</span>`);
  else if (p.tags?.includes('bestseller')) out.push('<span class="sticker sticker--lime">bestseller</span>');
  else if (p.tags?.includes('first diamond')) out.push('<span class="sticker sticker--lilac">first diamond</span>');
  else if (p.tags?.includes('ear party')) out.push('<span class="sticker">ear party</span>');
  return out.join('');
}
export function card(p, eager = false) {
  const gone = availability(p) === 'gone';
  return `<article class="card${gone ? ' is-gone' : ''}">
    <a href="#/p/${p.slug}" class="card__media" aria-label="${esc(p.name)}">${prodMedia(p, eager)}${p.gallery?.[0] ? `<span class="card__alt">${media(p.gallery[0], '')}</span>` : ''}<div class="card__badges">${badges(p)}</div></a>
    ${availability(p) === 'live' ? `<button class="card__add" data-act="add" data-slug="${p.slug}" aria-label="add ${esc(p.name)} to bag">+</button>` : ''}
    <button class="card__wish" data-act="wish" data-slug="${p.slug}" aria-pressed="${S.isWished(p.slug)}" aria-label="save ${esc(p.name)}">${ICON.heart}</button>
    <a href="#/p/${p.slug}" class="card__name">${esc(p.name)}</a>
    <div class="card__meta"><span>${esc(p.type)}</span><span class="card__price">${p.sizes.length > 1 ? 'from ' : ''}${aed(fromPrice(p))}</span></div>
  </article>`;
}

export function clock(iso, label) {
  return `<div class="clock" data-until="${iso}" role="timer" aria-label="${esc(label)}">
    <div><b data-u="d">00</b><small>days</small></div><div><b data-u="h">00</b><small>hrs</small></div><div><b data-u="m">00</b><small>min</small></div><div><b data-u="s">00</b><small>sec</small></div></div>`;
}
function dropMeter(drop) {
  const ps = PRODUCTS.filter(p => p.drop === drop.id); const ed = ps.reduce((a, p) => a + p.edition, 0), left = ps.reduce((a, p) => a + p.left, 0);
  const pct = Math.round((ed - left) / ed * 100);
  return `<div class="meter" role="meter" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="claimed"><i style="width:${pct}%"></i></div>
  <div class="meter-row"><span>${ed - left} of ${ed} pieces claimed</span><span>${pct}%</span></div>`;
}
const notifyForm = (dropId, cls = '') => S.hasAlert(dropId)
  ? `<p class="ok">you're on the list. we'll message you before it opens.</p>`
  : `<form class="inline-form ${cls}" data-form="alert" data-drop="${dropId}" novalidate>
      <label class="sr" for="alert-${dropId}">whatsapp number or email</label>
      <input class="input" id="alert-${dropId}" name="contact" placeholder="whatsapp or email" autocomplete="email">
      <button class="btn btn--ink" type="submit">notify me</button>
      <p class="err" aria-live="polite"></p></form>`;

/* ================= HOME ================= */
export function home() {
  const d1 = DROPS[0], d2 = DROPS[1];
  const drop01 = PRODUCTS.filter(p => p.drop === 'drop-01');
  const ear = PRODUCTS.filter(p => p.cat === 'ear');
  const stripImgs = ['gz-skater', 'gz-kandura', 'gz-mirror', 'gz-squad', 'gz-pink-chains', 'gz-abaya', 'gz-neon-stack', 'gz-arms-yo'];
  const strip = stripImgs.map(s => `<figure><img src="${IMG(s)}" alt="" loading="lazy"></figure>`).join('');
  const tiles = [
    ['bracelets', 'tennis bracelets', 'on-lime', { art: { kind: 'bracelet', stones: 'white' }, bg: 'lime' }],
    ['necklaces', 'tennis necklaces', 'on-ink', { img: 'gz-pink-chains' }],
    ['ear', 'ear party', 'on-pink', { art: { kind: 'climber', stones: 'white' }, bg: 'pink' }],
    ['black', 'black diamonds', 'on-lilac', { art: { kind: 'necklace', stones: 'black' }, bg: 'lilac' }],
    ['iced', 'iced out', 'on-ink', { video: 'ice-ceo' }],
    ['all', 'shop the squad', 'on-ink', { img: 'gz-squad' }],
  ].map(([id, l, c, m]) => `<a class="tile ${c}" href="#/shop/${id}">${media(m, l)}<b>${l}</b><small class="sticker ${c === 'on-ink' ? 'sticker--lime' : 'sticker--ink'}">${(id === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === id)).length} pieces</small></a>`).join('');
  return `
  <section class="hero on-ink">
    ${orbit('hero__orbit')}
    <div class="wrap hero__in">
      <div class="hero__head" style="display:grid;gap:14px">
        <p class="handle c-lime">${LAUNCH.handle}</p>
        <h1 class="d1"><span>stack it.</span><span>mix it.</span><span>make it yours.</span></h1>
      </div>
      <div class="hero__side">
        <p class="mono hero__price">ear party<br>starts at<br><b>${aed(earPartyFrom())}</b></p>
        <p class="lede">top-grade lab-grown diamonds in solid 18k gold, made to stack. limited drops out of ${LAUNCH.city}.</p>
        <div class="hero__ctas"><a class="btn btn--lime" href="#/shop">shop the drop</a><a class="btn btn--line" href="#/drops">see drops</a></div>
        <div class="fan" aria-label="drop 01 pieces">
          ${['ice-line', 'ice-line-necklace', 'pave-huggie'].map((sl, i) => { const q = bySlug(sl); return `<a class="fan__card" style="--i:${i}" href="#/p/${sl}">${prodMedia(q, true)}<span class="sticker">${esc(q.name)} · ${aed(fromPrice(q))}</span></a>`; }).join('')}
        </div>
      </div>
      <a class="spinbadge" href="#/drops" aria-label="drop 01 early access is live">
        <svg viewBox="0 0 200 200" aria-hidden="true"><defs><path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs><text textLength="486" lengthAdjust="spacing"><textPath href="#circ" textLength="486" lengthAdjust="spacing">drop 01 · early access live · drop 01 · early access live · </textPath></text></svg>
        ${pixelDiamond('spinbadge__dia')}
      </a>
    </div>
  </section>
  <div class="strip on-ink" aria-hidden="true"><div class="strip__run">${strip}${strip}</div></div>
  <div class="band on-pink" aria-hidden="true"><div class="band__run"><span>lab-grown diamonds</span><span>solid 18k gold</span><span>numbered editions</span><span>made in dubai</span><span>stack it</span><span>lab-grown diamonds</span><span>solid 18k gold</span><span>numbered editions</span><span>made in dubai</span><span>stack it</span></div></div>

  <section class="dropblk on-lime" aria-labelledby="d01">
    <div class="wrap dropblk__in">
      <p class="handle">${LAUNCH.handle}</p>
      ${pixelDiamond('pixdia')}
      <h2 class="pixel" id="d01">main<br>character<br>energy</h2>
      <p class="drop-pill">drop ${d1.no} · ${shortDate(d1.publicAt)} · ${LAUNCH.city}</p>
      ${Date.now() < Date.parse(d1.publicAt) ? `<p class="mono">public drop in</p>${clock(d1.publicAt, 'time until drop 01')}` : `<p class="mono">drop 01 is live</p>`}
      <p class="lede" style="margin-inline:auto">early access is open now for the list. ${PRODUCTS.filter(p => p.drop === 'drop-01').length} pieces, numbered editions, gone when they're gone.</p>
      ${dropMeter(d1)}
      <a class="btn btn--ink" href="#/shop">shop early access</a>
    </div>
  </section>

  <section class="sec on-ink"><div class="wrap sec__in">
    <div class="sec__head"><h2 class="d3">drop ${d1.no}</h2><a class="link" href="#/shop">shop all ${drop01.length}</a></div>
    <div class="rail">${drop01.map(p => card(p)).join('')}</div>
  </div></section>

  <section class="sec iced on-ink" aria-labelledby="ice"><div class="wrap sec__in">
    <div class="sec__head"><div style="display:grid;gap:12px"><span class="sticker sticker--pink sticker--live">drop 03 · live now</span><h2 class="d2" id="ice">iced <span class="c-pink">out.</span></h2></div><a class="link" href="#/shop/iced">shop all ${PRODUCTS.filter(p => p.drop === 'drop-03').length}</a></div>
    <p class="lede">${esc(DROPS.find(d => d.id === 'drop-03').line)}</p>
    <div class="rail rail--tall">${PRODUCTS.filter(p => p.drop === 'drop-03').map(p => card(p)).join('')}</div>
  </div></section>

  <section class="on-lilac"><div class="wrap first" style="position:relative">
    <div style="display:grid;gap:20px">
      <p class="handle">${LAUNCH.handle}</p>
      <h2 class="d2"><span>your first diamond.</span><span class="c-pink">not your mom's.</span></h2>
      <p class="mono">mini line tennis bracelet from <b>${aed(fromPrice(bySlug('mini-line')))}</b></p>
    </div>
    <div class="first__row">
      <span style="position:relative;display:inline-block">${mascot('mascot')}${sparkle('spk', '#fff').replace('class="spk"', 'class="spk" style="right:-10px;top:-6px"')}</span>
      <a class="btn btn--ink" href="#/p/mini-line">shop the drop</a>
    </div>
  </div></section>

  <section class="sec on-ink"><div class="wrap sec__in">
    <div class="sec__head"><h2 class="d3">shop by vibe</h2></div>
    <div class="tiles">${tiles}</div>
  </div></section>

  <section class="sec on-white" aria-labelledby="ad"><div class="wrap sec__in">
    <div class="sec__head"><div style="display:grid;gap:12px"><span class="sticker sticker--ink">drop ${d2.no} · ${shortDate(d2.opens)}</span><h2 class="d2" id="ad">after dark</h2></div></div>
    <p class="lede" style="color:#444">${d2.line}</p>
    ${dropStatus(d2) === 'soon' ? clock(d2.opens, 'time until drop 02') : ''}
    <div class="grid">${PRODUCTS.filter(p => p.drop === 'drop-02').map(p => card(p)).join('')}</div>
    ${notifyForm(d2.id)}
  </div></section>

  <section class="sec ear on-ink" aria-labelledby="ep">
    ${orbit('ear__orbit')}
    <div class="wrap sec__in">
      <div class="sec__head"><h2 class="d2" id="ep">ear<br><span class="c-pink">party</span></h2><p class="mono" style="font-size:20px;line-height:1.5">starts at<br><b>${aed(earPartyFrom())}</b></p></div>
      <p class="lede">studs sold single, so you can build it one hole at a time.</p>
      <div class="grid">${ear.map(p => card(p)).join('')}</div>
    </div>
  </section>

  <section class="sec on-lime"><div class="wrap sec__in">
    <h2 class="d3">lab-grown diamonds.<br>real gold. no drama.</h2>
    <div class="proof">
      <div><b>D-F / VVS</b><span>top-grade lab-grown colour and clarity, every stone</span></div>
      <div><b>18k</b><span>solid gold only. no plating, no vermeil</span></div>
      <div><b>IGI certified</b><span>an IGI lab-grown diamond certificate ships in the box</span></div>
      <div><b>14 days</b><span>to change your mind. free returns in the uae</span></div>
    </div>
  </div></section>

  <section class="sec on-ink"><div class="wrap sec__in">
    <div class="sec__head"><h2 class="d3">how they <span class="c-lime">stack</span></h2><span class="mono muted">tap a look to shop it</span></div>
    <div class="stack">
      ${[['gz-skater', 'midnight-line'], ['gz-kandura', 'salt-pepper-line'], ['gz-mirror', 'mini-line'], ['gz-pink-chains', 'midnight-necklace'], ['gz-abaya', 'rose-line'], ['gz-neon-stack', 'ice-line']]
      .map(([i, s]) => `<a href="#/p/${s}"><figure><img src="${IMG(i)}" alt="${esc(bySlug(s).name)} styled" loading="lazy"><figcaption><span class="sticker">${esc(bySlug(s).name)}</span></figcaption></figure></a>`).join('')}
    </div>
  </div></section>

  <section class="sec on-ink" aria-labelledby="cw"><div class="wrap sec__in">
    <div class="sec__head"><h2 class="d3" id="cw">the drop ${d1.no} campaign</h2><span class="mono muted">save it, post it, tag ${LAUNCH.handle}</span></div>
    <div class="rail" style="grid-auto-columns:min(62vw,280px)">
      ${['poster-stack-it', 'poster-main-character', 'poster-first-diamond'].map((p, i) => `<figure style="margin:0;border-radius:22px;overflow:hidden;aspect-ratio:9/16"><img src="assets/brand/${p}.jpg" alt="${['stack it. mix it. make it yours.', 'main character energy, drop 01', 'your first diamond. not your mom\'s.'][i]}" loading="lazy" style="width:100%;height:100%;object-fit:cover"></figure>`).join('')}
    </div>
  </div></section>

<div class="band on-lilac band--rev" aria-hidden="true"><div class="band__run"><span>main character energy</span><span>drop 01</span><span>gone is gone</span><span>your first diamond</span><span>main character energy</span><span>drop 01</span><span>gone is gone</span><span>your first diamond</span></div></div>
  <section class="sec on-pink" aria-labelledby="al"><div class="wrap sec__in">
    <h2 class="d2" id="al">get the drop<br>before everyone.</h2>
    <p class="lede">one message before each drop opens. no spam, no newsletters about our feelings.</p>
    ${notifyForm('drop-01')}
  </div></section>`;
}

/* ================= SHOP ================= */
export function shop(cat = 'all', sort = 'featured') {
  let ps = PRODUCTS.filter(p => cat === 'all' || p.cat === cat);
  if (sort === 'low') ps = [...ps].sort((a, b) => fromPrice(a) - fromPrice(b));
  if (sort === 'high') ps = [...ps].sort((a, b) => fromPrice(b) - fromPrice(a));
  if (sort === 'left') ps = [...ps].sort((a, b) => (a.left || 999) - (b.left || 999));
  const c = CATEGORIES.find(x => x.id === cat) || CATEGORIES[0];
  return `<div class="wrap">
    <header class="pagehead"><p class="handle c-lime">${LAUNCH.handle}</p><h1 class="d2">${c.id === 'all' ? 'shop' : esc(c.label)}</h1></header>
    <div class="toolbar">
      <div class="chips" role="group" aria-label="category">${CATEGORIES.map(x => `<a class="chip" href="#/shop/${x.id}" aria-pressed="${x.id === cat}">${x.label}</a>`).join('')}</div>
      <span class="mono muted small">${ps.length} pieces</span>
      <label class="sr" for="sort">sort</label>
      <select class="select" id="sort" data-act="sort">${[['featured', 'featured'], ['low', 'price: low to high'], ['high', 'price: high to low'], ['left', 'almost gone']].map(([v, l]) => `<option value="${v}"${v === sort ? ' selected' : ''}>${l}</option>`).join('')}</select>
    </div>
    <div class="grid" style="padding-block:18px 72px">${ps.map((p, i) => card(p, i < 2)).join('')}</div>
  </div>`;
}

/* ================= PRODUCT ================= */
export function product(slug, sel = {}) {
  const p = bySlug(slug); if (!p) return notFound();
  const d = dropOf(p), a = availability(p);
  const size = p.sizes.find(s => s.label === sel.size) || p.sizes[0];
  const metal = sel.metal || p.metals[0], length = sel.length || p.lengths[Math.min(1, p.lengths.length - 1)];
  const slides = [{ video: p.video, img: p.img, art: p.art, bg: p.bg }, ...p.gallery];
  const opt = (k, list, cur) => list.map(v => `<button class="opt" data-act="opt" data-k="${k}" data-v="${esc(v)}" aria-pressed="${v === cur}">${esc(v)}</button>`).join('');
  const sold = p.edition - p.left, pct = Math.round(sold / p.edition * 100);
  const cta = a === 'live'
    ? `<button class="btn btn--lime btn--block" data-act="add" data-slug="${p.slug}">add to bag · <span class="nt">${aed(size.price)}</span></button>`
    : a === 'soon' ? `<div class="stockbox on-lilac"><b class="d4">drops ${shortDate(d.opens)}</b>${clock(d.opens, 'time until this drop')}${notifyForm(d.id)}</div>`
    : `<button class="btn btn--white btn--block" disabled>sold out</button>${notifyForm(d.id)}`;
  const related = PRODUCTS.filter(x => x.cat === p.cat && x.slug !== p.slug).slice(0, 6);
  return `<div class="wrap">
  <div class="pdp">
    <div>
      <div class="gallery" data-gallery>${slides.map((m, i) => `<div>${media(m, `${p.name} view ${i + 1}`, i === 0)}</div>`).join('')}</div>
      <div class="dots" aria-hidden="true">${slides.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>
    </div>
    <div class="buy">
      <div class="buy__title">
        <div style="display:flex;gap:6px;flex-wrap:wrap"><a class="sticker sticker--lime" href="#/drops">${d.id === 'vault' ? 'the vault' : 'drop ' + d.no}</a>${badges(p)}</div>
        <h1 class="d3">${esc(p.name)}</h1>
        <p class="mono muted">${esc(p.type)} · ${size.stones} diamond${size.stones > 1 ? 's' : ''}</p>
        <p class="price" data-price>${aed(size.price)}</p>
        <p class="split">or 4 interest-free payments of ${aed(size.price / 4)}</p>
      </div>
      <p>${esc(p.blurb)}</p>
      ${p.sizes.length > 1 ? `<div class="optgroup"><span>carat weight</span><div class="optrow">${opt('size', p.sizes.map(s => s.label), size.label)}</div></div>` : ''}
      ${p.metals.length > 1 ? `<div class="optgroup"><span>metal</span><div class="optrow">${opt('metal', p.metals, metal)}</div></div>` : `<div class="optgroup"><span>metal</span><p>${esc(metal)}</p></div>`}
      ${p.lengths.length > 1 ? `<div class="optgroup"><span>${p.cat === 'ear' ? 'option' : 'length'} <a class="link" href="#/guide">size guide</a></span><div class="optrow">${opt('length', p.lengths, length)}</div></div>` : ''}
      ${a !== 'soon' ? `<div class="stockbox on-ink" style="background:var(--ink-2)">
        <div class="meter-row" style="width:100%"><span>${p.left > 0 ? `${p.left} of ${p.edition} left` : `all ${p.edition} claimed`}</span><span>edition of ${p.edition}</span></div>
        <div class="meter" style="width:100%"><i style="width:${pct}%"></i></div></div>` : ''}
      <div style="display:grid;gap:10px">${cta}
        <button class="btn btn--line btn--block btn--sm" data-act="wish" data-slug="${p.slug}" aria-pressed="${S.isWished(p.slug)}">${S.isWished(p.slug) ? 'saved' : 'save for later'}</button></div>
      <div class="perks">
        <div>${ICON.truck}free same-day delivery in dubai</div><div>${ICON.cert}IGI certificate in the box</div>
        <div>${ICON.swap}14-day free returns</div><div>${ICON.gift}gift-ready box + note</div>
      </div>
      <table class="specs"><tbody>
        <tr><th>total weight</th><td>${esc(size.label)}</td></tr><tr><th>stones</th><td>${size.stones}</td></tr>
        <tr><th>colour</th><td>${esc(p.specs.colour)}</td></tr><tr><th>clarity</th><td>${esc(p.specs.clarity)}</td></tr>
        <tr><th>cut</th><td>${esc(p.specs.cut)}</td></tr><tr><th>setting</th><td>${esc(p.specs.setting)}</td></tr>
        <tr><th>metal</th><td>${esc(metal)}</td></tr><tr><th>edition</th><td>${p.edition} pieces, numbered</td></tr>
      </tbody></table>
      <div>
        <details class="acc"><summary>delivery</summary><div><p>dubai: same day if you order before 2pm, free. rest of the uae: 1-2 days, free. gcc: 3-5 days, ${aed(75)}.</p><p>everything ships insured, in a locked box, and needs a signature.</p></div></details>
        <details class="acc"><summary>care</summary><div><p>take it off for the gym, the pool and the beach. clean with warm water, mild soap and a soft brush. we'll steam-clean and check the prongs for free, forever.</p></div></details>
        <details class="acc"><summary>returns</summary><div><p>14 days, unworn, with the certificate and box. engraved and resized pieces are final sale.</p></div></details>
      </div>
    </div>
  </div>
  ${bundle(p, size)}
  ${related.length ? `<section class="sec__in" style="padding-bottom:72px"><h2 class="d4">stack it with</h2><div class="rail">${related.map(x => card(x)).join('')}</div></section>` : ''}
  </div>
  ${a === 'live' ? `<div class="stickybuy" data-stickybuy><div style="display:grid;min-width:0"><b class="card__name" style="font-size:18px">${esc(p.name)}</b><span class="mono small muted">${aed(size.price)}</span></div><button class="btn btn--lime" data-act="add" data-slug="${p.slug}">add to bag</button></div>` : ''}`;
}

function bundle(p, size) {
  const pairs = { bracelets: ['mini-line', 'ice-line', 'pave-huggie'], necklaces: ['ice-line', 'solo-stud'], ear: ['pave-huggie', 'orbit-climber', 'solo-stud'], black: ['onyx-studs', 'midnight-line'], iced: ['ice-line', 'midnight-line', 'skull-ring'] }[p.cat] || [];
  const q = pairs.map(bySlug).find(x => x && x.slug !== p.slug && availability(x) === 'live');
  if (!q || availability(p) !== 'live') return '';
  const tot = size.price + fromPrice(q);
  return `<section class="bundle on-lime"><div class="bundle__in">
    <div><p class="mono">complete the stack</p><h2 class="d3">${esc(p.name)} <span class="c-pink">+</span> ${esc(q.name)}</h2></div>
    <div class="bundle__pics"><div>${prodMedia(p)}</div><b>+</b><div>${prodMedia(q)}</div></div>
    <div class="bundle__buy"><p class="price">${aed(tot)}</p><button class="btn btn--ink" data-act="add-bundle" data-a="${p.slug}" data-b="${q.slug}">add both to bag</button></div>
  </div></section>`;
}

/* ================= DROPS ================= */
export function drops() {
  const blk = d => {
    const st = dropStatus(d), ps = PRODUCTS.filter(p => p.drop === d.id);
    const art = d.id === 'drop-01' ? pixelDiamond('pixdia') : d.id === 'drop-03' ? `<div style="border-radius:22px;overflow:hidden;width:min(100%,320px);aspect-ratio:9/14">${media({ video: 'ice-goat' }, 'the goat pendant')}</div>` : jewelSVG({ kind: 'bracelet', stones: 'black' }, { bg: 'lilac' });
    const stTag = st === 'live' ? '<span class="sticker sticker--pink sticker--live">live</span>' : st === 'soon' ? `<span class="sticker sticker--white">opens ${shortDate(d.opens)}</span>` : '<span class="sticker sticker--ink">closed</span>';
    return `<article class="dropcard on-${d.bg}">
      <div class="dropcard__art">${art}</div>
      <div style="display:grid;gap:16px;align-content:start">
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="dropcard__no">${d.id === 'vault' ? 'always on' : 'drop ' + d.no}</span>${stTag}</div>
        <h2 class="d3">${esc(d.name)}</h2><p class="lede" style="color:inherit;opacity:.8">${esc(d.line)}</p>
        ${d.publicAt && Date.now() < Date.parse(d.publicAt) ? `<p class="mono">public drop in</p>${clock(d.publicAt, 'time until public drop')}` : ''}
        ${st === 'soon' ? `<p class="mono">opens in</p>${clock(d.opens, 'time until drop opens')}` : ''}
        ${st === 'live' && d.id !== 'vault' ? dropMeter(d) : ''}
        <div style="display:flex;gap:8px;flex-wrap:wrap">${st === 'soon' ? notifyForm(d.id) : `<a class="btn ${d.bg === 'ink' ? 'btn--lime' : 'btn--ink'}" href="#/shop/${d.id === 'drop-02' ? 'black' : d.id === 'drop-03' ? 'iced' : 'all'}">shop ${ps.length} pieces</a>`}</div>
      </div></article>`;
  };
  return `<div class="wrap" style="padding-bottom:72px">
    <header class="pagehead"><p class="handle c-lime">${LAUNCH.handle}</p><h1 class="d2">drops</h1>
    <p class="lede">we release in small numbered editions. when a drop closes or sells out, it doesn't come back.</p></header>
    <div class="droplist">${DROPS.map(blk).join('')}</div>
  </div>`;
}

/* ================= BAG ================= */
export function bagItems() {
  const items = S.bag();
  if (!items.length) return `<div class="empty">${mascot('mascot', 'wow')}<p class="d4">your bag is empty.<br>main character, no jewellery?</p><a class="btn btn--lime btn--sm" href="#/shop" data-act="close-bag">shop the drop</a></div>`;
  return items.map(it => {
    const { p, s, total } = S.lineOf(it);
    return `<div class="line-item"><a class="line-item__img" href="#/p/${p.slug}" data-act="close-bag">${prodMedia(p)}</a>
      <div class="line-item__info"><div class="line-item__top"><a class="line-item__name" href="#/p/${p.slug}" data-act="close-bag">${esc(p.name)}</a><span class="mono">${aed(total)}</span></div>
      <span class="mono small muted">${esc(s.label)} · ${esc(it.metal)}${it.length ? ' · ' + esc(it.length) : ''}</span>
      <div style="display:flex;justify-content:space-between;align-items:center"><div class="qty"><button data-act="qty" data-key="${esc(it.key)}" data-d="-1" aria-label="one less">−</button><span>${it.qty}</span><button data-act="qty" data-key="${esc(it.key)}" data-d="1" aria-label="one more">+</button></div>
      <button class="link small" data-act="qty" data-key="${esc(it.key)}" data-d="-99">remove</button></div>
      <span class="mono small muted">max 2 per drop piece</span></div></div>`;
  }).join('');
}
export function bagFoot() {
  const t = S.totals(); if (!t.count) return '';
  return `<div class="ship-goal">free insured delivery across the uae, same day in dubai.</div>
    <div class="sumrow"><span>subtotal</span><span>${aed(t.sub)}</span></div>
    ${t.off ? `<div class="sumrow"><span>code ${esc(t.code)}</span><span>−${aed(t.off)}</span></div>` : ''}
    <div class="sumrow total"><span>total</span><span>${aed(t.total)}</span></div>
    <a class="btn btn--lime btn--block" href="#/checkout" data-act="close-bag">checkout</a>
    <p class="split" style="text-align:center">or 4 interest-free payments of ${aed(t.total / 4)}</p>`;
}
export function bagPage() {
  return `<div class="wrap" style="padding-bottom:72px;max-width:760px"><header class="pagehead"><h1 class="d2">your bag</h1></header>
  <div data-bag-body>${bagItems()}</div><div style="display:grid;gap:12px;padding-top:16px" data-bag-foot>${bagFoot()}</div></div>`;
}

/* ================= CHECKOUT ================= */
export function checkout(step = 1, f = {}) {
  const t = S.totals();
  if (!t.count) return `<div class="wrap"><div class="empty">${mascot('mascot', 'wow')}<h1 class="d3">nothing to check out yet.</h1><a class="btn btn--lime" href="#/shop">shop the drop</a></div></div>`;
  const val = k => esc(f[k] || '');
  const steps = ['you', 'delivery', 'payment'].map((s, i) => `<span class="${i + 1 === step ? 'on' : i + 1 < step ? 'done' : ''}"><b>${i + 1 < step ? '✓' : i + 1}</b>${s}</span>`).join('');
  const ship = { dxb: 0, uae: 0, gcc: 75 }[f.ship || 'dxb'];
  let body = '';
  if (step === 1) body = `<form class="panel" data-form="co" data-step="1" novalidate>
      <h2 class="d4">who's it for?</h2>
      <div class="form-grid">
        <div class="field"><label for="fn">first name</label><input class="input" id="fn" name="first" autocomplete="given-name" value="${val('first')}" required></div>
        <div class="field"><label for="ln">last name</label><input class="input" id="ln" name="last" autocomplete="family-name" value="${val('last')}" required></div>
        <div class="field full"><label for="em">email</label><input class="input" id="em" name="email" type="email" autocomplete="email" value="${val('email')}" required></div>
        <div class="field full"><label for="ph">mobile (for delivery updates on whatsapp)</label><input class="input" id="ph" name="phone" type="tel" autocomplete="tel" placeholder="+971" value="${val('phone')}" required></div>
      </div><p class="err" aria-live="polite"></p>
      <button class="btn btn--lime btn--block" type="submit">continue to delivery</button></form>`;
  if (step === 2) body = `<form class="panel" data-form="co" data-step="2" novalidate>
      <h2 class="d4">where's it going?</h2>
      <div class="form-grid">
        <div class="field full"><label for="ad1">building, street</label><input class="input" id="ad1" name="addr" autocomplete="address-line1" value="${val('addr')}" required></div>
        <div class="field"><label for="apt">apartment / villa</label><input class="input" id="apt" name="apt" autocomplete="address-line2" value="${val('apt')}"></div>
        <div class="field"><label for="area">area</label><input class="input" id="area" name="area" value="${val('area')}" required></div>
        <div class="field full"><label for="em2">emirate / country</label><select class="input" id="em2" name="emirate">${['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman'].map(e => `<option${f.emirate === e ? ' selected' : ''}>${e}</option>`).join('')}</select></div>
      </div>
      <div style="display:grid;gap:8px">
        ${[['dxb', 'same day in dubai', 'order before 2pm · insured · signature', 'free'], ['uae', 'rest of the uae', '1-2 days · insured · signature', 'free'], ['gcc', 'gcc express', '3-5 days · duties shown at payment', aed(75)]]
        .map(([v, a, b, c]) => `<label class="radio"><input type="radio" name="ship" value="${v}"${(f.ship || 'dxb') === v ? ' checked' : ''}><div><b>${a}</b><small>${b}</small></div><span class="mono">${c}</span></label>`).join('')}
        <label class="radio"><input type="checkbox" name="gift" ${f.gift ? 'checked' : ''} style="accent-color:var(--lime)"><div><b>make it a gift</b><small>hide prices, add a handwritten note</small></div><span class="mono">free</span></label>
      </div><p class="err" aria-live="polite"></p>
      <div style="display:flex;gap:8px"><button class="btn btn--line btn--sm" type="button" data-act="co-back">back</button><button class="btn btn--lime" style="flex:1" type="submit">continue to payment</button></div></form>`;
  if (step === 3) body = `<form class="panel" data-form="co" data-step="3" novalidate>
      <h2 class="d4">how are you paying?</h2>
      <div style="display:grid;gap:8px">
        <label class="radio"><input type="radio" name="pay" value="apple"${(f.pay || 'card') === 'apple' ? ' checked' : ''}><div><b>apple pay</b><small>face id, done</small></div><span class="tagpay">pay</span></label>
        <label class="radio"><input type="radio" name="pay" value="card"${(f.pay || 'card') === 'card' ? ' checked' : ''}><div><b>card</b><small>visa, mastercard, amex · 3d secure</small></div><span class="tagpay">card</span></label>
        <label class="radio"><input type="radio" name="pay" value="split"${f.pay === 'split' ? ' checked' : ''}><div><b>split in 4</b><small>${aed((t.total + ship) / 4)} today, then every 2 weeks, 0% interest</small></div><span class="tagpay">4×</span></label>
      </div>
      <div class="form-grid" data-cardfields>
        <div class="field full"><label for="cn">card number</label><input class="input" id="cn" name="cardno" inputmode="numeric" autocomplete="cc-number" placeholder="4242 4242 4242 4242"></div>
        <div class="field"><label for="ce">expiry</label><input class="input" id="ce" name="exp" autocomplete="cc-exp" placeholder="mm / yy"></div>
        <div class="field"><label for="cv">cvc</label><input class="input" id="cv" name="cvc" inputmode="numeric" autocomplete="cc-csc" placeholder="123"></div>
      </div>
      <p class="mono small muted">demo checkout: no payment is taken. see the readme to connect a payment provider.</p>
      <p class="err" aria-live="polite"></p>
      <div style="display:flex;gap:8px"><button class="btn btn--line btn--sm" type="button" data-act="co-back">back</button><button class="btn btn--pink" style="flex:1" type="submit">pay <span class="nt">${aed(t.total + ship)}</span></button></div></form>`;
  const items = S.bag().map(it => { const { p, s, total } = S.lineOf(it); return `<div class="line-item" style="grid-template-columns:64px 1fr"><div class="line-item__img">${prodMedia(p)}</div><div class="line-item__info"><div class="line-item__top"><span class="line-item__name" style="font-size:17px">${esc(p.name)} ×${it.qty}</span><span class="mono small">${aed(total)}</span></div><span class="mono small muted">${esc(s.label)} · ${esc(it.metal)}</span></div></div>`; }).join('');
  return `<div class="wrap"><div class="co">
    <div style="display:grid;gap:18px;align-content:start"><a class="link small" href="#/bag" style="justify-self:start">back to bag</a><h1 class="d2">checkout</h1><div class="steps">${steps}</div>${body}</div>
    <aside class="panel">
      <h2 class="d4">your order</h2><div>${items}</div>
      <form class="inline-form" data-form="promo" novalidate><label class="sr" for="promo">promo code</label><input class="input" id="promo" name="code" placeholder="promo code" value="${esc(t.code)}" style="height:48px"><button class="btn btn--line btn--sm" type="submit">apply</button><p class="err" aria-live="polite"></p></form>
      <div class="sumrow"><span>subtotal</span><span>${aed(t.sub)}</span></div>
      ${t.off ? `<div class="sumrow"><span>code ${esc(t.code)}</span><span>−${aed(t.off)}</span></div>` : ''}
      <div class="sumrow"><span>delivery</span><span>${ship ? aed(ship) : 'free'}</span></div>
      <div class="sumrow total"><span>total</span><span>${aed(t.total + ship)}</span></div>
    </aside></div></div>`;
}

export function done(id) {
  const o = S.orders().find(x => x.id === id);
  if (!o) return notFound();
  return `<section class="on-lime"><div class="wrap done">
    ${mascot('mascot')}
    <p class="mono">order ${esc(o.id)}</p>
    <h1 class="d2">it's yours.</h1>
    <p class="lede" style="color:var(--ink)">thanks, ${esc(o.details.first)}. we've sent the confirmation to ${esc(o.details.email)} and we'll message ${esc(o.details.phone)} on whatsapp when it's out for delivery.</p>
    <div class="panel on-ink" style="width:min(100%,520px)">
      ${o.items.map(it => { const { p, s, total } = S.lineOf(it); return `<div class="sumrow" style="color:var(--white)"><span>${esc(p.name)} · ${esc(s.label)} ×${it.qty}</span><span>${aed(total)}</span></div>`; }).join('')}
      <div class="sumrow total"><span>paid</span><span>${aed(o.total + (o.details.shipCost || 0))}</span></div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn--ink" href="#/shop">keep shopping</a><a class="btn btn--line" href="#/account">view orders</a></div>
  </div></section>`;
}

/* ================= SAVED / ACCOUNT ================= */
export function saved() {
  const ps = S.wish().map(bySlug).filter(Boolean);
  return `<div class="wrap" style="padding-bottom:72px"><header class="pagehead"><h1 class="d2">saved</h1></header>
  ${ps.length ? `<div class="grid">${ps.map(p => card(p)).join('')}</div>` : `<div class="empty">${mascot('mascot', 'wow')}<p class="d4">nothing saved yet. tap the heart on anything you love.</p><a class="btn btn--lime btn--sm" href="#/shop">shop the drop</a></div>`}</div>`;
}
export function account() {
  const u = S.me(), os = S.orders(), al = S.alerts();
  if (!u) return `<div class="wrap"><div class="acct">
    <h1 class="d2">sign in</h1><p class="lede">track orders, get early access, keep your saved pieces on every device.</p>
    <form class="panel" data-form="signin" novalidate>
      <div class="field"><label for="sn">name</label><input class="input" id="sn" name="name" autocomplete="name" required></div>
      <div class="field"><label for="se">email</label><input class="input" id="se" name="email" type="email" autocomplete="email" required></div>
      <p class="err" aria-live="polite"></p><button class="btn btn--lime btn--block" type="submit">send me a sign-in link</button>
      <p class="mono small muted">demo: signs you in on this device.</p>
    </form></div></div>`;
  return `<div class="wrap"><div class="acct">
    <p class="handle c-lime">hey ${esc(u.name.split(' ')[0])}</p><h1 class="d2">your account</h1>
    <section><h2 class="d4">orders</h2>${os.length ? os.map(o => `<a class="order-row" href="#/order/${o.id}"><span>${esc(o.id)}<br><span class="muted">${new Date(o.at).toLocaleDateString('en-GB')}</span></span><span>${aed(o.total)}<br><span class="c-lime">confirmed</span></span></a>`).join('') : '<p class="muted" style="padding-top:8px">no orders yet.</p>'}</section>
    <section><h2 class="d4">drop alerts</h2>${al.length ? al.map(a => `<div class="order-row"><span>${esc(DROPS.find(d => d.id === a.dropId)?.name || a.dropId)}</span><span class="muted">${esc(a.contact)}</span></div>`).join('') : '<p class="muted" style="padding-top:8px">you have no drop alerts. <a class="link" href="#/drops">see drops</a></p>'}</section>
    <button class="btn btn--line btn--sm" data-act="signout" style="justify-self:start">sign out</button>
  </div></div>`;
}

/* ================= STORY / GUIDE ================= */
export function story() {
  return `<section class="on-ink"><div class="wrap" style="padding-block:40px 56px;display:grid;gap:24px">
    <p class="handle c-lime">${LAUNCH.handle}</p>
    <h1 class="d1"><span>real</span><span class="c-pink">diamonds.</span><span class="c-lime">new rules.</span></h1>
    <div class="prose"><p>infine is fine jewellery for people buying their first real piece, and their second, and their tenth. we make tennis lines, ear party pieces and black diamonds in solid 18k gold, in small numbered drops, out of dubai.</p>
    <p>no "save it for a special occasion". you wear it to class, to the gym (okay, take it off for the gym), to dinner, to bed. then you add another one.</p></div>
  </div></section>
  <section class="sec on-lime"><div class="wrap sec__in"><h2 class="d3">how a drop works</h2>
    <div class="how">
      ${[['join the list', 'leave your whatsapp or email. we message you once, before a drop opens.'], ['early access', 'the list gets in first, a few days before the public drop.'], ['public drop', 'everything goes live at 8pm dubai time. every piece is a numbered edition.'], ['gone is gone', 'when an edition sells out or a drop closes, we don\'t remake it.']]
      .map(([b, t], i) => `<div class="on-ink"><i class="c-lime">${i + 1}</i><div><b>${b}</b><p class="muted">${t}</p></div></div>`).join('')}
    </div></div></section>
  <section class="sec on-lilac"><div class="wrap sec__in"><h2 class="d3">what we won't do</h2>
    <div class="cs">${[['plating', 'solid 18k gold only, so nothing turns green.'], ['mystery stones', 'every lab-grown diamond is IGI graded and certified.'], ['fake sales', 'our prices are our prices. no 70% off next week.'], ['restocks', 'numbered editions stay numbered.']].map(([b, t]) => `<div class="on-white"><b>no ${b}</b><p>${t}</p></div>`).join('')}</div>
  </div></section>`;
}

export function guide() {
  const faqs = [
    ['are lab-grown diamonds real diamonds?', 'yes. same carbon crystal, same hardness, same fire as a mined diamond, just grown in a lab instead of dug out of the ground. ours are top grade: D-F colour, VVS clarity, excellent cut, set in solid 18k gold, with an IGI certificate in every box.'],
    ['what are black diamonds?', 'lab-grown diamonds made deep, even black so they read like onyx until they catch the light. same hardness as white diamonds, and every piece says so on the product page.'],
    ['how do i pick a bracelet length?', 'measure your wrist snugly and add about 1.5 cm for a tennis bracelet. use the sizer above if you\'re unsure.'],
    ['can i wear it every day?', 'that\'s the idea. take it off for the gym, the pool and the beach, and bring it in once a year for a free prong check and clean.'],
    ['do you ship outside the uae?', 'yes, across the gcc in 3-5 days, insured. duties are shown before you pay.'],
    ['what if a drop sells out?', 'join the list for the next one. we don\'t restock numbered editions.'],
  ];
  return `<div class="wrap" style="padding-bottom:72px;display:grid;gap:12px">
    <header class="pagehead"><p class="handle c-lime">${LAUNCH.handle}</p><h1 class="d2">diamond 101</h1><p class="lede">everything you need to buy your first one without asking your mom.</p></header>
    <div class="cs">${[['cut', 'how well it\'s cut decides how much it sparkles. ours are excellent round brilliants.', 'on-lime'], ['colour', 'D is ice white. ours are D-F: the colourless top of the scale.', 'on-lilac'], ['clarity', 'how clean the stone is inside. ours are VVS: clean even under a loupe.', 'on-pink'], ['carat', 'total weight of all the stones. 1 ct on a bracelet is about 60 little diamonds.', 'on-white']]
    .map(([b, t, c]) => `<div class="${c}"><b>${b}</b><p>${t}</p></div>`).join('')}</div>
    <section class="sec on-lime" style="border-radius:30px;padding:28px 20px;margin-top:16px"><div class="sizer">
      <h2 class="d3">bracelet sizer</h2>
      <label for="wrist" class="mono">your wrist, measured snugly</label>
      <input type="range" id="wrist" min="13" max="20" step=".5" value="15.5" data-act="wrist">
      <p class="mono" data-wrist-out>wrist 15.5 cm</p>
      <output for="wrist" data-wrist-size>6.5"</output>
      <p class="lede" style="color:var(--ink)">that's the length to pick on any tennis bracelet.</p>
    </div></section>
    <section style="padding-top:24px"><h2 class="d3" style="margin-bottom:8px">questions</h2>
      ${faqs.map(([q, a]) => `<details class="acc"><summary>${q}</summary><div><p>${a}</p></div></details>`).join('')}</section>
  </div>`;
}

export function notFound() {
  return `<div class="wrap"><div class="empty">${pixelDiamond('pixdia')}<h1 class="d2">lost it.</h1><p class="lede">that page doesn't exist, or the piece sold out and moved on.</p><a class="btn btn--lime" href="#/">back home</a></div></div>`;
}

export function searchResults(q) {
  q = q.trim().toLowerCase();
  if (!q) return `<div class="chips">${['tennis bracelet', 'black diamonds', 'iced', 'ear party', 'necklace', 'first diamond'].map(s => `<button class="chip" data-act="q" data-q="${s}">${s}</button>`).join('')}</div>`;
  const ps = PRODUCTS.filter(p => [p.name, p.type, p.cat, p.blurb, ...(p.tags || [])].join(' ').toLowerCase().includes(q));
  return ps.length ? `<p class="mono muted">${ps.length} result${ps.length > 1 ? 's' : ''}</p><div class="grid">${ps.map(p => card(p)).join('')}</div>` : `<p class="d4">no match for "${esc(q)}".</p><p class="muted">try "tennis", "black" or "ear party".</p>`;
}

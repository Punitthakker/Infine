// infine.store: router, chrome, bag drawer, search, checkout, little moments of delight.
import { BRAND, bySlug, PROMOS } from './data.js?v=202610181306';
import * as V from './views.js?v=202610181306';
import * as S from './store.js?v=202610181306';

const $ = (s, r = document) => r.querySelector(s);
const app = $('#app');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let route = { name: 'home', args: [] };
const sel = {}; let coStep = 1; const coForm = {}; let sortBy = 'featured';

/* ---------- chrome ---------- */
function chrome() {
  const n = S.totals().count, w = S.wish().length;
  $('#top').innerHTML = `
  <p class="announce">Complimentary same-day delivery in Dubai when you order by 2pm</p>
  <header class="hdr"><div class="wrap hdr__in">
    <div class="hdr__l"><button class="ib menu-btn" data-act="menu" aria-label="Menu">${V.ICON.menu}</button>
      <nav class="nav" aria-label="Main">${[['#/shop/rings', 'Rings', 'rings'], ['#/shop/earrings', 'Earrings', 'earrings'], ['#/shop/bracelets', 'Bracelets', 'bracelets'], ['#/shop/necklaces', 'Necklaces', 'necklaces'], ['#/shop/bands', 'Bands', 'bands']].map(([h, l, k]) => `<a href="${h}" data-nav="${k}">${l}</a>`).join('')}</nav></div>
    <a class="logo" href="#/" aria-label="infine. home">infine.</a>
    <div class="hdr__r">
      <button class="ib" data-act="search" aria-label="Search">${V.ICON.search}</button>
      <a class="ib" href="#/saved" aria-label="Wishlist, ${w} items">${V.ICON.heart}<span class="dot" data-n="${w}">${w}</span></a>
      <button class="ib" data-act="open-bag" aria-label="Bag, ${n} items">${V.ICON.bag}<span class="dot" data-n="${n}">${n}</span></button>
    </div></div></header>`;
  $('#bar').innerHTML = [['#/', 'Home', V.ICON.home, 'home'], ['#/shop', 'Shop', V.ICON.shop, 'shop'], ['#/saved', 'Wishlist', V.ICON.heart, 'saved'], ['#/bag', 'Bag', V.ICON.bag, 'bag']]
    .map(([h, l, i, k]) => `<a href="${h}" data-tab="${k}">${i}<span>${l}</span>${k === 'bag' ? `<span class="dot" data-n="${n}">${n}</span>` : ''}</a>`).join('');
  mark(); tick();
}
function mark() {
  const cat = route.name === 'shop' ? (route.args[0] || 'all') : route.name === 'product' ? bySlug(route.args[0])?.cat : '';
  document.querySelectorAll('[data-nav]').forEach(a => a.dataset.nav === cat ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  const tab = route.name === 'product' ? 'shop' : route.name;
  document.querySelectorAll('[data-tab]').forEach(a => a.dataset.tab === tab ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
}
const footer = () => `<footer><div class="wrap foot">
  <div class="foot__cols">
    <div><h4>Shop</h4><a href="#/shop/rings">Rings</a><a href="#/shop/bands">Stacking bands</a><a href="#/shop/earrings">Huggies & hoops</a><a href="#/shop/bracelets">Bracelets</a><a href="#/shop/necklaces">Necklaces</a><a href="#/shop/all/under5k">Gifts under AED 5,000</a></div>
    <div><h4>infine.</h4><a href="#/story">Our story</a><a href="#/" data-film-link>The film</a><a href="#/account">Account</a></div>
    <div><h4>Help</h4><a href="#/guide">Ring size finder</a><a href="#/guide">Care & FAQs</a><span>WhatsApp ${BRAND.whatsapp}</span></div>
    <div><h4>Visit</h4><span>Private viewings in ${BRAND.city}, by appointment</span><span>${BRAND.site}</span></div>
  </div>
  <div class="foot__mark" aria-hidden="true">infine.</div>
  <p class="small muted">© ${new Date().getFullYear()} infine. Lab-grown diamonds, solid 18k gold. Dubai, UAE.</p></div></footer>`;

/* ---------- router ---------- */
function parse() {
  const h = location.hash.replace(/^#\/?/, '');
  if (h === 'film') return { name: 'home', args: [], anchor: 'film' };
  const [n = '', ...args] = h.split('/').map(decodeURIComponent);
  const map = { '': 'home', shop: 'shop', p: 'product', bag: 'bag', checkout: 'checkout', order: 'done', saved: 'saved', account: 'account', story: 'story', guide: 'guide' };
  return { name: map[n] || '404', args };
}
function render(top = true) {
  route = parse(); const a = route.args;
  const html = { home: V.home, shop: () => V.shop(a[0] || 'all', a[1] || '', sortBy), product: () => V.product(a[0], sel[a[0]]), bag: V.bagPage, checkout: () => V.checkout(coStep, coForm), done: () => V.done(a[0]), saved: V.saved, account: V.account, story: V.story, guide: V.guide, 404: V.notFound }[route.name]();
  app.innerHTML = html + footer();
  const p = route.name === 'product' && bySlug(a[0]);
  document.title = route.name === 'home' ? 'infine. Made to be adored' : `${p ? p.name : { shop: 'Shop', bag: 'Your bag', checkout: 'Checkout', done: 'Order confirmed', saved: 'Wishlist', account: 'Account', story: 'Our story', guide: 'Care & sizing', 404: 'Not found' }[route.name]} | infine.`;
  mark(); tick(); wire();
  if (route.anchor) setTimeout(() => $('#film')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }), 50);
  else if (top) scrollTo(0, 0);
}
addEventListener('hashchange', () => { closeBag(); closeSearch(); closeMenu(); render(); });

/* ---------- same-day cut-off (2pm Dubai) ---------- */
function tick() {
  const now = new Date(), dubai = new Date(now.getTime() + (now.getTimezoneOffset() + 240) * 60000);
  const cut = new Date(dubai); cut.setHours(BRAND.cutoffHour, 0, 0, 0);
  if (dubai >= cut) cut.setDate(cut.getDate() + 1);
  const s = Math.floor((cut - dubai) / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const txt = `${h}h ${String(m).padStart(2, '0')}m ${String(sec).padStart(2, '0')}s`;
  const late = dubai.getHours() >= BRAND.cutoffHour;
  document.querySelectorAll('[data-cutoff-t]').forEach(b => { b.textContent = txt; });
  document.querySelectorAll('[data-cutoff-w]').forEach(w => { w.textContent = late ? 'for delivery tomorrow in Dubai' : 'for same-day delivery in Dubai'; });
}
setInterval(tick, 1000);

/* ---------- per-view wiring ---------- */
function wire() {
  const g = $('[data-gal]');
  if (g) g.addEventListener('scroll', () => { const i = Math.round(g.scrollLeft / g.clientWidth); document.querySelectorAll('.dots i').forEach((d, k) => d.classList.toggle('on', k === i)); }, { passive: true });
  const sb = $('[data-sticky]'), anchor = $('.buy [data-act="add"]');
  if (sb && anchor && 'IntersectionObserver' in window) new IntersectionObserver(([e]) => sb.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0)).observe(anchor);
  if (route.name === 'checkout' && coStep === 3) payToggle();
  const hv = $('.hero video'); if (hv && reduce) hv.pause();
  slideshow();
}

/* ---------- The Dubai edit slideshow ---------- */
let showTimer = 0, showVis = null;
document.addEventListener('visibilitychange', () => showVis?.());
function slideshow() {
  clearTimeout(showTimer);
  const root = $('[data-show]'); showVis = null; if (!root) return;
  const slides = [...root.querySelectorAll('[data-slide]')], dots = [...root.querySelectorAll('.edsh__dots button')], MS = 6000;
  let i = 0, paused = false, seen = false;
  root.style.setProperty('--edsh-ms', MS + 'ms');
  const go = (n, user) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { const on = k === i; s.classList.toggle('is-on', on); s.setAttribute('aria-hidden', String(!on)); s.querySelectorAll('a').forEach(a => on ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1')); if (on) s.querySelector('.edsh__img').loading = 'eager'; });
    slides[(i + 1) % slides.length].querySelector('.edsh__img').loading = 'eager';
    dots.forEach((d, k) => { d.classList.toggle('is-past', k < i); d.toggleAttribute('aria-current', false); if (k === i) { d.setAttribute('aria-current', 'true'); const b = d.querySelector('i'); b.style.animation = 'none'; b.offsetWidth; b.style.animation = ''; } });
    schedule();
  };
  const schedule = () => { clearTimeout(showTimer); if (!paused && seen && !reduce && !document.hidden && document.body.contains(root)) showTimer = setTimeout(() => go(i + 1), MS); };
  const pause = on => { paused = on; root.classList.toggle('paused', on); if (on) clearTimeout(showTimer); else schedule(); };
  root._go = go;
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { seen = e.isIntersecting; root.classList.toggle('paused', !seen || paused); seen ? schedule() : clearTimeout(showTimer); }, { threshold: .35 }).observe(root); else { seen = true; schedule(); }
  root.addEventListener('focusin', e => { if (e.target.matches(':focus-visible')) pause(true); }); root.addEventListener('focusout', e => { if (!root.contains(e.relatedTarget)) pause(false); });
  let x0 = null, y0 = 0;
  root.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  root.addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(i + (dx < 0 ? 1 : -1)); }, { passive: true });
  root.addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); });
  showVis = schedule;
  go(0);
}
function payToggle() { const f = $('[data-cardf]'), v = document.querySelector('input[name="pay"]:checked')?.value; if (f) f.hidden = v !== 'card'; }

/* ---------- overlays ---------- */
function openBag() { $('#bag-body').innerHTML = V.bagItems(); $('#bag-foot').innerHTML = V.bagFoot(); $('#drawer').classList.add('open'); $('#scrim').classList.add('open'); $('#drawer').setAttribute('aria-hidden', 'false'); }
function closeBag() { $('#drawer').classList.remove('open'); $('#scrim').classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); }
function refreshBag() {
  if ($('#drawer').classList.contains('open')) { $('#bag-body').innerHTML = V.bagItems(); $('#bag-foot').innerHTML = V.bagFoot(); }
  if (route.name === 'bag') { $('[data-bag-body]').innerHTML = V.bagItems(); $('[data-bag-foot]').innerHTML = V.bagFoot(); }
}
function openSearch() { $('#search').classList.add('open'); $('#q').value = ''; $('#results').innerHTML = V.searchResults(''); $('#q').focus(); }
function closeSearch() { $('#search').classList.remove('open'); }
function openMenu() { $('#menu').classList.add('open'); }
function closeMenu() { $('#menu').classList.remove('open'); }
let tt; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2400); }
function glint(el) {
  try { navigator.vibrate?.(12); } catch {}
  if (reduce) return;
  const r = el.getBoundingClientRect(), g = document.createElement('div'); g.className = 'glint'; g.style.left = r.left + r.width / 2 + 'px'; g.style.top = r.top + r.height / 2 + 'px';
  g.innerHTML = Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2, d = 50 + Math.random() * 60; return `<i style="--x:${Math.cos(a) * d}px;--y:${Math.sin(a) * d}px;animation-delay:${Math.random() * .08}s"></i>`; }).join('');
  document.body.appendChild(g); setTimeout(() => g.remove(), 1100);
}

/* ---------- add to bag ---------- */
function needsSize(p) { return p.sizes.length > 1; }
function add(slug, el, then = 'bag') {
  const p = bySlug(slug), s = sel[slug]?.size || (needsSize(p) ? '' : p.sizes[0]);
  if (!s) {
    if (route.name !== 'product' || route.args[0] !== slug) { location.hash = '#/p/' + slug; setTimeout(() => toast(`Choose your ${p.cat === 'bracelets' || p.cat === 'necklaces' ? 'length' : 'size'}`), 300); return false; }
    const e = $('[data-size-err]'); if (e) e.textContent = `Choose your ${p.cat === 'bracelets' || p.cat === 'necklaces' ? 'length' : 'size'} first.`;
    $('.optgroup')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); return false;
  }
  if (!S.addToBag(slug, s)) { toast('That is all we have of this one'); return false; }
  glint(el); if (then !== 'bag') toast(`${p.name} is in your bag`);
  if (then === 'bag') setTimeout(openBag, 350); if (then === 'checkout') { coStep = 1; location.hash = '#/checkout'; }
  return true;
}

/* ---------- events ---------- */
const okEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), okPhone = v => /^\+?[\d\s-]{8,}$/.test(v);
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) { document.querySelectorAll('.spot[aria-expanded="true"]').forEach(s => s.setAttribute('aria-expanded', 'false')); return; }
  const act = el.dataset.act;
  if (act === 'wish') { e.preventDefault(); const on = S.toggleWish(el.dataset.slug); document.querySelectorAll(`[data-act="wish"][data-slug="${el.dataset.slug}"]`).forEach(b => { b.setAttribute('aria-pressed', on); if (b.classList.contains('btn')) b.textContent = on ? 'Saved to your wishlist' : 'Save for later'; }); toast(on ? 'Saved to your wishlist' : 'Removed from your wishlist'); if (on) glint(el); if (route.name === 'saved') render(false); }
  if (act === 'quick') { e.preventDefault(); add(el.dataset.slug, el); }
  if (act === 'add') add(el.dataset.slug, el);
  if (act === 'buynow') add(el.dataset.slug, el, 'checkout');
  if (act === 'pair') { const a = bySlug(el.dataset.a), b = bySlug(el.dataset.b); if (needsSize(a) && !sel[a.slug]?.size) { add(a.slug, el); return; } S.addToBag(a.slug, sel[a.slug]?.size || a.sizes[0]); S.addToBag(b.slug, b.sizes.length > 1 ? b.sizes[Math.floor(b.sizes.length / 2)] : b.sizes[0]); glint(el); setTimeout(openBag, 350); }
  if (act === 'size') { const s = route.args[0]; sel[s] = { ...(sel[s] || {}), size: el.dataset.v }; document.querySelectorAll('[data-act="size"]').forEach(b => b.setAttribute('aria-pressed', b === el)); const er = $('[data-size-err]'); if (er) er.textContent = ''; }
  if (act === 'gift') S.setGift({ ...S.gift(), on: el.checked });
  if (act === 'open-bag') openBag();
  if (act === 'close-bag') closeBag();
  if (act === 'qty') { const it = S.bag().find(i => i.key === el.dataset.key); if (it) S.setQty(it.key, it.qty + Number(el.dataset.d)); refreshBag(); }
  if (act === 'search') openSearch();
  if (act === 'close-search') closeSearch();
  if (act === 'menu') openMenu();
  if (act === 'close-menu') closeMenu();
  if (act === 'q') { $('#q').value = el.dataset.q; $('#results').innerHTML = V.searchResults(el.dataset.q); }
  if (act === 'signout') { S.signOut(); render(); }
  if (act === 'back') { coStep = Math.max(1, coStep - 1); render(); }
  if (act === 'slide') { const r = el.closest('[data-show]'); if (r?._go) { const cur = [...r.querySelectorAll('[data-slide]')].findIndex(x => x.classList.contains('is-on')); r._go(el.dataset.to != null ? +el.dataset.to : cur + +el.dataset.dir, true); } return; }
  if (act === 'spot') { if (e.target.closest('.spot__card')) return; e.preventDefault(); const open = el.getAttribute('aria-expanded') === 'true'; document.querySelectorAll('.spot').forEach(s => s.setAttribute('aria-expanded', 'false')); el.setAttribute('aria-expanded', String(!open)); }
  if (act === 'film') { const v = $('[data-film]'); el.hidden = true; v.controls = true; v.muted = false; v.play().catch(() => { v.muted = true; v.play(); }); }
});
document.addEventListener('change', e => {
  if (e.target.matches('[data-act="sort"]')) { sortBy = e.target.value; render(false); }
  if (e.target.name === 'pay') payToggle();
});
document.addEventListener('input', e => {
  if (e.target.id === 'q') $('#results').innerHTML = V.searchResults(e.target.value);
  if (e.target.matches('[data-act="wrist"]')) { const w = +e.target.value, len = (w + 1.5) / 2.54, pick = [6, 6.5, 7, 7.5].reduce((a, b) => Math.abs(b - len) < Math.abs(a - len) ? b : a); $('[data-wrist-out]').textContent = `Wrist ${w} cm`; $('[data-wrist-size]').textContent = pick + '"'; }
  if (e.target.matches('[data-act="circ"]')) { const c = +e.target.value, us = Math.round(((c / Math.PI) - 11.63) / 0.8128 * 2) / 2 + 0; $('[data-circ-out]').textContent = `${c} mm around`; $('[data-circ-size]').textContent = 'US ' + Math.min(10, Math.max(3, us)); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeBag(); closeSearch(); closeMenu(); } });
$('#scrim').addEventListener('click', closeBag);

document.addEventListener('submit', e => {
  const f = e.target; if (!f.dataset.form) return; e.preventDefault();
  const err = f.querySelector('.err'), d = Object.fromEntries(new FormData(f)), fail = m => { if (err) err.textContent = m; };
  if (f.dataset.form === 'list') { const c = (d.c || '').trim(); if (!okEmail(c) && !okPhone(c)) return fail('Enter an email, or a WhatsApp number with country code.'); S.subscribe(c); f.outerHTML = '<p class="ok">You are on the list. Something beautiful is coming.</p>'; }
  if (f.dataset.form === 'promo') { const c = (d.code || '').trim().toUpperCase(); if (!PROMOS[c]) return fail(`"${c}" isn't a live code.`); S.setPromo(c); toast('Code applied'); render(false); }
  if (f.dataset.form === 'signin') { if (!d.name?.trim()) return fail('Add your name.'); if (!okEmail(d.email || '')) return fail('That email doesn\'t look right.'); S.signIn(d.name.trim(), d.email.trim()); render(); }
  if (f.dataset.form === 'co') {
    const step = +f.dataset.step;
    if (step === 1) { if (!d.first?.trim() || !d.last?.trim()) return fail('Add a first and last name for the delivery.'); if (!okEmail(d.email || '')) return fail('That email doesn\'t look right.'); if (!okPhone(d.phone || '')) return fail('Add a mobile number with country code, e.g. +971 50 123 4567.'); }
    if (step === 2) { if (!d.addr?.trim() || !d.area?.trim()) return fail('Add the building, street and area.'); S.setGift({ on: !!d.gift, note: d.note || '' }); }
    if (step === 3 && d.pay === 'card') { if ((d.cardno || '').replace(/\D/g, '').length < 15) return fail('The card number looks too short.'); if (!/^\d{2}\s*\/\s*\d{2}$/.test(d.exp || '')) return fail('Expiry should look like 08 / 29.'); if (!/^\d{3,4}$/.test(d.cvc || '')) return fail('The CVC is the 3 or 4 digits on the back.'); }
    Object.assign(coForm, d, { cardno: '', cvc: '' });
    if (step < 3) { coStep = step + 1; render(); return; }
    const shipCost = { dxb: 0, uae: 0, gcc: 95 }[coForm.ship || 'dxb'];
    const o = S.placeOrder({ first: coForm.first, email: coForm.email, phone: coForm.phone, ship: coForm.ship, shipCost, pay: d.pay });
    coStep = 1; location.hash = '#/order/' + o.id;
  }
});

/* ---------- opening veil (once per visit) ---------- */
(function veil() {
  const v = $('#veil'); if (!v) return;
  let seen = false; try { seen = sessionStorage.getItem('infine-store:veil') === '1'; sessionStorage.setItem('infine-store:veil', '1'); } catch {}
  if (seen || reduce) { v.remove(); return; }
  setTimeout(() => v.classList.add('out'), 1700); setTimeout(() => v.remove(), 2700);
})();

S.onChange(() => { chrome(); refreshBag(); });
chrome(); render(false);

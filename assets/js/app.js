// infine. storefront: hash router, chrome (header, tabs, bag drawer, search), interactions.
import { LAUNCH, bySlug, PROMOS } from './data.js';
import { ICON } from './brand.js';
import * as V from './views.js';
import * as S from './store.js';

const $ = (s, r = document) => r.querySelector(s);
const app = $('#app');
let route = { name: 'home', args: [] };
const pdpSel = {};             // selected options per product
let coStep = 1; const coForm = {};

/* ---------- chrome ---------- */
function chrome() {
  const n = S.totals().count, w = S.wish().length;
  $('#chrome-top').innerHTML = `
  <div class="ticker" aria-label="announcements"><div class="ticker__run">${Array(2).fill(`<span>drop 01: main character energy</span><span>early access open now</span><span>public drop ${new Date(LAUNCH.publicDrop).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'Asia/Dubai' }).toLowerCase()}, 8pm dubai</span><span>free same-day delivery in dubai</span><span>real diamonds, solid 18k gold</span>`).join('')}</div></div>
  <header class="hdr"><div class="wrap hdr__in">
    <a class="logo" href="#/" aria-label="infine home">infine<i>.</i></a>
    <nav class="nav" aria-label="main">${[['#/shop', 'shop', 'shop'], ['#/drops', 'drops', 'drops'], ['#/shop/black', 'black diamonds', 'black'], ['#/story', 'story', 'story'], ['#/guide', 'diamond 101', 'guide']]
      .map(([h, l, k]) => `<a href="${h}" data-nav="${k}">${l}</a>`).join('')}</nav>
    <div class="hdr__act">
      <button class="icon-btn" data-act="search" aria-label="search">${ICON.search}</button>
      <a class="icon-btn" href="#/account" aria-label="account">${ICON.user}</a>
      <a class="icon-btn" href="#/saved" aria-label="saved, ${w} items">${ICON.heart}<span class="count" data-n="${w}">${w}</span></a>
      <button class="icon-btn" data-act="open-bag" aria-label="bag, ${n} items">${ICON.bag}<span class="count" data-n="${n}">${n}</span></button>
    </div></div></header>`;
  $('#chrome-tabs').innerHTML = [['#/', 'home', ICON.home, 'home'], ['#/shop', 'shop', ICON.grid, 'shop'], ['#/drops', 'drops', ICON.drop, 'drops'], ['#/saved', 'saved', ICON.heart, 'saved'], ['#/bag', 'bag', ICON.bag, 'bag']]
    .map(([h, l, i, k]) => `<a href="${h}" data-tab="${k}">${i}<span>${l}</span>${k === 'bag' ? `<span class="count" data-n="${n}">${n}</span>` : ''}</a>`).join('');
  markNav();
}
function markNav() {
  const k = route.name === 'shop' && route.args[0] === 'black' ? 'black' : route.name === 'product' ? 'shop' : route.name;
  document.querySelectorAll('[data-nav]').forEach(a => a.dataset.nav === k ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  document.querySelectorAll('[data-tab]').forEach(a => a.dataset.tab === (k === 'black' ? 'shop' : k) ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
}
function footer() {
  return `<footer class="on-ink"><div class="wrap foot">
    <div class="foot__cols">
      <div><h4>shop</h4><a href="#/shop/bracelets">tennis bracelets</a><a href="#/shop/necklaces">tennis necklaces</a><a href="#/shop/ear">ear party</a><a href="#/shop/black">black diamonds</a><a href="#/shop/vault">the vault</a></div>
      <div><h4>infine</h4><a href="#/drops">drops</a><a href="#/story">story</a><a href="#/guide">diamond 101</a><a href="#/account">account</a></div>
      <div><h4>help</h4><a href="#/guide">sizing</a><a href="#/guide">care + faqs</a><span class="mono small muted" style="display:block;padding:5px 0">whatsapp ${LAUNCH.whatsapp}</span></div>
      <div><h4>follow</h4><span style="display:block;padding:5px 0">${LAUNCH.handle}</span><span class="mono small muted">instagram · tiktok</span></div>
    </div>
    <div class="foot__mark" aria-hidden="true">infine<i>.</i></div>
    <p class="mono small muted">© ${new Date().getFullYear()} infine. real diamonds, solid 18k gold. dubai, uae.</p>
  </div></footer>`;
}

/* ---------- router ---------- */
function parse() {
  const h = location.hash.replace(/^#\/?/, '');
  const [name = '', ...args] = h.split('/').map(decodeURIComponent);
  const map = { '': 'home', shop: 'shop', p: 'product', drops: 'drops', bag: 'bag', checkout: 'checkout', order: 'done', saved: 'saved', account: 'account', story: 'story', guide: 'guide' };
  return { name: map[name] || '404', args };
}
let shopSort = 'featured';
function render(scrollTop = true) {
  route = parse();
  const r = route, a = r.args;
  const html = {
    home: () => V.home(), shop: () => V.shop(a[0] || 'all', shopSort), product: () => V.product(a[0], pdpSel[a[0]]), drops: () => V.drops(),
    bag: () => V.bagPage(), checkout: () => V.checkout(coStep, coForm), done: () => V.done(a[0]), saved: () => V.saved(), account: () => V.account(),
    story: () => V.story(), guide: () => V.guide(), 404: () => V.notFound(),
  }[r.name]();
  app.innerHTML = html + footer();
  const titles = { home: 'infine. real diamonds, new rules', shop: 'shop', product: bySlug(a[0])?.name, drops: 'drops', bag: 'bag', checkout: 'checkout', done: 'order confirmed', saved: 'saved', account: 'account', story: 'story', guide: 'diamond 101', 404: 'not found' };
  document.title = r.name === 'home' ? titles.home : `${titles[r.name] || 'infine'} | infine.`;
  markNav(); tick(); wire();
  if (scrollTop) window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}
window.addEventListener('hashchange', () => render());

/* ---------- countdowns ---------- */
function tick() {
  document.querySelectorAll('[data-until]').forEach(el => {
    let s = Math.max(0, Math.floor((Date.parse(el.dataset.until) - Date.now()) / 1000));
    const d = Math.floor(s / 86400); s -= d * 86400; const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s -= m * 60;
    const set = (u, v) => { const b = el.querySelector(`[data-u="${u}"]`); const t = String(v).padStart(2, '0'); if (b && b.textContent !== t) b.textContent = t; };
    set('d', d); set('h', h); set('m', m); set('s', s);
  });
}
setInterval(tick, 1000);

/* ---------- per-view wiring ---------- */
function wire() {
  const g = $('[data-gallery]');
  if (g) g.addEventListener('scroll', () => { const i = Math.round(g.scrollLeft / g.clientWidth); document.querySelectorAll('.dots i').forEach((d, k) => d.classList.toggle('on', k === i)); }, { passive: true });
  const sb = $('[data-stickybuy]'), anchor = $('.buy [data-act="add"]');
  if (sb && anchor && 'IntersectionObserver' in window) new IntersectionObserver(([e]) => sb.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0)).observe(anchor);
  if (route.name === 'checkout' && coStep === 3) payToggle();
}
function payToggle() { const f = $('[data-cardfields]'); const v = document.querySelector('input[name="pay"]:checked')?.value; if (f) f.hidden = v !== 'card'; }

/* ---------- bag drawer ---------- */
function openBag() {
  $('#drawer-body').innerHTML = V.bagItems(); $('#drawer-foot').innerHTML = V.bagFoot();
  $('#drawer').classList.add('open'); $('#scrim').classList.add('open'); $('#drawer').setAttribute('aria-hidden', 'false'); $('#drawer [data-act="close-bag"]').focus();
}
function closeBag() { $('#drawer').classList.remove('open'); $('#scrim').classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); }
function refreshBag() {
  if ($('#drawer').classList.contains('open')) { $('#drawer-body').innerHTML = V.bagItems(); $('#drawer-foot').innerHTML = V.bagFoot(); }
  if (route.name === 'bag') { $('[data-bag-body]').innerHTML = V.bagItems(); $('[data-bag-foot]').innerHTML = V.bagFoot(); }
}

/* ---------- toast ---------- */
let tt; function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2400); }

/* ---------- search ---------- */
function openSearch() { $('#search').classList.add('open'); $('#q').value = ''; $('#results').innerHTML = V.searchResults(''); $('#q').focus(); }
function closeSearch() { $('#search').classList.remove('open'); }

/* ---------- events ---------- */
const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const validPhone = v => /^\+?[\d\s-]{8,}$/.test(v);

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act;
  if (act === 'wish') { e.preventDefault(); const on = S.toggleWish(el.dataset.slug); document.querySelectorAll(`[data-act="wish"][data-slug="${el.dataset.slug}"]`).forEach(b => { b.setAttribute('aria-pressed', on); if (b.classList.contains('btn')) b.textContent = on ? 'saved' : 'save for later'; }); toast(on ? 'saved' : 'removed from saved'); if (route.name === 'saved') render(false); }
  if (act === 'opt') { const p = route.args[0]; pdpSel[p] = { ...(pdpSel[p] || {}), [el.dataset.k]: el.dataset.v }; const y = scrollY; render(false); scrollTo(0, y); }
  if (act === 'add') {
    const p = bySlug(el.dataset.slug), s = pdpSel[p.slug] || {};
    const before = S.bag().find(i => i.key === [p.slug, s.size || p.sizes[0].label, s.metal || p.metals[0], s.length || p.lengths[Math.min(1, p.lengths.length - 1)]].join('|'))?.qty || 0;
    S.addToBag(p.slug, s.size || p.sizes[0].label, s.metal || p.metals[0], s.length || p.lengths[Math.min(1, p.lengths.length - 1)]);
    const after = S.bag().find(i => i.slug === p.slug && i.size === (s.size || p.sizes[0].label) && i.metal === (s.metal || p.metals[0]))?.qty || 0;
    if (after === before) toast('max 2 per drop piece'); else { toast(`${p.name} added to bag`); openBag(); }
  }
  if (act === 'open-bag') openBag();
  if (act === 'close-bag') closeBag();
  if (act === 'qty') { const it = S.bag().find(i => i.key === el.dataset.key); if (it) S.setQty(it.key, it.qty + Number(el.dataset.d)); refreshBag(); }
  if (act === 'search') openSearch();
  if (act === 'close-search') closeSearch();
  if (act === 'q') { $('#q').value = el.dataset.q; $('#results').innerHTML = V.searchResults(el.dataset.q); }
  if (act === 'signout') { S.signOut(); render(); toast('signed out'); }
  if (act === 'co-back') { coStep = Math.max(1, coStep - 1); render(); }
});
document.addEventListener('change', e => {
  if (e.target.matches('[data-act="sort"]')) { shopSort = e.target.value; render(false); }
  if (e.target.name === 'pay') payToggle();
});
document.addEventListener('input', e => {
  if (e.target.id === 'q') $('#results').innerHTML = V.searchResults(e.target.value);
  if (e.target.matches('[data-act="wrist"]')) {
    const w = parseFloat(e.target.value), len = (w + 1.5) / 2.54, opts = [6, 6.5, 7, 7.5]; const pick = opts.reduce((a, b) => Math.abs(b - len) < Math.abs(a - len) ? b : a);
    $('[data-wrist-out]').textContent = `wrist ${w} cm`; $('[data-wrist-size]').textContent = pick + '"';
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeBag(); closeSearch(); } });
$('#scrim').addEventListener('click', closeBag);

document.addEventListener('submit', e => {
  const f = e.target; if (!f.dataset.form) return; e.preventDefault();
  const err = f.querySelector('.err'), data = Object.fromEntries(new FormData(f)); const fail = m => { if (err) err.textContent = m; };
  if (f.dataset.form === 'alert') {
    const c = (data.contact || '').trim();
    if (!validEmail(c) && !validPhone(c)) return fail('enter a whatsapp number with country code (+971...) or an email.');
    S.addAlert(f.dataset.drop, c); f.outerHTML = `<p class="ok">you're on the list. we'll message you before it opens.</p>`; toast('you\'re on the list');
  }
  if (f.dataset.form === 'promo') {
    const c = (data.code || '').trim().toUpperCase();
    if (!PROMOS[c]) return fail(`"${c || ' '}" isn't a live code. check the spelling.`);
    S.setPromo(c); toast('code applied'); render(false);
  }
  if (f.dataset.form === 'signin') {
    if (!data.name?.trim()) return fail('add your name.'); if (!validEmail(data.email || '')) return fail('that email doesn\'t look right.');
    S.signIn(data.name.trim(), data.email.trim()); toast('signed in'); render();
  }
  if (f.dataset.form === 'co') {
    const step = Number(f.dataset.step);
    if (step === 1) {
      if (!data.first?.trim() || !data.last?.trim()) return fail('add a first and last name for the delivery.');
      if (!validEmail(data.email || '')) return fail('that email doesn\'t look right.');
      if (!validPhone(data.phone || '')) return fail('add a mobile number with country code, e.g. +971 50 123 4567.');
    }
    if (step === 2) {
      if (!data.addr?.trim() || !data.area?.trim()) return fail('add the building, street and area.');
      data.gift = !!data.gift;
    }
    if (step === 3 && data.pay === 'card') {
      if ((data.cardno || '').replace(/\D/g, '').length < 15) return fail('the card number is too short.');
      if (!/^\d{2}\s*\/\s*\d{2}$/.test(data.exp || '')) return fail('expiry should look like 08 / 29.');
      if (!/^\d{3,4}$/.test(data.cvc || '')) return fail('the cvc is the 3 or 4 digits on the back.');
    }
    Object.assign(coForm, data, { cardno: '', cvc: '' });
    if (step < 3) { coStep = step + 1; render(); return; }
    const shipCost = { dxb: 0, uae: 0, gcc: 75 }[coForm.ship || 'dxb'];
    const o = S.placeOrder({ first: coForm.first, email: coForm.email, phone: coForm.phone, ship: coForm.ship, shipCost, gift: coForm.gift, pay: data.pay });
    coStep = 1; location.hash = '#/order/' + o.id;
  }
});

S.onChange(() => { chrome(); refreshBag(); });
chrome(); render(false);

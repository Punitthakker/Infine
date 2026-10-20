// infine. storefront: hash router, chrome (header, tabs, bag drawer, search), interactions.
import { LAUNCH, bySlug, PROMOS } from './data.js?v=202610201241';
import { ICON } from './brand.js?v=202610201241';
import * as V from './views.js?v=202610201241';
import * as S from './store.js?v=202610201241';
import * as C from './commerce.js?v=202610201241';

const $ = (s, r = document) => r.querySelector(s);
const app = $('#app');
let route = { name: 'home', args: [] };
const pdpSel = {};             // selected options per product
let coStep = 1; const coForm = {};

/* ---------- chrome ---------- */
function chrome() {
  const n = S.totals().count, w = S.wish().length;
  $('#chrome-top').innerHTML = `
  <div class="ticker" aria-label="announcements"><div class="ticker__run">${Array(2).fill(`<span>drop 01: main character energy</span><span>early access open now</span><span>public drop ${new Date(LAUNCH.publicDrop).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'Asia/Dubai' }).toLowerCase()}, 8pm dubai</span><span>free same-day delivery in dubai</span><span>lab-grown diamonds, solid 18k gold</span>`).join('')}</div></div>
  <header class="hdr"><div class="wrap hdr__in">
    <a class="logo" href="#/" aria-label="infine home">infine<i>.</i></a>
    <nav class="nav" aria-label="main">${[['#/shop', 'shop', 'shop'], ['#/drops', 'drops', 'drops'], ['#/shop/iced', 'iced out', 'iced'], ['#/shop/black', 'black diamonds', 'black'], ['#/story', 'story', 'story'], ['#/guide', 'diamond 101', 'guide']]
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
      <div><h4>shop</h4><a href="#/shop/bracelets">tennis bracelets</a><a href="#/shop/necklaces">tennis necklaces</a><a href="#/shop/ear">ear party</a><a href="#/shop/black">black diamonds</a><a href="#/shop/iced">iced out</a></div>
      <div><h4>infine</h4><a href="#/drops">drops</a><a href="#/story">story</a><a href="#/guide">diamond 101</a><a href="#/account">account</a></div>
      <div><h4>help</h4><a href="#/guide">sizing</a><a href="#/guide">care + faqs</a><span class="mono small muted" style="display:block;padding:5px 0">whatsapp ${LAUNCH.whatsapp}</span></div>
      <div><h4>follow</h4><span style="display:block;padding:5px 0">${LAUNCH.handle}</span><span class="mono small muted">instagram · tiktok</span></div>
    </div>
    <div class="foot__mark" aria-hidden="true">infine<i>.</i></div>
    <p class="mono small muted">© ${new Date().getFullYear()} infine. lab-grown diamonds, solid 18k gold. dubai, uae.</p>
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
  const titles = { home: 'infine. lab-grown diamonds, new rules', shop: 'shop', product: bySlug(a[0])?.name, drops: 'drops', bag: 'bag', checkout: 'checkout', done: 'order confirmed', saved: 'saved', account: 'account', story: 'story', guide: 'diamond 101', 404: 'not found' };
  document.title = r.name === 'home' ? titles.home : `${titles[r.name] || 'infine'} | infine.`;
  markNav(); tick(); wire();
  if (scrollTop) window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}
window.addEventListener('hashchange', () => { closeBag(); closeSearch(); render(); });

/* ---------- countdowns ---------- */
function tick() {
  document.querySelectorAll('[data-until]').forEach(el => {
    let s = Math.max(0, Math.floor((Date.parse(el.dataset.until) - Date.now()) / 1000));
    const d = Math.floor(s / 86400); s -= d * 86400; const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s -= m * 60;
    const set = (u, v) => { const b = el.querySelector(`[data-u="${u}"]`); const t = String(v).padStart(2, '0'); if (b && b.textContent !== t) { b.textContent = t; b.classList.remove('flip'); void b.offsetWidth; b.classList.add('flip'); } };
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

/* ---------- diamond burst (add to bag) ---------- */
function burst(from) {
  try { navigator.vibrate?.(18); } catch {}
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas'), x = c.getContext('2d'); const dpr = Math.min(2, devicePixelRatio || 1);
  c.className = 'burst'; c.width = innerWidth * dpr; c.height = innerHeight * dpr; document.body.appendChild(c); x.scale(dpr, dpr);
  const r = from.getBoundingClientRect(), ox = r.left + r.width / 2, oy = r.top + r.height / 2;
  const cols = ['#FFFFFF', '#D7FF3A', '#FD4FA6', '#CBB5FE', '#A9D8FF'];
  const ps = Array.from({ length: 42 }, () => { const a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 9; return { x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, s: 6 + Math.random() * 9, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: cols[Math.floor(Math.random() * cols.length)] }; });
  let t = 0;
  (function frame() {
    x.clearRect(0, 0, innerWidth, innerHeight); t++;
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .42; p.vx *= .985; p.r += p.vr;
      x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.globalAlpha = Math.max(0, 1 - t / 70); x.fillStyle = p.c;
      x.beginPath(); x.moveTo(0, -p.s * .55); x.lineTo(p.s * .5, -p.s * .1); x.lineTo(0, p.s * .6); x.lineTo(-p.s * .5, -p.s * .1); x.closePath(); x.fill(); x.restore(); });
    if (t < 70) requestAnimationFrame(frame); else c.remove();
  })();
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
    if (after === before) toast('max 2 per drop piece'); else { burst(el); toast(`${p.name} added to bag`); setTimeout(openBag, 380); }
  }
  if (act === 'add-bundle') {
    [el.dataset.a, el.dataset.b].forEach(sl => { const p = bySlug(sl), s = (sl === el.dataset.a && pdpSel[sl]) || {}; S.addToBag(sl, s.size || p.sizes[0].label, s.metal || p.metals[0], s.length || p.lengths[Math.min(1, p.lengths.length - 1)]); });
    burst(el); toast('stack added to bag'); setTimeout(openBag, 380);
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
    if (step === 3 && data.pay === 'card' && !C.live()) {
      if ((data.cardno || '').replace(/\D/g, '').length < 15) return fail('the card number is too short.');
      if (!/^\d{2}\s*\/\s*\d{2}$/.test(data.exp || '')) return fail('expiry should look like 08 / 29.');
      if (!/^\d{3,4}$/.test(data.cvc || '')) return fail('the cvc is the 3 or 4 digits on the back.');
    }
    Object.assign(coForm, data, { cardno: '', cvc: '' });
    if (step < 3) { coStep = step + 1; render(); return; }
    const shipCost = { dxb: 0, uae: 0, gcc: 75 }[coForm.ship || 'dxb'];
    const details = { first: coForm.first, email: coForm.email, phone: coForm.phone, ship: coForm.ship, shipCost, gift: coForm.gift, pay: data.pay };
    if (!C.live()) { const o = S.placeOrder(details); coStep = 1; location.hash = '#/order/' + o.id; return; }
    const btn = f.querySelector('button[type="submit"]'); btn.disabled = true; btn.dataset.label = btn.innerHTML; btn.textContent = 'placing your order...';
    C.checkout(S.bag(), coForm, S.totals().code)
      .then(remote => { const o = S.placeOrder(details, remote); coStep = 1; location.hash = '#/order/' + o.id; C.sync().catch(() => {}); })
      .catch(x => { btn.disabled = false; btn.innerHTML = btn.dataset.label; fail(x.message || 'something went wrong. try again or message us on whatsapp.'); });
  }
});

S.onChange(() => { chrome(); refreshBag(); });

/* ---------- hero parallax (pointer) ---------- */
addEventListener('pointermove', e => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || e.pointerType !== 'mouse') return;
  const dx = e.clientX / innerWidth - .5, dy = e.clientY / innerHeight - .5;
  document.querySelectorAll('.hero__orbit').forEach(o => o.style.transform = `translate(${dx * -24}px, ${dy * -18}px)`);
  document.querySelectorAll('.fan__card').forEach((c, i) => c.style.translate = `${dx * (10 + i * 8)}px ${dy * (8 + i * 6)}px`);
}, { passive: true });

/* ---------- opening reveal (once per visit) ---------- */
(function intro() {
  let seen = false; try { seen = sessionStorage.getItem('infine:intro') === '1'; sessionStorage.setItem('infine:intro', '1'); } catch {}
  const el = document.getElementById('intro'); if (!el) return;
  if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) { el.remove(); return; }
  el.hidden = false; setTimeout(() => el.classList.add('out'), 1500); setTimeout(() => el.remove(), 2100);
})();
chrome(); render(false);
C.sync().then(ok => { if (ok) render(false); }).catch(e => console.warn('infine: live catalogue unavailable, showing built-in data.', e));

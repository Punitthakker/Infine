// Client-side state: bag, wishlist, orders. localStorage when available, memory otherwise.
// Swap for your commerce backend later; keep these function names and the views won't change.
import { bySlug, PROMOS } from './data.js?v=202610181306';

const mem = {};
const read = (k, d) => { try { const v = localStorage.getItem('infine-store:' + k); return v ? JSON.parse(v) : (mem[k] ?? d); } catch { return mem[k] ?? d; } };
const write = (k, v) => { mem[k] = v; try { localStorage.setItem('infine-store:' + k, JSON.stringify(v)); } catch { /* blocked */ } };
const subs = new Set();
export const onChange = fn => (subs.add(fn), () => subs.delete(fn));
const emit = () => subs.forEach(fn => fn());

export const bag = () => read('bag', []);
export function addToBag(slug, size) {
  const items = bag(), key = slug + '|' + size, p = bySlug(slug), max = Math.min(3, p.left);
  const ex = items.find(i => i.key === key);
  if (ex) { if (ex.qty >= max) return false; ex.qty++; } else items.push({ key, slug, size, qty: 1 });
  write('bag', items); emit(); return true;
}
export function setQty(key, qty) {
  let items = bag(); const it = items.find(i => i.key === key); if (!it) return;
  const max = Math.min(3, bySlug(it.slug).left);
  if (qty <= 0) items = items.filter(i => i.key !== key); else it.qty = Math.min(max, qty);
  write('bag', items); emit();
}
export const lineOf = it => { const p = bySlug(it.slug); return { p, total: p.price * it.qty }; };
export function totals() {
  const items = bag(), code = read('promo', ''), sub = items.reduce((a, it) => a + lineOf(it).total, 0);
  const rate = PROMOS[code] || 0, off = Math.round(sub * rate);
  return { count: items.reduce((a, i) => a + i.qty, 0), sub, off, code: rate ? code : '', total: sub - off };
}
export const setPromo = c => { if (!PROMOS[c]) return false; write('promo', c); emit(); return true; };
export const gift = () => read('gift', { on: false, note: '' });
export const setGift = g => { write('gift', g); emit(); };

export const wish = () => read('wish', []);
export const isWished = s => wish().includes(s);
export function toggleWish(s) { const w = wish(), on = !w.includes(s); write('wish', on ? [...w, s] : w.filter(x => x !== s)); emit(); return on; }

export const me = () => read('me', null);
export const signIn = (name, email) => { write('me', { name, email }); emit(); };
export const signOut = () => { write('me', null); emit(); };
export const orders = () => read('orders', []);
export function placeOrder(details) {
  const t = totals(), id = 'INF-' + String(Date.now()).slice(-6);
  const order = { id, at: Date.now(), items: bag(), ...t, gift: gift(), details };
  write('orders', [order, ...orders()]); write('promo', ''); write('bag', []); write('gift', { on: false, note: '' }); emit();
  return order;
}
export const subscribe = c => write('list', [...read('list', []), { c, at: Date.now() }]);

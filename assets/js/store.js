// Client-side state: bag, wishlist, orders, drop alerts. localStorage when available,
// in-memory otherwise (private windows, embedded previews). Swap for a real backend later.
import { bySlug, PROMOS } from './data.js?v=202610181016';

const mem = {};
const read = (k, d) => { try { const v = localStorage.getItem('infine:' + k); return v ? JSON.parse(v) : (mem[k] ?? d); } catch { return mem[k] ?? d; } };
const write = (k, v) => { mem[k] = v; try { localStorage.setItem('infine:' + k, JSON.stringify(v)); } catch { /* storage blocked */ } };

const subs = new Set();
export const onChange = fn => (subs.add(fn), () => subs.delete(fn));
const emit = () => subs.forEach(fn => fn());

// ---- Bag ----
export const bag = () => read('bag', []);
export function addToBag(slug, size, metal, length, qty = 1) {
  const items = bag(); const key = [slug, size, metal, length].join('|');
  const p = bySlug(slug); const max = Math.min(2, p.left); // drop rule: max 2 per piece
  const ex = items.find(i => i.key === key);
  if (ex) ex.qty = Math.min(max, ex.qty + qty); else items.push({ key, slug, size, metal, length, qty: Math.min(max, qty) });
  write('bag', items); emit();
}
export function setQty(key, qty) {
  let items = bag(); const it = items.find(i => i.key === key); if (!it) return;
  const max = Math.min(2, bySlug(it.slug).left);
  if (qty <= 0) items = items.filter(i => i.key !== key); else it.qty = Math.min(max, qty);
  write('bag', items); emit();
}
export const clearBag = () => { write('bag', []); emit(); };
export const lineOf = it => { const p = bySlug(it.slug); const s = p.sizes.find(x => x.label === it.size) || p.sizes[0]; return { p, s, total: s.price * it.qty }; };
export function totals(code = read('promo', '')) {
  const items = bag(); const sub = items.reduce((a, it) => a + lineOf(it).total, 0);
  const rate = PROMOS[code] || 0; const off = Math.round(sub * rate);
  return { count: items.reduce((a, i) => a + i.qty, 0), sub, off, code: rate ? code : '', ship: 0, total: sub - off };
}
export const setPromo = c => { write('promo', c); emit(); return !!PROMOS[c]; };

// ---- Wishlist ----
export const wish = () => read('wish', []);
export const isWished = s => wish().includes(s);
export function toggleWish(s) { const w = wish(); write('wish', w.includes(s) ? w.filter(x => x !== s) : [...w, s]); emit(); return !w.includes(s); }

// ---- Drop alerts ----
export const alerts = () => read('alerts', []);
export function addAlert(dropId, contact) { const a = alerts(); if (!a.find(x => x.dropId === dropId)) a.push({ dropId, contact, at: Date.now() }); write('alerts', a); emit(); }
export const hasAlert = id => alerts().some(a => a.dropId === id);

// ---- Account + orders (demo) ----
export const me = () => read('me', null);
export const signIn = (name, email) => { write('me', { name, email }); emit(); };
export const signOut = () => { write('me', null); emit(); };
export const orders = () => read('orders', []);
export function placeOrder(details) {
  const t = totals(); const id = 'INF-' + String(Date.now()).slice(-6);
  const order = { id, at: Date.now(), items: bag(), ...t, details };
  write('orders', [order, ...orders()]); write('promo', ''); clearBag();
  return order;
}

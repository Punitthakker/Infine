// Renders tennis jewellery as SVG: the brand's signature "line" graphic and product art
// for pieces without photography yet. Pure function, no dependencies.

let uid = 0;
// colour blocks from the brand posters
export const GROUNDS = { ink: ['#222222', '#0E0E0E'], lime: ['#E9FF8A', '#C8F21C'], lilac: ['#E0D2FF', '#B79CF9'], pink: ['#FF86C3', '#E83A92'], white: ['#FFFFFF', '#E9E9EE'] };
const METAL = {
  white: ['#F4F6FA', '#AEB5C2'], yellow: ['#F6DE9C', '#B88A35'], rose: ['#F6CDBE', '#B87763'], black: ['#55555E', '#1C1C22'],
};
const metalFor = s => (s === 'rose' ? 'rose' : s === 'black' ? 'black' : 'white');

function rng(seed) { let s = seed % 2147483647 || 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

function defs(id, ground) {
  return `<defs>
  <radialGradient id="w${id}" cx="42%" cy="38%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#E4E9F2"/><stop offset=".8" stop-color="#9AA3B6"/><stop offset="1" stop-color="#5E6578"/></radialGradient>
  <radialGradient id="b${id}" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#6A6A76"/><stop offset=".35" stop-color="#26262E"/><stop offset="1" stop-color="#060608"/></radialGradient>
  <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".5" stop-color="#D5DCE8"/><stop offset="1" stop-color="#8790A3"/></linearGradient>
  <radialGradient id="sp${id}" cx="50%" cy="42%" r="65%"><stop offset="0" stop-color="${ground[0]}"/><stop offset="1" stop-color="${ground[1]}"/></radialGradient>
  <filter id="gl${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
  </defs>`;
}

function brilliant(id, x, y, r, black, metal, dim = 1, spark = false) {
  const [m1, m2] = METAL[metal];
  const fill = black ? `url(#b${id})` : `url(#w${id})`;
  let s = `<g opacity="${dim}">`;
  // prongs
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + k * Math.PI / 2;
    s += `<circle cx="${(x + Math.cos(a) * r * .95).toFixed(1)}" cy="${(y + Math.sin(a) * r * .95).toFixed(1)}" r="${(r * .2).toFixed(1)}" fill="${m1}" stroke="${m2}" stroke-width=".6"/>`;
  }
  s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * 1.06).toFixed(1)}" fill="${m2}"/>`;
  s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${fill}"/>`;
  // facets: table octagon + star lines
  const t = r * .48; let pts = '';
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4 + Math.PI / 8; pts += `${(x + Math.cos(a) * t).toFixed(1)},${(y + Math.sin(a) * t).toFixed(1)} `; }
  const fc = black ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.75)';
  s += `<polygon points="${pts}" fill="${black ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.35)'}" stroke="${fc}" stroke-width=".5"/>`;
  for (let k = 0; k < 8; k++) {
    const a = k * Math.PI / 4 + Math.PI / 8;
    s += `<line x1="${(x + Math.cos(a) * t).toFixed(1)}" y1="${(y + Math.sin(a) * t).toFixed(1)}" x2="${(x + Math.cos(a + Math.PI / 8) * r * .97).toFixed(1)}" y2="${(y + Math.sin(a + Math.PI / 8) * r * .97).toFixed(1)}" stroke="${fc}" stroke-width=".45"/>`;
  }
  if (spark) {
    const L = r * 2.4;
    s += `<g class="spark" filter="url(#gl${id})"><circle cx="${x - r * .3}" cy="${y - r * .35}" r="${r * .35}" fill="#fff"/></g>
    <path d="M${x - r * .3 - L} ${y - r * .35}Q${x - r * .3} ${y - r * .35 - 1} ${x - r * .3 + L} ${y - r * .35}Q${x - r * .3} ${y - r * .35 + 1} ${x - r * .3 - L} ${y - r * .35}Z" fill="#fff" class="spark"/>
    <path d="M${x - r * .3} ${y - r * .35 - L}Q${x - r * .3 + 1} ${y - r * .35} ${x - r * .3} ${y - r * .35 + L}Q${x - r * .3 - 1} ${y - r * .35} ${x - r * .3} ${y - r * .35 - L}Z" fill="#fff" class="spark"/>`;
  }
  return s + '</g>';
}

function baguette(id, x, y, w, h, ang, metal, dim = 1) {
  const [m1, m2] = METAL[metal];
  return `<g opacity="${dim}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(ang * 180 / Math.PI).toFixed(1)})">
  <rect x="${-w / 2 - 1.5}" y="${-h / 2 - 1.5}" width="${w + 3}" height="${h + 3}" rx="1.5" fill="${m1}" stroke="${m2}" stroke-width=".6"/>
  <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="url(#g${id})"/>
  <rect x="${-w / 2 + w * .18}" y="${-h / 2 + h * .2}" width="${w * .64}" height="${h * .6}" fill="rgba(255,255,255,.35)" stroke="rgba(255,255,255,.8)" stroke-width=".5"/>
  <line x1="${-w / 2}" y1="${-h / 2}" x2="${-w / 2 + w * .18}" y2="${-h / 2 + h * .2}" stroke="rgba(255,255,255,.7)" stroke-width=".5"/>
  <line x1="${w / 2}" y1="${h / 2}" x2="${w / 2 - w * .18}" y2="${h / 2 - h * .2}" stroke="rgba(80,90,110,.6)" stroke-width=".5"/>
  </g>`;
}

// Stone colour for index i given a stone style.
const isBlack = (st, i) => st === 'black' || (st === 'saltpepper' && i % 2 === 1);

export function jewelSVG(art = {}, opts = {}) {
  const id = ++uid; const W = 400, H = opts.tall ? 711 : 500;
  const st = art.stones || 'white', metal = metalFor(st), R = rng((art.kind || 'x').length * 97 + st.length * 13 + (art.angle || 0) * 31);
  const ground = GROUNDS[opts.bg] || GROUNDS.ink;
  let body = '';
  const cx = W / 2, cy = H / 2;

  if (art.kind === 'bracelet') {
    // Ellipse in perspective; back half first, smaller and dimmer.
    const a = art.fine ? 128 : 132, b = art.angle ? 96 : 62, n = art.fine ? 46 : st === 'baguette' ? 30 : 38;
    const r0 = art.fine ? 6.2 : 8.6;
    const items = [];
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2;
      const x = cx + Math.cos(t) * a, y = cy + Math.sin(t) * b, depth = (Math.sin(t) + 1) / 2; // 0 back, 1 front
      items.push({ i, t, x, y, depth });
    }
    items.sort((p, q) => p.depth - q.depth);
    // band shadow
    body += `<ellipse cx="${cx}" cy="${cy + b + 34}" rx="${a * .9}" ry="10" fill="rgba(0,0,0,.45)" filter="url(#gl${id})"/>`;
    items.forEach(({ i, t, x, y, depth }) => {
      const sc = .72 + depth * .38, dim = .55 + depth * .45;
      if (st === 'baguette') body += baguette(id, x, y, 13 * sc, 22 * sc, t + Math.PI / 2, 'white', dim);
      else body += brilliant(id, x, y, r0 * sc, isBlack(st, i), metal, dim, depth > .8 && R() > .7);
    });
    // clasp at front
    const [m1, m2] = METAL[metal];
    body += `<rect x="${cx - 11}" y="${cy + b - 6}" width="22" height="12" rx="2" fill="${m1}" stroke="${m2}" stroke-width="1"/>`;
  } else if (art.kind === 'necklace') {
    // Catenary-like U with graduated stones toward the centre.
    const n = 31, top = H * .12, bottom = H * .74, half = W * .42;
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1) * 2 - 1; // -1..1
      const x = cx + u * half * Math.cos(u * .35), y = top + (bottom - top) * (1 - Math.pow(Math.abs(u), 1.7));
      const r = 4.5 + (1 - Math.abs(u)) * 6.5;
      if (st === 'baguette') {
        const slope = Math.atan2(-(bottom - top) * 1.7 * Math.sign(u) * Math.pow(Math.abs(u) + 1e-6, .7), half);
        body += baguette(id, x, y, r * 1.2, r * 2.1, slope, 'white');
        if (i % 2 === 0) body += brilliant(id, x, y + r * 2.6, r * .75, false, 'white', .95);
      } else body += brilliant(id, x, y, r, isBlack(st, i), metal, 1, Math.abs(u) < .25 && R() > .5);
    }
  } else if (art.kind === 'studs') {
    const xs = art.single ? [cx] : [cx - 74, cx + 74];
    xs.forEach((x, i) => body += brilliant(id, x, cy, art.single ? 58 : 44, isBlack(st, i) || st === 'black', metal, 1, i === 0));
  } else if (art.kind === 'huggies') {
    // two small paved hoops, front stones larger
    [[cx - 82, 1], [cx + 82, .92]].forEach(([hx, s0]) => {
      const R0 = 62 * s0, n = 18, items = [];
      for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; items.push({ x: hx + Math.cos(t) * R0 * .62, y: cy + Math.sin(t) * R0, d: (Math.cos(t) + 1) / 2 }); }
      const [m1, m2] = METAL[metal];
      body += `<ellipse cx="${hx}" cy="${cy}" rx="${R0 * .62}" ry="${R0}" fill="none" stroke="${m2}" stroke-width="13"/><ellipse cx="${hx}" cy="${cy}" rx="${R0 * .62}" ry="${R0}" fill="none" stroke="${m1}" stroke-width="9"/>`;
      items.sort((a, b) => a.d - b.d).forEach((p, i) => body += brilliant(id, p.x, p.y, 6.4 + p.d * 1.6, st === 'black', metal, .6 + p.d * .4, p.d > .9 && i % 5 === 0));
    });
  } else if (art.kind === 'climber') {
    // graduated arc, like the dotted orbit on the "stack it" poster
    const n = 9;
    for (let i = 0; i < n; i++) {
      const t = -1.05 + i / (n - 1) * 2.1, rr = 150;
      const x = cx - 60 + Math.cos(t) * rr, y = cy + Math.sin(t) * rr, r = 7 + i * 2.2;
      body += brilliant(id, x, y, r, isBlack(st, i), metal, 1, i === n - 1);
    }
  } else {
    // Straight line, slight diagonal: the brand's signature mark.
    const n = art.fine ? 22 : 15, x0 = W * .06, x1 = W * .94, y0 = H * .64, y1 = H * .36;
    for (let i = 0; i < n; i++) {
      const k = i / (n - 1), x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k;
      if (st === 'baguette') body += baguette(id, x, y, 16, 26, Math.atan2(y1 - y0, x1 - x0) + Math.PI / 2, 'white');
      else body += brilliant(id, x, y, art.fine ? 8 : 12, isBlack(st, i), metal, 1, i === Math.floor(n * .62));
    }
  }
  const bg = opts.transparent ? '' : `<rect width="${W}" height="${H}" fill="url(#sp${id})"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${opts.label || 'Tennis jewellery'}" preserveAspectRatio="xMidYMid slice">${defs(id, ground)}${bg}${body}</svg>`;
}

// The wordmark-scale tennis line used across the brand (dividers, loaders, hero).
export function tennisLine(n = 24, style = 'white', r = 7) {
  const id = ++uid, gap = r * 2.5, W = n * gap + r * 2, H = r * 3;
  let body = '';
  for (let i = 0; i < n; i++) body += `<g class="st" style="--i:${i}">${brilliant(id, r * 1.2 + i * gap, H / 2, r, isBlack(style, i), metalFor(style), 1, false)}</g>`;
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="tline">${defs(id, ['#000', '#000'])}${body}</svg>`;
}

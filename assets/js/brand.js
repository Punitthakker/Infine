// Brand graphics drawn from the launch posters: pixel diamond, smiley diamond mascot,
// dotted orbit with stones. Inline SVG strings, colours from the poster palette.
const C = { ink: '#111111', lime: '#D7FF3A', pink: '#FD4FA6', lilac: '#CBB5FE', ice: '#A9D8FF', white: '#FFFFFF' };

// "main character energy" pixel diamond. k = ink, w = white, p = pink, . = empty
const PIX = [
  '..kkkkkkk..',
  '.kwwpwpwwk.',
  'kkkkkkkkkkk',
  '.kwwwpwwwk.',
  '..kwwpwwk..',
  '...kwpwk...',
  '....kwk....',
  '.....k.....',
];
export function pixelDiamond(cls = '') {
  const col = { k: C.ink, w: C.white, p: C.pink };
  let r = '';
  PIX.forEach((row, y) => [...row].forEach((ch, x) => { if (col[ch]) r += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${col[ch]}"/>`; }));
  return `<svg class="${cls}" viewBox="0 0 11 8" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
}

// The smiley diamond from "your first diamond. not your mom's."
export function mascot(cls = '', mood = 'smile') {
  const mouth = mood === 'wow' ? '<ellipse cx="100" cy="108" rx="7" ry="9" fill="#111"/>' : '<path d="M86 104 Q100 118 114 104" fill="none" stroke="#111" stroke-width="4.5" stroke-linecap="round"/>';
  return `<svg class="${cls}" viewBox="0 0 200 170" aria-hidden="true">
  <path d="M40 22 H160 L192 62 L100 162 L8 62 Z" fill="#DDF0FF" stroke="#111" stroke-width="6" stroke-linejoin="round"/>
  <path d="M8 62 H192" stroke="#111" stroke-width="6"/>
  <path d="M40 22 L62 62 L84 22 L100 62 L116 22 L138 62 L160 22" fill="none" stroke="#111" stroke-width="5" stroke-linejoin="round"/>
  <g class="m-eyes"><circle cx="78" cy="88" r="8.5" fill="#111"/><circle cx="122" cy="88" r="8.5" fill="#111"/><circle cx="81" cy="85" r="2.6" fill="#fff"/><circle cx="125" cy="85" r="2.6" fill="#fff"/></g>
  <ellipse cx="62" cy="104" rx="11" ry="6" fill="${C.pink}" opacity=".55"/><ellipse cx="138" cy="104" rx="11" ry="6" fill="${C.pink}" opacity=".55"/>
  ${mouth}
  </svg>`;
}

export function sparkle(cls = '', fill = '#fff') {
  return `<svg class="${cls}" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0 Q11 9 20 10 Q11 11 10 20 Q9 11 0 10 Q9 9 10 0Z" fill="${fill}"/></svg>`;
}

// Dotted orbit with stones riding it ("stack it" poster). Stones animate along the arc.
export function orbit(cls = '') {
  let dots = '';
  for (let i = 0; i <= 46; i++) {
    const t = -2.25 + i * 0.07, x = 120 + Math.cos(t) * 230, y = 260 + Math.sin(t) * 230;
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6" fill="#fff"/>`;
  }
  const stones = [[-1.6, 15, C.white], [-1.15, 11, C.ice], [-0.7, 9, C.white], [-0.3, 6, C.pink], [0.15, 13, C.white]]
    .map(([t, r, f], i) => `<circle class="orb" style="--d:${i}" cx="${(120 + Math.cos(t) * 230).toFixed(1)}" cy="${(260 + Math.sin(t) * 230).toFixed(1)}" r="${r}" fill="${f}"/>`).join('');
  return `<svg class="${cls}" viewBox="0 0 400 520" aria-hidden="true">${dots}${stones}</svg>`;
}

export const ICON = {
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 11l8-6 8 6v9H4z"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>',
  drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M7 4h10l4 5-9 11L3 9z"/><path d="M3 9h18"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
  cert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="4" y="3" width="16" height="13" rx="2"/><path d="M8 8h8M8 11h5"/><path d="M10 16l-1 5 3-2 3 2-1-5"/></svg>',
  swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18M12 9v11M12 9c-2-4-6-4-6-1.5S12 9 12 9zm0 0c2-4 6-4 6-1.5S12 9 12 9z"/></svg>',
};

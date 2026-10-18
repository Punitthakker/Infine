// infine. catalogue, drops and launch config.
// PLACEHOLDER DATA: prices, carat weights, stone counts, edition sizes, stock and dates are
// launch placeholders. Confirm every figure before going live (see README > Before launch).

export const CURRENCY = 'AED';

// Launch: early access is open to the list now; the public drop is the date on the posters.
export const LAUNCH = {
  earlyAccess: '2026-10-15T20:00:00+04:00',
  publicDrop: '2026-11-14T20:00:00+04:00',   // "drop 01 · [date] · dubai"
  city: 'dubai',
  handle: '@infine',
  whatsapp: '+971 52 227 1129',
};

// Product art: `art` is a rendered piece (see jewel.js), `img` is a photo, `bg` is the colour block behind art.
// kind: bracelet | necklace | line | studs | huggies | climber    stones: white | black | saltpepper | baguette | rose
export const PRODUCTS = [
  // ---------- tennis bracelets (drop 01) ----------
  {
    slug: 'ice-line', name: 'ice line', type: 'tennis bracelet', cat: 'bracelets', drop: 'drop-01', bg: 'ink',
    blurb: 'the one you never take off. one unbroken line of round brilliants, four prongs each, set close so it reads as light.',
    art: { kind: 'bracelet', stones: 'white' }, gallery: [{ img: 'gz-neon-stack' }, { art: { kind: 'line', stones: 'white' }, bg: 'lime' }, { art: { kind: 'bracelet', stones: 'white', angle: 1 }, bg: 'lilac' }],
    sizes: [{ label: '2 ct', price: 8900, stones: 52 }, { label: '3 ct', price: 12500, stones: 46 }, { label: '5 ct', price: 19900, stones: 40 }],
    metals: ['18k white gold', '18k yellow gold', '18k rose gold'], lengths: ['6"', '6.5"', '7"'],
    edition: 60, left: 23, specs: { colour: 'F-G', clarity: 'VS', cut: 'round brilliant, excellent', setting: '4-prong, box clasp + safety' }, tags: ['bestseller'],
  },
  {
    slug: 'mini-line', name: 'mini line', type: 'tennis bracelet', cat: 'bracelets', drop: 'drop-01', bg: 'lilac',
    blurb: 'your first diamond. not your mom\'s. one carat of brilliants on a featherweight line, made for stacking.',
    art: { kind: 'bracelet', stones: 'white', fine: 1 }, gallery: [{ img: 'gz-mirror' }, { art: { kind: 'line', stones: 'white', fine: 1 }, bg: 'ink' }],
    sizes: [{ label: '1 ct', price: 4200, stones: 64 }, { label: '1.5 ct', price: 5900, stones: 58 }],
    metals: ['18k white gold', '18k yellow gold', '18k rose gold'], lengths: ['6"', '6.5"', '7"'],
    edition: 80, left: 31, specs: { colour: 'F-G', clarity: 'VS', cut: 'round brilliant, excellent', setting: '4-prong, box clasp + safety' }, tags: ['first diamond'],
  },
  {
    slug: 'rose-line', name: 'rose line', type: 'tennis bracelet', cat: 'bracelets', drop: 'drop-01', bg: 'pink',
    blurb: 'brilliants in warm 18k rose gold. soft on skin, loud in the light.',
    art: { kind: 'bracelet', stones: 'rose' }, gallery: [{ img: 'gz-abaya' }, { art: { kind: 'line', stones: 'rose' }, bg: 'ink' }],
    sizes: [{ label: '1.5 ct', price: 6900, stones: 56 }, { label: '3 ct', price: 12900, stones: 46 }],
    metals: ['18k rose gold'], lengths: ['6"', '6.5"', '7"'],
    edition: 40, left: 9, specs: { colour: 'F-G', clarity: 'VS', cut: 'round brilliant, excellent', setting: '4-prong, box clasp + safety' },
  },
  {
    slug: 'baguette-line', name: 'baguette line', type: 'tennis bracelet', cat: 'bracelets', drop: 'drop-01', bg: 'lime',
    blurb: 'step-cut baguettes end to end. a little severe, very good next to a watch.',
    art: { kind: 'bracelet', stones: 'baguette' }, gallery: [{ img: 'gz-skater' }, { art: { kind: 'line', stones: 'baguette' }, bg: 'ink' }],
    sizes: [{ label: '4 ct', price: 14900, stones: 38 }, { label: '6 ct', price: 21500, stones: 34 }],
    metals: ['18k white gold', '18k yellow gold'], lengths: ['6.5"', '7"'],
    edition: 30, left: 6, specs: { colour: 'F-G', clarity: 'VS', cut: 'baguette, step cut', setting: 'channel set, box clasp + safety' },
  },
  // ---------- tennis necklaces (drop 01) ----------
  {
    slug: 'ice-line-necklace', name: 'ice line necklace', type: 'tennis necklace', cat: 'necklaces', drop: 'drop-01', bg: 'ink',
    blurb: 'the bracelet, grown up. a riviera of graduated brilliants that sits right on the collarbone.',
    art: { kind: 'necklace', stones: 'white' }, gallery: [{ img: 'gz-squad' }, { art: { kind: 'line', stones: 'white' }, bg: 'lilac' }],
    sizes: [{ label: '8 ct', price: 29000, stones: 96 }, { label: '12 ct', price: 41000, stones: 88 }],
    metals: ['18k white gold', '18k yellow gold'], lengths: ['16"', '17"'],
    edition: 25, left: 7, specs: { colour: 'F-G', clarity: 'VS', cut: 'round brilliant, excellent', setting: '4-prong, box clasp + safety' }, tags: ['bestseller'],
  },
  {
    slug: 'triple-line', name: 'triple line', type: 'tennis necklace', cat: 'necklaces', drop: 'drop-01', bg: 'ink',
    blurb: 'three rows: round, baguette, round. wear all three, or unclip one and stack it on your wrist.',
    art: { kind: 'necklace', stones: 'baguette' }, gallery: [{ img: 'gz-pink-chains' }, { art: { kind: 'line', stones: 'baguette' }, bg: 'lime' }],
    sizes: [{ label: '18 ct', price: 64000, stones: 212 }],
    metals: ['18k white gold'], lengths: ['16" / 17" / 18"'],
    edition: 10, left: 3, specs: { colour: 'F-G', clarity: 'VS', cut: 'round brilliant + baguette', setting: '4-prong + channel' },
  },
  {
    slug: 'fringe-line', name: 'fringe line', type: 'tennis necklace', cat: 'necklaces', drop: 'drop-01', bg: 'ink',
    blurb: 'a double riviera with pear and baguette drops that move when you do.',
    art: { kind: 'necklace', stones: 'white', angle: 1 }, gallery: [{ img: 'gz-mirror' }, { art: { kind: 'line', stones: 'white' }, bg: 'pink' }],
    sizes: [{ label: '14 ct', price: 38000, stones: 154 }],
    metals: ['18k white gold'], lengths: ['16" + 17"'],
    edition: 12, left: 4, specs: { colour: 'F-G', clarity: 'VS', cut: 'round, pear, baguette', setting: 'prong + bezel drops' },
  },
  // ---------- ear party (drop 01) ----------
  {
    slug: 'solo-stud', name: 'solo stud', type: 'single stud', cat: 'ear', drop: 'drop-01', bg: 'lilac',
    blurb: 'one brilliant, sold single so you can build the party one hole at a time.',
    art: { kind: 'studs', stones: 'white', single: 1 }, gallery: [{ art: { kind: 'studs', stones: 'white' }, bg: 'ink' }],
    sizes: [{ label: '0.25 ct', price: 1450, stones: 1 }, { label: '0.5 ct', price: 2600, stones: 1 }],
    metals: ['18k white gold', '18k yellow gold', '18k rose gold'], lengths: ['single', 'pair'],
    edition: 150, left: 88, specs: { colour: 'F-G', clarity: 'VS', cut: 'round brilliant', setting: '4-prong martini, screw back' }, tags: ['ear party'],
  },
  {
    slug: 'pave-huggie', name: 'pavé huggie', type: 'huggie hoop', cat: 'ear', drop: 'drop-01', bg: 'pink',
    blurb: 'a tiny hoop paved all the way round. second hole, third hole, wherever.',
    art: { kind: 'huggies', stones: 'white' }, gallery: [{ art: { kind: 'huggies', stones: 'white' }, bg: 'ink' }],
    sizes: [{ label: '0.2 ct single', price: 1650, stones: 18 }, { label: '0.4 ct pair', price: 2950, stones: 36 }],
    metals: ['18k white gold', '18k yellow gold'], lengths: ['8 mm', '10 mm'],
    edition: 120, left: 64, specs: { colour: 'F-G', clarity: 'VS', cut: 'round brilliant pavé', setting: 'micro pavé, hinged' }, tags: ['ear party'],
  },
  {
    slug: 'orbit-climber', name: 'orbit climber', type: 'ear climber', cat: 'ear', drop: 'drop-01', bg: 'ink',
    blurb: 'a curve of graduated brilliants that climbs the lobe. the whole ear party in one piece.',
    art: { kind: 'climber', stones: 'white' }, gallery: [{ art: { kind: 'climber', stones: 'saltpepper' }, bg: 'lime' }],
    sizes: [{ label: '0.6 ct single', price: 2400, stones: 9 }],
    metals: ['18k white gold', '18k yellow gold'], lengths: ['left', 'right'],
    edition: 80, left: 27, specs: { colour: 'F-G', clarity: 'VS', cut: 'round brilliant, graduated', setting: '4-prong, push back' }, tags: ['ear party'],
  },
  // ---------- black diamonds (drop 02 · after dark) ----------
  {
    slug: 'midnight-line', name: 'midnight line', type: 'tennis bracelet', cat: 'black', drop: 'drop-02', bg: 'lilac',
    blurb: 'black diamonds polished to a mirror. reads like onyx until it catches the light.',
    art: { kind: 'bracelet', stones: 'black' }, gallery: [{ img: 'gz-arms-yo' }, { art: { kind: 'line', stones: 'black' }, bg: 'lime' }],
    sizes: [{ label: '3 ct', price: 6400, stones: 46 }, { label: '5 ct', price: 9800, stones: 40 }],
    metals: ['18k black rhodium', '18k yellow gold'], lengths: ['6"', '6.5"', '7"'],
    edition: 50, left: 50, specs: { colour: 'black (natural, colour treated)', clarity: 'opaque', cut: 'round brilliant', setting: '4-prong, box clasp + safety' }, tags: ['drop 02'],
  },
  {
    slug: 'salt-pepper-line', name: 'salt & pepper', type: 'tennis bracelet', cat: 'black', drop: 'drop-02', bg: 'pink',
    blurb: 'black and white brilliants, alternating. for people who can never pick one.',
    art: { kind: 'bracelet', stones: 'saltpepper' }, gallery: [{ img: 'gz-fistbump' }, { img: 'gz-kandura' }, { art: { kind: 'line', stones: 'saltpepper' }, bg: 'ink' }],
    sizes: [{ label: '3 ct', price: 7800, stones: 46 }],
    metals: ['18k white gold', '18k black rhodium'], lengths: ['6"', '6.5"', '7"'],
    edition: 40, left: 40, specs: { colour: 'F-G white / black', clarity: 'VS / opaque', cut: 'round brilliant', setting: '4-prong, box clasp + safety' }, tags: ['drop 02'],
  },
  {
    slug: 'midnight-necklace', name: 'midnight necklace', type: 'tennis necklace', cat: 'black', drop: 'drop-02', bg: 'lime',
    blurb: 'eleven carats of black brilliants on a 16-inch line. goes with everything black you own.',
    art: { kind: 'necklace', stones: 'black' }, gallery: [{ img: 'gz-pink-chains' }, { art: { kind: 'line', stones: 'black' }, bg: 'ink' }],
    sizes: [{ label: '11 ct', price: 18500, stones: 92 }],
    metals: ['18k black rhodium', '18k yellow gold'], lengths: ['16"', '17"'],
    edition: 20, left: 20, specs: { colour: 'black (natural, colour treated)', clarity: 'opaque', cut: 'round brilliant', setting: '4-prong, box clasp + safety' }, tags: ['drop 02'],
  },
  {
    slug: 'onyx-studs', name: 'onyx studs', type: 'stud earrings', cat: 'black', drop: 'drop-02', bg: 'ink',
    blurb: 'one black brilliant each side. the easiest yes in the drop.',
    art: { kind: 'studs', stones: 'black' }, gallery: [{ art: { kind: 'studs', stones: 'saltpepper' }, bg: 'lilac' }],
    sizes: [{ label: '1 ct pair', price: 2900, stones: 2 }, { label: '2 ct pair', price: 4900, stones: 2 }],
    metals: ['18k black rhodium', '18k yellow gold'], lengths: ['push back'],
    edition: 100, left: 100, specs: { colour: 'black (natural, colour treated)', clarity: 'opaque', cut: 'round brilliant', setting: '4-prong martini' }, tags: ['drop 02'],
  },
];

export const DROPS = [
  { id: 'drop-01', no: '01', name: 'main character energy', line: 'tennis lines, a riviera or three, and the whole ear party. early access is open to the list now.',
    opens: LAUNCH.earlyAccess, publicAt: LAUNCH.publicDrop, closes: '2026-12-14T23:59:00+04:00', bg: 'lime' },
  { id: 'drop-02', no: '02', name: 'after dark', line: 'black diamonds only. a tennis line, salt & pepper, a necklace and the studs.',
    opens: '2026-12-05T20:00:00+04:00', closes: '2027-01-05T23:59:00+04:00', bg: 'ink' },
];

export const CATEGORIES = [
  { id: 'all', label: 'everything' },
  { id: 'bracelets', label: 'tennis bracelets' },
  { id: 'necklaces', label: 'tennis necklaces' },
  { id: 'ear', label: 'ear party' },
  { id: 'black', label: 'black diamonds' },
];

export const PROMOS = { MAINCHARACTER: 0.10 }; // demo code: 10% off

export const bySlug = s => PRODUCTS.find(p => p.slug === s);
export const fromPrice = p => Math.min(...p.sizes.map(s => s.price));
export const dropOf = p => DROPS.find(d => d.id === p.drop);
export function dropStatus(d, now = Date.now()) {
  const o = Date.parse(d.opens), c = Date.parse(d.closes);
  if (now < o) return 'soon';
  if (now > c) return 'closed';
  return 'live';
}
export function availability(p, now = Date.now()) {
  const st = dropStatus(dropOf(p), now);
  if (st === 'soon') return 'soon';
  if (st !== 'live' || p.left <= 0) return 'gone';
  return 'live';
}
export const earPartyFrom = () => Math.min(...PRODUCTS.filter(p => p.cat === 'ear').map(fromPrice));

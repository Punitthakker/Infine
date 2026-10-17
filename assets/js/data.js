// infine. (infine.store) catalogue.
// PLACEHOLDER DATA: prices, carat weights, stone details, stock and promo codes are launch
// placeholders. Confirm every figure before going live (see README > Before launch).

export const BRAND = {
  name: 'infine.',
  site: 'infine.store',
  city: 'Dubai',
  whatsapp: '+971 52 227 1129',
  cutoffHour: 14,          // order before 2pm Dubai for same-day delivery in Dubai
  edit: 'The Adored Edit',
};

// tone: 'dark' = render on black, 'light' = product shot on white (shown on an ivory tile), 'photo' = lifestyle photo
const R = (img, tone = 'dark') => ({ img, tone });
const L = img => ({ img, tone: 'light' });
const P = img => ({ img, tone: 'photo' });

const RING_SIZES = ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8'];

export const CATEGORIES = [
  { id: 'all', label: 'Everything' },
  { id: 'rings', label: 'Rings', line: 'Say yes to yourself.' },
  { id: 'bands', label: 'Stacking bands', line: 'Stack your stories.' },
  { id: 'earrings', label: 'Huggies & hoops', line: 'Close to you.' },
  { id: 'bracelets', label: 'Bracelets', line: 'Something for the wrist.' },
  { id: 'necklaces', label: 'Necklaces', line: 'Made to be noticed.' },
];

export const PRODUCTS = [
  // ---------- rings ----------
  { slug: 'marquise-muse', name: 'Marquise Muse', cat: 'rings', price: 18900, media: [R('ring-014')], metal: '18k yellow gold', stones: 'Marquise centre, round and pear side stones', sizes: RING_SIZES, left: 3, tags: ['bestseller'],
    story: 'A long marquise that makes your hand look a little more elegant than it already is, flanked by pear and round diamonds.' },
  { slug: 'rose-halo', name: 'Rosé Halo', cat: 'rings', price: 9800, media: [R('ring-024')], metal: '18k rose gold', stones: 'Cushion halo, pavé band', sizes: RING_SIZES, left: 6,
    story: 'Soft pink gold, a cushion halo and a split pavé band. Romantic without trying too hard.' },
  { slug: 'oval-whisper', name: 'Oval Whisper', cat: 'rings', price: 14500, media: [R('ring-026')], metal: '18k yellow gold', stones: 'Oval centre, marquise and round accents', sizes: RING_SIZES, left: 4, tags: ['new'],
    story: 'An oval held high, with tiny marquise accents that catch the light every time you move your hand.' },
  { slug: 'seven-stars', name: 'Seven Stars', cat: 'rings', price: 12900, media: [R('ring-015')], metal: '18k white gold', stones: 'Oval centre, six graduated rounds', sizes: RING_SIZES, left: 5,
    story: 'One oval and six graduated brilliants, like a little constellation across the finger.' },
  { slug: 'starlight-halo', name: 'Starlight Halo', cat: 'rings', price: 16800, media: [R('ring-017')], metal: '18k white gold', stones: 'Princess centre, starburst halo, pavé shank', sizes: RING_SIZES, left: 2,
    story: 'A princess cut inside a starburst of diamonds. Built for the spotlight.' },
  { slug: 'trinity', name: 'Trinity', cat: 'rings', price: 21500, media: [R('ring-021')], metal: '18k white gold', stones: 'Emerald-cut three stone', sizes: RING_SIZES, left: 2,
    story: 'Three emerald cuts, clean and architectural. Past, present, and everything you are about to do.' },
  { slug: 'forever-set', name: 'Forever Set', cat: 'rings', price: 13900, media: [R('ring-019')], metal: '18k white gold', stones: 'Princess solitaire with matching pavé band', sizes: RING_SIZES, left: 4,
    story: 'A princess solitaire and its matching band, made to sit perfectly together.' },
  { slug: 'radiant-eternity', name: 'Radiant & Eternity', cat: 'rings', price: 24900, media: [R('ring-013')], metal: '18k white gold', stones: 'Radiant solitaire with full eternity band', sizes: RING_SIZES, left: 2, tags: ['bestseller'],
    story: 'A radiant cut solitaire paired with a full eternity band. The one people ask about.' },
  { slug: 'the-promise', name: 'The Promise', cat: 'rings', price: 7900, media: [R('ring-025')], metal: '18k yellow gold', stones: 'Round centre, twisted pavé shank', sizes: RING_SIZES, left: 7,
    story: 'A twisted pavé band holding a single brilliant. A promise you make to yourself.' },
  { slug: 'blossom', name: 'Blossom', cat: 'rings', price: 15800, media: [L('ring-040')], metal: '18k yellow gold', stones: 'Oval centre, marquise petal cluster', sizes: RING_SIZES, left: 3, tags: ['new'],
    story: 'An oval surrounded by marquise petals, like a flower that never closes.' },
  // ---------- stacking bands (rose gold) ----------
  { slug: 'seven-round', name: 'Seven Round', cat: 'bands', price: 3900, media: [L('band-1_00')], metal: '18k rose gold', stones: 'Seven round brilliants', sizes: RING_SIZES, left: 12, tags: ['under5k'], story: 'Seven brilliants in a row. The easiest yes in the shop.' },
  { slug: 'five-ovals', name: 'Five Ovals', cat: 'bands', price: 5900, media: [L('band-1_11')], metal: '18k rose gold', stones: 'Five oval diamonds', sizes: RING_SIZES, left: 8, tags: ['bestseller'], story: 'Five ovals set east to west. Wear it alone or as the centre of a stack.' },
  { slug: 'little-crown', name: 'Little Crown', cat: 'bands', price: 2900, media: [L('band-2_01')], metal: '18k rose gold', stones: 'Round and marquise contour', sizes: RING_SIZES, left: 14, tags: ['under5k'], story: 'A gentle point that hugs your engagement ring, or looks perfect on its own.' },
  { slug: 'scattered', name: 'Scattered', cat: 'bands', price: 4600, media: [L('band-2_10')], metal: '18k rose gold', stones: 'Mixed pear, marquise and round', sizes: RING_SIZES, left: 6, tags: ['under5k', 'new'], story: 'Mixed cuts scattered across an open band, like stars on a clear night.' },
  { slug: 'tiara', name: 'Tiara', cat: 'bands', price: 3400, media: [L('band-2_12')], metal: '18k rose gold', stones: 'Pavé V with pear tip', sizes: RING_SIZES, left: 10, tags: ['under5k'], story: 'A pavé V finished with a tiny pear. Your own little tiara.' },
  { slug: 'coil', name: 'Coil', cat: 'bands', price: 3800, media: [L('band-4_00')], metal: '18k rose gold', stones: 'Pavé double wrap', sizes: RING_SIZES, left: 9, tags: ['under5k'], story: 'One band that wraps twice, so it looks like a stack.' },
  { slug: 'crossover', name: 'Crossover', cat: 'bands', price: 4200, media: [L('band-4_20')], metal: '18k rose gold', stones: 'Polished and pavé crossover', sizes: RING_SIZES, left: 7, tags: ['under5k'], story: 'Polished gold crossing paths with a band of pavé. Modern and soft at once.' },
  { slug: 'baguette-row', name: 'Baguette Row', cat: 'bands', price: 4900, media: [L('band-4_22')], metal: '18k rose gold', stones: 'Channel set baguettes', sizes: RING_SIZES, left: 8, tags: ['under5k'], story: 'Baguettes lined up like little mirrors. Very clean, very chic.' },
  { slug: 'triple-wrap', name: 'Triple Wrap', cat: 'bands', price: 5200, media: [L('band-5_21')], metal: '18k rose gold', stones: 'Three rows of graduated rounds', sizes: RING_SIZES, left: 5, story: 'Three sweeping rows of diamonds in one ring. Statement, made simple.' },
  { slug: 'princess-line', name: 'Princess Line', cat: 'bands', price: 6400, media: [L('band-6_10')], metal: '18k rose gold', stones: 'Channel set princess cuts', sizes: RING_SIZES, left: 4, story: 'Square princess cuts, channel set flush. Bold and incredibly comfortable.' },
  { slug: 'emerald-bezel', name: 'Emerald Bezel', cat: 'bands', price: 5600, media: [L('band-7_00')], metal: '18k rose gold', stones: 'Bezel set emerald cuts', sizes: RING_SIZES, left: 6, story: 'Emerald cuts framed in gold bezels. A little vintage, a lot of light.' },
  { slug: 'petal', name: 'Petal', cat: 'bands', price: 4800, media: [L('band-7_21')], metal: '18k rose gold', stones: 'Marquise and pear cluster', sizes: RING_SIZES, left: 7, tags: ['under5k'], story: 'Marquise and pear diamonds arranged like falling petals.' },
  // ---------- huggies & hoops ----------
  { slug: 'inside-out-hoops', name: 'Inside-Out Hoops', cat: 'earrings', price: 6900, media: [L('hoop-004')], metal: '18k white gold', stones: 'Round brilliants, inside and out', sizes: ['Pair'], left: 6, tags: ['bestseller'], story: 'Diamonds on the outside and the inside, so they sparkle from every angle.' },
  { slug: 'oval-cluster-hoops', name: 'Oval Cluster Hoops', cat: 'earrings', price: 7400, media: [L('hoop-012')], metal: '18k white gold', stones: 'Cluster set rounds', sizes: ['Pair'], left: 5, story: 'Oval hoops covered in clusters of brilliants. Evening, sorted.' },
  { slug: 'baguette-hoops', name: 'Baguette Hoops', cat: 'earrings', price: 8900, media: [L('hoop-014')], metal: '18k white gold', stones: 'Emerald-cut and baguette', sizes: ['Pair'], left: 4, story: 'Step cuts all the way round. Architectural, glamorous, unforgettable.' },
  { slug: 'floating-hoops', name: 'Rosé Floating Hoops', cat: 'earrings', price: 4900, media: [L('hoop-017')], metal: '18k rose gold', stones: 'Floating rounds', sizes: ['Pair'], left: 8, tags: ['under5k'], story: 'Single diamonds that seem to float around a fine rose-gold hoop.' },
  { slug: 'twist-hoops', name: 'Twist Hoops', cat: 'earrings', price: 5200, media: [L('hoop-021')], metal: '18k white gold', stones: 'Pavé twist', sizes: ['Pair'], left: 7, story: 'Two pavé strands twisted together. Delicate up close, dazzling across a room.' },
  { slug: 'bezel-huggies', name: 'Bezel Huggies', cat: 'earrings', price: 2400, media: [L('hoop-032')], metal: '18k rose gold', stones: 'One bezel set diamond', sizes: ['Single', 'Pair'], left: 15, tags: ['under5k', 'new'], story: 'A tiny huggie with one bezel set diamond. You will never take them off.' },
  { slug: 'marquise-hoops', name: 'Marquise Hoops', cat: 'earrings', price: 7800, media: [L('hoop-040')], metal: '18k white gold', stones: 'Marquise diamonds', sizes: ['Pair'], left: 4, story: 'A ring of marquise diamonds, each one pointing the light straight back at you.' },
  { slug: 'trio-huggies', name: 'Rosé Trio Huggies', cat: 'earrings', price: 3600, media: [L('hoop-042')], metal: '18k rose gold', stones: 'Three round brilliants', sizes: ['Pair'], left: 11, tags: ['under5k'], story: 'Three brilliants on a rose-gold huggie. Small, sweet, impossible to ignore.' },
  { slug: 'halo-huggies', name: 'Halo Huggies', cat: 'earrings', price: 4400, media: [L('hoop-045')], metal: '18k white gold', stones: 'Halo clusters', sizes: ['Pair'], left: 9, tags: ['under5k'], story: 'Little halo clusters around a huggie. Vintage romance, everyday ease.' },
  { slug: 'rose-pave-hoops', name: 'Rosé Pavé Hoops', cat: 'earrings', price: 5600, media: [L('hoop-051')], metal: '18k rose gold', stones: 'Pavé front', sizes: ['Pair'], left: 6, story: 'Classic hoops, paved in diamonds, warmed in rose gold.' },
  // ---------- bracelets ----------
  { slug: 'classic-tennis', name: 'Classic Tennis', cat: 'bracelets', price: 9900, media: [L('brc-01_00')], metal: '18k yellow gold', stones: 'Round brilliants, 4-prong', sizes: ['6"', '6.5"', '7"'], left: 9, tags: ['bestseller'], story: 'The tennis bracelet every woman should own. Ours just happens to be perfect.' },
  { slug: 'baguette-tennis', name: 'Baguette Tennis', cat: 'bracelets', price: 16500, media: [L('brc-01_10')], metal: '18k yellow gold', stones: 'Channel set baguettes', sizes: ['6.5"', '7"'], left: 3, story: 'A wide line of baguettes that reads as pure light on the wrist.' },
  { slug: 'blush-petal', name: 'Blush Petal', cat: 'bracelets', price: 11900, media: [L('brc-01_11')], metal: '18k rose gold', stones: 'Blush and white pear cuts', sizes: ['6.5"', '7"'], left: 3, tags: ['new'], story: 'Pear cuts in blush and white, falling around the wrist like petals.' },
  { slug: 'bezel-tennis', name: 'Bezel Tennis', cat: 'bracelets', price: 8900, media: [L('brc-02_00')], metal: '18k yellow gold', stones: 'Bezel set rounds', sizes: ['6"', '6.5"', '7"'], left: 7, story: 'Each diamond framed in a little gold bezel. Soft, smooth, sensual.' },
  { slug: 'paperclip-pave', name: 'Paperclip Pavé', cat: 'bracelets', price: 6800, media: [L('brc-02_10')], metal: '18k yellow gold', stones: 'Pavé paperclip link', sizes: ['6.5"', '7"'], left: 6, story: 'An open paperclip chain with one pavé link. Effortless.' },
  { slug: 'triple-row', name: 'Triple Row', cat: 'bracelets', price: 19900, media: [L('brc-05_00')], metal: '18k yellow gold', stones: 'Three rows of brilliants', sizes: ['6.5"', '7"'], left: 2, story: 'Three rows of diamonds for the woman who never does anything halfway.' },
  { slug: 'mixed-cut-tennis', name: 'Mixed Cut Tennis', cat: 'bracelets', price: 10400, media: [L('brc-05_10')], metal: '18k yellow gold', stones: 'Pear, oval and marquise', sizes: ['6.5"', '7"'], left: 4, story: 'Pear, oval and marquise cuts on one line. Playful and very grown up.' },
  { slug: 'bow', name: 'The Bow', cat: 'bracelets', price: 3200, media: [L('brc-07_01')], metal: '18k yellow gold', stones: 'Two pear diamonds', sizes: ['One size, adjustable'], left: 12, tags: ['under5k', 'new'], story: 'Two pear diamonds tied like a tiny bow on a fine chain. The perfect gift, to her or to you.' },
  { slug: 'geometry', name: 'Geometry', cat: 'bracelets', price: 12600, media: [L('brc-07_10')], metal: '18k yellow gold', stones: 'Mixed geometric cuts', sizes: ['6.5"', '7"'], left: 3, story: 'Squares, rounds and pears in a rhythmic line. For the woman with a plan.' },
  { slug: 'solitaire-chain', name: 'Solitaire Chain', cat: 'bracelets', price: 2800, media: [L('brc-08_10')], metal: '18k yellow gold', stones: 'One round brilliant', sizes: ['One size, adjustable'], left: 15, tags: ['under5k'], story: 'One brilliant on a fine chain. Barely there, always noticed.' },
  { slug: 'grand-tennis', name: 'Grand Tennis', cat: 'bracelets', price: 21900, media: [L('brc-10_00')], metal: '18k yellow gold', stones: 'Large round brilliants', sizes: ['6.5"', '7"'], left: 2, story: 'Bigger stones, bolder line. The one you buy to celebrate.' },
  { slug: 'link', name: 'Diamond Link', cat: 'bracelets', price: 7600, media: [L('brc-10_11')], metal: '18k yellow gold', stones: 'Pavé links', sizes: ['6.5"', '7"'], left: 5, story: 'Gold links touched with pavé. Day to night without a second thought.' },
  // ---------- necklaces ----------
  { slug: 'riviera', name: 'The Riviera', cat: 'necklaces', price: 29000, media: [P('model-tennis'), P('model-tennis-tall')], metal: '18k white gold', stones: 'Graduated round brilliants', sizes: ['16"', '17"'], left: 3, tags: ['bestseller'], story: 'A line of graduated diamonds that sits right on the collarbone. The necklace from the film.' },
  { slug: 'fringe-riviera', name: 'Fringe Riviera', cat: 'necklaces', price: 38000, media: [P('model-fringe'), P('fringe-line')], metal: '18k white gold', stones: 'Round, pear and baguette drops', sizes: ['16" + 17"'], left: 2, story: 'A double riviera with drops that move when you do.' },
  { slug: 'pear-v', name: 'Pear V', cat: 'necklaces', price: 46000, media: [P('pear-halo'), P('model-diamond')], metal: '18k white gold', stones: 'Baguette V with a pear drop', sizes: ['16"'], left: 1, story: 'Rows of baguettes sweeping into a V, finished with one big pear.' },
  { slug: 'ruby-lariat', name: 'Ruby Lariat', cat: 'necklaces', price: 24500, media: [P('model-ruby'), P('ruby-lariat')], metal: '18k yellow gold', stones: 'Pear rubies and diamond petals', sizes: ['17" + 4" drop'], left: 2, story: 'Rubies and diamond petals running down to a single ruby drop. Made for a deep neckline.' },
  { slug: 'emerald-drop', name: 'Emerald Drop', cat: 'necklaces', price: 21000, media: [P('model-emerald'), P('emerald-strand')], metal: '18k white gold', stones: 'Pear emeralds in diamond halos', sizes: ['16"'], left: 3, story: 'Two pear emeralds in diamond halos, hung from a fine tennis chain.' },
  { slug: 'sapphire-bloom', name: 'Sapphire Bloom', cat: 'necklaces', price: 17800, media: [P('sapphire-bloom'), P('sapphire-lace')], metal: '18k white gold', stones: 'Trillion blue centre, pavé petals', sizes: ['18"'], left: 3, story: 'A blue trillion at the heart of three pavé petals.' },
  { slug: 'ice-choker', name: 'The Choker', cat: 'necklaces', price: 88000, media: [P('ice-choker'), P('cascade')], metal: '18k white gold', stones: 'Pear and round, cascading centre', sizes: ['14" + extender'], left: 1, story: 'Five rows of pear and round diamonds with a cascading centre. For the night you will remember.' },
];

export const PROMOS = { ADORED10: 0.10, STACK10: 0.10 }; // demo codes

export const bySlug = s => PRODUCTS.find(p => p.slug === s);
export const inCat = c => PRODUCTS.filter(p => c === 'all' || p.cat === c);
export const catOf = id => CATEGORIES.find(c => c.id === id);

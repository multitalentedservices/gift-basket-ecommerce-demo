/* ============================================================
   THE GILDED BASKET — catalogue data (DEMO content)
   All products, prices and descriptions are fictional demo
   content for a portfolio storefront. Prices in PKR.
   ============================================================ */

const CATEGORIES = [
  { id: "all",        label: "All Baskets" },
  { id: "signature",  label: "Signature" },
  { id: "chocolate",  label: "Chocolate" },
  { id: "dry-fruits", label: "Dry Fruits & Nuts" },
  { id: "tea-coffee", label: "Tea & Coffee" },
  { id: "spa",        label: "Spa & Care" },
  { id: "celebration",label: "Celebration" }
];

/* motif: box | basket | hamper | tower | jar
   c1/c2: gradient pair drawn from the house palette family */
const PRODUCTS = [
  {
    id: "emerald-classic",
    name: "The Emerald Classic",
    category: "signature",
    price: 8450, was: 9900,
    rating: 4.9, reviews: 132,
    badge: "Bestseller", badgeTone: "emerald",
    motif: "basket", c1: "#1E3F32", c2: "#2A5A47",
    tagline: "Our founding basket — the one that started the atelier.",
    description: "A generous wicker basket layered with artisan preserves, single-origin chocolate, roasted nuts and a hand-tied emerald ribbon. Balanced, elegant, and the basket our regulars reorder for every occasion that matters.",
    contents: ["Belgian couverture chocolate bar, 100g", "Roasted almonds & cashews, 250g", "Wildflower honey jar, 220g", "Butter shortbread rounds, 12 pc", "Seasonal fruit preserves, 2 jars", "Hand-written gift card"]
  },
  {
    id: "terracotta-indulgence",
    name: "Terracotta Indulgence Box",
    category: "chocolate",
    price: 6250, was: null,
    rating: 4.8, reviews: 86,
    badge: "New", badgeTone: "terra",
    motif: "box", c1: "#D96B52", c2: "#AE4527",
    tagline: "Twelve truffles, three origins, one warm terracotta box.",
    description: "A keepsake terracotta gift box filled with hand-rolled truffles, chocolate-dipped orange peel and a small slab of 70% single-origin dark. Made for the person who reads the cocoa percentage before the card.",
    contents: ["Hand-rolled truffles, 12 pc", "70% single-origin dark slab, 90g", "Chocolate-dipped orange peel, 120g", "Cocoa-dusted hazelnuts, 150g", "Tasting notes card", "Hand-written gift card"]
  },
  {
    id: "royal-dry-fruit-hamper",
    name: "Royal Dry Fruit Hamper",
    category: "dry-fruits",
    price: 12900, was: 14500,
    rating: 5.0, reviews: 64,
    badge: "Premium", badgeTone: "emerald",
    motif: "hamper", c1: "#2C2523", c2: "#57493F",
    tagline: "A chest of the finest harvest — pistachio, almond, fig, apricot.",
    description: "One and a half kilos of graded dry fruits and nuts in a linen-lined wooden chest: Kashmiri almonds, roasted pistachios, golden figs and Hunza apricots, packed the week they are ordered so nothing sits stale on a shelf.",
    contents: ["Kashmiri almonds, 400g", "Roasted pistachios, 400g", "Golden figs, 300g", "Hunza dried apricots, 300g", "Walnuts, 200g", "Linen-lined wooden chest (keepsake)"]
  },
  {
    id: "chai-biscotti-ritual",
    name: "Chai & Biscotti Ritual",
    category: "tea-coffee",
    price: 4850, was: null,
    rating: 4.7, reviews: 118,
    badge: null, badgeTone: "emerald",
    motif: "jar", c1: "#C79A3B", c2: "#9A7422",
    tagline: "Loose-leaf chai, almond biscotti, and a slower afternoon.",
    description: "Two tins of small-batch loose-leaf tea — a spiced breakfast chai and a calming green — with twice-baked almond biscotti for dunking. A quiet, thoughtful gift for teachers, mentors and favourite colleagues.",
    contents: ["Spiced breakfast chai, 100g tin", "Green tea with lemongrass, 75g tin", "Almond biscotti, 10 pc", "Brass tea strainer", "Raw cane sugar cubes, 100g", "Brewing guide card"]
  },
  {
    id: "serenity-spa-basket",
    name: "Serenity Spa Basket",
    category: "spa",
    price: 7650, was: 8900,
    rating: 4.9, reviews: 97,
    badge: "Bestseller", badgeTone: "emerald",
    motif: "basket", c1: "#2A5A47", c2: "#48755F",
    tagline: "An evening of quiet, delivered in a basket.",
    description: "Cold-pressed oils, a hand-poured soy candle, bath salts with dried rose, and a cotton waffle towel — composed like a spa menu, packed like a present. The basket we send when 'take care of yourself' needs to actually land.",
    contents: ["Hand-poured soy candle, rose & oud", "Cold-pressed body oil, 100ml", "Rose bath salts, 250g", "Natural loofah & pumice set", "Cotton waffle hand towel", "Hand-written gift card"]
  },
  {
    id: "golden-date-crate",
    name: "Golden Date & Nut Crate",
    category: "dry-fruits",
    price: 9750, was: null,
    rating: 4.8, reviews: 53,
    badge: null, badgeTone: "emerald",
    motif: "hamper", c1: "#8F3A20", c2: "#B4642F",
    tagline: "Ajwa and Medjool dates, stuffed, dipped and gift-crated.",
    description: "Premium dates three ways — plain Ajwa, walnut-stuffed Medjool, and orange-zest chocolate-dipped — in a slatted wooden crate. A dignified gift for Eid, housewarmings and elders who appreciate the classics done properly.",
    contents: ["Ajwa dates, 300g", "Walnut-stuffed Medjool dates, 300g", "Chocolate-dipped dates, 12 pc", "Mixed roasted nuts, 200g", "Slatted wooden crate (keepsake)", "Hand-written gift card"]
  },
  {
    id: "midnight-chocolate-tower",
    name: "Midnight Chocolate Tower",
    category: "chocolate",
    price: 10400, was: null,
    rating: 4.9, reviews: 71,
    badge: "Limited", badgeTone: "terra",
    motif: "tower", c1: "#2C2523", c2: "#1E3F32",
    tagline: "Four tiers of dark, darker, darkest.",
    description: "A four-tier tower that climbs from milk pralines to an 85% single-origin finale. Built for sharing at the office or not sharing at all — we do not judge, we just pack extra ribbon.",
    contents: ["Milk pralines, tier one — 10 pc", "Hazelnut rochers, tier two — 10 pc", "70% ganache squares, tier three — 10 pc", "85% single-origin bar, tier four — 90g", "Cacao nib brittle, 100g", "Stackable keepsake tins"]
  },
  {
    id: "blossom-baby-basket",
    name: "Blossom Baby Basket",
    category: "celebration",
    price: 6950, was: null,
    rating: 5.0, reviews: 44,
    badge: "New", badgeTone: "terra",
    motif: "basket", c1: "#D96B52", c2: "#C79A3B",
    tagline: "Soft things for a small person, kind things for the parents.",
    description: "A muslin wrap, hand-knitted booties and a plush rattle for the baby; dark chocolate and herbal tea for the parents, because they are also going through something. Arrives with a keepsake card for the baby's name and date.",
    contents: ["Organic muslin wrap, blush", "Hand-knitted booties, 0–6 months", "Plush rattle, washable", "Dark chocolate bar for the parents, 90g", "Chamomile tea sachets, 8 pc", "Keepsake name & date card"]
  },
  {
    id: "wedding-keepsake",
    name: "The Wedding Keepsake",
    category: "celebration",
    price: 15500, was: 17500,
    rating: 5.0, reviews: 38,
    badge: "Premium", badgeTone: "emerald",
    motif: "box", c1: "#1E3F32", c2: "#C79A3B",
    tagline: "Sparkling grape, fine chocolate, and a box worth keeping.",
    description: "Our most ceremonial gift: a lacquered keepsake box with sparkling grape juice in a champagne-style bottle, fine pralines, sugared almonds and two hand-dipped candles for the couple's first dinner at home.",
    contents: ["Sparkling grape juice, 750ml (0.0%)", "Fine pralines, 16 pc", "Sugared almonds, 200g", "Hand-dipped dinner candles, pair", "Silk ribbon & wax seal", "Lacquered keepsake box"]
  },
  {
    id: "roast-ground-crate",
    name: "Roast & Ground Coffee Crate",
    category: "tea-coffee",
    price: 5950, was: null,
    rating: 4.7, reviews: 79,
    badge: null, badgeTone: "emerald",
    motif: "jar", c1: "#57493F", c2: "#2C2523",
    tagline: "Two single-origin roasts and the tools to honour them.",
    description: "A medium and a dark single-origin roast, a hand grinder and a ceramic pour-over dripper, crated in wood wool. For the colleague whose desk already smells better than the whole office.",
    contents: ["Single-origin medium roast, 250g", "Single-origin dark roast, 250g", "Manual burr hand grinder", "Ceramic pour-over dripper", "Unbleached filters, 20 pc", "Tasting & brewing cards"]
  },
  {
    id: "honey-herb-pantry",
    name: "Honey & Herb Pantry Box",
    category: "signature",
    price: 5450, was: 6200,
    rating: 4.8, reviews: 66,
    badge: null, badgeTone: "emerald",
    motif: "jar", c1: "#C79A3B", c2: "#D96B52",
    tagline: "A small pantry upgrade for someone who cooks with love.",
    description: "Raw honeys, infused oils and small-batch spice blends from regional makers, boxed with recipe cards. The gift that keeps appearing in their cooking for months — and in their messages to you.",
    contents: ["Raw wildflower honey, 220g", "Chilli-infused olive oil, 100ml", "Smoked paprika blend, 60g", "Za'atar blend, 60g", "Three recipe cards", "Wooden honey dipper"]
  },
  {
    id: "rose-oud-indulgence",
    name: "Rose & Oud Indulgence",
    category: "spa",
    price: 8950, was: null,
    rating: 4.9, reviews: 58,
    badge: null, badgeTone: "emerald",
    motif: "box", c1: "#8F3A20", c2: "#2C2523",
    tagline: "Our deepest fragrance story — rose, oud, amber.",
    description: "A reed diffuser, attar roller and scented candle built on one fragrance story — Taif-style rose over warm oud and amber. Presented in a charcoal gift box with a terracotta seal; unmistakably an evening gift.",
    contents: ["Rose & oud reed diffuser, 120ml", "Attar roller, 10ml", "Scented soy candle, amber", "Silk eye mask", "Dried rose buds sachet", "Hand-written gift card"]
  },
  {
    id: "little-luxuries-mini",
    name: "Little Luxuries Mini",
    category: "signature",
    price: 3450, was: null,
    rating: 4.6, reviews: 143,
    badge: "Mini", badgeTone: "terra",
    motif: "box", c1: "#D96B52", c2: "#E08A6D",
    tagline: "Small box, correct priorities: chocolate, honey, shortbread.",
    description: "Proof that thoughtfulness is not priced by the kilo. A mini box with a proper chocolate bar, a honey jar and shortbread — the thank-you gift that never feels like an afterthought.",
    contents: ["Couverture chocolate bar, 80g", "Wildflower honey jar, 110g", "Butter shortbread, 6 pc", "Roasted almonds, 80g", "Hand-written gift card"]
  },
  {
    id: "grand-celebration-hamper",
    name: "Grand Celebration Hamper",
    category: "celebration",
    price: 18900, was: 21500,
    rating: 5.0, reviews: 29,
    badge: "Premium", badgeTone: "emerald",
    motif: "hamper", c1: "#1E3F32", c2: "#8F3A20",
    tagline: "The full atelier in one hamper — for the biggest days.",
    description: "Everything we make, composed into one trunk-sized hamper: chocolate tiers, dry fruits, preserves, sparkling grape, candles and a spa corner. For weddings, milestone birthdays and the clients you absolutely cannot under-gift.",
    contents: ["Chocolate selection, 24 pc", "Graded dry fruits & nuts, 800g", "Fruit preserves, 3 jars", "Sparkling grape juice, 750ml (0.0%)", "Hand-dipped candles, pair", "Spa minis set, 4 pc", "Trunk hamper (keepsake)", "Hand-written gift card"]
  }
];

/* ---------- Build-Your-Basket data ---------- */
const BUILDER_BOXES = [
  { id: "box-petit",  name: "Petit Box",      price: 1200, desc: "For 4–6 treats. Kraft keepsake box, cream ribbon.", c1: "#EFE5D8", c2: "#D9C6AC" },
  { id: "box-classic",name: "Classic Basket", price: 2400, desc: "For 8–10 treats. Wicker basket, emerald ribbon.",        c1: "#1E3F32", c2: "#2A5A47" },
  { id: "box-grand",  name: "Grand Hamper",   price: 4200, desc: "For 12+ treats. Trunk hamper, terracotta seal & silk.",   c1: "#D96B52", c2: "#8F3A20" }
];

const BUILDER_TREATS = [
  { id: "t-truffles",  name: "Hand-rolled truffles",      meta: "Box of 6",        price: 1450 },
  { id: "t-almonds",   name: "Roasted Kashmiri almonds",  meta: "200g pouch",      price: 1150 },
  { id: "t-pistachio", name: "Salted pistachios",         meta: "200g pouch",      price: 1250 },
  { id: "t-honey",     name: "Wildflower honey",          meta: "220g jar",        price: 950 },
  { id: "t-shortbread",name: "Butter shortbread rounds",  meta: "Box of 8",        price: 750 },
  { id: "t-dates",     name: "Stuffed Medjool dates",     meta: "Box of 8",        price: 1350 },
  { id: "t-chai",      name: "Spiced breakfast chai",     meta: "100g tin",        price: 850 },
  { id: "t-coffee",    name: "Single-origin coffee",      meta: "250g bag",        price: 1650 },
  { id: "t-darkbar",   name: "70% dark chocolate bar",    meta: "90g slab",        price: 890 },
  { id: "t-figs",      name: "Golden dried figs",         meta: "200g pouch",      price: 1050 }
];

const BUILDER_EXTRAS = [
  { id: "x-card",    name: "Hand-written gift card", meta: "Your words, our calligraphy",  price: 0 },
  { id: "x-candle",  name: "Rose & oud soy candle",  meta: "Travel tin, 20hr burn",        price: 1250 },
  { id: "x-sparkling",name: "Sparkling grape juice",meta: "750ml, 0.0% — celebration pop", price: 1850 },
  { id: "x-ribbon",  name: "Silk ribbon upgrade",    meta: "Hand-dyed silk, wax seal",      price: 650 },
  { id: "x-plush",   name: "Plush keepsake bear",    meta: "For new-baby baskets",          price: 1490 },
  { id: "x-express", name: "Same-day courier (Lahore)", meta: "Order by 2pm, demo option", price: 800 }
];

/* Delivery fee rule for cart/checkout (demo) */
const DELIVERY_FEE = 350;
const FREE_DELIVERY_OVER = 10000;

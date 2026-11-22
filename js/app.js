/* ============================================================
   THE GILDED BASKET — shared application logic (DEMO)
   Cart store is pure logic (storage-adapter based) so it can
   be exercised headlessly; DOM behaviour is guarded below.
   ============================================================ */

/* ---------- Formatting ---------- */
function fmtPKR(n) {
  return "PKR " + Number(n).toLocaleString("en-PK");
}

/* Escape user-derived text before it is inserted via innerHTML
   (custom-basket recipient names, checkout names). */
function escHTML(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/* ---------- SVG motif illustrations (line-art, palette-native) ---------- */
function motifSVG(motif) {
  const s = 'stroke="#FAF7F2" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  const f = 'fill="rgba(250,247,242,.16)"';
  const bow = '<path d="M100 44c-14-12-30-8-28 4 1 9 14 10 28 2zm0 0c14-12 30-8 28 4-1 9-14 10-28 2z" ' + f + ' ' + s + '/><circle cx="100" cy="50" r="5" fill="#FAF7F2"/>';
  let inner = "";
  if (motif === "box") {
    inner = bow +
      '<rect x="42" y="66" width="116" height="22" rx="5" ' + f + ' ' + s + '/>' +
      '<rect x="50" y="88" width="100" height="66" rx="5" ' + s + '/>' +
      '<path d="M100 66v88" ' + s + '/>';
  } else if (motif === "hamper") {
    inner =
      '<path d="M52 74c6-16 18-24 30-22M148 74c-6-16-18-24-30-22" ' + s + '/>' +
      '<circle cx="72" cy="66" r="11" ' + f + ' ' + s + '/><rect x="92" y="48" width="16" height="26" rx="4" ' + f + ' ' + s + '/><circle cx="128" cy="66" r="11" ' + f + ' ' + s + '/>' +
      '<path d="M38 84h124l-8 70a8 8 0 0 1-8 7H54a8 8 0 0 1-8-7z" ' + s + '/>' +
      '<path d="M42 106h116M45 128h110" ' + s + '/>';
  } else if (motif === "tower") {
    inner = bow +
      '<rect x="66" y="62" width="68" height="26" rx="5" ' + f + ' ' + s + '/>' +
      '<rect x="56" y="88" width="88" height="30" rx="5" ' + s + '/>' +
      '<rect x="46" y="118" width="108" height="34" rx="5" ' + f + ' ' + s + '/>' +
      '<path d="M100 62v26M100 88v30M100 118v34" ' + s + '/>';
  } else if (motif === "jar") {
    inner =
      '<rect x="52" y="72" width="40" height="80" rx="9" ' + f + ' ' + s + '/>' +
      '<rect x="58" y="58" width="28" height="14" rx="4" ' + s + '/>' +
      '<rect x="60" y="98" width="24" height="30" rx="3" ' + s + '/>' +
      '<rect x="110" y="88" width="38" height="64" rx="9" ' + s + '/>' +
      '<rect x="116" y="74" width="26" height="14" rx="4" ' + f + ' ' + s + '/>' +
      '<path d="M118 112h22" ' + s + '/>';
  } else { /* basket (default) */
    inner =
      '<path d="M56 78c4-22 22-34 44-34s40 12 44 34" ' + s + '/>' +
      '<path d="M34 84h132l-10 66a10 10 0 0 1-10 9H54a10 10 0 0 1-10-9z" ' + f + ' ' + s + '/>' +
      '<path d="M40 108h120M44 130h112" ' + s + '/>' +
      '<circle cx="74" cy="70" r="10" ' + f + ' ' + s + '/><circle cx="104" cy="62" r="12" ' + f + ' ' + s + '/><circle cx="130" cy="72" r="9" ' + f + ' ' + s + '/>';
  }
  return '<svg class="art" viewBox="0 0 200 200" role="img" aria-hidden="true" focusable="false">' + inner + "</svg>";
}

/* Real photography first (v2). Products carry an explicit img; cart
   items built from products carry it too; anything else derives the
   product photo from its id/key. The parametric line-art remains ONLY
   as a legacy fallback for items with no photo on file (e.g. cart
   lines saved by v1) — and even then it uses the emerald family only. */
function visualHTML(item, cls) {
  let src = item.img || "";
  if (!src && typeof PRODUCTS !== "undefined") {
    const key = item.id || item.key || "";
    if (PRODUCTS.some(function (p) { return p.id === key; })) src = "images/products/" + key + ".jpg";
  }
  if (src) {
    return '<div class="pvisual ' + (cls || "") + '"><img src="' + src + '" alt="' +
      escHTML(item.name || "Gift basket") + '" decoding="async"></div>';
  }
  return '<div class="pvisual pvisual--motif ' + (cls || "") + '" role="img" aria-label="' +
    escHTML(item.name || "Gift basket") + '">' + motifSVG(item.motif) + "</div>";
}

function starsHTML(rating, reviews) {
  const full = Math.round(rating);
  let stars = "";
  for (let i = 0; i < 5; i++) stars += i < full ? "★" : "☆";
  return '<div class="stars" aria-label="Rated ' + rating + ' out of 5">' + stars + "<span>" + rating.toFixed(1) + " (" + reviews + ")</span></div>";
}

function categoryLabel(id) {
  const c = CATEGORIES.find(function (x) { return x.id === id; });
  return c ? c.label : id;
}

function productCard(p) {
  const badge = p.badge ? '<span class="pcard-badge' + (p.badgeTone === "terra" ? " pcard-badge--terra" : "") + '">' + p.badge + "</span>" : "";
  const was = p.was ? '<span class="was">' + fmtPKR(p.was) + "</span>" : "";
  return '<article class="pcard reveal">' +
    '<div style="position:relative">' + badge +
      '<a href="product.html?id=' + p.id + '" aria-label="View ' + p.name + '">' + visualHTML(p, "pvisual--card") + "</a>" +
    "</div>" +
    '<div class="pcard-body">' +
      '<span class="pcard-cat">' + categoryLabel(p.category) + "</span>" +
      '<h3><a href="product.html?id=' + p.id + '">' + p.name + "</a></h3>" +
      starsHTML(p.rating, p.reviews) +
      '<p class="pcard-desc">' + p.tagline + "</p>" +
      '<div class="pcard-foot">' +
        '<div class="price">' + was + fmtPKR(p.price) + "</div>" +
        '<button type="button" class="add-btn" data-add="' + p.id + '" aria-label="Add ' + p.name + ' to cart">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>Add</button>' +
      "</div>" +
    "</div></article>";
}

/* ---------- Cart store (pure logic) ---------- */
const CartStore = (function () {
  const KEY = "gb_cart_v1";
  let storage = (typeof localStorage !== "undefined") ? localStorage : null;

  function setStorage(s) { storage = s; }
  function load() {
    if (!storage) return [];
    try {
      const raw = storage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  function save(items) { if (storage) storage.setItem(KEY, JSON.stringify(items)); }

  function add(item, qty) {
    qty = qty || 1;
    const items = load();
    const found = items.find(function (i) { return i.key === item.key; });
    if (found) found.qty += qty;
    else items.push({ key: item.key, name: item.name, meta: item.meta || "", price: item.price, qty: qty, motif: item.motif || "basket", c1: item.c1 || "#1E3F32", c2: item.c2 || "#2A5A47", img: item.img || "" });
    save(items);
    return items;
  }
  function setQty(key, qty) {
    let items = load();
    if (qty <= 0) items = items.filter(function (i) { return i.key !== key; });
    else items.forEach(function (i) { if (i.key === key) i.qty = qty; });
    save(items);
    return items;
  }
  function remove(key) {
    const items = load().filter(function (i) { return i.key !== key; });
    save(items);
    return items;
  }
  function clear() { save([]); }
  function count() { return load().reduce(function (a, i) { return a + i.qty; }, 0); }
  function subtotal() { return load().reduce(function (a, i) { return a + i.qty * i.price; }, 0); }
  function deliveryFee() {
    const st = subtotal();
    if (st === 0) return 0;
    return st >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  }
  function total() { return subtotal() + deliveryFee(); }

  return { setStorage: setStorage, load: load, add: add, setQty: setQty, remove: remove, clear: clear, count: count, subtotal: subtotal, deliveryFee: deliveryFee, total: total, KEY: KEY };
})();

function productToCartItem(p) {
  return { key: p.id, name: p.name, meta: categoryLabel(p.category) + " basket", price: p.price, motif: p.motif, c1: p.c1, c2: p.c2, img: p.img || "" };
}

/* ============================================================
   DOM behaviour (browser only)
   ============================================================ */
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {

    /* Footer year */
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

    /* Mobile navigation */
    const navToggle = document.querySelector(".nav-toggle");
    const mobileNav = document.querySelector(".mobile-nav");
    if (navToggle && mobileNav) {
      navToggle.addEventListener("click", function () {
        const open = mobileNav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      mobileNav.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          mobileNav.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    /* Cart drawer */
    const drawer = document.querySelector(".cart-drawer");
    const overlay = document.querySelector(".drawer-overlay");
    function openDrawer() {
      renderDrawer();
      if (drawer) drawer.classList.add("open");
      if (overlay) overlay.classList.add("open");
      if (drawer) drawer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function closeDrawer() {
      if (drawer) drawer.classList.remove("open");
      if (overlay) overlay.classList.remove("open");
      if (drawer) drawer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    window.GB_openDrawer = openDrawer;
    window.GB_closeDrawer = closeDrawer;

    document.querySelectorAll("[data-open-cart]").forEach(function (b) {
      b.addEventListener("click", openDrawer);
    });
    document.querySelectorAll("[data-close-cart]").forEach(function (b) {
      b.addEventListener("click", closeDrawer);
    });
    if (overlay) overlay.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });

    function updateCount() {
      const n = CartStore.count();
      document.querySelectorAll(".cart-count").forEach(function (el) {
        el.textContent = n;
        el.hidden = n === 0;
      });
    }
    window.GB_updateCount = updateCount;

    function renderDrawer() {
      const body = document.querySelector(".drawer-body");
      const foot = document.querySelector(".drawer-foot");
      if (!body || !foot) return;
      const items = CartStore.load();
      if (!items.length) {
        body.innerHTML = '<div class="drawer-empty">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M4 9h16l-1.5 9.5a2 2 0 0 1-2 1.5h-9a2 2 0 0 1-2-1.5L4 9Z"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/></svg>' +
          "<p><strong>Your cart is empty.</strong><br>Beautiful baskets are waiting in the shop.</p></div>";
        foot.innerHTML = '<a class="btn btn--block" href="shop.html">Browse the shop</a>';
        return;
      }
      body.innerHTML = items.map(function (i) {
        return '<div class="drawer-item">' +
          visualHTML(i, "") +
          "<div><h4>" + escHTML(i.name) + '</h4><div class="di-meta">' + escHTML(i.meta) + "</div>" +
          '<div class="di-meta">' + fmtPKR(i.price) + " × " + i.qty + "</div></div>" +
          '<button type="button" class="remove-btn" data-remove="' + i.key + '" aria-label="Remove ' + escHTML(i.name) + ' from cart">Remove</button>' +
          "</div>";
      }).join("");
      foot.innerHTML =
        '<div class="sum-line total" style="margin:0 0 1rem;padding-top:0;border:none"><span>Subtotal</span><strong>' + fmtPKR(CartStore.subtotal()) + "</strong></div>" +
        '<a class="btn btn--block" href="cart.html" style="margin-bottom:.6rem">View cart</a>' +
        '<a class="btn btn--terra btn--block" href="checkout.html">Checkout (demo)</a>';
      body.querySelectorAll("[data-remove]").forEach(function (b) {
        b.addEventListener("click", function () {
          CartStore.remove(b.getAttribute("data-remove"));
          updateCount(); renderDrawer();
          if (window.GB_onCartChange) window.GB_onCartChange();
        });
      });
    }
    window.GB_renderDrawer = renderDrawer;
    updateCount();

    /* Toast */
    let toastTimer = null;
    window.GB_toast = function (msg) {
      let t = document.querySelector(".toast");
      if (!t) {
        t = document.createElement("div");
        t.className = "toast";
        t.setAttribute("role", "status");
        document.body.appendChild(t);
      }
      t.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>' + msg;
      t.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
    };

    /* Add-to-cart delegation (product cards everywhere) */
    document.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-add]");
      if (!btn) return;
      const p = PRODUCTS.find(function (x) { return x.id === btn.getAttribute("data-add"); });
      if (!p) return;
      CartStore.add(productToCartItem(p), 1);
      updateCount();
      window.GB_toast(p.name + " added to cart");
      if (window.GB_onCartChange) window.GB_onCartChange();
    });

    /* Scroll reveal — SAFE pattern (v3). CSS never gates opacity:
       .reveal elements are fully visible at all times and the
       observer only settles a gentle position rise (transform).
       We observe everything present AND anything injected later
       (GB_revealScan), and a hard safety timer settles ALL remaining
       elements after 2.2s no matter what — no section or photo can
       ever render blank at any scroll speed. */
    const revealSeen = new WeakSet();
    let revealIO = null;
    function revealNow(el) { el.classList.add("in"); }
    window.GB_revealScan = function (root) {
      (root || document).querySelectorAll(".reveal:not(.in)").forEach(function (el) {
        if (revealSeen.has(el)) return;
        revealSeen.add(el);
        if (revealIO) revealIO.observe(el); else revealNow(el);
      });
    };
    window.GB_revealAll = function (root) {
      (root || document).querySelectorAll(".reveal").forEach(revealNow);
    };
    if ("IntersectionObserver" in window) {
      revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { revealNow(en.target); revealIO.unobserve(en.target); }
        });
      }, { threshold: 0.01, rootMargin: "0px 0px -4% 0px" });
    }
    window.GB_revealScan(document);
    setTimeout(function () { window.GB_revealAll(document); }, 2200);

    /* FAQ accordion — items marked data-alpine-faq are owned by
       the Alpine state system (premium pages); skip those here. */
    document.querySelectorAll(".faq-item:not([data-alpine-faq])").forEach(function (item) {
      const q = item.querySelector(".faq-q");
      const a = item.querySelector(".faq-a");
      if (!q || !a) return;
      q.addEventListener("click", function () {
        const open = item.classList.toggle("open");
        q.setAttribute("aria-expanded", open ? "true" : "false");
        a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
      });
    });

    /* Newsletter forms (any page) */
    document.querySelectorAll(".js-newsletter").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const msg = form.parentElement.querySelector(".form-msg");
        const val = (input.value || "").trim();
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
        if (!ok) {
          if (msg) { msg.textContent = "Please enter a valid email address."; msg.className = "form-msg err"; }
          input.setAttribute("aria-invalid", "true");
          input.focus();
          return;
        }
        input.removeAttribute("aria-invalid");
        if (msg) { msg.textContent = "You are on the list — welcome to the atelier circle. (Demo: no email was actually sent.)"; msg.className = "form-msg ok"; }
        form.reset();
      });
    });
  });
}

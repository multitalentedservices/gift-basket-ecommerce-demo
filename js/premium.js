/* ============================================================
   THE GILDED BASKET — PREMIUM LAYER (2026-11-22 upgrade pilot)
   Alpine.js 3.17.5 is the ONE state system on the interactive
   pages (index / shop / build / product):
     · Alpine.store('cartUI')  — cart-drawer open state
     · Alpine.data('gbShop')   — shop filter / search / sort state
     · Alpine.data('gbBuilder')— builder step + selection state
   Rendering helpers stay in app.js (productCard, CartStore,
   drawer renderer); Alpine owns the state, the proven vanilla
   renderers draw from it. Pages without Alpine (the plain
   pages) keep the untouched app.js behaviour — the drawer
   works identically there.
   Everything here is progressive enhancement: with JS off,
   Alpine absent, or reduced motion requested, every page is
   complete and static by design.
   ============================================================ */

/* Static capture mode (?static=1 / data-static): Alpine state is functional
   content and runs unchanged; only the Swiper occasion rail stands down,
   leaving the designed scroll-snap rail with every card reachable. */
var GB_STATIC = /[?&]static=1(?:&|$)/.test(window.location.search) || document.documentElement.hasAttribute("data-static");
if (GB_STATIC) document.documentElement.setAttribute("data-static", "");

/* ---------- Alpine state system ---------- */
document.addEventListener("alpine:init", function () {

  /* Cart drawer state. The store is the source of truth on
     Alpine pages; app.js open/close functions are wrapped
     (below, on DOMContentLoaded) so every existing trigger —
     header button, builder add-to-cart, Escape — stays in
     sync with the store, and Alpine components open the
     drawer through the store alone. */
  Alpine.store("cartUI", {
    open: false,
    openCart: function () { if (window.GB_openDrawer) window.GB_openDrawer(); },
    closeCart: function () { if (window.GB_closeDrawer) window.GB_closeDrawer(); },
    toggle: function () { this.open ? this.closeCart() : this.openCart(); }
  });

  /* ---------- Shop: filters / search / sort ---------- */
  Alpine.data("gbShop", function () {
    return {
      cat: "all",
      query: "",
      sort: "featured",
      cats: CATEGORIES,
      countFor: function (c) {
        return c.id === "all" ? PRODUCTS.length : PRODUCTS.filter(function (p) { return p.category === c.id; }).length;
      },
      init: function () {
        var params = new URLSearchParams(window.location.search);
        var cat = params.get("cat") || "all";
        if (CATEGORIES.some(function (c) { return c.id === cat; })) this.cat = cat;
        this.query = (params.get("q") || "").toLowerCase();
        var search = document.getElementById("shop-search");
        if (search && this.query) search.value = this.query;
        this.render();
      },
      setCat: function (id) { this.cat = id; this.render(); },
      clearFilters: function () {
        this.cat = "all"; this.query = "";
        var search = document.getElementById("shop-search");
        if (search) search.value = "";
        this.render();
      },
      render: function () {
        var self = this;
        var grid = document.getElementById("shop-grid");
        var countEl = document.getElementById("result-count");
        if (!grid || !countEl) return;
        var list = PRODUCTS.filter(function (p) {
          var inCat = self.cat === "all" || p.category === self.cat;
          var inQuery = !self.query || (p.name + " " + p.tagline + " " + categoryLabel(p.category)).toLowerCase().indexOf(self.query) !== -1;
          return inCat && inQuery;
        });
        if (this.sort === "price-asc") list = list.slice().sort(function (a, b) { return a.price - b.price; });
        if (this.sort === "price-desc") list = list.slice().sort(function (a, b) { return b.price - a.price; });
        if (this.sort === "rating") list = list.slice().sort(function (a, b) { return b.rating - a.rating; });
        if (this.sort === "name") list = list.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });

        countEl.textContent = list.length + (list.length === 1 ? " basket" : " baskets") +
          (this.cat !== "all" ? " in " + categoryLabel(this.cat) : "") +
          (this.query ? ' matching "' + this.query + '"' : "");

        if (!list.length) {
          grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><h3>Nothing matches that search</h3>' +
            "<p>Try a different word — or browse the full collection, something beautiful is in there.</p>" +
            '<button type="button" class="btn" id="clear-filters">Show all baskets</button></div>';
          var clear = document.getElementById("clear-filters");
          if (clear) clear.addEventListener("click", function () { self.clearFilters(); });
          return;
        }
        grid.innerHTML = list.map(productCard).join("");
        grid.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
      }
    };
  });

  /* ---------- Builder: steps / selections / live total ---------- */
  Alpine.data("gbBuilder", function () {
    var BOX_IMG = {
      "box-petit": "images/products/little-luxuries-mini.jpg",
      "box-classic": "images/builder.jpg",
      "box-grand": "images/products/grand-celebration-hamper.jpg"
    };
    return {
      step: 1,
      box: null,
      treats: [],
      extras: [],
      recipient: "",
      message: "",
      error: "",
      review: "",
      boxes: BUILDER_BOXES,
      treatList: BUILDER_TREATS,
      extraList: BUILDER_EXTRAS,
      boxImg: BOX_IMG,
      fmt: function (n) { return fmtPKR(n); },
      get boxObj() { return BUILDER_BOXES.find(function (b) { return b.id === this.box; }.bind(this)) || null; },
      picked: function (list, ids) { return list.filter(function (x) { return ids.indexOf(x.id) !== -1; }); },
      get total() {
        var t = this.boxObj ? this.boxObj.price : 0;
        this.picked(BUILDER_TREATS, this.treats).forEach(function (x) { t += x.price; });
        this.picked(BUILDER_EXTRAS, this.extras).forEach(function (x) { t += x.price; });
        return t;
      },
      get lines() {
        var rows = [];
        var b = this.boxObj;
        if (b) rows.push({ name: b.name, label: fmtPKR(b.price) });
        this.picked(BUILDER_TREATS, this.treats).forEach(function (x) { rows.push({ name: x.name, label: fmtPKR(x.price) }); });
        this.picked(BUILDER_EXTRAS, this.extras).forEach(function (x) { rows.push({ name: x.name, label: x.price === 0 ? "Free" : fmtPKR(x.price) }); });
        return rows;
      },
      get canAdd() { return !!this.box && this.treats.length > 0; },
      validate: function (step) {
        if (step === 1 && !this.box) { this.showError("Please choose a basket first — Petit, Classic or Grand."); return false; }
        if (step === 2 && this.treats.length === 0) { this.showError("Please choose at least one treat for your basket."); return false; }
        return true;
      },
      showError: function (msg) {
        this.error = msg;
        this.$nextTick(function () {
          var el = document.getElementById("builder-error");
          if (el) el.focus();
        });
      },
      goTo: function (n) {
        this.step = n;
        this.error = "";
        if (n === 4) this.renderReview();
        var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        this.$root.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      },
      next: function () { if (this.validate(this.step)) this.goTo(this.step + 1); },
      back: function () { this.goTo(this.step - 1); },
      pillGo: function (n) {
        if (n < this.step) this.goTo(n);
        else if (n === this.step + 1 && this.validate(this.step)) this.goTo(n);
      },
      renderReview: function () {
        var b = this.boxObj;
        if (!b) { this.review = ""; return; }
        var treats = this.picked(BUILDER_TREATS, this.treats);
        var extras = this.picked(BUILDER_EXTRAS, this.extras);
        var tick = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>';
        this.review =
          visualHTML({ motif: "basket", c1: b.c1, c2: b.c2, img: BOX_IMG[b.id] || "", name: "Your custom basket" }, "pvisual--card") +
          '<div class="pd-contents" style="margin-top:1rem"><h3>Your composition</h3><ul>' +
          "<li>" + tick + "<strong>" + b.name + "</strong>&nbsp;— " + b.desc + "</li>" +
          treats.map(function (x) { return "<li>" + tick + x.name + " (" + x.meta + ")</li>"; }).join("") +
          extras.map(function (x) { return "<li>" + tick + x.name + "</li>"; }).join("") +
          "</ul></div>";
      },
      addToCart: function () {
        if (!this.validate(1)) { this.goTo(1); return; }
        if (!this.validate(2)) { this.goTo(2); return; }
        var b = this.boxObj;
        var parts = this.picked(BUILDER_TREATS, this.treats).map(function (x) { return x.name; })
          .concat(this.picked(BUILDER_EXTRAS, this.extras).map(function (x) { return x.name; }));
        var recipient = (this.recipient || "").trim();
        var message = (this.message || "").trim();
        CartStore.add({
          key: "custom-" + Date.now(),
          name: "Custom Basket — " + b.name,
          meta: parts.slice(0, 3).join(", ") + (parts.length > 3 ? " +" + (parts.length - 3) + " more" : "") +
                (recipient ? " · For: " + recipient : "") + (message ? " · Card message saved" : ""),
          price: this.total,
          motif: "basket", c1: b.c1, c2: b.c2,
          img: BOX_IMG[b.id] || ""
        }, 1);
        if (window.GB_updateCount) window.GB_updateCount();
        if (window.GB_toast) window.GB_toast("Your custom basket was added to the cart");
        Alpine.store("cartUI").openCart();
      }
    };
  });
});

/* ---------- Drawer-store sync + Swiper (after app.js is ready) ---------- */
document.addEventListener("DOMContentLoaded", function () {

  /* Keep the cartUI store in sync with the proven app.js drawer,
     whichever trigger opened or closed it. app.js binds its own
     internal references, so the store mirrors the drawer's real
     class state via an observer — every path (header button,
     builder add, overlay click, Escape) stays truthful. */
  if (window.Alpine) {
    var drawerEl = document.querySelector(".cart-drawer");
    if (drawerEl) {
      var syncStore = function () { Alpine.store("cartUI").open = drawerEl.classList.contains("open"); };
      new MutationObserver(syncStore).observe(drawerEl, { attributes: true, attributeFilter: ["class"] });
      syncStore();
    }
    if (window.GB_openDrawer && window.GB_closeDrawer) {
      var rawOpen = window.GB_openDrawer;
      var rawClose = window.GB_closeDrawer;
      window.GB_openDrawer = function () { rawOpen(); Alpine.store("cartUI").open = true; };
      window.GB_closeDrawer = function () { rawClose(); Alpine.store("cartUI").open = false; };
    }
  }

  /* Occasion rail — the pilot's one Swiper. Fixed slide
     dimensions in CSS keep CLS at zero; without JS (or without
     Swiper) the same markup is a scroll-snap rail and every
     occasion stays reachable. */
  var rail = document.querySelector(".occ-rail");
  if (rail && window.Swiper && !GB_STATIC) {
    new Swiper(rail, {
      slidesPerView: 1.12,
      spaceBetween: 16,
      speed: 420,
      keyboard: { enabled: true },
      navigation: { nextEl: ".occ-next", prevEl: ".occ-prev" },
      pagination: { el: ".occ-pagination", clickable: true },
      breakpoints: {
        640: { slidesPerView: 2.08, spaceBetween: 18 },
        1024: { slidesPerView: 3, spaceBetween: 20 }
      }
    });
  }
});

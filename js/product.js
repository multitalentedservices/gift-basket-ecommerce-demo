/* PRODUCT DETAIL — renders the product named by ?id= */
document.addEventListener("DOMContentLoaded", function () {
  const root = document.getElementById("pd-root");
  if (!root) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const p = PRODUCTS.find(function (x) { return x.id === id; }) || PRODUCTS[0];

  document.title = p.name + " — The Gilded Basket (Demo)";
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", p.tagline + " " + fmtPKR(p.price) + " — demo product page, The Gilded Basket gift atelier.");

  /* Alternate "views" (v2): the real product photograph at three
     framings — full, detail crop, texture crop. */
  const views = ["", "pvisual--zoom", "pvisual--zoom2"];

  root.innerHTML =
    '<div class="pd-grid">' +
      "<div>" +
        '<div id="pd-main">' + visualHTML(p, "pvisual--detail") + "</div>" +
        '<div class="thumb-row" role="group" aria-label="Product views">' +
          views.map(function (v, i) {
            return '<button type="button" class="thumb' + (i === 0 ? " active" : "") + '" data-view="' + i + '" aria-label="View ' + (i + 1) + '">' + visualHTML(p, v) + "</button>";
          }).join("") +
        "</div>" +
      "</div>" +
      '<div class="pd-info">' +
        '<span class="pcard-cat">' + categoryLabel(p.category) + " Collection</span>" +
        "<h1>" + p.name + "</h1>" +
        starsHTML(p.rating, p.reviews) +
        '<div class="price pd-price">' + (p.was ? '<span class="was">' + fmtPKR(p.was) + "</span>" : "") + fmtPKR(p.price) + "</div>" +
        '<p class="pd-desc">' + p.description + "</p>" +
        '<div class="pd-contents"><h3>Inside the basket</h3><ul>' +
          p.contents.map(function (c) {
            return '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>' + c + "</li>";
          }).join("") +
        "</ul></div>" +
        '<div class="qty-row">' +
          '<div class="qty-ctrl" aria-label="Quantity">' +
            '<button type="button" id="qty-minus" aria-label="Decrease quantity">−</button>' +
            '<output id="qty-out" aria-live="polite">1</output>' +
            '<button type="button" id="qty-plus" aria-label="Increase quantity">+</button>' +
          "</div>" +
          '<button type="button" class="btn btn--terra" id="pd-add" style="flex:1">Add to cart — <span id="pd-add-price">' + fmtPKR(p.price) + "</span></button>" +
        "</div>" +
        '<div class="pd-perks">' +
          '<div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></svg>Free delivery over ' + fmtPKR(FREE_DELIVERY_OVER) + "</div>" +
          '<div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 21s-7-4.6-9.3-9A5.4 5.4 0 0 1 12 6.5 5.4 5.4 0 0 1 21.3 12C19 16.4 12 21 12 21Z"/></svg>Hand-packed in Lahore</div>' +
          '<div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg>Hand-written card included</div>' +
        "</div>" +
      "</div>" +
    "</div>";

  /* View switcher */
  const main = document.getElementById("pd-main");
  root.querySelectorAll(".thumb").forEach(function (t) {
    t.addEventListener("click", function () {
      root.querySelectorAll(".thumb").forEach(function (x) { x.classList.remove("active"); });
      t.classList.add("active");
      main.innerHTML = visualHTML(p, "pvisual--detail " + views[Number(t.getAttribute("data-view"))]);
    });
  });

  /* Quantity + add */
  let qty = 1;
  const out = document.getElementById("qty-out");
  const addPrice = document.getElementById("pd-add-price");
  function syncQty() { out.textContent = qty; addPrice.textContent = fmtPKR(p.price * qty); }
  document.getElementById("qty-minus").addEventListener("click", function () { qty = Math.max(1, qty - 1); syncQty(); });
  document.getElementById("qty-plus").addEventListener("click", function () { qty = Math.min(99, qty + 1); syncQty(); });
  document.getElementById("pd-add").addEventListener("click", function () {
    CartStore.add(productToCartItem(p), qty);
    if (window.GB_updateCount) window.GB_updateCount();
    if (window.GB_toast) window.GB_toast(qty + " × " + p.name + " added to cart");
    if (window.GB_openDrawer) window.GB_openDrawer();
  });

  /* Related products (same category first, then bestsellers) */
  const rel = document.getElementById("related-grid");
  if (rel) {
    const sameCat = PRODUCTS.filter(function (x) { return x.id !== p.id && x.category === p.category; });
    const others = PRODUCTS.filter(function (x) { return x.id !== p.id && x.category !== p.category; })
      .sort(function (a, b) { return b.rating - a.rating; });
    rel.innerHTML = sameCat.concat(others).slice(0, 3).map(productCard).join("");
    rel.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }
});

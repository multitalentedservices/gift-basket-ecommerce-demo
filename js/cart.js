/* CART PAGE — full line management, totals, persistence via CartStore */
document.addEventListener("DOMContentLoaded", function () {
  const listEl = document.getElementById("cart-items");
  if (!listEl) return;
  const emptyEl = document.getElementById("cart-empty");
  const layoutEl = document.getElementById("cart-layout");

  function render() {
    const items = CartStore.load();
    if (!items.length) {
      layoutEl.hidden = true;
      emptyEl.hidden = false;
      return;
    }
    layoutEl.hidden = false;
    emptyEl.hidden = true;

    listEl.innerHTML = items.map(function (i) {
      return '<div class="cart-item">' +
        visualHTML(i, "") +
        "<div><h3>" + escHTML(i.name) + '</h3><div class="ci-meta">' + escHTML(i.meta) + '</div><div class="ci-meta">' + fmtPKR(i.price) + " each</div></div>" +
        '<div class="ci-right">' +
          '<div class="price">' + fmtPKR(i.price * i.qty) + "</div>" +
          '<div class="qty-ctrl qty-ctrl--sm" aria-label="Quantity for ' + escHTML(i.name) + '">' +
            '<button type="button" data-dec="' + i.key + '" aria-label="Decrease quantity">−</button>' +
            "<output>" + i.qty + "</output>" +
            '<button type="button" data-inc="' + i.key + '" aria-label="Increase quantity">+</button>' +
          "</div>" +
          '<button type="button" class="remove-btn" data-rem="' + i.key + '">Remove</button>' +
        "</div></div>";
    }).join("");

    const st = CartStore.subtotal();
    const fee = CartStore.deliveryFee();
    document.getElementById("ct-subtotal").textContent = fmtPKR(st);
    document.getElementById("ct-delivery").textContent = fee === 0 ? "Free" : fmtPKR(fee);
    document.getElementById("ct-total").textContent = fmtPKR(CartStore.total());
    const note = document.getElementById("ct-note");
    if (note) {
      note.textContent = fee === 0
        ? "Your order qualifies for free delivery."
        : "Add " + fmtPKR(FREE_DELIVERY_OVER - st) + " more for free delivery.";
    }

    listEl.querySelectorAll("[data-inc]").forEach(function (b) {
      b.addEventListener("click", function () {
        const it = CartStore.load().find(function (x) { return x.key === b.getAttribute("data-inc"); });
        if (it) CartStore.setQty(it.key, it.qty + 1);
        sync();
      });
    });
    listEl.querySelectorAll("[data-dec]").forEach(function (b) {
      b.addEventListener("click", function () {
        const it = CartStore.load().find(function (x) { return x.key === b.getAttribute("data-dec"); });
        if (it) CartStore.setQty(it.key, it.qty - 1);
        sync();
      });
    });
    listEl.querySelectorAll("[data-rem]").forEach(function (b) {
      b.addEventListener("click", function () {
        CartStore.remove(b.getAttribute("data-rem"));
        sync();
        if (window.GB_toast) window.GB_toast("Removed from cart");
      });
    });
  }

  function sync() {
    render();
    if (window.GB_updateCount) window.GB_updateCount();
    if (window.GB_renderDrawer) window.GB_renderDrawer();
  }
  window.GB_onCartChange = sync;
  render();
});

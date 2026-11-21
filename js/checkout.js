/* CHECKOUT (DEMO) — order summary, validated form, confirmation state.
   No real payment is processed; no data leaves the browser. */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  const summaryEl = document.getElementById("order-summary");
  const emptyEl = document.getElementById("checkout-empty");
  const mainEl = document.getElementById("checkout-main");
  const confirmEl = document.getElementById("confirmation");

  const items = CartStore.load();
  if (!items.length) {
    mainEl.hidden = true;
    emptyEl.hidden = false;
    return;
  }

  summaryEl.innerHTML =
    items.map(function (i) {
      return '<div class="order-line"><span class="ol-name">' + i.name + '<br><span class="ol-qty">' + i.meta + '</span></span><span class="ol-qty">× ' + i.qty + "</span><strong>" + fmtPKR(i.price * i.qty) + "</strong></div>";
    }).join("") +
    '<div class="sum-line"><span>Subtotal</span><strong>' + fmtPKR(CartStore.subtotal()) + "</strong></div>" +
    '<div class="sum-line"><span>Delivery</span><strong>' + (CartStore.deliveryFee() === 0 ? "Free" : fmtPKR(CartStore.deliveryFee())) + "</strong></div>" +
    '<div class="sum-line total"><span>Total (demo)</span><strong>' + fmtPKR(CartStore.total()) + "</strong></div>";

  /* --- Validation helpers --- */
  function setValidity(input, ok) {
    const field = input.closest(".field");
    if (field) field.classList.toggle("invalid", !ok);
    input.setAttribute("aria-invalid", ok ? "false" : "true");
    return ok;
  }
  const rules = {
    "co-name":    function (v) { return v.trim().length >= 3; },
    "co-email":   function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
    "co-phone":   function (v) { return /^[+\d][\d\s-]{9,15}$/.test(v.trim()); },
    "co-address": function (v) { return v.trim().length >= 8; },
    "co-city":    function (v) { return v.trim().length >= 2; },
    "co-date":    function (v) {
      if (!v) return false;
      const today = new Date(); today.setHours(0, 0, 0, 0);
      return new Date(v + "T00:00:00") >= today;
    }
  };
  Object.keys(rules).forEach(function (id) {
    const input = document.getElementById(id);
    if (input) input.addEventListener("blur", function () { setValidity(input, rules[id](input.value)); });
    /* v2 fix: an error clears live, the moment the field becomes valid
       again — no stale error text lingering until the next submit. */
    if (input) ["input", "change"].forEach(function (ev) {
      input.addEventListener(ev, function () {
        const field = input.closest(".field");
        if (field && field.classList.contains("invalid") && rules[id](input.value)) setValidity(input, true);
      });
    });
  });

  /* Earliest delivery date = today */
  const dateInput = document.getElementById("co-date");
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let firstBad = null;
    Object.keys(rules).forEach(function (id) {
      const input = document.getElementById(id);
      if (!input) return;
      const ok = setValidity(input, rules[id](input.value));
      if (!ok && !firstBad) firstBad = input;
    });
    if (firstBad) { firstBad.focus(); firstBad.scrollIntoView({ behavior: "smooth", block: "center" }); return; }

    const name = document.getElementById("co-name").value.trim();
    const orderNo = "GB-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
    const totalPaid = fmtPKR(CartStore.total());
    const itemCount = CartStore.count();

    CartStore.clear();
    if (window.GB_updateCount) window.GB_updateCount();

    mainEl.hidden = true;
    confirmEl.hidden = false;
    document.getElementById("conf-text").innerHTML =
      "Thank you, <strong>" + escHTML(name.split(" ")[0]) + "</strong>. Your demo order of <strong>" + itemCount + (itemCount === 1 ? " item" : " items") +
      "</strong> totalling <strong>" + totalPaid + "</strong> has been placed in this demonstration storefront. " +
      "In the live shop, a confirmation email and courier tracking would follow — here, the flow simply ends, exactly as designed.";
    document.getElementById("conf-order-no").textContent = orderNo;
    confirmEl.scrollIntoView({ behavior: "smooth", block: "start" });
    const h = confirmEl.querySelector("h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  });
});

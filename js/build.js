/* BUILD YOUR BASKET — 4-step wizard with live total */
document.addEventListener("DOMContentLoaded", function () {
  const root = document.getElementById("builder-root");
  if (!root) return;

  const state = { step: 1, box: null, treats: new Set(), extras: new Set(), recipient: "", message: "" };

  /* Real photography for each box size (v2) */
  const BOX_IMG = {
    "box-petit": "images/products/little-luxuries-mini.jpg",
    "box-classic": "images/builder.jpg",
    "box-grand": "images/products/grand-celebration-hamper.jpg"
  };

  /* --- Render step 1: boxes --- */
  document.getElementById("box-grid").innerHTML = BUILDER_BOXES.map(function (b) {
    return '<div class="opt-card"><input type="radio" name="bbox" id="box-' + b.id + '" value="' + b.id + '">' +
      '<label for="box-' + b.id + '"><img class="opt-swatch" src="' + (BOX_IMG[b.id] || "") + '" alt="">' +
      "<h4>" + b.name + "</h4><p>" + b.desc + '</p><span class="opt-price">' + fmtPKR(b.price) + "</span></label></div>";
  }).join("");

  /* --- Render step 2: treats --- */
  document.getElementById("treat-grid").innerHTML = BUILDER_TREATS.map(function (t) {
    return '<div class="check-card"><input type="checkbox" id="tr-' + t.id + '" value="' + t.id + '">' +
      '<label for="tr-' + t.id + '"><span class="cc-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg></span>' +
      "<span><strong>" + t.name + "</strong><span>" + t.meta + '</span></span><span class="cc-price">+' + fmtPKR(t.price) + "</span></label></div>";
  }).join("");

  /* --- Render step 3: extras --- */
  document.getElementById("extra-grid").innerHTML = BUILDER_EXTRAS.map(function (t) {
    return '<div class="check-card"><input type="checkbox" id="ex-' + t.id + '" value="' + t.id + '">' +
      '<label for="ex-' + t.id + '"><span class="cc-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg></span>' +
      "<span><strong>" + t.name + "</strong><span>" + t.meta + '</span></span><span class="cc-price">' + (t.price === 0 ? "Free" : "+" + fmtPKR(t.price)) + "</span></label></div>";
  }).join("");

  const panels = root.querySelectorAll(".step-panel");
  const pills = root.querySelectorAll(".step-pill");
  const errBox = document.getElementById("builder-error");

  function boxObj() { return BUILDER_BOXES.find(function (b) { return b.id === state.box; }) || null; }
  function selected(list, set) { return list.filter(function (x) { return set.has(x.id); }); }
  function total() {
    let t = state.box ? boxObj().price : 0;
    selected(BUILDER_TREATS, state.treats).forEach(function (x) { t += x.price; });
    selected(BUILDER_EXTRAS, state.extras).forEach(function (x) { t += x.price; });
    return t;
  }

  function renderSummary() {
    const lines = document.getElementById("sum-lines");
    const rows = [];
    const b = boxObj();
    if (b) rows.push('<div class="sum-line"><span>' + b.name + "</span><strong>" + fmtPKR(b.price) + "</strong></div>");
    selected(BUILDER_TREATS, state.treats).forEach(function (x) {
      rows.push('<div class="sum-line"><span>' + x.name + "</span><strong>" + fmtPKR(x.price) + "</strong></div>");
    });
    selected(BUILDER_EXTRAS, state.extras).forEach(function (x) {
      rows.push('<div class="sum-line"><span>' + x.name + "</span><strong>" + (x.price === 0 ? "Free" : fmtPKR(x.price)) + "</strong></div>");
    });
    lines.innerHTML = rows.length ? rows.join("") : '<p class="sum-empty">Choose a basket to begin — your composition will appear here as you build.</p>';
    document.getElementById("sum-total").textContent = fmtPKR(total());
    const addBtn = document.getElementById("builder-add");
    if (addBtn) addBtn.disabled = !(state.box && state.treats.size > 0);
  }

  function goTo(step) {
    state.step = step;
    panels.forEach(function (pn) { pn.classList.toggle("active", Number(pn.getAttribute("data-panel")) === step); });
    pills.forEach(function (pl) {
      const n = Number(pl.getAttribute("data-step"));
      pl.classList.toggle("active", n === step);
      pl.classList.toggle("done", n < step);
      pl.setAttribute("aria-current", n === step ? "step" : "false");
    });
    errBox.hidden = true;
    root.scrollIntoView({ behavior: "smooth", block: "start" });
    renderSummary();
  }

  function showError(msg) {
    errBox.textContent = msg;
    errBox.hidden = false;
    errBox.focus();
  }

  function validateStep(step) {
    if (step === 1 && !state.box) { showError("Please choose a basket first — Petit, Classic or Grand."); return false; }
    if (step === 2 && state.treats.size === 0) { showError("Please choose at least one treat for your basket."); return false; }
    return true;
  }

  root.querySelectorAll("[data-next]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!validateStep(state.step)) return;
      if (state.step === 3) renderReview();
      goTo(state.step + 1);
    });
  });
  root.querySelectorAll("[data-back]").forEach(function (btn) {
    btn.addEventListener("click", function () { goTo(state.step - 1); });
  });
  pills.forEach(function (pl) {
    pl.addEventListener("click", function () {
      const target = Number(pl.getAttribute("data-step"));
      if (target < state.step) goTo(target);
      else if (target === state.step + 1 && validateStep(state.step)) { if (state.step === 3) renderReview(); goTo(target); }
    });
  });

  document.getElementById("box-grid").addEventListener("change", function (e) {
    state.box = e.target.value; renderSummary();
  });
  document.getElementById("treat-grid").addEventListener("change", function (e) {
    if (e.target.checked) state.treats.add(e.target.value); else state.treats.delete(e.target.value);
    renderSummary();
  });
  document.getElementById("extra-grid").addEventListener("change", function (e) {
    if (e.target.checked) state.extras.add(e.target.value); else state.extras.delete(e.target.value);
    renderSummary();
  });

  function renderReview() {
    const b = boxObj();
    const treats = selected(BUILDER_TREATS, state.treats);
    const extras = selected(BUILDER_EXTRAS, state.extras);
    document.getElementById("review-box").innerHTML =
      visualHTML({ motif: "basket", c1: b.c1, c2: b.c2, img: BOX_IMG[b.id] || "", name: "Your custom basket" }, "pvisual--card") +
      '<div class="pd-contents" style="margin-top:1rem"><h3>Your composition</h3><ul>' +
      '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg><strong>' + b.name + "</strong>&nbsp;— " + b.desc + "</li>" +
      treats.map(function (x) { return '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>' + x.name + " (" + x.meta + ")</li>"; }).join("") +
      extras.map(function (x) { return '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>' + x.name + "</li>"; }).join("") +
      "</ul></div>";
  }

  document.getElementById("builder-add").addEventListener("click", function () {
    if (!validateStep(1) || !validateStep(2)) { goTo(!state.box ? 1 : 2); return; }
    const b = boxObj();
    const treats = selected(BUILDER_TREATS, state.treats);
    const extras = selected(BUILDER_EXTRAS, state.extras);
    const recipient = (document.getElementById("f-recipient").value || "").trim();
    const message = (document.getElementById("f-message").value || "").trim();
    const parts = treats.map(function (x) { return x.name; }).concat(extras.map(function (x) { return x.name; }));
    const item = {
      key: "custom-" + Date.now(),
      name: "Custom Basket — " + b.name,
      meta: parts.slice(0, 3).join(", ") + (parts.length > 3 ? " +" + (parts.length - 3) + " more" : "") +
            (recipient ? " · For: " + recipient : "") + (message ? " · Card message saved" : ""),
      price: total(),
      motif: "basket", c1: b.c1, c2: b.c2,
      img: BOX_IMG[b.id] || ""
    };
    CartStore.add(item, 1);
    if (window.GB_updateCount) window.GB_updateCount();
    if (window.GB_toast) window.GB_toast("Your custom basket was added to the cart");
    if (window.GB_openDrawer) window.GB_openDrawer();
  });

  renderSummary();
});

/* SHOP — filtering, search, sort (all client-side, real) */
document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("shop-grid");
  const countEl = document.getElementById("result-count");
  const searchInput = document.getElementById("shop-search");
  const sortSelect = document.getElementById("shop-sort");
  const filterList = document.getElementById("filter-list");
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  let activeCat = params.get("cat") || "all";
  if (!CATEGORIES.some(function (c) { return c.id === activeCat; })) activeCat = "all";
  let query = (params.get("q") || "").toLowerCase();
  if (searchInput && query) searchInput.value = query;

  /* Build filter buttons with counts */
  filterList.innerHTML = CATEGORIES.map(function (c) {
    const n = c.id === "all" ? PRODUCTS.length : PRODUCTS.filter(function (p) { return p.category === c.id; }).length;
    return '<button type="button" data-cat="' + c.id + '" class="' + (c.id === activeCat ? "active" : "") + '" aria-pressed="' + (c.id === activeCat) + '">' + c.label + '<span class="n">' + n + "</span></button>";
  }).join("");

  filterList.querySelectorAll("button").forEach(function (b) {
    b.addEventListener("click", function () {
      activeCat = b.getAttribute("data-cat");
      filterList.querySelectorAll("button").forEach(function (x) {
        const on = x.getAttribute("data-cat") === activeCat;
        x.classList.toggle("active", on);
        x.setAttribute("aria-pressed", on ? "true" : "false");
      });
      render();
    });
  });

  if (searchInput) searchInput.addEventListener("input", function () { query = searchInput.value.trim().toLowerCase(); render(); });
  if (sortSelect) sortSelect.addEventListener("change", render);

  function render() {
    let list = PRODUCTS.filter(function (p) {
      const inCat = activeCat === "all" || p.category === activeCat;
      const inQuery = !query || (p.name + " " + p.tagline + " " + categoryLabel(p.category)).toLowerCase().indexOf(query) !== -1;
      return inCat && inQuery;
    });
    const sort = sortSelect ? sortSelect.value : "featured";
    if (sort === "price-asc") list = list.slice().sort(function (a, b) { return a.price - b.price; });
    if (sort === "price-desc") list = list.slice().sort(function (a, b) { return b.price - a.price; });
    if (sort === "rating") list = list.slice().sort(function (a, b) { return b.rating - a.rating; });
    if (sort === "name") list = list.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });

    countEl.textContent = list.length + (list.length === 1 ? " basket" : " baskets") +
      (activeCat !== "all" ? " in " + categoryLabel(activeCat) : "") +
      (query ? ' matching "' + query + '"' : "");

    if (!list.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><h3>Nothing matches that search</h3>' +
        "<p>Try a different word — or browse the full collection, something beautiful is in there.</p>" +
        '<button type="button" class="btn" id="clear-filters">Show all baskets</button></div>';
      const clear = document.getElementById("clear-filters");
      clear.addEventListener("click", function () {
        activeCat = "all"; query = "";
        if (searchInput) searchInput.value = "";
        filterList.querySelectorAll("button").forEach(function (x) {
          const on = x.getAttribute("data-cat") === "all";
          x.classList.toggle("active", on);
          x.setAttribute("aria-pressed", on ? "true" : "false");
        });
        render();
      });
      return;
    }
    grid.innerHTML = list.map(productCard).join("");
    grid.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  render();
});

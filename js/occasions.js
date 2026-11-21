/* OCCASIONS — renders curated product picks into each occasion section */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-picks]").forEach(function (el) {
    const ids = el.getAttribute("data-picks").split(",");
    const picks = ids.map(function (id) {
      return PRODUCTS.find(function (p) { return p.id === id; });
    }).filter(Boolean);
    el.innerHTML = picks.map(productCard).join("");
    el.querySelectorAll(".reveal").forEach(function (x) { x.classList.add("in"); });
  });
});

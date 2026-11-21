/* HOME — bestsellers rail (top-rated products from the catalogue) */
document.addEventListener("DOMContentLoaded", function () {
  const rail = document.getElementById("home-bestsellers");
  if (!rail) return;
  const top = PRODUCTS.slice().sort(function (a, b) {
    return (b.rating - a.rating) || (b.reviews - a.reviews);
  }).slice(0, 4);
  rail.innerHTML = top.map(productCard).join("");
  if (window.GB_revealScan) window.GB_revealScan(rail);
});

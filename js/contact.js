/* CONTACT + CORPORATE ENQUIRY forms — validation + success state.
   Shared by contact.html (#contact-form) and corporate.html (#corp-form).
   Demo only: nothing is transmitted anywhere. */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".js-validated-form");
  if (!form) return;

  function setValidity(input, ok) {
    const field = input.closest(".field");
    if (field) field.classList.toggle("invalid", !ok);
    input.setAttribute("aria-invalid", ok ? "false" : "true");
    return ok;
  }
  const validators = {
    name:    function (v) { return v.trim().length >= 3; },
    email:   function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
    phone:   function (v) { return v.trim() === "" || /^[+\d][\d\s-]{9,15}$/.test(v.trim()); },
    company: function (v) { return v.trim().length >= 2; },
    qty:     function (v) { return v === "" || (Number(v) >= 1 && Number(v) <= 100000); },
    message: function (v) { return v.trim().length >= 10; }
  };

  const fields = Array.prototype.slice.call(form.querySelectorAll("[data-validate]"));
  fields.forEach(function (input) {
    input.addEventListener("blur", function () {
      const rule = validators[input.getAttribute("data-validate")];
      if (rule) setValidity(input, rule(input.value));
    });
    /* v2 fix: an error clears live once the field is valid again. */
    ["input", "change"].forEach(function (ev) {
      input.addEventListener(ev, function () {
        const field = input.closest(".field");
        const rule = validators[input.getAttribute("data-validate")];
        if (field && rule && field.classList.contains("invalid") && rule(input.value)) setValidity(input, true);
      });
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let firstBad = null;
    fields.forEach(function (input) {
      const rule = validators[input.getAttribute("data-validate")];
      if (!rule) return;
      const required = input.hasAttribute("required");
      const ok = (!required && input.value.trim() === "") ? true : rule(input.value);
      if (!setValidity(input, ok) && !firstBad) firstBad = input;
    });
    if (firstBad) { firstBad.focus(); firstBad.scrollIntoView({ behavior: "smooth", block: "center" }); return; }

    const success = document.getElementById("form-success");
    const nameInput = form.querySelector('[data-validate="name"]');
    const first = nameInput ? nameInput.value.trim().split(" ")[0] : "there";
    form.hidden = true;
    if (success) {
      success.hidden = false;
      const p = success.querySelector("[data-success-name]");
      if (p) p.textContent = first;
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  const again = document.getElementById("send-another");
  if (again) again.addEventListener("click", function () {
    form.reset();
    form.hidden = false;
    const success = document.getElementById("form-success");
    if (success) success.hidden = true;
  });
});

(function () {
  "use strict";

  var targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
    document.querySelectorAll(".section-label").forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  /* Stagger index is computed per-parent, so each group of siblings
     (a card grid, a stats row) cascades on its own rather than
     inheriting a running count from the whole page. */
  var seen = new Map();
  targets.forEach(function (el) {
    var parent = el.parentElement;
    var n = seen.get(parent) || 0;
    el.style.setProperty("--i", Math.min(n, 5));
    seen.set(parent, n + 1);
  });

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        var label = entry.target.querySelector(".section-label");
        if (label) label.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  targets.forEach(function (el) { observer.observe(el); });
})();

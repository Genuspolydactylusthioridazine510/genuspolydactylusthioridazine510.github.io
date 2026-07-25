(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ------------------------------------------------------------------
     Scroll progress bar
     ------------------------------------------------------------------ */
  var bar = document.querySelector(".scroll-progress");
  if (bar) {
    var barTicking = false;
    var updateBar = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = "scaleX(" + pct + ")";
      barTicking = false;
    };
    window.addEventListener("scroll", function () {
      if (!barTicking) {
        window.requestAnimationFrame(updateBar);
        barTicking = true;
      }
    }, { passive: true });
    updateBar();
  }

  if (prefersReduced) return;

  /* ------------------------------------------------------------------
     Count-up stats — animates once when the row scrolls into view
     ------------------------------------------------------------------ */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-count-suffix") || "";
      var duration = 1400;
      var start = null;

      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };

    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { countObserver.observe(el); });
  }

  if (!finePointer) return;

  /* ------------------------------------------------------------------
     Magnetic buttons — the button drifts slightly toward the cursor
     ------------------------------------------------------------------ */
  document.querySelectorAll("[data-magnetic]").forEach(function (el) {
    var strength = parseFloat(el.getAttribute("data-magnetic")) || 0.25;

    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = "translate(" + dx * strength + "px, " + dy * strength + "px)";
    });

    el.addEventListener("mouseleave", function () {
      el.style.transform = "";
    });
  });

  /* ------------------------------------------------------------------
     Hero orb parallax — orbs drift opposite the cursor, and with scroll
     ------------------------------------------------------------------ */
  var orbs = document.querySelectorAll(".orb");
  if (orbs.length) {
    var mx = 0, my = 0, sy = 0;
    var rafPending = false;

    var applyParallax = function () {
      orbs.forEach(function (orb, i) {
        var depth = (i + 1) * 14;
        var scrollShift = sy * (0.05 + i * 0.03);
        orb.style.translate = (-mx * depth) + "px " + (-my * depth + scrollShift) + "px";
      });
      rafPending = false;
    };

    var schedule = function () {
      if (!rafPending) {
        window.requestAnimationFrame(applyParallax);
        rafPending = true;
      }
    };

    window.addEventListener("mousemove", function (e) {
      mx = (e.clientX / window.innerWidth) - 0.5;
      my = (e.clientY / window.innerHeight) - 0.5;
      schedule();
    }, { passive: true });

    window.addEventListener("scroll", function () {
      sy = window.scrollY;
      schedule();
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     Card tilt — subtle 3D response to cursor position
     ------------------------------------------------------------------ */
  document.querySelectorAll("[data-tilt]").forEach(function (card) {
    var MAX = 5; // degrees

    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        "perspective(900px) rotateX(" + (-py * MAX) + "deg) rotateY(" + (px * MAX) +
        "deg) translateY(-8px)";
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });
})();

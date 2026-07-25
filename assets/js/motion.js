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
      bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
      barTicking = false;
    };
    window.addEventListener("scroll", function () {
      if (!barTicking) { window.requestAnimationFrame(updateBar); barTicking = true; }
    }, { passive: true });
    updateBar();
  }

  /* ------------------------------------------------------------------
     Scroll-spy dots — jump links that track the section you're in
     ------------------------------------------------------------------ */
  var spy = document.querySelector(".spy-nav");
  if (spy) {
    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
    sections.forEach(function (section) {
      var dot = document.createElement("a");
      dot.className = "spy-dot";
      dot.href = "#" + section.id;
      dot.setAttribute("data-label", section.getAttribute("data-spy-label") || section.id);
      dot.setAttribute("aria-label", "Jump to " + section.id);
      spy.appendChild(dot);
    });

    var dots = spy.querySelectorAll(".spy-dot");
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var idx = sections.indexOf(entry.target);
        dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
      });
    }, { threshold: 0.4 });

    sections.forEach(function (s) { spyObserver.observe(s); });
  }

  if (prefersReduced) return;

  /* ------------------------------------------------------------------
     Split the hero headline into words so each can rise independently
     ------------------------------------------------------------------ */
  document.querySelectorAll("[data-split]").forEach(function (el) {
    var index = 0;

    var splitNode = function (node) {
      // Text nodes get chopped into per-word spans; elements recurse so
      // inline markup (the gradient <span>) survives the transformation.
      if (node.nodeType === Node.TEXT_NODE) {
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (chunk) {
          if (!chunk.trim()) { frag.appendChild(document.createTextNode(chunk)); return; }
          var outer = document.createElement("span");
          outer.className = "split-word";
          var inner = document.createElement("span");
          inner.textContent = chunk;
          inner.style.setProperty("--w", index++);
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        node.parentNode.replaceChild(frag, node);
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;

      // Gradient text relies on background-clip against its own box, so
      // slicing it into per-word spans would break the fill. Rise as one unit.
      if (node.classList && node.classList.contains("text-gradient")) {
        var wrap = document.createElement("span");
        wrap.className = "split-word";
        var lift = document.createElement("span");
        lift.style.setProperty("--w", index++);
        node.parentNode.replaceChild(wrap, node);
        lift.appendChild(node);
        wrap.appendChild(lift);
        return;
      }

      Array.prototype.slice.call(node.childNodes).forEach(splitNode);
    };

    Array.prototype.slice.call(el.childNodes).forEach(splitNode);
  });

  /* ------------------------------------------------------------------
     Count-up stats
     ------------------------------------------------------------------ */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var duration = 1500;
      var start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
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

  /* ------------------------------------------------------------------
     Floating particles in the hero
     ------------------------------------------------------------------ */
  var particleHost = document.querySelector("[data-particles]");
  if (particleHost) {
    for (var i = 0; i < 18; i++) {
      var p = document.createElement("span");
      var size = 2 + Math.round(Math.random() * 3);
      p.className = "particle";
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = (Math.random() * 100) + "%";
      p.style.top = (55 + Math.random() * 45) + "%";
      p.style.animationDuration = (9 + Math.random() * 12) + "s";
      p.style.animationDelay = (Math.random() * 10) + "s";
      particleHost.appendChild(p);
    }
  }

  /* ------------------------------------------------------------------
     Button ripple on click
     ------------------------------------------------------------------ */
  document.querySelectorAll(".btn-primary").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var r = btn.getBoundingClientRect();
      var ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = (e.clientX - r.left) + "px";
      ripple.style.top = (e.clientY - r.top) + "px";
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 650);
    });
  });

  /* ------------------------------------------------------------------
     Hero parallax — content drifts and fades as you scroll past it
     ------------------------------------------------------------------ */
  var heroContent = document.querySelector("[data-parallax]");
  if (heroContent) {
    var pTicking = false;
    var applyHeroParallax = function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroContent.style.transform = "translateY(" + y * 0.22 + "px)";
        heroContent.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.8)));
      }
      pTicking = false;
    };
    window.addEventListener("scroll", function () {
      if (!pTicking) { window.requestAnimationFrame(applyHeroParallax); pTicking = true; }
    }, { passive: true });
  }

  if (!finePointer) return;

  /* ------------------------------------------------------------------
     Magnetic buttons
     ------------------------------------------------------------------ */
  document.querySelectorAll("[data-magnetic]").forEach(function (el) {
    var strength = parseFloat(el.getAttribute("data-magnetic")) || 0.25;
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = "translate(" + dx * strength + "px, " + dy * strength + "px)";
    });
    el.addEventListener("mouseleave", function () { el.style.transform = ""; });
  });

  /* ------------------------------------------------------------------
     Orb parallax against the cursor
     ------------------------------------------------------------------ */
  var orbs = document.querySelectorAll(".orb");
  if (orbs.length) {
    var mx = 0, my = 0, sy = 0, orbPending = false;

    var applyOrbs = function () {
      orbs.forEach(function (orb, i) {
        var depth = (i + 1) * 14;
        orb.style.translate =
          (-mx * depth) + "px " + (-my * depth + sy * (0.05 + i * 0.03)) + "px";
      });
      orbPending = false;
    };
    var scheduleOrbs = function () {
      if (!orbPending) { window.requestAnimationFrame(applyOrbs); orbPending = true; }
    };

    window.addEventListener("mousemove", function (e) {
      mx = (e.clientX / window.innerWidth) - 0.5;
      my = (e.clientY / window.innerHeight) - 0.5;
      scheduleOrbs();
    }, { passive: true });

    window.addEventListener("scroll", function () {
      sy = window.scrollY; scheduleOrbs();
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     Card tilt + cursor spotlight
     ------------------------------------------------------------------ */
  document.querySelectorAll("[data-tilt]").forEach(function (card) {
    var MAX = 5;
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        "perspective(900px) rotateX(" + (-py * MAX) + "deg) rotateY(" + (px * MAX) +
        "deg) translateY(-8px)";
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
    card.addEventListener("mouseleave", function () { card.style.transform = ""; });
  });
})();

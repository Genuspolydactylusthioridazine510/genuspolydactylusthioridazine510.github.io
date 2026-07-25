(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var navList = document.querySelector(".nav-list");
  var scrim = document.querySelector(".nav-scrim");
  var navLinks = document.querySelectorAll(".nav-link");

  /* Sticky header gains a blur-glass background after scrolling */
  if (header) {
    var ticking = false;
    var applyScrollState = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 60);
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(applyScrollState);
        ticking = true;
      }
    });
    applyScrollState();
  }

  /* Mobile off-canvas nav menu */
  function closeMenu() {
    if (!navList) return;
    navList.classList.remove("is-open");
    if (scrim) scrim.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    if (!navList) return;
    navList.classList.add("is-open");
    if (scrim) scrim.classList.add("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    var firstLink = navList.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      var isOpen = navList.classList.contains("is-open");
      if (isOpen) closeMenu(); else openMenu();
    });

    if (scrim) scrim.addEventListener("click", closeMenu);

    navList.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navList.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    });

    /* Simple focus trap while the mobile menu is open */
    navList.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !navList.classList.contains("is-open")) return;
      var focusable = navList.querySelectorAll("a, button");
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* Active-nav-link-on-scroll highlighting (homepage only) */
  var sections = document.querySelectorAll("main section[id]");
  if (sections.length && navLinks.length) {
    var linkForSection = {};
    navLinks.forEach(function (link) {
      var hash = link.getAttribute("href");
      if (hash && hash.indexOf("#") !== -1) {
        var id = hash.split("#")[1];
        linkForSection[id] = link;
      }
    });

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = linkForSection[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove("is-active"); });
            link.classList.add("is-active");
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }
})();

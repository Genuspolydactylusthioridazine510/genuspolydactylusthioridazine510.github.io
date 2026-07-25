(function () {
  "use strict";

  var header = document.querySelector(".site-header");

  function headerOffset() {
    return header ? header.getBoundingClientRect().height + 16 : 16;
  }

  function scrollToHash(hash) {
    if (!hash || hash === "#") return;
    var target = document.querySelector(hash);
    if (!target) return;
    var top = window.scrollY + target.getBoundingClientRect().top - headerOffset();
    window.scrollTo({ top: top, behavior: "smooth" });
  }

  /* In-page anchor clicks: correct for the sticky header's height
     (CSS scroll-behavior: smooth handles the animation itself). */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      scrollToHash(hash);
      history.pushState(null, "", hash);
    });
  });

  /* Landing on a page with a hash already in the URL (e.g. resume.html
     linking to index.html#projects) also needs the header-offset correction. */
  if (window.location.hash) {
    window.addEventListener("load", function () {
      scrollToHash(window.location.hash);
    });
  }
})();

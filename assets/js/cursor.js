(function () {
  "use strict";

  var supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!supportsFinePointer || prefersReduced) return;

  var dot = document.createElement("div");
  dot.className = "cursor-dot";
  document.body.appendChild(dot);

  var mouseX = 0, mouseY = 0;
  var posX = 0, posY = 0;
  var active = false;

  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!active) {
      active = true;
      dot.classList.add("is-active");
      posX = mouseX;
      posY = mouseY;
    }
  });

  document.addEventListener("mouseleave", function () {
    active = false;
    dot.classList.remove("is-active");
  });

  function loop() {
    posX += (mouseX - posX) * 0.18;
    posY += (mouseY - posY) * 0.18;
    dot.style.transform = "translate(" + posX + "px, " + posY + "px) translate(-50%, -50%)";
    window.requestAnimationFrame(loop);
  }
  window.requestAnimationFrame(loop);

  document.querySelectorAll("a, button").forEach(function (el) {
    el.addEventListener("mouseenter", function () { dot.classList.add("is-hovering"); });
    el.addEventListener("mouseleave", function () { dot.classList.remove("is-hovering"); });
  });
})();

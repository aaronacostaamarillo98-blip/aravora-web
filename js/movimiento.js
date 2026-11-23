/* aravora · movimiento (GSAP + ScrollTrigger). El contenido se ve completo sin JS. */
(function () {
  "use strict";
  function safe(fn, n) { try { fn(); } catch (e) { if (window.console) console.warn("[aravora] " + n, e); } }
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function hero() {
    gsap.timeline({ defaults: { ease: "expo.out" } })
      .from(".hero-t [data-hw]", { yPercent: 110, opacity: 0, duration: 1.3, stagger: 0.14 })
      .from("[data-hx]", { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, "-=0.9")
      .from("#ventana", { y: 70, opacity: 0, scale: 0.96, duration: 1.6 }, 0.25);
  }
  function parallax() {
    gsap.fromTo("#heroImg", { scale: 1.12, yPercent: -4 }, { scale: 1, yPercent: 6, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to("#ventana", { yPercent: -10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero-copy", { yPercent: -18, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }
  function frase() {
    var p = document.getElementById("frase"); if (!p) return;
    (function wrap(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var f = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { f.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement("span"); s.className = "w"; s.textContent = part; f.appendChild(s);
          });
          c.parentNode.replaceChild(f, c);
        } else if (c.nodeType === 1) { wrap(c); }
      });
    })(p);
    gsap.to(p.querySelectorAll(".w"), { opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: p, start: "top 80%", end: "bottom 45%", scrub: true } });
  }
  function entradas() {
    gsap.utils.toArray("[data-lado]").forEach(function (el) {
      gsap.from(el, { x: el.getAttribute("data-lado") === "izq" ? -110 : 110, opacity: 0, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });
    ScrollTrigger.batch("[data-sube]", { start: "top 90%", once: true,
      onEnter: function (els) { gsap.from(els, { y: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 }); } });
  }
  function gira() {
    var items = document.querySelectorAll(".gira-item"), n = items.length;
    gsap.fromTo("#giraImg", { rotate: -12, scale: 0.88, yPercent: 6 }, { rotate: 10, scale: 1.05, yPercent: -4, ease: "none",
      scrollTrigger: { trigger: ".gira", start: "top top", end: "bottom bottom", scrub: 0.6,
        onUpdate: function (self) { var k = Math.min(n - 1, Math.floor(self.progress * n)); items.forEach(function (el, i) { el.classList.toggle("on", i === k); }); } } });
    gsap.fromTo(".gira-glow", { scale: 0.8, opacity: 0.5 }, { scale: 1.2, opacity: 1, ease: "none",
      scrollTrigger: { trigger: ".gira", start: "top top", end: "bottom bottom", scrub: true } });
  }
  function init() {
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    try { gsap.registerPlugin(ScrollTrigger); } catch (_) {}
    safe(hero, "hero"); safe(parallax, "parallax"); safe(frase, "frase"); safe(entradas, "entradas"); safe(gira, "gira");
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

(function () {
  "use strict";

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.warn("[aura] " + name, e); }
  }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Selector de colores (funciona sin GSAP) ---------- */
  function initColors() {
    var img = document.getElementById("colorImg");
    var label = document.getElementById("colorName");
    var swatches = document.querySelectorAll(".swatch");
    if (!img || !swatches.length) return;
    swatches.forEach(function (s) {
      s.addEventListener("click", function () {
        swatches.forEach(function (o) { o.classList.remove("is-active"); o.setAttribute("aria-checked", "false"); });
        s.classList.add("is-active"); s.setAttribute("aria-checked", "true");
        var f = s.getAttribute("data-filter");
        img.style.filter = (f === "none" ? "" : f + " ") + "drop-shadow(0 30px 50px rgba(0,0,0,.8))";
        img.style.transform = "scale(1.04)";
        setTimeout(function () { img.style.transform = ""; }, 350);
        img.alt = "Auriculares Aura en color " + s.getAttribute("data-name");
        if (label) label.textContent = s.getAttribute("data-name");
      });
    });
  }

  /* ---------- Sección fija sin GSAP: cambia el dato según el scroll ---------- */
  function setSpinIndex(i) {
    var items = document.querySelectorAll(".spin__item");
    items.forEach(function (el, k) { el.classList.toggle("is-on", k === i); });
  }

  /* ---------- 1. Hero: el título aparece (fade + sube) ---------- */
  function initHero() {
    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(".hero__title [data-word]", { yPercent: 110, opacity: 0, duration: 1.3, stagger: 0.12 })
      .from("[data-hero]", { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, "-=0.9")
      .from("#product", { y: 80, scale: 0.92, opacity: 0, duration: 1.6 }, 0.15)
      .from(".hero__glow", { opacity: 0, scale: 0.7, duration: 2 }, 0)
      .from(".nav", { y: -60, opacity: 0, duration: 1 }, 0.2);
  }

  /* ---------- 2. Parallax: producto, brillo y texto a distinta velocidad ---------- */
  function initParallax() {
    var st = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
    gsap.to("#product", { yPercent: -18, rotate: -6, scale: 1.06, ease: "none", scrollTrigger: st });
    gsap.to(".hero__glow", { yPercent: 25, opacity: 0.4, ease: "none", scrollTrigger: st });
    gsap.to(".hero__copy", { yPercent: -35, opacity: 0, ease: "none", scrollTrigger: st });
  }

  /* ---------- 3. Frase que se ilumina palabra por palabra ---------- */
  function initStatement() {
    var p = document.getElementById("statement");
    if (!p) return;
    function wrap(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement("span"); s.className = "w"; s.textContent = part; frag.appendChild(s);
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === 1) { wrap(child); }
      });
    }
    wrap(p);
    gsap.to(p.querySelectorAll(".w"), {
      opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: p, start: "top 80%", end: "bottom 45%", scrub: true }
    });
  }

  /* ---------- 4. Características: entran desde los costados ---------- */
  function initFeatures() {
    gsap.utils.toArray(".feature").forEach(function (el) {
      var fromLeft = el.getAttribute("data-side") === "left";
      gsap.from(el, {
        x: fromLeft ? -120 : 120, opacity: 0, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });
    gsap.utils.toArray("[data-rise]").forEach(function (el) {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true }
      });
    });
  }

  /* ---------- 5. Sección fija: el producto gira mientras cambian los datos ---------- */
  function initSpin() {
    var n = document.querySelectorAll(".spin__item").length;
    gsap.fromTo("#spinImg",
      { rotate: -14, scale: 0.85, yPercent: 6 },
      { rotate: 12, scale: 1.08, yPercent: -6, ease: "none",
        scrollTrigger: {
          trigger: ".spin", start: "top top", end: "bottom bottom", scrub: 0.6,
          onUpdate: function (self) { setSpinIndex(Math.min(n - 1, Math.floor(self.progress * n))); }
        } });
    gsap.fromTo(".spin__glow", { scale: 0.8, opacity: 0.6 }, {
      scale: 1.2, opacity: 1, ease: "none",
      scrollTrigger: { trigger: ".spin", start: "top top", end: "bottom bottom", scrub: true }
    });
  }

  function init() {
    safe(initColors, "colors");
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    try { gsap.registerPlugin(ScrollTrigger); } catch (_) {}
    safe(initHero, "hero");
    safe(initParallax, "parallax");
    safe(initStatement, "statement");
    safe(initFeatures, "features");
    safe(initSpin, "spin");
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

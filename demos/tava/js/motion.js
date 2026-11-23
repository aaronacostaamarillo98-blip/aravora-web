/* Barbería Tava · versión estilo Apple. GSAP + ScrollTrigger + Lottie. El contenido se ve completo sin JS. */
(function () {
  "use strict";
  function safe(fn, name) { try { fn(); } catch (e) { if (window.console) console.warn("[tava] " + name, e); } }
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Tilde Lottie ---------- */
  function initLottie() {
    var box = document.querySelector(".lottie-ok");
    if (!box || !window.lottie) return;
    var anim = window.__okAnim = lottie.loadAnimation({ container: box, renderer: "svg", loop: false, autoplay: false, path: "anim/check.json" });
    if (reduce) { anim.addEventListener("DOMLoaded", function () { anim.goToAndStop(44, true); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { anim.goToAndPlay(0, true); io.disconnect(); } });
    }, { threshold: 0.05 });
    io.observe(box);
  }

  /* ---------- Turnos: día + hora arman el mensaje de WhatsApp ---------- */
  function initTurnos() {
    var card = document.querySelector(".turnos"); if (!card) return;
    var btn = document.getElementById("bookBtn");
    var days = card.querySelectorAll(".day"), slots = card.querySelectorAll(".slot:not(.off)");
    var nombres = { Lun: "lunes", Mar: "martes", "Mié": "miércoles", Jue: "jueves", Vie: "viernes", "Sáb": "sábado" };
    function update(play) {
      var d = card.querySelector(".day.on"), s = card.querySelector(".slot.pick");
      if (!d || !s) return;
      var corto = d.childNodes[0].textContent.trim();
      var dia = nombres[corto] || corto, hora = s.textContent.trim();
      btn.textContent = "Reservar " + dia + " " + hora;
      btn.href = "https://wa.me/595000000000?text=" + encodeURIComponent("Hola, quiero turno para el " + dia + " a las " + hora);
      if (play && window.__okAnim) window.__okAnim.goToAndPlay(0, true);
    }
    function pick(list, el, cls) {
      list.forEach(function (x) { x.classList.remove(cls); x.setAttribute("aria-pressed", "false"); });
      el.classList.add(cls); el.setAttribute("aria-pressed", "true"); update(true);
    }
    days.forEach(function (d) { d.addEventListener("click", function () { pick(days, d, "on"); }); });
    slots.forEach(function (s) { s.addEventListener("click", function () { pick(slots, s, "pick"); }); });
  }

  function setStep(i) {
    document.querySelectorAll(".spin__item").forEach(function (el, k) { el.classList.toggle("is-on", k === i); });
  }

  /* ---------- 1. Hero: el título aparece y sube ---------- */
  function initHero() {
    gsap.timeline({ defaults: { ease: "expo.out" } })
      .from(".hero__title [data-word]", { yPercent: 110, opacity: 0, duration: 1.3, stagger: 0.14 })
      .from("[data-hero]", { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, "-=0.9")
      .from("#product", { y: 90, rotate: 12, scale: 0.9, opacity: 0, duration: 1.8 }, 0.1)
      .from(".hero__glow", { opacity: 0, scale: 0.7, duration: 2 }, 0)
      .from(".nav", { y: -60, opacity: 0, duration: 1 }, 0.2);
  }

  /* ---------- 2. Parallax: navaja, brillo y texto a distinta velocidad ---------- */
  function initParallax() {
    var st = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
    gsap.to("#product", { yPercent: -22, rotate: -8, scale: 1.08, ease: "none", scrollTrigger: st });
    gsap.to(".hero__glow", { yPercent: 25, opacity: 0.35, ease: "none", scrollTrigger: st });
    gsap.to(".hero__copy", { yPercent: -35, opacity: 0, ease: "none", scrollTrigger: st });
  }

  /* ---------- 3. Frase que se ilumina palabra por palabra ---------- */
  function initStatement() {
    var p = document.getElementById("statement"); if (!p) return;
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

  /* ---------- 4. Cortes y bloques: entran desde los costados ---------- */
  function initSides() {
    gsap.utils.toArray("[data-side]").forEach(function (el) {
      gsap.from(el, { x: el.getAttribute("data-side") === "left" ? -120 : 120, opacity: 0, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });
    gsap.utils.toArray("[data-rise]").forEach(function (el) {
      gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });
  }

  /* ---------- 5. Sección fija: la navaja gira mientras cambian los pasos ---------- */
  function initSpin() {
    var n = document.querySelectorAll(".spin__item").length;
    gsap.fromTo("#spinImg", { rotate: -18, scale: 0.95, xPercent: -6 }, {
      rotate: 10, scale: 1.08, xPercent: -2, ease: "none",
      scrollTrigger: { trigger: ".spin", start: "top top", end: "bottom bottom", scrub: 0.6,
        onUpdate: function (self) { setStep(Math.min(n - 1, Math.floor(self.progress * n))); } }
    });
    gsap.fromTo(".spin__glow", { scale: 0.8, opacity: 0.5 }, { scale: 1.25, opacity: 1, ease: "none",
      scrollTrigger: { trigger: ".spin", start: "top top", end: "bottom bottom", scrub: true } });
  }

  function init() {
    safe(initLottie, "lottie");
    safe(initTurnos, "turnos");
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    try { gsap.registerPlugin(ScrollTrigger); } catch (_) {}
    safe(initHero, "hero");
    safe(initParallax, "parallax");
    safe(initStatement, "statement");
    safe(initSides, "sides");
    safe(initSpin, "spin");
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

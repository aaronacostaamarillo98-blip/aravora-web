/* aravora · rediseño 2026-10 · un solo JS para index.html y alvora.html.
   Cada bloque revisa si sus elementos existen, así el mismo archivo sirve en las dos páginas. */
(function () {
  /* ========= CAMBIA SOLO ESTA LÍNEA: tu número con 595, sin 0 ni espacios ========= */
  var WHATSAPP = "595992955763";

  function enlaceWA(texto) { return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto); }

  /* Pixel de Meta: cada clic en un botón de WhatsApp se registra como "Contact".
     En alvora (<body data-pixel="generico">) el evento va sin ningún dato: nada sobre salud. */
  var generico = document.body.dataset.pixel === "generico";
  function rastrear(enlace) {
    if (typeof window.fbq !== "function") return;
    if (generico) { window.fbq("track", "Contact"); return; }
    var datos = { content_name: enlace.dataset.producto || enlace.dataset.wa };
    if (enlace.dataset.valor) { datos.value = Number(enlace.dataset.valor); datos.currency = "PYG"; }
    window.fbq("track", "Contact", datos);
  }
  document.querySelectorAll("[data-wa]").forEach(function (enlace) {
    enlace.href = enlaceWA(enlace.dataset.wa);
    enlace.addEventListener("click", function () { rastrear(enlace); });
  });

  /* ========= Menú del celular ========= */
  (function () {
    var boton = document.querySelector(".abrir-menu"), menu = document.getElementById("menu");
    if (!boton || !menu) return;
    function poner(abierto) {
      menu.classList.toggle("abierto", abierto);
      boton.setAttribute("aria-expanded", abierto ? "true" : "false");
      boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    }
    boton.addEventListener("click", function () { poner(!menu.classList.contains("abierto")); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) poner(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("abierto")) { poner(false); boton.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (menu.classList.contains("abierto") && !e.target.closest(".cabecera")) poner(false);
    });
  })();

  /* ========= Galería «Ver por dentro» de cada kit ========= */
  (function () {
    var vista = document.getElementById("vista");
    if (!vista) return;
    var MUESTRAS = {
      "001": { titulo: "Kit #001 · ¿Por qué estoy tan cansado, si dormí?", paginas: ["img/kit001-portada", "kit001-pagina1", "kit001-pagina2"] },
      "002": { titulo: "Kit #002 · ¿Por qué siento ansiedad, si no pasa nada?", paginas: ["img/kit002-portada", "kit002-pagina1", "kit002-pagina2"] },
      "003": { titulo: "Kit #003 · ¿Por qué me acuesto tan tarde, si mañana madrugo?", paginas: ["img/kit003-portada", "kit003-pagina1", "kit003-pagina2"] }
    };
    var paginas = document.getElementById("vista-paginas");
    var comprar = document.getElementById("vista-comprar");
    document.querySelectorAll("[data-vista]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var num = boton.dataset.vista, m = MUESTRAS[num];
        if (!m) return;
        document.getElementById("vista-titulo").textContent = m.titulo;
        paginas.innerHTML = m.paginas.map(function (p, i) {
          return '<img src="' + p + '.webp" alt="Página de muestra ' + (i + 1) + ' del Kit #' + num + '" width="900" height="1273">';
        }).join("");
        var compra = document.querySelector('[data-kit="' + num + '"] [data-wa]');
        comprar.href = compra.href;
        comprar.onclick = function () { rastrear(compra); };
        if (typeof vista.showModal === "function") { vista.showModal(); } else { window.open(m.paginas[1] + ".webp"); }
        paginas.scrollLeft = 0;
      });
    });
    document.getElementById("vista-cerrar").addEventListener("click", function () { vista.close(); });
    vista.addEventListener("click", function (e) { if (e.target === vista) vista.close(); });
  })();

  /* ========= Aparición suave de los bloques del final al llegar con el scroll =========
     Sin JS o con «reducir movimiento», los bloques se ven normales desde el principio. */
  (function () {
    var bloques = document.querySelectorAll("[data-aparece]");
    if (!bloques.length || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("animar");
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("aparecido"); obs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    bloques.forEach(function (b) { obs.observe(b); });
  })();

  /* ========= Pausa de un minuto: 6 ciclos de 4 s inhalando y 6 s exhalando ========= */
  (function () {
    var aro = document.getElementById("aro"), fase = document.getElementById("fase");
    var ciclo = document.getElementById("ciclo"), boton = document.getElementById("boton-pausa");
    var avance = document.getElementById("avance");   // anillo que se completa en el minuto
    if (!aro || !fase || !ciclo || !boton) return;
    var TOTAL_CICLOS = 6;
    var FASES = [
      { texto: "Inhala", ms: 4000, escala: 1.6 },
      { texto: "Exhala", ms: 6000, escala: 1 }
    ];
    var activa = false, temporizador = null, ciclosHechos = 0;
    var TOTAL_MS = TOTAL_CICLOS * (FASES[0].ms + FASES[1].ms);

    function progreso(lleno, ms) {
      if (!avance) return;
      avance.style.transition = ms ? "stroke-dashoffset " + ms + "ms linear" : "none";
      avance.style.strokeDashoffset = lleno ? "0" : "";
    }

    function paso(i) {
      if (!activa) return;
      var f = FASES[i];
      aro.style.transitionDuration = f.ms + "ms";
      aro.style.transform = "scale(" + f.escala + ")";
      fase.textContent = f.texto;
      ciclo.textContent = "Ciclo " + (ciclosHechos + 1) + " de " + TOTAL_CICLOS;
      temporizador = setTimeout(function () {
        if (i === 1) {
          ciclosHechos++;
          if (ciclosHechos >= TOTAL_CICLOS) { terminar(true); return; }
        }
        paso(1 - i);
      }, f.ms);
    }

    function terminar(completa) {
      activa = false;
      clearTimeout(temporizador);
      aro.style.transitionDuration = "800ms";
      aro.style.transform = "scale(1)";
      if (!completa) progreso(false, 0);
      fase.textContent = completa ? "Listo" : "Inhala";
      ciclo.textContent = completa ? "¿Cómo te sientes ahora?" : "";
      boton.textContent = completa ? "Repetir pausa" : "Empezar pausa";
    }

    boton.addEventListener("click", function () {
      if (activa) { terminar(false); return; }
      activa = true;
      ciclosHechos = 0;
      boton.textContent = "Detener";
      progreso(false, 0);
      void aro.offsetWidth;   // fuerza un repintado para que el anillo arranque de cero
      progreso(true, TOTAL_MS);
      paso(0);
    });
  })();
})();

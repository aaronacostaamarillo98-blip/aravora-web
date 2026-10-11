/* ========= Cielo de la página: de la noche al amanecer =========
   Canvas fijo detrás de todo. El color sigue el scroll: Crepúsculo → Hora azul → Amanecer,
   con un resplandor Aurora + Menta que crece hacia abajo. Estrellas Menta y Alba que titilan,
   parallax leve con el cursor y el scroll. Menos estrellas en celular, estático con movimiento
   reducido y en pausa cuando la pestaña no se ve. */
(function () {
  var canvas = document.getElementById("cielo");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
  var TONOS = [[31, 53, 64], [43, 75, 83], [61, 101, 99]];   // Crepúsculo, Hora azul, Amanecer
  var COLORES = ["159,212,198", "207,227,220"];                // Menta y Alba
  var W = 0, H = 0, dpr = 1, celular = null, estrellas = [];
  var mouseX = 0, mouseY = 0, suaveX = 0, suaveY = 0;
  var corriendo = false, raf = 0, ultimo = 0, pendiente = false;

  var semilla = 11;   // azar con semilla: el cielo es siempre el mismo
  function azar() { semilla = (semilla * 16807) % 2147483647; return (semilla - 1) / 2147483646; }

  function sembrar() {
    semilla = 11; estrellas = [];
    var cantidad = celular ? 60 : 160;
    for (var i = 0; i < cantidad; i++) {
      estrellas.push({
        x: azar(), y: azar(),                 // posición relativa a la pantalla (0 a 1)
        r: .5 + azar() * 1.25,
        prof: .2 + azar() * .8,               // las más "cercanas" se mueven más
        fase: azar() * 6.283, vel: .5 + azar() * 1.5,
        color: COLORES[azar() < .62 ? 0 : 1], base: .35 + azar() * .5
      });
    }
  }

  function medir() {
    var esCelular = window.innerWidth < 760;
    dpr = Math.min(window.devicePixelRatio || 1, esCelular ? 1.5 : 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (esCelular !== celular) { celular = esCelular; sembrar(); }
  }

  function progreso() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }
  function tono(p) {
    var a = p < .5 ? TONOS[0] : TONOS[1], b = p < .5 ? TONOS[1] : TONOS[2], k = p < .5 ? p / .5 : (p - .5) / .5;
    return a.map(function (c, i) { return Math.round(c + (b[i] - c) * k); });
  }

  function dibujar(t) {
    var p = progreso(), mov = !quieto.matches;
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgb(" + tono(p).join(",") + ")";
    ctx.fillRect(0, 0, W, H);

    // Resplandor Aurora + Menta desde abajo: crece al bajar (el amanecer)
    var a = .06 + .16 * p, R = Math.max(W, H) * (.7 + .3 * p);   // suave: el texto del tramo final tiene que seguir leyéndose
    var g = ctx.createRadialGradient(W * .5, H * 1.12, 0, W * .5, H * 1.12, R);
    g.addColorStop(0, "rgba(159,212,198," + (a * .9).toFixed(3) + ")");
    g.addColorStop(.45, "rgba(47,111,101," + (a * .7).toFixed(3) + ")");
    g.addColorStop(1, "rgba(47,111,101,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // Una nebulosa Aurora muy suave arriba a la derecha (profundidad)
    var n = ctx.createRadialGradient(W * .82, H * .12, 0, W * .82, H * .12, Math.max(W, H) * .45);
    n.addColorStop(0, "rgba(47,111,101," + (.22 * (1 - p * .6)).toFixed(3) + ")");
    n.addColorStop(1, "rgba(47,111,101,0)");
    ctx.fillStyle = n; ctx.fillRect(0, 0, W, H);

    // Estrellas: titilan y se mueven apenas con el cursor y el scroll; se apagan un poco al amanecer
    suaveX += (mouseX - suaveX) * .08; suaveY += (mouseY - suaveY) * .08;
    var sc = window.scrollY;
    for (var i = 0; i < estrellas.length; i++) {
      var e = estrellas[i];
      var brillo = mov ? e.base + Math.sin(t / 1000 * e.vel + e.fase) * .25 : e.base;
      var x = e.x * W + (mov ? suaveX * 12 * e.prof : 0);
      var y = e.y * H - (mov ? sc * .06 * e.prof : 0) + (mov ? suaveY * 8 * e.prof : 0);
      y = ((y % H) + H) % H;
      ctx.globalAlpha = Math.max(0, Math.min(1, brillo)) * (1 - p * .55);
      ctx.fillStyle = "rgb(" + e.color + ")";
      ctx.beginPath(); ctx.arc(x, y, e.r, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function cuadro(t) {
    if (!corriendo) return;
    if (t - ultimo > 33) { dibujar(t); ultimo = t; }   // ~30 cuadros por segundo alcanzan
    raf = requestAnimationFrame(cuadro);
  }
  function actualizar() {
    var debe = !document.hidden && !quieto.matches;
    if (debe && !corriendo) { corriendo = true; raf = requestAnimationFrame(cuadro); }
    if (!debe && corriendo) { corriendo = false; cancelAnimationFrame(raf); }
    if (!corriendo) dibujar(0);   // versión estática
  }

  medir(); actualizar();
  document.documentElement.classList.add("cielo-activo");
  document.addEventListener("visibilitychange", actualizar);
  window.addEventListener("scroll", function () {
    if (corriendo || pendiente) return;   // en modo estático, solo redibuja el color al bajar
    pendiente = true;
    requestAnimationFrame(function () { pendiente = false; dibujar(0); });
  }, { passive: true });
  window.addEventListener("pointermove", function (ev) {
    mouseX = ev.clientX / W * 2 - 1; mouseY = ev.clientY / H * 2 - 1;
  }, { passive: true });
  var espera;
  window.addEventListener("resize", function () { clearTimeout(espera); espera = setTimeout(function () { medir(); actualizar(); }, 120); });
  if (quieto.addEventListener) quieto.addEventListener("change", actualizar); else quieto.addListener(actualizar);
})();

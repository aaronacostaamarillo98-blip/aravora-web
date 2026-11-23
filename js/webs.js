/* aravora · portada de webs: interruptor de pago y cuestionario. Va después de sitio.js. */
(function () {
  var WHATSAPP = "595992955763";
  function enlaceWA(texto) { return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto); }
  function poner(boton, texto, valor) {
    boton.dataset.wa = texto;
    boton.href = enlaceWA(texto);
    if (valor) { boton.dataset.valor = valor; } else { delete boton.dataset.valor; }
  }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  var PRECIOS = { Landing: [750000, 149000], Profesional: [1000000, 199000], Tienda: [1800000, 299000] };

  /* Pago único / mensual */
  var planes = document.getElementById("planes");
  var modo = "mensual";
  if (planes) {
    var botones = planes.querySelectorAll(".interruptor button");
    botones.forEach(function (b) {
      b.addEventListener("click", function () {
        modo = b.dataset.modo;
        botones.forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
        planes.classList.toggle("modo-mensual", modo === "mensual");
        planes.querySelectorAll(".plan").forEach(function (plan) {
          var nombre = plan.dataset.plan, mensual = modo === "mensual";
          poner(plan.querySelector(".plan-boton"),
            "Hola, quiero el plan " + nombre + (mensual ? " en pago mensual" : " en pago único"),
            mensual ? plan.dataset.mensual : plan.dataset.unico);
        });
      });
    });
  }

  /* Cuestionario: 3 preguntas, recomienda un plan */
  var form = document.getElementById("elegir-form");
  if (!form) return;
  var texto = document.getElementById("elegir-texto"), boton = document.getElementById("elegir-boton");
  form.addEventListener("change", function () {
    var o = form.objetivo.value, m = form.material.value, p = form.pago.value;
    if (!o || !m || !p) return;
    var mensual = p === "mensual";
    var precio = mensual
      ? fmt(PRECIOS[o][1]) + " Gs. por mes"
      : fmt(PRECIOS[o][0]) + " Gs., pago único";
    texto.innerHTML = "Te conviene el plan <strong>" + o + "</strong>, en " + (mensual ? "pago mensual" : "pago único") + " (" + precio + ").";
    poner(boton,
      "Hola, hice el cuestionario y me recomendó el plan " + o + (mensual ? " en pago mensual" : " en pago único") + ". Logo y fotos: " + m + ".",
      mensual ? PRECIOS[o][1] : PRECIOS[o][0]);
    boton.dataset.producto = "Plan " + o;
    boton.hidden = false;
  });
})();

/* aravora · pedido: se agregan productos y se manda la lista por WhatsApp. No cobra nada en la web. */
(function () {
  "use strict";
  var WHATSAPP = "595992955763";
  var items = [];
  var lista = document.getElementById("pedidoLista"), vacio = document.getElementById("pedidoVacio");
  var enviar = document.getElementById("pedidoEnviar"), caja = document.getElementById("pedido");
  var flot = document.querySelector(".pedido-flot"), planes = document.getElementById("planes");
  if (!lista || !caja) return;
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

  function precio(btn) {
    if (btn.dataset.precioFijo) return btn.dataset.precioFijo;
    var plan = btn.closest(".plan"); if (!plan) return "";
    var mensual = planes && planes.classList.contains("modo-mensual");
    return mensual ? fmt(plan.dataset.mensual) + " Gs./mes" : fmt(plan.dataset.unico) + " Gs. al contado";
  }
  function pintar() {
    lista.innerHTML = "";
    items.forEach(function (it, i) {
      var li = document.createElement("li");
      li.innerHTML = "<div><b></b><small></small></div><button type='button'>Quitar</button>";
      li.querySelector("b").textContent = it.nombre; li.querySelector("small").textContent = it.precio;
      li.querySelector("button").addEventListener("click", function () { items.splice(i, 1); pintar(); });
      lista.appendChild(li);
    });
    vacio.hidden = items.length > 0; enviar.hidden = items.length === 0;
    document.querySelectorAll("[data-pedido-n]").forEach(function (n) { n.textContent = items.length; });
    if (flot) flot.hidden = items.length === 0;
    var texto = "Hola, quiero hacer este pedido en aravora:\n" + items.map(function (it) { return "• " + it.nombre + " (" + it.precio + ")"; }).join("\n");
    enviar.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto);
  }
  function abrir() { caja.hidden = false; var b = caja.querySelector("[data-cerrar-pedido]:not(.pedido-fondo)"); if (b) b.focus(); }
  function cerrar() { caja.hidden = true; }

  document.querySelectorAll("[data-agregar]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var nombre = btn.dataset.agregar;
      if (!items.some(function (it) { return it.nombre === nombre; })) items.push({ nombre: nombre, precio: precio(btn) });
      pintar();
      var orig = btn.textContent; btn.textContent = "✓ Agregado"; setTimeout(function () { btn.textContent = orig; }, 1400);
    });
  });
  document.querySelectorAll("[data-abrir-pedido]").forEach(function (b) { b.addEventListener("click", abrir); });
  document.querySelectorAll("[data-cerrar-pedido]").forEach(function (b) { b.addEventListener("click", cerrar); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !caja.hidden) cerrar(); });
  enviar.addEventListener("click", function () {
    if (typeof window.fbq === "function") window.fbq("track", "Contact", { content_name: "Pedido web" });
  });
  pintar();
})();

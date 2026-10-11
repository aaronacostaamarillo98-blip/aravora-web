/* ========= Navegación flotante: hoja de menú en celular ========= */
(function () {
  var boton = document.querySelector(".abrir-menu"), hoja = document.getElementById("hoja-menu");
  if (!boton || !hoja) return;
  function poner(abierta) { boton.setAttribute("aria-expanded", abierta ? "true" : "false"); hoja.hidden = !abierta; }
  boton.addEventListener("click", function () { poner(hoja.hidden); });
  hoja.addEventListener("click", function (e) { if (e.target.closest("a")) poner(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !hoja.hidden) { poner(false); boton.focus(); } });
  document.addEventListener("click", function (e) { if (!hoja.hidden && !e.target.closest(".cabecera")) poner(false); });
})();

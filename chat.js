(function(){
 var C={
  psico:{n:"Consultorio Psicología",i:"CP",m:[["c","Hola, quería un turno con la psicóloga. ¿Atienden online?","19:42"],["a","¡Hola! Sí, atendemos presencial y online. Esta semana hay lugar el jueves a las 18:00 o el viernes a las 10:00. ¿Cuál te queda mejor?","19:42"],["c","El jueves a las 18","19:43"],["a","Listo, te reservé el jueves a las 18:00, online. Un rato antes te mando el enlace de la sesión.","19:43"]]},
  barber:{n:"Barbería Tava",i:"BT",m:[["c","Buenas, ¿tienen lugar mañana para corte y barba?","21:15"],["a","¡Buenas! Sí, mañana hay lugar a las 16:30 o a las 19:00. Corte y barba sale 70.000 Gs.","21:15"],["c","A las 19","21:16"],["a","Agendado: mañana a las 19:00, corte y barba. Te esperamos en Luque, a dos cuadras de la plaza.","21:16"]]},
  ferre:{n:"Repuestos y Lubricantes",i:"RL",m:[["c","Hola, ¿tienen el filtro de aceite para una Hilux 2018? ¿Cuánto sale?","07:58"],["a","¡Hola! Sí, tenemos el filtro original en stock. Te paso el precio y la ficha técnica. ¿Lo retirás o te lo enviamos?","07:58"],["c","Lo retiro mañana","07:59"],["a","Perfecto, te lo dejo separado a tu nombre. Abrimos a las 7:30.","07:59"]]},
  tienda:{n:"Tienda online",i:"TO",m:[["c","Hola, ¿tienen la remera negra en talle M?","23:10"],["a","¡Hola! Sí, quedan 3 en talle M. Sale 89.000 Gs. ¿Te la enviamos o la retirás?","23:10"],["c","Envío a Luque","23:11"],["a","El envío a Luque sale 20.000 Gs. Te paso el resumen del pedido para que lo confirmes.","23:11"]]}
 };
 var caja=document.getElementById("chatx");if(!caja)return;
 var cuerpo=caja.querySelector(".chatx-cuerpo"),nom=caja.querySelector(".chatx-nom"),av=caja.querySelector(".chatx-av"),tabs=caja.querySelectorAll(".chatx-tabs button");
 var orden=["psico","barber","ferre","tienda"],actual=0,timers=[],auto=true;
 var quieto=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 function limpiar(){timers.forEach(clearTimeout);timers=[];}
 function burbuja(m){var d=document.createElement("p");d.className="msg msg--"+(m[0]=="c"?"cli":"asi");d.textContent=m[1];var s=document.createElement("small");s.textContent=m[2];d.appendChild(s);cuerpo.appendChild(d);}
 function mostrar(k,animar){
  limpiar();var c=C[k];nom.textContent=c.n;av.textContent=c.i;
  tabs.forEach(function(t){t.setAttribute("aria-selected",t.dataset.k==k?"true":"false")});
  cuerpo.innerHTML='<span class="chatx-dia">Hoy</span>';
  if(!animar||quieto){c.m.forEach(burbuja);return;}
  var t=300;c.m.forEach(function(m){
   if(m[0]=="a"){timers.push(setTimeout(function(){var e=document.createElement("div");e.className="escribe";e.innerHTML="<i></i><i></i><i></i>";cuerpo.appendChild(e)},t));t+=1400;timers.push(setTimeout(function(){var e=cuerpo.querySelector(".escribe");if(e)e.remove();burbuja(m)},t));}
   else{timers.push(setTimeout(function(){burbuja(m)},t));}
   t+=1100;});
  if(auto)timers.push(setTimeout(function(){actual=(actual+1)%orden.length;mostrar(orden[actual],true)},t+3500));
 }
 tabs.forEach(function(b){b.addEventListener("click",function(){auto=false;actual=orden.indexOf(b.dataset.k);mostrar(b.dataset.k,true)})});
 var obs="IntersectionObserver" in window?new IntersectionObserver(function(e){if(e[0].isIntersecting){mostrar(orden[actual],true);obs.disconnect()}}):null;
 mostrar("psico",false); if(obs)obs.observe(caja);
})();

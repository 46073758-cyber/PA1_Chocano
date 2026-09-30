/* CompuRepraint - JavaScript académico: Consolidado 2 */
"use strict";

// 1. Valores, tipos y operadores
const IGV=0.18, tarifaBase=50, proyectoActivo=true, nombreSitio="CompuRepraint";
const tarifaFinal=tarifaBase*(1+IGV);

// 2. Objeto + encapsulamiento: items permanece privado
function crearCarrito(){let items=[];return{agregar(item){items.push({...item});},vaciar(){items=[];},obtener(){return [...items];},total(){return items.reduce((s,i)=>s+i.precio,0);},cantidad(){return items.length;}};}
const carrito=crearCarrito();

// 3. Clase y métodos
class Servicio{constructor(nombre,precio,categoria){this.nombre=nombre;this.precio=Number(precio);this.categoria=categoria;}resumen(){return `${this.nombre} — S/ ${this.precio.toFixed(2)}`;}}
// 4. Prototipo
function Tecnico(nombre,especialidad){this.nombre=nombre;this.especialidad=especialidad;}
Tecnico.prototype.presentarse=function(){return `${this.nombre}: especialista en ${this.especialidad}`;};
// 5. Polimorfismo
class Presencial extends Servicio{resumen(){return `Presencial: ${super.resumen()}`;}}
class Remoto extends Servicio{resumen(){return `Remoto: ${super.resumen()}`;}}
// 6. Map
const catalogo=new Map([["pc",new Presencial("Mantenimiento PC/Laptop",50,"hardware")],["imp",new Presencial("Mantenimiento de impresora",60,"impresión")],["red",new Presencial("Red LAN",60,"redes")],["rem",new Remoto("Soporte remoto",30,"soporte")],["web",new Remoto("Diseño web",250,"desarrollo")]]);

// 7. Función con argumentos
function calcularTarifa(base,horas=1,recargo=0){return Number(base)*Number(horas)+Number(recargo);}
// 8. Función de flecha
const soles=valor=>`S/ ${Number(valor).toFixed(2)}`;
// 9. Función recursiva
function sumarRecursivo(n){return n<=0?0:n+sumarRecursivo(n-1);}
// 10. Función creciente
function funcionCreciente(inicial,pasos){let r=inicial;for(let i=0;i<pasos;i++)r+=10;return r;}

function toast(msg){let t=document.getElementById("jsToast");if(!t){t=document.createElement("div");t.id="jsToast";t.className="js-toast";document.body.appendChild(t);}t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2600);}
function renderCarrito(){let panel=document.getElementById("jsCart");if(!panel)return;let items=carrito.obtener();panel.innerHTML=`<b>🛒 Carrito (${items.length})</b><div>${items.length?items.map(i=>`<div class="js-cart-item"><span>${i.nombre}</span><strong>${soles(i.precio)}</strong></div>`).join(""):"<small>Sin servicios agregados.</small>"}</div><hr><strong>Total: ${soles(carrito.total())}</strong><button id="vaciarCarrito" class="js-cart-clear">Vaciar</button>`;panel.querySelector("#vaciarCarrito")?.addEventListener("click",()=>{carrito.vaciar();renderCarrito();toast("Carrito vaciado");});}
function agregar(nombre,precio){carrito.agregar({nombre,precio:Number(precio)});renderCarrito();toast(`${nombre} agregado al carrito`);}

// DOM + eventos: carga, click, teclado, foco, scroll y temporizador
window.addEventListener("load",()=>{
  const tecnico=new Tecnico("Alex","redes");console.info(nombreSitio,proyectoActivo,tarifaFinal,tecnico.presentarse(),catalogo.get("web").resumen());
  // Crear panel de carrito en páginas del catálogo/inicio
  if(document.querySelector(".service-card,.detail-card")){let p=document.createElement("aside");p.id="jsCart";p.className="js-cart";p.setAttribute("aria-live","polite");document.body.appendChild(p);renderCarrito();}
  // Botones para tarjetas de servicios
  document.querySelectorAll(".detail-card").forEach(card=>{let title=card.querySelector("h2")?.textContent||"Servicio";let price=Number((title.includes("web")?250:title.includes("impresora")?60:title.includes("red")?60:title.includes("soporte")?30:50));let b=document.createElement("button");b.type="button";b.className="btn btn-primary js-add";b.textContent=`Agregar al carrito · ${soles(price)}`;b.dataset.name=title;b.dataset.price=price;card.querySelector("div:last-child")?.appendChild(b);});
  document.querySelectorAll(".js-add").forEach(b=>b.addEventListener("click",()=>agregar(b.dataset.name,b.dataset.price)));
  // Evento de foco
  document.querySelectorAll("input,select,textarea").forEach(el=>{el.addEventListener("focus",()=>el.classList.add("js-focus"));el.addEventListener("blur",()=>el.classList.remove("js-focus"));});
  // Scroll
  window.addEventListener("scroll",()=>document.body.classList.toggle("js-scrolled",scrollY>30),{passive:true});
  // Temporizador
  let segundos=0;window.__timer=setInterval(()=>{segundos++;if(segundos===3){toast("JavaScript activo: temporizador ejecutado");clearInterval(window.__timer);}},1000);
  // Animación al aparecer
  const obs=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("js-visible")),{threshold:.15});document.querySelectorAll(".service-card,.feature-list>div,.detail-card").forEach(e=>{e.classList.add("js-reveal");obs.observe(e);});
  // Menú responsive
  const toggle=document.querySelector(".menu-toggle"),menu=document.querySelector("#main-menu");if(toggle&&menu)toggle.addEventListener("click",()=>{let open=menu.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
  // Demo de cálculo si existe
  const hero=document.querySelector(".hero-copy");if(hero&&!document.getElementById("jsDemo")){let b=document.createElement("button");b.id="jsDemo";b.className="btn btn-secondary";b.textContent="Probar funciones JavaScript";hero.appendChild(b);b.addEventListener("click",()=>toast(`${soles(funcionCreciente(calcularTarifa(50,2,15),3))} · recursiva: ${sumarRecursivo(5)}`));}
  configurarFormulario();
});

// Propagación: captura en document y burbujeo en contenedor
document.addEventListener("click",e=>{if(e.target.closest(".service-card,.detail-card"))console.debug("CAPTURA: document recibió el click");},true);
document.addEventListener("click",e=>{if(e.target.closest(".service-card,.detail-card"))console.debug("BURBUJEO: evento propagado al documento");});

// Evento de teclado
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelector("#main-menu")?.classList.remove("open");if(e.key==="/"&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();document.querySelector("#nombre")?.focus();toast("Atajo /: enfoque en el formulario");}});

function configurarFormulario(){const form=document.getElementById("serviceForm");if(!form)return;form.addEventListener("submit",e=>{e.preventDefault();if(!form.checkValidity()){form.reportValidity();toast("Completa los campos obligatorios");return;}const d=new FormData(form);const msg=`Hola, soy ${d.get("nombre")}. Solicito ${d.get("servicio")}. Tel: ${d.get("telefono")}. Correo: ${d.get("email")}. Presupuesto: S/ ${d.get("presupuesto")||"No indicado"}. Detalle: ${d.get("mensaje")}`;const status=document.getElementById("formStatus");if(status)status.textContent="Solicitud validada. Abriendo WhatsApp…";window.open(`https://wa.me/51999101577?text=${encodeURIComponent(msg)}`,"_blank","noopener,noreferrer");toast("Formulario procesado correctamente");});}

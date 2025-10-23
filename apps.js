// ======================= app.js (Código Combinado) =======================

/** Utilidad: formatea a moneda MXN */
function toMXN(num) {
  return Number(num || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

/** Utilidad: toma precio desde data-precio (en selects/checks) */
function getPrecioFromDataset(el) {
  const raw = el?.dataset?.precio;
  return raw ? Number(raw) : 0;
}

document.addEventListener('DOMContentLoaded', () => {
    // ======================================
    // 1. LÓGICA DE PEDIDO (Formulario)
    // ======================================
    const form = document.getElementById('formPedido');
    const outNombre = document.getElementById('outNombre');
    const outLista  = document.getElementById('outLista');
    const outTotal  = document.getElementById('outTotal');
    const btnConfirmar = document.getElementById('btnConfirmar');
    const confirmNombre = document.getElementById('confirmNombre');

    // Toast UX (aviso corto) - No se usan en el HTML actual, pero se mantienen por si acaso.
    // const toastBtn = document.getElementById('btnToast');
    // const toastEl  = document.getElementById('toastAviso');
    // const toast    = bootstrap.Toast.getOrCreateInstance(toastEl);
    // toastBtn?.addEventListener('click', () => toast.show());


    form?.addEventListener('submit', (e) => {
      e.preventDefault(); // Evita recargar la página

      // 1) Leemos campos base
      const nombre = document.getElementById('nombreCliente').value.trim();
      const selModelo = document.getElementById('selModelo');
      const selTalla  = document.getElementById('selTalla');
      const selColor  = document.getElementById('selColor');
      const cantidad  = Number(document.getElementById('inpCantidad').value || 0);

      // Validación mínima:
      if (!nombre || !selModelo.value || !selTalla.value || !selColor.value || cantidad < 1) {
        alert('Completa nombre, modelo, talla, color y cantidad (mínimo 1).');
        return;
      }

      // 2) Precios base
      const optModelo = selModelo.options[selModelo.selectedIndex];
      const precioModelo = getPrecioFromDataset(optModelo); 
      let total = precioModelo * cantidad;

      // 3) Extras / personalización
      const chkNombreNumero = document.getElementById('chkNombreNumero');
      const chkParcheLiga   = document.getElementById('chkParcheLiga');

      const extrasSeleccionados = [];
      if (chkNombreNumero.checked) {
        total += getPrecioFromDataset(chkNombreNumero) * cantidad; 
        extrasSeleccionados.push('Nombre y número');
      }
      if (chkParcheLiga.checked) {
        total += getPrecioFromDataset(chkParcheLiga) * cantidad; 
        extrasSeleccionados.push('agujetas con pin metalico');
      }

      // Campos condicionales 
      const inpNombre = document.getElementById('inpNombre').value.trim();
      const inpNumero = document.getElementById('inpNumero').value.trim();

      // 4) Envío e instrucciones
      const selEnvio = document.getElementById('selEnvio');
      const optEnvio = selEnvio.options[selEnvio.selectedIndex];
      const costoEnvio = getPrecioFromDataset(optEnvio); // 0 si no hay data-precio
      total += costoEnvio;

      const txtInstr = document.getElementById('txtInstrucciones').value.trim();

      // 5) Pintamos resumen (solo maqueta, ya que no tienes HTML para el resumen)
      // Se mantiene la lógica por si agregas el modal/resumen de pedido.
      // outNombre.textContent = nombre; 
      // outTotal.textContent = toMXN(total); 

      // Habilitamos confirmar y pasamos nombre al modal
      // btnConfirmar.disabled = false;
      // confirmNombre.textContent = nombre;
    });

    form?.addEventListener('reset', () => {
      setTimeout(() => {
        // outNombre.textContent = '—';
        // outLista.innerHTML = '<li class="text-muted">Aún no has generado tu pedido.</li>';
        // outTotal.textContent = '$0';
        // btnConfirmar.disabled = true;
      }, 0);
    });

    // ======================================
    // 2. ACTIVIDADES DOM (Banner, Testimonios, Contacto)
    // ======================================
    
    // -------- Actividad 1: Banner --------
    const banner = document.getElementById('banner');
    const btnPromo = document.getElementById('btnPromo');

    btnPromo?.addEventListener('click', () => {
        banner.classList.remove('bg-dark', 'bg-primary', 'bg-success', 'bg-info', 'bg-danger', 'bg-warning');
        banner.classList.add('bg-warning');
        banner.classList.remove('text-white');
        banner.classList.add('text-dark');
    });

    // -------- Actividad 2: Testimonios --------
    // 2.1 VIP en azul (text-primary)
    const vipItems = document.getElementsByClassName('testimonio-vip');
    for (const item of vipItems) {
      item.classList.add('text-primary'); 
    }

    // 2.2 TODOS los párrafos en rojo (text-danger)
    const allParagraphs = document.getElementsByTagName('p');
    for (const p of allParagraphs) {
      p.classList.add('text-danger');
    }

    // -------- Actividad 3: Formulario de contacto --------
    // 3.1 Primer input de texto (fondo verdoso suave)
    const firstTextInput = document.querySelector('#formContacto input[type="text"]');
    firstTextInput?.classList.add('bg-success', 'bg-opacity-10'); 

    // 3.2 Todos los botones del formulario a btn-danger
    const contactoButtons = document.querySelectorAll('#formContacto button');
    contactoButtons.forEach(btn => {
      btn.classList.remove('btn-primary', 'btn-outline-secondary');
      btn.classList.add('btn-danger');
    });

    // 3.3 Campo "nombre" (texto en amarillo)
    const nombreInputs = document.getElementsByName('nombre');
    if (nombreInputs.length > 0) {
      const nombreInput = nombreInputs[0];
      nombreInput.classList.add('text-warning'); 
      const label = document.querySelector('label[for="cNombre"]');
      label?.classList.add('text-warning');
    }

    // ======================================
    // 3. WHATSAPP FLOTANTE (Ahora es solo lógica de mensaje)
    // ======================================
    const waBtn = document.querySelector('.whatsapp-float');
    if (!waBtn) return; 

    // Mensaje dinámico según hora local (9 a 18 h "en línea")
    const h = new Date().getHours();
    const enHorario = h >= 9 && h < 18;
    const msg = enHorario ? '¡Respondo ahora!' : 'Fuera de horario, te contesto pronto';
    waBtn.title = `WhatsApp — ${msg}`;
    waBtn.setAttribute('aria-label', `Chatea por WhatsApp — ${msg}`);

    // Prefill del texto en el chat
    const telefono = '527221234567'; 
    const texto = encodeURIComponent('Hola, vengo del sitio de Diego Sneakers. Me interesa un par de tenis.');
    waBtn.href = `https://wa.me/${telefono}?text=${texto}`;

    // La lógica de SCROLL se mantiene por si decides reactivarla en CSS:
    const UMBRAL = 300;
    const toggleWA = () => {
      if (window.scrollY > UMBRAL) {
        waBtn.classList.add('show');
      } else {
        waBtn.classList.remove('show');
      }
    };
    // toggleWA(); // No la llamamos al inicio, ya que el CSS lo hace visible.
    // window.addEventListener('scroll', toggleWA, { passive: true });
});
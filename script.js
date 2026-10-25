
"use strict";

// =====================================================
// CONFIGURACIÓN GENERAL
// =====================================================

const NUMERO_WHATSAPP = "56997511281";
const INTERVALO_HERO = 5000;
const VELOCIDAD_GALERIA = 27;
const ESPERA_GALERIA = 2500;

const fondosHero = [
    "imagen/fotofondo1.webp",
    "imagen/fotofondo2.webp"
];

const productos = [
    {
        id: 1,
        nombre: "Caja Frutillas Grandes",
        descripcion: "Ideales para bañar en chocolate y preparación.",
        precio: 10000,
        stock: 12,
        imagen: "imagen/FrutillaGrande.webp",
        estado: "Disponible"
    },
    {
        id: 2,
        nombre: "Caja Frutillas Chicas",
        descripcion: "Sabor intenso y auténtico, ideales para preparar exquisitas mermeladas, jugos naturales y deliciosos postres",
        precio: 6000,
        stock: 20,
        imagen: "imagen/FrutillaChica.webp",
        estado: "Disponible"
    },
    {
        id: 3,
        nombre: "Bandeja 1 Kilo",
        descripcion: "Selección de frutillas grandes y medianas, frescas y llenas de sabor",
        precio: 3000,
        stock: 5,
        imagen: "imagen/frutillaKilo.webp",
        estado: "Disponible"
    }
];

const galleryImages = [
    "imagen/galeria1.webp",
    "imagen/galeria2.webp",
    "imagen/galeria3.webp",
    "imagen/galeria4.webp",
    "imagen/galeria5.webp",
    "imagen/galeria6.webp",
    "imagen/galeria7.webp",
    "imagen/galeria8.webp"
];

const reducirMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

// =====================================================
// ELEMENTOS DEL DOM
// =====================================================

const elemento = (selector) => document.querySelector(selector);
const elementoId = (id) => document.getElementById(id);

const modal = elementoId("modal-checkout");
const closeModal = elemento(".close-modal");
const btnPay = elementoId("btn-pay");
const cartToggle = elementoId("cart-toggle");
const cartClose = elementoId("cart-close");
const cartPanel = elementoId("cart-fixed");
const cartOverlay = elementoId("cart-overlay");
const cartBadge = elementoId("cart-badge");
const cartItems = elementoId("cart-items");
const cartItemsCount = elementoId("cart-items-count");
const grandTotal = elementoId("grand-total");
const customerForm = elementoId("customer-form");
const telefonoInput = elementoId("telefono");
const gallery = elementoId("gallery");

let carrito = [];

// =====================================================
// FORMATO Y CÁLCULOS DEL CARRITO
// =====================================================

// Formatea valores monetarios en pesos chilenos.
function formatoPrecio(valor) {
    return "$" + Number(valor).toLocaleString("es-CL");
}

// Calcula el subtotal de una línea del pedido.
function calcularSubtotal(item) {
    return item.precio * item.cantidad;
}

// Calcula el importe total del carrito.
function calcularTotalCarrito() {
    return carrito.reduce(
        (total, item) => total + calcularSubtotal(item),
        0
    );
}

// Calcula la suma de todas las unidades.
function calcularCantidadTotal() {
    return carrito.reduce(
        (total, item) => total + item.cantidad,
        0
    );
}

// =====================================================
// SLIDER DE FONDOS DEL HERO
// =====================================================

let intervaloHero = null;
let fondoActual = 0;
let capaActual = 0;

// Crea las capas de fondo y precarga las fotografías.
function inicializarHero() {
    const hero = elemento(".hero");

    if (!hero || fondosHero.length < 2) return;

    const capas = fondosHero.map((ruta, indice) => {
        const capa = document.createElement("div");
        capa.className = "hero-background";
        capa.style.backgroundImage = `url("${ruta}")`;

        if (indice === 0) capa.classList.add("active");

        hero.insertBefore(capa, hero.firstChild);

        const imagen = new Image();
        imagen.src = ruta;

        return capa;
    });

    // Cambia el fondo únicamente mientras la pestaña está visible.
    function cambiarFondo() {
        fondoActual = (fondoActual + 1) % fondosHero.length;
        capaActual = 1 - capaActual;

        capas[capaActual].style.backgroundImage =
            `url("${fondosHero[fondoActual]}")`;

        capas[capaActual].classList.add("active");
        capas[1 - capaActual].classList.remove("active");
    }

    function iniciar() {
        if (document.hidden || reducirMovimiento.matches || intervaloHero) {
            return;
        }

        intervaloHero = setInterval(cambiarFondo, INTERVALO_HERO);
    }

    function detener() {
        clearInterval(intervaloHero);
        intervaloHero = null;
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) detener();
        else iniciar();
    });

    reducirMovimiento.addEventListener?.("change", () => {
        if (reducirMovimiento.matches) detener();
        else iniciar();
    });

    iniciar();
}

// =====================================================
// MOSTRAR PRODUCTOS
// =====================================================

// Genera las tarjetas usando los datos definidos arriba.
function cargarProductos() {
    const grid = elementoId("products-grid");

    if (!grid) {
        console.error("No se encontró #products-grid.");
        return;
    }

    grid.innerHTML = productos.map((prod) => `
        <article class="product-card">
            <img
                src="${prod.imagen}"
                alt="${prod.nombre}"
                class="product-image"
                loading="lazy"
                decoding="async"
            >

            <div class="product-info">
                <h3>${prod.nombre}</h3>
                <p>${prod.descripcion}</p>
                <p class="price">${formatoPrecio(prod.precio)}</p>

                <p class="stock">
                    <small>Stock disponible: ${prod.stock}</small>
                </p>

                <div class="qty-selector">
                    <button class="btn-qty" type="button"
                        onclick="cambiarQtyTemporal(${prod.id}, -1)"
                        aria-label="Restar unidad">−</button>

                    <span id="temp-qty-${prod.id}">1</span>

                    <button class="btn-qty" type="button"
                        onclick="cambiarQtyTemporal(${prod.id}, 1)"
                        aria-label="Sumar unidad">+</button>
                </div>

                <button
                    class="btn-add"
                    id="btn-add-${prod.id}"
                    type="button"
                    onclick="agregarAlCarrito(${prod.id})"
                    ${prod.stock <= 0 ? "disabled" : ""}
                >
                    ${prod.stock <= 0 ? "Agotado" : "Agregar al pedido"}
                </button>
            </div>
        </article>
    `).join("");
}

// =====================================================
// CANTIDAD TEMPORAL Y AGREGAR PRODUCTOS
// =====================================================

// Ajusta la cantidad seleccionada sin superar el stock.
function cambiarQtyTemporal(id, cambio) {
    const span = elementoId(`temp-qty-${id}`);
    const producto = productos.find((p) => p.id === id);

    if (!span || !producto) return;

    const actual = Number.parseInt(span.textContent, 10) || 1;
    const maxima = producto.stock;

    span.textContent = Math.max(1, Math.min(actual + cambio, maxima));
}

// Añade productos al carrito y comprueba la disponibilidad.
function agregarAlCarrito(id) {
    const producto = productos.find((p) => p.id === id);
    const cantidadElement = elementoId(`temp-qty-${id}`);

    if (!producto || producto.stock <= 0 || !cantidadElement) return;

    const cantidad = Number.parseInt(cantidadElement.textContent, 10);

    if (!Number.isInteger(cantidad) || cantidad < 1) return;

    const existente = carrito.find((item) => item.id === id);
    const cantidadFinal = (existente?.cantidad || 0) + cantidad;

    if (cantidadFinal > producto.stock) {
        alert("No hay suficiente stock para agregar esa cantidad.");
        return;
    }

    if (existente) {
        existente.cantidad = cantidadFinal;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad
        });
    }

    cantidadElement.textContent = "1";
    actualizarCarritoUI();
}

// =====================================================
// ABRIR Y CERRAR CARRITO
// =====================================================

// Sincroniza las clases visuales y los atributos accesibles.
function abrirCarrito() {
    if (!cartPanel || !cartOverlay || !carrito.length) return;

    cartPanel.classList.add("cart-open");
    cartOverlay.classList.add("overlay-visible");
    cartPanel.setAttribute("aria-hidden", "false");
    cartToggle?.setAttribute("aria-expanded", "true");
    document.body.classList.add("cart-is-open");
}

function cerrarCarrito() {
    if (!cartPanel || !cartOverlay) return;

    cartPanel.classList.remove("cart-open");
    cartOverlay.classList.remove("overlay-visible");
    cartPanel.setAttribute("aria-hidden", "true");
    cartToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("cart-is-open");
}

// =====================================================
// ACTUALIZAR CARRITO
// =====================================================

// Actualiza cantidades, importes, productos y estado de compra.
function actualizarCarritoUI() {
    const cantidad = calcularCantidadTotal();
    const total = calcularTotalCarrito();

    cartBadge && (cartBadge.textContent = cantidad);
    cartItemsCount && (cartItemsCount.textContent =
        cantidad === 1 ? "1 producto" : `${cantidad} productos`);
    grandTotal && (grandTotal.textContent = formatoPrecio(total));

    if (cartToggle) {
        cartToggle.classList.toggle("cart-visible", carrito.length > 0);
    }

    if (btnPay) btnPay.disabled = carrito.length === 0;

    if (carrito.length === 0) cerrarCarrito();

    if (!cartItems) return;

    if (!carrito.length) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Tu pedido está vacío</h3>
                <p>Agrega algunos productos para comenzar.</p>
                <button id="continue-shopping" class="btn-continue" type="button">
                    Ver productos
                </button>
            </div>
        `;

        elementoId("continue-shopping")?.addEventListener("click", () => {
            cerrarCarrito();
            elementoId("productos")?.scrollIntoView({ behavior: "auto" });
        });

        return;
    }

    cartItems.innerHTML = carrito.map((item) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <strong>${item.nombre}</strong>
                <small>Precio unitario: ${formatoPrecio(item.precio)}</small>
            </div>

            <div class="cart-item-controls">
                <div class="qty-selector cart-qty">
                    <button class="btn-qty" type="button"
                        onclick="modificarCantidadCarrito(${item.id}, -1)"
                        aria-label="Restar unidad">−</button>

                    <span>${item.cantidad}</span>

                    <button class="btn-qty" type="button"
                        onclick="modificarCantidadCarrito(${item.id}, 1)"
                        aria-label="Sumar unidad">+</button>
                </div>

                <strong class="cart-subtotal">
                    ${formatoPrecio(calcularSubtotal(item))}
                </strong>

                <button class="btn-delete" type="button"
                    onclick="eliminarDelCarrito(${item.id})"
                    aria-label="Eliminar ${item.nombre}">🗑️</button>
            </div>
        </div>
    `).join("");
}

// Cambia la cantidad de un producto que ya está en el carrito.
function modificarCantidadCarrito(id, cambio) {
    const item = carrito.find((i) => i.id === id);
    const producto = productos.find((p) => p.id === id);

    if (!item || !producto) return;

    const nuevaCantidad = item.cantidad + cambio;

    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    if (nuevaCantidad > producto.stock) {
        alert("Stock máximo alcanzado.");
        return;
    }

    item.cantidad = nuevaCantidad;
    actualizarCarritoUI();
}

// Elimina una línea del pedido.
function eliminarDelCarrito(id) {
    carrito = carrito.filter((item) => item.id !== id);
    actualizarCarritoUI();
}

// =====================================================
// RESUMEN Y MODAL DE CONFIRMACIÓN
// =====================================================

// Construye el detalle que se muestra antes de enviar el pedido.
function generarResumenFinal() {
    const summary = elementoId("order-summary-final");
    if (!summary) return;

    summary.innerHTML = `
        <div class="final-order">
            <h3>Detalle del pedido</h3>

            ${carrito.map((item) => `
                <div class="final-order-item">
                    <div>
                        <strong>${item.nombre}</strong>
                        <small>${item.cantidad} × ${formatoPrecio(item.precio)}</small>
                    </div>
                    <strong>${formatoPrecio(calcularSubtotal(item))}</strong>
                </div>
            `).join("")}

            <div class="final-total">
                <span>Total</span>
                <strong>${formatoPrecio(calcularTotalCarrito())}</strong>
            </div>
        </div>
    `;
}

// Abre el resumen y cierra el panel del carrito.
btnPay?.addEventListener("click", () => {
    if (!carrito.length) return;

    generarResumenFinal();
    cerrarCarrito();

    if (modal) modal.style.display = "flex";
});

// Cierra el modal al pulsar la X o el fondo exterior.
function cerrarModal() {
    if (modal) modal.style.display = "none";
}

closeModal?.addEventListener("click", cerrarModal);

modal?.addEventListener("click", (event) => {
    if (event.target === modal) cerrarModal();
});

// Permite cerrar los paneles con Escape.
document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    cerrarModal();
    cerrarCarrito();
});

// Gestiona la apertura y el cierre del carrito.
cartToggle?.addEventListener("click", () => {
    if (!carrito.length) return;

    if (cartPanel?.classList.contains("cart-open")) cerrarCarrito();
    else abrirCarrito();
});

cartClose?.addEventListener("click", cerrarCarrito);
cartOverlay?.addEventListener("click", cerrarCarrito);

// =====================================================
// TELÉFONO CHILENO
// =====================================================

// Normaliza la entrada y la presenta como +56 9 XXXX XXXX.
telefonoInput?.addEventListener("input", () => {
    let numeros = telefonoInput.value.replace(/\D/g, "");

    if (numeros.startsWith("56")) numeros = numeros.slice(2);
    numeros = numeros.slice(0, 9);

    let formato = "";

    if (numeros.length) formato = "+56 9";
    if (numeros.length > 1) formato += ` ${numeros.slice(1, 5)}`;
    if (numeros.length > 5) formato += ` ${numeros.slice(5, 9)}`;

    telefonoInput.value = formato;
});

// =====================================================
// WHATSAPP Y ENVÍO DEL PEDIDO
// =====================================================

// Genera el texto con los datos del cliente y los productos.
function generarMensajeWhatsApp(pedido) {
    const lineas = [
        "*NUEVO PEDIDO - PRODUCTOS MONY*",
        "",
        "*ESTADO: PEDIDO PENDIENTE DE ENTREGA*",
        "",
        `*Cliente:* ${pedido.cliente.nombre}`,
        `*Área del cliente:* ${pedido.cliente.lugar}`,
        `*Teléfono:* ${pedido.cliente.telefono}`,
        "",
        "*DETALLE DEL PEDIDO*",
        ""
    ];

    pedido.items.forEach((item) => {
        lineas.push(
            `• ${item.nombre}`,
            `Cantidad: ${item.cantidad}`,
            `Precio unitario: ${formatoPrecio(item.precio)}`,
            `Subtotal: ${formatoPrecio(item.subtotal)}`,
            ""
        );
    });

    lineas.push(`*TOTAL: ${formatoPrecio(pedido.total)}*`);

    return lineas.join("\n");
}

// Valida los datos, prepara el pedido y abre WhatsApp.
customerForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!carrito.length) {
        alert("El carrito está vacío.");
        cerrarModal();
        return;
    }

    const nombre = elementoId("nombre")?.value.trim() || "";
    const lugar = elementoId("lugar")?.value.trim() || "";
    const telefono = telefonoInput?.value.trim() || "";
    const telefonoNumeros = telefono.replace(/\D/g, "");

    if (!/^569\d{8}$/.test(telefonoNumeros)) {
        alert("Ingrese un número celular chileno válido.\n\nEjemplo: +56 9 1234 5678");
        telefonoInput?.focus();
        return;
    }

    const pedido = {
        cliente: { nombre, lugar, telefono },
        items: carrito.map((item) => ({
            ...item,
            subtotal: calcularSubtotal(item)
        })),
        total: calcularTotalCarrito(),
        fecha: new Date().toISOString()
    };

    const mensaje = generarMensajeWhatsApp(pedido);
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

    // Abrir la ventana durante el evento de envío reduce bloqueos del navegador.
    const ventanaWhatsApp = window.open(url, "_blank", "noopener,noreferrer");

    if (!ventanaWhatsApp) {
        alert("El navegador bloqueó WhatsApp. Permite las ventanas emergentes e inténtalo nuevamente.");
        return;
    }

    carrito = [];
    cerrarModal();
    customerForm.reset();

    const summary = elementoId("order-summary-final");
    if (summary) summary.innerHTML = "";

    actualizarCarritoUI();
});

// =====================================================
// LUZ DEL TÍTULO HERO
// =====================================================

// Agrupa las actualizaciones del efecto en un solo fotograma.
function inicializarLuzHero() {
    const marca = elemento(".hero-brand");
    const contenido = elemento(".hero-content");

    if (!marca || !contenido || reducirMovimiento.matches) return;

    marca.dataset.text = marca.textContent.trim();

    let pendiente = false;
    let x = 50;
    let y = 50;

    document.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse" || pendiente) return;

        x = (event.clientX / window.innerWidth) * 100;
        y = (event.clientY / window.innerHeight) * 100;
        pendiente = true;

        requestAnimationFrame(() => {
            contenido.style.setProperty("--mouse-x", `${x}%`);
            contenido.style.setProperty("--mouse-y", `${y}%`);
            pendiente = false;
        });
    }, { passive: true });
}

// =====================================================
// SECCIONES ESTÁTICAS
// =====================================================

// Muestra el contenido sin esperar animaciones de desplazamiento.
function mostrarSeccionesEstaticas() {
    document.querySelectorAll(".reveal").forEach((seccion) => {
        seccion.classList.add("visible");
    });
}

// =====================================================
// GALERÍA HORIZONTAL
// DESPLAZAMIENTO AUTOMÁTICO Y ARRASTRE
// =====================================================

let frameGaleria = null;
let galeriaVisible = false;
let galeriaPausada = false;
let arrastrando = false;
let galeriaMovida = false;
let inicioX = 0;
let inicioScroll = 0;
let ultimoTiempo = 0;
let timeoutReanudar = null;
let observerGaleria = null;

// Crea una sola copia de cada imagen.
function crearGaleria() {
    if (!gallery) return;

    gallery.innerHTML = galleryImages.map((src, index) => `
        <div class="gallery-item">
            <img
                src="${src}"
                alt="Productos Mony - imagen ${index + 1}"
                loading="lazy"
                decoding="async"
                draggable="false"
            >
        </div>
    `).join("");

    // Informa si una imagen no está disponible.
    gallery.querySelectorAll("img").forEach((img) => {
        img.addEventListener("error", () => {
            console.error("No se pudo cargar la imagen:", img.src);
            img.closest(".gallery-item")?.classList.add("gallery-image-error");
        });
    });

    // Configura los controles una sola vez.
    configurarArrastreGaleria();
    configurarObservadorGaleria();
}

// Inicia la animación solo cuando la galería está visible.
function iniciarMovimientoAutomatico() {
    if (
        !gallery ||
        !galeriaVisible ||
        galeriaPausada ||
        reducirMovimiento.matches ||
        frameGaleria !== null
    ) return;

    ultimoTiempo = 0;
    frameGaleria = requestAnimationFrame(moverGaleria);
}

// Detiene el ciclo de animación para evitar trabajo innecesario.
function detenerMovimientoAutomatico() {
    if (frameGaleria !== null) {
        cancelAnimationFrame(frameGaleria);
        frameGaleria = null;
    }

    ultimoTiempo = 0;
}

// Desplaza la galería a una velocidad estable según el tiempo transcurrido.
function moverGaleria(timestamp) {
    frameGaleria = null;

    if (!gallery || !galeriaVisible) return;

    if (!ultimoTiempo) ultimoTiempo = timestamp;

    const delta = Math.min(timestamp - ultimoTiempo, 50);
    ultimoTiempo = timestamp;

    if (!galeriaPausada && !arrastrando) {
        const maxScroll = gallery.scrollWidth - gallery.clientWidth;

        if (maxScroll <= 0 || gallery.scrollLeft >= maxScroll) return;

        gallery.scrollLeft = Math.min(
            gallery.scrollLeft + (VELOCIDAD_GALERIA * delta) / 1000,
            maxScroll
        );
    }

    frameGaleria = requestAnimationFrame(moverGaleria);
}

// Pausa el movimiento mientras el usuario interactúa.
function pausarGaleria() {
    galeriaPausada = true;
    clearTimeout(timeoutReanudar);
    timeoutReanudar = null;
}

// Reanuda el desplazamiento después de un breve descanso.
function reanudarGaleria() {
    clearTimeout(timeoutReanudar);

    timeoutReanudar = setTimeout(() => {
        galeriaPausada = false;
        iniciarMovimientoAutomatico();
    }, ESPERA_GALERIA);
}

// Detecta cuándo la galería entra o sale de la pantalla.
function configurarObservadorGaleria() {
    if (!gallery || observerGaleria) return;

    observerGaleria = new IntersectionObserver(([entrada]) => {
        galeriaVisible = entrada.isIntersecting;

        if (galeriaVisible) iniciarMovimientoAutomatico();
        else detenerMovimientoAutomatico();
    }, { threshold: 0.01 });

    observerGaleria.observe(gallery);
}

// Permite arrastrar la galería con ratón o pantalla táctil.
function configurarArrastreGaleria() {
    if (!gallery) return;

    gallery.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;

        arrastrando = true;
        galeriaMovida = false;
        inicioX = event.clientX;
        inicioScroll = gallery.scrollLeft;

        pausarGaleria();
        gallery.classList.add("is-dragging");

        try {
            gallery.setPointerCapture(event.pointerId);
        } catch {
            // El navegador puede no admitir la captura del puntero.
        }
    });

    gallery.addEventListener("pointermove", (event) => {
        if (!arrastrando) return;

        const diferencia = event.clientX - inicioX;

        if (Math.abs(diferencia) > 5) galeriaMovida = true;

        gallery.scrollLeft = inicioScroll - diferencia;
    });

    const finalizar = (event) => {
        if (!arrastrando) return;

        arrastrando = false;
        gallery.classList.remove("is-dragging");

        try {
            if (gallery.hasPointerCapture(event.pointerId)) {
                gallery.releasePointerCapture(event.pointerId);
            }
        } catch {
            // El puntero puede haberse liberado previamente.
        }

        reanudarGaleria();

        // Evita que el clic posterior al arrastre seleccione una imagen.
        setTimeout(() => {
            galeriaMovida = false;
        }, 0);
    };

    gallery.addEventListener("pointerup", finalizar);
    gallery.addEventListener("pointercancel", finalizar);
    gallery.addEventListener("lostpointercapture", finalizar);

    gallery.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "mouse") pausarGaleria();
    });

    gallery.addEventListener("pointerleave", (event) => {
        if (event.pointerType === "mouse" && !arrastrando) reanudarGaleria();
    });

    // Activa o desactiva el resaltado de la imagen seleccionada.
    gallery.addEventListener("click", (event) => {
        if (galeriaMovida) {
            event.preventDefault();
            return;
        }

        const item = event.target.closest(".gallery-item");
        if (!item) return;

        const yaActivo = item.classList.contains("active");

        gallery.querySelectorAll(".gallery-item.active").forEach((activo) => {
            activo.classList.remove("active");
        });

        item.classList.toggle("active", !yaActivo);
        gallery.classList.toggle("has-active", !yaActivo);
    });
}

// =====================================================
// CONTROL DE VISIBILIDAD DE LA PÁGINA
// =====================================================

// Suspende el trabajo visual cuando la pestaña queda en segundo plano.
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        detenerMovimientoAutomatico();
        clearTimeout(timeoutReanudar);
    } else {
        iniciarMovimientoAutomatico();
    }
});

// =====================================================
// INICIALIZACIÓN
// =====================================================

// Prepara la interfaz cuando el documento está disponible.
function inicializarAplicacion() {
    inicializarHero();
    cargarProductos();
    actualizarCarritoUI();
    inicializarLuzHero();
    mostrarSeccionesEstaticas();
    crearGaleria();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarAplicacion, { once: true });
} else {
    inicializarAplicacion();
}

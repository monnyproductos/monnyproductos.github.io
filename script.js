// =====================================================
// SLIDER DE FONDOS DEL HERO
// SOLO 2 FOTOGRAFÍAS
// =====================================================

const fondosHero = [
    "imagen/fotofondo1.webp",
    "imagen/fotofondo2.webp"
];

let fondoActual = 0;
let capaActual = 1;

const hero = document.querySelector(".hero");

if (hero && fondosHero.length === 2) {

    const fondo1 = document.createElement("div");
    const fondo2 = document.createElement("div");

    fondo1.className = "hero-background";
    fondo2.className = "hero-background";

    hero.insertBefore(fondo1, hero.firstChild);
    hero.insertBefore(fondo2, fondo1);

    fondo1.style.backgroundImage =
        `url("${fondosHero[0]}")`;

    fondo1.classList.add("active");

    fondosHero.forEach((ruta) => {

        const imagen = new Image();
        imagen.src = ruta;

    });

    setInterval(() => {

        fondoActual++;

        if (fondoActual >= fondosHero.length) {
            fondoActual = 0;
        }

        if (capaActual === 1) {

            fondo2.style.backgroundImage =
                `url("${fondosHero[fondoActual]}")`;

            fondo2.classList.add("active");
            fondo1.classList.remove("active");

            capaActual = 2;

        } else {

            fondo1.style.backgroundImage =
                `url("${fondosHero[fondoActual]}")`;

            fondo1.classList.add("active");
            fondo2.classList.remove("active");

            capaActual = 1;

        }

    }, 5000);

}


// =====================================================
// DATOS DE LOS PRODUCTOS
// =====================================================

const productos = [

    {
        id: 1,
        nombre: "Caja Frutillas Grandes",
        descripcion:
            "Ideales para bañar en chocolate y preparación.",
        precio: 10000,
        stock: 12,
        imagen: "imagen/FrutillaGrande.webp",
        estado: "Disponible"
    },

    {
        id: 2,
        nombre: "Caja Frutillas Chicas",
        descripcion:
            "Sabor intenso y auténtico, ideales para preparar exquisitas mermeladas, jugos naturales y deliciosos postres",
        precio: 6000,
        stock: 20,
        imagen: "imagen/FrutillaChica.webp",
        estado: "Disponible"
    },

    {
        id: 3,
        nombre: "Bandeja 1 Kilo",
        descripcion:
            "Selección de frutillas grandes y medianas, frescas y llenas de sabor",
        precio: 3000,
        stock: 5,
        imagen: "imagen/frutillaKilo.webp",
        estado: "Disponible"
    }

];


// =====================================================
// ESTADO DEL CARRITO
// =====================================================

let carrito = [];


// =====================================================
// ELEMENTOS DEL DOM
// =====================================================

const modal =
    document.getElementById("modal-checkout");

const closeModal =
    document.querySelector(".close-modal");

const btnPay =
    document.getElementById("btn-pay");

const cartToggle =
    document.getElementById("cart-toggle");

const cartClose =
    document.getElementById("cart-close");

const cartPanel =
    document.getElementById("cart-fixed");

const cartOverlay =
    document.getElementById("cart-overlay");

const cartBadge =
    document.getElementById("cart-badge");

const cartItems =
    document.getElementById("cart-items");

const cartItemsCount =
    document.getElementById("cart-items-count");

const grandTotal =
    document.getElementById("grand-total");


// =====================================================
// FORMATEAR PRECIOS
// =====================================================

function formatoPrecio(valor) {

    return "$" +
        Number(valor).toLocaleString("es-CL");

}


// =====================================================
// CALCULAR SUBTOTAL
// =====================================================

function calcularSubtotal(item) {

    return item.precio * item.cantidad;

}


// =====================================================
// CALCULAR TOTAL
// =====================================================

function calcularTotalCarrito() {

    return carrito.reduce(
        (total, item) => {

            return total +
                calcularSubtotal(item);

        },
        0
    );

}


// =====================================================
// CALCULAR CANTIDAD TOTAL
// =====================================================

function calcularCantidadTotal() {

    return carrito.reduce(
        (total, item) => {

            return total + item.cantidad;

        },
        0
    );

}


// =====================================================
// ABRIR CARRITO
// =====================================================

function abrirCarrito() {

    if (!cartPanel || !cartOverlay) {
        return;
    }

    if (carrito.length === 0) {
        return;
    }

    cartPanel.classList.add("cart-open");
    cartOverlay.classList.add("overlay-visible");

    if (cartToggle) {

        cartToggle.setAttribute(
            "aria-expanded",
            "true"
        );

    }

    cartPanel.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "cart-is-open"
    );

}


// =====================================================
// CERRAR CARRITO
// =====================================================

function cerrarCarrito() {

    if (!cartPanel || !cartOverlay) {
        return;
    }

    cartPanel.classList.remove("cart-open");
    cartOverlay.classList.remove("overlay-visible");

    if (cartToggle) {

        cartToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }

    cartPanel.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "cart-is-open"
    );

}


// =====================================================
// CARGAR PRODUCTOS
// =====================================================

function cargarProductos() {

    const grid =
        document.getElementById("products-grid");

    if (!grid) {

        console.error(
            "No se encontró el elemento #products-grid"
        );

        return;

    }

    grid.innerHTML = "";

    productos.forEach((prod) => {

        const card =
            document.createElement("div");

        card.className =
            "product-card";

        card.innerHTML = `

            <img
                src="${prod.imagen}"
                alt="${prod.nombre}"
                class="product-image"
            >

            <div class="product-info">

                <h3>
                    ${prod.nombre}
                </h3>

                <p>
                    ${prod.descripcion}
                </p>

                <p class="price">
                    ${formatoPrecio(prod.precio)}
                </p>

                <p class="stock">

                    <small>
                        Stock disponible:
                        ${prod.stock}
                    </small>

                </p>

                <div class="qty-selector">

                    <button
                        class="btn-qty"
                        type="button"
                        onclick="cambiarQtyTemporal(${prod.id}, -1)"
                    >
                        −
                    </button>

                    <span id="temp-qty-${prod.id}">
                        1
                    </span>

                    <button
                        class="btn-qty"
                        type="button"
                        onclick="cambiarQtyTemporal(${prod.id}, 1)"
                    >
                        +
                    </button>

                </div>

                <button
                    class="btn-add"
                    id="btn-add-${prod.id}"
                    type="button"
                    onclick="agregarAlCarrito(${prod.id})"
                    ${prod.stock === 0 ? "disabled" : ""}
                >
                    ${
                        prod.stock === 0
                            ? "Agotado"
                            : "Agregar al pedido"
                    }
                </button>

            </div>

        `;

        grid.appendChild(card);

    });

}


// =====================================================
// CAMBIAR CANTIDAD TEMPORAL
// =====================================================

function cambiarQtyTemporal(id, cambio) {

    const span =
        document.getElementById(
            `temp-qty-${id}`
        );

    const producto =
        productos.find(
            (p) => p.id === id
        );

    if (!span || !producto) {
        return;
    }

    let cantidad =
        parseInt(
            span.innerText,
            10
        );

    if (isNaN(cantidad)) {
        cantidad = 1;
    }

    cantidad += cambio;

    if (cantidad < 1) {
        cantidad = 1;
    }

    if (cantidad > producto.stock) {
        cantidad = producto.stock;
    }

    span.innerText =
        cantidad;

}


// =====================================================
// AGREGAR AL CARRITO
// =====================================================

function agregarAlCarrito(id) {

    const producto =
        productos.find(
            (p) => p.id === id
        );

    if (
        !producto ||
        producto.stock <= 0
    ) {
        return;
    }

    const cantidadElement =
        document.getElementById(
            `temp-qty-${id}`
        );

    if (!cantidadElement) {
        return;
    }

    const cantidad =
        parseInt(
            cantidadElement.innerText,
            10
        );

    if (
        isNaN(cantidad) ||
        cantidad <= 0
    ) {
        return;
    }

    const existente =
        carrito.find(
            (item) => item.id === id
        );

    if (existente) {

        const nuevaCantidad =
            existente.cantidad +
            cantidad;

        if (
            nuevaCantidad >
            producto.stock
        ) {

            alert(
                "No hay suficiente stock para agregar esa cantidad."
            );

            return;
        }

        existente.cantidad =
            nuevaCantidad;

    } else {

        carrito.push({

            id:
                producto.id,

            nombre:
                producto.nombre,

            precio:
                producto.precio,

            cantidad:
                cantidad

        });

    }

    actualizarCarritoUI();

    cantidadElement.innerText =
        "1";

}


// =====================================================
// ACTUALIZAR INTERFAZ DEL CARRITO
// =====================================================

function actualizarCarritoUI() {

    if (!cartItems) {
        return;
    }

    const cantidadTotal =
        calcularCantidadTotal();

    const total =
        calcularTotalCarrito();

    if (cartToggle) {

        if (carrito.length > 0) {

            cartToggle.classList.add(
                "cart-visible"
            );

        } else {

            cartToggle.classList.remove(
                "cart-visible"
            );

            cerrarCarrito();

        }

    }

    if (cartBadge) {

        cartBadge.innerText =
            cantidadTotal;

    }

    if (cartItemsCount) {

        cartItemsCount.innerText =
            cantidadTotal === 1
                ? "1 producto"
                : `${cantidadTotal} productos`;

    }

    if (grandTotal) {

        grandTotal.innerText =
            formatoPrecio(total);

    }

    if (carrito.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h3>
                    Tu pedido está vacío
                </h3>

                <p>
                    Agrega algunos productos para comenzar.
                </p>

                <button
                    id="continue-shopping"
                    class="btn-continue"
                    type="button"
                >
                    Ver productos
                </button>

            </div>

        `;

        if (btnPay) {
            btnPay.disabled = true;
        }

        agregarEventoContinuar();

        return;

    }

    cartItems.innerHTML = "";

    carrito.forEach((item) => {

        const subtotal =
            calcularSubtotal(item);

        const div =
            document.createElement("div");

        div.className =
            "cart-item";

        div.innerHTML = `

            <div class="cart-item-info">

                <strong>
                    ${item.nombre}
                </strong>

                <small>
                    Precio unitario:
                    ${formatoPrecio(item.precio)}
                </small>

            </div>

            <div class="cart-item-controls">

                <div class="qty-selector cart-qty">

                    <button
                        class="btn-qty"
                        type="button"
                        onclick="modificarCantidadCarrito(${item.id}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${item.cantidad}
                    </span>

                    <button
                        class="btn-qty"
                        type="button"
                        onclick="modificarCantidadCarrito(${item.id}, 1)"
                    >
                        +
                    </button>

                </div>

                <strong class="cart-subtotal">
                    ${formatoPrecio(subtotal)}
                </strong>

                <button
                    class="btn-delete"
                    type="button"
                    onclick="eliminarDelCarrito(${item.id})"
                    aria-label="Eliminar producto"
                >
                    🗑️
                </button>

            </div>

        `;

        cartItems.appendChild(div);

    });

    if (btnPay) {
        btnPay.disabled = false;
    }

}


// =====================================================
// MODIFICAR CANTIDAD DESDE EL CARRITO
// =====================================================

function modificarCantidadCarrito(id, cambio) {

    const item =
        carrito.find(
            (i) => i.id === id
        );

    const producto =
        productos.find(
            (p) => p.id === id
        );

    if (!item || !producto) {
        return;
    }

    const nuevaCantidad =
        item.cantidad +
        cambio;

    if (nuevaCantidad <= 0) {

        eliminarDelCarrito(id);

        return;

    }

    if (
        nuevaCantidad >
        producto.stock
    ) {

        alert(
            "Stock máximo alcanzado."
        );

        return;

    }

    item.cantidad =
        nuevaCantidad;

    actualizarCarritoUI();

}


// =====================================================
// ELIMINAR PRODUCTO
// =====================================================

function eliminarDelCarrito(id) {

    carrito =
        carrito.filter(
            (item) =>
                item.id !== id
        );

    actualizarCarritoUI();

}


// =====================================================
// BOTÓN VER PRODUCTOS
// =====================================================

function agregarEventoContinuar() {

    const button =
        document.getElementById(
            "continue-shopping"
        );

    if (!button) {
        return;
    }

    button.onclick = () => {

        cerrarCarrito();

        const productosSection =
            document.getElementById(
                "productos"
            );

        if (productosSection) {

            productosSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    };

}


// =====================================================
// GENERAR RESUMEN FINAL
// =====================================================

function generarResumenFinal() {

    const summary =
        document.getElementById(
            "order-summary-final"
        );

    if (!summary) {
        return;
    }

    const total =
        calcularTotalCarrito();

    let html = `

        <div class="final-order">

            <h3>
                Detalle del pedido
            </h3>

    `;

    carrito.forEach((item) => {

        const subtotal =
            calcularSubtotal(item);

        html += `

            <div class="final-order-item">

                <div>

                    <strong>
                        ${item.nombre}
                    </strong>

                    <small>
                        ${item.cantidad}
                        ×
                        ${formatoPrecio(item.precio)}
                    </small>

                </div>

                <strong>
                    ${formatoPrecio(subtotal)}
                </strong>

            </div>

        `;

    });

    html += `

            <div class="final-total">

                <span>
                    Total
                </span>

                <strong>
                    ${formatoPrecio(total)}
                </strong>

            </div>

        </div>

    `;

    summary.innerHTML =
        html;

}


// =====================================================
// BOTÓN CONFIRMAR PEDIDO
// =====================================================

if (btnPay) {

    btnPay.addEventListener(
        "click",
        () => {

            if (
                carrito.length === 0
            ) {
                return;
            }

            generarResumenFinal();

            cerrarCarrito();

            if (modal) {

                modal.style.display =
                    "flex";

            }

        }
    );

}


// =====================================================
// CERRAR MODAL
// =====================================================

if (
    closeModal &&
    modal
) {

    closeModal.addEventListener(
        "click",
        () => {

            modal.style.display =
                "none";

        }
    );

}


// =====================================================
// CERRAR MODAL AL HACER CLICK AFUERA
// =====================================================

if (modal) {

    modal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                modal
            ) {

                modal.style.display =
                    "none";

            }

        }
    );

}


// =====================================================
// TECLA ESC
// =====================================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }

        if (
            modal &&
            modal.style.display ===
            "flex"
        ) {

            modal.style.display =
                "none";

        }

        if (
            cartPanel &&
            cartPanel.classList.contains(
                "cart-open"
            )
        ) {

            cerrarCarrito();

        }

    }
);


// =====================================================
// BOTÓN DEL CARRITO
// =====================================================

if (cartToggle) {

    cartToggle.addEventListener(
        "click",
        () => {

            if (carrito.length === 0) {
                return;
            }

            if (
                cartPanel &&
                cartPanel.classList.contains(
                    "cart-open"
                )
            ) {

                cerrarCarrito();

            } else {

                abrirCarrito();

            }

        }
    );

}


// =====================================================
// BOTÓN CERRAR CARRITO
// =====================================================

if (cartClose) {

    cartClose.addEventListener(
        "click",
        () => {

            cerrarCarrito();

        }
    );

}


// =====================================================
// CERRAR CON OVERLAY
// =====================================================

if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        () => {

            cerrarCarrito();

        }
    );

}


// =====================================================
// CONFIGURACIÓN WHATSAPP
// =====================================================

const NUMERO_WHATSAPP =
    "56997511281";


// =====================================================
// GENERAR MENSAJE DE WHATSAPP
// =====================================================

function generarMensajeWhatsApp(
    pedidoCompleto
) {

    let mensaje =
        ` *NUEVO PEDIDO - PRODUCTOS MONY*\n\n` +
        ` *ESTADO: PEDIDO PENDIENTE DE ENTREGA*\n\n` +
        ` *Cliente:* ${pedidoCompleto.cliente.nombre}\n` +
        ` *Area del cliente:* ${pedidoCompleto.cliente.lugar}\n` +
        ` *Teléfono:* ${pedidoCompleto.cliente.telefono}\n\n` +
        ` *DETALLE DEL PEDIDO*\n\n`;

    pedidoCompleto.items.forEach(
        (item) => {

            mensaje +=
                `• ${item.nombre}\n` +
                `Cantidad: ${item.cantidad}\n` +
                `Precio unitario: ${formatoPrecio(item.precio)}\n` +
                `Subtotal: ${formatoPrecio(item.subtotal)}\n\n`;

        }
    );

    mensaje +=
        ` *TOTAL: ${formatoPrecio(pedidoCompleto.total)}*`;

    return mensaje;

}


// =====================================================
// FORMATO Y VALIDACIÓN DEL TELÉFONO
// =====================================================

const telefonoInput =
    document.getElementById(
        "telefono"
    );

if (telefonoInput) {

    telefonoInput.addEventListener(
        "input",
        () => {

            let numeros =
                telefonoInput.value.replace(
                    /\D/g,
                    ""
                );

            if (
                numeros.startsWith("56")
            ) {

                numeros =
                    numeros.substring(2);

            }

            numeros =
                numeros.substring(0, 9);

            let telefonoFormateado =
                "";

            if (
                numeros.length > 0
            ) {

                telefonoFormateado =
                    "+56 ";

            }

            if (
                numeros.length > 0
            ) {

                telefonoFormateado +=
                    "9 ";

            }

            if (
                numeros.length > 1
            ) {

                telefonoFormateado +=
                    numeros.substring(1, 5);

            }

            if (
                numeros.length > 5
            ) {

                telefonoFormateado +=
                    " " +
                    numeros.substring(5, 9);

            }

            telefonoInput.value =
                telefonoFormateado.trim();

        }
    );

}


// =====================================================
// FORMULARIO FINAL
// =====================================================

const customerForm =
    document.getElementById(
        "customer-form"
    );

if (customerForm) {

    customerForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            if (
                carrito.length === 0
            ) {

                alert(
                    "El carrito está vacío."
                );

                if (modal) {

                    modal.style.display =
                        "none";

                }

                return;

            }

            const nombreElement =
                document.getElementById(
                    "nombre"
                );

            const lugarElement =
                document.getElementById(
                    "lugar"
                );

            const telefonoElement =
                document.getElementById(
                    "telefono"
                );

            const nombre =
                nombreElement
                    ? nombreElement.value.trim()
                    : "";

            const lugar =
                lugarElement
                    ? lugarElement.value.trim()
                    : "";

            const telefono =
                telefonoElement
                    ? telefonoElement.value.trim()
                    : "";

            const telefonoNumeros =
                telefono.replace(
                    /\D/g,
                    ""
                );

            if (
                !/^569\d{8}$/.test(
                    telefonoNumeros
                )
            ) {

                alert(
                    "Ingrese un número celular chileno válido.\n\n" +
                    "Ejemplo: +56 9 1234 5678"
                );

                if (telefonoElement) {
                    telefonoElement.focus();
                }

                return;

            }

            const pedidoCompleto = {

                cliente: {

                    nombre:
                        nombre,

                    lugar:
                        lugar,

                    telefono:
                        telefono

                },

                items:
                    carrito.map(
                        (item) => ({

                            id:
                                item.id,

                            nombre:
                                item.nombre,

                            precio:
                                item.precio,

                            cantidad:
                                item.cantidad,

                            subtotal:
                                calcularSubtotal(
                                    item
                                )

                        })
                    ),

                total:
                    calcularTotalCarrito(),

                fecha:
                    new Date().toISOString()

            };

            console.log(
                "Pedido:",
                pedidoCompleto
            );

            const mensaje =
                generarMensajeWhatsApp(
                    pedidoCompleto
                );

            const urlWhatsApp =
                `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

            window.open(
                urlWhatsApp,
                "_blank"
            );

            carrito = [];

            if (modal) {

                modal.style.display =
                    "none";

            }

            customerForm.reset();

            const summary =
                document.getElementById(
                    "order-summary-final"
                );

            if (summary) {

                summary.innerHTML =
                    "";

            }

            actualizarCarritoUI();

        }
    );

}


// =====================================================
// INICIALIZAR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarProductos();

        actualizarCarritoUI();

    }
);


// =====================================================
// LUZ DINÁMICA DEL TÍTULO HERO
// =====================================================

const heroBrand =
    document.querySelector(
        ".hero-brand"
    );

const heroContent =
    document.querySelector(
        ".hero-content"
    );

if (
    heroBrand &&
    heroContent
) {

    heroBrand.setAttribute(
        "data-text",
        heroBrand.textContent.trim()
    );

    document.addEventListener(
        "mousemove",
        (event) => {

            const x =
                (
                    event.clientX /
                    window.innerWidth
                ) * 100;

            const y =
                (
                    event.clientY /
                    window.innerHeight
                ) * 100;

            heroContent.style.setProperty(
                "--mouse-x",
                `${x}%`
            );

            heroContent.style.setProperty(
                "--mouse-y",
                `${y}%`
            );

        }
    );

}


// =====================================================
// ANIMACIONES AL HACER SCROLL
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const elementos =
            document.querySelectorAll(
                ".reveal"
            );

        const observer =
            new IntersectionObserver(
                (entradas) => {

                    entradas.forEach(
                        (entrada) => {

                            if (
                                entrada.isIntersecting
                            ) {

                                entrada.target.classList.add(
                                    "visible"
                                );

                            } else {

                                entrada.target.classList.remove(
                                    "visible"
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.15
                }
            );

        elementos.forEach(
            (elemento) => {

                observer.observe(
                    elemento
                );

            }
        );

    }
);


// =====================================================
// GALERÍA HORIZONTAL
// MOVIMIENTO AUTOMÁTICO + ARRASTRE MANUAL
// SIN REPETIR IMÁGENES
// =====================================================

const gallery =
    document.getElementById("gallery");


// =====================================================
// IMÁGENES DE LA GALERÍA
// =====================================================

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


// =====================================================
// CONFIGURACIÓN
// =====================================================

const GALLERY_AUTO_SPEED = 27;

const GALLERY_RESUME_DELAY = 2500;


// =====================================================
// VARIABLES
// =====================================================

let galleryAnimationFrame = null;

let galleryPaused = false;

let galleryVisible = false;

let galleryDragging = false;

let galleryStartX = 0;

let galleryStartScrollLeft = 0;

let galleryMoved = false;

let galleryResumeTimeout = null;

let galleryLastTimestamp = 0;

let galleryObserver = null;


// =====================================================
// PREFERENCIA DE REDUCCIÓN DE MOVIMIENTO
// =====================================================

const galleryReducedMotion =
    window.matchMedia &&
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


// =====================================================
// CREAR GALERÍA
// =====================================================

function crearGaleria() {

    if (!gallery) {
        return;
    }

    if (!galleryImages.length) {

        console.warn(
            "La galería no contiene imágenes."
        );

        return;

    }

    gallery.innerHTML = "";


    // =================================================
    // ÚNICO GRUPO DE IMÁGENES
    // =================================================

    galleryImages.forEach(
        (image, index) => {

            crearElementoGaleria(
                image,
                index,
                false
            );

        }
    );


    // =================================================
    // ESPERAR A QUE EL DOM CALCULE EL ANCHO
    // =================================================

    requestAnimationFrame(() => {

        gallery.scrollLeft = 0;

        configurarArrastreGaleria();

        configurarObservadorGaleria();

    });

}


// =====================================================
// CREAR ELEMENTO INDIVIDUAL
// =====================================================

function crearElementoGaleria(
    image,
    index,
    duplicado
) {

    const item =
        document.createElement("div");

    item.className =
        "gallery-item";

    item.innerHTML = `

        <img
            src="${image}"
            alt="Productos Mony - imagen ${index + 1}"
            loading="eager"
            draggable="false"
        >

    `;

    const img =
        item.querySelector("img");

    if (img) {

        img.addEventListener(
            "error",
            () => {

                console.error(
                    "No se pudo cargar la imagen de la galería:",
                    image
                );

                item.classList.add(
                    "gallery-image-error"
                );

            }
        );

    }

    gallery.appendChild(item);


    // =================================================
    // CLICK
    // =================================================

    item.addEventListener(
        "click",
        () => {

            if (galleryMoved) {
                return;
            }

            const isActive =
                item.classList.contains(
                    "active"
                );

            gallery
                .querySelectorAll(
                    ".gallery-item"
                )
                .forEach(
                    element => {

                        element.classList.remove(
                            "active"
                        );

                    }
                );

            if (isActive) {

                gallery.classList.remove(
                    "has-active"
                );

            } else {

                item.classList.add(
                    "active"
                );

                gallery.classList.add(
                    "has-active"
                );

            }

        }
    );

}


// =====================================================
// CONFIGURAR INTERSECTIONOBSERVER
// =====================================================

function configurarObservadorGaleria() {

    if (
        !gallery ||
        galleryObserver
    ) {
        return;
    }

    galleryObserver =
        new IntersectionObserver(
            (entradas) => {

                const entrada =
                    entradas[0];

                if (!entrada) {
                    return;
                }

                galleryVisible =
                    entrada.isIntersecting &&
                    entrada.intersectionRatio > 0;


                if (galleryVisible) {

                    galleryLastTimestamp =
                        performance.now();

                    iniciarMovimientoAutomatico();

                } else {

                    detenerMovimientoAutomatico();

                }

            },
            {
                root: null,

                rootMargin:
                    "0px",

                threshold:
                    0.01

            }
        );


    galleryObserver.observe(
        gallery
    );

}


// =====================================================
// INICIAR MOVIMIENTO AUTOMÁTICO
// =====================================================

function iniciarMovimientoAutomatico() {

    if (!gallery) {
        return;
    }

    if (galleryReducedMotion) {
        return;
    }

    if (!galleryVisible) {
        return;
    }

    if (galleryAnimationFrame) {
        return;
    }

    galleryLastTimestamp =
        performance.now();

    galleryAnimationFrame =
        requestAnimationFrame(
            moverGaleria
        );

}


// =====================================================
// DETENER MOVIMIENTO AUTOMÁTICO
// =====================================================

function detenerMovimientoAutomatico() {

    if (galleryAnimationFrame) {

        cancelAnimationFrame(
            galleryAnimationFrame
        );

        galleryAnimationFrame =
            null;

    }

    galleryLastTimestamp =
        0;

}


// =====================================================
// MOVIMIENTO AUTOMÁTICO
// SIN BUCLE
// =====================================================

function moverGaleria(timestamp) {

    if (
        !gallery ||
        !galleryVisible
    ) {

        detenerMovimientoAutomatico();

        return;

    }


    if (!galleryLastTimestamp) {

        galleryLastTimestamp =
            timestamp;

    }


    const deltaTime =
        Math.min(
            timestamp -
            galleryLastTimestamp,
            50
        );


    galleryLastTimestamp =
        timestamp;


    if (
        !galleryPaused &&
        !galleryDragging
    ) {

        const desplazamiento =
            (
                GALLERY_AUTO_SPEED *
                deltaTime
            ) / 1000;


        const maxScroll =
            gallery.scrollWidth -
            gallery.clientWidth;


        gallery.scrollLeft =
            Math.min(
                gallery.scrollLeft +
                desplazamiento,
                Math.max(0, maxScroll)
            );


        // =============================================
        // LLEGAMOS AL FINAL
        // =============================================

        if (
            maxScroll <= 0 ||
            gallery.scrollLeft >= maxScroll
        ) {

            detenerMovimientoAutomatico();

            return;

        }

    }


    galleryAnimationFrame =
        requestAnimationFrame(
            moverGaleria
        );

}


// =====================================================
// PAUSAR GALERÍA
// =====================================================

function pausarGaleria() {

    galleryPaused =
        true;

    if (galleryResumeTimeout) {

        clearTimeout(
            galleryResumeTimeout
        );

        galleryResumeTimeout =
            null;

    }

}


// =====================================================
// REANUDAR GALERÍA
// =====================================================

function reanudarGaleria() {

    if (galleryResumeTimeout) {

        clearTimeout(
            galleryResumeTimeout
        );

    }

    galleryResumeTimeout =
        setTimeout(
            () => {

                galleryPaused =
                    false;

                if (
                    galleryVisible &&
                    !galleryReducedMotion
                ) {

                    const maxScroll =
                        gallery.scrollWidth -
                        gallery.clientWidth;

                    if (
                        gallery.scrollLeft <
                        maxScroll
                    ) {

                        iniciarMovimientoAutomatico();

                    }

                }

            },
            GALLERY_RESUME_DELAY
        );

}


// =====================================================
// CONFIGURAR ARRASTRE
// =====================================================

function configurarArrastreGaleria() {

    if (!gallery) {
        return;
    }


    // =================================================
    // POINTER DOWN
    // =================================================

    gallery.addEventListener(
        "pointerdown",
        (event) => {

            galleryDragging =
                true;

            galleryMoved =
                false;

            galleryStartX =
                event.clientX;

            galleryStartScrollLeft =
                gallery.scrollLeft;

            pausarGaleria();


            try {

                gallery.setPointerCapture(
                    event.pointerId
                );

            } catch (error) {

                // Navegador sin soporte.

            }


            gallery.classList.add(
                "is-dragging"
            );

        }
    );


    // =================================================
    // POINTER MOVE
    // =================================================

    gallery.addEventListener(
        "pointermove",
        (event) => {

            if (!galleryDragging) {
                return;
            }

            const diferencia =
                event.clientX -
                galleryStartX;

            if (
                Math.abs(diferencia) > 5
            ) {

                galleryMoved =
                    true;

            }

            gallery.scrollLeft =
                galleryStartScrollLeft -
                diferencia;

        }
    );


    // =================================================
    // POINTER UP
    // =================================================

    gallery.addEventListener(
        "pointerup",
        (event) => {

            finalizarArrastre(
                event
            );

        }
    );


    // =================================================
    // POINTER CANCEL
    // =================================================

    gallery.addEventListener(
        "pointercancel",
        (event) => {

            finalizarArrastre(
                event
            );

        }
    );


    // =================================================
    // MOUSE ENTER
    // =================================================

    gallery.addEventListener(
        "mouseenter",
        () => {

            pausarGaleria();

        }
    );


    // =================================================
    // MOUSE LEAVE
    // =================================================

    gallery.addEventListener(
        "mouseleave",
        () => {

            if (!galleryDragging) {

                reanudarGaleria();

            }

        }
    );


    // =================================================
    // TOUCH START
    // =================================================

    gallery.addEventListener(
        "touchstart",
        () => {

            pausarGaleria();

        },
        {
            passive: true
        }
    );


    // =================================================
    // TOUCH END
    // =================================================

    gallery.addEventListener(
        "touchend",
        () => {

            reanudarGaleria();

        },
        {
            passive: true
        }
    );

}


// =====================================================
// FINALIZAR ARRASTRE
// =====================================================

function finalizarArrastre(
    event
) {

    galleryDragging =
        false;

    gallery.classList.remove(
        "is-dragging"
    );


    try {

        gallery.releasePointerCapture(
            event.pointerId
        );

    } catch (error) {

        // Ya estaba liberado.

    }


    reanudarGaleria();


    setTimeout(
        () => {

            galleryMoved =
                false;

        },
        80
    );

}


// =====================================================
// INICIALIZAR GALERÍA
// =====================================================

if (gallery) {

    crearGaleria();

}

/* =========================================
   CONFIGURACIÓN GENERAL
========================================= */

const numeroWhatsApp = "56962327819";
let mensajeWhatsAppPendiente = "";


/* =========================================
   CONFIGURACIÓN DE DISPONIBILIDAD
========================================= */

/*
    FECHA DE LA PRÓXIMA COSECHA

    Formato:
    Año-Mes-Día Hora

    Ejemplo:
    2026-08-28T08:00:00

    Puedes cambiar esta fecha cuando quieras.
*/

const fechaProximaCosecha =
    new Date("2026-08-24T08:00:00");


/*
    STOCK
    OJO: CUANDO COLOQUE EL DIA QUE SE SACARA LAS FRUTILLAS , 
         EL MISMO DIA QUE SE SACA FRUTILLAS,
         ME PERMITIRA MODIFCAR EL STOCK ,
         NINGUN OTRO DIA 

*/

const productosConfig = {

    grandes: {
        stock: 12
    },

    kilo: {
        stock: 23
    },

    chicas: {
        stock: 34
    }

};
/*   EN =    const productosConfig = {
null = cantidad todavía desconocida.

    Cuando sepas cuánto salió de la cosecha,
    cambia null por la cantidad disponible.

    Ejemplo:

    stock: 8

    significa que hay 8 unidades disponibles.
*/


/* =========================================
   ICONOS
========================================= */

const ICONO_CARRITO =
    String.fromCodePoint(0x1F6D2);

const ICONO_CLIENTE =
    String.fromCodePoint(0x1F464);

const ICONO_UBICACION =
    String.fromCodePoint(0x1F4CD);

const ICONO_PRODUCTOS =
    String.fromCodePoint(0x1F4E6);

const ICONO_FRUTILLA =
    String.fromCodePoint(0x1F353);

const ICONO_DINERO =
    String.fromCodePoint(0x1F4B0);


/* =========================================
   FORMATEAR PESOS CHILENOS
========================================= */

function formatoPesos(valor) {

    return `$${valor.toLocaleString("es-CL")}`;

}


/* =========================================
   OBTENER PRODUCTOS
========================================= */

function obtenerProductos() {

    const selectores =
        document.querySelectorAll(".cantidad");

    const productos = [];

    selectores.forEach(selector => {

        const cantidad =
            parseInt(selector.value) || 0;

        const producto =
            selector.dataset.producto;

        const precio =
            parseInt(selector.dataset.precio);

        const subtotal =
            cantidad * precio;

        const tarjeta =
            selector.closest(".box");

        const productoId =
            tarjeta.dataset.productoId;

        const stock =
            productosConfig[productoId]?.stock ?? null;

        productos.push({

            producto: producto,
            cantidad: cantidad,
            precio: precio,
            subtotal: subtotal,
            selector: selector,
            productoId: productoId,
            stock: stock

        });

    });

    return productos;

}


/* =========================================
   ELIMINAR PRODUCTO
========================================= */

function eliminarProducto(index) {

    const selectores =
        document.querySelectorAll(".cantidad");

    if (!selectores[index]) {
        return;
    }

    selectores[index].value = "0";

    actualizarCompra();

}


/* =========================================
   ACTUALIZAR RESUMEN
========================================= */

function actualizarCompra() {

    const productos =
        obtenerProductos();

    const resumen =
        document.getElementById("resumen-productos");

    const totalGeneral =
        document.getElementById("total-general");

    let total = 0;

    let productosSeleccionados = 0;

    resumen.innerHTML = "";


    const tarjetas =
        document.querySelectorAll(".box");


    productos.forEach((producto, index) => {

        const subtotalElemento =
            tarjetas[index].querySelector(".subtotal");


        subtotalElemento.textContent =
            `Subtotal: ${formatoPesos(producto.subtotal)}`;


        if (producto.cantidad > 0) {

            productosSeleccionados++;

            total += producto.subtotal;


            const linea =
                document.createElement("div");

            linea.classList.add(
                "producto-resumen"
            );


            linea.innerHTML = `

                <div class="producto-resumen-info">

                    <strong>
                        ${producto.producto}
                    </strong>

                    <span>
                        Cantidad: ${producto.cantidad}
                    </span>

                    <span>
                        Precio unitario:
                        ${formatoPesos(producto.precio)}
                    </span>

                    <span>
                        Subtotal:
                        ${formatoPesos(producto.subtotal)}
                    </span>

                </div>

                <button
                    type="button"
                    class="btn-eliminar"
                    onclick="eliminarProducto(${index})"
                >
                    🗑️ Eliminar
                </button>

            `;

            resumen.appendChild(linea);

        }

    });


    if (productosSeleccionados === 0) {

        resumen.innerHTML = `
            <p>
                No has seleccionado productos.
            </p>
        `;

    }


    totalGeneral.textContent =
        formatoPesos(total);

}


/* =========================================
   ACTUALIZAR DISPONIBILIDAD
========================================= */

function actualizarDisponibilidad() {

    const ahora =
        new Date();

    const cosechaRealizada =
        ahora >= fechaProximaCosecha;


    /*
        Actualizar aviso general
    */

    const avisoCosecha =
        document.getElementById("aviso-cosecha");


    if (!cosechaRealizada) {

        avisoCosecha.textContent =
            `Disponible el ${formatearFechaCosecha()}`;

    } else {

        avisoCosecha.textContent =
            "Cosecha realizada";

    }


    /*
        Actualizar cada producto
    */

    document
        .querySelectorAll(".box")
        .forEach(tarjeta => {

            const productoId =
                tarjeta.dataset.productoId;

            const config =
                productosConfig[productoId];

            const select =
                tarjeta.querySelector(".cantidad");

            const estado =
                tarjeta.querySelector(".estado-producto");

            const estadoIcono =
                tarjeta.querySelector(".estado-icono");

            const estadoTexto =
                tarjeta.querySelector(".estado-texto");

            const stockInfo =
                tarjeta.querySelector(".stock-info");


            /*
                TODAVÍA NO LLEGA LA COSECHA
            */

            if (!cosechaRealizada) {

                select.disabled = true;

                select.innerHTML = `
                    <option value="0">
                        0
                    </option>
                `;

                estado.className =
                    "estado-producto estado-proximo";

                estadoIcono.textContent =
                    "🕐";

                estadoTexto.textContent =
                    "Próxima cosecha";

                stockInfo.textContent =
                    `Disponible el ${formatearFechaCorta()}`;

                return;
            }


            /*
                LLEGÓ LA FECHA,
                PERO STOCK DESCONOCIDO
            */

            if (config.stock === null) {

                select.disabled = true;

                select.innerHTML = `
                    <option value="0">
                        0
                    </option>
                `;

                estado.className =
                    "estado-producto estado-confirmar";

                estadoIcono.textContent =
                    "🟠";

                estadoTexto.textContent =
                    "Stock por confirmar";

                stockInfo.textContent =
                    "Esperando confirmación de cosecha";

                return;
            }


            /*
                STOCK = 0
            */

            if (config.stock <= 0) {

                select.disabled = true;

                select.innerHTML = `
                    <option value="0">
                        0
                    </option>
                `;

                estado.className =
                    "estado-producto estado-agotado";

                estadoIcono.textContent =
                    "🔴";

                estadoTexto.textContent =
                    "Agotado";

                stockInfo.textContent =
                    "Sin unidades disponibles";

                return;
            }


            /*
                PRODUCTO DISPONIBLE
            */

            select.disabled = false;

            const cantidadActual =
                parseInt(select.value) || 0;


            select.innerHTML = "";


            for (
                let i = 0;
                i <= config.stock;
                i++
            ) {

                const option =
                    document.createElement("option");

                option.value = i;

                option.textContent = i;

                select.appendChild(option);

            }


            /*
                Mantener cantidad seleccionada
                si todavía existe.
            */

            if (
                cantidadActual <= config.stock
            ) {

                select.value =
                    cantidadActual;

            } else {

                select.value =
                    config.stock;

            }


            estado.className =
                "estado-producto estado-disponible";

            estadoIcono.textContent =
                "🟢";

            estadoTexto.textContent =
                "Disponible";

            stockInfo.textContent =
                `Stock disponible: ${config.stock}`;

        });


    actualizarCompra();

}


/* =========================================
   FORMATEAR FECHA COMPLETA
========================================= */

function formatearFechaCosecha() {

    return fechaProximaCosecha.toLocaleDateString(
        "es-CL",
        {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
    );

}


/* =========================================
   FORMATEAR FECHA CORTA
========================================= */

function formatearFechaCorta() {

    return fechaProximaCosecha.toLocaleDateString(
        "es-CL",
        {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
    );

}


/* =========================================
   ENVIAR PEDIDO A WHATSAPP
========================================= */

function enviarWhatsApp() {

    const nombreInput =
        document.getElementById("nombre");

    const ubicacionInput =
        document.getElementById("ubicacion");


    const nombre =
        nombreInput.value.trim();

    const ubicacion =
        ubicacionInput.value.trim();


    /*
        VALIDAR NOMBRE
    */

    if (!nombre) {

        alert(
            "Por favor, ingresa tu nombre."
        );

        nombreInput.focus();

        return;
    }


    /*
        VALIDAR UBICACIÓN
    */

    if (!ubicacion) {

        alert(
            "Por favor, ingresa tu ubicación."
        );

        ubicacionInput.focus();

        return;
    }


    /*
        OBTENER PRODUCTOS
    */

    const productos =
        obtenerProductos();


    const productosSeleccionados =
        productos.filter(
            producto =>
                producto.cantidad > 0
        );


    /*
        VALIDAR PRODUCTOS
    */

    if (
        productosSeleccionados.length === 0
    ) {

        alert(
            "Por favor, selecciona al menos un producto."
        );

        return;
    }


    /*
        VALIDAR STOCK
    */

    for (
        const producto
        of productosSeleccionados
    ) {

        if (
            producto.stock === null
        ) {

            alert(
                `El stock de "${producto.producto}" todavía no ha sido confirmado.`
            );

            return;
        }


        if (
            producto.cantidad >
            producto.stock
        ) {

            alert(
                `La cantidad disponible de "${producto.producto}" es de ${producto.stock} unidades.`
            );

            actualizarDisponibilidad();

            return;
        }

    }


    /*
        CALCULAR TOTAL
    */

    let total = 0;


    productosSeleccionados.forEach(
        producto => {

            total += producto.subtotal;

        }
    );


    /*
        CREAR MENSAJE
    */

    let mensaje = "";


    mensaje +=
        `${ICONO_CARRITO} *NUEVA COMPRA*\n\n`;


    mensaje +=
        `${ICONO_CLIENTE} *Cliente:* ${nombre}\n`;


    mensaje +=
        `${ICONO_UBICACION} *Ubicación:* ${ubicacion}\n\n`;


    mensaje +=
        `${ICONO_PRODUCTOS} *PRODUCTOS:*\n\n`;


    productosSeleccionados.forEach(
        producto => {

            mensaje +=
                `${ICONO_FRUTILLA} *${producto.producto}*\n`;

            mensaje +=
                `Cantidad: ${producto.cantidad}\n`;

            mensaje +=
                `Precio unitario: ${formatoPesos(producto.precio)}\n`;

            mensaje +=
                `Subtotal: ${formatoPesos(producto.subtotal)}\n\n`;

        }
    );


    mensaje +=
        "━━━━━━━━━━━━━━━━━━\n";


    mensaje +=
        `${ICONO_DINERO} *TOTAL FINAL: ${formatoPesos(total)}*\n`;


    mensaje +=
        "━━━━━━━━━━━━━━━━━━";


    /* esto se ocultooo
        URL WHATSAPP const url =
        `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;


    window.location.href =
        url;
    */



   /*
    GUARDAR MENSAJE
*/
/* =========================================
  inicio modificasion 
========================================= */
mensajeWhatsAppPendiente = mensaje;


/*
    MOSTRAR AVISO DE STOCK
*/

const modal =
    document.getElementById("modal-stock");

modal.classList.add("activo");
   

}

/* =========================================
   CONTINUAR CON WHATSAPP
========================================= */

function continuarWhatsApp() {

    if (!mensajeWhatsAppPendiente) {
        return;
    }


    const url =
        `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
            mensajeWhatsAppPendiente
        )}`;


    window.location.href = url;

}

/* =========================================
modificasion 
========================================= */








/* =========================================
   CAMBIOS EN CANTIDAD
========================================= */

document
    .querySelectorAll(".cantidad")
    .forEach(selector => {

        selector.addEventListener(
            "change",
            actualizarCompra
        );

    });


/* =========================================
   INICIALIZAR
========================================= */

actualizarDisponibilidad();


/*
    Revisar disponibilidad cada minuto.

    Esto permite que, si alguien tiene
    la página abierta durante el viernes,
    el estado se actualice automáticamente.
*/

setInterval(
    actualizarDisponibilidad,
    60000
);

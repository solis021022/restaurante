let listaOrdenes = JSON.parse(localStorage.getItem("ordenes")) || [];
let platosGuardados = JSON.parse(localStorage.getItem("platos")) || [];
var inputPlato = document.querySelector("#iPlato");
var inputPresio = document.querySelector("#iPresio");
var agregarPlato = document.querySelector("#agregarPlato");
var divPlatos = document.querySelector("#platos");
var divOrden = document.querySelector("#orden");
var eliminarOrden = document.querySelector("#cancelarOrden");
var guardarO = document.querySelector("#guardarOrden");

agregarPlato.onclick = () => {
  mostrarMenu();
};
guardarO.onclick = () => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡Confirmarás guardar esta orden!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, guardar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      guardarOrden();
    }
  });
  cancelarOrden();
};

eliminarOrden.onclick = cancelarOrden;

document
  .querySelector("#editar")
  .addEventListener("show.bs.modal", cargarPlatosEnSelect);

document.querySelector("#platosEditar").onchange =
  mostrarDetallesPlatoSeleccionado;

document.querySelector("#confirmarPlato").onclick = guardarCambiosPlato;
document.querySelector("#eliminarPlato").onclick = eliminarPlatos;

function mostrarMenu() {
  var plato = inputPlato.value;
  var precio = inputPresio.value;

  if (plato.trim() === "" || precio.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "CAMPOS VACIOS",
      text: "Por favor llena todos los campos",
    });
  } else {
    var listaP = document.createElement("li");
    listaP.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-start",
      "list-group-item-hover"
    );
    listaP.innerHTML = `
            <div class="fw-bold">${plato}</div> 
            <span class="badge text-bg-info rounded-pill">$ ${precio}</span>
           
        `;
    listaP.onclick = function () {
      pedirPlato(plato, precio);
      actualizarTotal();
    };

    divPlatos.appendChild(listaP);

    guardarP(plato, precio);

    inputPlato.value = "";
    inputPresio.value = "";
  }
}

function guardarP(plato, precio) {
  platosGuardados.push({ plato: plato, precio: precio });
  localStorage.setItem("platos", JSON.stringify(platosGuardados));
}

function cargarPlato() {
  let platosGuardados = JSON.parse(localStorage.getItem("platos")) || [];

  platosGuardados.forEach(function (item) {
      var listaP = document.createElement("li");
      listaP.classList.add(
          "list-group-item",
          "d-flex",
          "justify-content-between",
          "align-items-start",
          "list-group-item-hover" 
      );
      listaP.innerHTML = `
          <div class="fw-bold">${item.plato}</div> 
          <span class="badge text-bg-info rounded-pill">$ ${item.precio}</span>
      `;
      listaP.onclick = function () {
          pedirPlato(item.plato, item.precio);
          actualizarTotal();
      };
      divPlatos.appendChild(listaP);
  });
}
function actualizarSubtotal() {
  var tbody = divOrden.querySelector("tbody");
  var subtotal = 0;

  let platosGuardados = JSON.parse(localStorage.getItem("platos")) || [];

  for (let row of tbody.children) {
    var platoNombre = row.querySelector(".platoNombre").textContent;
    var cantidad = parseInt(row.querySelector(".platoCantidad").textContent);

    let platoGuardado = platosGuardados.find((p) => p.plato === platoNombre);
    if (platoGuardado) {
      var precioP = parseFloat(platoGuardado.precio);
      subtotal += cantidad * precioP;
    }
  }

  document.querySelector("#subtotal").textContent = `$${subtotal.toFixed(2)}`;
}

function pedirPlato(plato, precio) {
  if (!divOrden.querySelector("table")) {
      var table = document.createElement("table");
      table.classList.add("table", "table-striped");
      table.innerHTML = `
          <thead>
              <tr>
                  <th>Plato</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Opciones</th>
              </tr>
          </thead>
          <tbody></tbody>
      `;
      divOrden.appendChild(table);
  }

  var tbody = divOrden.querySelector("tbody");

  var filaExistente = null;
  for (let row of tbody.children) {
      if (row.querySelector(".platoNombre").textContent === plato) {
          filaExistente = row;
          break;
      }
  }
  if (filaExistente) {
      var cantidadPla = filaExistente.querySelector(".platoCantidad");
      var precioPla = filaExistente.querySelector(".platoPrecio");

      var nuevaCantidad = parseInt(cantidadPla.textContent) + 1;
      cantidadPla.textContent = nuevaCantidad;

      var precioUnitario = parseFloat(precio.replace('$', ''));
      precioPla.textContent = `$${(nuevaCantidad * precioUnitario).toFixed(2)}`;
  } else {
      var fil = document.createElement("tr");
      fil.innerHTML = `
          <td class="platoNombre">${plato}</td>      
          <td class="platoPrecio">$${precio}</td>
          <td class="platoCantidad">1</td>
          <td><button type="button" class="btn btn-danger btn-eliminar"><i class="bi bi-trash"></i></button></td>
      `;
      
      fil.querySelector(".btn-eliminar").onclick = function() {
          eliminarPlato(fil);
      };

      tbody.appendChild(fil);
  }
  actualizarSubtotal(); 
}

function eliminarPlato(fila) {
  let platoNombre = fila.querySelector(".platoNombre").textContent;
  let platosGuardados = JSON.parse(localStorage.getItem("platos")) || [];

  

  platosGuardados = platosGuardados.filter(plato => plato.plato !== platoNombre);

  localStorage.setItem("platos", JSON.stringify(platosGuardados));

  fila.remove();
  actualizarSubtotal();
}


function actualizarPropina(porcentaje) {
  var subtotalTexto = document.querySelector("#subtotal").textContent;
  var subtotal = parseFloat(subtotalTexto.replace("$", "")) || 0;

  var propina = subtotal * (porcentaje / 100);
  document.querySelector("#propina").textContent = `$${propina.toFixed(2)}`;

  actualizarTotal();
}

function actualizarTotal() {
  var subtotalT = document.querySelector("#subtotal").textContent;
  var subtotal = parseFloat(subtotalT.replace("$", "")) || 0;

  var propinaT = document.querySelector("#propina").textContent;
  var propina = parseFloat(propinaT.replace("$", "")) || 0;

  var total = subtotal + propina;
  document.querySelector("#total").textContent = `$${total.toFixed(2)}`;
}

document.querySelector("#propina10").onclick = () => actualizarPropina(10);
document.querySelector("#propina20").onclick = () => actualizarPropina(20);
document.querySelector("#propina30").onclick = () => actualizarPropina(30);
function cargarPlatosEnSelect() {
  let platosGuardados = JSON.parse(localStorage.getItem("platos")) || [];
  let selectPlatos = document.querySelector("#platosEditar");

  selectPlatos.innerHTML = "";

  platosGuardados.forEach(function (plato, index) {
    let option = document.createElement("option");
    option.value = index;
    option.textContent = plato.plato;
    selectPlatos.appendChild(option);
  });
}

function mostrarDetallesPlatoSeleccionado() {
  let selectPlatos = document.querySelector("#platosEditar");
  let platosGuardados = JSON.parse(localStorage.getItem("platos")) || [];
  let indiceSeleccionado = selectPlatos.value;

  if (indiceSeleccionado !== "") {
    document.querySelector("#editarPlato").value =
      platosGuardados[indiceSeleccionado].plato;
    document.querySelector("#editarPresio").value =
      platosGuardados[indiceSeleccionado].precio;
  }
}

function guardarCambiosPlato() {
  let selectPlatos = document.querySelector("#platosEditar");
  let indiceSeleccionado = selectPlatos.value;
  let platosGuardados = JSON.parse(localStorage.getItem("platos")) || [];

  if (indiceSeleccionado !== "") {
    platosGuardados[indiceSeleccionado].plato =
      document.querySelector("#editarPlato").value;
    platosGuardados[indiceSeleccionado].precio =
      document.querySelector("#editarPresio").value;

    localStorage.setItem("platos", JSON.stringify(platosGuardados));

    actualizarListaPlatos();

    Swal.fire({
      icon: "success",
      title: "Plato actualizado",
      text: "El plato ha sido actualizado correctamente",
    });
  }
}
function eliminarPlatos() {
  let selectPlatos = document.querySelector("#platosEditar");
  let indiceSeleccionado = selectPlatos.value;
  let platosGuardados = JSON.parse(localStorage.getItem("platos")) || [];

  if (indiceSeleccionado !== "") {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Eliminarás este plato!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        platosGuardados.splice(indiceSeleccionado, 1);

        localStorage.setItem("platos", JSON.stringify(platosGuardados));

        actualizarListaPlatos();
        

        Swal.fire({
          icon: "success",
          title: "Plato eliminado",
          text: "El plato ha sido eliminado correctamente",
        });
      }
    });
  }

}
function cancelarOrden() {
  let tbody = divOrden.querySelector("tbody");

  if (tbody && tbody.children.length === 0) {
    Swal.fire({
      icon: "info",
      title: "No hay platos",
      text: "No hay platos en la orden para cancelar.",
    });
    return;
  }

  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡Cancelarás la orden y todos los datos serán eliminados!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, cancelar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      if (tbody) {
        tbody.innerHTML = "";
      }

      document.querySelector("#subtotal").textContent = "$0.00";
      document.querySelector("#propina").textContent = "$0.00";
      document.querySelector("#total").textContent = "$0.00";

      localStorage.removeItem("ordenes");

      Swal.fire({
        icon: "info",
        title: "Orden cancelada",
        text: "La orden ha sido cancelada y todos los datos han sido eliminados.",
      });
    }
  });
}

function actualizarListaPlatos() {
  let divPlatos = document.querySelector("#platos");
  divPlatos.innerHTML = '';
  cargarPlato();
}

window.onload = cargarPlato;

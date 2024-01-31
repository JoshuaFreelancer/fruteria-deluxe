import React, { useState } from "react";
import { Link } from "react-router-dom";

class Fruta {
  constructor(id, nombre, imagen, cantidad, precio) {
    this.id = id;
    this.nombre = nombre;
    this.imagen = imagen;
    this.cantidad = cantidad;
    this.precio = precio;
    this.total = cantidad * precio;
  }
}

const Fruits = ({ agregarAlHistorial }) => {
  const [frutas, setFrutas] = useState(() => {
    const storedFrutas = JSON.parse(localStorage.getItem("frutas"));

    if (storedFrutas && storedFrutas.length > 0) {
      return storedFrutas.map((fruta) => ({
        ...fruta,
        precio: parseFloat(fruta.precio.toFixed(2)),
        total: fruta.cantidad * parseFloat(fruta.precio.toFixed(2)),
      }));
    } else {
      const defaultFrutas = [
        new Fruta(1, "Plátano", "/assets/images/Fruta_Platano.png", 10, 1.5),
        new Fruta(2, "Manzana", "/assets/images/Fruta_Manzana.png", 15, 2.0),
        new Fruta(3, "Pera", "/assets/images/Fruta_Pera.png", 8, 1.8),
      ];

      localStorage.setItem("frutas", JSON.stringify(defaultFrutas));
      return defaultFrutas.map((fruta) => ({
        ...fruta,
        precio: parseFloat(fruta.precio.toFixed(2)),
        total: fruta.cantidad * parseFloat(fruta.precio.toFixed(2)),
      }));
    }
  });

  const actualizarFrutasLocalStorage = (nuevasFrutas) => {
    localStorage.setItem("frutas", JSON.stringify(nuevasFrutas));
  };

  // Estado para manejar los datos de la nueva fruta a agregar
  const [nuevaFruta, setNuevaFruta] = useState({
    nombre: "",
    cantidad: 0,
    precio: 0,
    imagen: "",
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [filtrarPorPrecio, setFiltrarPorPrecio] = useState(false);
  const [filtrarPorCantidad, setFiltrarPorCantidad] = useState(false);
  const [cantidadMaxima, setCantidadMaxima] = useState(100);
  const [alerta, setAlerta] = useState(null);

  const mostrarAlerta = (tipo, mensaje) => {
    setAlerta({ tipo, mensaje });
    setTimeout(() => {
      setAlerta(null);
    }, 5000);
  };

  const eliminarFruta = (id) => {
    const frutaEliminada = frutas.find((fruta) => fruta.id === id);
    const nuevasFrutas = frutas.filter((fruta) => fruta.id !== id);
    setFrutas(nuevasFrutas);
    actualizarFrutasLocalStorage(nuevasFrutas);
  
    const accion = `Eliminó la fruta "${frutaEliminada.nombre}" del inventario.`;
    agregarAlHistorial(accion);
  
    mostrarAlerta(
      "error",
      `Fruta "${frutaEliminada.nombre}" eliminada con éxito.`
    );
  };
  
  const modificarCantidad = (id, cantidadDelta) => {
    const nuevasFrutas = frutas.map((fruta) => ({
      ...fruta,
      cantidad:
        fruta.id === id
          ? Math.max(fruta.cantidad + cantidadDelta, 0)
          : fruta.cantidad,
      total:
        fruta.id === id
          ? Math.max(fruta.cantidad + cantidadDelta, 0) * fruta.precio
          : fruta.total,
    }));

    setFrutas(nuevasFrutas);
    actualizarFrutasLocalStorage(nuevasFrutas);

    const accion = `Modificó la cantidad de "${
      frutas.find((f) => f.id === id).nombre
    }" a ${frutas.find((f) => f.id === id).cantidad + cantidadDelta}`;
    agregarAlHistorial(accion);
  };

  const modificarPrecio = (id, precioDelta) => {
    setFrutas((prevFrutas) =>
      prevFrutas.map((fruta) => ({
        ...fruta,
        precio:
          fruta.id === id
            ? Math.max(fruta.precio + precioDelta, 0)
            : fruta.precio,
        total:
          fruta.id === id
            ? fruta.cantidad * Math.max(fruta.precio + precioDelta, 0)
            : fruta.total,
      }))
    );

    const accion = `Modificó el precio de "${
      frutas.find((f) => f.id === id).nombre
    }" a $${frutas.find((f) => f.id === id).precio + precioDelta}`;
    agregarAlHistorial(accion);
  };

  const agregarNuevaFruta = () => {
    const nombreValido = /^[a-zA-Z\s]+$/.test(nuevaFruta.nombre);

    if (nombreValido && nuevaFruta.cantidad > 0 && nuevaFruta.precio > 0) {
      const imagen =
        nuevaFruta.imagen.trim() !== ""
          ? nuevaFruta.imagen
          : "/assets/images/Logo_Fruteria_deluxe.png";

      const nuevaFrutaObj = new Fruta(
        frutas.length + 1,
        nuevaFruta.nombre,
        imagen,
        nuevaFruta.cantidad,
        nuevaFruta.precio
      );

      const nuevasFrutas = [...frutas, nuevaFrutaObj];
      setFrutas(nuevasFrutas);
      actualizarFrutasLocalStorage(nuevasFrutas);

      mostrarAlerta(
        "exito",
        `Fruta "${nuevaFruta.nombre}" agregada con éxito.`
      );
      cerrarFormulario();

      const accion = `Agregó la fruta "${nuevaFruta.nombre}" al inventario.`;
      agregarAlHistorial(accion);
    } else {
      if (!nombreValido) {
        mostrarAlerta(
          "error",
          "Por favor, ingresa un nombre de fruta válido (solo letras y espacios)."
        );
      } else {
        mostrarAlerta(
          "error",
          "Por favor, completa todos los campos para agregar una nueva fruta."
        );
      }
    }
  };

  const incrementarCantidad = (id) => modificarCantidad(id, 1);
  const decrementarCantidad = (id) => modificarCantidad(id, -1);
  const incrementarPrecio = (id) => modificarPrecio(id, 0.1);
  const decrementarPrecio = (id) => modificarPrecio(id, -0.1);

  const handleChangePrecio = (e) => setPrecioMinimo(parseFloat(e.target.value));
  const handleChangeCantidad = (e) =>
    setCantidadMinima(parseInt(e.target.value));
  const toggleFiltroPrecio = () => setFiltrarPorPrecio(!filtrarPorPrecio);
  const toggleFiltroCantidad = () => setFiltrarPorCantidad(!filtrarPorCantidad);
  const limpiarFiltros = () => {
    setFiltro("");
    setFiltrarPorPrecio(false);
    setFiltrarPorCantidad(false);
    setPrecioMinimo(0);
    setPrecioMaximo(100);
    setCantidadMinima(0);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setNuevaFruta({ nombre: "", cantidad: 0, precio: 0, imagen: "" });
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    setFrutas((prevFrutas) =>
      prevFrutas.map((fruta) => ({
        ...fruta,
        cantidad: fruta.id === id ? Math.max(nuevaCantidad, 0) : fruta.cantidad,
        total:
          fruta.id === id
            ? Math.max(nuevaCantidad, 0) * fruta.precio
            : fruta.total,
      }))
    );
  };

  const cambiarPrecio = (id, nuevoPrecio) => {
    setFrutas((prevFrutas) =>
      prevFrutas.map((fruta) => ({
        ...fruta,
        precio: fruta.id === id ? Math.max(nuevoPrecio, 0) : fruta.precio,
        total:
          fruta.id === id
            ? fruta.cantidad * Math.max(nuevoPrecio, 0)
            : fruta.total,
      }))
    );
  };

  const filtrarFrutas = () => {
    return frutas.filter(
      (fruta) =>
        fruta.nombre.toLowerCase().includes(filtro.toLowerCase()) &&
        (!filtrarPorPrecio ||
          (fruta.precio >= precioMinimo && fruta.precio <= precioMaximo)) &&
        (!filtrarPorCantidad ||
          (fruta.cantidad >= cantidadMinima &&
            fruta.cantidad <= cantidadMaxima))
    );
  };

  const [precioMinimo, setPrecioMinimo] = useState(0);
  const [precioMaximo, setPrecioMaximo] = useState(100);
  const [cantidadMinima, setCantidadMinima] = useState(0);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4">Inventario de Frutas</h1>
      <div className="mb-4">
        <label className="block">
          Buscar:
          <input
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="mt-1 p-2 border rounded"
            placeholder="Buscar frutas por nombre"
          />
        </label>
        <div className="flex mt-2">
          <button
            className={`bg-gray-300 p-2 rounded ml-2 ${
              filtrarPorPrecio ? "bg-gray-500" : ""
            }`}
            onClick={toggleFiltroPrecio}
          >
            Filtrar por Precio
          </button>
          {filtrarPorPrecio && (
            <div className="flex items-center ml-2">
              <label className="block mr-2">
                Min:
                <input
                  type="number"
                  step="0.1"
                  value={precioMinimo}
                  onChange={handleChangePrecio}
                  className="mt-1 p-1 border rounded"
                />
              </label>
              <label className="block mr-2">
                Max:
                <input
                  type="number"
                  step="0.1"
                  value={precioMaximo}
                  onChange={(e) => setPrecioMaximo(parseFloat(e.target.value))}
                  className="mt-1 p-1 border rounded"
                />
              </label>
            </div>
          )}
          <button
            className={`bg-gray-300 p-2 rounded ml-2 ${
              filtrarPorCantidad ? "bg-gray-500" : ""
            }`}
            onClick={toggleFiltroCantidad}
          >
            Filtrar por Cantidad
          </button>
          {filtrarPorCantidad && (
            <div className="flex items-center ml-2">
              <label className="block mr-2">
                Min:
                <input
                  type="number"
                  value={cantidadMinima}
                  onChange={handleChangeCantidad}
                  className="mt-1 p-1 border rounded"
                />
              </label>
              <label className="block mr-2">
                Max:
                <input
                  type="number"
                  value={cantidadMaxima}
                  onChange={(e) => setCantidadMaxima(parseInt(e.target.value))}
                  className="mt-1 p-1 border rounded"
                />
              </label>
            </div>
          )}
          <button
            className="bg-gray-300 p-2 rounded ml-2"
            onClick={limpiarFiltros}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {alerta && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 ${
            alerta.tipo === "exito" ? "bg-green-300" : "bg-red-300"
          } rounded-md shadow-md z-50`}
        >
          <p
            className={`${
              alerta.tipo === "exito" ? "text-green-800" : "text-red-800"
            }`}
          >
            {alerta.mensaje}
          </p>
        </div>
      )}

      {filtrarFrutas().length === 0 ? (
        <p>No hay frutas en el inventario.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrarFrutas().map((fruta) => (
            <div key={fruta.id} className="bg-white p-4 shadow-md rounded-md">
              <img
                src={fruta.imagen}
                alt={fruta.nombre}
                className="w-3/5 h-48 object-center mx-10 mb-3 rounded-lg"
              />

              <h3 className="text-xl font-semibold mb-1">{fruta.nombre}</h3>
              <p>Precio por unidad: ${fruta.precio.toFixed(2)}</p>
              <p>Cantidad disponible: {fruta.cantidad}</p>
              <p>Total: ${fruta.total.toFixed(2)}</p>
              <div className="flex mt-2">
                <button
                  className="bg-blue-500 text-white p-2 rounded mr-2"
                  onClick={() => incrementarCantidad(fruta.id)}
                >
                  +
                </button>
                <input
                  type="number"
                  value={fruta.cantidad}
                  onChange={(e) =>
                    cambiarCantidad(fruta.id, parseInt(e.target.value))
                  }
                  className="w-16 text-center border rounded"
                />
                <button
                  className="bg-red-500 text-white p-2 rounded ml-2"
                  onClick={() => decrementarCantidad(fruta.id)}
                >
                  -
                </button>
              </div>
              <div className="flex mt-2">
                <button
                  className="bg-green-500 text-white p-2 rounded mr-2"
                  onClick={() => incrementarPrecio(fruta.id)}
                >
                  +
                </button>
                <input
                  type="number"
                  step="0.1"
                  value={fruta.precio}
                  onChange={(e) =>
                    cambiarPrecio(fruta.id, parseFloat(e.target.value))
                  }
                  className="w-16 text-center border rounded"
                />
                <button
                  className="bg-red-500 text-white p-2 rounded ml-2"
                  onClick={() => decrementarPrecio(fruta.id)}
                >
                  -
                </button>
              </div>
              <div className="flex justify-between mt-2">
                <Link
                  to={`/dashboard/inventario/${fruta.id}`}
                  className="text-blue-600 font-semibold"
                >
                  Ver Detalles
                </Link>
                <button
                  onClick={() => eliminarFruta(fruta.id)}
                  className="text-red-600 font-semibold"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {mostrarFormulario ? (
        <div className="bg-gray-100 p-4 rounded-md mt-4">
          <h2 className="text-xl font-semibold mb-2">Agregar Nueva Fruta</h2>
          <label className="block">
            Nombre:
            <input
              type="text"
              value={nuevaFruta.nombre}
              onChange={(e) =>
                setNuevaFruta({ ...nuevaFruta, nombre: e.target.value })
              }
              className="mt-1 p-1 border rounded w-full"
            />
          </label>
          <label className="block mt-2">
            Cantidad:
            <input
              type="number"
              value={nuevaFruta.cantidad}
              onChange={(e) =>
                setNuevaFruta({
                  ...nuevaFruta,
                  cantidad: parseInt(e.target.value),
                })
              }
              className="mt-1 p-1 border rounded w-full"
            />
          </label>
          <label className="block mt-2">
            Precio por unidad:
            <input
              type="number"
              step="0.1"
              value={nuevaFruta.precio}
              onChange={(e) =>
                setNuevaFruta({
                  ...nuevaFruta,
                  precio: parseFloat(e.target.value),
                })
              }
              className="mt-1 p-1 border rounded w-full"
            />
          </label>
          <label className="block mt-2">
            Imagen (URL):
            <input
              type="text"
              value={nuevaFruta.imagen}
              onChange={(e) =>
                setNuevaFruta({ ...nuevaFruta, imagen: e.target.value })
              }
              className="mt-1 p-1 border rounded w-full"
            />
          </label>
          <div className="flex justify-between mt-4">
            <button
              onClick={agregarNuevaFruta}
              className="bg-green-500 text-white p-2 rounded"
            >
              Agregar Fruta
            </button>
            <button
              onClick={cerrarFormulario}
              className="bg-red-500 text-white p-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Agregar Nueva Fruta
        </button>
      )}
    </div>
  );
};

export default Fruits;
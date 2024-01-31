import React, { useState, useEffect } from "react";
import {
  Link,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Fruits from "./Fruits";
import FruitsDetails from "./FruitsDetails";
import Record from "./Record";
import logoImage from "/assets/images/Logo_Fruteria_deluxe.png";
import iconUserImage from "/assets/images/Default_avatar.png"; // Ruta de la imagen del icono de usuario

const Dashboard = () => {
  const [frutas, setFrutas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [usuario, setUsuario] = useState(""); // Estado para almacenar el nombre del usuario
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para controlar si el usuario ha iniciado sesión
  const navigate = useNavigate();
  const location = useLocation();

  // Función para agregar acciones al historial
  const agregarAlHistorial = (accion) => {
    const nuevoHistorial = [...historial, accion];
    setHistorial(nuevoHistorial);
    localStorage.setItem("historial", JSON.stringify(nuevoHistorial));
  };

  // Función para limpiar el historial
  const limpiarHistorial = () => {
    setHistorial([]);
    localStorage.removeItem("historial");
  };

  // Cargar datos desde el almacenamiento local al montar el componente
  useEffect(() => {
    const storedHistorial = JSON.parse(localStorage.getItem("historial")) || [];
    setHistorial(storedHistorial);

    // Verificar si el usuario ha iniciado sesión al cargar el componente
    const storedLoginData = localStorage.getItem("loginFormData");
    if (storedLoginData) {
      const userData = JSON.parse(storedLoginData);
      setUsuario(userData.username);
      setIsLoggedIn(true);
    }
  }, []);

  // Almacenar datos en el almacenamiento local al actualizar historial
  useEffect(() => {
    localStorage.setItem("historial", JSON.stringify(historial));
  }, [historial]);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Limpiar datos de inicio de sesión y redirigir a la ruta base
    localStorage.removeItem("loginFormData");
    setUsuario("");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#E7D5B1]">
      {/* Barra lateral */}
      <div className="bg-white shadow-xl w-1/5 h-3/4 left-10 top-32 absolute rounded-lg ml-30">
        <div className="p-1 flex">
          <div>
            <img src={logoImage} alt="Logo" className="w-full h-44 mr-23" />
          </div>
          <div className="flex items-center">
            <h1 className="absolute left-32 mr-1/2 text-2xl font-bold text-black font-boogaloo">
              Frutas<span className="text-[#6DC585]">Deluxe</span>
            </h1>
          </div>
        </div>
        <nav className="p-2">
          <ul>
            <li>
              <Link
                to="/dashboard"
                className="text-black hover:bg-green-500 hover:bg-opacity-30 py-3 px-4 block rounded uppercase text-center font-boogaloo text-2xl"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/inventario"
                className="text-black uppercase text-center hover:bg-green-500 hover:bg-opacity-30 py-3 rounded px-4 block font-boogaloo text-2xl"
              >
                Frutas
              </Link>
            </li>
            {/* Nuevo enlace para la ruta de historial */}
            <li>
              <Link
                to="/dashboard/historial"
                className="text-black uppercase text-center hover:bg-green-500 hover:bg-opacity-30 py-3 rounded px-4 block font-boogaloo text-2xl"
              >
                Historial
              </Link>
            </li>
          </ul>
        </nav>

        {/* Sección de información del usuario */}
        <div
          className="absolute top-2/3
        left-1/4  flex items-center justify-end pr-4"
        >
          {isLoggedIn && (
            <>
              <div className="flex items-center flex-col">
                <img
                  src={iconUserImage}
                  alt="Icono de usuario"
                  className="w-26 h-20 mb-1"
                />
                <span className="font-boogaloo text-black text-xl mr-2">
                  {usuario}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white py-2 px-4 rounded-md mt-2"
                >
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto ml-80 mt-32">
        {/* Contenido de la página */}
        <div className="p-4 bg-white shadow-xl rounded-lg">
          {/* Utiliza el componente Routes para renderizar el contenido específico de las rutas secundarias */}
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  ¡Bienvenido! Este es el panel de control de Frutas Deluxe.
                  Aquí puedes gestionar tu inventario y ver el historial de
                  acciones.
                </div>
              }
            />
            {/* Utiliza frutas como prop para pasar la lista al componente Fruits */}
            <Route
              path="inventario/*"
              element={
                <Fruits
                  frutas={frutas}
                  agregarAlHistorial={agregarAlHistorial}
                />
              }
            />
            {/* Utiliza frutas como prop para pasar la lista al componente FruitsDetails */}
            <Route
              path="inventario/:id"
              element={<FruitsDetails frutas={frutas} />}
            />
            {/* Nueva ruta para mostrar el componente Record */}
            <Route
              path="historial"
              element={
                <>
                  <Record registros={historial} />
                  {location.pathname === "/dashboard/historial" && (
                    <button
                      onClick={limpiarHistorial}
                      className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md"
                    >
                      Limpiar Historial
                    </button>
                  )}
                </>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

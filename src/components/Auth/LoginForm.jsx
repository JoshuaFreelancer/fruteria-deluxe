import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "/assets/images/Logo_Fruteria_deluxe.png";
import RegistrationForm from "./RegistrationForm.jsx";
import Loader from "../utils/Loader.jsx"; 

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("loginFormData");
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9-_]+$/i.test(value) || value === "") {
      handleInputChange("username", value);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (value.length <= 20 || value === "") {
      handleInputChange("password", value);
    }
  };

  const handleSuccessfulLogin = () => {
    if (!formData.username || !formData.password) {
      setErrorMessage("Por favor, complete todos los campos.");
      setSuccessMessage("");
      return;
    }

    const storedUsers = localStorage.getItem("registrationFormData");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const userExists = users.some(
      (user) =>
        user.username === formData.username &&
        user.password === formData.password
    );

    if (userExists) {
      localStorage.setItem("loginFormData", JSON.stringify(formData));
      setErrorMessage("");
      setSuccessMessage("Inicio de sesión exitoso.");
      setShowLoader(true);

      // Cambiar la ruta después de 2 segundos
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

      // Desactivar el Loader después de 3 segundos
      setTimeout(() => {
        setShowLoader(false);
      }, 3000);
    } else {
      setErrorMessage("Usuario o contraseña incorrectos.");
      setSuccessMessage("");
      setShowLoader(false);
    }
  };

  const toggleForm = () => {
    setShowRegistration((prev) => !prev);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div>
      {showLoader && <Loader />}

      <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 bg-gray-900 rounded-3xl p-8 absolute top-1/2 left-80 transform -translate-x-1/2 -translate-y-1/3 z-10">
        <div className="flex flex-col items-center max-w-sm mx-auto">
          <img className="mx-auto h-1/2 w-1/2" src={logoImage} alt="Logo" />
          <h2 className="relative bottom-7 font-bubblegum text-4xl font-bold text-white underline">
            {showRegistration ? "Registrarse" : "Iniciar Sesión"}
          </h2>
        </div>
        <form>
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4 font-bubblegum">
              🚨 {errorMessage} 🚨
            </p>
          )}

          {successMessage && (
            <p className="text-green-500 text-sm mb-4 font-bubblegum">
              🎉 {successMessage} 🎉
            </p>
          )}

          {showRegistration ? (
            <RegistrationForm />
          ) : (
            <>
              <input
                type="text"
                name="username"
                placeholder="Usuario"
                value={formData.username}
                onChange={handleUsernameChange}
                className="font-boogaloo text-xl w-full bg-gray-950 p-3 rounded border border-white mt-2 mb-4 text-white placeholder-boogaloo"
              />

              <br />

              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handlePasswordChange}
                className="font-boogaloo text-xl w-full bg-gray-950 p-3 rounded border border-white mt-2 mb-4 text-white placeholder-boogaloo"
              />

              <br />
              <button
                type="button"
                className="font-bubblegum text-2xl bg-green-500 w-full
                text-white p-3 rounded mt-2 block"
                onClick={handleSuccessfulLogin}
              >
                Iniciar sesión
              </button>
            </>
          )}

          <button
            type="button"
            className="text-sm text-white mt-4 underline cursor-pointer md:hidden"
            onClick={toggleForm}
          >
            {showRegistration
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

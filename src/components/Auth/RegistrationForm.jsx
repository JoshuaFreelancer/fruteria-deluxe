import React, { useState } from "react";
import logoImage from "/assets/images/Logo_Fruteria_deluxe.png";

const useForm = (initialState, formName) => {
  const [formData, setFormData] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.username || !formData.password) {
      setErrorMessage("Por favor, complete todos los campos.");
      setSuccessMessage("");
      return;
    }

    // Verificar si ya existe un usuario con el mismo nombre
    const storedData = localStorage.getItem("registrationFormData");
    let existingUsers = [];
    if (storedData) {
      try {
        existingUsers = JSON.parse(storedData);
        if (!Array.isArray(existingUsers)) {
          existingUsers = [];
        }
      } catch (error) {
        console.error("Error al parsear datos existentes", error);
        existingUsers = [];
      }
    }

    if (existingUsers.find((user) => user.username === formData.username)) {
      setErrorMessage("Usuario duplicado. Ingrese otro usuario.");
      setSuccessMessage("");
      return;
    }

    // Si llegamos aquí, no hay usuarios duplicados
    setErrorMessage("");
    setSuccessMessage("Registro exitoso");

    // Limpiar el mensaje de error si se envían correctamente los datos
    setFormData({ fullName: "", username: "", password: "" });

    // Guardar datos en localStorage
    const newData = [...existingUsers, formData];
    localStorage.setItem("registrationFormData", JSON.stringify(newData));
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    errorMessage,
    successMessage,
  };
};

const RegistrationForm = () => {
  const {
    formData,
    handleChange,
    handleSubmit,
    errorMessage,
    successMessage,
  } = useForm(
    {
      fullName: "",
      username: "",
      password: "",
    },
    "registration"
  );

  const isAlphanumeric = (input) => /^[a-zA-Z0-9-_]+$/i.test(input);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    if (isAlphanumeric(value) || value === "") {
      handleChange(e);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    // Limitar la longitud de la contraseña a 20 caracteres
    if (value.length <= 20 || value === "") {
      handleChange(e);
    }
  };

  return (
    <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 h-2/3 bg-gray-900 rounded-3xl p-8 absolute top-1/2 right-20 transform -translate-y-1/3 z-10 hidden md:block">
      <div className="flex flex-col items-center w-full h-1/1">
        <img className="mx-auto h-1/2 w-1/2" src={logoImage} alt="Logo" />
        <h2 className="relative bottom-7 font-bubblegum text-4xl font-bold  text-white underline">
          Registrarse
        </h2>
      </div>
      <form onSubmit={handleSubmit}>
        {errorMessage && (
          <p className="text-red-500 text-base mb-4 font-bubblegum">
            🚨 {errorMessage} 🚨
          </p>
        )}
        {successMessage && (
          <p className="text-green-500 text-base mb-4 font-bubblegum">
            🎉 {successMessage} 🎉
          </p>
        )}
        <input
          type="text"
          name="fullName"
          placeholder="Nombre y Apellido"
          value={formData.fullName}
          onChange={(e) => handleChange(e)}
          // Limitar la longitud del nombre a 60 caracteres
          maxLength={60}
          className="font-boogaloo text-xl w-full bg-gray-950 p-3 rounded border border-white mt-2 mb-4 text-white placeholder-boogaloo"
        />
        <br />
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          value={formData.username}
          onChange={(e) => handleUsernameChange(e)}
          // Limitar la longitud del usuario a 20 caracteres
          maxLength={20}
          className="font-boogaloo text-xl w-full bg-gray-950 p-3 rounded border border-white mt-2 mb-4 text-white placeholder-boogaloo"
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={(e) => handlePasswordChange(e)}
          // Limitar la longitud de la contraseña a 20 caracteres
          maxLength={20}
          className="font-boogaloo text-xl w-full bg-gray-950 p-3 rounded border border-white mt-2 mb-8 text-white placeholder-boogaloo"
        />
        <br />
        <button
          type="submit"
          className="font-bubblegum text-2xl bg-green-500 w-2/3
          text-white p-3 rounded mx-auto block"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;

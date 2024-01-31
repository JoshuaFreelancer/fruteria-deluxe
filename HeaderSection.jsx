import React, { Component } from "react";
import backgroundImg from "/assets/images/Background_Register.jpg";

class HeaderSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: {
        primary: "Inicia Sesión o Regístrate",
        secondary: "para comenzar",
      },
    };
  }

  render() {
    const { title } = this.state;

    return (
      <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Fondo de pantalla completa */}
        <div
          className="absolute inset-0 bg-cover bg-center z-[-1]"
          style={{ backgroundImage: `url(${backgroundImg})` }}
        ></div>

        {/* Título */}
        <h1 className="font-bubblegum text-6xl text-green-500 absolute bottom-1/3 left-1/1 p-3 text-center relative z-10 bg-white bg-opacity-75 sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl">
          <span className="border-3 border-black p-3 inline-block drop-shadow-[0_3.2px_1.2px_rgba(0,0,0,0.8)]">
            {title.primary}
          </span>
          <br />
          <span className="border-3 border-black p-3 inline-block drop-shadow-[0_3.2px_.2px_rgba(0,0,0,0.8)]">
            {title.secondary}
          </span>
        </h1>
      </div>
    );
  }
}

export default HeaderSection;

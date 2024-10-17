"use client";
import React from "react";
import Navegador from "@/components/Nav";
import LookPayN from "../../../public/images/PostLogo5.webp";

import BloqueInfo from "@/components/aboutBox";
import { IOption } from "@/components/Nav";
import logo from "../../../public/images/PostLogo5.webp";

function SobreNosotros() {
  const options: IOption[] = [
    { label: "Iniciar sesión", redirect: "/", type: "option" },
  ];
  return (
    <div className="bg-salte900">
      <Navegador options={options} imageRedirect="/" />

      <main className="bg-slate-900 h-max  py-6 justify-center">
        <div className="container px-6 py-16 justify-center flex mx-auto">
          <div className="w-1/2 ">
            <h1 className="text-blue-500 text-center font-bold text-3xl my-8">
              Sobre Nosotros
            </h1>
            <p className="text-justify">
              Pos system un sistema de facturación electrónica innovador y
              eficiente para simplificar el proceso de generación y gestión de
              facturas. Nuestra plataforma te permite crear y enviar facturas de
              forma rápida y segura, eliminando la necesidad de papel y
              optimizando la forma en que llevas tus registros financieros. Con
              nuestra aplicación, podrás llevar un control preciso de tus
              transacciones, ahorrar tiempo y contribuir al cuidado del medio
              ambiente.
            </p>
            <p className="text-justify">
              En Pos System, nos comprometemos a brindarte una experiencia de
              facturación electrónica sin complicaciones. Nuestro sistema
              intuitivo y fácil de usar está diseñado para adaptarse a las
              necesidades de pequeñas y medianas empresas, autónomos y
              emprendedores. Además de generar facturas, también ofrecemos
              funciones adicionales, como seguimiento de pagos, reportes
              financieros y almacenamiento seguro de datos. Únete a nosotros y
              descubre cómo simplificar y agilizar tu proceso de facturación con
              nuestra aplicación de vanguardia.
            </p>
          </div>
          <div className="w-1/2">
            <img className="m-16 " src={LookPayN.src} alt="nosotros" />
          </div>
        </div>
      </main>
      <section className="bg-slate-700 p-6">
        <h2 className="p-6 font-bold text-center text-3xl mb-8">
          {" "}
          ¿Por qué facturar con nosotros?
        </h2>

        <div className="flex gap-8 justify-evenly">
          <BloqueInfo
            titulo="Eficacia y rapidez"
            icon="pi pi-spin pi-cog"
            texto="Nuestra aplicación de facturación electrónica te permite generar facturas de manera ágil y eficiente. Con unos pocos clics, podrás crear y enviar facturas profesionales, ahorrando tiempo y simplificando tu proceso de facturación."
          />

          <BloqueInfo
            titulo="Cumplimiento normativo"
            icon="pi pi-check-circle"
            texto=" Nos aseguramos de que nuestras plantillas de factura cumplan con las regulaciones y requisitos fiscales vigentes. Podrás generar facturas válidas legalmente, evitando posibles errores y sanciones por incumplimiento normativo."
          />

          <BloqueInfo
            titulo="Registro de pagos"
            icon="pi pi-dollar"
            texto="Nuestra plataforma te permite llevar un seguimiento preciso de los pagos realizados. Podrás registrar los pagos recibidos y tener un control claro de los pagos, lo que facilita la gestión de tus finanzas y mejora tu flujo de efectivo."
          />

          <BloqueInfo
            titulo="Almacenamiento seguro"
            icon="pi pi-cloud"
            texto=" Olvídate de los problemas de almacenamiento y respaldo de tus facturas. Con nuestra aplicación, tus facturas estarán almacenadas de forma segura en la nube, accesibles en cualquier momento y desde cualquier dispositivo. "
          />
        </div>
      </section>

      <footer className=" bg-jair h-max mt-2">
        <div className="container flex flex-col items-center justify-between p-6 mx-auto space-y-4 sm:space-y-0 sm:flex-row">
          <a href="#">
            <img className="w-16 h-auto" src={logo.src} alt="" />
          </a>

          <p className="text-sm text-gray-300">
            © Copyright 2021. All Rights Reserved.
          </p>

          <div className="flex gap-4">
            <i className="pi pi-facebook" />
            <i className="pi pi-github" />
            <i className="pi pi-twitter" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SobreNosotros;

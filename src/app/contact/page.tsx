import Navegador, { IOption } from "@/components/Nav";
import React from "react";
import logo from "../../../public/images/PostLogo5.webp";
import BloqueContacto from "@/components/contactBox";

export default function page() {
  const options: IOption[] = [
    { label: "Iniciar sesión", redirect: "/login", type: "option" },
  ];
  return (
    <div>
      <Navegador options={options} imageRedirect="/" />
      <main className="h-max flex py-12">
        <div className="container px-6 py-16 mx-auto">
          <div>
            <p className="font-black text-blue-500 dark:text-blue-400">
              Contactate con nosotros
            </p>
            <h1 className="mt-2 text-2xl font-black text-gray-800 md:text-3xl dark:text-white">
              ¡Nos encantaría escuchar de ti!
            </h1>
            <p></p>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Si tienes alguna pregunta, comentario o simplemente deseas
              comunicarte con nosotros, no dudes en ponerte en contacto.Nuestro
              equipo de atención al cliente está aquí para ayudarte.Puedes
              contactarnos a través de los siguientes medios:
            </p>
          </div>
          <div className="grid grid-cols-1 gap-12 mt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            <BloqueContacto
              titulo="Correo electronico"
              icon="pi pi-envelope"
              texto="Contactanos por este correo:"
              reference="pablomartinvillacres@gmail.com"
            />
            <BloqueContacto
              titulo="Teléfono"
              icon="pi pi-phone"
              texto="Contactanos por este número:"
              reference="+593 99 873 6996"
            />
            <BloqueContacto
              titulo="Ubicación"
              icon="pi pi-map-marker"
              texto="Encuentranos en esta dirección:"
              reference="Av. los chásquis y Río Payamino"
            />
            <BloqueContacto
              titulo="Redes sociales"
              icon="pi pi-facebook"
              texto="Siguenos en nuestras redes sociales:"
              reference="@facturacionelectronica"
            />
            <BloqueContacto
              titulo="Horario de atención"
              icon="pi pi-clock"
              texto="Nuestro horario de atención es:"
              reference="Lunes a Viernes de 8:00 a 17:00"
            />
            <BloqueContacto
              titulo="Soporte técnico"
              icon="pi pi-question-circle"
              texto="Escribenos a este correo:"
              reference="soporte.Jeep@gmail.com"
            />
          </div>
        </div>
      </main>
      <footer className=" bg-jair h-max mt-6">
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

"use client";
import "@/app/globals.css";

import { MenuItem } from "primereact/menuitem";
import "primereact/resources/themes/bootstrap4-dark-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Image from "next/image";
import Logo from "../../../public/images/PostLogo5.webp";
import { Menu } from "primereact/menu";

const items: MenuItem[] = [
  {
    label: "Seleccionar Sucursal/Caja",
    icon: "pi pi-fw pi-building",
    url: "/user/branchBox",
  },
  {
    label: "Facturación",
    icon: "pi pi-fw pi-tag",
    url: "/user/invoice",
  },
  {
    label: "Clientes",
    icon: "pi pi-fw pi-user",
    url: "/user/customers",
  },

  {
    label: "Ver facturas",
    icon: "pi pi-fw pi-wrench",
    url: "/user/invoiceList",
  },
  {
    label: "Salir",
    icon: "pi pi-fw pi-sign-out",
    command: () => {
      window.localStorage.removeItem("user");
      window.location.href = "/";
    },
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex ">
      <div className="min-h-screen bg-jair">
        <div className="h-full ">
          <div className="flex justify-center items-center">
            <Image
              src={Logo.src}
              alt=""
              width={104}
              height={104}
              className="py-2 "
            />
          </div>
          <Menu model={items} className="w-52 md:w-25rem mb-4 bg-gray-700" />
        </div>
      </div>
      <div className="flex justify-center items-center w-11/12 bg-slate-600">
        {children}
      </div>
    </div>
  );
}

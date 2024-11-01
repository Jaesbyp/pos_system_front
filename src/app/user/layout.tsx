"use client";
import "@/app/globals.css";

import { MenuItem } from "primereact/menuitem";
import "primereact/resources/themes/bootstrap4-dark-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import DashboardPanel from "@/components/dashboard/dasboard-panel";

const items: MenuItem[] = [
  {
    label: "Seleccionar Sucursal/Caja",
    icon: "pi pi-fw pi-desktop",
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
    icon: "pi pi-fw pi-copy",
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
    <div className="grid grid-cols-12 ">
      {<DashboardPanel items={items} />}
      <div className="col-span-12 p-4 m-0 outline-none bg-slate-600 max-w-[86vw] max-h-[100vh] md:col-span-10">
        {children}
      </div>
    </div>
  );
}

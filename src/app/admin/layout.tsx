"use client";
import "@/app/globals.css";
import { useRouter } from "next/navigation";
import { PanelMenu } from "primereact/panelmenu";
import { MenuItem } from "primereact/menuitem";
import "primereact/resources/themes/bootstrap4-dark-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Image from "next/image";
import Logo from "../../../public/images/PostLogo5.webp";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items: MenuItem[] = [
    {
      label: "Productos",
      icon: "pi pi-fw pi-tag",
      items: [
        {
          label: "Administrar Productos",
          icon: "pi pi-fw pi-plus-circle",
          url: "/admin/products",
        },
        {
          label: "Administrar Categorías",
          icon: "pi pi-fw pi-plus-circle",
          url: "/admin/categories",
        },
      ],
    },
    {
      label: "Compras",
      icon: "pi pi-fw pi-tag",
      items: [
        {
          label: "Administrar Proveedores",
          icon: "pi pi-fw- pi-person",
          url: "/admin/providers",
        },
        {
          label: "Administrar Compras",
          icon: "pi pi-fw pi-tag",
          url: "/admin/pucharses",
        },
      ],
    },
    {
      label: "Usuarios",
      icon: "pi pi-fw pi-user",
      url: "/admin/users",
    },
    {
      label: "Mi Empresa",
      icon: "pi pi-fw pi-shopping-bag",
      items: [
        {
          label: "Administrar clientes",
          icon: "pi pi-fw pi-plus-circle",
          url: "/admin/customer",
        },
        {
          label: "Administrar Sucursal/Caja",
          icon: "pi pi-fw pi-plus-circle",
          url: "/admin/branches",
        },
      ],
    },
    {
      label: "Facturas",
      icon: "pi pi-fw pi-wrench",
      url: "/admin/invoiceList",
    },
    // {
    //   label: "Configuración",
    //   icon: "pi pi-fw pi-wrench",
    //   url: "/admin/settings",
    // },
    {
      label: "Salir",
      icon: "pi pi-fw pi-sign-out",
      command: () => {
        window.localStorage.removeItem("user");
        window.location.href = "/";
      },
    },
  ];

  return (
    <div className="grid grid-cols-12 ">
      <div className="col-span-2 min-h-screen bg-jair">
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
          <PanelMenu model={items} className="md:w-25rem mb-4 bg-gray-700" />
        </div>
      </div>
      <div className="col-span-10 p-4 m-0 outline-none bg-slate-600 max-w-[86vw] max-h-[100vh]">
        {children}
      </div>
    </div>
  );
}

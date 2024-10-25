"use client";

import { PanelMenu } from "primereact/panelmenu";
import React from "react";
import Logo from "../../../public/images/PostLogo5.webp";
import { MenuItem } from "primereact/menuitem";
import Image from "next/image";
import {
  DEVICE_TYPE_ENUM,
  UseDeviceScreenType,
} from "@/hooks/use-resize-listener";
import { useRouter } from "next/navigation";

const DashboardPanel = () => {
  const displayType = UseDeviceScreenType();
  const router = useRouter();

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
      icon: "pi pi-fw pi-cart-plus",
      items: [
        {
          label: "Administrar Proveedores",
          icon: "pi pi-fw- pi-share-alt",
          url: "/admin/providers",
        },
        {
          label: "Administrar Compras",
          icon: "pi pi-fw pi-shopping-bag",
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
      icon: "pi pi-fw pi-building ",
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
        router.push("/");
      },
    },
  ];
  const dashboardPanel = (
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
        <PanelMenu
          model={items}
          className="md:w-25rem mb-4 bg-gray-700"
          pt={
            displayType === DEVICE_TYPE_ENUM.MOBILE
              ? {
                  headerLabel: {
                    style: {
                      display: "none",
                    },
                  },
                  headerSubmenuIcon: {
                    style: {
                      display: "block",
                    },
                  },
                  label: {
                    style: {
                      display: "none",
                    },
                  },
                }
              : undefined
          }
        />
      </div>
    </div>
  );
  return dashboardPanel;
};

export default DashboardPanel;

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { MenuItem } from "primereact/menuitem";

export const adminItems = (router: AppRouterInstance): MenuItem[] => [
  {
    label: "Productos",
    icon: "pi pi-fw pi-tag",

    items: [
      {
        label: "Administrar Productos",
        icon: "pi pi-fw pi-table",
        url: "/admin/products",
      },
      {
        label: "Administrar Categorías",
        icon: "pi pi-fw pi-tags",
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
      {
        label: "Crear Compra",
        icon: "pi pi-fw pi-box",
        url: "/admin/pucharses/create",
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
        icon: "pi pi-fw pi-users",
        url: "/admin/customer",
      },
      {
        label: "Administrar Sucursal/Caja",
        icon: "pi pi-fw pi-desktop",
        url: "/admin/branches",
      },
    ],
  },
  {
    label: "Facturas",
    icon: "pi pi-fw pi-copy",
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

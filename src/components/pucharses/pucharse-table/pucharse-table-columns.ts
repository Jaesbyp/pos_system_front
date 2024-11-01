export const PUCHARSE_TABLE_COLUMNS = [
  { field: "delete", header: "Eliminar", align: "center", width: "10%" },
  { field: "name", header: "Producto", width: "20%" },
  { field: "description", header: "Descripción", width: "40%" },
  { field: "stock", header: "Stock", align: "center", width: "10%" },
  { field: "quantity", header: "Cantidad", align: "center", width: "10%" },
  {
    field: "unitPrice",
    header: "P. Unitario",
    align: "center",
    width: "10%",
  },
  {
    field: "unitDiscount",
    header: "Descuento Unitario %",
    align: "center",
    width: "10%",
  },
  { field: "total", header: "Total", align: "center", width: "10%" },
] as const;

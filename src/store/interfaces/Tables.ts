export const TAXES = ["IVA", "ICE", "IRBPNR"];

export const IVAS = [
  "0%",
  "12%",
  "14%",
  "No Objeto de Impuesto",
  "Exento de IVA",
  "IVA diferenciado",
];

export const ICE = ["0%"];

export const IRBPNR = ["0%"];

export const IDENTIFICATION_TYPES = [
  "RUC",
  "CÉDULA",
  "PASAPORTE",
  "VENTA A CONSUMIDOR FINAL",
  "IDENTIFICACIÓN DEL EXTERIOR",
];

export const RECEIPTS = [
  { name: "FACTURA", code: "FACTURA" },
  {
    name: "LIQUIDACIÓN DE COMPRA DE BIENES Y PRESTACIÓN DE SERVICIOS",
    code: "LIQUIDACIÓN DE COMPRA DE BIENES Y PRESTACIÓN DE SERVICIOS",
  },
  { name: "NOTA DE CRÉDITO", code: "NOTA DE CRÉDITO" },
  { name: "NOTA DE DÉBITO", code: "NOTA DE DÉBITO" },
  { name: "GUÍA DE REMISIÓN", code: "GUÍA DE REMISIÓN" },
  { name: "COMPROBANTE DE RETENCIÓN", code: "COMPROBANTE DE RETENCIÓN" },
];

export const EMISSIONS = [{ name: "Emisión normal", code: "Emisión normal" }];

export const ENVIRONMENTS = [
  { name: "Pruebas", code: "Pruebas" },
  { name: "Producción", code: "Producción" },
];

export const PAYMENTS = [
  {
    name: "SIN UTILIZACION DEL SISTEMA FINANCIERO",
    code: "SIN UTILIZACION DEL SISTEMA FINANCIERO",
  },
  { name: "COMPENSACIÓN DE DEUDAS", code: "COMPENSACIÓN DE DEUDAS" },
  { name: "TARJETA DE DÉBITO", code: "TARJETA DE DÉBITO" },
  { name: "DINERO ELECTRÓNICO", code: "DINERO ELECTRÓNICO" },
  { name: "TARJETA PREPAGO", code: "TARJETA PREPAGO" },
  { name: "TARJETA DE CRÉDITO", code: "TARJETA DE CRÉDITO" },
  {
    name: "OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO",
    code: "OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO",
  },
  { name: "ENDOSO DE TÍTULOS", code: "ENDOSO DE TÍTULOS" },
];

import React from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  Calendar,
  DollarSign,
  FileText,
  Key,
  Package,
  Store,
} from "lucide-react";
import { IInvoiceResponse } from "@/store/interfaces/IInvoices";
import { ISellingProductsPDF } from "@/store/interfaces/ISellingProducts";

interface Props {
  invoice: IInvoiceResponse;
  products: ISellingProductsPDF[];
  visible: boolean;
  onHide: () => void;
  className?: string;
}

const formatCurrency = (value: number) => {
  if (!value && value !== 0) return "-";
  return `$${value.toFixed(2)}`;
};

const formatPercentage = (value: number) => {
  if (!value && value !== 0) return "-";
  return `${value}%`;
};
const formatDate = (date: string | Date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function InvoiceInfo({
  invoice,
  products,
  visible,
  onHide,
  className,
}: Props) {
  // Templates para las columnas de la tabla
  const productNameTemplate = (rowData: ISellingProductsPDF) => {
    return (
      <div className="flex flex-col">
        <span className="font-medium">{rowData.product.name}</span>
        <span className="text-sm text-gray-500">ID: {rowData.product.id}</span>
      </div>
    );
  };

  const taxTemplate = (
    rowData: ISellingProductsPDF,
    field: "iva" | "ice" | "irbp"
  ) => {
    const percentage = rowData[field];
    const value = rowData[`${field}Value`];
    return (
      <div className="flex flex-col items-end">
        <span>{formatPercentage(percentage)}</span>
        <span className="text-sm text-gray-500">{formatCurrency(value)}</span>
      </div>
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      className={`${className}`}
      style={{ width: "90vw", maxWidth: "1200px" }}
      header={() => (
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold m-0">Información de Factura</h1>
          <span className="text-sm text-gray-500">{invoice.accessKey}</span>
        </div>
      )}
    >
      {/* Cards anteriores se mantienen igual */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Información General */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span>Información General</span>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-gray-600">ID:</span>
              <span className="font-medium">{invoice.id || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo de ambiente:</span>
              <span className="font-medium">
                {invoice.environmentType || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo de emisión:</span>
              <span className="font-medium">{invoice.emissionType || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo de comprobante:</span>
              <span className="font-medium">{invoice.receiptType || "-"}</span>
            </div>
          </div>
        </Card>

        {/* Información de Cliente y Tienda */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              <span>Información de Cliente y Tienda</span>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-gray-600">ID del cliente:</span>
              <span className="font-medium">{invoice.customerId || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sucursal:</span>
              <span className="font-medium">{invoice.branchName || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ID de caja:</span>
              <span className="font-medium">{invoice.boxId || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Clave de caja:</span>
              <span className="font-medium">{invoice.boxKey || "-"}</span>
            </div>
          </div>
        </Card>

        {/* Fechas y Referencias */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Fechas y Referencias</span>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha de emisión:</span>
              <span className="font-medium">
                {formatDate(invoice.emissionDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guía de remisión:</span>
              <span className="font-medium">
                {invoice.remissionGuide || "-"}
              </span>
            </div>
          </div>
        </Card>

        {/* Información de Pagos */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <span>Información de Pagos</span>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total sin impuestos:</span>
              <span className="font-medium">
                {formatCurrency(invoice.totalWithoutTax)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total de descuento:</span>
              <span className="font-medium">
                {formatCurrency(invoice.totalDiscount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Propina:</span>
              <span className="font-medium">{formatCurrency(invoice.tip)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium font-bold text-lg">
                {formatCurrency(invoice.total)}
              </span>
            </div>
          </div>
        </Card>

        {/* Información de Pago */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              <span>Detalles de Pago</span>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo de pago:</span>
              <span className="font-medium">{invoice.paymentType || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Moneda:</span>
              <span className="font-medium">{invoice.currency || "-"}</span>
            </div>
          </div>
        </Card>
      </div>
      {/* Nueva sección de productos */}
      {products && products.length > 0 && (
        <Card
          title={
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <span>Productos</span>
            </div>
          }
          className="mt-4"
        >
          <DataTable
            value={products}
            scrollable
            scrollHeight="400px"
            stripedRows
          >
            <Column
              header="Producto"
              body={productNameTemplate}
              style={{ minWidth: "200px" }}
            />
            <Column
              field="quantity"
              header="Cantidad"
              style={{ minWidth: "100px" }}
            />
            <Column
              field="subtotal"
              header="Subtotal"
              body={(rowData) => formatCurrency(rowData.subtotal)}
              style={{ minWidth: "120px" }}
            />
            <Column
              field="discount"
              header="Descuento"
              body={(rowData) => formatCurrency(rowData.discount)}
              style={{ minWidth: "120px" }}
            />
            <Column
              header="IVA"
              body={(rowData) => taxTemplate(rowData, "iva")}
              style={{ minWidth: "120px" }}
            />
            <Column
              header="ICE"
              body={(rowData) => taxTemplate(rowData, "ice")}
              style={{ minWidth: "120px" }}
            />
            <Column
              header="IRBP"
              body={(rowData) => taxTemplate(rowData, "irbp")}
              style={{ minWidth: "120px" }}
            />
            <Column
              field="total"
              header="Total"
              body={(rowData) =>
                formatCurrency(
                  rowData.subtotal +
                    rowData.ivaValue +
                    rowData.iceValue +
                    rowData.irbpValue -
                    rowData.discount
                )
              }
              style={{ minWidth: "120px" }}
              headerClassName="font-bold"
              bodyClassName="font-bold"
            />
          </DataTable>
        </Card>
      )}
    </Dialog>
  );
}

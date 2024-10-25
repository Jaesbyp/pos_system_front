import { IInvoiceResponse } from "@/store/interfaces/IInvoices";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";

interface Props {
  invoice: IInvoiceResponse;
  visible: boolean;
  setShowVisible: (value: boolean) => void;
  onHide: () => void;
  className?: string;
}

export default function invoiceInfo({
  invoice,
  visible,
  setShowVisible,
  onHide,
  className,
}: Props) {
  return (
    <Dialog visible={visible} onHide={onHide} className={className}>
      <h1 className="text-center font-bold text-3xl">
        Información de la factura
      </h1>
      <div className="flex gap-4 px-32 py-8">
        <div className="font-bold">
          <p>ID:</p>
          <p>Tipo de ambiente:</p>
          <p>Tipo de emisión:</p>
          <p>Clave de acceso:</p>
          <p>Tipo de comprobante:</p>
          <p>ID del cliente:</p>
          <p>Fecha de emisión:</p>
          <p>Guía de remisión:</p>
          <p>Total sin impuestos:</p>
          <p>Total de descuento:</p>
          <p>Propina:</p>
          <p>Tipo de pago:</p>
          <p>Total:</p>
          <p>Moneda:</p>
          <p>ID de la caja:</p>
          <p>Clave de la caja:</p>
          <p>Nombre de la sucursal:</p>
        </div>
        <div className="flex flex-col">
          <p>{invoice.id ? invoice.id : "-"}</p>
          <p>{invoice.environmentType ? invoice.environmentType : "-"}</p>
          <p>{invoice.emissionType ? invoice.emissionType : "-"}</p>
          <p>{invoice.accessKey ? invoice.accessKey : "-"}</p>
          <p>{invoice.receiptType ? invoice.receiptType : "-"}</p>
          <p>{invoice.customerId ? invoice.customerId : "-"}</p>
          <p>{invoice.emissionDate ? invoice.emissionDate : "-"}</p>
          <p>{invoice.remissionGuide ? invoice.remissionGuide : "-"}</p>
          <p>{invoice.totalWithoutTax ? invoice.totalWithoutTax : "-"}</p>
          <p>{invoice.totalDiscount ? invoice.totalDiscount : "-"}</p>
          <p>{invoice.tip ? invoice.tip : "-"}</p>
          <p>{invoice.paymentType ? invoice.paymentType : "-"}</p>
          <p>{invoice.total ? invoice.total : "-"}</p>
          <p>{invoice.currency ? invoice.currency : "-"}</p>
          <p>{invoice.boxId ? invoice.boxId : "-"}</p>
          <p>{invoice.boxKey ? invoice.boxKey : "-"}</p>
          <p>{invoice.branchName ? invoice.branchName : "-"}</p>
        </div>
      </div>
    </Dialog>
  );
}

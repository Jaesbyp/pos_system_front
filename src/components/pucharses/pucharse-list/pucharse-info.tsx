import React, { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Calendar, Package, Store, FileText } from "lucide-react";
import {
  getPucharseStatusLabel,
  IPucharseResponse,
  PucharseStatusEnum,
} from "@/store/interfaces/pucharses/IPucharse";
import {
  IPucharseDetail,
  IPucharseDetailCreate,
} from "@/store/interfaces/pucharses/IPucharseDetail";
import { usePucharseDetails } from "@/hooks/pucharse/usePucharseDetails";

interface Props {
  pucharse: IPucharseResponse;
  visible: boolean;
  onHide: () => void;
  className?: string;
}

export const getStatusSeverity = (status: PucharseStatusEnum) => {
  switch (status) {
    case PucharseStatusEnum.PAYED:
      return "success";
    case PucharseStatusEnum.PENDING:
      return "warning";
    case PucharseStatusEnum.CANCELED:
      return "danger";
    default:
      return "info";
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function PucharseInfo({
  pucharse,
  visible,
  onHide,
  className,
}: Props) {
  const { loading, pucharseDetails, getPucharseDetailsByPucharseId } =
    usePucharseDetails();

  const priceBodyTemplate = (rowData: IPucharseDetailCreate) => {
    return `$${rowData.unitPrice.toFixed(2)}`;
  };

  const totalBodyTemplate = (rowData: IPucharseDetailCreate) => {
    return `$${(rowData.quantity * rowData.unitPrice).toFixed(2)}`;
  };

  useEffect(() => {
    if (pucharse.id) {
      getPucharseDetailsByPucharseId(pucharse.id);
    }

    console.log(pucharseDetails);
  }, [pucharse.id]);

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      className={`${className}`}
      style={{ width: "90vw", maxWidth: "1200px" }}
      header={() => (
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold m-0">Detalles de Compra</h1>
          <Tag
            value={getPucharseStatusLabel(pucharse.status)}
            severity={getStatusSeverity(pucharse.status)}
          />
        </div>
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              <span className="text-gray-600">Número de Factura:</span>
              <span className="font-medium">{pucharse.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ID de Compra:</span>
              <span className="font-medium">{pucharse.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">${pucharse.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Card
          title={
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Fechas</span>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha de Orden:</span>
              <span className="font-medium">
                {formatDate(pucharse.orderDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha de Entrega:</span>
              <span className="font-medium">
                {pucharse.deliveredDate
                  ? formatDate(pucharse.deliveredDate)
                  : "Pendiente"}
              </span>
            </div>
          </div>
        </Card>

        <Card
          title={
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              <span>Información de Tienda</span>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-gray-600">ID de Tienda:</span>
              <span className="font-medium">{pucharse.storeId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ID de Proveedor:</span>
              <span className="font-medium">{pucharse.providerId}</span>
            </div>
          </div>
        </Card>
      </div>

      {pucharseDetails && pucharseDetails.length > 0 && (
        <Card
          title={
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <span>Detalles de la Compra</span>
            </div>
          }
        >
          <DataTable value={pucharseDetails} scrollable loading={loading}>
            <Column field="productId" header="ID Producto" />
            <Column field="quantity" header="Cantidad" />
            <Column
              field="unitPrice"
              header="Precio Unitario"
              body={priceBodyTemplate}
            />
            <Column
              align={"center"}
              field="unitDiscount"
              header="Descuento Unitario %"
              body={(rowData) => `${rowData.unitDiscount}%`}
            />
            <Column header="Total" body={totalBodyTemplate} />
          </DataTable>
        </Card>
      )}
    </Dialog>
  );
}

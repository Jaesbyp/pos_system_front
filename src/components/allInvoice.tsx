"use client";
import {
  handleCreatePDF,
  handleGenerateXML,
  handleGetAllInvoices,
} from "@/store/api/invoiceApi";
import React, { useEffect, useRef, useState } from "react";
import { DataTable, DataTableRowClickEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { IInvoiceResponse } from "@/store/interfaces/IInvoices";
import InvoiceInfo from "@/components/invoiceInfo";
import { useRouter } from "next/navigation";
import { invoiceResToPDF } from "@/store/utils/uuid";

export default function allInvoice() {
  const toast = useRef<Toast>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showVisible, setShowVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<IInvoiceResponse>();
  const router = useRouter();

  const columns = [
    { field: "id", header: "ID" },
    { field: "emissionType", header: "Tipo de emisión" },
    { field: "emissionDate", header: "Fecha de emisión" },
    { field: "totalWithoutTax", header: "Total sin impuestos" },
    { field: "totalDiscount", header: "Descuento total" },
    { field: "total", header: "Total" },
    { field: "paymentType", header: "Tipo de pago" },
    { field: "actions", header: "Acciones" },
  ];

  useEffect(() => {
    handleGetAllInvoices().then((res) => {
      if (res) {
        setInvoices(res);
      }
    });
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = invoices.filter((product) =>
    Object.values(product).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const showInvoice = (e: IInvoiceResponse) => {
    setSelectedRowData(e);
    setShowVisible(true);
  };

  const handleXMLCreation = (rowData: IInvoiceResponse) => {
    handleGenerateXML(rowData.id).then((res) => {
      if (res) {
        console.log({ res });

        //convertir la respuesta en un blob y descargarlo
        const blob = new Blob([res], { type: "text/xml" });
        const url = URL.createObjectURL(blob);

        // Crear un enlace de descarga
        const link = document.createElement("a");
        link.href = url;
        link.download = rowData.accessKey + ".xml";
        link.style.display = "none"; // Para ocultar el enlace en la página

        // Agregar el enlace al documento y hacer clic en él para descargar el PDF
        document.body.appendChild(link);
        link.click();

        // Liberar el objeto URL creado para el blob
        URL.revokeObjectURL(url);

        toast.current?.show({
          severity: "success",
          summary: "XML generado",
          detail: "El XML se ha generado correctamente",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "El XML no se ha podido generar",
          life: 3000,
        });
      }
    });
  };

  const downloadPDF = (rowData: IInvoiceResponse) => {
    const invoiceToPrint = invoiceResToPDF(rowData);
    if (!invoiceToPrint) {
      return;
    }
    handleCreatePDF(invoiceToPrint, rowData.accessKey + "PDF.pdf").then(
      async (res) => {
        if (res) {
          /**
           * Convertir la respuesta en un blob y descargarlo
           */
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);

          // Crear un enlace de descarga
          const link = document.createElement("a");
          link.href = url;
          link.download = rowData.accessKey + ".pdf";
          link.style.display = "none"; // Para ocultar el enlace en la página

          // Agregar el enlace al documento y hacer clic en él para descargar el PDF
          document.body.appendChild(link);
          link.click();

          // Liberar el objeto URL creado para el blob
          URL.revokeObjectURL(url);
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <Toast ref={toast} />
      <h1 className="text-neutral-100 text-3xl text-center font-bold bg-jair py-3 border-2 border-slate-400 rounded-md">
        <span>
          <i className="pi pi-search" style={{ fontSize: "1.5rem" }}></i>
        </span>{" "}
        Listado de facturas
      </h1>

      <div className="flex gap-4 justify-between">
        <div className="p-input-icon-left">
          <i className="pi pi-search"></i>
          <InputText
            placeholder="Buscar"
            value={searchTerm}
            onChange={handleSearch}
            className="w-96"
          />
        </div>
      </div>
      <DataTable
        value={filteredProducts}
        tableStyle={{ minWidth: "50rem" }}
        className="centered-table"
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
      >
        {columns.map((col, i) => {
          if (col.field === "actions") {
            return (
              <Column
                key={col.field}
                style={{ display: "flex", justifyContent: "center" }}
                header={col.header}
                body={(rowData) => (
                  <div className="action-buttons flex gap-6">
                    {/* <Button
                      severity="help"
                      icon="pi pi-file"
                      onClick={() => handleXMLCreation(rowData)}
                    />
                    <Button
                      icon="pi pi-file-pdf"
                      onClick={() => downloadPDF(rowData)}
                    /> */}
                    <Button
                      severity="info"
                      icon="pi pi-window-maximize"
                      onClick={() => showInvoice(rowData)}
                    />
                  </div>
                )}
              />
            );
          } else {
            return (
              <Column
                alignHeader={"center"}
                key={col.field}
                field={col.field}
                header={col.header}
                body={(rowData) => rowData[col.field] || "-"}
                style={{ textAlign: "center" }}
              />
            );
          }
        })}
      </DataTable>

      {selectedRowData && (
        <InvoiceInfo
          invoice={selectedRowData}
          visible={showVisible}
          setShowVisible={setShowVisible}
          onHide={() => {
            setShowVisible(false);
          }}
        />
      )}
    </div>
  );
}

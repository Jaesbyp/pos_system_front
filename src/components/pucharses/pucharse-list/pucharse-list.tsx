"use client";
import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {
  getPucharseStatusLabel,
  IPucharseResponse,
  PucharseStatusEnum,
} from "@/store/interfaces/pucharses/IPucharse";
import { usePucharses } from "@/hooks/pucharse/usePucharses";
import PucharseInfo, { getStatusSeverity } from "./pucharse-info";
import { Tag } from "primereact/tag";

export default function PucharseList() {
  const toast = useRef<Toast>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showVisible, setShowVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<IPucharseResponse>();
  const { pucharses, updatePucharse, loading } = usePucharses();

  const columns = [
    { field: "id", header: "ID" },
    { field: "invoiceNumber", header: "# Factura" },
    { field: "orderDate", header: "Fecha ordenada" },
    { field: "deliveredDate", header: "Fecha entragada" },
    { field: "total", header: "Total" },
    { field: "status", header: "Estado" },
    { field: "providerName", header: "Proveedor" },
    { field: "actions", header: "Acciones" },
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredPucharses = pucharses.filter((pucharse) =>
    Object.values(pucharse).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const showPucharse = (e: IPucharseResponse) => {
    setSelectedRowData(e);
    setShowVisible(true);
  };

  const handleUpdateDeliveredDate = (id: number) => {
    const deliveredDate = new Date();
    updatePucharse(id, {
      deliveredDate,
    });
  };

  const handleUpdateStatus = (id: number, status: PucharseStatusEnum) => {
    updatePucharse(id, {
      status,
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <Toast ref={toast} />
      <h1 className="text-neutral-100 text-3xl text-center font-bold bg-jair py-3 border-2 border-slate-400 rounded-md">
        <span>
          <i className="pi pi-search" style={{ fontSize: "1.5rem" }}></i>
        </span>{" "}
        Listado de compras
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
        value={filteredPucharses}
        tableStyle={{ minWidth: "50rem" }}
        className="centered-table"
        paginator
        loading={loading}
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
      >
        {columns.map((col, i) => {
          if (col.field === "actions") {
            return (
              <Column
                key={col.field}
                header={col.header}
                body={(rowData: IPucharseResponse) => (
                  <div className="action-buttons flex gap-6">
                    {!rowData.deliveredDate &&
                      rowData.status !== PucharseStatusEnum.CANCELED && (
                        <Button
                          severity="help"
                          tooltip="Marcar como entregado"
                          icon="pi pi-calendar"
                          onClick={() => handleUpdateDeliveredDate(rowData.id)}
                        />
                      )}
                    {rowData.status === PucharseStatusEnum.PENDING && (
                      <>
                        <Button
                          severity="success"
                          tooltip="Pagar"
                          icon="pi pi-check"
                          onClick={() =>
                            handleUpdateStatus(
                              rowData.id,
                              PucharseStatusEnum.PAYED
                            )
                          }
                        />

                        {!rowData.deliveredDate && (
                          <Button
                            severity="danger"
                            tooltip="Cancelar"
                            icon="pi pi-times"
                            onClick={() =>
                              handleUpdateStatus(
                                rowData.id,
                                PucharseStatusEnum.CANCELED
                              )
                            }
                          />
                        )}
                      </>
                    )}
                    <Button
                      severity="info"
                      tooltip="Ver"
                      icon="pi pi-window-maximize"
                      onClick={() => showPucharse(rowData)}
                    />
                  </div>
                )}
              />
            );
          } else if (col.field === "status") {
            return (
              <Column
                alignHeader={"center"}
                key={col.field}
                field={col.field}
                header={col.header}
                body={(rowData) => (
                  <Tag
                    value={getPucharseStatusLabel(rowData.status)}
                    severity={getStatusSeverity(rowData.status)}
                  />
                )}
                style={{ textAlign: "center" }}
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
        <PucharseInfo
          pucharse={selectedRowData}
          visible={showVisible}
          onHide={() => {
            setShowVisible(false);
          }}
        />
      )}
    </div>
  );
}

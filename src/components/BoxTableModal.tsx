import {
  handleCreateBox,
  handleDeleteBox,
  handleGetBoxesByBranchId,
} from "@/store/api/boxApi";
import { IBoxResponse } from "@/store/interfaces/IBoxes";
import { IBranchResponse } from "@/store/interfaces/IBranch";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { MouseEvent, RefObject, useEffect, useState } from "react";

const BoxTableModal = ({
  branchBox,
  toast,
}: {
  branchBox: IBranchResponse | null;
  toast: RefObject<Toast>;
}) => {
  const [boxes, setBoxes] = useState<IBoxResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [branch, setBranch] = useState<IBranchResponse | null>(branchBox);

  const columns = [
    { field: "id", header: "ID" },
    { field: "key", header: "Key" },
    { field: "sequential", header: "Secuencial" },
    { field: "branchName", header: "Nombre sucursal" },
    { field: "actions", header: "Acciones" },
  ];

  useEffect(() => {
    if (!branchBox) return;
    handleGetBoxesByBranchId(branchBox?.id).then((res) => {
      if (res) {
        setBoxes(res);
      }
    });
  }, []);

  useEffect(() => {
    if (!branchBox) {
      setBranch(null);
    } else {
      setBranch(branchBox);
      handleGetBoxesByBranchId(branchBox?.id).then((res) => {
        if (res) {
          setBoxes(res);
        }
      });
    }
  }, [branchBox]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredBoxes = boxes.filter((box) =>
    Object.values(box).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = (box: IBoxResponse) => {
    handleDeleteBox(box.id).then((res) => {
      if (res) {
        toast.current?.show({
          severity: "success",
          summary: "Caja Eliminado",
          detail: "La caja ha sido eliminada correctamente",
          life: 3000,
        });
        setBoxes(boxes.filter((item) => item.id !== box.id));
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Ha ocurrido un error al eliminar la caja",
          life: 3000,
        });
      }
    });
  };

  const handleRegister = () => {
    if (!branch) return;
    const box = {
      branchId: branch.id,
    };

    handleCreateBox(box).then((res) => {
      if (res) {
        toast.current?.show({
          severity: "success",
          summary: "Caja Creada",
          detail: "La caja ha sido creada correctamente",
          life: 3000,
        });
        setBoxes([...boxes, res]);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Ha ocurrido un error al crear la caja",
          life: 3000,
        });
      }
    });
  };

  const confirm = (event: MouseEvent<HTMLButtonElement>, box: IBoxResponse) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Quieres eliminar esta caja?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept() {
        accept(box);
      },
      reject,
    });
  };

  const accept = (box: IBoxResponse) => {
    handleDelete(box);
  };

  const reject = () => {
    toast.current?.show({
      severity: "warn",
      summary: "Rejected",
      detail: "Has cancelado la eliminación de la caja",
      life: 3000,
    });
  };

  return (
    <div className="flex flex-col gap-8 mb-6">
      <div className="border p-4 border-opacity-5 bg-gray-700 w-full">
        <div className="flex flex-col gap-6">
          <Toast ref={toast} />

          <h1 className="text-neutral-100 text-3xl text-center font-bold bg-jair py-3 border-2 border-slate-400 rounded-md">
            <span>
              <i className="pi pi-search" style={{ fontSize: "1.5rem" }}></i>
            </span>{" "}
            {branch
              ? `Cajas de ${branch.name}`
              : "Selecciona una sucursal para ver sus cajas"}
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
            {branchBox && (
              <Button
                label="Agregar Caja"
                severity="info"
                raised
                className="w-56"
                icon="pi pi-plus"
                onClick={handleRegister}
              />
            )}
          </div>
          <DataTable
            value={branch ? filteredBoxes : []}
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
                    alignHeader={"center"}
                    body={(rowData) => (
                      <div className="action-buttons flex gap-6">
                        <ConfirmPopup />
                        <Button
                          icon="pi pi-eraser"
                          severity="danger"
                          aria-label="Cancel"
                          onClick={(e) => confirm(e, rowData)}
                        />
                      </div>
                    )}
                  />
                );
              } else {
                return (
                  <Column
                    key={col.field}
                    field={col.field}
                    header={col.header}
                    alignHeader={"center"}
                    body={(rowData) => rowData[col.field] || "-"}
                    style={{ textAlign: "center" }}
                  />
                );
              }
            })}
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default BoxTableModal;

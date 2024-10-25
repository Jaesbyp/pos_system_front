"use client";
import { useState, useEffect, useRef, MouseEvent } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { IInputsForm } from "@/store/interfaces/IForms";
import { useForm } from "react-hook-form";
import { KeyFilterType } from "primereact/keyfilter";
import { IBranchCreate, IBranchResponse } from "@/store/interfaces/IBranch";
import {
  handleCreateBranch,
  handleDeleteBranch,
  handleGetAllBranches,
} from "@/store/api/branchApi";
import ModifyBranchDialog from "@/components/ModifyBranchDialog";
import BoxTableModal from "@/components/BoxTableModal";

const branchs = () => {
  const toast = useRef<Toast>(null);
  const [branches, setBranches] = useState<IBranchResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [branch, setBranch] = useState<IBranchResponse | null>(null);
  const [branchBox, setBranchBox] = useState<IBranchResponse | null>(null);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const columns = [
    { field: "id", header: "ID" },
    { field: "key", header: "Key" },
    { field: "name", header: "Nombre sucursal" },
    { field: "address", header: "Dirección" },
    { field: "actions", header: "Acciones" },
  ];

  useEffect(() => {
    handleGetAllBranches().then((res) => {
      if (res) {
        setBranches(res);
      }
    });
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredBranchs = branches.filter((branch) =>
    Object.values(branch).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleModify = (branch: IBranchResponse) => {
    setBranch(branch);
    setEditVisible(true);
  };

  const handleDelete = (branch: IBranchResponse) => {
    handleDeleteBranch(branch.id).then((res) => {
      if (res) {
        toast.current?.show({
          severity: "success",
          summary: "Producto Eliminado",
          detail: "La sucursal ha sido eliminada correctamente",
          life: 3000,
        });
        setBranches(branches.filter((item) => item.id !== branch.id));
        setBranchBox(null);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Ha ocurrido un error al eliminar la sucursal",
          life: 3000,
        });
      }
    });
  };

  const handleRegister = handleSubmit((data: any) => {
    const branch: IBranchCreate = {
      name: data.name,
      address: data.address,
    };

    handleCreateBranch(branch).then((res) => {
      if (res) {
        setAddVisible(false);
        toast.current?.show({
          severity: "success",
          summary: "Producto Creado",
          detail: "La sucursal ha sido creada correctamente",
          life: 3000,
        });
        setBranches([...branches, res]);
        reset();
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Ha ocurrido un error al crear la sucursal",
          life: 3000,
        });
      }
    });
  });

  const confirm = (
    event: MouseEvent<HTMLButtonElement>,
    branch: IBranchResponse
  ) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Do you want to delete this record?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept() {
        accept(branch);
      },
      reject,
    });
  };

  const allForms: IInputsForm[] = [
    {
      name: "name",
      label: "Nombre",
      keyfilter: /^[A-Za-z ]$/,
      placeholder: "Nombre de la sucursal",
      alertText: "*El nombre es obligatorio",
      maxLength: 50,
      onChange: () => {},
    },
    {
      name: "address",
      label: "Dirección",
      keyfilter: /^[A-Za-z ]$/,
      placeholder: "Dirección de la sucursal",
      alertText: "*La dirección es obligatoria",
      maxLength: 100,
      onChange: () => {},
    },
  ];

  const accept = (branch: IBranchResponse) => {
    handleDelete(branch);
  };

  const reject = () => {
    toast.current?.show({
      severity: "warn",
      summary: "Rejected",
      detail: "Has cancelado la eliminación de la sucursal",
      life: 3000,
    });
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="border p-4 border-opacity-5 bg-gray-700 w-full ">
        <div className="flex flex-col gap-6">
          <Toast ref={toast} />

          <h1 className="text-neutral-100 text-3xl text-center font-bold bg-jair py-3 border-2 border-slate-400 rounded-md">
            <span>
              <i className="pi pi-search" style={{ fontSize: "1.5rem" }}></i>
            </span>{" "}
            Listado de sucursales
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
            <Button
              label="Agregar Sucursal"
              severity="info"
              raised
              className="w-56"
              icon="pi pi-plus"
              onClick={() => {
                setAddVisible(true);
              }}
            />
          </div>
          <DataTable
            value={filteredBranchs}
            tableStyle={{ minWidth: "50rem" }}
            className="centered-table"
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            rowHover={true}
            onRowClick={(e) => {
              setBranchBox(e.data as IBranchResponse);
            }}
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
                        <Button
                          icon="pi pi-pencil"
                          severity="info"
                          aria-label="User"
                          onClick={() => {
                            handleModify(rowData);
                          }}
                        />
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

      {branch !== undefined && branch !== null && (
        <ModifyBranchDialog
          toast={toast}
          branch={branch}
          setBranches={setBranches}
          visible={editVisible}
          setEditVisible={setEditVisible}
        />
      )}

      <Dialog
        visible={addVisible}
        style={{ width: "50vw" }}
        onHide={() => {
          reset();
          setAddVisible(false);
        }}
      >
        <form className="px-16">
          <h1 className="text-center font-bold text-3xl">
            Agregar una sucursal
          </h1>
          {allForms.map((allForm, index) => (
            <div className="py-4 block" key={index}>
              <span className="p-float-label">
                <InputText
                  id={allForm.name}
                  className="border border-solid border-gray-300 py-2 px-4 rounded-full w-full"
                  keyfilter={allForm.keyfilter as KeyFilterType}
                  placeholder={allForm.placeholder}
                  maxLength={allForm.maxLength}
                  {...register(allForm.name, {
                    required: allForm.alertText,
                  })}
                />
                <label className="block pb-2" htmlFor={allForm.name}>
                  {allForm.label}
                </label>
              </span>
              {errors[allForm.name] && (
                <small className="text-red-500">{allForm.alertText}</small>
              )}
            </div>
          ))}
          <div className="flex justify-evenly gap-4 py-4">
            <Button
              label="Agregar"
              severity="info"
              className="w-1/2"
              type="submit"
              onClick={handleRegister}
            />
            <Button
              label="Cancelar"
              severity="danger"
              className="w-1/2"
              type="button"
              onClick={() => {
                reset();
                setAddVisible(false);
              }}
            />
          </div>
        </form>
      </Dialog>

      {<BoxTableModal branchBox={branchBox} toast={toast} />}
    </div>
  );
};

export default branchs;

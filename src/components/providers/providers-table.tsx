"use client";
import ComboBox from "@/components/ComboBox";
import { IInputsForm } from "@/store/interfaces/IForms";
import { IDENTIFICATION_TYPES } from "@/store/interfaces/Tables";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";

import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { KeyFilterType } from "primereact/keyfilter";
import { Toast } from "primereact/toast";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import ModifyClientDialog from "@/components/modifyClientDialog";
import validateDni, { validateRuc } from "@/store/utils/dniRucValidator";
import {
  DEVICE_TYPE_ENUM,
  UseDeviceScreenType,
} from "@/hooks/use-resize-listener";
import {
  IProviderCreate,
  IProviderResponse,
  IProviderUpdate,
} from "@/store/interfaces/IProvider";
import { useProviders } from "@/hooks/provider/useProvider";
import { useDebounce } from "primereact/hooks";
import ModifyProviderDialog from "./modify-provider-dialog";

export default function ProvidersTable({
  setProvidersContext,
}: {
  setProvidersContext?: any;
}) {
  const { providers, loading, createProvider, updateProvider } = useProviders();
  const [provider, setProvider] = useState<IProviderResponse>();
  const [searchTermInput, debounceSearchTerm, setSearchTermInput] = useDebounce(
    "",
    300
  );
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const toast = useRef<Toast>(null);
  const [idType, setIdType] = useState<string>("");

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const columns = [
    { field: "id", header: "ID" },
    { field: "name", header: "Nombre" },
    { field: "email", header: "Correo" },
    { field: "identification", header: "Identificación" },
    { field: "address", header: "Dirección" },
    { field: "phoneNumber", header: "Número de teléfono" },
    { field: "actions", header: "Acciones" },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermInput(e.target.value);
  };

  const filteredProviders = providers?.filter((provider) => {
    return Object.values(provider).some((value) => {
      return String(value)
        .toLowerCase()
        .includes(debounceSearchTerm.toLowerCase());
    });
  });

  const handleModify = (provider: IProviderResponse) => {
    setProvider(provider);
    setEditVisible(true);
  };

  const allForms: IInputsForm[] = [
    {
      name: "name",
      label: "Nombre",
      keyfilter: /^[A-Za-z ]$/,
      placeholder: "Ingrese el nombre",
      alertText: "El nombre es requerido",
      onChange: () => {},
      maxLength: 20,
    },
    {
      name: "email",
      label: "Correo",
      keyfilter: "email",
      placeholder: "Ingrese el email",
      alertText: "El correo es inválido",
      onChange: () => {},
    },
    {
      name: "address",
      label: "Dirección",
      keyfilter: /^[A-Za-z ]$/,
      placeholder: "Ingrese el dirección",
      alertText: "La dirección es requerida",
      onChange: () => {},
    },
    {
      name: "phoneNumber",
      label: "Número de teléfono",
      keyfilter: "pnum",
      placeholder: "Ingrese el número de teléfono",
      alertText: "El número de teléfono es inválido",
      onChange: () => {},
      maxLength: 30,
    },
    {
      name: "identification",
      label: "Identificación",
      keyfilter: "pnum",
      placeholder: "Ingrese la identificación",
      alertText: "La identificación es inválida",
      onChange: () => {},
    },
  ];

  const handleId = (e: any) => {
    setIdType(e);
  };

  const handleRegister = handleSubmit((data: any) => {
    console.log(data, typeof data);
    const newProvider: IProviderCreate = {
      name: data.name,
      email: data.email,
      identification: data.identification,
      address: data.address,
      phoneNumber: data.phoneNumber,
      identificationTypeCode: idType,
      storeId: 1,
    };

    createProvider(newProvider).then((res) => {
      if (res) {
        if (setProvidersContext) setProvidersContext([...providers, res]);
        setAddVisible(false);
        toast.current?.show({
          severity: "success",
          summary: "Proveedor creado",
          detail: `El proveedor ${res.name} ha sido creado con éxito`,
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: `El proveedor no ha sido creado`,
          life: 3000,
        });
      }
      reset();
    });
  });

  const deviceType = UseDeviceScreenType();

  return (
    <>
      <div className="flex flex-col gap-8  max-h-[95vh] h-full">
        <h1 className="text-neutral-100 text-3xl text-center font-bold bg-jair py-3 border-2 border-slate-400 rounded-md">
          <span>
            <i className="pi pi-search" style={{ fontSize: "1.5rem" }}></i>
          </span>{" "}
          Listado de Proveedores
        </h1>
        <div className="flex gap-4 justify-center">
          <span className="p-input-icon-left">
            <i className="pi pi-search"></i>
            <InputText
              type="search"
              placeholder="Buscar"
              value={searchTermInput}
              onChange={handleSearch}
              className="md:w-auto lg:w-[45rem] w-52 md:h-full h-11"
            />
          </span>
          <Button
            label={
              deviceType === DEVICE_TYPE_ENUM.MOBILE ? "" : "Agregar proveedor"
            }
            severity="info"
            raised
            icon="pi pi-plus"
            className="md:w-36 w-18 text-xs md:text-sm md:mr-36 p-button-success"
            onClick={() => setAddVisible(true)}
          />
        </div>
        <DataTable
          value={filteredProviders}
          tableStyle={{ minWidth: "50rem" }}
          className="centered-table md:min-h-[60vh] min-h-[30vh] "
          loading={loading}
          size="small"
          tableClassName="md:min-h-[60vh] min-h-[30vh] "
          cellClassName={() => {
            return "max-h-[10vh] overflow-hidden";
          }}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 15]}
          scrollable
          scrollHeight="flex"
        >
          {columns.map((col) => {
            if (col.field === "actions") {
              return (
                <Column
                  key={col.field}
                  style={{
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                  header={col.header}
                  headerStyle={{ textAlign: "center" }}
                  body={(rowData) => (
                    <div className="action-buttons flex gap-6">
                      <Button
                        icon="pi pi-pencil"
                        severity="info"
                        tooltip="Modificar"
                        aria-label="User"
                        onClick={() => handleModify(rowData)}
                      />
                      <Toast ref={toast} />
                      <ConfirmPopup />
                      {/* <Button
                        icon="pi pi-eraser"
                        severity="danger"
                        aria-label="Cancel"
                        onClick={(e) => confirm(e, rowData)}
                      /> */}
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

        {provider !== undefined && (
          <ModifyProviderDialog
            toast={toast}
            provider={provider}
            onHide={() => setEditVisible(false)}
            visible={editVisible}
            setEditVisible={setEditVisible}
            setProvidersContext={setProvidersContext}
            updateMethod={updateProvider}
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
              Agregar un proveedor
            </h1>
            {allForms.map((form, i) => (
              <div className="py-3 block mt-3" key={i}>
                <span className="p-float-label">
                  <InputText
                    className="border border-solid border-gray-300 py-2 px-4 rounded-full w-full"
                    keyfilter={form.keyfilter as KeyFilterType}
                    placeholder={form.placeholder}
                    maxLength={form.maxLength}
                    {...register(form.name, {
                      required: form.alertText,
                      validate: (value) => {
                        if (form.name === "identification") {
                          if (
                            idType === "" ||
                            idType === "Selecciona una opción" ||
                            idType === undefined
                          ) {
                            return "Debe seleccionar un tipo de identificación";
                          }
                          if (idType === "CÉDULA") {
                            return validateDni(value);
                          } else if (idType === "RUC") {
                            return validateRuc(value);
                          } else if (idType === "PASAPORTE") {
                            return value.length >= 9 && value.length <= 15;
                          }
                        }
                        if (form.name === "email") {
                          return (
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                              value
                            ) || form.alertText
                          );
                        }
                        return true;
                      },
                    })}
                  />
                  <label className="block pb-2">{form.label}</label>
                </span>
                {errors[form.name] && (
                  <small className="text-red-500">{form.alertText}</small>
                )}
              </div>
            ))}
            <div className="card flex justify-content-center py-4 w-full">
              <ComboBox
                label="Tipo de identificación"
                options={IDENTIFICATION_TYPES}
                defaultValue="Selecciona una opción"
                onChange={(e) => {
                  handleId(e);
                }}
              ></ComboBox>
            </div>
            <div className="flex justify-center gap-4 py-4">
              <Button
                label="Agregar"
                severity="info"
                className="w-1/2"
                onClick={handleRegister}
              />
            </div>
          </form>
          <div className="flex justify-center px-16">
            <Button
              label="Cancelar"
              severity="danger"
              className="w-1/2"
              onClick={() => {
                reset();
                setAddVisible(false);
              }}
            />
          </div>
        </Dialog>
      </div>
    </>
  );
}

"use client";
import ComboBox from "@/components/ComboBox";
import {
  handleCreateCustomer,
  handleDeleteCustomer,
  handleGetAllCustomers,
} from "@/store/api/customerApi";
import { ICustomerResponse, ICustomerUpdate } from "@/store/types/ICustomer";
import { IInputsForm } from "@/store/types/IForms";
import { IDENTIFICATION_TYPES } from "@/store/types/Tables";
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

export default function CustomerTable({
  setCustomersContext,
}: {
  setCustomersContext?: any;
}) {
  const [customers, setCustomers] = useState<ICustomerResponse[]>([]);
  const [customer, setCustomer] = useState<ICustomerResponse>();
  const [searchTerm, setSearchTerm] = useState("");
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
    { field: "lastName", header: "Apellido" },
    { field: "email", header: "Correo" },
    { field: "businessName", header: "Razón Social" },
    { field: "identification", header: "Identificación" },
    { field: "address", header: "Dirección" },
    { field: "identificationType", header: "Tipo de identificación" },
    { field: "actions", header: "Acciones" },
  ];

  useEffect(() => {
    handleGetAllCustomers().then((res) => {
      if (res) {
        setCustomers(res);
      }
    });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers = customers.filter((customer) => {
    return Object.values(customer).some((value) => {
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const handleModify = (customer: ICustomerResponse) => {
    setCustomer(customer);
    setEditVisible(true);
  };

  const confirm = (
    event: React.MouseEvent<HTMLButtonElement>,
    customer: ICustomerResponse
  ) => {
    confirmPopup({
      target: event.currentTarget,
      message: "¿Está seguro que desea eliminar este usuario?",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept() {
        accept(customer);
      },
      reject,
    });
  };

  const accept = (customer: ICustomerResponse) => {
    toast.current?.show({
      severity: "info",
      summary: "SConfirmed",
      detail: "You have accepted",
      life: 3000,
    });
    handleDelete(customer);
  };

  const handleDelete = (customer: ICustomerResponse) => {
    console.log(customer);
    handleDeleteCustomer(customer.id).then((res) => {
      if (res) {
        toast.current?.show({
          severity: "success",
          summary: "Cliente eliminado",
          detail: `El cliente ${customer.name} ha sido eliminado con éxito`,
          life: 3000,
        });
        setCustomers(customers.filter((c) => c.id !== customer.id));
        if (setCustomersContext)
          setCustomersContext(customers.filter((c) => c.id !== customer.id));
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: `El cliente no ha sido eliminado`,
          life: 3000,
        });
      }
    });
  };

  const reject = () => {
    toast.current?.show({
      severity: "info",
      summary: "Rejected",
      detail: "You have rejected",
      life: 3000,
    });
  };

  const allForms: IInputsForm[] = [
    {
      name: "name",
      label: "Nombre",
      keyfilter: "alpha",
      placeholder: "Ingrese su nombre",
      alertText: "El nombre es requerido",
      onChange: () => {},
    },
    {
      name: "lastName",
      label: "Apellido",
      keyfilter: "alpha",
      placeholder: "Ingrese su apellido",
      alertText: "El apellido es requerido",
      onChange: () => {},
    },
    {
      name: "email",
      label: "Correo",
      keyfilter: "email",
      placeholder: "Ingrese su correo",
      alertText: "El correo es requerido",
      onChange: () => {},
    },
    {
      name: "businessName",
      label: "Razón Social",
      keyfilter: /^[A-Za-z ]$/,
      placeholder: "Ingrese su razón social",
      alertText: "La razón social es requerida",
      onChange: () => {},
    },
    {
      name: "identification",
      label: "Identificación",
      keyfilter: "num",
      placeholder: "Ingrese su identificación",
      alertText: "La identificación es requerida",
      onChange: () => {},
    },
    {
      name: "address",
      label: "Dirección",
      keyfilter: /^[A-Za-z ]$/,
      placeholder: "Ingrese su dirección",
      alertText: "La dirección es requerida",
      onChange: () => {},
    },
  ];

  const handleId = (e: any) => {
    setIdType(e);
  };

  const handleRegister = handleSubmit((data: any) => {
    const newCustomer: ICustomerUpdate = {
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      businessName: data.businessName,
      identification: data.identification,
      address: data.address,
      identificationType: idType,
    };

    handleCreateCustomer(newCustomer).then((res) => {
      if (res) {
        setCustomers([...customers, res]);
        if (setCustomersContext) setCustomersContext([...customers, res]);
        setAddVisible(false);
        toast.current?.show({
          severity: "success",
          summary: "CLiente creado",
          detail: `El cliente ${res.name} ha sido creado con éxito`,
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: `El cliente no ha sido creado`,
          life: 3000,
        });
      }
    });
  });

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="text-neutral-100 text-3xl text-center font-bold">
          <span>
            <i className="pi pi-search" style={{ fontSize: "1.5rem" }}></i>
          </span>{" "}
          Listado de Clientes
        </h1>
        <div className="flex gap-4 justify-between">
          <div className="p-input-icon-left">
            <i className="pi pi-search" style={{ fontSize: "1.2rem" }}></i>
            <InputText
              type="search"
              placeholder="Buscar"
              value={searchTerm}
              onChange={handleSearch}
              className="w-96"
            />
          </div>
          <Button
            label="Agregar Cliente"
            severity="info"
            raised
            icon="pi pi-plus"
            className="p-button-success"
            onClick={() => setAddVisible(true)}
          />
        </div>
        <DataTable
          value={filteredCustomers}
          tableStyle={{ minWidth: "50rem" }}
          className="centered-table"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 15]}
        >
          {columns.map((col, i) => {
            if (col.field === "actions") {
              return (
                <Column
                  key={col.field}
                  style={{
                    display: "flex",
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
                        aria-label="User"
                        onClick={() => handleModify(rowData)}
                      />
                      <Toast ref={toast} />
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

        {customer !== undefined && (
          <ModifyClientDialog
            toast={toast}
            customer={customer}
            onHide={() => setEditVisible(false)}
            visible={editVisible}
            setEditVisible={setEditVisible}
            setCustomers={setCustomers}
            setCustomersContext={setCustomersContext}
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
              Agregar un cliente
            </h1>
            {allForms.map((form, i) => (
              <div className="py-3 block mt-3" key={i}>
                <span className="p-float-label">
                  <InputText
                    className="border border-solid border-gray-300 py-2 px-4 rounded-full w-full"
                    keyfilter={form.keyfilter as KeyFilterType}
                    placeholder={form.placeholder}
                    {...register(form.name, {
                      required: form.alertText,
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

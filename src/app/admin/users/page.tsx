"use client";
import React, { useState, useEffect, useRef, MouseEvent } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  handleCreateUser,
  handleDeleteUser,
  handleGetAllUsers,
} from "@/store/api/userApi";
import IUserResponse, {
  IUserRegister,
  UserRoles,
} from "@/store/interfaces/IUserResponses";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { IInputsForm } from "@/store/interfaces/IForms";
import { useForm } from "react-hook-form";
import { KeyFilterType } from "primereact/keyfilter";
import ModifyUserDialog from "@/components/modifyUserDialog";
import ComboBox from "@/components/ComboBox";
import PageContainer from "@/components/pages/page-container";

export default function DynamicColumnsDemo() {
  const toast = useRef<Toast>(null);
  const [users, setUsers] = useState<IUserResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [userM, setUser] = useState<IUserResponse>();
  const [newUserRol, setNewUserRol] = useState<string>("");

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
    { field: "rol", header: "Rol" },
    { field: "actions", header: "Acciones" },
  ];

  useEffect(() => {
    handleGetAllUsers().then((res) => {
      if (res) {
        setUsers(res);
      }
    });
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleModify = (userM: IUserResponse) => {
    setUser(userM);
    setEditVisible(true);
  };

  const handleDelete = (user: IUserResponse) => {
    handleDeleteUser(user.id).then((res) => {
      if (res) {
        toast.current?.show({
          severity: "success",
          summary: "Usuario eliminado",
          detail: `El usuario ${user.name} ha sido eliminado con éxito`,
          life: 3000,
        });
        setUsers(users.filter((u) => u.id !== user.id));
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: `Ha ocurrido un error al eliminar el usuario`,
          life: 3000,
        });
      }
    });
  };

  const confirm = (
    event: MouseEvent<HTMLButtonElement>,
    user: IUserResponse
  ) => {
    confirmPopup({
      target: event.currentTarget,
      message: "¿Está seguro que desea eliminar este usuario?",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept() {
        accept(user);
      },
      reject,
    });
  };

  const accept = (user: IUserResponse) => {
    toast.current?.show({
      severity: "info",
      summary: "SConfirmed",
      detail: "You have accepted",
      life: 3000,
    });
    handleDelete(user);
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
      keyfilter: /^[A-Za-z ]$/,
      placeholder: "Nombre del Usuario",
      alertText: "*El nombre es obligatorio",
      onChange: () => {},
    },
    {
      name: "lastName",
      label: "Apellido",
      keyfilter: /^[A-Za-z ]$/,
      placeholder: "Apellido del Usuario",
      alertText: "*El apellido es obligatorio",
      onChange: () => {},
    },
    {
      name: "email",
      label: "Correo",
      keyfilter: "email",
      placeholder: "Correo electrónico",
      alertText: "*El correo es obligatorio",
      onChange: () => {},
    },
    {
      name: "password",
      label: "Contraseña",
      keyfilter: "alphanum",
      placeholder: "Contraseña",
      alertText: "*La contraseña es obligatoria",
      onChange: () => {},
    },
  ];

  const handleRegister = handleSubmit((data: any) => {
    const newUser: IUserRegister = {
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      rol: newUserRol as UserRoles,
    };

    handleCreateUser(newUser).then((res) => {
      if (res) {
        setUsers([...users, res]);
        setAddVisible(false);
        toast.current?.show({
          severity: "success",
          summary: "Usuario creado",
          detail: `El usuario ${res.name} ha sido creado con éxito`,
          life: 3000,
        });
        reset();
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: `Ha ocurrido un error al crear el usuario`,
          life: 3000,
        });
      }
    });
  });

  const handleRol = (e: any) => {
    setNewUserRol(e);
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-8">
        <h1 className="text-neutral-100 text-3xl text-center font-bold bg-jair py-3 border-2 border-slate-400 rounded-md">
          <span>
            <i className="pi pi-search" style={{ fontSize: "1.5rem" }}></i>
          </span>{" "}
          Listado de Usuarios
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
            label="Agregar Usuario"
            severity="info"
            raised
            icon="pi pi-plus"
            className="p-button-success"
            onClick={() => setAddVisible(true)}
          />
        </div>
        <DataTable
          value={filteredUsers}
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
                        tooltip="Modificar"
                        onClick={() => handleModify(rowData)}
                      />
                      <Toast ref={toast} />
                      <ConfirmPopup />
                      <Button
                        icon="pi pi-eraser"
                        severity="danger"
                        tooltip="Eliminar"
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

        {userM !== undefined && (
          <ModifyUserDialog
            user={userM}
            onHide={() => setEditVisible(false)}
            visible={editVisible}
            setEditVisible={setEditVisible}
            setUsers={setUsers}
            toast={toast}
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
              Agregar un usuario
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
                label="Rol"
                options={["Usuario", "Administrador"]}
                defaultValue="Selecciona una opción"
                onChange={(e) => {
                  handleRol(e);
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
    </PageContainer>
  );
}

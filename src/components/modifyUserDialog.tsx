import { handleUpdateUser } from "@/store/api/userApi";
import { IInputsForm } from "@/store/interfaces/IForms";
import IUserResponse, { IUserUpdate } from "@/store/interfaces/IUserResponses";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { KeyFilterType } from "primereact/keyfilter";
import { Toast } from "primereact/toast";
import React, { RefObject, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
  toast: RefObject<Toast>;
  user: IUserResponse;
  onHide: () => void;
  visible: boolean;
  setEditVisible: (value: boolean) => void;
  setUsers: any;
}

export default function modifyUserDialog({
  user,
  onHide,
  visible,
  setEditVisible,
  setUsers,
  toast,
}: Props) {
  const [userInfo, setUserInfo] = React.useState<IInputsForm[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    if (user !== undefined) {
      createUserInfo(user);
    }
  }, [user]);

  const createUserInfo = (user: IUserResponse) => {
    const userInfo: IInputsForm[] = [
      {
        name: "name",
        label: "Nombre",
        keyfilter: /^[A-Za-z ]$/,
        placeholder: "Nombre del Usuario",
        alertText: "*El nombre es obligatorio",
        value: user?.name,
        onChange: () => {},
      },
      {
        name: "lastName",
        label: "Apellido",
        keyfilter: /^[A-Za-z ]$/,
        placeholder: "Apellido del Usuario",
        alertText: "*El apellido es obligatorio",
        value: user?.lastName,
        onChange: () => {},
      },
      {
        name: "email",
        label: "Correo",
        keyfilter: "email",
        placeholder: "Correo electrónico",
        alertText: "*El correo es obligatorio",
        value: user?.email,
        onChange: () => {},
      },
      {
        name: "password",
        label: "Contraseña",
        keyfilter: "alphanum",
        placeholder: "Contraseña",
        alertText: "*La contraseña es obligatoria",
      },
      {
        name: "confirmPassword",
        label: "Confirmar Contraseña",
        keyfilter: "alphanum",
        placeholder: "Confirmar Contraseña",
        alertText: "*La contraseña es obligatoria",
      },
    ];
    setUserInfo(userInfo);
  };

  const onSubmit = handleSubmit((data: any) => {
    const userToUpdate: IUserUpdate = {
      name: data.name === user.name ? null : data.name,
      lastName: data.lastName === user.lastName ? null : data.lastName,
      email: data.email === user.email ? null : data.email,
      password: data.password === undefined ? null : data.password,
    };

    if (data.password !== "" || data.password !== undefined) {
      if (data.password !== data.confirmPassword) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Las contraseñas no coinciden",
          life: 3000,
        });
        return;
      }
    }

    handleUpdateUser(user.id, userToUpdate).then((res) => {
      if (res) {
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Usuario Modificado",
          life: 3000,
        });
        setEditVisible(false);
        setUsers((prevState: IUserResponse[]) => {
          const index = prevState.findIndex((p) => p.id === user.id);
          prevState[index] = res;
          return [...prevState];
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error al modificar el usuario",
          life: 3000,
        });
      }
    });
  });

  const renderModifyDialog = (user: IUserResponse) => {
    return (
      <div>
        <form>
          {userInfo.map((user, index) => (
            <div className="py-4 block" key={index}>
              <span className="p-float-label">
                <Toast ref={toast} />
                <Controller
                  name={user.name}
                  control={control}
                  rules={{ required: false }}
                  defaultValue={user.value}
                  render={({ field }) => (
                    <>
                      <InputText
                        {...field}
                        className="border border-solid border-gray-300 py-2 px-4 rounded-full w-full"
                        keyfilter={user.keyfilter as KeyFilterType}
                        placeholder={user.placeholder}
                      />
                      {errors[user.name] && (
                        <small className="text-red-500">{user.alertText}</small>
                      )}
                    </>
                  )}
                  shouldUnregister
                />
                <label className="block pb-2" htmlFor={user.name}>
                  {user.label}
                </label>
              </span>
            </div>
          ))}
        </form>
        <div className="flex justify-center gap-8">
          <Button
            icon="pi pi-check"
            className="p-button-success p-mr-2 w-1/2"
            label="Modificar"
            typeof="submit"
            onClick={onSubmit}
          />
        </div>
        <div className="flex justify-center items-center py-6">
          <Button
            label="Cancelar"
            severity="danger"
            className="w-1/2"
            type="button"
            onClick={() => {
              setEditVisible(false);
            }}
            icon="pi pi-times"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog
        header={"Modificar " + `${user?.name}`}
        headerClassName="text-center text-3xl font-bold"
        visible={visible}
        onHide={onHide}
        style={{ width: "50vw" }}
        modal={true}
      >
        {renderModifyDialog(user)}
      </Dialog>
    </>
  );
}

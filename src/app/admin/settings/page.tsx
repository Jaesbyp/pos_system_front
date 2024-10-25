"use client";
import {
  handleDeleteStoreSignature,
  handleGetStore,
  handleUpdateStore,
} from "@/store/api/storeApi";
import { IInputsForm } from "@/store/interfaces/IForms";
import { IStoreResponse, IStoreUpdate } from "@/store/interfaces/IStore";
import { InputText } from "primereact/inputtext";
import { KeyFilterType } from "primereact/keyfilter";
import { Toast } from "primereact/toast";
import React, { MouseEvent, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import { validateRuc } from "@/store/utils/dniRucValidator";

export default function page() {
  const [store, setStore] = React.useState<IStoreResponse>();
  const [signature, setSignature] = React.useState<any>(null);
  const toast = useRef<Toast>(null);
  const [modifyView, setModifyView] = React.useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm();

  useEffect(() => {
    handleGetStore().then((res) => {
      if (res !== undefined) {
        setStore(res);
      }
    });
  }, []);

  useEffect(() => {
    if (store) updateStoreLocal(store);
  }, [store]);

  const updateStoreLocal = (store: IStoreResponse) => {
    const storeLocal = window.localStorage.getItem("storeLocal");
    if (storeLocal) {
      const storeLocalParsed = JSON.parse(storeLocal);
      storeLocalParsed.storeLocal.store = store;
      window.localStorage.removeItem("storeLocal");
      window.localStorage.setItem(
        "storeLocal",
        JSON.stringify(storeLocalParsed)
      );
    }
  };

  const storeInfo: IInputsForm[] = [
    {
      name: "storeName",
      label: "Nombre de la Empresa",
      keyfilter: /^[a-zA-Z ]*$/,
      placeholder: "Nombre de la Empresa",
      alertText: "*El nombre es obligatorio",
      value: store?.storeName,
    },
    {
      name: "tradeName",
      label: "Nombre Comercial",
      keyfilter: /^[a-zA-Z ]*$/,
      placeholder: "Nombre Comercial de la Empresa",
      alertText: "*El nombre comercial es obligatorio",
      value: store?.tradeName,
    },
    {
      name: "ruc",
      label: "RUC",
      keyfilter: "num",
      placeholder: "RUC de la Empresa",
      alertText: "*El RUC es inválido",
      value: store?.ruc,
    },
    {
      name: "address",
      label: "Dirección",
      keyfilter: /^[a-zA-Z ]*$/,
      placeholder: "Dirección de la Empresa",
      alertText: "*La dirección es obligatoria",
      value: store?.address,
    },
  ];

  const handleSignature = ({ files }: any) => {
    setSignature(files[0]);
  };

  const handleDeleteSignature = () => {
    handleDeleteStoreSignature().then((res) => {
      if (res) {
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Firma eliminada correctamente",
        });
        setSignature(null);
        setStore(res);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo eliminar la firma",
        });
      }
    });
  };

  const confirm = (event: MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Quieres eliminar la firma?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    });
  };

  const accept = () => {
    handleDeleteSignature();
  };

  const reject = () => {
    toast.current?.show({
      severity: "warn",
      summary: "Rejected",
      detail: "Has cancelado la eliminación de la firma",
      life: 3000,
    });
  };

  const onSubmit = handleSubmit((data: any) => {
    const storeUpdateData: IStoreUpdate = {
      storeName: data.storeName === store?.storeName ? null : data.storeName,
      tradeName: data.tradeName === store?.tradeName ? null : data.tradeName,
      ruc: data.ruc === store?.ruc ? null : data.ruc,
      address: data.address === store?.address ? null : data.address,
    };

    handleUpdateStore(storeUpdateData, signature).then((res) => {
      if (res) {
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Datos actualizados correctamente",
        });
        setStore(res);
        setModifyView(false);
        reset();
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo actualizar los datos",
        });
      }
    });
  });

  return (
    <div className=" border-2 border-slate-400 px-32  py-8 rounded-lg">
      <div className="flex gap-8 flex-col justify-evenly">
        <i
          className="pi pi-user"
          style={{ fontSize: "5rem", textAlign: "center" }}
        ></i>
        <div>
          <h1 className="text-center font-bold text-5xl">Modificar Perfil</h1>
        </div>

        <div>
          {storeInfo.map((store, index) => (
            <div className="py-4 block" key={index}>
              <span className="p-float-label">
                <Toast ref={toast} />
                <Controller
                  name={store.name}
                  control={control}
                  rules={{ required: false }}
                  defaultValue={store.value}
                  render={({ field }) => (
                    <>
                      <InputText
                        {...field}
                        className="border border-solid border-gray-300 py-2 px-4 rounded-full w-full"
                        keyfilter={store.keyfilter as KeyFilterType}
                        placeholder={store.placeholder}
                        defaultValue={store.value}
                        {...register(store.name, {
                          required: store.alertText,
                          validate: (value) => {
                            if (store.name === "ruc") {
                              return validateRuc(value);
                            }
                            return true;
                          },
                        })}
                      />
                      {errors[store.name] && (
                        <small className="text-red-500">
                          {store.alertText}
                        </small>
                      )}
                    </>
                  )}
                  shouldUnregister
                />
                <label className="block pb-2" htmlFor={store.name}>
                  {store.label}
                </label>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        {store?.electronicSignatureKey && (
          <div className="flex justify-center h-12">
            <div className="flex justify-items-center place-self-center rounded-md w-1/2 pr-4">
              <h5 className="font-bold h-12 text-center text-2xl bg-jair-black w-full rounded-md">
                <Avatar icon="pi pi-paperclip" size="normal" shape="circle" />
                {" " + store?.electronicSignatureKey.split("/")[1]}
              </h5>
            </div>
            <div className="flex">
              <Button
                icon="pi pi-pencil"
                type="button"
                className="p-button-info p-mr-2"
                label="Modificar firma"
                onClick={() => {
                  toast.current?.show({
                    severity: "info",
                    summary: "Info",
                    detail:
                      "Se eliminará la firma actual.\nNota: el fichero siempre tendrá el mismo nombre",
                    life: 5000,
                  });
                  setModifyView(true);
                }}
              />
            </div>
            <div className="flex pl-4">
              <ConfirmPopup />
              <Button
                icon="pi pi-times"
                type="button"
                className="p-button-danger p-mr-2"
                label="Eliminar firma"
                onClick={(e) => confirm(e)}
              />
            </div>
          </div>
        )}
        {modifyView || store?.electronicSignatureKey == null ? (
          <div>
            <h5 className="font-bold ">Firma electrónica</h5>
            <FileUpload
              name="signature"
              accept=".p12"
              maxFileSize={1000000}
              customUpload={true}
              uploadHandler={handleSignature}
              emptyTemplate={
                <p className="m-0">Drag and drop files to here to upload.</p>
              }
              auto={true}
            />
          </div>
        ) : null}

        <div className="flex justify-center gap-8">
          <Button
            icon="pi pi-check"
            className="p-button-success p-mr-2 w-1/2"
            label="Guardar cambios"
            typeof="submit"
            severity="help"
            onClick={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}

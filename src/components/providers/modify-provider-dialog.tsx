import { IInputsForm } from "@/store/interfaces/IForms";
import { InputText } from "primereact/inputtext";
import { KeyFilterType } from "primereact/keyfilter";
import React, { RefObject } from "react";
import { Controller, useForm } from "react-hook-form";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { IDENTIFICATION_TYPES } from "@/store/interfaces/Tables";
import validateDni, { validateRuc } from "@/store/utils/dniRucValidator";
import {
  IProviderResponse,
  IProviderUpdate,
} from "@/store/interfaces/IProvider";
import ComboBox from "../ComboBox";

interface Props {
  toast: RefObject<Toast>;
  provider: IProviderResponse;
  onHide: () => void;
  visible: boolean;
  setEditVisible: (value: boolean) => void;
  updateMethod: (
    id: number,
    data: IProviderUpdate
  ) => Promise<IProviderResponse>;
  setProvidersContext?: any;
}

export default function modifyClientDialog({
  provider,
  onHide,
  visible,
  setEditVisible,
  updateMethod,
  setProvidersContext: setProviderContext,
  toast,
}: Props) {
  const [providerInfo, setProviderInfo] = React.useState<IInputsForm[]>([]);
  const [IdType, setIdType] = React.useState<string>(
    provider.identificationTypeCode
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm();

  React.useEffect(() => {
    if (provider !== undefined) {
      createProviderInfo(provider);
    }
  }, [provider]);

  const createProviderInfo = (provider: IProviderResponse) => {
    const providerInfo = [
      {
        name: "name",
        label: "Nombre",
        keyfilter: /^[A-Za-z ]$/,
        placeholder: "Ingrese el nombre",
        alertText: "El nombre es requerido",
        value: provider?.name,
        onChange: () => {},
        maxLength: 20,
      },
      {
        name: "email",
        label: "Correo",
        keyfilter: "email",
        placeholder: "Ingrese el email",
        alertText: "El correo es inválido",
        value: provider?.email,
        onChange: () => {},
      },
      {
        name: "address",
        label: "Dirección",
        keyfilter: /^[A-Za-z ]$/,
        placeholder: "Ingrese el dirección",
        alertText: "La dirección es requerida",
        value: provider?.address,
        onChange: () => {},
      },
      {
        name: "phoneNumber",
        label: "Número de teléfono",
        keyfilter: "alphanum",
        placeholder: "Ingrese el número de teléfono",
        alertText: "El número de teléfono es inválido",
        onChange: () => {},
        value: provider?.phoneNumber,
        maxLength: 30,
      },
      {
        name: "identification",
        label: "Identificación",
        keyfilter: "alphanum",
        placeholder: "Ingrese la identificación",
        alertText: "La identificación es inválida",
        value: provider?.identification,
        onChange: () => {},
      },
    ];

    setProviderInfo(providerInfo);
  };
  const onSubmit = handleSubmit((data: any) => {
    const providerToUpdate: IProviderUpdate = {
      name: data.name === provider.name ? null : data.name,
      email: data.email === provider.email ? null : data.email,
      identification:
        data.identification === provider.identification
          ? null
          : data.identification,
      address: data.address === provider.address ? null : data.address,
      phoneNumber:
        data.phoneNumber === provider.phoneNumber
          ? undefined
          : data.phoneNumber,
      identificationTypeCode:
        IdType === provider.identificationTypeCode && IdType != null
          ? undefined
          : IdType,
    };
    console.log(providerToUpdate);
    updateMethod(provider.id, providerToUpdate).then((response) => {
      if (response) {
        toast.current?.show({
          severity: "success",
          summary: "Cliente modificado",
          detail: "Se ha modificado el cliente correctamente",
          life: 3000,
        });
        setEditVisible(false);

        if (setProviderContext) {
          setProviderContext((prevState: IProviderResponse[]) => {
            const index = prevState.findIndex((p) => p.id === provider.id);
            prevState[index] = response;
            return [...prevState];
          });
        }
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se ha podido modificar el cliente",
          life: 3000,
        });
      }
    });
  });

  const handleId = (e: any) => {
    setIdType(e);
  };

  const renderModifyDialog = (provider: IProviderResponse) => {
    return (
      <div>
        <form onSubmit={onSubmit}>
          {providerInfo.map((providerInfoField, index) => (
            <div className="py-4 block" key={index}>
              <span className="p-float-label">
                <Controller
                  name={providerInfoField.name}
                  control={control}
                  rules={{ required: false }}
                  defaultValue={providerInfoField.value}
                  render={({ field }) => (
                    <>
                      <InputText
                        {...field}
                        className="border border-solid border-gray-300 py-2 px-4 rounded-full w-full"
                        keyfilter={providerInfoField.keyfilter as KeyFilterType}
                        placeholder={providerInfoField.placeholder}
                        {...register(providerInfoField.name, {
                          required: providerInfoField.alertText,
                          validate: (value) => {
                            if (providerInfoField.name === "identification") {
                              if (
                                IdType === "" ||
                                IdType === "Selecciona una opción" ||
                                IdType === undefined
                              ) {
                                return "Debe seleccionar un tipo de identificación";
                              }
                              if (IdType === "CÉDULA") {
                                return validateDni(value);
                              } else if (IdType === "RUC") {
                                return validateRuc(value);
                              } else if (IdType === "PASAPORTE") {
                                return value.length >= 9 && value.length <= 15;
                              }
                            }
                            if (providerInfoField.name === "email") {
                              return (
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                                  value
                                ) || providerInfoField.alertText
                              );
                            }
                            return true;
                          },
                        })}
                      />
                      {errors[providerInfoField.name] && (
                        <small className="text-red-500">
                          {providerInfoField.alertText}
                        </small>
                      )}
                    </>
                  )}
                  shouldUnregister
                />
                <label className="block pb-2" htmlFor={providerInfoField.name}>
                  {providerInfoField.label}
                </label>
              </span>
            </div>
          ))}
          <div className="card flex justify-content-center pb-4 pt-0 w-full">
            <ComboBox
              label="Tipo de identificación"
              options={IDENTIFICATION_TYPES}
              initialValue={provider.identificationTypeCode ?? ""}
              onChange={(e: any) => {
                handleId(e);
              }}
            ></ComboBox>
          </div>
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
            type="submit"
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
        header={"Modificar " + `${provider?.name}`}
        headerClassName="text-center text-3xl font-bold"
        visible={visible}
        onHide={onHide}
        style={{ width: "50vw" }}
        modal={true}
      >
        {renderModifyDialog(provider)}
      </Dialog>
    </>
  );
}

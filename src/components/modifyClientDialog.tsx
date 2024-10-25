import {
  ICustomerResponse,
  ICustomerUpdate,
} from "@/store/interfaces/ICustomer";
import { IInputsForm } from "@/store/interfaces/IForms";
import { InputText } from "primereact/inputtext";
import { KeyFilterType } from "primereact/keyfilter";
import React, { RefObject } from "react";
import { Controller, useForm } from "react-hook-form";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import ComboBox from "./ComboBox";
import { IDENTIFICATION_TYPES } from "@/store/interfaces/Tables";
import { handleUpdateCustomer } from "@/store/api/customerApi";
import validateDni, { validateRuc } from "@/store/utils/dniRucValidator";

interface Props {
  toast: RefObject<Toast>;
  customer: ICustomerResponse;
  onHide: () => void;
  visible: boolean;
  setEditVisible: (value: boolean) => void;
  setCustomers: any;
  setCustomersContext?: any;
}

export default function modifyClientDialog({
  customer,
  onHide,
  visible,
  setEditVisible,
  setCustomers,
  setCustomersContext,
  toast,
}: Props) {
  const [customerInfo, setCustomerInfo] = React.useState<IInputsForm[]>([]);
  const [IdType, setIdType] = React.useState<string | null>();
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm();

  React.useEffect(() => {
    if (customer !== undefined) {
      createCustomerInfo(customer);
    }
  }, [customer]);

  const createCustomerInfo = (customer: ICustomerResponse) => {
    const customerInfo: IInputsForm[] = [
      {
        name: "name",
        label: "Nombre",
        keyfilter: /^[A-Za-z ]$/,
        placeholder: "Nombre del Cliente",
        alertText: "*El nombre es obligatorio",
        value: customer?.name,
        onChange: () => {},
      },
      {
        name: "lastName",
        label: "Apellido",
        keyfilter: /^[A-Za-z ]$/,
        placeholder: "Apellido del Cliente",
        alertText: "*El apellido es obligatorio",
        value: customer?.lastName,
        onChange: () => {},
      },
      {
        name: "email",
        label: "Correo",
        keyfilter: "email",
        placeholder: "Correo del Cliente",
        alertText: "*El correo es obligatorio",
        value: customer?.email,
        onChange: () => {},
      },
      {
        name: "businessName",
        label: "Razón Social",
        keyfilter: /^[A-Za-z ]$/,
        placeholder: "Razón Social del Cliente",
        alertText: "*La razón social es obligatoria",
        value: customer?.businessName,
        onChange: () => {},
      },
      {
        name: "identification",
        label: "Identificación",
        keyfilter: "num",
        placeholder: "Identificación del Cliente",
        alertText: "*La identificación es inválida",
        value: customer?.identification,
        onChange: () => {},
      },
      {
        name: "address",
        label: "Dirección",
        keyfilter: /^[A-Za-z ]$/,
        placeholder: "Dirección del Cliente",
        alertText: "*La dirección es obligatoria",
        value: customer?.address,
        onChange: () => {},
      },
    ];
    setCustomerInfo(customerInfo);
  };

  const onSubmit = handleSubmit((data: any) => {
    const customerToUpdate: ICustomerUpdate = {
      name: data.name === customer.name ? null : data.name,
      lastName: data.lastName === customer.lastName ? null : data.lastName,
      email: data.email === customer.email ? null : data.email,
      businessName:
        data.businessName === customer.businessName ? null : data.businessName,
      identification:
        data.identification === customer.identification
          ? null
          : data.identification,
      address: data.address === customer.address ? null : data.address,
      identificationType:
        IdType === customer.identificationType ? null : IdType,
    };
    console.log(customerToUpdate);
    handleUpdateCustomer(customer.id, customerToUpdate).then((response) => {
      if (response) {
        toast.current?.show({
          severity: "success",
          summary: "Cliente modificado",
          detail: "Se ha modificado el cliente correctamente",
          life: 3000,
        });
        setEditVisible(false);
        setCustomers((prevState: ICustomerResponse[]) => {
          const index = prevState.findIndex((p) => p.id === customer.id);
          prevState[index] = response;
          return [...prevState];
        });

        if (setCustomersContext) {
          setCustomersContext((prevState: ICustomerResponse[]) => {
            const index = prevState.findIndex((p) => p.id === customer.id);
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

  const renderModifyDialog = (customer: ICustomerResponse) => {
    return (
      <div>
        <form>
          {customerInfo.map((customer, index) => (
            <div className="py-4 block" key={index}>
              <span className="p-float-label">
                <Controller
                  name={customer.name}
                  control={control}
                  rules={{ required: false }}
                  defaultValue={customer.value}
                  render={({ field }) => (
                    <>
                      <InputText
                        {...field}
                        className="border border-solid border-gray-300 py-2 px-4 rounded-full w-full"
                        keyfilter={customer.keyfilter as KeyFilterType}
                        placeholder={customer.placeholder}
                        {...register(customer.name, {
                          required: customer.alertText,
                          validate: (value) => {
                            if (customer.name === "identification") {
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
                            if (customer.name === "email") {
                              return (
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                                  value
                                ) || customer.alertText
                              );
                            }
                            return true;
                          },
                        })}
                      />
                      {errors[customer.name] && (
                        <small className="text-red-500">
                          {customer.alertText}
                        </small>
                      )}
                    </>
                  )}
                  shouldUnregister
                />
                <label className="block pb-2" htmlFor={customer.name}>
                  {customer.label}
                </label>
              </span>
            </div>
          ))}
          <div className="card flex justify-content-center pb-4 pt-0 w-full">
            <ComboBox
              label="Tipo de identificación"
              options={IDENTIFICATION_TYPES}
              initialValue={
                customer.identificationType ? customer.identificationType : ""
              }
              onChange={(e) => {
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
        header={"Modificar " + `${customer?.name}`}
        headerClassName="text-center text-3xl font-bold"
        visible={visible}
        onHide={onHide}
        style={{ width: "50vw" }}
        modal={true}
      >
        {renderModifyDialog(customer)}
      </Dialog>
    </>
  );
}

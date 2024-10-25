import { handleUpdateCategory } from "@/store/api/categoryApi";
import { handleUpdateIvaByCategory } from "@/store/api/productApi";
import { ICategoryResponse } from "@/store/interfaces/ICategory";
import { IInputsForm } from "@/store/interfaces/IForms";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { KeyFilterType } from "primereact/keyfilter";
import { Toast } from "primereact/toast";
import React, { RefObject } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
  toast: RefObject<Toast>;
  category: ICategoryResponse;
  onHide: () => void;
  visible: boolean;
  setEditVisible: (value: boolean) => void;
  setCategory: any;
}

export default function modifyCategoryDialog({
  category,
  onHide,
  visible,
  setEditVisible,
  setCategory,
  toast,
}: Props) {
  const [categoryInfo, setCategoryInfo] = React.useState<IInputsForm[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    if (category !== undefined) {
      createCustomerInfo(category);
    }
  }, [category]);

  const createCustomerInfo = (category: any) => {
    const categoryInfo: IInputsForm[] = [
      {
        name: "name",
        label: "Nombre",
        keyfilter: /^[A-Za-z ]$/,
        placeholder: "Nombre de la categoría",
        alertText: "*El nombre es obligatorio",
        value: category?.name,
        maxLength: 20,
      },
      {
        name: "iva",
        label: "IVA",
        keyfilter: "num",
        placeholder: "IVA de la categoría",
        alertText: "*El IVA es obligatorio",
        value: category?.iva,
        maxLength: 2,
      },
    ];
    setCategoryInfo(categoryInfo);
  };

  const onSubmit = handleSubmit(async (data: any) => {
    const categoryUpdate = {
      id: category.id,
      name: data.name,
    };

    if (data.name) {
      const categoryUpdated = await handleUpdateCategory(categoryUpdate.id, {
        category: categoryUpdate.name,
      });
      if (categoryUpdated) {
        setCategory(categoryUpdated);
        setEditVisible(false);
        toast.current?.show({
          severity: "success",
          summary: "Categoría modificada",
          detail: "Se ha modificado la categoría correctamente",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se ha podido modificar la categoría",
          life: 3000,
        });
      }
    }

    if (data.iva) {
      handleUpdateIvaByCategory(category.category, data.iva).then((res) => {
        if (res) {
          toast.current?.show({
            severity: "success",
            summary: "IVA modificado",
            detail: "Se ha modificado el IVA correctamente",
            life: 3000,
          });
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se ha podido modificar el IVA",
            life: 3000,
          });
        }
      });
    }
  });

  const renderModifyDialog = (category: any) => {
    return (
      <div>
        <form>
          {categoryInfo.map((category, index) => (
            <div className="py-4 block" key={index}>
              <span className="p-float-label">
                <Controller
                  name={category.name}
                  control={control}
                  rules={{ required: false }}
                  defaultValue={category.value}
                  render={({ field }) => (
                    <>
                      <InputText
                        {...field}
                        className="border border-solid border-gray-300 py-2 px-4 rounded-full w-full"
                        keyfilter={category.keyfilter as KeyFilterType}
                        placeholder={category.placeholder}
                        maxLength={category.maxLength}
                      />
                      {errors[category.name] && (
                        <small className="text-red-500">
                          {category.alertText}
                        </small>
                      )}
                    </>
                  )}
                  shouldUnregister
                />
                <label className="block pb-2" htmlFor={category.name}>
                  {category.label}
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
        header={"Modificar " + `${category?.category}`}
        headerClassName="text-center text-3xl font-bold"
        visible={visible}
        onHide={onHide}
        style={{ width: "50vw" }}
        modal={true}
      >
        {renderModifyDialog(category)}
      </Dialog>
    </>
  );
}

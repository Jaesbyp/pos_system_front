import { IInputsForm } from "@/store/interfaces/IForms";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { KeyFilterType } from "primereact/keyfilter";
import { Toast } from "primereact/toast";
import React, { RefObject } from "react";
import { Controller, useForm } from "react-hook-form";
import { handleUpdateBranch } from "@/store/api/branchApi";
import { IBranchResponse, IBranchUpdate } from "@/store/interfaces/IBranch";

interface Props {
  toast: RefObject<Toast>;
  branch: IBranchResponse;
  visible: boolean;
  setEditVisible: (value: boolean) => void;
  setBranches: any;
}

export default function ModifyBranchDialog({
  branch: branch,
  visible,
  setEditVisible,
  setBranches,
  toast,
}: Props) {
  const [branchInfo, setBranchInfo] = React.useState<IInputsForm[]>([]);

  React.useEffect(() => {
    if (branch !== undefined) {
      createBranchInfo(branch);
    }
  }, [branch]);

  const createBranchInfo = (branch: IBranchResponse) => {
    const branchInfo: IInputsForm[] = [
      {
        name: "name",
        label: "Nombre",
        keyfilter: /^[A-Za-z ]$/,
        placeholder: "Nombre de la Sucursal",
        alertText: "*El nombre es obligatorio",
        value: branch?.name,
        onChange: () => {},
        type: "InputText",
      },
      {
        name: "address",
        label: "Dirección",
        keyfilter: /^[A-Za-z ]$/,
        placeholder: "Código Principal",
        alertText: "*El código principal es obligatorio",
        value: branch?.address,
        onChange: () => {},
        type: "InputText",
      },
    ];
    setBranchInfo(branchInfo);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data: any) => {
    const branchToUpdate: IBranchUpdate = {
      name: data.name == branch.name ? null : data.name,
      address: data.address == branch.address ? null : data.address,
    };

    handleUpdateBranch(branch.id, branchToUpdate).then((response) => {
      if (response) {
        toast.current?.show({
          severity: "success",
          summary: "Confirmado",
          detail: "Sucursal Actualizada",
          life: 3000,
        });
        setBranches((prevState: IBranchResponse[]) => {
          const index = prevState.findIndex((p) => p.id === branch.id);
          prevState[index] = response;
          return [...prevState];
        });
        setEditVisible(false);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error, Sucursal no actualizada",
          life: 3000,
        });
      }
    });
  });

  const renderDialogContent = () => {
    return (
      <div className="px-16">
        <form>
          {branchInfo.map((branch, index) => (
            <div className="py-4 block" key={index}>
              <span className="p-float-label">
                <Controller
                  name={branch.name}
                  control={control}
                  rules={{ required: false }}
                  defaultValue={branch.value}
                  render={({ field }) => (
                    <>
                      <InputText
                        {...field}
                        className="border border-solid border-gray-300 py-2 px-4 rounded-full w-full"
                        keyfilter={branch.keyfilter as KeyFilterType}
                        placeholder={branch.placeholder}
                      />
                      {errors[branch.name] && (
                        <small className="text-red-500">
                          {branch.alertText}
                        </small>
                      )}
                    </>
                  )}
                  shouldUnregister
                />
                <label className="block pb-2" htmlFor={branch.name}>
                  {branch.label}
                </label>
              </span>
            </div>
          ))}

          <div className="flex justify-center gap-8 p-4">
            <Button
              icon="pi pi-check"
              className="p-button-success p-mr-2 w-1/2"
              label="Modificar"
              type="submit"
              onClick={onSubmit}
            />
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
        </form>
      </div>
    );
  };

  return (
    <>
      <Dialog
        header={"Modificar Sucursal: " + `${branch?.name}`}
        headerClassName="text-center text-3xl font-bold"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          setEditVisible(false);
        }}
        modal={true}
      >
        {renderDialogContent()}
      </Dialog>
    </>
  );
}

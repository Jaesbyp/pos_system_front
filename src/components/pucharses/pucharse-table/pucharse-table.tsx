import { IProductResponse } from "@/store/interfaces/IProducts";
import { IPucharseCreate } from "@/store/interfaces/pucharses/IPucharse";
import { IPucharseDetail } from "@/store/interfaces/pucharses/IPucharseDetail";
import { ValueOf } from "next/dist/shared/lib/constants";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { SetStateAction } from "react";
import { UseFormSetValue, Control, Controller } from "react-hook-form";
import { PUCHARSE_TABLE_COLUMNS } from "./pucharse-table-columns";
import { IProductDropdown } from "../pucharses-register";

interface intp {
  setProductTable: {
    (value: SetStateAction<IProductResponse[]>): void;
    (arg0: any[]): void;
  };
  setProductsSelected: {
    (value: SetStateAction<IProductResponse[]>): void;
    (arg0: any[]): void;
  };
  productTable: IProductResponse[];
  setDisables: {
    (value: SetStateAction<boolean>): void;
    (arg0: boolean): void;
  };
  productsDropdown: {}[];
  setValue: UseFormSetValue<IPucharseCreate>;
  watch: (value: string) => ValueOf<IPucharseCreate>;
  handleDelete: (product: IProductResponse) => void;
  control: Control<IPucharseCreate> | undefined;
  setEffect: {
    (value: SetStateAction<boolean>): void;
    (arg0: boolean): void;
  };
  effect: boolean;
  total: number;
  confirm: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  loading: boolean;
}

function PucharseProductTableComponent({
  setProductTable,
  setProductsSelected,
  productTable,
  setDisables,
  productsDropdown,
  setValue,
  watch,
  handleDelete,
  control,
  setEffect,
  effect,
  total,
  confirm,
  onSubmit,
  loading,
}: intp) {
  return (
    <div className="flex flex-col py-8 px-4 border border-opacity-5 rounded-sm">
      <div className="flex flex-col w-full px-3     ">
        <label htmlFor="client" className="pb-2">
          <strong>Agregar Producto:</strong>
        </label>
        <Dropdown
          onChange={(e) => {
            setProductTable([...productTable, e.value]);
            setProductsSelected((prevProducts) => [...prevProducts, e.value]);
            setDisables(true);
          }}
          options={productsDropdown}
          placeholder="Seleccione un producto"
          filter
          className="w-full md:w-14rem"
        />
      </div>
      <div className="flex flex-col w-full py-6 px-3">
        <DataTable
          value={productTable}
          className="p-datatable-sm"
          scrollable
          scrollHeight="1000px"
          showGridlines
          stripedRows
          height={1000}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          rowClassName={(...rowData) => {
            return "bg-gray-800";
          }}
        >
          {PUCHARSE_TABLE_COLUMNS.map((column) => {
            if (column.field === "delete") {
              return (
                <Column
                  className="w-1.5"
                  align={"center"}
                  alignHeader={"center"}
                  key={column.field}
                  field={column.field}
                  header={column.header}
                  body={(rowData) => {
                    return (
                      <Button
                        className="p-button-danger"
                        type="button"
                        icon="pi pi-trash"
                        onClick={() => {
                          setValue(
                            "pucharseDetails",
                            (
                              watch("pucharseDetails") as IPucharseDetail[]
                            ).filter((p) => p.productId !== rowData.id)
                          );
                          handleDelete(rowData);
                        }}
                      />
                    );
                  }}
                />
              );
            } else if (column.field === "quantity") {
              return (
                <Column
                  alignHeader={"center"}
                  align={"center"}
                  key={column.field}
                  field={column.field}
                  header={column.header}
                  style={{ width: column.width }}
                  body={(rowData) => {
                    return (
                      <Controller
                        name={"pucharseDetails"}
                        control={control}
                        rules={{ required: true }}
                        defaultValue={[]}
                        render={({ field }) => (
                          <InputNumber
                            inputClassName="w-20"
                            defaultValue={0}
                            showButtons
                            min={0}
                            value={
                              field.value.find(
                                (p) => p.productId === rowData.id
                              )?.quantity || 0
                            }
                            onValueChange={(e) => {
                              const pucharseDetails = field.value.find(
                                (p) => p.productId === rowData.id
                              );

                              const pucharseDetailObject = {
                                productId: rowData.id,
                                quantity: e.value || 1,
                                unitPrice:
                                  pucharseDetails?.unitPrice ||
                                  rowData.unitPrice,
                                unitDiscount:
                                  pucharseDetails?.unitDiscount ||
                                  rowData.unitDiscount,
                              };

                              if (pucharseDetails) {
                                setValue(
                                  "pucharseDetails",
                                  field.value.map((p) =>
                                    p.productId === rowData.id
                                      ? pucharseDetailObject
                                      : p
                                  )
                                );
                              } else {
                                setValue(
                                  "pucharseDetails",
                                  field.value.concat(pucharseDetailObject)
                                );
                              }
                              setEffect(!effect);
                            }}
                          />
                        )}
                      />
                    );
                  }}
                />
              );
            } else if (column.field === "unitPrice") {
              return (
                <Column
                  alignHeader={"center"}
                  align={"center"}
                  key={column.field}
                  field={column.field}
                  header={column.header}
                  style={{ width: column.width }}
                  body={(rowData) => {
                    return (
                      <Controller
                        name={"pucharseDetails"}
                        control={control}
                        rules={{ required: true }}
                        defaultValue={[]}
                        render={({ field }) => (
                          <InputNumber
                            inputClassName="w-20"
                            defaultValue={1}
                            showButtons
                            currency="USD"
                            min={0.01}
                            value={
                              field.value.find(
                                (p) => p.productId === rowData.id
                              )?.unitPrice || rowData.unitPrice
                            }
                            onValueChange={(e) => {
                              const pucharseDetails = field.value.find(
                                (p) => p.productId === rowData.id
                              );

                              const pucharseDetailObject = {
                                productId: rowData.id,
                                quantity:
                                  pucharseDetails?.quantity || rowData.quantity,
                                unitPrice: e.value || 1,
                                unitDiscount:
                                  pucharseDetails?.unitDiscount ||
                                  rowData.unitDiscount,
                              };

                              if (pucharseDetails) {
                                setValue(
                                  "pucharseDetails",
                                  field.value.map((p) =>
                                    p.productId === rowData.id
                                      ? pucharseDetailObject
                                      : p
                                  )
                                );
                              } else {
                                setValue(
                                  "pucharseDetails",
                                  field.value.concat(pucharseDetailObject)
                                );
                              }
                              setEffect(!effect);
                            }}
                          />
                        )}
                      />
                    );
                  }}
                />
              );
            } else if (column.field === "unitDiscount") {
              return (
                <Column
                  alignHeader={"center"}
                  align={"center"}
                  key={column.field}
                  field={column.field}
                  header={column.header}
                  style={{ width: column.width }}
                  body={(rowData) => {
                    return (
                      <Controller
                        name={"pucharseDetails"}
                        control={control}
                        rules={{ required: true }}
                        defaultValue={[]}
                        render={({ field }) => (
                          <InputNumber
                            inputClassName="w-20"
                            defaultValue={0.0}
                            showButtons
                            min={0}
                            value={
                              field.value.find(
                                (p) => p.productId === rowData.id
                              )?.unitDiscount || 0.0
                            }
                            onValueChange={(e) => {
                              const pucharseDetails = field.value.find(
                                (p) => p.productId === rowData.id
                              );

                              const pucharseDetailObject = {
                                productId: rowData.id,
                                quantity:
                                  pucharseDetails?.quantity || rowData.quantity,
                                unitPrice:
                                  pucharseDetails?.unitPrice ||
                                  rowData.unitPrice,
                                unitDiscount: e.value || 0,
                              };

                              if (pucharseDetails) {
                                setValue(
                                  "pucharseDetails",
                                  field.value.map((p) =>
                                    p.productId === rowData.id
                                      ? pucharseDetailObject
                                      : p
                                  )
                                );
                              } else {
                                setValue(
                                  "pucharseDetails",
                                  field.value.concat(pucharseDetailObject)
                                );
                              }
                              setEffect(!effect);
                            }}
                          />
                        )}
                      />
                    );
                  }}
                />
              );
            } else if (column.field === "total") {
              return (
                <Column
                  align={column.align as any}
                  key={column.field}
                  field={column.field}
                  header={column.header}
                  bodyStyle={{ width: column.width }}
                  body={(rowData) => {
                    const pucharseDetails = (
                      watch("pucharseDetails") as IPucharseDetail[]
                    ).find((p) => p.productId === rowData.id);

                    const discount = Number(pucharseDetails?.unitDiscount);

                    let total =
                      Number(
                        rowData.unitPrice * Number(pucharseDetails?.quantity)
                      ) || 0;

                    if (discount > 0) {
                      total -= total * (discount / 100);
                    }

                    return (
                      <label className="text-lg font-bold">
                        {total.toFixed(2)}
                      </label>
                    );
                  }}
                />
              );
            } else {
              return (
                <Column
                  align={"center"}
                  key={column.field}
                  field={column.field}
                  header={column.header}
                  bodyStyle={{ width: column.width }}
                />
              );
            }
          })}
        </DataTable>
        <div className="flex flex-row justify-end pt-4">
          <div className="justify-between pt-4">
            <div className="flex flex-row justify-between">
              <p className="text-2xl font-bold">TOTAL: </p>
              <label className="text-2xl font-bold pl-4">
                $ {total.toFixed(2)}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between gap-4">
        <ConfirmPopup />
        {watch("orderDate") && watch("invoiceNumber") && (
          <>
            <Button
              className="p-button-danger p-mt-4  ml-4 w-full px-4"
              label="Cancelar"
              type="button"
              onClick={confirm}
            />
            <Button
              className="p-button-success p-mt-4 w-full px-4"
              label="Guardar"
              loading={loading}
              form="pucharseForm"
              type="submit"
              onSubmit={onSubmit}
            />
          </>
        )}
      </div>
    </div>
  );
}

export const PucharseProductTable = PucharseProductTableComponent;

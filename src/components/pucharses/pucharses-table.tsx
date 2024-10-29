"use client";

import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { handleGetAllProducts } from "@/store/api/productApi";
import { IProductResponse } from "@/store/interfaces/IProducts";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { IVAS } from "@/store/interfaces/Tables";
import { Controller, useForm } from "react-hook-form";
import { Avatar } from "primereact/avatar";
import { Dropdown } from "primereact/dropdown";
import { ICustomerResponse } from "@/store/interfaces/ICustomer";
import { handleGetAllCustomers } from "@/store/api/customerApi";
import CustomerTable from "@/components/customerTable";
import { InputNumber } from "primereact/inputnumber";
import { useRouter } from "next/navigation";
import { IStoreLocal } from "@/store/interfaces/IStore";
import { round } from "@/store/utils/uuid";
import { IInvoiceCreate } from "@/store/interfaces/IInvoices";
import { ISellingProductsEntrance } from "@/store/interfaces/ISellingProducts";
import {
  handleCreateInvoice,
  handleUpdateInvoiceValues,
} from "@/store/api/invoiceApi";
import { handleCreateSellingProducts } from "@/store/api/sellingProductApi";
import { IProviderResponse } from "@/store/interfaces/IProvider";
import { useProviders } from "@/hooks/provider/useProvider";
import ProvidersTable from "../providers/providers-table";

const PucharseRegister = () => {
  const [products, setProducts] = useState<IProductResponse[]>([]);
  const [productTable, setProductTable] = useState<IProductResponse[]>([]);
  const [provider, setProvider] = useState<IProviderResponse>();
  const [addProvider, setAddProvider] = useState<boolean>(false);
  const [providersDropdown, setProvidersDropdown] = useState<{}[]>([]);
  const [productsDropdown, setProductsDropdown] = useState<{}[]>([]);
  const [storeLocal, setStoreLocal] = useState<IStoreLocal>();
  const [disables, setDisables] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [effect, setEffect] = useState<boolean>(false);
  const router = useRouter();

  const toast = useRef<Toast>(null);

  const { providers } = useProviders();

  const { reset, setValue, handleSubmit, watch, control, formState } =
    useForm();

  useEffect(() => {
    const storeLocal = window.localStorage.getItem("storeLocal");
    if (storeLocal) {
      const storeLocalParsed = JSON.parse(storeLocal);
      setStoreLocal(storeLocalParsed.storeLocal);
    } else {
      router.push("/user/branchBox");
    }

    handleGetAllProducts().then((response) => {
      if (response) {
        setProducts(response);
        const productsDropdown = response.map((product) => {
          if (product.stock > 0) {
            return {
              label: product.name + " " + product.mainCode,
              value: product,
            };
          }
        });
        setProductsDropdown(productsDropdown as any);
      }
    });
  }, []);

  useEffect(() => {
    let subtotal = 0;
    productTable.forEach((product) => {
      subtotal += round(
        Number(product.unitPrice * Number(watch("quantity." + product.id)))
      );
    });

    setTotal(round(Number(subtotal)));
  }, [productTable, effect]);

  useEffect(() => {
    const providersDropdown = providers.map((provider) => {
      return {
        label:
          provider.name +
          " " +
          provider.address +
          " " +
          provider.identification,
        value: provider,
      };
    });
    setProvidersDropdown(providersDropdown);
  }, [providers]);

  const columns = [
    { field: "delete", header: "Eliminar", align: "center", width: "10%" },
    { field: "name", header: "Producto", width: "20%" },
    { field: "description", header: "Descripción", width: "40%" },
    { field: "stock", header: "Stock", align: "center", width: "10%" },
    { field: "quantity", header: "Cantidad", align: "center", width: "10%" },
    {
      field: "unitPrice",
      header: "P. Unitario",
      align: "center",
      width: "10%",
    },
    { field: "total", header: "Total", align: "center", width: "10%" },
  ];

  const handleDelete = (product: IProductResponse) => {
    const productsFiltered = productTable.filter(
      (productFiltered) => productFiltered.id !== product.id
    );
    setProductTable(productsFiltered);
    setProducts([...products, product]);
  };

  const confirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: event.currentTarget,
      message: "¿Está seguro que quiere cancelar esta compra?",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    });
  };

  const accept = () => {
    toast.current?.show({
      severity: "info",
      summary: "Confirmado",
      detail: "Ha cancelado la factura",
      life: 3000,
    });
    setProvider(undefined);
    reset();
    setProductTable([]);
    setDisables(false);
    window.location.reload();
  };

  const reject = () => {
    toast.current?.show({
      severity: "info",
      summary: "Rejected",
      detail: "No se canceló la compra",
      life: 3000,
    });
  };

  const onSubmit = handleSubmit((data) => {
    const invoiceCreate: IInvoiceCreate = {
      environmentType: "Pruebas",
      emissionType: "Emisión normal",
      receiptType: "FACTURA",
      customerIdentification: provider?.identification as string,
      paymentType: "SIN UTILIZACION DEL SISTEMA FINANCIERO",
      boxId: storeLocal?.box.id as number,
    };

    handleCreateInvoice(invoiceCreate).then((invoiceResponse) => {
      if (invoiceResponse) {
        const invoiceRes = invoiceResponse;
        toast.current?.show({
          severity: "info",
          summary: "En proceso",
          detail: "Se esta generando la factura",
          life: 4000,
        });

        const sellingProducts: ISellingProductsEntrance[] = productTable.map(
          (product) => {
            return {
              discount: 0,
              quantity: data.quantity[product.id] as number,
              mainCode: product.mainCode,
              invoiceId: invoiceRes.id,
            };
          }
        );

        handleCreateSellingProducts(sellingProducts).then((sellingProducts) => {
          if (sellingProducts) {
            handleUpdateInvoiceValues(invoiceRes.id).then((invoice) => {
              if (invoice) {
                toast.current?.show({
                  severity: "success",
                  summary: "Éxito",
                  detail: "Se ha creado la factura correctamente",
                  life: 3000,
                });
                setProvider(undefined);
                reset();
                setProductTable([]);
                setDisables(false);
                router.push("./invoiceList");
              } else {
                toast.current?.show({
                  severity: "error",
                  summary: "Error",
                  detail: "No se ha podido crear la factura",
                  life: 3000,
                });
              }
            });
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "No se ha podido crear la factura",
              life: 3000,
            });
          }
        });
      }
    });
  });

  return (
    <div className="flex flex-col w-11/12 ">
      <Toast ref={toast} />
      <h1 className="w-full border border-opacity-5 bg-gray-800 text-lg">
        <Avatar icon="pi pi-plus" className="bg-gray-700 m-2" />
        <strong>Nuevo registro de una compra</strong>
      </h1>
      <form
        className="border p-4 border-opacity-5 bg-gray-700"
        onSubmit={onSubmit}
      >
        <div className="flex flex-row pb-4">
          <div className="flex flex-col w-6/12 pr-6">
            <label htmlFor="client">
              <strong>Proveedor</strong>
            </label>
            <div className="flex flex-row">
              <Dropdown
                value={provider}
                options={providersDropdown}
                placeholder="Seleccione un proveedor"
                filter
                className="w-full md:w-14rem"
                onChange={(e) => setProvider(e.value)}
                disabled={disables}
              />
              <Button
                className="p-button-success h-10 w-1/12"
                icon="pi pi-plus"
                type="button"
                disabled={disables}
                onClick={() => setAddProvider(true)}
              />
            </div>
            {formState.errors["customer"] && (
              <small className="text-red-500">
                Debe seleccionar un proveedor
              </small>
            )}
            {addProvider && (
              <Dialog
                header="Agregar Proveedor"
                visible={addProvider}
                style={{ width: "50vw" }}
                onHide={() => setAddProvider(false)}
              />
            )}
          </div>
        </div>
        {provider && (
          <div className="flex flex-col py-8 px-4 border border-opacity-5 rounded-sm">
            <div className="flex flex-col w-full px-3     ">
              <label htmlFor="client" className="pb-2">
                <strong>Agregar Producto:</strong>
              </label>
              <Dropdown
                onChange={(e) => {
                  setProductTable([...productTable, e.value]);
                  setProducts(
                    products.filter((product) => product.id !== e.value.id)
                  );
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
                {columns.map((column) => {
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
                                setValue("quantity." + rowData.id, 1);
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
                              name={"quantity." + rowData.id}
                              control={control}
                              rules={{ required: true }}
                              defaultValue={1}
                              render={({ field }) => (
                                <InputNumber
                                  {...field}
                                  inputClassName="w-20"
                                  defaultValue={1}
                                  showButtons
                                  max={rowData.stock}
                                  min={1}
                                  onValueChange={(e) => {
                                    setValue("quantity." + rowData.id, e.value);
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
                          return (
                            <label className="text-lg font-bold">
                              {round(
                                Number(rowData.unitPrice) *
                                  Number(watch("quantity." + rowData.id))
                              )}
                            </label>
                          );
                        }}
                      />
                    );
                  } else {
                    return (
                      <Column
                        align={column.align as any}
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
                      {total.toFixed(2)}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between gap-4">
              <ConfirmPopup />
              <Button
                className="p-button-danger p-mt-4  ml-4 w-full px-4"
                label="Cancelar"
                type="button"
                onClick={confirm}
              />
              <Button
                className="p-button-success p-mt-4 w-full px-4"
                label="Guardar"
                type="submit"
                onSubmit={onSubmit}
              />
            </div>
          </div>
        )}
      </form>
      <Dialog
        header="Agregar Cliente"
        visible={addProvider}
        style={{ width: "60vw" }}
        onHide={() => setAddProvider(false)}
      >
        <ProvidersTable />
      </Dialog>
    </div>
  );
};

export default PucharseRegister;

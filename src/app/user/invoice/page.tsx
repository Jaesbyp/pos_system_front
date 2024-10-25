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

const invoicer = () => {
  const [products, setProducts] = useState<IProductResponse[]>([]);
  const [productTable, setProductTable] = useState<IProductResponse[]>([]);
  const [customers, setCustomers] = useState<ICustomerResponse[]>([]);
  const [customer, setCustomer] = useState<ICustomerResponse>();
  const [addCustomer, setAddCustomer] = useState<boolean>(false);
  const [change, setChange] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [customersDropdown, setCustomersDropdown] = useState<{}[]>([]);
  const [productsDropdown, setProductsDropdown] = useState<{}[]>([]);
  const [storeLocal, setStoreLocal] = useState<IStoreLocal>();
  const [disables, setDisables] = useState<boolean>(false);
  const [ivasObject, setIvasObject] = useState<any>([]);
  const [subTotals, setSubTotals] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [effect, setEffect] = useState<boolean>(false);
  const router = useRouter();

  const toast = useRef<Toast>(null);

  const myIVAS = IVAS;

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

    handleGetAllCustomers().then((response) => {
      if (response) {
        setCustomers(response);
        const customersDropdown = response.map((customer) => {
          return {
            label:
              customer.name +
              " " +
              customer.lastName +
              " " +
              customer.identification,
            value: customer,
          };
        });
        setCustomersDropdown(customersDropdown);
      }
    });
  }, []);

  useEffect(() => {
    if (
      watch("receivedCash") != undefined &&
      watch("receivedCash") != null &&
      total != 0
    ) {
      setChange(Number(watch("receivedCash")) - total);
    } else {
      setChange(0);
    }
  }, [watch("receivedCash"), total]);

  useEffect(() => {
    let subtotal = 0;
    productTable.forEach((product) => {
      subtotal += round(
        Number(product.unitPrice * Number(watch("quantity." + product.id)))
      );
    });
    setSubtotal(round(subtotal));
    setSubTotals(getSubTotals(productTable));
    setIvasObject(getIvasObject(productTable));
    const taxesTotal = round(
      getIvasObject(productTable)
        .map((iva) => Object.values(iva)[0])
        .reduce((a: any, b: any) => a + b, 0)
    );

    setTotal(round(Number(subtotal) + Number(taxesTotal)));
  }, [productTable, effect]);

  const formatIvaPrint = (key: string) => {
    if (key.split(" ").length == 1 && !key.split(" ")[0].includes("%")) {
      return "IVA " + key + "%";
    } else if (key.split(" ").length == 1 && key.split(" ")[0].includes("%")) {
      return "IVA " + key;
    } else {
      return key;
    }
  };

  const getSubTotals = (productTable: IProductResponse[]) => {
    const subTotals = productTable.map((product) => {
      return {
        [product.id]: Number(
          round(product.unitPrice * Number(watch("quantity." + product.id)))
        ),
      };
    });

    return subTotals;
  };

  const getIvasObject = (productTable: IProductResponse[]) => {
    const ivaObject = myIVAS.map((iva: string) => {
      const t = getSubTotals(
        productTable
          .map((product) => {
            if (!product.ivaVariable && product.ivaType == iva) {
              return product;
            }
          })
          .filter((product) => product != undefined) as IProductResponse[]
      )
        .map((subTotal) => {
          return round(Number(subTotal[Object.keys(subTotal)[0] as any]));
        })
        .reduce((a, b) => a + b, 0);
      return {
        [iva]: t,
      };
    });

    const ivaVariables: string[] = [];
    productTable.map((product) => {
      if (
        product.ivaVariable != undefined &&
        product.ivaVariable != null &&
        product.ivaVariable != ""
      ) {
        if (!ivaVariables.includes(product.ivaVariable)) {
          ivaVariables.push(product.ivaVariable);
        }
      }
    });

    if (ivaVariables.length > 0) {
      ivaVariables.forEach((ivaVariable: string) => {
        const products = productTable.filter(
          (product) => product.ivaVariable == ivaVariable
        );
        const subTotals = getSubTotals(products);
        const subTotal = subTotals.map((subTotal) => {
          return round(Number(subTotal[Object.keys(subTotal)[0] as any]));
        });
        const total = subTotal.reduce((a, b) => a + b, 0);
        const iva = round(total * round(Number(ivaVariable) / 100));
        ivaObject.push({ [ivaVariable]: iva });
      });
    }

    ivaObject.map((iva: any) => {
      const key = Object.keys(iva)[0];
      const value = iva[key];
      switch (key) {
        case "0%":
          iva[key] = 0;
          break;
        case "12%":
          iva[key] = round(value * 0.12);
          break;
        case "14%":
          iva[key] = round(value * 0.14);
          break;
        case "No Objeto de Impuesto":
          iva[key] = Number(0);
          break;
        case "Exento de IVA":
          iva[key] = Number(0);
          break;
        case "IVA diferenciado":
          iva[key] = 0;
          break;
        default:
          break;
      }
    });

    return ivaObject;
  };

  useEffect(() => {
    const productsDropdown = products.map((product) => {
      if (product.stock > 0) {
        return {
          label: product.name + " " + product.mainCode,
          value: product,
        };
      }
    });
    setProductsDropdown(productsDropdown as any);
  }, [products]);

  useEffect(() => {
    const customersDropdown = customers.map((customer) => {
      return {
        label:
          customer.name +
          " " +
          customer.lastName +
          " " +
          customer.identification,
        value: customer,
      };
    });
    setCustomersDropdown(customersDropdown);
  }, [customers]);

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
      message: "¿Está seguro que quiere cancelar esta factura?",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    });
  };

  const accept = () => {
    toast.current?.show({
      severity: "info",
      summary: "SConfirmed",
      detail: "Ha cancelado la factura",
      life: 3000,
    });
    setCustomer(undefined);
    setValue("receivedCash", 0);
    reset();
    setChange(0);
    setProductTable([]);
    setDisables(false);
    window.location.reload();
  };

  const reject = () => {
    toast.current?.show({
      severity: "info",
      summary: "Rejected",
      detail: "No se canceló la factura",
      life: 3000,
    });
  };

  const onSubmit = handleSubmit((data) => {
    const invoiceCreate: IInvoiceCreate = {
      environmentType: "Pruebas",
      emissionType: "Emisión normal",
      receiptType: "FACTURA",
      customerIdentification: customer?.identification as string,
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
                setCustomer(undefined);
                setValue("receivedCash", 0);
                reset();
                setChange(0);
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
        <strong>Nuevo registro de una factura</strong>
      </h1>
      <form
        className="border p-4 border-opacity-5 bg-gray-700"
        onSubmit={onSubmit}
      >
        <div className="flex flex-row pb-4">
          <div className="flex flex-col w-6/12 pr-6">
            <label htmlFor="client">
              <strong>Cliente</strong>
            </label>
            <div className="flex flex-row">
              <Dropdown
                value={customer}
                options={customersDropdown}
                placeholder="Seleccione un cliente"
                filter
                className="w-full md:w-14rem"
                onChange={(e) => setCustomer(e.value)}
                disabled={disables}
              />
              <Button
                className="p-button-success h-10 w-1/12"
                icon="pi pi-plus"
                type="button"
                disabled={disables}
                onClick={() => setAddCustomer(true)}
              />
            </div>
            {formState.errors["customer"] && (
              <small className="text-red-500">
                Debe seleccionar un cliente
              </small>
            )}
            {addCustomer && (
              <Dialog
                header="Agregar Cliente"
                visible={addCustomer}
                style={{ width: "50vw" }}
                onHide={() => setAddCustomer(false)}
              />
            )}
          </div>
          <div className="flex flex-col pr-6">
            <label htmlFor="cash">
              <strong>Efectivo Recibido</strong>
            </label>

            <InputNumber
              placeholder="Efectivo Recibido"
              mode="currency"
              currency="USD"
              locale="en-US"
              showButtons
              minFractionDigits={2}
              maxFractionDigits={2}
              min={0.0}
              max={500.0}
              onKeyDownCapture={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              onValueChange={(e) => {
                setValue("receivedCash", e.value);
              }}
            />
          </div>
          <div className="flex flex-col w-2/12 pr-6">
            <label htmlFor="cash">
              <strong>Cambio</strong>
            </label>
            <div className="flex bg-jair-black  w-full h-full rounded-sm justify-center items-center">
              <label className="justify-center">
                <strong>{change.toFixed(2)}</strong>
              </label>
            </div>
          </div>
          <div className="flex flex-col w-2/12 pr-6">
            <label htmlFor="cash">
              <strong>CAJA</strong>
            </label>
            <div className="flex bg-jair-black  w-full h-full rounded-sm justify-center items-center">
              <label className="justify-center">
                <strong>{storeLocal ? storeLocal.box.key : ""}</strong>
              </label>
            </div>
          </div>
        </div>
        {customer && (
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
                    <p className="text-lg font-bold">SUBTOTAL: </p>
                    <label className="text-lg font-bold pl-4">
                      {productTable.length > 0 ? subtotal : "0.00"}
                    </label>
                  </div>
                  {ivasObject.map((iva: any, index: number) => {
                    const key = Object.keys(iva)[0]; // Acceder a la única key del objeto
                    const value = iva[key];
                    return (
                      <div
                        className="flex flex-row justify-between"
                        key={index}
                      >
                        <p className="text-lg font-bold">
                          {formatIvaPrint(key)}
                        </p>
                        <label className="text-lg font-bold pl-4">
                          {value.toFixed(2)}
                        </label>
                      </div>
                    );
                  })}
                  <br></br>
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
        visible={addCustomer}
        style={{ width: "60vw" }}
        onHide={() => setAddCustomer(false)}
      >
        <CustomerTable setCustomersContext={setCustomers} />
      </Dialog>
    </div>
  );
};

export default invoicer;

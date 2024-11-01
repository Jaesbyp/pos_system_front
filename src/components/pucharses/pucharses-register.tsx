"use client";

import { useState, useEffect, useRef } from "react";
import { handleGetAllProducts } from "@/store/api/productApi";
import { IProductResponse } from "@/store/interfaces/IProducts";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { Controller, useForm } from "react-hook-form";
import { Avatar } from "primereact/avatar";
import { Dropdown } from "primereact/dropdown";
import { useRouter } from "next/navigation";
import { IStoreLocal } from "@/store/interfaces/IStore";
import { round } from "@/store/utils/uuid";
import { IProviderResponse } from "@/store/interfaces/IProvider";
import { useProviders } from "@/hooks/provider/useProvider";
import ProvidersTable from "../providers/providers-table";
import {
  IPucharseCreate,
  PucharseStatusEnum,
} from "@/store/interfaces/pucharses/IPucharse";
import { usePucharses } from "@/hooks/pucharse/usePucharses";
import { PucharseProductTable } from "./pucharse-table/pucharse-table";
import { InputText } from "primereact/inputtext";

export interface IProductDropdown {
  label: string;
  value: IProductResponse;
}

const PucharseRegister = () => {
  const [products, setProducts] = useState<IProductResponse[]>([]);
  const [productTable, setProductTable] = useState<IProductResponse[]>([]);
  const [provider, setProvider] = useState<IProviderResponse>();
  const [addProvider, setAddProvider] = useState<boolean>(false);
  const [providersDropdown, setProvidersDropdown] = useState<{}[]>([]);
  const [productsDropdown, setProductsDropdown] = useState<IProductDropdown[]>(
    []
  );
  const [productsSelected, setProductsSelected] = useState<IProductResponse[]>(
    []
  );
  const [storeLocal, setStoreLocal] = useState<IStoreLocal>();
  const [disables, setDisables] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [effect, setEffect] = useState<boolean>(false);
  const router = useRouter();

  const toast = useRef<Toast>(null);

  const { providers } = useProviders();
  const { createPucharse, loading } = usePucharses();

  const { reset, setValue, handleSubmit, watch, control, formState } =
    useForm<IPucharseCreate>();

  useEffect(() => {
    const storeLocal = window.localStorage.getItem("storeLocal");
    if (storeLocal) {
      const storeLocalParsed = JSON.parse(storeLocal);
      setStoreLocal(storeLocalParsed.storeLocal);
    } else {
      router.push("/login");
    }

    handleGetAllProducts().then((response) => {
      if (response) {
        setProducts(response);
        const productsDropdown = response.map((product) => {
          return {
            label: product.name + " " + product.mainCode,
            value: product,
          };
        });
        setProductsDropdown(productsDropdown);
      }
    });
  }, []);

  useEffect(() => {
    const productsFiltered = productsDropdown.filter(
      (productDropdown) =>
        !productsSelected.find((p) => productDropdown.value.id === p.id)
    );

    setProductsDropdown(productsFiltered);
  }, [productsSelected]);

  useEffect(() => {
    let subtotal = 0;

    const productDetails = watch("pucharseDetails");

    productDetails?.forEach((productDetail) => {
      const discount = Number(productDetail.unitDiscount);

      let total = Number(
        productDetail.unitPrice * Number(productDetail.quantity)
      );

      if (discount > 0) {
        total -= total * (discount / 100);
      }

      subtotal += total;
    });

    setTotal(round(Number(subtotal)) || 0);
  }, [productTable, effect, watch("pucharseDetails")]);

  useEffect(() => {
    const providersDropdown = providers?.map((provider) => {
      return {
        label:
          provider.name +
          " - " +
          provider.address +
          " - " +
          provider.identification,
        value: provider,
      };
    });
    setProvidersDropdown(providersDropdown);
  }, [providers]);

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
    const pucharseCreate: IPucharseCreate = {
      invoiceNumber: data.invoiceNumber,
      orderDate: data.orderDate,
      total: total,
      status: PucharseStatusEnum.PENDING,
      providerId: provider!.id,
      storeId: storeLocal!.store.id,
      pucharseDetails: data.pucharseDetails,
    };

    createPucharse(pucharseCreate).then((pucharseResponse) => {
      if (pucharseResponse) {
        toast.current?.show({
          severity: "success",
          summary: "Compra generada",
          detail: "Se ha generado la compaa",
          life: 4000,
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
        id="pucharseForm"
        onSubmit={onSubmit}
      >
        <div className="flex flex-row pb-4">
          <div className="flex flex-col w-6/12 pr-6">
            <div>
              <label htmlFor="providerId">
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
              {formState.errors["providerId"] && (
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
            <div>
              <label>
                <strong>Número de factura</strong>
              </label>
              <Controller
                name="invoiceNumber"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <InputText
                    className="w-full"
                    keyfilter={"int"}
                    disabled={disables}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    name={field.name}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex flex-col w-6/12 pr-6">
            <label htmlFor="orderDate">
              <strong>Fecha ordenada</strong>
            </label>
            <div className="flex flex-row"></div>
            <Controller
              name="orderDate"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <Calendar
                    {...field}
                    value={watch("orderDate")}
                    onChange={(e) => setValue("orderDate", e.value as Date)}
                    locale="es"
                    dateFormat="dd/mm/yy"
                    showIcon
                    disabled={disables}
                  />
                  {formState.errors["orderDate"] && (
                    <small className="text-red-500">
                      Debe seleccionar la fecha de la orden
                    </small>
                  )}
                </>
              )}
            />
          </div>
        </div>
        {provider && (
          <PucharseProductTable
            setProductTable={setProductTable}
            setProductsSelected={setProductsSelected}
            productTable={productTable}
            setDisables={setDisables}
            productsDropdown={productsDropdown}
            setValue={setValue}
            watch={watch}
            handleDelete={handleDelete}
            control={control}
            setEffect={setEffect}
            effect={effect}
            total={total}
            confirm={confirm}
            onSubmit={onSubmit}
            loading={loading}
          />
        )}
        <Dialog
          header="Agregar Cliente"
          visible={addProvider}
          style={{ width: "60vw" }}
          onHide={() => setAddProvider(false)}
        >
          <ProvidersTable />
        </Dialog>
      </form>
    </div>
  );
};

export default PucharseRegister;

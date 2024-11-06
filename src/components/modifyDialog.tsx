import { IInputsForm } from "@/store/interfaces/IForms";
import { IProductResponse, IProductUpdate } from "@/store/interfaces/IProducts";
import { ICE, IRBPNR, IVAS } from "@/store/interfaces/Tables";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { KeyFilterType } from "primereact/keyfilter";
import { Toast } from "primereact/toast";
import React, { RefObject } from "react";
import { Controller, useForm } from "react-hook-form";
import ComboBox from "./ComboBox";
import { handleUpdateProduct } from "@/store/api/productApi";
import { FileUpload } from "primereact/fileupload";

interface Props {
  toast: RefObject<Toast>;
  product: IProductResponse;
  visible: boolean;
  setEditVisible: (value: boolean) => void;
  setProducts: any;
  categoriesName: string[];
}

export default function ModifyDialog({
  product,
  visible,
  setEditVisible,
  setProducts,
  toast,
  categoriesName,
}: Props) {
  const [selectedIVA, setSelectedIVA] = React.useState<string>(
    product?.ivaType
  );
  const [selectedICE, setSelectedICE] = React.useState<string>(
    product?.iceType
  );
  const [selectedIRBP, setSelectedIRBP] = React.useState<string>(
    product?.irbpType
  );
  const [productInfo, setProductInfo] = React.useState<IInputsForm[]>([]);
  const [category, setCategory] = React.useState<string>(product.category);
  const [image, setImage] = React.useState<any>(null);

  React.useEffect(() => {
    if (product !== undefined) {
      createProductInfo(product);
    }
  }, [product]);

  const createProductInfo = (product: IProductResponse) => {
    const productInfo: IInputsForm[] = [
      {
        name: "name",
        label: "Nombre",
        keyfilter: /^[A-Za-z ]$/,
        placeholder: "Nombre del Producto",
        alertText: "*El nombre es obligatorio",
        value: product?.name,
        onChange: () => {},
        type: "InputText",
        maxLength: 20,
      },
      {
        name: "mainCode",
        label: "Código Principal",
        keyfilter: "num",
        placeholder: "Código Principal",
        alertText: "*El código principal es obligatorio",
        value: product?.mainCode,
        onChange: () => {},
        type: "InputText",
        maxLength: 4,
      },
      {
        name: "auxCode",
        label: "Código Auxiliar",
        keyfilter: "num",
        placeholder: "Código Auxiliar",
        alertText: "*El código auxiliar es obligatorio",
        value: product?.auxCode,
        onChange: () => {},
        type: "InputText",
        maxLength: 4,
      },
      {
        name: "description",
        label: "Descripción",
        keyfilter: /^[A-Za-z ]$/,
        placeholder: "Contraseña",
        alertText: "*La contraseña es obligatoria",
        value: product?.description,
        onChange: () => {},
        type: "InputText",
        maxLength: 50,
      },
      {
        name: "stock",
        label: "Stock",
        keyfilter: "num",
        placeholder: "Stock",
        alertText: "*El stock es obligatorio",
        value: product?.stock as unknown as string,
        onChange: () => {},
        type: "InputText",
      },
      {
        name: "unitPrice",
        label: "Precio Unitario",
        keyfilter: "money",
        placeholder: "Precio Unitario",
        alertText: "*El precio unitario es obligatorio",
        value: product?.unitPrice as unknown as string,
        onChange: () => {},
        type: "InputText",
      },
    ];
    setProductInfo(productInfo);
  };

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data: any) => {
    const productToUpdate: IProductUpdate = {
      name: data.name == product.name ? null : data.name,
      mainCode: data.mainCode == product.mainCode ? null : data.mainCode,
      auxCode: data.auxCode == product.auxCode ? null : data.auxCode,
      description:
        data.description == product.description ? null : data.description,
      stock:
        Number(data.stock) == product.stock ? undefined : Number(data.stock),
      unitPrice:
        Number(data.unitPrice) == product.unitPrice
          ? undefined
          : Number(data.unitPrice),
      category: category == product.category ? undefined : category,
      ivaType: selectedIVA,
      iceType: selectedICE ? selectedICE : undefined,
      irbpType: selectedIRBP ? selectedIRBP : undefined,
    };

    handleUpdateProduct(product.id, productToUpdate, image).then((response) => {
      if (response) {
        toast.current?.show({
          severity: "success",
          summary: "Confirmado",
          detail: "Producto Actualizado",
          life: 3000,
        });
        setProducts((prevState: IProductResponse[]) => {
          const index = prevState.findIndex((p) => p.id === product.id);
          prevState[index] = response;
          return [...prevState];
        });
        setEditVisible(false);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Producto no actualizado",
          life: 3000,
        });
      }
    });
  });

  const handleICE = (e: string) => {
    setSelectedICE(e);
  };

  const handleIRBP = (e: string) => {
    setSelectedIRBP(e);
  };

  const handleIVA = (e: string) => {
    setSelectedIVA(e);
  };

  const handleImage = ({ files }: any) => {
    setImage(files[0]);
  };

  const renderDialogContent = (product: IProductResponse) => {
    return (
      <div className="p-4">
        <form>
          {productInfo.map((product, index) => (
            <div className="py-4 block" key={index}>
              <span className="p-float-label">
                <Controller
                  name={product.name}
                  control={control}
                  rules={{ required: false }}
                  defaultValue={product.value}
                  render={({ field }) => (
                    <>
                      <InputText
                        {...field}
                        className="border border-solid border-gray-300 py-2 px-4 rounded-full w-full"
                        keyfilter={product.keyfilter as KeyFilterType}
                        placeholder={product.placeholder}
                        maxLength={product.maxLength}
                      />
                      {errors[product.name] && (
                        <small className="text-red-500">
                          {product.alertText}
                        </small>
                      )}
                    </>
                  )}
                  shouldUnregister
                />
                <label className="block pb-2" htmlFor={product.name}>
                  {product.label}
                </label>
              </span>
            </div>
          ))}

          <div className="card w-full">
            <ComboBox
              label="Categoria"
              options={categoriesName}
              defaultValue={product.category ? product.category : "No aplica"}
              onChange={(e) => {
                handleICE(e);
              }}
            ></ComboBox>
          </div>

          <div className="card">
            <h1 className="pb-4">Imagen del producto</h1>
            <FileUpload
              name="productImage"
              multiple
              accept="image/*"
              maxFileSize={1000000}
              customUpload={true}
              uploadHandler={handleImage}
              emptyTemplate={
                <p className="m-0">Agrega la imagen del producto.</p>
              }
              auto={true}
            />
          </div>

          <div className="flex justify-evenly gap-4">
            <div className="card flex flex-col justify-content-center py-4 w-full">
              <ComboBox
                label="ICE"
                options={ICE}
                defaultValue={product.iceType ? product.iceType : "No aplica"}
                onChange={(e) => {
                  handleICE(e);
                }}
              ></ComboBox>
            </div>
            <div className="card flex flex-col justify-content-center py-4 w-full">
              <ComboBox
                label="IRBP"
                options={IRBPNR}
                defaultValue={product.irbpType ? product.irbpType : "No aplica"}
                onChange={(e) => {
                  handleIRBP(e);
                }}
              ></ComboBox>
            </div>
            <div className="card flex flex-col justify-content-center py-4 w-full">
              <ComboBox
                label="IVA"
                options={IVAS}
                defaultValue={product.ivaType ? product.ivaType : "No aplica"}
                onChange={(e) => {
                  handleIVA(e);
                }}
              ></ComboBox>
            </div>
          </div>

          <div className="flex justify-center gap-8 p-4">
            <Button
              icon="pi pi-check"
              className="p-button-success p-mr-2 w-1/2"
              label="Modificar"
              typeof="submit"
              onClick={onSubmit}
            />
            <Button
              label="Cancelar"
              severity="danger"
              className="w-1/2"
              type="button"
              onClick={() => {
                reset();
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
        header={"Modificar Producto: " + `${product?.name}`}
        headerClassName="text-center text-3xl font-bold"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          reset();
          setEditVisible(false);
        }}
        modal={true}
      >
        {renderDialogContent(product)}
      </Dialog>
    </>
  );
}

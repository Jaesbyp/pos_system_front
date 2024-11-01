"use client";
import { useState, useEffect, useRef, MouseEvent } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  handleCreateProduct,
  handleDeleteProduct,
  handleGetAllProducts,
} from "@/store/api/productApi";
import { IProductCreate, IProductResponse } from "@/store/interfaces/IProducts";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { IInputsForm } from "@/store/interfaces/IForms";
import { KeyFilterType } from "primereact/keyfilter";
import { ICE, IRBPNR, IVAS } from "@/store/interfaces/Tables";
import ModifyDialog from "@/components/modifyDialog";
import ComboBox from "@/components/ComboBox";
import { useForm } from "react-hook-form";
import { FileUpload } from "primereact/fileupload";
import { handleGetAllCategories } from "@/store/api/categoryApi";
import PageContainer from "@/components/pages/page-container";

export default function DynamicColumnsDemo() {
  const toast = useRef<Toast>(null);
  const [products, setProducts] = useState<IProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [product, setProduct] = useState<IProductResponse>();
  const [selectedIVA, setSelectedIVA] = useState<any>(null);
  const [selectedICE, setSelectedICE] = useState<any>(null);
  const [selectedIRBP, setSelectedIRBP] = useState<any>(null);
  const [categoriesName, setCategoriesName] = useState<string[]>([]);
  const [image, setImage] = useState<any>(null);
  const [category, setCategory] = useState<string>("");

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const columns = [
    { field: "id", header: "ID" },
    { field: "name", header: "Nombre" },
    { field: "mainCode", header: "Código Principal" },
    { field: "auxCode", header: "Código Auxiliar" },
    { field: "description", header: "Descripción" },
    { field: "stock", header: "Stock" },
    { field: "unitPrice", header: "Precio Unitario" },
    { field: "imageUrl", header: "Imagen" },
    { field: "ivaType", header: "Tipo de IVA" },
    { field: "iceType", header: "Tipo de ICE" },
    { field: "irbpType", header: "Tipo de IRBP" },
    { field: "actions", header: "Acciones" },
  ];

  useEffect(() => {
    setLoading(true);
    handleGetAllProducts().then((res) => {
      if (res) {
        setProducts(res);
        setLoading(false);
      }
    });
    handleGetAllCategories().then((res) => {
      if (res) {
        const categoriesName = res.map((category) => {
          return category.category;
        });
        setCategoriesName(categoriesName);
      }
    });
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    Object.values(product).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleModify = async (product: IProductResponse) => {
    setProduct(product);
    setEditVisible(true);
  };

  const handleDelete = (product: IProductResponse) => {
    handleDeleteProduct(product.id).then((res) => {
      if (res) {
        toast.current?.show({
          severity: "success",
          summary: "Successful",
          detail: "Producto Eliminado",
          life: 3000,
        });
        setProducts(products.filter((p) => p.id !== product.id));
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo eliminar el producto",
          life: 3000,
        });
      }
    });
  };

  const confirm = (
    event: MouseEvent<HTMLButtonElement>,
    product: IProductResponse
  ) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Quieres eliminar este producto?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept() {
        accept(product);
      },
      reject,
    });
  };

  const accept = (product: IProductResponse) => {
    handleDelete(product);
  };

  const reject = () => {
    toast.current?.show({
      severity: "warn",
      summary: "Rejected",
      detail: "Has Cancelado la Eliminación del Producto",
      life: 3000,
    });
  };

  const allForms: IInputsForm[] = [
    {
      name: "nameRegister",
      label: "Nombre",
      keyfilter: /^[A-Za-z ]$/,
      placeholder: "Nombre del Producto",
      alertText: "*El nombre es obligatorio",
      onChange: () => {},
      maxLength: 20,
    },
    {
      name: "mainCodeRegister",
      label: "Código Principal",
      keyfilter: "num",
      placeholder: "Código Principal",
      alertText: "*El código principal es obligatorio",
      onChange: () => {},
      maxLength: 4,
    },
    {
      name: "auxCodeRegister",
      label: "Código Auxiliar",
      keyfilter: "num",
      placeholder: "Código Auxiliar",
      alertText: "*El código auxiliar es obligatorio",
      onChange: () => {},
      maxLength: 4,
    },
    {
      name: "descriptionRegister",
      label: "Descripción",
      keyfilter: /^[A-Za-z ]$/,
      placeholder: "Descripción",
      alertText: "*La descripción es obligatoria",
      onChange: () => {},
      maxLength: 50,
    },
    {
      name: "stockRegister",
      label: "Stock",
      keyfilter: "num",
      placeholder: "Stock",
      alertText: "*El stock es obligatorio",
      onChange: () => {},
    },
    {
      name: "unitPriceRegister",
      label: "Precio Unitario",
      keyfilter: "money",
      placeholder: "Precio Unitario",
      alertText: "*El precio unitario es obligatorio",
      onChange: () => {},
    },
  ];

  const handleRegister = handleSubmit((data: any) => {
    const product: IProductCreate = {
      name: data.nameRegister,
      mainCode: data.mainCodeRegister,
      auxCode: data.auxCodeRegister ? data.auxCodeRegister : null,
      description: data.descriptionRegister,
      stock: Number(data.stockRegister),
      unitPrice: Number(data.unitPriceRegister),
      ivaVariable: null,
      category: category,
      ivaType: selectedIVA,
      iceType: selectedICE ? selectedICE : undefined,
      irbpType: selectedIRBP ? selectedIRBP : undefined,
    };

    handleCreateProduct(product, image).then((res) => {
      if (res) {
        setAddVisible(false);
        toast.current?.show({
          severity: "success",
          summary: "Producto Creado",
          detail: "El producto ha sido creado correctamente",
          life: 3000,
        });
        setProducts([...products, res]);
        reset();
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Ha ocurrido un error al crear el producto",
          life: 3000,
        });
      }
    });
  });

  const handleCategory = (e: string) => {
    setCategory(e);
  };

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

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <Toast ref={toast} />
        <h1 className="text-neutral-100 text-3xl text-center font-bold bg-jair py-3 border-2 border-slate-400 rounded-md">
          <span>
            <i className="pi pi-search" style={{ fontSize: "1.5rem" }}></i>
          </span>{" "}
          Listado de productos
        </h1>

        <div className="flex gap-4 justify-between">
          <div className="p-input-icon-left">
            <i className="pi pi-search"></i>
            <InputText
              placeholder="Buscar"
              value={searchTerm}
              onChange={handleSearch}
              className="w-96"
            />
          </div>
          <Button
            label="Agregar Producto"
            severity="info"
            raised
            className="w-56"
            icon="pi pi-plus"
            onClick={() => {
              setAddVisible(true);
            }}
          />
        </div>
        <DataTable
          value={filteredProducts}
          tableStyle={{ minWidth: "30rem", maxHeight: "30rem" }}
          className="centered-table md:min-h-[60vh] min-h-[30vh] max-h-[70vh] "
          size="small"
          tableClassName="md:min-h-[60vh] min-h-[30vh]  "
          cellClassName={() => {
            return "max-h-[10vh]  overflow-hidden";
          }}
          paginator
          loading={loading}
          rows={5}
          rowsPerPageOptions={[5, 10, 15]}
          scrollable
          scrollHeight="flex"
        >
          {columns.map((col, i) => {
            if (col.field === "actions") {
              return (
                <Column
                  key={col.field}
                  header={col.header}
                  align={"center"}
                  body={(rowData) => (
                    <div className="action-buttons flex gap-6">
                      <Button
                        icon="pi pi-pencil"
                        severity="info"
                        tooltip="Modificar"
                        aria-label="User"
                        onClick={() => {
                          handleModify(rowData);
                        }}
                      />
                      <ConfirmPopup />
                      <Button
                        icon="pi pi-eraser"
                        tooltip="Eliminar"
                        severity="danger"
                        aria-label="Cancel"
                        onClick={(e) => confirm(e, rowData)}
                      />
                    </div>
                  )}
                />
              );
            } else if (col.field === "imageUrl") {
              return (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  alignHeader={"center"}
                  body={(rowData) => (
                    <img
                      src={
                        rowData[col.field]
                          ? rowData[col.field]
                          : "https://www.pharmadelivery.com.ec/archivos/products/256/not-picture-256.png"
                      }
                      alt={rowData[col.field]}
                      width="100"
                      height="100"
                    />
                  )}
                  style={{ textAlign: "center" }}
                />
              );
            } else {
              return (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  body={(rowData) => rowData[col.field] || "-"}
                  style={{ textAlign: "center" }}
                />
              );
            }
          })}
        </DataTable>

        {product !== undefined && (
          <ModifyDialog
            product={product}
            visible={editVisible}
            setEditVisible={setEditVisible}
            setProducts={setProducts}
            categoriesName={categoriesName}
            toast={toast}
          />
        )}

        <Dialog
          visible={addVisible}
          style={{ width: "50vw" }}
          onHide={() => {
            reset();
            setAddVisible(false);
          }}
        >
          <form className="px-16">
            <h1 className="text-center font-bold text-3xl">
              Agregar un producto
            </h1>
            {allForms.map((allForm, index) => (
              <div className="py-4 block" key={index}>
                <span className="p-float-label">
                  <InputText
                    className="border border-solid border-gray-300 py-2 px-4 rounded-full w-full"
                    keyfilter={allForm.keyfilter as KeyFilterType}
                    placeholder={allForm.placeholder}
                    maxLength={allForm.maxLength}
                    {...register(allForm.name, {
                      required:
                        allForm.name === "auxCodeRegister"
                          ? false
                          : allForm.alertText,
                    })}
                  />
                  <label className="block pb-2" htmlFor={allForm.name}>
                    {allForm.label}
                  </label>
                </span>
                {errors[allForm.name] && (
                  <small className="text-red-500">{allForm.alertText}</small>
                )}
              </div>
            ))}
            <div className="flex justify-content-center py-4 w-full">
              <ComboBox
                key={"category"}
                label="Categoria"
                options={categoriesName}
                defaultValue="Selecciona una opción"
                onChange={(e) => {
                  handleCategory(e);
                }}
              ></ComboBox>
            </div>

            <div className="card">
              <h1 className="pb-4">Imagen del producto</h1>
              <FileUpload
                name="productImage"
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
              <div className="card flex justify-content-center py-4 w-full">
                <ComboBox
                  label="ICE"
                  options={ICE}
                  defaultValue="Selecciona una opción"
                  onChange={(e) => {
                    handleICE(e);
                  }}
                ></ComboBox>
              </div>
              <div className="card flex justify-content-center py-4 w-full">
                <ComboBox
                  label="IRBP"
                  options={IRBPNR}
                  defaultValue="Selecciona una opción"
                  onChange={(e) => {
                    handleIRBP(e);
                  }}
                ></ComboBox>
              </div>
              <div className="card flex justify-content-center py-4 w-full">
                <ComboBox
                  label="IVA"
                  options={IVAS}
                  defaultValue="Selecciona una opción"
                  onChange={(e) => {
                    handleIVA(e);
                  }}
                ></ComboBox>
              </div>
            </div>
            <div className="flex justify-evenly gap-4 py-4">
              <Button
                label="Agregar"
                severity="info"
                className="w-1/2"
                onClick={handleRegister}
              />
              <Button
                label="Cancelar"
                type="button"
                severity="danger"
                className="w-1/2"
                onClick={() => {
                  reset();
                  setAddVisible(false);
                }}
              />
            </div>
          </form>
        </Dialog>
      </div>
    </PageContainer>
  );
}

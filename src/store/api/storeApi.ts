import config from "../../../config/serverConfig";
import { IStoreResponse, IStoreUpdate } from "../interfaces/IStore";

export const handleGetStore = async () => {
  try {
    const response = await fetch(`${config.API_REST_BASE_URL}/store`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("No se pudo obtener la tienda.");
      return;
    }
    const data = await response.json();
    const storeData: IStoreResponse = data;

    if (!storeData) {
      console.log("Error al obtener la tienda.");
      return;
    }

    return storeData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleUpdateStore = async (
  storeDataUpdate: IStoreUpdate,
  signature: any
) => {
  const formData = new FormData();

  formData.append("store", JSON.stringify(storeDataUpdate));

  if (signature) {
    formData.append("electronicSignature", signature);
  }
  const entries = JSON.parse(JSON.stringify(formData));
  console.log(
    { formData },
    entries,
    formData.get("electronicSignature"),
    formData.get("store"),
    { storeDataUpdate }
  );

  try {
    const response = await fetch(`${config.API_REST_BASE_URL}/store`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      console.log("No se pudo actualizar la tienda.");
      const data = await response.json();
      return;
    }
    const data = await response.json();
    const storeData: IStoreResponse = data;

    if (!storeData) {
      console.log("Error al actualizar la tienda.");
      return;
    }

    return storeData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleDeleteStoreSignature = async () => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/store/electronicSignature`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("No se pudo eliminar la firma electrónica.");
      return;
    }
    const data = await response.json();
    const storeData: IStoreResponse = data;

    if (!storeData) {
      console.log("Error al eliminar la firma electrónica.");
      return;
    }

    return storeData;
  } catch (error) {
    console.log({ error });
  }
};

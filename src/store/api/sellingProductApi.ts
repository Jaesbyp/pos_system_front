import config from "../../../config/serverConfig";
import {
  ISellingProductsEntrance,
  ISellingProductsResponse,
} from "../interfaces/ISellingProducts";

export const handleGetSellingProduct = async (sellingProductId: number) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/selling-products/${sellingProductId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("No se encontro el producto a vender.");
      return;
    }
    const data = await response.json();
    const sellingProductData: ISellingProductsResponse = data;

    if (!sellingProductData) {
      console.log("Error al obtener el producto a vender.");
      return;
    }

    return sellingProductData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleGetAllSellingProducts = async () => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/selling-products`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("No se pudo obtener los productos a vender.");
      return;
    }
    const data = await response.json();
    const sellingProductsData: ISellingProductsResponse[] = data;

    if (!sellingProductsData) {
      console.log("Error al obtener los productos a vender.");
      return;
    }

    return sellingProductsData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleGetAllSellingProductsByInvoiceId = async (
  invoiceId: number
) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/selling-products/invoice/${invoiceId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("No se pudo obtener los productos a vender.");
      return;
    }
    const data = await response.json();
    const sellingProductsData: ISellingProductsResponse[] = data;

    if (!sellingProductsData) {
      console.log("Error al obtener los productos a vender.");
      return;
    }

    return sellingProductsData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleCreateSellingProducts = async (
  sellingProducts: ISellingProductsEntrance[]
) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/selling-products/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sellingProducts),
      }
    );

    if (!response.ok) {
      console.log("No se pudo crear el producto a vender.");
      return;
    }
    const data = await response.json();
    const sellingProductData: ISellingProductsResponse[] = data;

    if (!sellingProductData) {
      console.log("Error al crear el producto a vender.");
      return;
    }

    return sellingProductData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleDeleteSellingProduct = async (sellingProductId: number) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/selling-products/${sellingProductId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("No se pudo eliminar el producto a vender.");
      return;
    }
    const data = await response.json();

    if (!data) {
      console.log("Error al eliminar el producto a vender.");
      return;
    }

    return data;
  } catch (error) {
    console.log({ error });
  }
};

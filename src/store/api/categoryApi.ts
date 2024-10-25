import { ICategoryResponse, ICategoryUpdate } from "../interfaces/ICategory";
import config from "../../../config/serverConfig";

export const handleGetAllCategories = async () => {
  try {
    const response = await fetch(`${config.API_REST_BASE_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.log("No se pudo obtener las categorias.");
      return;
    }
    const data = await response.json();
    const categoriesData: ICategoryResponse[] = data;
    if (!categoriesData) {
      console.log("Error al obtener las categorias.");
      return;
    }
    return categoriesData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleCreateCategory = async (category: ICategoryUpdate) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/categories/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      }
    );

    if (!response.ok) {
      console.log("No se pudo crear la categoria.");
      return;
    }
    const data = await response.json();
    const categoryData: ICategoryResponse = data;
    if (!categoryData) {
      console.log("Error al crear la categoria.");
      return;
    }
    return categoryData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleUpdateCategory = async (
  id: number,
  category: ICategoryUpdate
) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/categories/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      }
    );

    if (!response.ok) {
      console.log("No se pudo actualizar la categoria.");
      return;
    }
    const data = await response.json();
    const categoryData: ICategoryResponse = data;
    if (!categoryData) {
      console.log("Error al actualizar la categoria.");
      return;
    }
    return categoryData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleDeleteCategory = async (id: number) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/categories/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      console.log("No se pudo eliminar la categoria.");
      return;
    }
    const data = await response.json();
    if (!data) {
      console.log("Error al eliminar la categoria.");
      return;
    }

    return data;
  } catch (error) {
    console.log({ error });
  }
};

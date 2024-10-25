import config from "../../../config/serverConfig";
import { IBranchResponse, IBranchUpdate } from "../interfaces/IBranch";

export const handleGetBranch = async (branchId: number) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/branches/${branchId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("No se encontro la sucursal.");
      return;
    }
    const data = await response.json();
    const branchData: IBranchResponse = data;

    if (!branchData) {
      console.log("Error al obtener la sucursal.");
      return;
    }

    return branchData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleGetAllBranches = async () => {
  try {
    const response = await fetch(`${config.API_REST_BASE_URL}/branches`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("No se pudo obtener las sucursales.");
      return;
    }
    const data = await response.json();
    const branchesData: IBranchResponse[] = data;

    if (!branchesData) {
      console.log("Error al obtener las sucursales.");
      return;
    }

    return branchesData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleUpdateBranch = async (
  branchId: number,
  branchUpdate: IBranchUpdate
) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/branches/${branchId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(branchUpdate),
      }
    );

    if (!response.ok) {
      console.log("No se pudo actualizar la sucursal.");
      return;
    }
    const data = await response.json();
    const branchData: IBranchResponse = data;

    if (!branchData) {
      console.log("Error al actualizar la sucursal.");
      return;
    }

    return branchData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleCreateBranch = async (branchUpdate: IBranchUpdate) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/branches/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(branchUpdate),
      }
    );

    if (!response.ok) {
      console.log("No se pudo registrar la sucursal.");
      return;
    }
    const data = await response.json();
    const branchData: IBranchResponse = data;

    if (!branchData) {
      console.log("Error al registrar la sucursal.");
      return;
    }

    return branchData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleDeleteBranch = async (branchId: number) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/branches/${branchId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("No se pudo eliminar la sucursal.");
      return;
    }
    const data = await response.json();

    if (!data) {
      console.log("Error al eliminar la sucursal.");
      return;
    }

    return data;
  } catch (error) {
    console.log({ error });
  }
};

import config from "../../../config/serverConfig";
import { IBoxResponse } from "../interfaces/IBoxes";

export const handleGetBox = async (boxId: number) => {
  try {
    const response = await fetch(`${config.API_REST_BASE_URL}/boxes/${boxId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("No se encontro la caja.");
      return;
    }
    const data = await response.json();
    const boxData: IBoxResponse = data;

    if (!boxData) {
      console.log("Error al obtener la caja.");
      return;
    }

    return boxData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleGetAllBoxes = async () => {
  try {
    const response = await fetch(`${config.API_REST_BASE_URL}/boxes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("No se pudo obtener las cajas.");
      return;
    }
    const data = await response.json();
    const boxesData: IBoxResponse[] = data;

    if (!boxesData) {
      console.log("Error al obtener las cajas.");
      return;
    }

    return boxesData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleGetBoxesByBranchId = async (branchId: number) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/boxes/branch/${branchId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("No se pudo obtener las cajas.");
      return;
    }
    const data = await response.json();
    const boxesData: IBoxResponse[] = data;

    if (!boxesData) {
      console.log("Error al obtener las cajas.");
      return;
    }

    return boxesData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleCreateBox = async (branchId: { branchId: number }) => {
  try {
    const response = await fetch(`${config.API_REST_BASE_URL}/boxes/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(branchId),
    });

    if (!response.ok) {
      console.log("No se pudo registrar la caja.");
      return;
    }
    const data = await response.json();
    const boxData: IBoxResponse = data;

    if (!boxData) {
      console.log("Error al registrar la caja.");
      return;
    }

    return boxData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleDeleteBox = async (boxId: number) => {
  try {
    const response = await fetch(`${config.API_REST_BASE_URL}/boxes/${boxId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("No se pudo eliminar la caja.");
      return;
    }
    const data = await response.json();

    if (!data) {
      console.log("Error al eliminar la caja.");
      return;
    }

    return data;
  } catch (error) {
    console.log({ error });
  }
};

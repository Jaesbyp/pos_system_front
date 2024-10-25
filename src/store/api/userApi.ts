import config from "../../../config/serverConfig";
import IUserResponse, {
  IUserRegister,
  IUserUpdate,
} from "../interfaces/IUserResponses";

export const handleGetUser = async (userId: number) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/users/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("No se encontro el usuario.");
      return;
    }
    const data = await response.json();
    const userData: IUserResponse = data;

    if (!userData) {
      console.log("Error al obtener el usuario.");
      return;
    }

    return userData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleGetAllUsers = async () => {
  try {
    const response = await fetch(`${config.API_REST_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("No se pudo obtener los usuarios.");
      return;
    }
    const data = await response.json();
    const usersData: IUserResponse[] = data;

    if (!usersData) {
      console.log("Error al obtener los usuarios.");
      return;
    }

    return usersData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleCreateUser = async (user: IUserRegister) => {
  try {
    const response = await fetch(`${config.API_REST_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      console.log("No se pudo registrar el usuario.");
      return;
    }
    const data = await response.json();
    const userData: IUserResponse = data;

    if (!userData) {
      console.log("Error al registrar el usuario.");
      return;
    }

    return userData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleUpdateUser = async (userId: number, user: IUserUpdate) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );

    if (!response.ok) {
      console.log("No se pudo actualizar el usuario.");
      return;
    }
    const data = await response.json();
    const userData: IUserResponse = data;

    if (!userData) {
      console.log("Error al actualizar el usuario.");
      return;
    }

    return userData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleDeleteUser = async (userId: number) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("No se pudo eliminar el usuario.");
      return;
    }
    const data = await response.json();

    if (!data) {
      console.log("Error al eliminar el usuario.");
      return;
    }

    return data;
  } catch (error) {
    console.log({ error });
  }
};

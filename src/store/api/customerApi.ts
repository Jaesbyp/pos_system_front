import config from "../../../config/serverConfig";
import { ICustomerResponse, ICustomerUpdate } from "../interfaces/ICustomer";

export const handleGetCustomer = async (customerId: number) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/customers/${customerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("No se encontro el cliente.");
      return;
    }
    const data = await response.json();
    const customerData: ICustomerResponse = data;

    if (!customerData) {
      console.log("Error al obtener el cliente.");
      return;
    }

    return customerData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleGetAllCustomers = async () => {
  try {
    const response = await fetch(`${config.API_REST_BASE_URL}/customers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("No se pudo obtener los clientes.");
      return;
    }
    const data = await response.json();
    const customersData: ICustomerResponse[] = data;

    if (!customersData) {
      console.log("Error al obtener los clientes.");
      return;
    }

    return customersData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleCreateCustomer = async (customerCreate: ICustomerUpdate) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/customers/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerCreate),
      }
    );

    if (!response.ok) {
      console.log("No se pudo crear el cliente.");
      return;
    }
    const data = await response.json();
    const customerData: ICustomerResponse = data;

    if (!customerData) {
      console.log("Error al crear el cliente.");
      return;
    }

    return customerData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleUpdateCustomer = async (
  customerId: number,
  customerUpdate: ICustomerUpdate
) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/customers/${customerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerUpdate),
      }
    );

    if (!response.ok) {
      console.log("No se pudo actualizar el cliente.");
      return;
    }
    const data = await response.json();
    const customerData: ICustomerResponse = data;

    if (!customerData) {
      console.log("Error al actualizar el cliente.");
      return;
    }

    return customerData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleDeleteCustomer = async (customerId: number) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/customers/${customerId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("No se pudo eliminar el cliente.");
      return;
    }
    const data = await response.json();

    if (!data) {
      console.log("Error al eliminar el cliente.");
      return;
    }

    return data;
  } catch (error) {
    console.log({ error });
  }
};

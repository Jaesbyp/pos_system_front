import { fetchHelperGet, fetchHelperPost } from "@/helpers/fetch-helper";
import config from "../../../config/serverConfig";
import { ICustomerResponse, ICustomerUpdate } from "../interfaces/ICustomer";

const PROVIDER_API_URL = `${config.API_REST_BASE_URL}/providers`;

export const handleGetProvider = async (providerId: number) => {
  return fetchHelperGet(`${PROVIDER_API_URL}/${providerId}`);
};

export const handleGetAllProviders = async () => {
  return fetchHelperGet(PROVIDER_API_URL);
};

export const handleCreateProvider = async (customerCreate: ICustomerUpdate) => {
  return fetchHelperPost(PROVIDER_API_URL, customerCreate);
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

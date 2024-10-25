import {
  fetchHelperDelete,
  fetchHelperGet,
  fetchHelperPost,
  fetchHelperPut,
} from "@/helpers/fetch-helper";
import config from "../../../config/serverConfig";
import { IProductUpdate } from "../interfaces/IProducts";
import { IProviderUpdate } from "../interfaces/IProvider";

const PROVIDER_API_URL = `${config.API_REST_BASE_URL}/providers`;

export const handleGetProvider = async (providerId: number) => {
  return fetchHelperGet(`${PROVIDER_API_URL}/${providerId}`);
};

export const handleGetAllProviders = async () => {
  return fetchHelperGet(PROVIDER_API_URL);
};

export const handleCreateProvider = async (providerCreate: IProductUpdate) => {
  return fetchHelperPost(PROVIDER_API_URL, providerCreate);
};

export const handleUpdateProvider = async (
  providerId: number,
  providerUpdate: IProviderUpdate
) => {
  return fetchHelperPut(`${PROVIDER_API_URL}/${providerId}`, providerUpdate);
};

export const handleDeleteProvider = async (providerId: number) => {
  return fetchHelperDelete(`${PROVIDER_API_URL}/${providerId}`);
};

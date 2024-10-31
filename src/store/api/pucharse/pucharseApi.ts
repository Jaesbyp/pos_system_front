import {
  fetchHelperDelete,
  fetchHelperGet,
  fetchHelperPost,
  fetchHelperPut,
} from "@/helpers/fetch-helper";
import config from "../../../../config/serverConfig";

const PUCHARSE_API_URL = `${config.API_REST_BASE_URL}/pucharses`;

export const handleGetPucharse = async (pucharseId: number) => {
  return fetchHelperGet(`${PUCHARSE_API_URL}/${pucharseId}`);
};

export const handleGetAllPucharses = async () => {
  return fetchHelperGet(PUCHARSE_API_URL);
};

export const handleCreatePucharse = async (pucharseCreate: any) => {
  return fetchHelperPost(PUCHARSE_API_URL, pucharseCreate);
};

export const handleUpdatePucharse = async (
  pucharseId: number,
  pucharseUpdate: any
) => {
  return fetchHelperPut(`${PUCHARSE_API_URL}/${pucharseId}`, pucharseUpdate);
};

export const handleDeletePucharse = async (pucharseId: number) => {
  return fetchHelperDelete(`${PUCHARSE_API_URL}/${pucharseId}`);
};

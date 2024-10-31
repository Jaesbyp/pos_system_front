import {
  fetchHelperDelete,
  fetchHelperGet,
  fetchHelperPost,
  fetchHelperPut,
} from "@/helpers/fetch-helper";
import config from "../../../../config/serverConfig";

const PUCHARSE_DETAIL_API = `${config.API_REST_BASE_URL}/pucharse-details`;

export const handleGetPucharseDetail = async (pucharseDetailId: number) => {
  return fetchHelperGet(`${PUCHARSE_DETAIL_API}/${pucharseDetailId}`);
};

export const handleGetAllPucharseDetails = async () => {
  return fetchHelperGet(PUCHARSE_DETAIL_API);
};

export const handleCreatePucharseDetail = async (pucharseDetailCreate: any) => {
  return fetchHelperPost(PUCHARSE_DETAIL_API, pucharseDetailCreate);
};

export const handleUpdatePucharseDetail = async (
  pucharseDetailId: number,
  pucharseDetailUpdate: any
) => {
  return fetchHelperPut(
    `${PUCHARSE_DETAIL_API}/${pucharseDetailId}`,
    pucharseDetailUpdate
  );
};

export const handleDeletePucharseDetail = async (pucharseDetailId: number) => {
  return fetchHelperDelete(`${PUCHARSE_DETAIL_API}/${pucharseDetailId}`);
};

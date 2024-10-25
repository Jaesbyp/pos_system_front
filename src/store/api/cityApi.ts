import config from "../../../config/serverConfig";
import {
  ICityResponse,
  IProvinceResponse,
} from "../interfaces/ICitiesResponses";
import IUserResponse from "../interfaces/IUserResponses";

export const fetchGetProvinces = async () => {
  try {
    const response = await fetch(`${config.API_REST_BASE_URL}/city/provinces`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("Error en el fetch de provincias.");
      return;
    }
    const data = await response.json();
    const provinces: IProvinceResponse[] = data.provinces;

    if (!provinces) {
      console.log("No se encontro provincias.");
      return;
    }

    return provinces;
  } catch (error) {
    console.log("ERROR: ", error);
  }
};

export const fetchGetCitiesByProvinceId = async (provinceId: number) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/city/provinces/${provinceId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("Error en el fetch de ciudades.");
      return;
    }
    const data = await response.json();
    const provinces: ICityResponse[] = data.cities;

    if (!provinces) {
      console.log("No se encontro ciudades.");
      return;
    }

    return provinces;
  } catch (error) {
    console.log("ERROR: ", error);
  }
};

export default fetchGetProvinces;

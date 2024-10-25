import config from "../../../config/serverConfig";
import IUserResponse from "../interfaces/IUserResponses";

export const fetchLogin = async (username: string, password: string) => {
  try {
    const response = await fetch(`${config.API_REST_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    });

    if (!response.ok) {
      console.log("Error en la autenticación.");
      return;
    }
    const data = await response.json();
    const userData: IUserResponse = data;

    if (!userData) {
      console.log("Error en la autenticación");
      return;
    }

    return userData;
  } catch (error) {
    console.log(error);
  }
};

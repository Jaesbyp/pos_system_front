export const fetchHelper = async (url: string, method: string, body: any) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.log("No se pudo realizar la operación.");
      return;
    }
    const data = await response.json();

    if (!data) {
      console.log("Error al realizar la operación.");
      return;
    }

    return data;
  } catch (error) {
    console.log({ error });
  }
};

export const fetchHelperGet = async (url: string) => {
  return fetchHelper(url, "GET", null);
};

export const fetchHelperPost = async (url: string, body: any) => {
  return fetchHelper(url, "POST", body);
};

export const fetchHelperPut = async (url: string, body: any) => {
  return fetchHelper(url, "PUT", body);
};

export const fetchHelperDelete = async (url: string) => {
  return fetchHelper(url, "DELETE", null);
};

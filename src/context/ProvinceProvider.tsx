"use client";

import fetchGetProvinces from "@/store/api/cityApi";
import { IProvinceResponse } from "@/store/interfaces/ICitiesResponses";
import { createContext, useContext, useEffect, useState } from "react";

interface IProvinceContext {
  provincesNames: string[];
  provinces: IProvinceResponse[];
}

export const ProvinceContext = createContext<IProvinceContext>({
  provincesNames: [],
  provinces: [],
});

export const useProvinces = () => {
  const context = useContext(ProvinceContext);
  if (!context) {
    throw new Error("useProvince debe estar dentro del proveedor Province");
  }
  return context;
};

export const ProvinceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [provinces, setProvinces] = useState<IProvinceResponse[]>([]);
  const [provincesNames, setProvincesNames] = useState<string[]>([]);

  useEffect(() => {
    fetchGetProvinces().then((res) => {
      setProvinces(res as IProvinceResponse[]);
    });
  }, []);

  useEffect(() => {
    const updateProvincesNames = () => {
      const names = provinces.map((province) => province.name);
      setProvincesNames(names);
    };

    updateProvincesNames();
  }, [provinces]);

  return (
    <ProvinceContext.Provider
      value={{ provincesNames: provincesNames, provinces: provinces }}
    >
      {children}
    </ProvinceContext.Provider>
  );
};

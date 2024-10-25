"use client";

import { fetchAllClients, fetchAllCompanies } from "@/store/api/userApi";
import {
  TClientsResponse,
  TEnterpriseResponse,
} from "@/store/interfaces/IUserResponses";
import { createContext, useContext, useEffect, useState } from "react";

interface IClientsCompaniesContext {
  clients: TClientsResponse[];
  companies: TEnterpriseResponse[];
  setResearch: (value: boolean) => void;
}

export const ClientsCompaniesContext = createContext<IClientsCompaniesContext>({
  clients: [],
  companies: [],
  setResearch: () => {},
});

export const useClientsCompanies = () => {
  const context = useContext(ClientsCompaniesContext);
  if (!context) {
    throw new Error(
      "useCLientsCompanies debe estar dentro del proveedor ClientsCompanies"
    );
  }
  return context;
};

export const ClientsCompaniesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [clients, setClients] = useState<TClientsResponse[]>([]);
  const [companies, setCompanies] = useState<TEnterpriseResponse[]>([]);
  const [research, setResearch] = useState(false);

  const fechtData = async () => {
    fetchAllClients().then((res) => {
      setClients(res as TClientsResponse[]);
    });

    fetchAllCompanies().then((res) => {
      setCompanies(res as TEnterpriseResponse[]);
    });
  };

  useEffect(() => {
    fechtData();
  }, []);

  useEffect(() => {
    fechtData();
    console.log("se ejecuto");
    setResearch(false);
  }, [research]);

  return (
    <ClientsCompaniesContext.Provider
      value={{
        clients: clients,
        companies: companies,
        setResearch: setResearch,
      }}
    >
      {children}
    </ClientsCompaniesContext.Provider>
  );
};

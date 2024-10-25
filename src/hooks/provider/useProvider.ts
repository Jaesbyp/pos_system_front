import {
  handleCreateProvider,
  handleDeleteProvider,
  handleGetAllProviders,
  handleUpdateProvider,
} from "@/store/api/provider-api";
import {
  IProviderCreate,
  IProviderResponse,
  IProviderUpdate,
} from "@/store/interfaces/IProvider";
import { useEffect, useState } from "react";

export const useProviders = () => {
  const [providers, setProviders] = useState<IProviderResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadProviders = async () => {
    setLoading(true);
    const providers = await handleGetAllProviders();
    setProviders(providers);
    setLoading(false);
  };

  const createProvider = async (provider: IProviderCreate) => {
    const providerCreated = await handleCreateProvider(provider);

    if (provider) {
      setProviders([...providers, providerCreated]);
    }

    return providerCreated;
  };

  const updateProvider = async (
    providerId: number,
    provider: IProviderUpdate
  ) => {
    const updatedProvider = await handleUpdateProvider(providerId, provider);

    if (updatedProvider) {
      await loadProviders();
    }

    return updatedProvider;
  };

  const deleteProvider = async (providerId: number) => {
    const deletedProvider = await handleDeleteProvider(providerId);
    if (deletedProvider) {
      setProviders(providers.filter((provider) => provider.id !== providerId));
    }

    return deletedProvider;
  };

  useEffect(() => {
    loadProviders();
  }, []);

  return {
    providers,
    loading,
    loadProviders,
    createProvider,
    updateProvider,
    deleteProvider,
  };
};

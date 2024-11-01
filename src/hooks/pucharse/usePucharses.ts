import {
  handleGetAllPucharses,
  handleCreatePucharse,
  handleUpdatePucharse,
  handleDeletePucharse,
} from "@/store/api/pucharse/pucharseApi";
import {
  IPucharseResponse,
  IPucharseCreate,
  IPucharseUpdate,
} from "@/store/interfaces/pucharses/IPucharse";
import { useState, useEffect } from "react";

export const usePucharses = () => {
  const [pucharses, setPucharses] = useState<IPucharseResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadPucharses = async () => {
    setLoading(true);
    const pucharses = await handleGetAllPucharses();
    setPucharses(pucharses);
    setLoading(false);
  };

  const createPucharse = async (pucharse: IPucharseCreate) => {
    setLoading(true);
    const pucharseCreated = await handleCreatePucharse(pucharse);

    if (pucharse) {
      setPucharses([...pucharses, pucharseCreated]);
    }

    setLoading(false);
    return pucharseCreated;
  };

  const updatePucharse = async (
    pucharseId: number,
    pucharse: IPucharseUpdate
  ) => {
    const updatedPucharse = await handleUpdatePucharse(pucharseId, pucharse);

    if (updatedPucharse) {
      await loadPucharses();
    }

    return updatedPucharse;
  };

  const deletePucharse = async (pucharseId: number) => {
    const deletedPucharse = await handleDeletePucharse(pucharseId);
    if (deletedPucharse) {
      setPucharses(pucharses.filter((pucharse) => pucharse.id !== pucharseId));
    }

    return deletedPucharse;
  };

  useEffect(() => {
    loadPucharses();
  }, []);

  return {
    pucharses,
    loading,
    loadPucharses,
    createPucharse,
    updatePucharse,
    deletePucharse,
  };
};

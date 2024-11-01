import { handleGetAllPucharseDetailsByPucharse } from "@/store/api/pucharse/pucharseDetailApi";
import { IPucharseDetail } from "@/store/interfaces/pucharses/IPucharseDetail";
import { useEffect, useState } from "react";

export const usePucharseDetails = () => {
  const [pucharseDetails, setPucharseDetails] = useState<IPucharseDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getPucharseDetailsByPucharseId = async (pucharseId: number) => {
    setLoading(true);
    const pucharseDetails = await handleGetAllPucharseDetailsByPucharse(
      pucharseId
    );
    setPucharseDetails(pucharseDetails);

    setLoading(false);
  };

  return {
    pucharseDetails,
    loading,
    getPucharseDetailsByPucharseId,
  };
};

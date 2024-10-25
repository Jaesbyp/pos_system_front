"use client";

import { handleGetBoxesByBranchId } from "@/store/api/boxApi";
import { handleGetAllBranches } from "@/store/api/branchApi";
import { handleGetStore } from "@/store/api/storeApi";
import { IBoxResponse } from "@/store/interfaces/IBoxes";
import { IBranchResponse } from "@/store/interfaces/IBranch";
import { IStoreLocal } from "@/store/interfaces/IStore";
import { useEffect, useState } from "react";

const BranchBox = () => {
  const [branches, setBranches] = useState<IBranchResponse[]>();
  const [selectedBranch, setSelectedBranch] = useState<IBranchResponse>();
  const [boxes, setBoxes] = useState<IBoxResponse[]>([]);
  const [box, setBox] = useState<IBoxResponse | null>(null);

  useEffect(() => {
    const user = window.localStorage.getItem("user");
    if (!user) {
      window.location.href = "/";
    }
    handleGetAllBranches().then((res) => {
      setBranches(res);
    });

    let storeLocalString = localStorage.getItem("storeLocal");
    if (storeLocalString) {
      const storeLocal = JSON.parse(storeLocalString);
      if (storeLocal) {
        setBox(storeLocal.storeLocal.box);
        return;
      }
    }
  }, []);

  useEffect(() => {
    if (!selectedBranch) return;
    handleGetBoxesByBranchId(selectedBranch?.id).then((res) => {
      if (res) {
        setBoxes(res);
      }
    });
  }, [selectedBranch]);

  const handleSelectBox = (box: IBoxResponse) => {
    handleGetStore().then((res) => {
      if (res) {
        const storeLocal: IStoreLocal = {
          store: res,
          box: box,
        };
        window.localStorage.setItem(
          "storeLocal",
          JSON.stringify({ storeLocal })
        );
        setBox(box);
      }
    });
  };

  const handleResetBox = () => {
    window.localStorage.removeItem("storeLocal");
    setBox(null);
    setSelectedBranch(undefined);
  };

  return (
    <div className="border p-4 border-opacity-5 bg-gray-800  w-3/4 rounded-md">
      {!box && (
        <div>
          <h1 className="text-2xl text-white font-bold">
            {!selectedBranch
              ? "Selecciona una sucursal"
              : "Selecciona una caja"}
          </h1>
          {!selectedBranch && (
            <div className="flex flex-wrap">
              {branches?.map((branch) => (
                <div className="w-1/2" key={branch.id}>
                  <div
                    className="border border-gray-600 bg-gray-700 p-2 m-2 rounded-md hover: bg-gradient-to-tr hover:bg-zinc-600"
                    onClick={(e) => setSelectedBranch(branch)}
                  >
                    <h1 className="text-white text-lg font-bold">
                      {branch.name}
                    </h1>
                    <h1 className="text-white">{branch.address}</h1>
                  </div>
                </div>
              ))}
            </div>
          )}
          {selectedBranch && (
            <div className="flex flex-wrap">
              {boxes?.map((box) => (
                <div className="w-1/2" key={box.id}>
                  <div
                    className="border border-gray-600 bg-gray-700 p-2 m-2 rounded-md hover: bg-gradient-to-tr hover:bg-zinc-600"
                    onClick={(e) => handleSelectBox(box)}
                  >
                    <h1 className="text-white text-lg font-bold">{box.key}</h1>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {box && (
        <div className="flex flex-col h-64 gap-4">
          <h1 className="text-4xl text-center font-bold">Caja actual:</h1>

          <div className="flex border items-center border-gray-600 bg-gray-700 rounded-md font-bold gap-6 h-48 p-3 py-6">
            <div className="flex-1 w-full h-full flex items-center justify-center">
              <h1 className="px-8 text-3xl">{box?.branchName + ":"}</h1>
            </div>

            <div className="flex flex-1 border bg-slate-800 text-3xl bg-gay-800 justify-center rounded-md items-center h-full w-2/12">
              <h1>{box.key}</h1>
            </div>

            <button
              className="flex flex-1 border bg-zinc-800 text-2xl bg-gay-800 justify-center rounded-md items-center h-full hover:bg-zinc-700"
              onClick={handleResetBox}
            >
              Seleccionar otra caja
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchBox;

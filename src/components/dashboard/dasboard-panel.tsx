"use client";

import { PanelMenu } from "primereact/panelmenu";
import Logo from "../../../public/images/PostLogo5.webp";
import { MenuItem } from "primereact/menuitem";
import { addLocale } from "primereact/api";
import Image from "next/image";
import {
  DEVICE_TYPE_ENUM,
  UseDeviceScreenType,
} from "@/hooks/use-resize-listener";
import { useState } from "react";
import { Button } from "primereact/button";

const DashboardPanel = ({ items }: { items: MenuItem[] }) => {
  const displayType = UseDeviceScreenType();
  addLocale("es", {
    firstDayOfWeek: 1,
    dayNames: [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ],
    dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
    monthNames: [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ],
    monthNamesShort: [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ],
    today: "Hoy",
    clear: "Limpiar",
  });

  const dashboardPanel = (
    <>
      <div
        className={`top-0 left-0 col-span-1 md:col-span-2 min-h-screen bg-jair ease-in-out duration-300 `}
      >
        <div className="h-full ">
          <div className="flex justify-center items-center">
            <Image
              src={Logo.src}
              alt=""
              width={104}
              height={104}
              className="py-2 "
            />
          </div>
          <PanelMenu
            model={items}
            className="md:w-25rem mb-4 bg-gray-700"
            pt={
              displayType === DEVICE_TYPE_ENUM.MOBILE
                ? {
                    headerLabel: {
                      style: {
                        display: "none",
                      },
                    },
                    headerSubmenuIcon: {
                      style: {
                        display: "block",
                      },
                    },
                    label: {
                      style: {
                        display: "none",
                      },
                    },
                  }
                : undefined
            }
          />
        </div>
      </div>
    </>
  );
  return dashboardPanel;
};

export default DashboardPanel;

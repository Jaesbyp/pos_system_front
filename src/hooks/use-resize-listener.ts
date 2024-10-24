import { useEffect, useState } from "react";
import { useResizeListener } from "primereact/hooks";

export enum DEVICE_TYPE_ENUM {
  MOBILE = "MOBILE",
  TABLET = "TABLET",
  DESKTOP = "DESKTOP",
}

export const UseDeviceScreenType = () => {
  const [deviceType, setDeviceType] = useState<DEVICE_TYPE_ENUM>(
    DEVICE_TYPE_ENUM.DESKTOP
  );

  const handleResize = () => {
    if (window.innerWidth < 768 && deviceType !== DEVICE_TYPE_ENUM.MOBILE) {
      setDeviceType(DEVICE_TYPE_ENUM.MOBILE);
    } else if (
      window.innerWidth < 1024 &&
      deviceType !== DEVICE_TYPE_ENUM.TABLET
    ) {
      setDeviceType(DEVICE_TYPE_ENUM.TABLET);
    } else if (
      window.innerWidth >= 1024 &&
      deviceType !== DEVICE_TYPE_ENUM.DESKTOP
    ) {
      setDeviceType(DEVICE_TYPE_ENUM.DESKTOP);
    }
  };

  const [bind, unbind] = useResizeListener({
    listener(event) {
      handleResize();
    },
  });

  useEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    bind();
    return unbind;
  }, [bind, unbind]);

  return deviceType;
};

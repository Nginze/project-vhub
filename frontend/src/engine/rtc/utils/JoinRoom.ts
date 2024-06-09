import { RtpCapabilities } from "mediasoup-client/lib/types";
import { useMediaStore } from "../store/MediaStore";

export const joinRoom = async (routerRtpCapabilities: RtpCapabilities) => {
  const { device } = useMediaStore.getState();
  if (!device!.loaded) {
    await device!.load({ routerRtpCapabilities });
  }
};

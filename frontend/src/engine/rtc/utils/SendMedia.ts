import { useProducerStore } from "../store/ProducerStore";
import { useMediaStore } from "../store/MediaStore";
import { useRoomStore } from "@/global-store/RoomStore";

export const sendMedia = async () => {
  const { sendTransport, set, mic, vid } = useMediaStore.getState();
  const { wantsMicOn, wantsVideoOn } = useRoomStore.getState();

  if (!sendTransport) {
    console.log("no sendTransport in sendVoice");
    return;
  }
  // eslint-disable-next-line init-declarations
  let localStream: MediaStream;
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  } catch (err) {
    set({ mic: null, vid: null, localStream: null });
    console.log(err);
    return;
  }

  const audioTracks = localStream.getAudioTracks();
  const videoTracks = localStream.getVideoTracks();

  if (audioTracks.length) {
    console.log("[LOGGING]: Creating audio producer...");
    const track = audioTracks[0];

    track.enabled = wantsMicOn;

    useProducerStore.getState().add(
      await sendTransport.produce({
        track,
        appData: { mediaTag: "cam-audio" },
      })
    );

    set({ mic: track, localStream: localStream });
  }

  if (videoTracks.length) {
    console.log("[LOGGING]: Creating video producer...");
    const track = videoTracks[0];

    track.enabled = wantsVideoOn;

    useProducerStore.getState().add(
      await sendTransport.produce({
        track,
        appData: { mediaTag: "cam-video" },
      })
    );

    set({ vid: track, localStream: localStream });

    return;
  }

  set({ mic: null, vid: null, localStream: null });
};

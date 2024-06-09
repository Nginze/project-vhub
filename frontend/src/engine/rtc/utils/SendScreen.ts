import { useProducerStore } from "../store/ProducerStore";
import { useMediaStore } from "../store/MediaStore";

export const sendScreen = async () => {
  const { sendTransport, set } = useMediaStore.getState();

  if (!sendTransport) {
    console.log("[ERROR]: No SendTransport to  sendScreen");
    return;
  }

  // eslint-disable-next-line init-declarations
  let displayStream: MediaStream;

  try {
    displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
  } catch (err) {
    set({ screenMic: null, screenVid: null, screenStream: null });
    console.log(err);
    return;
  }

  const screenVideoTracks = displayStream.getVideoTracks();
  const screenAudioTracks = displayStream.getAudioTracks();

  if (screenAudioTracks.length) {
    console.log("[LOGGING]: Creating display audio producer...");
    const track = screenAudioTracks[0];

    useProducerStore.getState().add(
      await sendTransport.produce({
        track,
        appData: { mediaTag: "screen-audio" },
      })
    );

    set({ screenMic: track, screenStream: displayStream });
  }

  if (screenVideoTracks.length) {
    console.log("[LOGGING]: Creating display video producer...");
    const track = screenVideoTracks[0];

    useProducerStore.getState().add(
      await sendTransport.produce({
        track,
        appData: { mediaTag: "screen-video" },
      })
    );

    set({ screenVid: track, screenStream: displayStream });

    return;
  }

  set({ screenMic: null, screenVid: null, screenStream: null });
};

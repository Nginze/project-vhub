// import { useSettingStore } from "@/store/useSettingStore";
import { useProducerStore } from "../store/ProducerStore";
import { useVoiceStore } from "../store/VoiceStore";

export const sendVoice = async () => {
  const { sendTransport, set, mic } = useVoiceStore.getState();
  if (!sendTransport) {
    console.log("no sendTransport in sendVoice");
    return;
  }
  // eslint-disable-next-line init-declarations
  let micStream: MediaStream;
  try {
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

  } catch (err) {
    set({ mic: null, micStream: null });
    console.log(err);
    return;
  }

  const audioTracks = micStream.getAudioTracks();

  if (audioTracks.length) {
    console.log("[LOGGING]: Creating producer...");
    const track = audioTracks[0];
    // track.enabled = false; // problem are 
    useProducerStore.getState().add(
      await sendTransport.produce({
        track,
        appData: { mediaTag: "cam-audio" },
      })
    );

    set({ mic: track, micStream });

    return;
  }

  set({ mic: null, micStream: null });
};

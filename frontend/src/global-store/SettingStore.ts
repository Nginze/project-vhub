import { create } from "zustand";
import { combine, persist, createJSONStorage } from "zustand/middleware";

export async function getMicrophones() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const microphones = devices.filter((device) => device.kind === "audioinput");
  return microphones.map((mic) => ({ label: mic.label, value: mic.deviceId }));
}

export async function getCameras() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const cameras = devices.filter((device) => device.kind === "videoinput");
  return cameras.map((camera) => ({
    label: camera.label,
    value: camera.deviceId,
  }));
}

export async function getSpeakers() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const speakers = devices.filter((device) => device.kind === "audiooutput");
  return speakers.map((speaker) => ({
    label: speaker.label,
    value: speaker.deviceId,
  }));
}

let microphones: any[] = [];
let cameras: any[] = [];
let speakers: any[] = [];

try {
  getMicrophones().then((res) => {
    microphones = res;
  });
  getCameras().then((res) => {
    cameras = res;
  });
  getSpeakers().then((res) => {
    speakers = res;

    console.log(microphones, cameras, speakers);
  });
} catch (error) {
  console.error(error);
}

export const useSettingStore = create(
  persist(
    combine(
      {
        spatialAudio: true,
        noiseCancellation: false,
        soundEffects: false,
        statsForNerds: false,
        selectedMicDevice: "default",
        selectedSpeakerDevice: "default",
        selectedCameraDevice: "default",
        micAsObj: {
          value: "default",
          label: "Default - Microphone (Realtek(R) Audio)",
        },
      },
      (set) => ({
        updateSpatialAudio(val: boolean) {
          set((s) => {
            return { spatialAudio: val };
          });
        },

        updateNoiseCancellation(val: boolean) {
          set((s) => {
            return { noiseCancellation: val };
          });
        },

        updateStatsForNerds(val: boolean) {
          set((s) => {
            return { statsForNerds: val };
          });
        },

        updateSoundEffects(val: boolean) {
          set((s) => {
            return { soundEffects: val };
          });
        },

        updateSelectedMic(device: any) {
          console.log(device.value);
          set((s) => {
            return {
              micAsObj: device,
              selectedMicDevice: device.value,
            };
          });
        },
        set,
      })
    ),
    {
      name: "streams-user-preferences",
    }
  )
);

import { create } from "zustand";
import { combine, persist, createJSONStorage } from "zustand/middleware";

export async function getMicrophones() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const microphones = devices.filter((device) => device.kind === "audioinput");
  return microphones.map((mic) => ({ label: mic.label, value: mic.deviceId }));
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

import { create } from "zustand";
import { combine, persist, createJSONStorage } from "zustand/middleware";

async function askForPermissions() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    stream.getTracks().forEach((track) => track.stop());
  } catch (error) {
    console.error("Error asking for permissions:", error);
  }
}

export async function getMicrophones() {
  const micStatus = await navigator.permissions.query({ name: "microphone" });
  if (micStatus.state !== "granted") {
    await askForPermissions();
  }

  const devices = await navigator.mediaDevices.enumerateDevices();
  const microphones = devices.filter((device) => device.kind === "audioinput");
  return microphones.map((mic) => ({ label: mic.label, value: mic.deviceId }));
}

export async function getCameras() {
  const cameraStatus = await navigator.permissions.query({ name: "camera" });
  if (cameraStatus.state !== "granted") {
    await askForPermissions();
  }

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
        hasMicIssue: false,
        hasCameraIssue: false,
        hasSpeakerIssue: false,
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

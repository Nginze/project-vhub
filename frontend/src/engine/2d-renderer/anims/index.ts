import { RoomScene } from "../scenes/RoomScene";
import { ANIMS_FRAME_RATE } from "../utils/constants";

export const registerSpriteAnimations32 = (scene: RoomScene) => {
  scene.anims.create({
    key: "nancy_idle_right",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 0,
      end: 5,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE * 0.6,
  });

  scene.anims.create({
    key: "nancy_idle_up",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 6,
      end: 11,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE * 0.6,
  });

  scene.anims.create({
    key: "nancy_idle_left",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 12,
      end: 17,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE * 0.6,
  });

  scene.anims.create({
    key: "nancy_idle_down",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 18,
      end: 23,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE * 0.6,
  });

  scene.anims.create({
    key: "nancy_run_right",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 24,
      end: 29,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "nancy_run_up",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 30,
      end: 35,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "nancy_run_left",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 36,
      end: 41,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "nancy_run_down",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 42,
      end: 47,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "nancy_sit_down",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 48,
      end: 48,
    }),
    repeat: 0,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "nancy_sit_left",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 49,
      end: 49,
    }),
    repeat: 0,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "nancy_sit_right",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 50,
      end: 50,
    }),
    repeat: 0,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "nancy_sit_up",
    frames: scene.anims.generateFrameNames("nancy", {
      start: 51,
      end: 51,
    }),
    repeat: 0,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "lucy_idle_right",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 0,
      end: 5,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE * 0.6,
  });

  scene.anims.create({
    key: "lucy_idle_up",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 6,
      end: 11,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE * 0.6,
  });

  scene.anims.create({
    key: "lucy_idle_left",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 12,
      end: 17,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE * 0.6,
  });

  scene.anims.create({
    key: "lucy_idle_down",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 18,
      end: 23,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE * 0.6,
  });

  scene.anims.create({
    key: "lucy_run_right",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 24,
      end: 29,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "lucy_run_up",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 30,
      end: 35,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "lucy_run_left",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 36,
      end: 41,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "lucy_run_down",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 42,
      end: 47,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "lucy_sit_down",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 48,
      end: 48,
    }),
    repeat: 0,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "lucy_sit_left",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 49,
      end: 49,
    }),
    repeat: 0,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "lucy_sit_right",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 50,
      end: 50,
    }),
    repeat: 0,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "lucy_sit_up",
    frames: scene.anims.generateFrameNames("lucy", {
      start: 51,
      end: 51,
    }),
    repeat: 0,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "ash_idle_right",
    frames: scene.anims.generateFrameNames("ash", {
      start: 0,
      end: 5,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE * 0.6,
  });

  scene.anims.create({
    key: "ash_idle_up",
    frames: scene.anims.generateFrameNames("ash", {
      start: 6,
      end: 11,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE * 0.6,
  });

  scene.anims.create({
    key: "ash_idle_left",
    frames: scene.anims.generateFrameNames("ash", {
      start: 12,
      end: 17,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE * 0.6,
  });

  scene.anims.create({
    key: "ash_idle_down",
    frames: scene.anims.generateFrameNames("ash", {
      start: 18,
      end: 23,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE * 0.6,
  });

  scene.anims.create({
    key: "ash_run_right",
    frames: scene.anims.generateFrameNames("ash", {
      start: 24,
      end: 29,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "ash_run_up",
    frames: scene.anims.generateFrameNames("ash", {
      start: 30,
      end: 35,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "ash_run_left",
    frames: scene.anims.generateFrameNames("ash", {
      start: 36,
      end: 41,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "ash_run_down",
    frames: scene.anims.generateFrameNames("ash", {
      start: 42,
      end: 47,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "ash_sit_down",
    frames: scene.anims.generateFrameNames("ash", {
      start: 48,
      end: 48,
    }),
    repeat: 0,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "ash_sit_left",
    frames: scene.anims.generateFrameNames("ash", {
      start: 49,
      end: 49,
    }),
    repeat: 0,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "ash_sit_right",
    frames: scene.anims.generateFrameNames("ash", {
      start: 50,
      end: 50,
    }),
    repeat: 0,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "ash_sit_up",
    frames: scene.anims.generateFrameNames("ash", {
      start: 51,
      end: 51,
    }),
    repeat: 0,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "adam_idle_right",
    frames: scene.anims.generateFrameNames("adam", {
      start: 0,
      end: 5,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE * 0.6,
  });

  scene.anims.create({
    key: "adam_idle_up",
    frames: scene.anims.generateFrameNames("adam", {
      start: 6,
      end: 11,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE * 0.6,
  });

  scene.anims.create({
    key: "adam_idle_left",
    frames: scene.anims.generateFrameNames("adam", {
      start: 12,
      end: 17,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE * 0.6,
  });

  scene.anims.create({
    key: "adam_idle_down",
    frames: scene.anims.generateFrameNames("adam", {
      start: 18,
      end: 23,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE * 0.6,
  });

  scene.anims.create({
    key: "adam_run_right",
    frames: scene.anims.generateFrameNames("adam", {
      start: 24,
      end: 29,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "adam_run_up",
    frames: scene.anims.generateFrameNames("adam", {
      start: 30,
      end: 35,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "adam_run_left",
    frames: scene.anims.generateFrameNames("adam", {
      start: 36,
      end: 41,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "adam_run_down",
    frames: scene.anims.generateFrameNames("adam", {
      start: 42,
      end: 47,
    }),
    repeat: -1,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "adam_sit_down",
    frames: scene.anims.generateFrameNames("adam", {
      start: 48,
      end: 48,
    }),
    repeat: 0,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "adam_sit_left",
    frames: scene.anims.generateFrameNames("adam", {
      start: 49,
      end: 49,
    }),
    repeat: 0,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "adam_sit_right",
    frames: scene.anims.generateFrameNames("adam", {
      start: 50,
      end: 50,
    }),
    repeat: 0,
    frameRate: ANIMS_FRAME_RATE,
  });

  scene.anims.create({
    key: "adam_sit_up",
    frames: scene.anims.generateFrameNames("adam", {
      start: 51,
      end: 51,
    }),
    repeat: 0,
    frameRate: ANIMS_FRAME_RATE,
  });
};

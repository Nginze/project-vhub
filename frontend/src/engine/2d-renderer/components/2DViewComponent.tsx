import React, { useEffect, useRef, useState } from "react";
import phaserReact from "phaser3-react";
import { MyContextMenu } from "@/components/global/MyContextMenu";
import { useRoomStore } from "@/global-store/RoomStore";
import AppDialog from "@/components/global/AppDialog";
import { AppIFrame } from "@/components/global/AppIFrame";

type TwoDViewComponentProps = {};

export const TwoDViewComponent: React.FC<TwoDViewComponentProps> = () => {
  const gameRef = useRef<any>(null);
  const [gameMounted, setGameMounted] = useState(false);
  const { roomIframeOpen } = useRoomStore();

  useEffect(() => {
    async function initPhaser() {
      const Phaser = await import("phaser");
      const { RoomScene } = await import("../scenes/RoomScene");
      const { Preloader } = await import("../scenes/PreloaderScene");
      const { default: GridEngine } = await import("grid-engine");

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        title: "2D-view",
        backgroundColor: "#000000",
        pixelArt: true,
        scale: {
          mode: Phaser.Scale.ScaleModes.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          height: window.innerHeight,
          autoRound: true,
        },

        physics: {
          default: "arcade",
          arcade: {
            debug: process.env.NODE_ENV === "development",
          },
        },
        dom: {
          createContainer: true,
        },
        autoFocus: true,
        parent: "2d-view-content",
        scene: [Preloader, RoomScene],
        plugins: {
          scene: [
            {
              key: "gridEngine",
              plugin: GridEngine,
              mapping: "gridEngine",
            },
          ],
        },
      });
    }

    // force phaser to initialize only once
    if (!gameMounted) {
      initPhaser().then(() => {
        setGameMounted(true);
      });
    }

    // clean up phaser instance on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  return (
    <div id="2d-view-content" key="2d-view-content">

    </div>
  );
};

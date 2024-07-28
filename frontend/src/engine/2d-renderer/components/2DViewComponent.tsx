import React, { useEffect, useRef, useState } from "react";
import { useRendererStore } from "../store/RendererStore";

type TwoDViewComponentProps = {};

export const TwoDViewComponent: React.FC<TwoDViewComponentProps> = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [gameMounted, setGameMounted] = useState(false);
  const { ready, set } = useRendererStore();

  useEffect(() => {
    async function initPhaser() {
      const Phaser = await import("phaser");
      const { RoomScene } = await import("../scenes/RoomScene");
      const { Preloader } = await import("../scenes/PreloaderScene");
      const { default: GridEngine } = await import("grid-engine");

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        title: "2D-view",
        backgroundColor: "#0096c7",
        pixelArt: true,
        scale: {
          mode: Phaser.Scale.ScaleModes.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          height: window.innerHeight,
          autoRound: true,
        },
        fps: {
          target: 60,
          limit: 60,
          forceSetTimeOut: true,
        },

        physics: {
          default: "arcade",
          arcade: {
            debug: true,
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
        set({ game: gameRef.current });
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

  return <div id="2d-view-content" key="2d-view-content"></div>;
};

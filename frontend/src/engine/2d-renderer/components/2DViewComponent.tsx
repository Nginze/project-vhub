import React, { useEffect, useRef, useState } from "react";
import phaserReact from "phaser3-react";
import { MyContextMenu } from "@/components/global/MyContextMenu";

type TwoDViewComponentProps = {};

export const TwoDViewComponent: React.FC<TwoDViewComponentProps> = () => {
  const gameRef = useRef<any>(null);
  const [gameMounted, setGameMounted] = useState(false);

  useEffect(() => {
    async function initPhaser() {
      // Lazy load phaser library and initialize phaser canvas
      const Phaser = await import("phaser");
      const { RoomScene } = await import("../scenes/RoomScene");
      const { Preloader } = await import("../scenes/PreloaderScene");
      const { default: GridEngine } = await import("grid-engine");

      // Initialize Phaser Canvas
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        title: "2D-view",
        backgroundColor: "#93cbee",
        pixelArt: true,
        scale: {
          mode: Phaser.Scale.ScaleModes.RESIZE,
          width: window.innerWidth,
          height: window.innerHeight,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          autoRound: true,
          zoom: 5,
        },
        render: {
          antialias: false,
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
    <div
      id="2d-view-content"
      key="2d-view-content"
      className="flex items-center justify-center"
    >
      <MyContextMenu />
    </div>
  );
};

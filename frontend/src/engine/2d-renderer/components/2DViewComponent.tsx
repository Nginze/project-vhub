import React, { useEffect, useRef, useState } from "react";

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
        width: 1920,
        height: 967,
        
        pixelArt: true,
        physics: {
          default: "arcade",
          arcade: {
            debug: true,
          },
        },
        dom: {
          createContainer: true,
        },
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
        scale: {
          zoom: 1.5,
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
    ></div>
  );
};

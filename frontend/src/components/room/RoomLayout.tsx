import React from "react";
import { RoomVideoOverlay } from "./RoomVideoOverlay";

type RoomLayoutProps = {
  footer: React.ReactNode;
  canvas: React.ReactNode;
};

export const RoomLayout: React.FC<RoomLayoutProps> = ({ canvas, footer }) => {
  return (
    <main className="relative w-screen h-screen">
      <RoomVideoOverlay>
        <main className="w-full flex relative overflow-hidden">
          <div className="w-full">
            <div className="w-full">{canvas}</div>
            <div className="absolute bottom-0 w-full">{footer}</div>
          </div>
        </main>
      </RoomVideoOverlay>
    </main>
  );
};

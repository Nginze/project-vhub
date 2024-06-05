import { useRoomStore } from "@/global-store/RoomStore";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

type RoomLayoutProps = {
  footer: React.ReactNode;
  canvas: React.ReactNode;
};

export const RoomLayout: React.FC<RoomLayoutProps> = ({ canvas, footer }) => {

  return (
    <>
      <main className="w-full flex relative overflow-hidden">
        <div className="w-full">
          <div className="w-full">{canvas}</div>
          <div className="absolute bottom-0 w-full">{footer}</div>
        </div>
      </main>
    </>
  );
};

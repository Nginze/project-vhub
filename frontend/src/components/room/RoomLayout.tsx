import React from "react";

type RoomLayoutProps = {
  footer: React.ReactNode;
  canvas: React.ReactNode;
};

export const RoomLayout: React.FC<RoomLayoutProps> = ({ canvas, footer }) => {
  return (
    <>
      <main className="w-full relative">
        <div>{canvas}</div>
        <div className="absolute bottom-0 w-full">{footer}</div>
      </main>
    </>
  );
};

import { cn } from "@/lib/utils";
import React from "react";

type gridProps = {};

export const Grid: React.FC<gridProps> = () => {
  return (
    <div
      className={cn(
        "h-screen w-full absolute bg-void dark:bg-dot-white/[0.2] bg-dot-white/[0.15] flex items-center justify-center"
      )}
    >
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-blue mask-image:radial-gradient(ellipse_at_center,transparent_20%,black) z-10"></div>
    </div>
  );
};

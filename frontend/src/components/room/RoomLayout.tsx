import { cn } from "@/lib/utils";
import React, { useState } from "react";

type RoomLayoutProps = {
  footer: React.ReactNode;
  sidebar: React.ReactNode;
  canvas: React.ReactNode;
};

export const RoomLayout: React.FC<RoomLayoutProps> = ({
  canvas,
  footer,
  sidebar,
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <button
        className="text-black"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        Toggle Sidebar
      </button>
      <main className="w-full flex relative">
        <div
          className={`flex-grow transition-all duration-500 ${
            isSidebarOpen ? "min-w-3/5" : "min-w-4/5"
          }`}
        >
          <div className="w-full">{canvas}</div>
          <div className="absolute bottom-0 w-full">{footer}</div>
        </div>
        <div
          className={cn(
            `transform transition-transform duration-500 bg-void`,
            ` ${isSidebarOpen ? "w-2/5 min-w-2/5 flex-1" : "w-0 min-w-0"}`
          )}
        >
          {sidebar}
        </div>
      </main>
    </>
  );
};

import React from "react";
import { Logo } from "./Logo";

type LoaderOverlayProps = {};

export const LoaderOverlay: React.FC<LoaderOverlayProps> = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="text-center flex flex-col gap-5">
        <div className="animate-spin">
          <Logo withLogo withText={false} size="lg" />
        </div>
        <p className="text-white">Loading...</p>
      </div>
    </div>
  );
};

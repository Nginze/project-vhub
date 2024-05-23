import { Logo } from "@/components/global/Logo";
import React from "react";

type SetupNavProps = {};

export const SetupNav: React.FC<SetupNavProps> = () => {
  return (
    <div className="flex justify-between items-center">
      <Logo withLogo={true} size="md" />
      <span className="opacity-40 text-[14px] cursor-pointer">KuugJonathan45@gmail.com</span>
    </div>
  );
};

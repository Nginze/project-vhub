import { Logo } from "@/components/global/Logo";
import { userContext } from "@/context/UserContext";
import React, { useContext } from "react";

type SetupNavProps = {};

export const SetupNav: React.FC<SetupNavProps> = () => {
  const { user } = useContext(userContext);
  return (
    <div className="flex justify-between items-center">
      <Logo withLogo={true} size="md" />
      <span className="opacity-40 text-[14px] cursor-pointer">
        {user?.email}
      </span>
    </div>
  );
};

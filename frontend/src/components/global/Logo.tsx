import React from "react";
import { GiGhost } from "react-icons/gi";

type LogoProps = {
  withLogo: boolean;
  withText?: boolean;
  size: "sm" | "md" | "lg";
};

export const Logo: React.FC<LogoProps> = ({
  withLogo,
  withText = true,
  size = "md",
}) => {
  const WIDTH = size == "sm" ? 20 : size == "md" ? 30 : 50;
  const HEIGHT = size == "sm" ? 20 : size == "md" ? 30 : 50;

  return (
    <div className="flex items-center gap-2 cursor-pointer">
      {withLogo && <GiGhost size={25} className="text-app" />}
      {withText && (
        <span className="text-xl relative text-white font-logo font-semibold">
          Holoverse
        </span>
      )}
    </div>
  );
};

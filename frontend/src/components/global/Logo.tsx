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
  const WIDTH = size == "sm" ? 20 : size == "md" ? 35 : 60;
  const HEIGHT = size == "sm" ? 20 : size == "md" ? 35 : 60;

  return (
    <div className="flex items-center gap-2 cursor-pointer">
      {withLogo && <img src="/logo3.svg" width={WIDTH} />}
      {withText && (
        <span className="text-[24px] relative text-white font-new">
          holoverse
        </span>
      )}
    </div>
  );
};

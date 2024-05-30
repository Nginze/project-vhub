import Image from "next/image";
import React from "react";

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
  const WIDTH = size == "sm" ? 20 : size == "md" ? 40 : 50;
  const HEIGHT = size == "sm" ? 20 : size == "md" ? 40 : 50;

  return (
    <div className="flex items-center gap-2 cursor-pointer">
      {withLogo && (
        <Image alt="logo" src={"/logo.svg"} width={WIDTH} height={HEIGHT} />
      )}
      {withText && (
        <span className="text-xl relative text-white font-logo font-semibold">
          Holoverse
          {/* <span className="text-green-500 text-[9px] -top-1.5 absolute">
            Beta
          </span> */}
        </span>
      )}
    </div>
  );
};

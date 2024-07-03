import { cn } from "@/lib/utils";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { Button } from "../ui/button";
import { RotatingLines } from "react-loader-spinner";
import Loader from "../global/Loader";

type RoomMediaControlButtonProps = {
  isOn?: boolean;
  isLoading?: boolean;
  iconOn: React.ReactNode;
  iconOff: React.ReactNode;
  onClick?: () => void;
  bgColor?: string;
  bgColorActive?: string;
  hoverColor?: string;
  textColor?: string;
  tooltipText?: string;
  useDefaultBg?: boolean;
};

export const RoomMediaControlButton: React.FC<RoomMediaControlButtonProps> = ({
  isOn,
  isLoading,
  iconOn,
  iconOff,
  bgColor,
  hoverColor,
  textColor,
  tooltipText,
  useDefaultBg,
  onClick,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          disabled={isLoading}
          onClick={onClick}
          className={
            "flex items-center overflow-hidden bg-light  rounded-full px-0 py-0 w-auto h-auto hover:text-white shadow-appShadow" +
            (isLoading ? " bg-appRed/50" : "") +
            (isOn && !useDefaultBg ? " bg-appGreen/30" : "") +
            (!isOn && !useDefaultBg ? " bg-appRed/30" : "")
          }
        >
          {isOn == true ? (
            <div
              className={cn(
                `p-2 text-black hover:text-white`,
                bgColor && bgColor,
                hoverColor && hoverColor,
                textColor && textColor
              )}
            >
              {isLoading ? (
                <Loader width={22} strokeColor="#f04747" alt />
              ) : (
                iconOn
              )}
            </div>
          ) : (
            <div
              className={cn(
                `p-2 text-black hover:text-white`,
                bgColor && bgColor,
                hoverColor && hoverColor,
                textColor && textColor
              )}
            >
              {isLoading ? (
                <Loader alt width={22} strokeColor="#f04747" />
              ) : (
                iconOff
              )}
            </div>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};

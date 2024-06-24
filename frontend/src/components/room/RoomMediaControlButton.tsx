import { cn } from "@/lib/utils";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { Button } from "../ui/button";
import { RotatingLines } from "react-loader-spinner";

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
  onClick,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          className="flex items-center overflow-hidden bg-light  rounded-full px-0 py-0 w-auto h-auto hover:text-white shadow-appShadow"
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
                <RotatingLines
                  width={"16"}
                  animationDuration="0.75"
                  strokeColor="grey"
                  strokeWidth="5"
                  visible={true}
                />
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
                <RotatingLines
                  width={"16"}
                  animationDuration="0.75"
                  strokeColor="grey"
                  strokeWidth="5"
                  visible={true}
                />
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

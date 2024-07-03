import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Oval, RotatingLines } from "react-loader-spinner";

type SetupButtonProps = {
  isOn: boolean;
  isLoading: boolean;
  iconOn: React.ReactNode;
  iconOff: React.ReactNode;
  onClick?: () => void;
  bgColor?: string;
  bgColorActive?: string;
  hoverColor?: string;
  textColor?: string;
  tooltipText?: string;
};

export const SetupButton: React.FC<SetupButtonProps> = ({
  isOn,
  isLoading,
  iconOn,
  iconOff,
  bgColor,
  bgColorActive,
  hoverColor,
  onClick,
  tooltipText,
  textColor,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          className={cn(
            "flex items-center overflow-hidden  bg-appRed/30  rounded-full px-0 py-0 w-auto h-auto hover:text-white",
            isOn && "bg-appGreen/30"
          )}
        >
          {isOn ? (
            <div
              className={cn(
                `p-1 text-black hover:text-white`,
                bgColor && bgColor,
                hoverColor && hoverColor,
                textColor && textColor
              )}
            >
              {isLoading ? (
                <RotatingLines
                  width={"20"}
                  animationDuration="5"
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
                `p-1 text-black hover:text-white`,
                bgColor && bgColor,
                hoverColor && hoverColor,
                textColor && textColor
              )}
            >
              {isLoading ? (
                <RotatingLines
                  width={"20"}
                  animationDuration="5"

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

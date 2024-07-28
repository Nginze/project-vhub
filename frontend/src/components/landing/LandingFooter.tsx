import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { BsGithub, BsDiscord, BsTwitterX } from "react-icons/bs";

type LandingFooterProps = {};

export const LandingFooter: React.FC<LandingFooterProps> = () => {
  return (
    <div className="w-full flex items-center opacity-40  absolute bottom-5 px-40">
      <span className="w-[200px] text-[12px]">All rights reserved ™</span>
      <div className="flex flex-row  gap-6  w-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="icon-button">
              <span>
                <BsGithub size={16} />
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent>Github</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="icon-button">
              <span>
                <BsDiscord size={16} />
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent>Discord</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="icon-button">
              <span>
                <BsTwitterX size={16} />
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent>X</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

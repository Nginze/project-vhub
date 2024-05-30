import React from "react";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { CircleCheckBig } from "lucide-react";
import { Button } from "../ui/button";

type HomeCharacterCustomizerProps = {};

export const HomeCharacterCustomizer: React.FC<
  HomeCharacterCustomizerProps
> = () => {
  return (
    <>
      <div className="flex h-[600px] items-center flex-col">
        <div className="w-full h-1/3"></div>
        <div className="w-full flex-grow"></div>
      </div>
      <DialogFooter className="flex">
        <Button className="bg-appGreen gap-2 flex items-center px-4 py-6 rounded-lg w-full">
          <CircleCheckBig size={15} />
          Finish
        </Button>
      </DialogFooter>
    </>
  );
};

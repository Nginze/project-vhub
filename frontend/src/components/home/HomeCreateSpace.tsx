import React from "react";
import { Toggle } from "../ui/toggle";
import { Button } from "../ui/button";
import { CircleCheckBig, ShieldCheck } from "lucide-react";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const CreateSpaceForm: React.FC = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="w-full flex flex-col gap-6">
        <div className="flex items-end gap-7">
          <div className="flex flex-col items-start w-3/5 gap-4">
            <span className="text-[18px]">Create a new space</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div>
          <Input
            className="w-full bg-transparent py-6 border-appPrimary outline-none text-white"
            placeholder="Enter your email address"
          />
        </div>
        <div className="w-full">
          <Select>
            <SelectTrigger className=" bg-deep py-6  hover:bg-deep border-none ring-0 outline-none focus:outline-non9e focus:ring-0">
              <SelectValue
                placeholder={
                  <span className="flex items-center gap-2">
                    <span className="text-[16px] opacity-70">
                      Anyone with url can enter space{" "}
                    </span>
                  </span>
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                Anyone with url can enter space{" "}
              </SelectItem>
              <SelectItem value="private">Anyone with passcode</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full flex justify-between items-center">
        <Button className="bg-dark/80 gap-2 flex items-center px-4 py-6 rounded-lg">
          Back
        </Button>
        <Button className="bg-appGreen gap-2 flex items-center px-4 py-6 rounded-lg">
          <CircleCheckBig size={15} />
          Confirm Selection
        </Button>
      </div>
    </div>
  );
};

export const CreateSpaceSelectTypeForm: React.FC = () => {
  return <div></div>;
};

export const CreateSpaceOnboardForm: React.FC = () => {
  return <div></div>;
};

export const CreateSpaceSelectMapTemplateForm: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-end gap-7">
        <div className="flex flex-col items-start w-3/5 gap-4">
          <span className="text-[24px]">Choose your space template</span>
          <span className="text-[14px] opacity-45">
            Select the size and theme of your office. You can change this later!
          </span>
          <div className="flex-grow min-h-72 h-72 w-full bg-dark rounded-2xl cursor-pointer overflow-hidden">
            <img
              src="https://www.freeformgames.com/blog/wp-content/uploads/2021/01/FdF-gathertown.jpg"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="w-2/5">
          <span className="text-[18px]">Map Theme</span>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Button className="flex flex-col items-center py-10 w-full flex-grow bg-dark/80 rounded-2xl">
              <span>🚀</span>
              <span>Startup</span>
            </Button>
            <Button className="flex flex-col items-center py-10 w-full flex-grow bg-dark/80 rounded-2xl">
              <span>🌳</span>
              <span>Outdoors</span>
            </Button>
            <Button className="flex flex-col items-center py-10 w-full flex-grow bg-dark/80 rounded-2xl">
              <span>🏢</span>
              <span>Sleek</span>
            </Button>
            <Button className="flex flex-col items-center py-10 w-full flex-grow bg-dark/80 rounded-2xl">
              <span>😊</span>
              <span>Cozy</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between items-center">
        <Button className="bg-dark/80 gap-2 flex items-center px-4 py-6 rounded-lg">
          Back
        </Button>
        <Button className="bg-appGreen gap-2 flex items-center px-4 py-6 rounded-lg">
          <CircleCheckBig size={15} />
          Confirm Selection
        </Button>
      </div>
    </div>
  );
};

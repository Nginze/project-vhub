import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Earth, ShieldCheck } from "lucide-react";

type HomeOptionsBarProps = {};

export const HomeOptionsBar: React.FC<HomeOptionsBarProps> = () => {
  return (
    <div className="w-full flex justify-end">
      <Select>
        <SelectTrigger className="w-[150px] bg-deep hover:bg-deep border-none ring-0 outline-none focus:outline-non9e focus:ring-0">
          <SelectValue
            placeholder={
              <span className="flex items-center gap-2">
                <span>
                  <ShieldCheck size={19} className="opacity-70" />
                </span>
                <span className="text-[16px] font-semibold opacity-70">
                  Public
                </span>
              </span>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="public">
            Public
          </SelectItem>
          <SelectItem value="private">Private</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

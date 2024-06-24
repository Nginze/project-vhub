import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Earth, Search, ShieldCheck } from "lucide-react";
import { Input } from "../ui/input";

type HomeOptionsBarProps = {};

export const HomeOptionsBar: React.FC<HomeOptionsBarProps> = () => {
  return (
    <div>
      <div className="w-full flex items-center gap-6 justify-end">
        <Select>
          <SelectTrigger className="w-[120px] px-5 py-6 rounded-xl bg-void hover:bg-deep border-none ring-0 outline-none focus:outline-none focus:ring-0">
            <SelectValue
              placeholder={
                <span className="flex items-center gap-2">
                  <span className="text-[16px] font-semibold opacity-70">
                    Public
                  </span>
                </span>
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="public"
              className="text-[16px] font-semibold opacity-70"
            >
              <span className="flex items-center gap-2">
                <span className="text-[16px] font-semibold opacity-70">
                  Public
                </span>
              </span>
            </SelectItem>
            <SelectItem
              value="private"
              className="text-[16px] font-semibold opacity-70"
            >
              <span className="flex items-center gap-2">
                <span className="text-[16px] font-semibold opacity-70">
                  Private
                </span>
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} />
          </div>
          <Input
            className="w-full bg-transparent py-6 text-[14px] border-veryLight bg-deep rounded-xl placeholder:text-white placeholder:text-[16px] placeholder:opacity-60 outline-none text-white pl-10 pr-3"
            placeholder="Filter spaces"
          />
        </div>
      </div>
    </div>
  );
};

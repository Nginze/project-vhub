import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Earth, Lock, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Input } from "../ui/input";
import { GiPadlock } from "react-icons/gi";

type HomeOptionsBarProps = {
  filterQuery: string;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  setFilterQuery: (query: string) => void;
};

export const HomeOptionsBar: React.FC<HomeOptionsBarProps> = ({
  filterQuery,
  activeFilter,
  setActiveFilter,
  setFilterQuery,
}) => {
  return (
    <div>
      <div className="w-full flex items-center gap-6 justify-end">
        <Select onValueChange={(v) => setActiveFilter(v)}>
          <SelectTrigger className="w-[150px] px-5 py-6 rounded-xl bg-void hover:bg-deep border-none ring-0 outline-none focus:outline-none focus:ring-0">
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
              className="text-[16px] font-semibold opacity-70 px-6"
            >
              <span className="flex items-center justify-start gap-2">
                <span>
                  <ShieldCheck size={18} />
                </span>
                <span className="text-[16px] font-semibold opacity-70">
                  Public
                </span>
              </span>
            </SelectItem>
            <SelectItem
              value="private"
              className="text-[16px] font-semibold opacity-70 px-6"
            >
              <span className="flex items-center justify-center gap-2">
                <span>
                  <Lock size={18} />
                </span>
                <span className="text-[16px] font-semibold opacity-70">
                  Private
                </span>
              </span>
            </SelectItem>
            <SelectItem
              value="favourite"
              className="text-[16px] font-semibold opacity-70 px-6"
            >
              <span className="flex items-center justify-center gap-2">
                <span>
                  <Sparkles size={18} />
                </span>
                <span className="text-[16px] font-semibold opacity-70">
                  Favorite
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
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-transparent py-6 text-[14px] border-veryLight bg-deep rounded-xl placeholder:text-white placeholder:text-[16px] placeholder:opacity-60 outline-none text-white pl-10 pr-3"
            placeholder="Filter spaces"
          />
        </div>
      </div>
    </div>
  );
};

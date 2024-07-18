import { keyMap, useKeyBindStore } from "@/global-store/KeyBindStore";
import React from "react";
import { SheetHeader } from "../ui/sheet";
import { Command, X } from "lucide-react";

type HomeKeyboardShortcutsProps = {};

export const HomeKeyboardShortcuts: React.FC<
  HomeKeyboardShortcutsProps
> = () => {
  return (
    <>
      <SheetHeader className="flex flex-row w-full items-center space-y-0 px-6 pt-5 mb-0 justify-between">
        <span className="flex items-center gap-2 text-xl w-full font-semibold opacity-80">
          Shortcuts
          <Command size={20} className="text-appYellow" />
        </span>
      </SheetHeader>
      <div className="flex h-[570px] px-5 font-sans scrollable overflow-auto flex-col mb-5">
        {Object.entries(keyMap).map(([command, key]) => (
          <div key={command} className="flex justify-between p-2">
            <span className="opacity-70">
              {command
                .split(" ")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}
            </span>
            <span className="key cursor-pointer border border-light bg-ultra">
              {Array.isArray(key) ? `${key[0]} ~ ${key[key.length - 1]}` : key}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

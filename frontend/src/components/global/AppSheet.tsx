import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";

type AppSheetProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  title?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const AppSheet: React.FC<AppSheetProps> = ({
  children,
  content,
  title,
  defaultOpen,
  open,
  onOpenChange,
}) => {
  return (
    <>
      <Sheet defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        <SheetTrigger>{children}</SheetTrigger>
        <SheetContent className="bg-[#202225] text-white">
          {content}
        </SheetContent>
      </Sheet>
    </>
  );
};

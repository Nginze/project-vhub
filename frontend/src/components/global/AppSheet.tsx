import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import { cn } from "@/lib/utils";

type AppSheetProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  title?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

export const AppSheet: React.FC<AppSheetProps> = ({
  children,
  content,
  title,
  defaultOpen,
  open,
  className,
  onOpenChange,
}) => {
  return (
    <>
      <Sheet defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        <SheetTrigger>{children}</SheetTrigger>
        <SheetContent className={cn("bg-[#1e2124] text-white", className)}>
          {content}
        </SheetContent>
      </Sheet>
    </>
  );
};
